# MCP Servers

A framework for building Model Context Protocol servers using Express.

MCP (Model Context Protocol) is a standard created by Anthropic for managing model context and interactions.

## Project Structure

- `src/` - Source code for the servers
  - `src/docker-orbstack/` - Docker management server via OrbStack
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

Key configuration options:
- `port`: Main server port (default: 7829)
- `host`: Main server host (default: 0.0.0.0)
- `dockerPort`: Docker server port (default: 7830)
- `dockerHost`: Docker server host (default: 0.0.0.0)
- `serverName`: Name of the main server
- `timeout`: Request timeout in milliseconds

## Dashboard

The MCP Servers come with a beautiful web dashboard that displays all available servers, their status, and endpoints. Simply navigate to the root URL of the main server to access it:

```
http://localhost:7829/
```

The dashboard provides:
- Real-time server status monitoring
- Complete list of available endpoints for each server
- Server control buttons to start and stop individual MCP servers
- Status notifications for server operations
- Auto-refresh of server status every 30 seconds
- Manual refresh button to check server status on demand
- Quick access links to running servers
- Responsive design that works on desktop and mobile devices

## API Reference

### Main MCP Server (Port 7829)

The main server provides the main entry point to the application.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Web dashboard showing servers and their status |
| `/api` | GET | Get server information and status as JSON |
| `/api/servers` | GET | Get information about all available servers |
| `/api/servers/:id/start` | POST | Start a specific server by ID |
| `/api/servers/:id/stop` | POST | Stop a specific server by ID |
| `/health` | GET | Health check endpoint |

### Docker OrbStack Server (Port 7830)

The Docker OrbStack server provides a Model Context Protocol interface for managing Docker containers and images via OrbStack.

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|-------------|
| `/` | GET | Get Docker server information and status | - |
| `/containers` | GET | List all Docker containers (includes stopped containers) | - |
| `/containers/:id` | GET | Get detailed information about a specific container | - |
| `/containers/:id/start` | POST | Start a container | - |
| `/containers/:id/stop` | POST | Stop a container | - |
| `/images` | GET | List all Docker images | - |
| `/images/pull` | POST | Pull a Docker image | `{ "imageName": "image:tag" }` |
| `/containers/create` | POST | Create a new container | `{ "imageName": "image:tag", "containerConfig": {...} }` |

Example request to create a container:
```json
POST /containers/create
{
  "imageName": "nginx:latest",
  "containerConfig": {
    "name": "my-nginx",
    "ExposedPorts": { "80/tcp": {} },
    "HostConfig": {
      "PortBindings": { "80/tcp": [{ "HostPort": "8080" }] }
    }
  }
}
```

## Adding New Servers

To add a new server, create a new directory under `src/` with the server name and implement the server logic there.

## Requirements

- Node.js 14.x or higher
- Docker installation (for Docker OrbStack server)
- OrbStack installed on macOS