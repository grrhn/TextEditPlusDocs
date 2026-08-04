# Lifecycle

Register an init function that runs at load, and a destroy function that runs when your extension is disabled, uninstalled, or the editor reloads.

## What's auto-cleaned

Everything you register through `TextEditPlus.*` is auto-tracked under your `extId` and disposed when your extension goes away:

- Monaco providers (`registerCompletionProvider`, `registerHoverProvider`, etc.)
- Themes you defined
- Languages you registered (tokenizer + config; the language id itself remains)
- Commands
- Sidebar panels
- Settings schemas + onChange listeners

## What you need to clean up yourself

Anything you create OUTSIDE the SDK:

- `setInterval` / `setTimeout` timers
- In-flight `fetch` / `XMLHttpRequest`
- `addEventListener` listeners on `window` or `document`
- Custom DOM you injected somewhere
- WebSocket connections

That's where `setPluginInit`'s destroy callback comes in.

## `TextEditPlus.setPluginInit(extId, init, destroy)`

```js
TextEditPlus.setPluginInit(extensionId,
  function init() {
    this.tick = function() { TextEditPlus.toast('hello', 'info', 500); };
    this.timerId = setInterval(this.tick, 5000);
    this.tick();
  },
  function destroy() {
    clearInterval(this.timerId);
  }
);
```

- `init` runs synchronously immediately.
- `destroy` runs on disable/uninstall/reload, **before** the framework's own cleanup of providers/themes/panels. That order matters — your destroy can still see panels you registered.

## The `this` scratch object

Both callbacks share a fresh per-extension object as `this`. Use it to stash references that init creates and destroy needs:

```js
TextEditPlus.setPluginInit(extensionId,
  function init() {
    this.controller = new AbortController();
    fetch('/api/data', { signal: this.controller.signal })
      .then(r => r.json())
      .then(handle);
  },
  function destroy() {
    this.controller.abort();
  }
);
```

This avoids polluting `window` and keeps state truly per-extension.

## Why exceptions don't break the editor

Each callback runs inside a guarded wrapper:

- A throw in your `init` is caught and logged; the rest of your extension's code (anything outside `init`) continues.
- A throw in your `destroy` is caught and logged; framework cleanup still proceeds.
- One bad extension can't take down others — each destroy is wrapped individually.

## Reload behavior

When the editor reloads (e.g. when the user switches workspace), every enabled extension is unloaded then loaded fresh. Your destroy fires; your init runs again. Treat init as "set up from scratch" rather than "resume from where I was".
