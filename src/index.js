const { createServer } = require('uvx');
const fs = require('fs');
const path = require('path');

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
      port: 3000,
      host: '0.0.0.0'
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

// Create server
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'MCP Server is running' }));
});

// Start server
server.listen(config.port, config.host, () => {
  console.log(`MCP Server listening on ${config.host}:${config.port}`);
});