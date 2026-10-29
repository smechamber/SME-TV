import { type ErrorRequestHandler } from 'express';
import multer from 'multer';
import { z } from 'zod';

const isUniqueConstraintError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === 'P2002';

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    response.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({
      success: false,
      message: error.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : 'Invalid multipart upload',
    });
    return;
  }
  if (error instanceof z.ZodError) {
    response
      .status(400)
      .json({ success: false, message: 'Invalid request', errors: error.flatten().fieldErrors });
    return;
  }
  if (isUniqueConstraintError(error)) {
    response
      .status(409)
      .json({ success: false, message: 'A record with this information already exists' });
    return;
  }
  console.error(error);
  response.status(500).json({ success: false, message: 'Internal server error' });
};

export default errorHandler;
