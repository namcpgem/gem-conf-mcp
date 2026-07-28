import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";
import {defineTool} from "../define-tool.js";
import {bodyParamsSchema, expandForBody, formatPage} from "../page-body.js";

export const getPage = async ({page_id, ...opts}) => {
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
  return formatPage(page, opts);
};

export const registerGetPage = (server) => {
  defineTool(
    server,
    "get_page",
    {
      description:
        "Get full details of a Confluence page by its numeric content ID",
      inputSchema: z.object({
        page_id: z.string().describe("Confluence page/content ID, e.g. 123456"),
        ...bodyParamsSchema,
      }),
    },
    getPage,
  );
};
