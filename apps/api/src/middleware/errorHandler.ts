import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error('Error:', err.message);

  if (err.name === 'ZodError') {
    res.status(400).json({
      error: 'Validierungsfehler',
      details: JSON.parse(err.message),
    });
    return;
  }

  res.status(500).json({
    error: 'Interner Serverfehler',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}
