// src/infrastructure/routes/controllers/Auth.controller.ts
import { Request, Response } from 'express';
import { LoginUseCase } from '../../../application/use-cases/autenticacion/LoginUseCase';
import { LogOutUseCase } from '../../../application/use-cases/autenticacion/LogOutUseCase';
import { ResetPwdUseCase } from '../../../application/use-cases/autenticacion/ResetPwdUseCase';
import { AuthAdapter } from '../../adapters/authorization/AuthAdapter';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const authRepository = new AuthAdapter();
    const useCase = new LoginUseCase(authRepository);
    const result = await useCase.execute(email, password);
    
    res.status(200).json({
      token: result.token,
      user: {
        id: result.usuario.getId(),
        nombre: result.usuario.getNombre(),
        apellido: result.usuario.getApellido(),
        email: result.usuario.getEmail(),
        rol: result.rol // Usamos el rol que devuelve el caso de uso
      }
    });
  } catch (error: any) {
    if (error.message === 'Credenciales inválidas') {
      res.status(401).json({ error: error.message });
    } else if (error.message === 'Email y contraseña son obligatorios') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    
    const authRepository = new AuthAdapter();
    const useCase = new LogOutUseCase(authRepository);
    await useCase.execute(token);
    
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error: any) {
    if (error.message === 'Token es requerido para cerrar sesión') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    const authRepository = new AuthAdapter();
    const useCase = new ResetPwdUseCase(authRepository);
    await useCase.execute(token, newPassword);
    
    res.status(200).json({ 
      message: 'Contraseña restablecida exitosamente' 
    });
  } catch (error: any) {
    if (error.message === 'Token y nueva contraseña son obligatorios') {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'La contraseña debe tener al menos 8 caracteres') {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'Token inválido o expirado') {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};