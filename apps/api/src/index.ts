import 'dotenv/config';

import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { env } from '@sme-tv/config';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.API_CORS_ORIGIN ?? true }));
app.use(express.json());

app.get('/', (_request, response) => response.json({ name: 'SME-TV API', status: 'ok' }));
app.get('/api/health', (_request, response) => response.json({ success: true, message: 'SME-TV API is running' }));

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ success: false, message: 'Internal server error' });
};
app.use(errorHandler);

app.listen(env.apiPort, () => console.log(`SME-TV API listening on http://localhost:${env.apiPort}`));
