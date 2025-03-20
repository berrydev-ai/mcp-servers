const express = require('express');
const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

class DockerOrbstackServer {
  constructor(config) {
    this.config = config;
    this.app = express();
    this.setupDocker();
    this.setupRoutes();
  }

  setupDocker() {
    // Connect to Docker socket
    // For OrbStack, we use the default socket
    this.docker = new Docker();
  }

  setupRoutes() {
    this.app.use(express.json());
    
    // Root route
    this.app.get('/', (req, res) => {
      res.json({ 
        message: 'Model Context Protocol Docker OrbStack Server is running',
        serverName: this.config.serverName || 'docker-orbstack'
      });
    });

    // List containers
    this.app.get('/containers', async (req, res) => {
      try {
        const containers = await this.docker.listContainers({ all: true });
        res.json(containers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get container info
    this.app.get('/containers/:id', async (req, res) => {
      try {
        const container = this.docker.getContainer(req.params.id);
        const info = await container.inspect();
        res.json(info);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Start container
    this.app.post('/containers/:id/start', async (req, res) => {
      try {
        const container = this.docker.getContainer(req.params.id);
        await container.start();
        res.json({ message: 'Container started' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Stop container
    this.app.post('/containers/:id/stop', async (req, res) => {
      try {
        const container = this.docker.getContainer(req.params.id);
        await container.stop();
        res.json({ message: 'Container stopped' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // List images
    this.app.get('/images', async (req, res) => {
      try {
        const images = await this.docker.listImages();
        res.json(images);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pull image
    this.app.post('/images/pull', async (req, res) => {
      try {
        const { imageName } = req.body;
        if (!imageName) {
          return res.status(400).json({ error: 'Image name is required' });
        }

        // Stream the pull operation
        await this.docker.pull(imageName);
        res.json({ message: `Image ${imageName} pulled successfully` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Create container
    this.app.post('/containers/create', async (req, res) => {
      try {
        const { imageName, containerConfig } = req.body;
        if (!imageName) {
          return res.status(400).json({ error: 'Image name is required' });
        }

        const config = {
          Image: imageName,
          ...containerConfig
        };

        const container = await this.docker.createContainer(config);
        res.json({ 
          message: 'Container created',
          containerId: container.id
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  start() {
    const port = this.config.dockerPort || 3001;
    const host = this.config.dockerHost || '0.0.0.0';
    
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, host, () => {
        console.log(`Model Context Protocol Docker OrbStack Server listening on ${host}:${port}`);
        resolve(this.server);
      });
      
      this.server.on('error', (error) => {
        console.error('Failed to start Model Context Protocol Docker OrbStack Server:', error);
        reject(error);
      });
    });
  }

  stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log('Model Context Protocol Docker OrbStack Server stopped');
          resolve();
        });
      });
    }
    return Promise.resolve();
  }
}

module.exports = DockerOrbstackServer;