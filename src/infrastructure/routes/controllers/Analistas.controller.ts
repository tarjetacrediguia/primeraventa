//src/infrastructure/routes/controllers/Analistas.controller.ts
import { Request, Response } from 'express';
import { CreateAnalistaUseCase } from '../../../application/use-cases/Analista/CreateAnalistaUseCase';
import { DeleteAnalistaUseCase } from '../../../application/use-cases/Analista/DeleteAnalistaUseCase';
import { GetAnalistaByIdUseCase } from '../../../application/use-cases/Analista/GetAnalistaByIdUseCase';
import { GetAllAnalistaUseCase } from '../../../application/use-cases/Analista/GetAllAnalistaUseCase';
import { UpdateAnalistaUseCase } from '../../../application/use-cases/Analista/UpdateAnalistaUseCase';
import { AnalistaRepositoryAdapter } from '../../adapters/repository/AnalistaRepositoryAdapter';

const analistaRepository = new AnalistaRepositoryAdapter();

export const createAnalista = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password, telefono, permisos } = req.body;
    
    const useCase = new CreateAnalistaUseCase(analistaRepository);
    const nuevoAnalista = await useCase.execute(
      nombre,
      apellido,
      email,
      password,
      telefono,
      permisos || [] // Permisos opcionales
    );
    
    res.status(201).json(nuevoAnalista.toPlainObject());
  } catch (error: any) {
    console.error('Error al crear analista:', error);
    if (error.message === "Todos los campos son obligatorios") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al crear analista' });
    }
  }
};

export const updateAnalista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, permisos } = req.body;
    
    const useCase = new UpdateAnalistaUseCase(analistaRepository);
    const analistaActualizado = await useCase.execute(
      id,
      nombre,
      apellido,
      email,
      telefono,
      permisos
    );
    
    res.status(200).json(analistaActualizado.toPlainObject());
  } catch (error: any) {
    if (error.message === "Analista no encontrado") {
      res.status(404).json({ error: error.message });
    } else if (error.message === "Todos los campos son obligatorios") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar analista' });
    }
  }
};

export const deleteAnalista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const useCase = new DeleteAnalistaUseCase(analistaRepository);
    await useCase.execute(id);
    
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Analista no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar analista' });
    }
  }
};

export const getAnalista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const useCase = new GetAnalistaByIdUseCase(analistaRepository);
    const analista = await useCase.execute(id);
    
    res.status(200).json(analista.toPlainObject());
  } catch (error: any) {
    if (error.message === "Analista no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al obtener analista' });
    }
  }
};

export const listAnalistas = async (req: Request, res: Response) => {
  try {
    const useCase = new GetAllAnalistaUseCase(analistaRepository);
    const analistas = await useCase.execute();
    
    res.status(200).json(analistas.map(analista => analista.toPlainObject()));
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar analistas' });
  }
};