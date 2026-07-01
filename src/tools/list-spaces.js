import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerListSpaces = (server) => {
  server.registerTool(
    "list_spaces",
    {
      description: "List Confluence spaces, or fetch a single space by key",
      inputSchema: z.object({
        limit: z
          .number()
          .default(25)
          .optional()
          .describe("Max results (ignored if space_key is set)"),
        space_key: z
          .string()
          .optional()
          .describe(
            "Exact space key to fetch a single space; omit to list all spaces",
          ),
      }),
    },
    async ({limit = 25, space_key}) => {
      try {
        if (space_key) {
          const space = await confluenceRequest("GET", `/space/${space_key}`);
          return {
            content: [{text: JSON.stringify(space, null, 2), type: "text"}],
          };
        }
        const params = new URLSearchParams({limit: String(limit)});
        const result = await confluenceRequest("GET", `/space?${params}`);
        return {
          content: [{text: JSON.stringify(result, null, 2), type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
