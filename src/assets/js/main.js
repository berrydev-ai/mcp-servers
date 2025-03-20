document.addEventListener('DOMContentLoaded', async () => {
  // Get references to elements
  const serversContainer = document.getElementById('servers-container');
  const statusMessages = document.getElementById('status-messages');
  
  // Function to check server status
  async function checkServerStatus(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error(`Error checking server status for ${url}:`, error);
      return false;
    }
  }

  // Function to fetch server data from API
  async function fetchServers() {
    try {
      const response = await fetch('/api/servers');
      if (!response.ok) {
        throw new Error('Failed to fetch servers data');
      }
      
      const data = await response.json();
      return data.servers || [];
    } catch (error) {
      console.error('Error fetching servers:', error);
      showStatusMessage('Error loading server data', 'error');
      return [];
    }
  }
  
  // Function to handle server control (start/stop)
  async function controlServer(id, action) {
    try {
      const response = await fetch(`/api/servers/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} server`);
      }
      
      showStatusMessage(data.message || `Server ${action}ed successfully`, 'success');
      
      // Refresh servers after a brief delay
      setTimeout(() => {
        loadServers();
      }, 1000);
      
    } catch (error) {
      console.error(`Error ${action}ing server:`, error);
      showStatusMessage(error.message, 'error');
    }
  }
  
  // Function to show status messages
  function showStatusMessage(message, type = 'info') {
    if (!statusMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      messageDiv.remove();
    });
    
    messageDiv.appendChild(closeBtn);
    statusMessages.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode === statusMessages) {
        messageDiv.remove();
      }
    }, 5000);
  }

  // Function to create server cards
  async function createServerCard(server) {
    // Check server status if not provided
    const isOnline = server.status === 'online';
    
    // Create server card
    const serverCard = document.createElement('div');
    serverCard.className = 'server-card';
    serverCard.id = `server-${server.id}`;
    
    // Card header with server name and status
    const statusClass = isOnline ? 'status-online' : 'status-offline';
    const statusText = isOnline ? 'Online' : 'Offline';
    
    // Determine what control buttons to show based on server type and status
    let controlButtons = '';
    
    if (server.id !== 'main') { // Don't allow controlling the main server
      if (isOnline) {
        controlButtons = `
          <button class="control-btn stop-btn" data-server-id="${server.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="6" y="6" width="12" height="12"></rect>
            </svg>
            Stop
          </button>
        `;
      } else {
        controlButtons = `
          <button class="control-btn start-btn" data-server-id="${server.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
          </button>
        `;
      }
    }
    
    serverCard.innerHTML = `
      <div class="server-header">
        <div class="server-name">${server.name}</div>
        <div class="server-status ${statusClass}">${statusText}</div>
      </div>
      <div class="server-content">
        <div class="server-description">${server.description}</div>
        <div class="server-meta">
          <div class="server-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
            <span>Port: ${server.port}</span>
          </div>
          <div class="server-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Status: ${statusText}</span>
          </div>
        </div>
        
        <div class="endpoints">
          <h3>Endpoints</h3>
          <ul class="endpoint-list">
            ${server.endpoints.map(endpoint => `
              <li class="endpoint-item">
                <div class="endpoint-method method-${endpoint.method.toLowerCase()}">${endpoint.method}</div>
                <div class="endpoint-info">
                  <div class="endpoint-path">${endpoint.path}</div>
                  <div class="endpoint-description">${endpoint.description || ''}</div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="server-actions">
          ${controlButtons}
          ${isOnline ? `
            <a href="http://${window.location.hostname}:${server.port}" class="btn" target="_blank">Open Server</a>
          ` : ''}
        </div>
      </div>
    `;
    
    return serverCard;
  }

  // Function to load servers
  async function loadServers() {
    // Get servers data from API
    const servers = await fetchServers();
    
    if (servers.length === 0) {
      serversContainer.innerHTML = '<div class="error-message">No servers found</div>';
      return;
    }
    
    // Clear existing content
    serversContainer.innerHTML = '';
    
    // Map endpoints to each server
    const serverEndpoints = {
      main: [
        { method: "GET", path: "/", description: "Dashboard showing all MCP servers" },
        { method: "GET", path: "/api", description: "Server information and status" },
        { method: "GET", path: "/api/servers", description: "Information about all available servers" },
        { method: "GET", path: "/health", description: "Health check endpoint" },
        { method: "POST", path: "/api/servers/:id/start", description: "Start a server" },
        { method: "POST", path: "/api/servers/:id/stop", description: "Stop a server" }
      ],
      docker: [
        { method: "GET", path: "/", description: "Docker MCP server information and status" },
        { method: "GET", path: "/containers", description: "List all Docker containers" },
        { method: "GET", path: "/containers/:id", description: "Get information about a specific container" },
        { method: "POST", path: "/containers/:id/start", description: "Start a container" },
        { method: "POST", path: "/containers/:id/stop", description: "Stop a container" },
        { method: "GET", path: "/images", description: "List all Docker images" },
        { method: "POST", path: "/images/pull", description: "Pull a Docker image" },
        { method: "POST", path: "/containers/create", description: "Create a new container" }
      ]
    };
    
    // Add endpoints to each server
    for (const server of servers) {
      server.endpoints = serverEndpoints[server.id] || [];
      
      // Create and append server card
      const serverCard = await createServerCard(server);
      serversContainer.appendChild(serverCard);
    }
    
    // Attach event listeners for control buttons
    document.querySelectorAll('.control-btn').forEach(btn => {
      const serverId = btn.getAttribute('data-server-id');
      const action = btn.classList.contains('start-btn') ? 'start' : 'stop';
      
      btn.addEventListener('click', async () => {
        await controlServer(serverId, action);
      });
    });
  }

  // Initial load
  await loadServers();
  
  // Setup refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('loading');
      await loadServers();
      refreshBtn.classList.remove('loading');
    });
  }
  
  // Auto-refresh every 30 seconds
  setInterval(loadServers, 30000);
});