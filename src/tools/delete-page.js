import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerDeletePage = (server) => {
  server.registerTool(
    "delete_page",
    {
      description:
        "Move a Confluence page to trash (recoverable). Does not permanently purge",
      inputSchema: z.object({
        page_id: z
          .string()
          .describe("Confluence page/content ID to move to trash"),
      }),
    },
    async ({page_id}) => {
      try {
        await confluenceRequest("DELETE", `/content/${page_id}`);
        return {
          content: [{text: `Page ${page_id} moved to trash`, type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
