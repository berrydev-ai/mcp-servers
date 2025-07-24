# MCP Servers

A collection of Model Context Protocol (MCP) servers for personal use, built with TypeScript and the [FastMCP](https://github.com/jlowin/fastmcp) framework.

## Overview

This project provides MCP servers that can be used with AI assistants and other applications that support the Model Context Protocol. Currently includes tools for token counting and text analysis.

## Features

### Tiktoken Tool
- **Token Counting**: Determine the number of tokens in text using the `js-tiktoken` library
- Uses the `o200k_base` encoding (GPT-4 tokenizer)
- Useful for managing token limits in AI applications

## Claude Desktop Integration

This package is designed to work with Claude Desktop's MCP Server configuration. You can use it directly with npx without needing to install it locally.

### Quick Setup

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "berrydev-mcp-servers": {
      "command": "npx",
      "args": [
        "-y",
        "@berrydev-ai/mcp-servers"
      ],
      "env": {}
    }
  }
}
```

After adding this configuration, restart Claude Desktop. The tiktoken tool will be available for token counting operations.

## Installation

```bash
npm install
```

### Publishing to NPM

This package is configured to be published to NPM for use with `npx`. The package includes:
- Executable binary configuration
- Automatic builds before publishing
- Proper file inclusion for distribution

```bash
npm publish
```

## Development

### Build the project
```bash
npm run build
```

### Development mode (watch)
```bash
npm run dev
```

### Run the server
```bash
npm start
```

### Inspect with MCP Inspector
```bash
npm run inspector
```

### Inspect with FastMCP CLI
```bash
npm run mcp-cli
```

## Testing

Run tests:
```bash
npm test
```

## Code Quality

### Type checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Formatting
```bash
npm run format        # Format code
npm run format:check  # Check formatting
```

### Run all checks
```bash
npm run check
```

## Project Structure

```
src/
├── index.ts          # Main server entry point
└── tools/
    ├── tiktoken.ts   # Token counting tool
    └── tiktoken.spec.ts # Tests for tiktoken tool
```

## Available Tools

### `tiktoken`
Counts tokens in the provided text using the GPT-4 tokenizer.

**Parameters:**
- `text` (string): The text to analyze (minimum 1 character)

**Returns:**
- Token count as a number

**Example usage in Claude Desktop:**
Once configured, you can ask Claude to count tokens in text, and it will automatically use this tool.

**Direct API usage:**
```json
{
  "name": "tiktoken",
  "arguments": {
    "text": "Hello, world!"
  }
}
```

## CI/CD

The project includes GitHub Actions workflows for:
- **Continuous Integration**: Runs tests, linting, and type checking on Node.js 18.x and 20.x
- **NPM Publishing**: Automated publishing to NPM and GitHub Packages

## Configuration

### TypeScript
- Target: ES2022
- Module: NodeNext (for proper ES module support)
- Strict mode enabled
- Source maps and declarations generated

### Dependencies
- **Runtime**: `fastmcp`, `js-tiktoken`, `zod`
- **Development**: TypeScript, ESLint, Prettier, Vitest

## License

MIT

## Author

Eric Berry (eric@berrydev.ai)