# MCP Servers Project Information

## Commands

- Install dependencies: `npm install`
- Start server: `npm start`
- Development mode: `npm run dev`

## Project Structure

- Main server code: `/src/index.js`
- Configuration: `/config/server.json`
- Data storage: `/data/`

## Adding New Servers

To add a new server:
1. Create a new directory under `src/` with the server name
2. Implement the server logic in that directory
3. Update the main index.js to include the new server if needed
4. Add server-specific configuration in `config/`