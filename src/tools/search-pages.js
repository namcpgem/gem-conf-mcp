import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";

export const registerSearchPages = (server) => {
  server.registerTool(
    "search_pages",
    {
      description:
        "Search Confluence content using CQL (Confluence Query Language)",
      inputSchema: z.object({
        cql: z
          .string()
          .describe(
            "CQL query, e.g. 'type=page AND space=ENG AND title~\"deploy\"'. Fields: space,title,type,text,label,creator,created,lastmodified. Operators: = != ~ !~ > >= < <= IN. Keywords: AND OR NOT ORDER BY",
          ),
        limit: z
          .number()
          .default(25)
          .optional()
          .describe("Max results per page"),
        start: z.number().default(0).optional().describe("Pagination offset"),
      }),
    },
    async ({cql, limit = 25, start = 0}) => {
      try {
        const params = new URLSearchParams({
          cql,
          limit: String(limit),
          start: String(start),
        });
        const result = await confluenceRequest(
          "GET",
          `/content/search?${params}`,
        );
        return {
          content: [{text: JSON.stringify(result, null, 2), type: "text"}],
        };
      } catch (err) {
        return {content: [{text: err.message, type: "text"}], isError: true};
      }
    },
  );
};
