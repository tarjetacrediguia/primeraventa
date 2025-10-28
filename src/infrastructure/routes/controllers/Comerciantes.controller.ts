import { Request, Response } from 'express';
import { CreateComercianteUseCase } from '../../../application/use-cases/Comerciante/CreateComercianteUseCase';
import { ComercianteRepositoryAdapter } from '../../adapters/repository/ComercianteRepositoryAdapter';
import { ComercioRepositoryAdapter } from '../../adapters/repository/ComercioRepositoryAdapter';
import { UpdateComercianteUseCase } from '../../../application/use-cases/Comerciante/UpdateComercianteUseCase';

const comercianteRepository = new ComercianteRepositoryAdapter();

/**
 * Crea un nuevo comerciante.
 * @param req - Request de Express con los datos del comerciante en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el comerciante creado o un error en caso de fallo.
 */
export const createComerciante = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, email, password, telefono, numeroComercio } = req.body;

        const comercioRepository = new ComercioRepositoryAdapter();
        const useCase = new CreateComercianteUseCase(comercianteRepository, comercioRepository);
        
        const comerciante = await useCase.execute(
            nombre,
            apellido,
            email,
            password,
            telefono,
            numeroComercio
        );

        res.status(201).json({
            success: true,
            data: comerciante.toPlainObject()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error al crear el comerciante'
        });
    }
};

/**
 * Actualiza un comerciante existente.
 * @param req - Request de Express con el ID en params y los datos a actualizar en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el comerciante actualizado o un error en caso de fallo.
 */
export const updateComerciante = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const {
            nombre,
            apellido,
            telefono,
            numeroComercio
        } = req.body;

        // Validar que al menos un campo a actualizar esté presente
        if (!nombre && !apellido && !telefono && !numeroComercio) {
            return res.status(400).json({
                error: "Al menos un campo debe ser proporcionado para actualizar: nombre, apellido, telefono o numeroComercio"
            });
        }

        // Usar el caso de uso en lugar de interactuar directamente con el repositorio
        const comercianteRepository = new ComercianteRepositoryAdapter();
        const comercioRepository = new ComercioRepositoryAdapter(); // Asume que existe este adaptador
        const updateComercianteUseCase = new UpdateComercianteUseCase(comercianteRepository, comercioRepository);

        const comercianteActualizado = await updateComercianteUseCase.execute(
            id,
            nombre,
            apellido,
            telefono,
            numeroComercio
        );

        res.status(200).json(comercianteActualizado.toPlainObject());
    } catch (error) {
        console.error('Error al actualizar comerciante:', error);
        
        // Manejar diferentes tipos de errores con códigos de estado apropiados
        if (error instanceof Error) {
            if (error.message.includes("no encontrado")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({
            error: 'Error interno del servidor al actualizar el comerciante'
        });
    }
};

/**
 * Elimina un comerciante por su ID.
 * @param req - Request de Express con el ID en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un status 204 si se elimina correctamente o un error en caso de fallo.
 */
export const deleteComerciante = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await comercianteRepository.deleteComerciante(id);
        res.status(200).json({
            message: "Comerciante eliminado exitosamente"
        });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al eliminar el comerciante'
        });
    }
};

/**
 * Obtiene un comerciante por su ID.
 * @param req - Request de Express con el ID en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el comerciante encontrado o un error si no existe.
 */
export const getComerciante = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const comerciante = await comercianteRepository.getComercianteById(id);
        
        if (!comerciante) {
            throw new Error("Comerciante no encontrado");
        }

        res.status(200).json(comerciante.toPlainObject());
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener el comerciante'
        });
    }
};

/**
 * Lista todos los comerciantes registrados en el sistema.
 * @param req - Request de Express.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de comerciantes o un error en caso de fallo.
 */
export const listComerciantes = async (req: Request, res: Response) => {
    try {
        const comerciantes = await comercianteRepository.getAllComerciantes();
        res.status(200).json(comerciantes.map(comerciante => comerciante.toPlainObject()));
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al obtener los comerciantes'
        });
    }
}; 
