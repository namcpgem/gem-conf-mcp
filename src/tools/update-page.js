import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";
import {resolveBody, writeBodyParamsSchema} from "../markdown.js";

export const registerUpdatePage = (server) => {
  server.registerTool(
    "update_page",
    {
      description:
        "Update a Confluence page. This is a full replace and auto-increments the version. Pass Markdown with body_format='markdown' (converted server-side), or raw Confluence storage format (XHTML) with the default body_format='storage'; omit body/title to keep existing values",
      inputSchema: z.object({
        body: z
          .string()
          .optional()
          .describe(
            "New page content. Markdown when body_format='markdown', else Confluence storage format; omit to keep existing content",
          ),
        page_id: z.string().describe("Confluence page/content ID to update"),
        title: z
          .string()
          .optional()
          .describe("New title; omit to keep existing title"),
        ...writeBodyParamsSchema,
      }),
    },
    async ({body, body_format, page_id, title}) => {
      try {
        const current = await confluenceRequest(
          "GET",
          `/content/${page_id}?expand=version,space,body.storage`,
        );
        const value = resolveBody(body, body_format);
        const payload = {
          body: {
            storage: {
              representation: "storage",
              value: value ?? current.body.storage.value,
            },
          },
          id: page_id,
          space: {key: current.space.key},
          title: title ?? current.title,
          type: "page",
          version: {number: current.version.number + 1},
        };
        const updated = await confluenceRequest(
          "PUT",
          `/content/${page_id}`,
          payload,
        );
        return {
          content: [{text: JSON.stringify(updated, null, 2), type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
