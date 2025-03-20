const express = require('express');
const fs = require('fs');
const path = require('path');
const DockerOrbstackServer = require('./docker-orbstack');

// Load configuration
const configPath = path.join(__dirname, '../config/server.json');
let config = {};

try {
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configData);
  } else {
    // Default configuration
    config = {
      port: 7829,
      host: '0.0.0.0',
      dockerPort: 7830,
      dockerHost: '0.0.0.0',
      serverName: 'MCP-Master-Server',
      maxConnections: 100,
      timeout: 30000,
      docker: {
        enabled: true,
        socketPath: '/var/run/docker.sock'
      }
    };
    // Save default config
    fs.writeFileSync(
      configPath, 
      JSON.stringify(config, null, 2)
    );
  }
} catch (error) {
  console.error('Error loading configuration:', error);
  process.exit(1);
}

// Create main server
const app = express();

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Parse JSON requests
app.use(express.json());

// Basic API route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'MCP Server is running',
    serverName: config.serverName,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Serve the beautiful HTML dashboard for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Server status tracking
const serverStatus = {
  main: { running: true },
  docker: { running: true }
};

// Get servers info
app.get('/api/servers', (req, res) => {
  const servers = [
    {
      id: 'main',
      name: config.serverName,
      description: 'Main entry point for the Model Context Protocol server infrastructure',
      port: config.port,
      host: config.host,
      status: serverStatus.main.running ? 'online' : 'offline'
    },
    {
      id: 'docker',
      name: 'Docker OrbStack Server',
      description: 'Model Context Protocol interface for managing Docker containers and images via OrbStack',
      port: config.dockerPort,
      host: config.dockerHost,
      status: serverStatus.docker.running ? 'online' : 'offline'
    }
  ];
  
  res.json({ servers });
});

// Start a server
app.post('/api/servers/:id/start', async (req, res) => {
  const { id } = req.params;
  
  if (id === 'main') {
    return res.status(400).json({ 
      error: 'Cannot start/stop the main server through the API'
    });
  }
  
  if (id === 'docker' && !serverStatus.docker.running) {
    try {
      // Start Docker server
      await dockerServer.start();
      serverStatus.docker.running = true;
      return res.json({ message: 'Docker server started successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  res.status(404).json({ error: 'Server not found or already running' });
});

// Stop a server
app.post('/api/servers/:id/stop', async (req, res) => {
  const { id } = req.params;
  
  if (id === 'main') {
    return res.status(400).json({ 
      error: 'Cannot start/stop the main server through the API'
    });
  }
  
  if (id === 'docker' && serverStatus.docker.running) {
    try {
      // Stop Docker server
      await dockerServer.stop();
      serverStatus.docker.running = false;
      return res.json({ message: 'Docker server stopped successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  res.status(404).json({ error: 'Server not found or already stopped' });
});

// Start main server
const server = app.listen(config.port, config.host, () => {
  console.log(`Model Context Protocol Main Server listening on ${config.host}:${config.port}`);
});

// Start Docker OrbStack server
const dockerServer = new DockerOrbstackServer(config);
dockerServer.start().catch(error => {
  console.error('Failed to start Model Context Protocol Docker OrbStack server:', error);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP servers');
  server.close(() => {
    console.log('Model Context Protocol Main Server closed');
  });
  dockerServer.stop().then(() => {
    console.log('All Model Context Protocol servers closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP servers');
  server.close(() => {
    console.log('Model Context Protocol Main Server closed');
  });
  dockerServer.stop().then(() => {
    console.log('All Model Context Protocol servers closed');
    process.exit(0);
  });
});