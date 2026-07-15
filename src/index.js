import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {registerAddComment} from "./tools/add-comment.js";
import {registerCreatePage} from "./tools/create-page.js";
import {registerDeletePage} from "./tools/delete-page.js";
import {registerGetComments} from "./tools/get-comments.js";
import {registerGetPage} from "./tools/get-page.js";
import {registerGetPageByTitle} from "./tools/get-page-by-title.js";
import {registerGetUser} from "./tools/get-user.js";
import {registerListSpaces} from "./tools/list-spaces.js";
import {registerPatchPage} from "./tools/patch-page.js";
import {registerSearchPages} from "./tools/search-pages.js";
import {registerUpdatePage} from "./tools/update-page.js";

const server = new McpServer({name: "conf-mcp", version: "1.0.0"});

registerGetPage(server);
registerCreatePage(server);
registerUpdatePage(server);
registerPatchPage(server);
registerDeletePage(server);
registerGetPageByTitle(server);
registerSearchPages(server);
registerListSpaces(server);
registerGetUser(server);
registerAddComment(server);
registerGetComments(server);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Confluence MCP server running on stdio");
