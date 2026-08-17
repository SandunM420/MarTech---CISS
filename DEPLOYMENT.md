# Deployment

The CISS website (https://ciss.lk) deploys automatically. Pushing to `main`
builds the site and uploads it to Namecheap shared hosting over FTPS, taking a
backup of the current live site first.

You do not need to build or upload anything by hand.

---

## Quick reference

| | |
| --- | --- |
| Live site | https://ciss.lk |
| Repository | https://github.com/SandunM420/MarTech---CISS |
| Workflow | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |
| Trigger | push to `main`, or **Actions → Deploy CISS to Namecheap → Run workflow** |
| Runs at | https://github.com/SandunM420/MarTech---CISS/actions |
| Typical duration | 1–2 minutes |

**Server details**

| | |
| --- | --- |
| FTP host | `server312-2.web-hosting.com` (port 21, explicit FTPS) |
| FTP user | `sandun2@ciss.lk` |
| Password | GitHub repository secret `FTP_PASSWORD` |
| Remote path | `/` — the account is scoped to `/home/cisscq…/public_html` |

---

## Deploying a change

1. Commit your work and push to `main`.
2. Watch the run in the Actions tab.
3. When it's green, hard-refresh https://ciss.lk.

To redeploy without a code change (for example after restoring a backup), use
**Actions → Deploy CISS to Namecheap → Run workflow**.

### Verifying a deploy actually landed

A green tick means the upload succeeded, not that the new code is live. To be
certain, view source on https://ciss.lk and check the hashed filename in the
`<script>` tag matches the one your local `npm run build` produced. If they
differ, you are looking at a cached page — hard-refresh.

Also test a deep link directly, by typing https://ciss.lk/elevate into a fresh
tab rather than clicking through from the homepage. That exercises the SPA
rewrite described below, which normal in-app navigation does not.

---

## What the workflow does

1. Checks out the repo, installs Node 22, runs `npm ci`.
2. Runs `npm run build` → `dist/`.
3. **Backs up the live site**: mirrors the current contents of `public_html`
   down over FTPS and re-uploads them to a dated folder, `YYYYMMDD-vN-BKP`,
   inside `public_html` (`N` is the workflow run number).
4. **Deploys**: uploads `dist/` into `public_html`.

The backup step runs first and uses `set cmd:fail-exit yes`, so if it cannot
reach the server the whole job aborts *before* the deploy step. A failed backup
therefore leaves the live site untouched, which is the safe direction to fail in.

---

## Two things that are easy to get wrong

### The FTP hostname must be the server name, not `ftp.ciss.lk`

cPanel's "Manual Settings" panel tells you to connect to `ftp.ciss.lk`. That is
correct for FileZilla, but it **fails under FTPS with certificate verification
on**, which is what this workflow uses:

```
Certificate verification: certificate common name doesn't match
requested host name 'ftp.ciss.lk'
```

Namecheap serves a shared wildcard certificate for `*.web-hosting.com`, and
`ftp.ciss.lk` is not covered by it. The workflow connects to
`server312-2.web-hosting.com` instead, which the certificate does cover, so
verification passes without needing to be disabled.

If the site is ever migrated to a different Namecheap server, this hostname
changes and both references in `deploy.yml` must be updated. Find the new one
via **Namecheap → Hosting List → Manage → Server Name**, or by looking up the
PTR record of the IP that `ftp.ciss.lk` resolves to.

### `.htaccess` lives in `public/`, not `dist/`

The site is a single-page app using React Router, so Apache must serve
`index.html` for any path that is not a real file. Without that rule, visiting
https://ciss.lk/elevate directly, or refreshing on any page other than the
homepage, returns 404.

That rule lives in [`public/.htaccess`](public/.htaccess). Vite copies
everything in `public/` into `dist/` at build time, so it ships automatically.

**Never edit `.htaccess` directly on the server** — the next deploy overwrites
it. Edit `public/.htaccess` and push.

The same file also sets gzip compression, one-year immutable caching for the
fingerprinted files in `/assets`, and `no-cache` on `index.html`. That last one
matters: `index.html` carries the hashed asset filenames, so a cached copy would
send returning visitors to assets from a previous deploy.

---

## Backups

Each successful run leaves a full copy of the previous site in
`public_html/YYYYMMDD-vN-BKP/`. A `Require all denied` file is written into each
one, so Apache refuses to serve anything inside it — verified: those URLs return
403. The site's original `.htaccess` is preserved alongside as
`.htaccess.original`.

**Nothing prunes these.** One accumulates per deploy at roughly the size of the
site (~10 MB currently), so they will consume hosting quota over time. Delete
old ones periodically via cPanel File Manager, or ask for a retention step to be
added to the workflow.

### Restoring

1. cPanel → File Manager → `public_html`.
2. Open the `-BKP` folder you want.
3. Rename its `.htaccess.original` back to `.htaccess`.
4. Move its contents up into `public_html`, overwriting.

---

## Manual deploy (fallback)

Only needed if GitHub Actions is unavailable.

```bash
npm ci
npm run build
```

Upload the **contents** of `dist/` (not the folder itself) into `public_html`
via cPanel File Manager or FileZilla. The hidden `.htaccess` is inside `dist/`
and must go up with everything else — enable "show hidden files" in your client,
or it will silently be left behind and every deep link will 404.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Fails at *Back up current live website* with a certificate error | FTP hostname doesn't match the shared certificate | Use the `server…web-hosting.com` name, not `ftp.ciss.lk` |
| Fails with `530 Login incorrect` | `FTP_PASSWORD` secret missing, misnamed, or belongs to a different FTP account | Check **Settings → Secrets and variables → Actions**. It must be a *Repository* secret named exactly `FTP_PASSWORD`. A missing secret resolves to an empty string rather than erroring |
| Green run, but the site is unchanged | Uploaded outside the web root | Confirm `sandun2@ciss.lk` is still scoped to `public_html` in cPanel → FTP Accounts |
| Homepage works, `/elevate` 404s | `.htaccess` missing from the server | Confirm `public/.htaccess` exists and made it into `dist/` |
| Connection refused or timeout | Namecheap brute-force protection blocked the runner IP | Re-run the job; runners get a different IP each time |
| Site shows old content after a green run | Browser or Cloudflare cache | Hard-refresh; if it persists, purge the Cloudflare cache |

---

## Notes

- The site sits behind Cloudflare, which may cache responses independently of
  the `.htaccess` rules. Purge there if a deploy looks like it hasn't landed.
- `dist/` is gitignored. The build output is never committed; CI rebuilds it
  from source on every run.
- There is no catch-all route in the app, so an unknown path such as
  `/does-not-exist` returns HTTP 200 with an empty page (header and footer only)
  rather than a 404. Worth adding a proper not-found route at some point.
- `public/` currently contains several unused images, including a 7.5 MB
  `logo-white.png`, plus a 1.7 MB `favicon.svg`. They are uploaded on every
  deploy and count toward each backup.
