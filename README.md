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

## Implementation status

Last updated: 27 August 2026 on `feat/admin-portal`.

### Completed

- Added a protected admin portal with dashboard, course management, reusable
  text management, image management, site settings, inquiries, news management,
  and account/password screens.
- Replaced client-side admin credentials with PHP session authentication.
  Password hashes, content documents, and inquiries are stored outside the web
  root. Local data lives in the ignored `.ciss-data-dev` directory.
- Connected the public website to administrator-managed content while retaining
  the original site content as safe defaults when the API is unavailable.
- Loaded and connected the current course catalogue: certificates, advanced
  certificates, NVQ programmes, and diplomas.
- Added a reusable rich-text editor for course and news content. The API
  sanitizes saved HTML while preserving paragraphs, blank lines, lists,
  headings, emphasis, and safe links.
- Added a shared media library. News covers and all configurable website image
  slots can select an existing image or upload a new image directly; direct
  uploads are also added to the library.
- Added administrator-configurable Facebook, LinkedIn, Instagram, and TikTok
  links. A footer icon appears only when its URL has been provided.
- Added news CRUD, draft/published state, public visibility controls, cover
  images, rich article bodies, news archive pages, and individual article pages.
- Added the Latest News carousel immediately after the homepage hero. It appears
  only when at least one published, visible article exists and automatically
  advances every two seconds when multiple articles exist. Hovering or focusing
  the carousel pauses it.
- Added public news filtering by month and by an inclusive From/To date range,
  including result counts, reset controls, and a no-results state.
- Removed the homepage Research & Innovation section as requested.
- Updated the sitemap, SPA routes, local Vite proxy, API rewrite rules, and
  production deployment documentation.

### Important routes

| Route | Purpose |
| --- | --- |
| `/` | Public homepage and Latest News carousel |
| `/news` | News archive and date filters |
| `/news/:slug` | Full news article |
| `/admin/login` | Administrator sign-in |
| `/admin` | Admin dashboard |
| `/admin/courses` | Course catalogue CRUD |
| `/admin/news` | News CRUD and publishing controls |
| `/admin/images` | Shared media library and website image slots |
| `/admin/text` | Reusable website text |
| `/admin/settings` | Contact details and social links |
| `/admin/inquiries` | Contact-form inbox |
| `/admin/account` | Password and server-readiness management |

### Data and security notes

- Never commit `.ciss-data-dev`, `public/uploads`, or
  `public/api/config.local.php`; all are ignored by Git.
- Local administrator credentials may already exist in
  `.ciss-data-dev/admin.json`. Credentials are deliberately not written in this
  README. Use `init-admin.php` with `--force` if the local account must be
  replaced.
- Production needs its own private `ciss-data` directory and first admin account.
  Follow [`DEPLOYMENT.md`](DEPLOYMENT.md) before testing the deployed portal.
- The API sanitizes rich HTML on save, validates uploaded images, applies upload
  size/dimension limits, and requires an authenticated session for mutations.

### Known local-data note

The homepage hero can appear blank when `.ciss-data-dev/slots.json` contains a
`home.hero` override that points to a deleted upload. This is data rather than a
layout problem. In **Admin → Images**, reset **Home hero** with **Use original**
and save the image slots.

### Verification completed

The current implementation has passed:

```bash
npm run lint
npm run build
```

All PHP files under `public/api` have also passed `php -l` syntax checks. Before
merging, test the admin portal against a writable PHP data directory and confirm
image upload support is available on the production host.
