import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        rol: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/API/v1/auth/login',
    '/API/v1/auth/forgot-password',
    '/API/v1/auth/reset-password',
    '/API/v1/sistema/health'
  ];

  if (publicRoutes.includes(req.originalUrl)) {
    return next();
  }

  // Obtener información del usuario desde el body
  if (!req.body.user || !req.body.user.rol) {
    return res.status(401).json({ error: 'Información de usuario no proporcionada en el body' });
  }

  // Establecer información del usuario en el request
  req.user = {
    id: req.body.user.id || 'default-id', // Asegúrate de enviar id en el body
    rol: req.body.user.rol
  };

  next();
};