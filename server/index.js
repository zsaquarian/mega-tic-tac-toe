import http from "http";
import { handler } from '../build/handler.js';
import { injectSocketIO } from "./ws.js";
import express from 'express';

const app = express();
const server = http.createServer(app);

injectSocketIO(server);

app.use(handler);

server.listen(process.env.PORT || 3000, () => {
  console.log('Running on http://localhost:3000');
});
