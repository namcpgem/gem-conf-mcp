import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerCreatePage = (server) => {
  server.registerTool(
    "create_page",
    {
      description:
        "Create a new Confluence page. Body must be Confluence storage format (XHTML), not Markdown",
      inputSchema: z.object({
        body: z
          .string()
          .describe(
            "Page content in Confluence storage format (XHTML), not Markdown",
          ),
        parent_page_id: z
          .string()
          .optional()
          .describe("Content ID of the parent page, if nesting under one"),
        space_key: z.string().describe("Confluence space key, e.g. ENG"),
        title: z.string().describe("Page title"),
      }),
    },
    async ({body, parent_page_id, space_key, title}) => {
      try {
        const payload = {
          body: {storage: {representation: "storage", value: body}},
          space: {key: space_key},
          title,
          type: "page",
        };
        if (parent_page_id) payload.ancestors = [{id: parent_page_id}];
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
