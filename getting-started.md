# Getting Started

This guide walks you through building, packaging, installing, and (optionally) publishing your first extension. We'll create **Quote of the Day** — a tiny sidebar panel that picks a random quote on each editor reload.

## 1. Project layout

An extension is two required files in a folder:

```
quote-of-the-day/
├── manifest.json
└── main.js
```

That's it. No build step, no `node_modules`, no transpiler.

## 2. Write the manifest

```json
{
  "id":          "quote-of-the-day",
  "name":        "Quote of the Day",
  "version":     "1.0.0",
  "author":      "your-name",
  "description": "Shows a random programming quote in the sidebar.",
  "main":        "main.js"
}
```

The `id` must match `^[a-zA-Z0-9_-]+$`. It becomes the extension's permanent identifier — used in storage paths, the catalog, settings keys.

## 3. Write the code

```js
// main.js — runs when the extension is loaded.
// Globals available: TextEditPlus, monaco, editor, data, extensionId.

const QUOTES = [
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"Premature optimization is the root of all evil." — Knuth',
  '"There are only two hard things: cache invalidation and naming." — Karlton'
];

function pick() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function render() {
  TextEditPlus.sidebar.update('qotd.panel',
    '<blockquote style="font-style:italic">' + pick() + '</blockquote>' +
    '<button data-action="qotd.next">New quote</button>'
  );
}

TextEditPlus.commands.register({
  id:   'qotd.next',
  name: 'Quote of the Day: pick a new quote',
  exec: render
}, extensionId);

TextEditPlus.sidebar.register({
  id:    'qotd.panel',
  title: 'Quote',
  icon:  'Q',
  html:  ''
}, extensionId);

render();
```

The `extensionId` global is your manifest's `id`. Always pass it to API calls that take an `extId` — that's how the SDK enforces per-extension isolation.

## 4. Package

Zip the two files. **Important:** zip the files themselves, not the parent folder, so `manifest.json` is at the root of the ZIP:

::: code-group
```bash [macOS / Linux]
cd quote-of-the-day
zip ../quote-of-the-day.zip manifest.json main.js
```

```powershell [Windows]
cd quote-of-the-day
Compress-Archive -Path *.* -DestinationPath ..\quote-of-the-day.zip
```
:::

## 5. Install

Inside TextEdit+:

1. Tap the **Extensions** icon in the side rail.
2. Tap **+** in the top bar.
3. Pick the ZIP from your file manager.
4. Review the trust dialog and confirm.

The extension loads immediately. A new "Q" icon appears in the side rail; tap it to see the quote panel.

## 6. Iterate

While developing:

- After each change, repackage and reinstall (the install dialog auto-replaces existing extensions with the same `id`).
- `console.log` output is captured by Android's logcat. On a connected device:
  ```
  adb logcat -s chromium chromium:V WebView WebView:V
  ```
- Use `TextEditPlus.toast('debug: ' + value)` for visible debug output.

## 7. Publish

When you're ready to share with other TextEdit+ users:

→ [Submit your extension to the public catalog](/catalog-submission)
