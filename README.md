# conf-mcp

MCP server for Confluence Server/Data Center (REST API). Written in Node.js ESM.

## Requirements

- Node.js 18+
- Access to a Confluence Server or Data Center instance

## Setup

```bash
pnpm install
cp .env.example .env
# edit .env with your credentials
```

## Environment variables

| Variable                | Required | Description                                          |
| ------------------------ | -------- | ----------------------------------------------------- |
| `CONFLUENCE_HOST`         | yes      | Base URL, e.g. `https://conf.company.com`             |
| `CONFLUENCE_USERNAME`     | yes      | Confluence username                                    |
| `CONFLUENCE_PASSWORD`     | yes      | Confluence password                                    |

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
      "command": "node",
      "args": ["/path/to/conf-mcp/dist/index.js"],
      "env": {
        "CONFLUENCE_HOST": "https://conf.company.com",
        "CONFLUENCE_USERNAME": "your_username",
        "CONFLUENCE_PASSWORD": "your_password"
      }
    }
  }
}
```

Adjust the path in `args` to wherever you extracted the release zip. For local development from source, point `args` at `src/index.js` instead.

## Tools

| Tool               | Description                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `get_page`           | Get full details of a Confluence page by its numeric content ID                                              |
| `get_page_by_title`  | Get a Confluence page by its space key and exact title                                                       |
| `create_page`        | Create a new Confluence page (body must be storage format XHTML, not Markdown)                               |
| `update_page`        | Update a page — full replace, auto-increments version; omit body/title to keep existing values               |
| `delete_page`        | Move a page to trash (recoverable, does not permanently purge)                                               |
| `search_pages`       | Search Confluence content using CQL (Confluence Query Language)                                              |
| `list_spaces`        | List Confluence spaces, or fetch a single space by key                                                       |
| `add_comment`        | Add a comment to a page (storage format XHTML, not Markdown)                                                 |
| `get_comments`       | Get comments on a page                                                                                       |

## Notes

- Confluence Server REST API uses storage format (XHTML) for `body`, not Markdown or ADF
- All logs go to stderr; stdout is reserved for MCP protocol
