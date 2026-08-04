# Languages API

Register new language IDs, attach syntax highlighters, and configure bracket / auto-close behavior.

## `TextEditPlus.languages.register(langDef, extId)`

Register a language. Idempotent — registering the same id twice is harmless.

```js
TextEditPlus.languages.register({
  id:         'toml',
  extensions: ['.toml', '.tml'],
  aliases:    ['TOML', 'toml'],
  mimetypes:  ['application/toml']
}, extensionId);
```

After registering, the editor shows the language in the language picker and uses your tokenizer / configuration when a matching file is opened.

## `TextEditPlus.languages.setMonarchTokensProvider(id, tokensProvider, extId)`

Attach a syntax highlighter using [Monaco's Monarch DSL](https://microsoft.github.io/monaco-editor/monarch.html).

```js
TextEditPlus.languages.setMonarchTokensProvider('toml', {
  tokenizer: {
    root: [
      [/#.*$/,                             'comment'],
      [/\[\[[^\]]+\]\]/,                   'metatag'],
      [/\[[^\]]+\]/,                       'tag'],
      [/[A-Za-z_][A-Za-z0-9_.-]*(?=\s*=)/, 'key'],
      [/=/,                                 'operator'],
      [/"([^"\\]|\\.)*"/,                  'string'],
      [/\b(true|false)\b/,                 'keyword'],
      [/-?\d+\.\d+/,                       'number.float'],
      [/-?\d+/,                            'number'],
      [/[{}\[\],]/,                        'delimiter']
    ]
  }
}, extensionId);
```

Returns a disposable that's auto-tracked under your `extId`.

## `TextEditPlus.languages.setLanguageConfiguration(id, config, extId)`

Configure indent, brackets, auto-closing pairs, and comment markers.

```js
TextEditPlus.languages.setLanguageConfiguration('toml', {
  comments: { lineComment: '#' },
  brackets: [['[', ']'], ['{', '}']],
  autoClosingPairs: [
    { open: '[', close: ']' },
    { open: '{', close: '}' },
    { open: '"', close: '"' }
  ],
  surroundingPairs: [
    { open: '"', close: '"' }
  ]
}, extensionId);
```

## `TextEditPlus.languages.list()`

Returns every registered language, including the ones Monaco ships with.

```js
TextEditPlus.languages.list();
// [{ id:'plaintext', aliases:['Plain Text'], extensions:['.txt'] }, ...]
```

## Cleanup

Tokenizer and configuration disposables are auto-tracked. On unload they're disposed and the language falls back to plain text rendering. Monaco does not expose a public way to fully un-register a language id, so the id remains in `languages.list()` but is functionally inert.
