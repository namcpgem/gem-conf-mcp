import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: resolve(__dirname, "../.env")});

const BASE = `${process.env.CONFLUENCE_HOST}/rest/api`;
const AUTH = Buffer.from(
  `${process.env.CONFLUENCE_USERNAME}:${process.env.CONFLUENCE_PASSWORD}`,
).toString("base64");
const HEADERS = {
  Accept: "application/json",
  Authorization: `Basic ${AUTH}`,
  "Content-Type": "application/json",
};

export const confluenceRequest = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    body: body ? JSON.stringify(body) : undefined,
    headers: HEADERS,
    method,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Confluence API ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
};
