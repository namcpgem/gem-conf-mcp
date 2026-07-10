# Confluence mcp

MCP server for Confluence Server/Data Center (REST API). Written in Node.js ESM.

See [docs/USAGE.md](docs/USAGE.md) for end-user setup (Vietnamese) and [docs/RELEASE.md](docs/RELEASE.md) for the release process (Vietnamese).

## Requirements

- Node.js 18+
- Access to a Confluence Server or Data Center instance

## Setup

```bash
pnpm install
cp .env.example .env
# edit .env with your credentials
```

## Install from GitHub

```bash
npx github:namcpgem/gem-conf-mcp
```

Runs directly from the repo, no npm publish needed. npm runs the `prepare` script on install to build `dist/index.js`. Requires the repo to be public.

## Environment variables

| Variable              | Required | Description                               |
| --------------------- | -------- | ----------------------------------------- |
| `CONFLUENCE_HOST`     | yes      | Base URL, e.g. `https://conf.company.com` |
| `CONFLUENCE_USERNAME` | yes      | Confluence username                       |
| `CONFLUENCE_PASSWORD` | yes      | Confluence password                       |

## Build

```bash
pnpm build
```

Bundles the server into a single file at `dist/index.js` (via esbuild).

## Release

```bash
pnpm release
```

Builds the server and packages it into `release/conf-mcp-v<version>.zip`, containing:

- `index.js` — bundled server, no `node_modules` required
- `package.json` — name/version reference
- `README.md`
- `.env.example`

### Using the release zip (end users)

1. Extract `conf-mcp-v<version>.zip` to a folder, e.g. `C:\tools\conf-mcp`
2. Copy `.env.example` to `.env` in that folder and fill in your Confluence credentials, **or** set the env vars directly in your MCP client config (see below)
3. Point your MCP client at the extracted `index.js` — no `npm install`/`pnpm install` needed, the file is self-contained

## Claude Code config

Add to `.claude/settings.json` (or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "conf-mcp": {
      "command": "npx",
      "args": ["-y", "github:namcpgem/gem-conf-mcp"],
      "env": {
        "CONFLUENCE_HOST": "https://conf.company.com",
        "CONFLUENCE_USERNAME": "your_username",
        "CONFLUENCE_PASSWORD": "your_password"
      }
    }
  }
}
```

If using the release zip or running from source instead:

```json
{
  "mcpServers": {
    "conf-mcp": {
      "command": "node",
      "args": ["/path/to/conf-mcp/dist/index.js"],
      "env": { "...": "..." }
    }
  }
}
```

Adjust the path in `args` to wherever you extracted the release zip. For local development from source, point `args` at `src/index.js` instead.

## Tools

| Tool                | Description                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `get_page`          | Get full details of a Confluence page by its numeric content ID (supports body pagination)     |
| `get_page_by_title` | Get a Confluence page by its space key and exact title (supports body pagination)              |
| `create_page`       | Create a new Confluence page (body must be storage format XHTML, not Markdown)                 |
| `update_page`       | Update a page — full replace, auto-increments version; omit body/title to keep existing values |
| `delete_page`       | Move a page to trash (recoverable, does not permanently purge)                                 |
| `search_pages`      | Search Confluence content using CQL (Confluence Query Language)                                |
| `list_spaces`       | List Confluence spaces, or fetch a single space by key                                         |
| `add_comment`       | Add a comment to a page (storage format XHTML, not Markdown)                                   |
| `get_comments`      | Get comments on a page                                                                         |
| `get_user`          | Resolve a user's display name and profile from a userKey or username                           |

## Notes

- Confluence Server REST API uses storage format (XHTML) for `body`, not Markdown or ADF
- `get_page` / `get_page_by_title` cap the body at 40000 characters by default to avoid exceeding tool-output token limits. Control it with `body_format` (`storage` | `view` | `none`) and paginate large pages via `body_start` + `body_limit`; the response includes `body_length` and a `truncated` flag
- All logs go to stderr; stdout is reserved for MCP protocol
