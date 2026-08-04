# Settings API

Declare a typed schema; TextEdit+ renders a tip-appropriate widget for each field in the main Settings dialog under an **EXTENSIONS** section.

## Widget mapping

| Schema type           | Widget                            |
|-----------------------|-----------------------------------|
| `int` + `min`/`max`   | Slider with numeric readout       |
| `int`                 | Numeric `OutlinedTextField`       |
| `boolean`             | Switch                            |
| `enum` + `options`    | Dropdown                          |
| `string`              | `OutlinedTextField`               |
| `string` + `secret`   | Password-style `OutlinedTextField`|

## `TextEditPlus.settings.define(opts, extId)`

Declare your schema. Call this once at extension load. Values previously stored for the same `extId` are hydrated into the JS cache automatically.

```js
TextEditPlus.settings.define({
  schema: [
    {
      key: 'apiKey',
      type: 'string',
      label: 'API Key',
      secret: true
    },
    {
      key: 'model',
      type: 'enum',
      label: 'Model',
      options: [
        { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
        { value: 'gpt-4o',      label: 'GPT-4o' }
      ],
      default: 'gpt-4o-mini'
    },
    {
      key: 'maxTokens',
      type: 'int',
      label: 'Max tokens',
      default: 2000,
      min: 100,
      max: 8000
    },
    {
      key: 'streamResponses',
      type: 'boolean',
      label: 'Stream responses',
      default: true
    }
  ]
}, extensionId);
```

Schema is capped at 64 KB.

## `TextEditPlus.settings.get(extId, key)`

Read the current value. Typed return: `boolean`, `number`, or `string` depending on the schema.

```js
const model = TextEditPlus.settings.get(extensionId, 'model');
```

## `TextEditPlus.settings.set(extId, key, value)`

Programmatically write a value. Persists immediately; fires registered `onChange` callbacks.

```js
TextEditPlus.settings.set(extensionId, 'model', 'gpt-4o');
```

## `TextEditPlus.settings.onChange(extId, callback)`

Subscribe to changes. Called for both user-driven changes (via the Settings UI) and programmatic `set()` calls.

```js
TextEditPlus.settings.onChange(extensionId, function(key, newValue) {
  if (key === 'apiKey') reinitClient(newValue);
});
```

## Why `extId` is passed explicitly every time

So the API stays correct across async callbacks. If `extId` were captured implicitly via "the currently executing extension", asynchronous code (`setTimeout`, `await`, panel button clicks) would attribute the call to the wrong extension. Explicit beats clever.

## Storage & isolation

- Each extension's values are persisted to `SharedPreferences("ext_<id>")`.
- One extension cannot read another's settings — every call uses the caller's own `extId` as the prefs filename.
- Values are JSON-encoded so types survive a round-trip (boolean stays boolean, int stays int).
- Uninstalling the extension wipes its prefs file.

## Secrets

Setting `secret: true` makes the rendered TextField use `PasswordVisualTransformation` so the value is masked. **The value is not encrypted at rest** — it's stored in a per-app private SharedPreferences file, which is reachable by root or backup tools. Don't put secrets you cannot afford to leak.
