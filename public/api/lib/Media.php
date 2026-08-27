<?php

declare(strict_types=1);

/**
 * Image uploads.
 *
 * Every upload is validated by actually decoding it (getimagesize), not by
 * trusting the filename or the browser-supplied MIME type - a .php renamed to
 * .jpg fails here. Files are written with a generated name, never the one the
 * browser sent, so a hostile filename cannot traverse or overwrite anything.
 *
 * Large images are resized down on the way in. The site currently ships a
 * 7.7MB logo-white.png; this stops uploads repeating that.
 */
final class Media
{
    private const TYPES = [
        IMAGETYPE_JPEG => ['ext' => 'jpg', 'mime' => 'image/jpeg'],
        IMAGETYPE_PNG => ['ext' => 'png', 'mime' => 'image/png'],
        IMAGETYPE_WEBP => ['ext' => 'webp', 'mime' => 'image/webp'],
        IMAGETYPE_GIF => ['ext' => 'gif', 'mime' => 'image/gif'],
    ];

    public function __construct(private readonly Store $store)
    {
    }

    public function all(): array
    {
        return $this->store->readData('media', []) ?? [];
    }

    public function ensureUploadDir(): void
    {
        if (!is_dir(CISS_UPLOAD_DIR) && !@mkdir(CISS_UPLOAD_DIR, 0755, true) && !is_dir(CISS_UPLOAD_DIR)) {
            Response::error('Upload directory could not be created: ' . CISS_UPLOAD_DIR, 500);
        }
    }

    public function upload(array $file): array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            Response::error($this->uploadErrorMessage((int) ($file['error'] ?? UPLOAD_ERR_NO_FILE)), 422);
        }

        if (!is_uploaded_file($file['tmp_name'])) {
            Response::error('Upload rejected.', 422);
        }

        if ((int) $file['size'] > CISS_MAX_UPLOAD_BYTES) {
            Response::error(
                'Image is larger than ' . round(CISS_MAX_UPLOAD_BYTES / 1048576, 1) . 'MB. Re-export it smaller.',
                422
            );
        }

        $info = @getimagesize($file['tmp_name']);

        if ($info === false || !isset(self::TYPES[$info[2]])) {
            // SVG is not raster, so getimagesize cannot vouch for it. Rather
            // than allow an XML format that can carry script, refuse it.
            Response::error('That is not a supported image. Use JPG, PNG, WebP or GIF.', 422);
        }

        $this->ensureUploadDir();

        $type = self::TYPES[$info[2]];
        $width = (int) $info[0];
        $height = (int) $info[1];

        $basename = $this->safeName((string) ($file['name'] ?? 'image'));
        $filename = $basename . '-' . bin2hex(random_bytes(4)) . '.' . $type['ext'];
        $target = CISS_UPLOAD_DIR . '/' . $filename;

        $resized = $this->resizeIfNeeded($file['tmp_name'], $target, $info[2], $width, $height);

        if (!$resized) {
            if (!@move_uploaded_file($file['tmp_name'], $target)) {
                Response::error('Could not store the uploaded file.', 500);
            }
        }

        @chmod($target, 0644);

        $finalInfo = @getimagesize($target) ?: [$width, $height];

        $record = [
            'id' => 'md-' . bin2hex(random_bytes(6)),
            'filename' => $filename,
            'originalName' => (string) ($file['name'] ?? $filename),
            'url' => CISS_UPLOAD_URL . '/' . $filename,
            'mime' => $type['mime'],
            'width' => (int) $finalInfo[0],
            'height' => (int) $finalInfo[1],
            'bytes' => (int) (@filesize($target) ?: 0),
            'uploadedAt' => gmdate('c'),
        ];

        $media = $this->all();
        array_unshift($media, $record);
        $this->store->write('media', $media);

        return $record;
    }

    public function delete(string $id): void
    {
        $media = $this->all();
        $kept = [];
        $removed = null;

        foreach ($media as $item) {
            if (($item['id'] ?? '') === $id) {
                $removed = $item;
                continue;
            }

            $kept[] = $item;
        }

        if ($removed === null) {
            Response::error('No such image.', 404);
        }

        // Only ever unlink inside the upload directory, and only a plain
        // filename - never a path from the stored record.
        $filename = basename((string) ($removed['filename'] ?? ''));

        if ($filename !== '') {
            @unlink(CISS_UPLOAD_DIR . '/' . $filename);
        }

        $this->store->write('media', $kept);
    }

    private function resizeIfNeeded(string $source, string $target, int $imageType, int $width, int $height): bool
    {
        $longest = max($width, $height);

        if ($longest <= CISS_MAX_IMAGE_EDGE || !function_exists('imagecreatetruecolor')) {
            return false;
        }

        $scale = CISS_MAX_IMAGE_EDGE / $longest;
        $newWidth = max(1, (int) round($width * $scale));
        $newHeight = max(1, (int) round($height * $scale));

        $image = match ($imageType) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($source),
            IMAGETYPE_PNG => @imagecreatefrompng($source),
            IMAGETYPE_WEBP => @imagecreatefromwebp($source),
            IMAGETYPE_GIF => @imagecreatefromgif($source),
            default => false,
        };

        if ($image === false) {
            return false;
        }

        $canvas = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for the formats that have it - logos are PNG.
        if ($imageType === IMAGETYPE_PNG || $imageType === IMAGETYPE_GIF || $imageType === IMAGETYPE_WEBP) {
            imagealphablending($canvas, false);
            imagesavealpha($canvas, true);
            imagefill($canvas, 0, 0, imagecolorallocatealpha($canvas, 0, 0, 0, 127));
        }

        imagecopyresampled($canvas, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        $written = match ($imageType) {
            IMAGETYPE_JPEG => imagejpeg($canvas, $target, 82),
            IMAGETYPE_PNG => imagepng($canvas, $target, 6),
            IMAGETYPE_WEBP => imagewebp($canvas, $target, 82),
            IMAGETYPE_GIF => imagegif($canvas, $target),
            default => false,
        };

        imagedestroy($image);
        imagedestroy($canvas);

        return $written;
    }

    private function safeName(string $original): string
    {
        $base = pathinfo($original, PATHINFO_FILENAME);
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $base) ?? '');
        $slug = trim($slug, '-');

        return $slug === '' ? 'image' : substr($slug, 0, 48);
    }

    private function uploadErrorMessage(int $code): string
    {
        return match ($code) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'That file is larger than the server allows.',
            UPLOAD_ERR_PARTIAL => 'The upload was interrupted. Try again.',
            UPLOAD_ERR_NO_FILE => 'No file was sent.',
            UPLOAD_ERR_NO_TMP_DIR, UPLOAD_ERR_CANT_WRITE => 'The server could not write the file.',
            default => 'Upload failed.',
        };
    }
}
