import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { getCorsOrigins } from './config.js';
import errorHandler from './middleware/errorHandler.js';
import adminRouter from './modules/admin/index.js';
import authRouter from './modules/auth/index.js';
import eventRouter from './modules/events/index.js';
import marketRouter from './modules/market/index.js';
import newsRouter from './modules/news/index.js';
import videoRouter from './modules/videos/index.js';
import homepageRouter from './modules/homepage/index.js';
import userRouter from './modules/users/index.js';

export function createApp() {
  const app = express();
  const origins = getCorsOrigins();
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
  app.use(errorHandler);
  return app;
}
