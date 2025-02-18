"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({
    port: 3001,
    verifyClient: (info, callback) => {
        // Allow connections from any origin
        const origin = info.origin || info.req.headers.origin;
        console.log('Connection attempt from origin:', origin);
        callback(true); // Accept the connection
    }
});
const gameManager = new GameManager_1.GameManager();
wss.on('connection', (ws, request) => {
    console.log('Client connected');
    gameManager.addUser(ws);
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received:', data);
            // Your existing message handling logic
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        gameManager.removeUser(ws);
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
