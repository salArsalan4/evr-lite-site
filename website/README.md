# evr lite — download site (public GitHub repo)

This folder is the **static landing page** source. It is meant to live in a **separate, public** GitHub repository (site + **Release binaries**), while the main Electron app can stay **private**.

**Why two repos:** GitHub Pages on a free account does not support Pages on a private repo the way we need. A tiny public repo gives you Pages + **public** release downloads for friends (no login).

---

## 1. Create the public repo

Example name: **`evr-lite-site`** → `https://github.com/salArsalan4/evr-lite-site`

- Visibility: **Public**
- Initialize with a README if you like (optional); you will add files below.

---

## 2. Copy these files into the **root** of the public repo

From this `website/` directory, copy (not the folder itself—**the files inside**):

| File | Purpose |
|------|---------|
| `index.html` | Landing page |
| `styles.css` | Styles |
| `config.js` | `owner/repo` for the **GitHub API** (see below) |
| `app.js` | Fetches `latest` release assets |
| `github-pages-workflow.yml` | Rename path → `.github/workflows/deploy-website.yml` |
| `README.md` | This file (optional on the public repo) |

**`config.js`:** set `window.__EVR_GITHUB_REPO__` to the **same public** `owner/repo` that will host **Releases** (e.g. `salArsalan4/evr-lite-site`). The download buttons use the GitHub API on that repo’s `latest` release.

---

## 3. Enable GitHub Pages (public repo)

1. **Settings → Pages → Build and deployment → Source:** **GitHub Actions**
2. Push `main` with the workflow in place. After the first successful run, open the Pages URL (e.g. `https://salArsalan4.github.io/evr-lite-site/`).

### Without Actions

Use **Settings → Pages → Branch `main`, folder `/docs`**, put the same static files under `docs/` instead of root.

---

## 4. Manual releases (installers on the **public** repo)

Build the app from your **private** app repository (`npm run build` / `electron-builder`). Then on the **public** repo:

**Releases → Draft a new release** → tag (e.g. `v0.1.0`) → attach files from **`dist/`** → Publish.

### Expected attachment names

`app.js` picks assets from **`latest`**:

| OS | Rule |
|----|------|
| Windows | Prefer `*setup.exe` (NSIS), else first `.exe` |
| macOS | First `.dmg` |
| Linux | First `.AppImage` |

These match the default `artifactName` values in the private app’s `package.json` (`evr-lite-${version}-setup.exe`, `evr-lite-${version}.dmg`, AppImage, etc.).

Friends open the Pages URL; buttons always track **`latest`** on the **public** repo.

---

## 5. Keeping the private app repo in sync

When you change the landing page in the private monorepo, **copy** the updated files from `website/` into the public repo again and push. (You can automate later with a small script or subtree; manual copy is fine for a small site.)

**Do not** enable GitHub Pages on the private app repo for this flow—the public repo is the only Pages target.

---

## API limits

Unauthenticated GitHub API requests are rate-limited per IP (~60/hour). Normal visitors are fine.
