// src/infrastructure/routes/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthAdapter } from '../../adapters/authorization/AuthAdapter';
import { pool } from '../../config/Database/DatabaseDonfig';

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

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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

  // Verificar token en el encabezado Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o formato inválido' });
  }

  const token = authHeader.split(' ')[1];
  const authAdapter = new AuthAdapter();

  try {
    // Verificar token en la base de datos
    const sessionResult = await pool.query(
      `SELECT s.*, u.rol 
       FROM sesiones s
       JOIN usuarios u ON s.usuario_id = u.id
       WHERE s.token = $1 AND s.activa = TRUE AND s.fecha_expiracion > NOW()`,
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Token inválido o sesión expirada' });
    }

    const session = sessionResult.rows[0];
    
    // Establecer información del usuario en el request
    req.user = {
      id: session.usuario_id.toString(),
      rol: session.rol
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error de autenticación' });
  }
};
