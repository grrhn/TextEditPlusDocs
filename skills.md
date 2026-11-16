# Agent Skills & Rules (`SKILL.md` & `AGENTS.md`)

TextEdit+ implements Antigravity / Superpowers-compatible **Progressive Disclosure** skills and project rules. Skills teach the AI agent specialized workflows (debugging, TDD, UI/UX design, document parsing, framework conventions) without bloating every prompt up front.

## How Progressive Disclosure works

1. At the start of an AI turn, TextEdit+ injects only each enabled skill's `id` and `description` (~30–50 tokens per skill) inside `<available_skills>`, along with discovered project rules in `<workspace_rules>`.
2. When a task matches a skill — or when the user invokes `/<skill-id>` — the agent calls `activate_skill("<skill-id>")` to load the full `SKILL.md` instructions.
3. If a skill bundles supporting files (`references/`, `scripts/`, `data/`, `rules/`), the agent reads them on demand via `read_skill_file`.

## 4-Tier Discovery Precedence

When skills share an `id`, the highest tier wins:

| Tier | Location | Notes |
|---|---|---|
| **1. Workspace** | `<workspace>/.agent/skills/<id>/SKILL.md` or `.agents/skills/<id>/SKILL.md` | Automatically discovered when opening a project folder |
| **2. User** | App-private `skills/<id>/SKILL.md` | Created in **AI → Skills** or imported via **Import ZIP** |
| **3. Extension** | Installed extension packages (`type: "skill"` or `SKILL.md` / `skills/*/SKILL.md`) | Installed from **Extensions → Browse → Skills** or ZIP; **exempt from the free extension limit** |
| **4. Built-in** | Bundled APK assets + core inline skills | Always available out of the box (can be toggled off per skill) |

## `SKILL.md` format

Each skill lives in its own folder with a `SKILL.md` file starting with YAML frontmatter:

```markdown
---
name: kotlin-clean-architecture
description: Use when designing or refactoring Kotlin ViewModels, repositories, or Jetpack Compose screens.
argument-hint: "[feature or file]"
---

# Kotlin Clean Architecture

1. Keep UI state immutable and expose unidirectional event handlers on the ViewModel.
2. Isolate blocking I/O on `Dispatchers.IO`.
3. Verify changes with unit tests and diagnostics before finishing.
```

Supports single-line quoted descriptions as well as multi-line folded/literal YAML block scalars (`|`, `>`, `|-`, `>-`).

## Packaging Skill Packs for the Store or ZIP Import

Skill packages are free for all users (`Skills free`) and do not require `main.js`.

### Single-skill ZIP (no `manifest.json` required)

You can zip a single `SKILL.md` directly — TextEdit+ synthesizes the manifest from its frontmatter:

```text
my-skill.zip
├── SKILL.md
└── references/
    └── checklist.md   (optional)
```

### Multi-skill Pack Extension (`manifest.json` + `skills/`)

To bundle multiple related skills into one store package:

```text
skills-my-pack/
├── manifest.json
├── README.md          (optional)
└── skills/
    ├── skill-one/
    │   └── SKILL.md
    └── skill-two/
        └── SKILL.md
```

Example `manifest.json`:

```json
{
  "id": "skills-my-pack",
  "name": "My Engineering Skill Pack",
  "version": "1.0.0",
  "author": "you",
  "description": "Curated engineering & code review SKILL.md workflows.",
  "main": "",
  "type": "skill",
  "category": "skill",
  "premium": false
}
```

## Project Rules (`AGENTS.md`)

In addition to skills, TextEdit+ automatically discovers and injects project rule files in the active workspace:

- `AGENTS.md`
- `.agent/AGENTS.md` / `.agents/AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.agent/rules/*.md` / `.agents/rules/*.md`

Use `/init-agents` in the AI composer (or **AI → Skills & Rules → Init**) to generate a starter `AGENTS.md` in any workspace.
