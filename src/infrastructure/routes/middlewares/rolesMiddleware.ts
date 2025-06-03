import { Request, Response, NextFunction } from 'express';

export const esAdministrador = (req: Request, res: Response, next: NextFunction) => {
  console.log('Verificando rol de administrador...');
  console.log('Usuario autenticado:', req.user);
  
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  // Verificar rol de administrador
  if (req.user.rol !== 'analista') {
    console.log(`Rol actual: ${req.user.rol}, Rol requerido: analista`);
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }
  
  next();
};