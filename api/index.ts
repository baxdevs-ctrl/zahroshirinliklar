import express from 'express';
import { apiRouter } from '../src/server/api.ts';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Vercel routes /api/* to this handler
app.use('/api', apiRouter);

export default app;
