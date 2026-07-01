import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerGetComments = (server) => {
  server.registerTool(
    "get_comments",
    {
      description: "Get comments on a Confluence page",
      inputSchema: z.object({
        page_id: z
          .string()
          .describe("Confluence page/content ID to fetch comments for"),
      }),
    },
    async ({page_id}) => {
      try {
        const params = new URLSearchParams({expand: "body.view", limit: "50"});
        const result = await confluenceRequest(
          "GET",
          `/content/${page_id}/child/comment?${params}`,
        );
        return {
          content: [{text: JSON.stringify(result, null, 2), type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
