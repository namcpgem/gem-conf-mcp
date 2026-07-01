import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerUpdatePage = (server) => {
  server.registerTool(
    "update_page",
    {
      description:
        "Update a Confluence page. This is a full replace and auto-increments the version. Body must be Confluence storage format (XHTML), not Markdown; omit body/title to keep existing values",
      inputSchema: z.object({
        body: z
          .string()
          .optional()
          .describe(
            "New page content in Confluence storage format; omit to keep existing content",
          ),
        page_id: z.string().describe("Confluence page/content ID to update"),
        title: z
          .string()
          .optional()
          .describe("New title; omit to keep existing title"),
      }),
    },
    async ({body, page_id, title}) => {
      try {
        const current = await confluenceRequest(
          "GET",
          `/content/${page_id}?expand=version,space,body.storage`,
        );
        const payload = {
          body: {
            storage: {
              representation: "storage",
              value: body ?? current.body.storage.value,
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
