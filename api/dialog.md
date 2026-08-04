# Toast / Dialog API

Show transient toasts and ask the user a question via native AlertDialog / TextField.

## `TextEditPlus.toast(message, type, durationMs)`

Show a transient native toast.

```js
TextEditPlus.toast('Saved', 'success', 2000);
```

| Argument     | Type   | Default      | Notes |
|--------------|--------|--------------|-------|
| `message`    | string | required     | Coerced via `String()`. |
| `type`       | string | `'info'`     | `'info' \| 'success' \| 'warning' \| 'error'` — advisory; current implementation only varies duration. |
| `durationMs` | number | `2500`       | Clamped to [500, 8000]. |

Fire-and-forget — does not return a promise.

## `TextEditPlus.dialog.alert(message, title?)`

Show an OK-only dialog. Resolves when dismissed.

```js
await TextEditPlus.dialog.alert('Saved successfully.', 'Notes');
```

Always resolves with `undefined`; use the return only to await the close.

## `TextEditPlus.dialog.confirm(message, title?)`

Yes / No dialog. Resolves with a boolean.

```js
const ok = await TextEditPlus.dialog.confirm('Delete file?', 'Files');
if (ok) { /* user pressed OK */ }
```

| Outcome             | Resolves with |
|---------------------|---------------|
| User taps OK        | `true`        |
| User taps Cancel    | `false`       |
| Dismissed (back-press / outside tap) | `false` |

## `TextEditPlus.dialog.prompt(message, defaultValue?, title?)`

Text input dialog. Resolves with the entered string or `null` on cancel.

```js
const name = await TextEditPlus.dialog.prompt('Filename', 'untitled.txt', 'New file');
if (name !== null) saveAs(name);
```

| Outcome             | Resolves with |
|---------------------|---------------|
| User taps OK        | the entered string |
| User taps Cancel    | `null`        |
| Dismissed           | `null`        |

## Threading

All dialog methods are async because the user might take a while to respond. While a dialog is open, other extensions can still run code — there's no global lock.

## Limits

Only one extension dialog can be visible at a time. Subsequent dialog requests queue until the user closes the current one.
