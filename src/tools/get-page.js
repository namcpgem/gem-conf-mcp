import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerGetPage = (server) => {
  server.registerTool(
    "get_page",
    {
      description:
        "Get full details of a Confluence page by its numeric content ID",
      inputSchema: z.object({
        page_id: z.string().describe("Confluence page/content ID, e.g. 123456"),
      }),
    },
    async ({page_id}) => {
      try {
        const page = await confluenceRequest(
          "GET",
          `/content/${page_id}?expand=body.storage,version,space,ancestors`,
        );
        return {
          content: [{text: JSON.stringify(page, null, 2), type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
