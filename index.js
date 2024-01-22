import signale from 'signale';
import { WebSocketServer, WebSocket } from 'ws';
import 'dotenv/config'

const port = process.env.PORT || 3002;
const wss = new WebSocketServer({ port: port });

signale.success("Servidor iniciado en el puerto " + port);

wss.on("connection", ws => {
    signale.success("Cliente conectado");

    ws.on("message", data => {
        console.log("mensaje recibido: %s", data);
        const position = JSON.parse(data);

        // broadcast position
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(position));
            }
        });
    });
})