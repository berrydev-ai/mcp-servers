import { FastMCP, UserError } from 'fastmcp';
import { z } from 'zod';

import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

export async function countTokens(text: string): Promise<number> {
  const enc = new Tiktoken(o200k_base);
  const tokenizedText = enc.decode(enc.encode(text));
  const tokenCount = tokenizedText.length;

  return tokenCount;
}

export const registerTiktokenTools = (server: FastMCP) => {
  server.addTool({
    name: 'tiktoken',
    description: 'Determine token count for text using Tiktoken',
    parameters: z.object({
      text: z
        .string()
        .min(1)
        .describe('The text in which the token count is determined'),
    }),
    execute: async (args, { log }) => {
      try {
        const tokenCount = await countTokens(args.text);
        log.info(`Token count: ${tokenCount}`);
        return {
          type: 'text',
          text: `Token count: ${tokenCount}`,
        };
      } catch (error) {
        log.error(`Error counting tokens: ${error}`);
        throw new UserError(`Error counting tokens: ${error}`);
      }
    },
  });
};
