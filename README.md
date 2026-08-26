# CISS website

Public website and content-management portal for the Colombo Institute of
Scientific Studies. The public app is React + TypeScript; a small PHP API
provides secure admin sessions, persistent content, image uploads, and contact
inquiries.

## Local development

Requirements: Node.js 22+, npm, and PHP 8.1+.

```bash
npm install
php -S 127.0.0.1:8787 -t public tools/php-dev-router.php
npm run dev
```

Vite runs at `http://127.0.0.1:5173` and proxies `/api` and `/uploads` to the
PHP server. The public site is at `/`; the admin sign-in is at `/admin/login`.

The repository's local PHP configuration stores development data in
`.ciss-data-dev`, which is ignored by Git. To create or replace a local admin
account, run:

```bash
php public/api/tools/init-admin.php --username=admin
```

Add `--force` only when you intentionally want to replace the existing local
account.

## Checks

```bash
npm run lint
npm run build
```

Deployment and production admin setup are documented in
[`DEPLOYMENT.md`](DEPLOYMENT.md).
