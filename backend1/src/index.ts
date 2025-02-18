import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { IncomingMessage } from 'http';

const wss = new WebSocketServer({ 
  port: 3001,
  verifyClient: (info: { origin: string; secure: boolean; req: IncomingMessage }, callback) => {
    callback(true);
  }
});

const gameManager = new GameManager();

wss.on('connection', (ws, request) => {
  const clientIp = request.socket.remoteAddress;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] New WebSocket connection from ${clientIp}`);
  console.log(`Active connections: ${wss.clients.size}`);

  gameManager.addUser(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`[${new Date().toISOString()}] Received message from ${clientIp}:`, data);
      // Your existing message handling
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error parsing message from ${clientIp}:`, error);
    }
  });

  ws.on('close', () => {
    console.log(`[${new Date().toISOString()}] Client ${clientIp} disconnected`);
    console.log(`Remaining connections: ${wss.clients.size - 1}`);
    gameManager.removeUser(ws);
  });

  ws.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] WebSocket error from ${clientIp}:`, error);
  });
});