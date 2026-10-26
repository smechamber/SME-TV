import 'dotenv/config';
import cors from 'cors';
import express, { type ErrorRequestHandler, type Request } from 'express';
import helmet from 'helmet';
import multer from 'multer';
import { z } from 'zod';
import adminRouter from './modules/admin/index.js';
import authRouter from './modules/auth/index.js';
import eventRouter from './modules/events/index.js';
import marketRouter from './modules/market/index.js';
import newsRouter from './modules/news/index.js';
import videoRouter from './modules/videos/index.js';
import homepageRouter from './modules/homepage/index.js';
import userRouter from './modules/users/index.js';

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const origins = (process.env.API_CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim());

if (process.env.NODE_ENV !== 'production' && !origins.includes('http://localhost:3001')) {
  origins.push('http://localhost:3001');
}

app.use(helmet());
app.use(
  cors({
    origin: (origin, done) =>
      !origin || origins.includes(origin)
        ? done(null, true)
        : done(new Error('Origin is not allowed')),
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (_request, response) => response.json({ name: 'SME-TV API', status: 'ok' }));
app.get('/api/health', (_request, response) =>
  response.json({ success: true, message: 'SME-TV API is running' }),
);

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', adminRouter);
app.use('/api', newsRouter);
app.use('/api', videoRouter);
app.use('/api', eventRouter);
app.use('/api', marketRouter);
app.use('/api', homepageRouter);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    response.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({
      success: false,
      message: error.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : 'Invalid multipart upload',
    });
    return;
  }

  if (error instanceof z.ZodError) {
    response.status(400).json({
      success: false,
      message: 'Invalid request',
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  ) {
    response.status(409).json({
      success: false,
      message: 'A record with this information already exists',
    });
    return;
  }

  console.error(error);
  response.status(500).json({ success: false, message: 'Internal server error' });
};

app.use(errorHandler);
app.listen(port, () => console.log(`SME-TV API listening on http://localhost:${port}`));
