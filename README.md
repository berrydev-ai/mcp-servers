# MCP Servers

A framework for building MCP servers using uvx.

## Project Structure

- `src/` - Source code for the servers
- `config/` - Configuration files
- `data/` - Data storage

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Development mode with auto-restart:
   ```
   npm run dev
   ```

## Configuration

Server configuration is stored in `config/server.json`. You can modify this file to change server settings.

## Adding New Servers

To add a new server, create a new directory under `src/` with the server name and implement the server logic there.