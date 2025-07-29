
import "./env.config";

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import { SearchRoute } from './route/SearchRoute';
import { ChatRoute } from './route/ChatRoute';
import * as path from 'path';


const HOSTNAME = 'localhost';
const PORT = Number(process.env.LOCAL_AI_BRIDGE_DEV_NESTIFY_API_PORT);

const openCors = cors();
const strictCors = cors({
  origin: process.env.LOCAL_AI_BRIDGE_DEV_NESTIFIY_FRONTEND_ORIGIN,
  methods: ['GET','HEAD','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Accept'],
  optionsSuccessStatus: 200
});

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.get('/', openCors, (_req: Request, res: Response) => {
  res
    .status(200)
    .type('text/html')
    .send('<h1>Local AI Bridge v1.0.0</h1>');
});

app.use('/ai/search', strictCors, upload.any(), SearchRoute.router);
app.use('/ai/chat',   strictCors, upload.any(), ChatRoute.router);

app.use('\*\g', strictCors, (_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'InternalServerError' });
});

app.listen(PORT, () => {
  console.log(`[A.I. Bridge] Listening on http://${HOSTNAME}:${PORT}`);
});
