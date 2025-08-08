// src/infrastructure/routes/controllers/Administradores.controller.ts

/**
 * CONTROLADOR: Administradores
 *
 * Este archivo contiene los controladores para la gestión de administradores en el sistema.
 * Permite crear, actualizar, eliminar, obtener y listar administradores.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */
import { Request, Response } from 'express';
import { CreateAdminUseCase } from '../../../application/use-cases/Administrador/CreateAdminUseCase';
import { DeleteAdminUseCase } from '../../../application/use-cases/Administrador/DeleteAdminUseCase';
import { GetAdminByIdUseCase } from '../../../application/use-cases/Administrador/GetAdminByIdUseCase';
import { GetAllAdminUseCase } from '../../../application/use-cases/Administrador/GetAllAdminUseCase';
import { UpdateAdminUseCase } from '../../../application/use-cases/Administrador/UpdateAdminUseCase';
import { AdministradorRepositoryAdapter } from '../../adapters/repository/AdministradorRepositoryAdapter';

const administradorRepository = new AdministradorRepositoryAdapter();

/**
 * Crea un nuevo administrador.
 * @param req - Request de Express con los datos del administrador en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el administrador creado o un error en caso de fallo.
 */
export const createAdministrador = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;
    
    const useCase = new CreateAdminUseCase(administradorRepository);
    const nuevoAdmin = await useCase.execute(
      nombre,
      apellido,
      email,
      password,
      telefono
    );
    
    res.status(201).json(nuevoAdmin.toPlainObject());
  } catch (error: any) {
    console.error('Error al crear administrador:', error);
    if (error.message === "Todos los campos son obligatorios") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al crear administrador' });
    }
  }
};

/**
 * Actualiza un administrador existente.
 * @param req - Request de Express con el ID en params y los datos a actualizar en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el administrador actualizado o un error en caso de fallo.
 */
export const updateAdministrador = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nombre, apellido, telefono } = req.body;
    
    const useCase = new UpdateAdminUseCase(administradorRepository);
    const adminActualizado = await useCase.execute(
      id,
      nombre,
      apellido,
      telefono
    );
    
    res.status(200).json(adminActualizado.toPlainObject());
  } catch (error: any) {
    if (error.message === "Administrador no encontrado") {
      res.status(404).json({ error: error.message });
    } else if (error.message === "Todos los campos son obligatorios") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar administrador' });
    }
  }
};

/**
 * Elimina un administrador por su ID.
 * @param req - Request de Express con el ID en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un status 204 si se elimina correctamente o un error en caso de fallo.
 */
export const deleteAdministrador = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    const useCase = new DeleteAdminUseCase(administradorRepository);
    const response = await useCase.execute(id);
    
    res.status(204).send(response);
  } catch (error: any) {
    if (error.message === "Administrador no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar administrador' });
    }
  }
};

/**
 * Obtiene un administrador por su ID.
 * @param req - Request de Express con el ID en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el administrador encontrado o un error si no existe.
 */
export const getAdministrador = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    const useCase = new GetAdminByIdUseCase(administradorRepository);
    const admin = await useCase.execute(id);
    
    res.status(200).json(admin.toPlainObject());
  } catch (error: any) {
    if (error.message === "Administrador no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al obtener administrador' });
    }
  }
};

/**
 * Lista todos los administradores registrados en el sistema.
 * @param req - Request de Express.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de administradores o un error en caso de fallo.
 */
export const listAdministradores = async (req: Request, res: Response) => {
  try {
    const useCase = new GetAllAdminUseCase(administradorRepository);
    const administradores = await useCase.execute();
    
    res.status(200).json(administradores.map(admin => admin.toPlainObject()));
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar administradores' });
  }
};
