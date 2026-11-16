# TextEdit+ Extension SDK & Documentation

Official documentation and SDK reference for building extensions, themes, and language supports for **[TextEdit+](https://play.google.com/store/apps/details?id=com.krk.texteditplus)**.

📖 **Live Documentation Website:** [https://grrhn.github.io/TextEditPlusDocs/](https://grrhn.github.io/TextEditPlusDocs/)

---

## 🚀 Overview

TextEdit+ supports custom extensions built using standard JavaScript and the Monaco Editor runtime. Developers can create:

- 🎨 **Themes:** Custom syntax highlighting and UI themes (Dracula, One Dark Pro, Monokai, Nord, etc.)
- 🌐 **Language Intelligence & Markers:** Syntax definition, bracket matching, and inline diagnostics (`TextEditPlus.markers`)
- 🧠 **AI Extensions & `SKILL.md` Packs:** Register custom agent tools, `@` context providers, `/` commands (`TextEditPlus.ai`), or bundle Markdown `SKILL.md` workflows
- 🛠️ **Utility Tools:** Selection transformations, JSON formatters, Base64 tools, Markdown linters
- 📌 **Sidebar Panels:** Custom UI panels in the editor sidebar (Quick Actions, Markdown Live Preview)
- ⚙️ **Settings & Commands:** Register custom options and editor command palette actions

---

## 📚 Documentation Quick Links

- [🚀 Getting Started](https://grrhn.github.io/TextEditPlusDocs/getting-started)
- [🧩 Extension Anatomy](https://grrhn.github.io/TextEditPlusDocs/anatomy)
- [🧠 Agent Skills (`SKILL.md` & `AGENTS.md`)](https://grrhn.github.io/TextEditPlusDocs/skills)
- [📖 API Reference](https://grrhn.github.io/TextEditPlusDocs/api/themes)
  - [Themes API](https://grrhn.github.io/TextEditPlusDocs/api/themes)
  - [Languages API](https://grrhn.github.io/TextEditPlusDocs/api/languages)
  - [Markers (Diagnostics) API](https://grrhn.github.io/TextEditPlusDocs/api/markers)
  - [AI Extensions API](https://grrhn.github.io/TextEditPlusDocs/api/ai)
  - [Commands API](https://grrhn.github.io/TextEditPlusDocs/api/commands)
  - [Settings API](https://grrhn.github.io/TextEditPlusDocs/api/settings)
  - [Sidebar API](https://grrhn.github.io/TextEditPlusDocs/api/sidebar)
  - [File System API](https://grrhn.github.io/TextEditPlusDocs/api/fs)
  - [Lifecycle API](https://grrhn.github.io/TextEditPlusDocs/api/lifecycle)
- [🛒 Publishing to Extension Store](https://grrhn.github.io/TextEditPlusDocs/catalog-submission)

---

## 🛠️ Local Development

To run the documentation site locally:

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

Built for TextEdit+.
