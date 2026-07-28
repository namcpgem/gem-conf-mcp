import {z} from "zod";
import {readForEdit, writePage} from "../confluence-client.js";
import {defineTool} from "../define-tool.js";

export const patchPage = async ({new_string, old_string, page_id}) => {
  const current = await readForEdit(page_id);
  const body = current.body.storage.value;
  const matches = body.split(old_string).length - 1;
  if (matches === 0) {
    throw new Error("old_string not found in page body");
  }
  if (matches > 1) {
    throw new Error(
      `old_string matches ${matches} times; add more context to make it unique`,
    );
  }
  const value = body.replace(old_string, () => new_string);
  return writePage(page_id, {current, title: current.title, value});
};

export const registerPatchPage = (server) => {
  defineTool(
    server,
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
    patchPage,
  );
};
