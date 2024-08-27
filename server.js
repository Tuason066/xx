const WebSocket = require('ws');
const chokidar = require('chokidar');
const path = require('path');

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
});

const frontendPath = path.join(__dirname, '../frontend');

const watcher = chokidar.watch(frontendPath, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true, // ignore initial add events
});

watcher.on('change', (path) => {
  console.log(`${path} has been changed`);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
