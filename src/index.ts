#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { registerTiktokenTools } from "./tools/tiktoken.js";
import { registerGetTokenCountForTextPrompt } from "./prompts/token-count.js";

const server = new FastMCP({
  name: "berrydev-ai-mcp-servers",
  version: "1.0.0",
});

// Register tools
registerTiktokenTools(server);

// Register prompts
registerGetTokenCountForTextPrompt(server);

server.start({
  transportType: "stdio",
});
