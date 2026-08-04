# Sidebar API

Add your own panel to the side rail. Content is HTML rendered in an isolated WebView; a tiny `Host` bridge lets the panel call commands and show toasts.

## `TextEditPlus.sidebar.register(opts, extId)`

```js
TextEditPlus.sidebar.register({
  id:    'word-count.panel',
  title: 'Word Counter',
  icon:  'WC',                  // 1–2 char badge; longer is truncated
  html:  '<h3>Stats</h3><p>0 words</p>'
}, extensionId);
```

| Field   | Type   | Notes |
|---------|--------|-------|
| `id`    | string | Globally unique. |
| `title` | string | Tiny label under the rail icon. |
| `icon`  | string | 1–2 char text badge. (Rendered as a rounded tinted box.) |
| `html`  | string | Initial content. Max 256 KB. |

The panel appears in the side rail after the built-in entries (Files, Search, Git, Repos, Plugins, Marks, SFTP), in registration order.

## `TextEditPlus.sidebar.update(id, html)`

Replace the panel content. The WebView reloads with the new HTML.

```js
TextEditPlus.sidebar.update('word-count.panel',
  '<h3>Stats</h3><p>' + count + ' words</p>'
);
```

Updates are debounced naturally by your code path — there's no rate limiting on the host side.

## `TextEditPlus.sidebar.list()`

```js
TextEditPlus.sidebar.list();
// [{ id, title, icon, extId }, ...]
```

## The `Host` bridge inside the panel

The panel page receives **only** these two methods:

| Method                                       | What it does |
|----------------------------------------------|--------------|
| `Host.executeCommand(commandId)`             | Run a registered command via the main editor. |
| `Host.toast(message, type, durationMs)`      | Show a native toast. |

It deliberately does NOT expose `TextEditPlus.*` to keep the attack surface small if the panel renders untrusted content.

## `data-action` shorthand

Every panel comes with a tiny bootstrap script that intercepts clicks on `[data-action]` elements and calls `Host.executeCommand` with the attribute value. So you can write:

```html
<button data-action="word-count.show">Show stats</button>
```

…without inline `onclick` handlers. Cleaner, and friendlier to any future CSP.

## Styling

The panel ships with a dark-mode-friendly default stylesheet. You can override anything by including your own `<style>` tag in the HTML.

## Cleanup

Panels are auto-removed when the extension is disabled or uninstalled. If the user has the panel selected when it's removed, they're sent back to the previously-active built-in panel.
