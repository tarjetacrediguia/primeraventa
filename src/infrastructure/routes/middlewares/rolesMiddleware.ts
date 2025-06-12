// src/infrastructure/routes/middlewares/roles.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const esAdministrador = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user); // Para depuración, ver el usuario autenticado
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  // Verificar rol de administrador
<<<<<<< HEAD
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ 
      error: 'Acceso no autorizado. Se requiere rol de administrador' 
    });
=======
  if (req.user.rol !== 'analista') {
    console.log(`Rol actual: ${req.user.rol}, Rol requerido: analista`);
    return res.status(403).json({ error: 'Acceso no autorizado' });
>>>>>>> origin/jurgen
  }
  
  next();
};
// Verifica si el usuario es un comerciante
export const esComerciante = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (req.user.rol !== 'comerciante') {
    console.log(req.user); // Para depuración, ver el usuario autenticado
    return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de comerciante' });
  }
  next();
};
//Verifica si el usuario es un analista
export const esAnalista = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (req.user.rol !== 'analista') {
    return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de analista' });
  }
  next();
};
// Verifica si el usuario es un comerciante o analista
export const esComercianteOAnalista = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (req.user.rol !== 'comerciante' && req.user.rol !== 'analista') {
    return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de comerciante o analista' });
  }
  next();
};