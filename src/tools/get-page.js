import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";
import {bodyParamsSchema, expandForBody, formatPage} from "../page-body.js";

export const registerGetPage = (server) => {
  server.registerTool(
    "get_page",
    {
      description:
        "Get full details of a Confluence page by its numeric content ID",
      inputSchema: z.object({
        page_id: z.string().describe("Confluence page/content ID, e.g. 123456"),
        ...bodyParamsSchema,
      }),
    },
    async ({page_id, ...opts}) => {
      try {
        const expand = [
          ...expandForBody(opts.body_format),
          "version",
          "space",
          "ancestors",
        ].join(",");
        const page = await confluenceRequest(
          "GET",
          `/content/${page_id}?expand=${expand}`,
        );
        return {content: [{text: formatPage(page, opts), type: "text"}]};
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
