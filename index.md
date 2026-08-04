---
layout: home

hero:
  name: TextEdit+ SDK
  text: Build extensions for a mobile code editor.
  tagline: Themes, language packs, sidebar panels, and tools — written in plain JavaScript, distributed through a public catalog.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: API Reference
      link: /api/themes
    - theme: alt
      text: View on GitHub
      link: https://github.com/grrhn/TextEditPlus

features:
  - icon: 🎨
    title: Eight typed APIs
    details: Themes, Languages, Commands, Settings, Sidebar panels, sandboxed FS, Dialog, Lifecycle. No native code required.
  - icon: 🧩
    title: Plain JavaScript
    details: Extensions ship as ZIPs containing a manifest.json and a main.js. No build step, no transpiler, no framework.
  - icon: 🔒
    title: Sandbox by default
    details: Each extension runs with window.Android undefined. The native bridge is only reachable through the public TextEditPlus API. File and settings storage are namespaced per extension.
  - icon: 📦
    title: One-tap install
    details: Published extensions appear in the in-app Browse tab. SHA-256 is verified before install — tampered ZIPs are refused.
---

## What you can build

- **Themes** that contribute new color schemes to the editor's theme picker.
- **Language packs** with Monarch tokenizers, brackets, and auto-close pairs.
- **Tool extensions** that register commands, surface them in the palette, and transform text in the editor.
- **Sidebar panels** with their own HTML/CSS that can trigger commands and show status.
- **Stateful utilities** that persist settings (Slider/Switch/Dropdown/TextField widgets are rendered automatically) and small data files.

## Quick example — a one-file theme

```js
// main.js
TextEditPlus.themes.define('moonlight', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '5c6378', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'c099ff' }
  ],
  colors: {
    'editor.background': '#1a1b26',
    'editor.foreground': '#c0caf5'
  }
}, extensionId, 'Moonlight');
```

Pair it with a `manifest.json`:

```json
{
  "id":          "moonlight",
  "name":        "Moonlight",
  "version":     "1.0.0",
  "author":      "you",
  "description": "Tokyo Night-ish theme.",
  "main":        "main.js"
}
```

Zip the two files together, install via **Extensions → +**, and your theme shows up under **Settings → Editor Theme**.

[Continue to Getting Started →](/getting-started)
