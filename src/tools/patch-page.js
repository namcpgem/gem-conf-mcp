import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerPatchPage = (server) => {
  server.registerTool(
    "patch_page",
    {
      description:
        "Replace one exact substring in a Confluence page's storage-format body without resending the full body. old_string must match exactly once in the current content; use for targeted edits to large pages where update_page's full-body replace is impractical.",
      inputSchema: z.object({
        new_string: z.string().describe("Replacement text"),
        old_string: z
          .string()
          .describe(
            "Exact text to find in the current storage-format body; must be unique",
          ),
        page_id: z.string().describe("Confluence page/content ID to update"),
      }),
    },
    async ({new_string, old_string, page_id}) => {
      try {
        const current = await confluenceRequest(
          "GET",
          `/content/${page_id}?expand=version,space,body.storage`,
        );
        const body = current.body.storage.value;
        const matches = body.split(old_string).length - 1;
        if (matches === 0) {
          return {
            content: [
              {text: "old_string not found in page body", type: "text"},
            ],
            isError: true,
          };
        }
        if (matches > 1) {
          return {
            content: [
              {
                text: `old_string matches ${matches} times; add more context to make it unique`,
                type: "text",
              },
            ],
            isError: true,
          };
        }
        const value = body.replace(old_string, () => new_string);
        const payload = {
          body: {storage: {representation: "storage", value}},
          id: page_id,
          space: {key: current.space.key},
          title: current.title,
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
