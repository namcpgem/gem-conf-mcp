import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerAddComment = (server) => {
  server.registerTool(
    "add_comment",
    {
      description:
        "Add a comment to a Confluence page. Body must be Confluence storage format (XHTML), not Markdown",
      inputSchema: z.object({
        body: z
          .string()
          .describe(
            "Comment content in Confluence storage format (XHTML), not Markdown",
          ),
        page_id: z
          .string()
          .describe("Confluence page/content ID to comment on"),
      }),
    },
    async ({body, page_id}) => {
      try {
        const payload = {
          body: {storage: {representation: "storage", value: body}},
          container: {id: page_id, type: "page"},
          type: "comment",
        };
        const created = await confluenceRequest("POST", "/content", payload);
        return {
          content: [{text: JSON.stringify(created, null, 2), type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
