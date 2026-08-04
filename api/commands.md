# Commands API

Register named, executable actions. Commands appear in **Monaco's built-in F1 palette** AND in the **native command palette** (toolbar overflow → Command Palette).

## `TextEditPlus.commands.register(opts, extId)`

```js
TextEditPlus.commands.register({
  id:          'word-count.show',
  name:        'Word Count: Show stats',
  description: 'Display character / word / line counts',
  exec:        function() {
    const text = editor.getValue();
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    TextEditPlus.dialog.alert(`Words: ${words}`, 'Word Count');
  }
}, extensionId);
```

**Required fields**

| Field   | Type     | Notes |
|---------|----------|-------|
| `id`    | string   | Globally unique. Use a `<extension>.<verb>` pattern. |
| `name`  | string   | Human label shown in palettes. |
| `exec`  | function | Sync function. Throws are caught and logged — they don't crash the editor. |

**Optional fields**

| Field         | Type    | Notes |
|---------------|---------|-------|
| `description` | string  | Subtitle in the native palette. |
| `keybinding`  | number  | Monaco keybinding chord, e.g. `monaco.KeyMod.CtrlCmd \| monaco.KeyCode.KeyW`. |

## `TextEditPlus.commands.execute(id)`

Run any registered command. Useful for cross-extension hooks (e.g., a sidebar button that triggers another extension's command).

```js
TextEditPlus.commands.execute('word-count.show');
```

## `TextEditPlus.commands.list()`

```js
TextEditPlus.commands.list();
// [{ id, name, description, extId }, ...]
```

## Using `data-action` from a sidebar panel

The Sidebar panel WebView gets a `Host.executeCommand(id)` bridge. Any element with a `data-action` attribute auto-fires that command on click — your panel HTML stays inline-onclick-free:

```html
<button data-action="word-count.show">Show stats</button>
```

See [Sidebar API](/api/sidebar).

## Cleanup

Auto-disposed on extension teardown. The native palette refreshes; F1's palette entry is unregistered via Monaco's disposable.
