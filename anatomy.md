# Extension Anatomy

## File structure

A TextEdit+ extension is a ZIP file containing at minimum a manifest and a main script:

```
my-extension/
├── manifest.json     ← required, at ZIP root
├── main.js           ← required (or whatever `main` in manifest points to)
├── data/             ← optional, any auxiliary files
│   └── words.txt
└── README.md         ← optional
```

ZIPs are capped at 5 MB per entry. Anything larger is rejected on install.

## Manifest fields

| Field         | Type    | Required | Notes |
|---------------|---------|----------|-------|
| `id`          | string  | yes      | Matches `^[a-zA-Z0-9_-]+$`. Used as the permanent identifier in storage paths and the catalog. |
| `name`        | string  | no       | Human label. Falls back to `id`. |
| `version`     | string  | no       | Recommend semver. Used by the Browse tab to flag available updates. |
| `description` | string  | no       | Short blurb shown in the store. |
| `author`      | string  | no       | Free text. |
| `main`        | string  | no       | Entry script path. Defaults to `main.js`. |
| `data`        | array   | no       | Filenames the runtime should pre-load and pass to your code as `data`. |
| `premium`     | boolean | no       | If `true`, only Premium users can install/enable this extension. |

## Runtime globals

When `main.js` runs, your code receives these arguments via `new Function`:

```js
function(TextEditPlus, monaco, editor, data, extensionId, Android) { /* your code */ }
```

| Global         | What it is |
|----------------|-----------|
| `TextEditPlus` | The SDK surface — `.themes`, `.languages`, `.commands`, `.settings`, `.sidebar`, `.fs`, `.toast`, `.dialog`, `.setPluginInit`, `monaco`, `editor`. |
| `monaco`       | The full Monaco editor namespace. Same one VS Code uses. |
| `editor`       | The active editor instance. `editor.getValue()`, `editor.getSelection()`, etc. |
| `data`         | Parsed object of any files listed in manifest's `data` array. |
| `extensionId`  | Your manifest's `id`. **Always pass this to API calls that take an `extId`.** |
| `Android`      | Intentionally `undefined` while your code runs — the native bridge is reachable only through the public `TextEditPlus.*` API. |

## Sandbox & isolation

- **Window.Android is undefined** during extension execution. Extensions cannot reach the native bridge directly; only through `TextEditPlus.*` methods that are sanctioned.
- **Per-extension storage.** Settings live in `ext_<id>` SharedPreferences; FS lives in `extension_data/<id>/`. One extension cannot read another's data.
- **Path traversal protected.** FS paths are canonicalized and verified to stay inside the extension's data root.
- **Zip Slip protected.** Install rejects ZIP entries that resolve outside the target directory.

## Lifecycle

| Event              | What runs |
|--------------------|-----------|
| User installs ZIP  | Manifest validated, contents extracted, your `main.js` is loaded immediately. |
| Editor reload      | All enabled extensions are loaded fresh, in install order. |
| User disables ext  | `setPluginInit`'s destroy callback fires; all registered providers, themes, languages, commands, panels, settings, and listeners are auto-disposed. |
| User uninstalls    | Disable cleanup runs, then settings and FS storage for that extension are wiped. |

See [Lifecycle](/api/lifecycle) for the `setPluginInit` hook.

## Cleanup model

You only need to manage **side effects you create yourself outside the SDK** — timers, fetches, ad-hoc DOM, custom WebSockets. Everything you registered through `TextEditPlus.*` is tracked and disposed automatically.

```js
TextEditPlus.setPluginInit(extensionId,
  function init()   { this.timer = setInterval(tick, 1000); },
  function destroy() { clearInterval(this.timer); }
);
```
