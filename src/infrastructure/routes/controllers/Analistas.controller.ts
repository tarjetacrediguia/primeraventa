//src/infrastructure/routes/controllers/Analistas.controller.ts
import { Request, Response } from 'express';
import { CreateAnalistaUseCase } from '../../../application/use-cases/Analista/CreateAnalistaUseCase';
import { DeleteAnalistaUseCase } from '../../../application/use-cases/Analista/DeleteAnalistaUseCase';
import { GetAnalistaByIdUseCase } from '../../../application/use-cases/Analista/GetAnalistaByIdUseCase';
import { GetAllAnalistaUseCase } from '../../../application/use-cases/Analista/GetAllAnalistaUseCase';
import { UpdateAnalistaUseCase } from '../../../application/use-cases/Analista/UpdateAnalistaUseCase';
import { AnalistaRepositoryAdapter } from '../../adapters/repository/AnalistaRepositoryAdapter';

const analistaRepository = new AnalistaRepositoryAdapter();

/**
 * Crea un nuevo analista.
 * @param req - Request de Express con los datos del analista en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el analista creado o un error en caso de fallo.
 */
export const createAnalista = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password, telefono, permisos } = req.body;
    
    const useCase = new CreateAnalistaUseCase(analistaRepository);
    const analista = await useCase.execute(
      nombre,
      apellido,
      email,
      password,
      telefono
    );
    
    res.status(201).json(analista.toPlainObject());
  } catch (error: any) {
    console.error('Error al crear analista:', error);
    if (error.message === "Todos los campos son obligatorios") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al crear analista' });
    }
  }
};

/**
 * Actualiza un analista existente.
 * @param req - Request de Express con el ID en params y los datos a actualizar en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el analista actualizado o un error en caso de fallo.
 */
export const updateAnalista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono } = req.body;
    
    const useCase = new UpdateAnalistaUseCase(analistaRepository);
    const analistaActualizado = await useCase.execute(
      Number(id),
        nombre,
        apellido,
        telefono
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

/**
 * Elimina un analista por su ID.
 * @param req - Request de Express con el ID en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un status 204 si se elimina correctamente o un error en caso de fallo.
 */
export const deleteAnalista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const useCase = new DeleteAnalistaUseCase(analistaRepository);
    await useCase.execute(Number(id));
    
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Analista no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar analista' });
    }
  }
};

/**
 * Obtiene un analista por su ID.
 * @param req - Request de Express con el ID en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el analista encontrado o un error si no existe.
 */
export const getAnalista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const useCase = new GetAnalistaByIdUseCase(analistaRepository);
    const analista = await useCase.execute(Number(id));
    
    res.status(200).json(analista.toPlainObject());
  } catch (error: any) {
    if (error.message === "Analista no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al obtener analista' });
    }
  }
};

/**
 * Lista todos los analistas registrados en el sistema.
 * @param req - Request de Express.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de analistas o un error en caso de fallo.
 */
export const listAnalistas = async (req: Request, res: Response) => {
  try {
    const useCase = new GetAllAnalistaUseCase(analistaRepository);
    const analistas = await useCase.execute();
    
    res.status(200).json(analistas.map(analista => analista.toPlainObject()));
  } catch (error: any) {
    res.status(500).json({ error: 'Error al listar analistas' });
  }
};
