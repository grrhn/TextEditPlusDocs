# TextEdit+ SDK Documentation

VitePress site for [TextEdit+](https://play.google.com/store/apps/details?id=com.krk.texteditplus) extension authors.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
```

Output goes to `.vitepress/dist/`.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Settings → Pages → Source: GitHub Actions.
3. Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy docs
on:
  push: { branches: [main] }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: .vitepress/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

If hosting under `<user>.github.io/<repo>/`, edit `.vitepress/config.mjs` and change `base` to `'/<repo>/'`.

## Deploying to Vercel

`vercel --prod` from the repo root — VitePress is auto-detected.

## Structure

```
extension-docs/
├── index.md                ← landing page
├── getting-started.md
├── anatomy.md
├── catalog-submission.md
├── api/                    ← 8 API reference pages
│   ├── themes.md
│   ├── languages.md
│   ├── dialog.md
│   ├── commands.md
│   ├── settings.md
│   ├── sidebar.md
│   ├── fs.md
│   └── lifecycle.md
└── .vitepress/config.mjs
```
