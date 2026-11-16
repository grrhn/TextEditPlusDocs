# AI Extensions API (`TextEditPlus.ai`)

Extend TextEdit+'s built-in AI coding agent with custom tools, `@` context providers, `/` slash commands, and direct LLM prompts.

## Manifest permissions

`TextEditPlus.ai.*` methods are **permission-gated**. Declare the permissions your extension uses in `manifest.json` so users can review them in the install trust dialog:

```json
{
  "id": "my-ai-extension",
  "name": "My AI Extension",
  "version": "1.0.0",
  "main": "main.js",
  "permissions": ["ai.tools", "ai.context", "ai.prompt", "ai.ui"]
}
```

| Permission | Grants access to |
|---|---|
| `ai.tools` | `ai.registerTool(...)` and `ai.registerSlashCommand(...)` |
| `ai.context` | `ai.registerContext(...)` |
| `ai.prompt` | `ai.ask(...)`, `ai.registerSlashCommand(...)`, `ai.openChat(...)` |
| `ai.ui` | `ai.openChat(...)` |

## `TextEditPlus.ai.registerTool(opts, extId)`

Register a custom tool callable by Gemini, Claude, OpenAI, and OpenRouter models during agent turns. The runtime exposes your tool as `ext_<extId>_<name>`.

```js
TextEditPlus.ai.registerTool({
  name: 'word_stats',
  description: 'Count words and lines in the supplied text snippet.',
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Text to analyze' }
    },
    required: ['text']
  },
  execute: async function(args) {
    const t = String(args.text || '');
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    return JSON.stringify({ words, lines: t.split('\n').length });
  }
}, extensionId);
```

- Requires `"ai.tools"` in `manifest.json`.
- `execute(args)` may be synchronous or return a `Promise`. Return a string (or JSON-serializable object).
- Returns a disposable `{ dispose() }`; all registered tools are also auto-cleaned when the extension unloads.

## `TextEditPlus.ai.registerContext(opts, extId)`

Register a custom `@` mention provider in the AI composer autocomplete (`@<id>`).

```js
TextEditPlus.ai.registerContext({
  id: 'selection_meta',
  label: 'Selection Metadata',
  description: 'Include active language and selection character count',
  provide: function(summary) {
    return `Language: ${summary.language}, Lines: ${summary.lineCount}, Selected chars: ${summary.selectionLength}`;
  }
}, extensionId);
```

- Requires `"ai.context"` in `manifest.json`.
- `provide(summary)` receives `{ language, lineCount, selectionLength, selectionPreview }` from `getActiveContextSummary()`.

## `TextEditPlus.ai.registerSlashCommand(opts, extId)`

Register a custom `/command` in the AI chat composer and quick-prompt chip strip.

```js
TextEditPlus.ai.registerSlashCommand({
  name: 'summarize',
  description: 'Summarize the active selection with AI',
  execute: function(args, payload) {
    return 'Summarize the following selection cleanly.';
  }
}, extensionId);
```

- Requires `"ai.tools"` or `"ai.prompt"` in `manifest.json`.

## `TextEditPlus.ai.ask(prompt, opts, extId)`

Send a prompt to the user's configured active AI provider and receive a `Promise<string>` response.

```js
const answer = await TextEditPlus.ai.ask(
  'Explain what this regex does: ^[a-z0-9_-]+$',
  { systemPrompt: 'Answer in two concise bullet points.' },
  extensionId
);
await TextEditPlus.dialog.alert(answer, 'Regex Explanation');
```

- Requires `"ai.prompt"` in `manifest.json`.

## `TextEditPlus.ai.openChat(prefillPrompt, extId)`

Open the AI Mission Control panel and prefill the composer input.

```js
TextEditPlus.ai.openChat('Review this function for edge cases:', extensionId);
```

- Requires `"ai.ui"` or `"ai.prompt"` in `manifest.json`.

## `TextEditPlus.ai.getActiveContextSummary()`

Synchronously returns a lightweight summary of the active editor buffer:

```js
const ctx = TextEditPlus.ai.getActiveContextSummary();
// { language, lineCount, selectionLength, selectionPreview }
```
