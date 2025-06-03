//src/infrastructure/server/error-handler.ts

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Manejo específico de errores de autenticación
  if (err.message.includes('Token') || err.message.includes('autorización')) {
    return res.status(401).json({
      error: err.message
    });
  }

  // Error por defecto
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};