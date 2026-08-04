# File System API

Persist your extension's data files in a sandboxed directory. Every call is async and returns a Promise.

## Sandbox root

Each extension gets a private directory at `filesDir/extension_data/<extId>/`. Paths in the API are relative to that root. You cannot reach outside it.

## `TextEditPlus.fs.writeFile(extId, path, content)`

```js
await TextEditPlus.fs.writeFile(extensionId, 'history.json', JSON.stringify(items));
```

Creates parent directories as needed. Overwrites existing files atomically.

## `TextEditPlus.fs.readFile(extId, path)`

```js
const text = await TextEditPlus.fs.readFile(extensionId, 'history.json');
```

Rejects with `Error('not found')` if the file doesn't exist.

## `TextEditPlus.fs.listDir(extId, path)`

```js
const entries = await TextEditPlus.fs.listDir(extensionId, '');
// [{ name: 'history.json', isDir: false, size: 2310, modified: 1727872800000 }, ...]
```

Returns `[]` if the directory doesn't exist yet. Rejects if the path points at a file.

## `TextEditPlus.fs.exists(extId, path)`

```js
if (await TextEditPlus.fs.exists(extensionId, 'history.json')) { /* … */ }
```

Resolves with a boolean.

## `TextEditPlus.fs.deleteFile(extId, path)`

```js
await TextEditPlus.fs.deleteFile(extensionId, 'history.json');
```

Idempotent — deleting a non-existent file is a no-op.

## Limits

| Limit | Value |
|-------|-------|
| Per-write size cap          | 10 MB |
| Per-extension total quota   | 100 MB |
| Path character class        | `[A-Za-z0-9._/-]+` |
| Absolute paths              | rejected |
| `..` segments               | rejected |
| Symlink escapes             | detected via canonical-path check |

The per-extension total is computed at write time and excludes the file you're overwriting (so resaves of similar size never trip the quota).

## Workspace files

The FS API only reaches the extension's sandbox — it deliberately does NOT expose the user's workspace files. If you need to read what the user is editing, use `editor.getValue()`, `editor.getModel()`, etc. — the Monaco APIs are unrestricted because they operate in-memory.

## Cleanup

Uninstalling the extension wipes its data directory.
