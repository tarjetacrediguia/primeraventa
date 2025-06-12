// src/infrastructure/routes/controllers/Administradores.controller.ts
import { Request, Response } from 'express';
import { CreateAdminUseCase } from '../../../application/use-cases/Administrador/CreateAdminUseCase';
import { DeleteAdminUseCase } from '../../../application/use-cases/Administrador/DeleteAdminUseCase';
import { GetAdminByIdUseCase } from '../../../application/use-cases/Administrador/GetAdminByIdUseCase';
import { GetAllAdminUseCase } from '../../../application/use-cases/Administrador/GetAllAdminUseCase';
import { UpdateAdminUseCase } from '../../../application/use-cases/Administrador/UpdateAdminUseCase';
import { AdministradorRepositoryAdapter } from '../../adapters/repository/AdministradorRepositoryAdapter';

const administradorRepository = new AdministradorRepositoryAdapter();

export const createAdministrador = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password, telefono, permisos } = req.body;
    
    const useCase = new CreateAdminUseCase(administradorRepository);
    const nuevoAdmin = await useCase.execute(
      nombre,
      apellido,
      email,
      password,
      telefono,
      permisos || [] // Permisos opcionales
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

export const updateAdministrador = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nombre, apellido, email, telefono, permisos } = req.body;
    
    const useCase = new UpdateAdminUseCase(administradorRepository);
    const adminActualizado = await useCase.execute(
      id,
      nombre,
      apellido,
      email,
      telefono,
      permisos
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

export const deleteAdministrador = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    const useCase = new DeleteAdminUseCase(administradorRepository);
    await useCase.execute(id);
    
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Administrador no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar administrador' });
    }
  }
};

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

export const listAdministradores = async (req: Request, res: Response) => {
  try {
    const useCase = new GetAllAdminUseCase(administradorRepository);
    const administradores = await useCase.execute();
    
    res.status(200).json(administradores.map(admin => admin.toPlainObject()));
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar administradores' });
  }
};