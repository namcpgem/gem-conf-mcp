import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerGetUser = (server) => {
  server.registerTool(
    "get_user",
    {
      description:
        "Resolve a Confluence user's display name and profile from a userKey or username. Useful for turning a page's stored userkey (e.g. from a user mention/link) into a readable name.",
      inputSchema: z.object({
        key: z
          .string()
          .optional()
          .describe("User key (e.g. 2c94808299488f660199f0f7f8910013)"),
        username: z.string().optional().describe("Username (login name)"),
      }),
    },
    async ({key, username}) => {
      try {
        if (!key && !username) {
          return {
            content: [
              {text: "Provide either 'key' or 'username'.", type: "text"},
            ],
            isError: true,
          };
        }
        const params = new URLSearchParams();
        if (key) params.set("key", key);
        else params.set("username", username);
        const result = await confluenceRequest("GET", `/user?${params}`);
        return {
          content: [{text: JSON.stringify(result, null, 2), type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
