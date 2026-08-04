# Submit to the Catalog

The TextEdit+ in-app **Browse** tab is fed by a single `catalog.json` hosted in a public GitHub repo: [`TextEditPlusExtensions`](https://github.com/grrhn/TextEditPlusExtensions).

To get your extension listed, open a pull request that adds it to that repo.

## Step 1 — Test locally

Make sure your extension installs cleanly from the manual ZIP picker in the app:

1. Extensions → + → pick your ZIP.
2. Confirm the trust dialog.
3. Verify your themes/commands/panels appear as expected.

If anything misbehaves, fix it before publishing.

## Step 2 — Fork & clone the catalog repo

```bash
git clone https://github.com/<your-username>/TextEditPlusExtensions.git
cd TextEditPlusExtensions
```

## Step 3 — Drop your extension into the layout

Each extension lives in its own folder under `extensions/`:

```
extensions/
└── <your-id>/
    ├── extension.zip       ← REQUIRED
    ├── icon.png            ← optional, square, ≥128×128
    └── README.md           ← optional
```

`<your-id>` must match your manifest's `id` and match `^[a-zA-Z0-9_-]+$`.

## Step 4 — Rebuild the catalog

The build script scans `extensions/*/extension.zip`, computes SHA-256 for each, and rewrites `catalog.json` in sorted order.

```bash
node scripts/build-catalog.js
```

Commit both the new files and the regenerated `catalog.json`.

## Step 5 — Open a pull request

Title: `Add <Your Extension Name>`

Body should include:

- One-paragraph description.
- A screenshot if your extension has a UI (sidebar panel, theme preview).
- Confirmation that you tested install/uninstall/reload locally.

Maintainers review for:

- ID uniqueness (no collisions with existing entries).
- Manifest correctness.
- A quick sanity audit of `main.js` for obvious malicious behaviour (`fetch` to non-obvious endpoints, eval with user data, etc.).
- Reasonable size (under 5 MB / entry).

## Updating your extension

Bump `version` in your manifest, rebuild the ZIP, run `build-catalog.js`, open a PR. The in-app Browse tab detects the version change and shows an **Update** button for users who already installed.

## What you cannot do (yet)

- **Sell paid extensions through the catalog.** The in-app store renders the `premium` flag honoured by your manifest, but third-party paid extensions aren't enabled yet — for now, premium-only entries are reserved for the app's first-party catalog. See the roadmap on GitHub for when this is planned.
- **Use private repositories or unlisted endpoints.** The catalog is fully public to keep the integrity story simple (SHA-256 verification against the published JSON).
