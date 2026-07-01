import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerGetPageByTitle = (server) => {
  server.registerTool(
    "get_page_by_title",
    {
      description: "Get a Confluence page by its space key and exact title",
      inputSchema: z.object({
        space_key: z.string().describe("Confluence space key, e.g. ENG"),
        title: z.string().describe("Exact page title to look up"),
      }),
    },
    async ({space_key, title}) => {
      try {
        const params = new URLSearchParams({
          expand: "body.storage,version",
          spaceKey: space_key,
          title,
        });
        const result = await confluenceRequest("GET", `/content?${params}`);
        const page = result.results?.[0];
        if (!page) {
          return {
            content: [
              {
                text: `No page found with title "${title}" in space ${space_key}`,
                type: "text",
              },
            ],
          };
        }
        return {content: [{text: JSON.stringify(page, null, 2), type: "text"}]};
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
