// src/infrastructure/routes/controllers/Auth.controller.ts

/**
 * CONTROLADOR: Autenticación
 *
 * Este archivo contiene los controladores para la autenticación de usuarios en el sistema.
 * Permite el login, el restablecimiento de contraseña y la verificación de tokens.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */
import { Request, Response } from 'express';
import { LoginUseCase } from '../../../application/use-cases/autenticacion/LoginUseCase';
import { LogOutUseCase } from '../../../application/use-cases/autenticacion/LogOutUseCase';
import { ResetPwdUseCase } from '../../../application/use-cases/autenticacion/ResetPwdUseCase';
import { AuthAdapter } from '../../adapters/authorization/AuthAdapter';

/**
 * Realiza el login de un usuario.
 * @param req - Request de Express con las credenciales en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el token de autenticación o un error en caso de fallo.
 */
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

/**
 * Restablece la contraseña de un usuario.
 * @param req - Request de Express con el token y la nueva contraseña en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un mensaje de éxito o un error en caso de fallo.
 */
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
