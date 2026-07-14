import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";
import {resolveBody, writeBodyParamsSchema} from "../markdown.js";

export const registerCreatePage = (server) => {
  server.registerTool(
    "create_page",
    {
      description:
        "Create a new Confluence page. Pass Markdown with body_format='markdown' (converted server-side), or raw Confluence storage format (XHTML) with the default body_format='storage'",
      inputSchema: z.object({
        body: z
          .string()
          .describe(
            "Page content. Markdown when body_format='markdown', else Confluence storage format (XHTML)",
          ),
        parent_page_id: z
          .string()
          .optional()
          .describe("Content ID of the parent page, if nesting under one"),
        space_key: z.string().describe("Confluence space key, e.g. ENG"),
        title: z.string().describe("Page title"),
        ...writeBodyParamsSchema,
      }),
    },
    async ({body, body_format, parent_page_id, space_key, title}) => {
      try {
        const value = resolveBody(body, body_format);
        const payload = {
          body: {storage: {representation: "storage", value}},
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
