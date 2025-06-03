// src/infrastructure/routes/middlewares/roles.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const esAdministrador = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user); // Para depuración, ver el usuario autenticado
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  // Verificar rol de administrador
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ 
      error: 'Acceso no autorizado. Se requiere rol de administrador' 
    });
  }
  
  next();
};