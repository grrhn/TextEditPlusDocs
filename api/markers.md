# Markers (Diagnostics) API

Push error, warning, info, and hint squiggles onto open Monaco editor models. TextEdit+ aggregates markers from all extensions alongside Monaco's built-in TypeScript/JSON/CSS/HTML diagnostics into the **Problems** panel and the AI agent's `get_diagnostics` tool.

## `TextEditPlus.markers.set(extId, model, markers)`

Attach an array of diagnostic markers to a Monaco `ITextModel` under your extension's isolated owner namespace (`ext:<extId>`).

```js
function validate(model) {
  if (!model) return;
  const lines = model.getValue().split('\n');
  const markers = [];

  lines.forEach((line, idx) => {
    const col = line.indexOf('TODO');
    if (col !== -1) {
      markers.push({
        startLineNumber: idx + 1,
        startColumn: col + 1,
        endLineNumber: idx + 1,
        endColumn: col + 5,
        message: 'Unresolved TODO comment',
        severity: 2 // 1=Hint, 2=Info, 4=Warning, 8=Error
      });
    }
  });

  TextEditPlus.markers.set(extensionId, model, markers);
}

const sub = editor.onDidChangeModelContent(() => validate(editor.getModel()));
validate(editor.getModel());
```

### Marker properties

| Field | Type | Default | Notes |
|---|---|---|---|
| `startLineNumber` | number | `1` | 1-based start line |
| `startColumn` | number | `1` | 1-based start column |
| `endLineNumber` | number | `startLineNumber` | 1-based end line |
| `endColumn` | number | `startColumn + 1` | 1-based end column |
| `message` | string | `""` | Shown on hover and in Problems panel |
| `severity` | number | `8` | Monaco `MarkerSeverity`: `1` (Hint), `2` (Info), `4` (Warning), `8` (Error) |

Passing an empty array `[]` clears your extension's markers on that model.

## `TextEditPlus.markers.clear(extId, model?)`

Clear markers owned by your extension.

```js
// Clear markers on the active model
TextEditPlus.markers.clear(extensionId, editor.getModel());

// Or omit `model` to clear across all open models
TextEditPlus.markers.clear(extensionId);
```

## Cleanup & isolation

- Markers are namespaced by `ext:<extId>` + `model.uri`, so multiple extensions can annotate the same file without overwriting each other.
- When your extension is disabled or uninstalled, TextEdit+ automatically clears all markers owned by `ext:<extId>` across every model.
- If you attach `editor.onDidChangeModelContent(...)` or `editor.onDidChangeModel(...)`, dispose those listeners in [`TextEditPlus.setPluginInit`](/api/lifecycle).
