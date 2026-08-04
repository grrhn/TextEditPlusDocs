# Themes API

Contribute new color schemes that appear in **Settings → Editor Theme**. Themes use Monaco's theme format, identical to VS Code custom themes.

## `TextEditPlus.themes.define(name, themeData, extId, displayName)`

Register a theme. The native theme picker refreshes automatically and shows the new entry under your extension's name.

```js
TextEditPlus.themes.define('moonlight', {
  base: 'vs-dark',    // 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
  inherit: true,      // start from the base's token rules, override below
  rules: [
    { token: 'comment',  foreground: '5c6378', fontStyle: 'italic' },
    { token: 'keyword',  foreground: 'c099ff' },
    { token: 'string',   foreground: '9ece6a' },
    { token: 'number',   foreground: 'ff9e64' },
    { token: 'type',     foreground: '2ac3de' },
    { token: 'function', foreground: '7aa2f7' }
  ],
  colors: {
    'editor.background':              '#1a1b26',
    'editor.foreground':              '#c0caf5',
    'editor.lineHighlightBackground': '#24283b',
    'editorCursor.foreground':        '#c0caf5',
    'editor.selectionBackground':     '#283457',
    'editorLineNumber.foreground':    '#3b4261',
    'editorLineNumber.activeForeground': '#c0caf5'
  }
}, extensionId, 'Moonlight');
```

**Parameters**

| Name           | Type   | Notes |
|----------------|--------|-------|
| `name`         | string | Theme id. Must NOT clash with built-ins (`vs`, `vs-dark`, `hc-black`, `hc-light`). |
| `themeData`    | object | Monaco theme definition. Same shape as `monaco.editor.defineTheme`. |
| `extId`        | string | Your extension's id. Required for cleanup tracking. |
| `displayName`  | string | Human label shown in the theme picker. Falls back to `name`. |

## `TextEditPlus.themes.apply(name)`

Programmatically switch the active theme. Equivalent to the user selecting it from settings.

```js
TextEditPlus.themes.apply('moonlight');
```

## `TextEditPlus.themes.list()`

Returns the current registry of themes (built-ins + extension-contributed).

```js
TextEditPlus.themes.list();
// [{ name:'vs', displayName:'vs', source:'builtin' },
//  { name:'vs-dark', displayName:'vs-dark', source:'builtin' },
//  { name:'moonlight', displayName:'Moonlight', source:'your-extension-id' }]
```

## Premium gating

If your manifest sets `"premium": true`, the theme is hidden from free users. Free users who somehow land on it via `themes.apply` are routed to the upgrade dialog instead.

## Cleanup

You don't need to do anything. When the extension is disabled or uninstalled, its themes disappear from the picker. If the active theme belonged to the extension, the editor falls back to `vs-dark`.
