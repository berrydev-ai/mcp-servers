import { FastMCP } from 'fastmcp';

export const registerGetTokenCountForTextPrompt = (server: FastMCP) => {
  server.addPrompt({
    name: 'getTokenCountForText',
    description: 'Get the token count for a given text',
    arguments: [
      {
        name: 'text',
        description: 'The text to count tokens for',
      },
    ],
    load: async args => {
      return `Count the number of tokens in this text:\n\n${args.text}`;
    },
  });
};
