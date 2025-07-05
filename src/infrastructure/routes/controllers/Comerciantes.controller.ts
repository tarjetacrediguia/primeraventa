import { Request, Response } from 'express';
import { CreateComercianteUseCase } from '../../../application/use-cases/Comerciante/CreateComercianteUseCase';
import { ComercianteRepositoryAdapter } from '../../adapters/repository/ComercianteRepositoryAdapter';

const comercianteRepository = new ComercianteRepositoryAdapter();

/**
 * Crea un nuevo comerciante.
 * @param req - Request de Express con los datos del comerciante en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el comerciante creado o un error en caso de fallo.
 */
export const createComerciante = async (req: Request, res: Response) => {
    try {
        const {
            nombre,
            apellido,
            email,
            password,
            telefono,
            nombreComercio,
            cuil,
            direccionComercio
        } = req.body;


        if (!nombreComercio) {
            throw new Error("El nombre del comercio es obligatorio");
        }

        const useCase = new CreateComercianteUseCase(comercianteRepository);
        const comerciante = await useCase.execute(
            nombre,
            apellido,
            email,
            password,
            telefono,
            nombreComercio,
            cuil,
            direccionComercio
        );

        res.status(201).json(comerciante.toPlainObject());
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
            nombreComercio,
            direccionComercio
        } = req.body;

        if (!nombre || !apellido || !telefono || !nombreComercio || !direccionComercio) {
            throw new Error("Todos los campos son obligatorios");
        }

        const comerciante = await comercianteRepository.getComercianteById(id);
        if (!comerciante) {
            throw new Error("Comerciante no encontrado");
        }

        // Actualizar solo los campos proporcionados
        if (nombre) comerciante.setNombre(nombre);
        if (apellido) comerciante.setApellido(apellido);
        if (telefono) comerciante.setTelefono(telefono);
        if (nombreComercio) comerciante.setNombreComercio(nombreComercio);
        if (direccionComercio) comerciante.setDireccionComercio(direccionComercio);

        const comercianteActualizado = await comercianteRepository.updateComerciante(comerciante);

        res.status(200).json(comercianteActualizado.toPlainObject());
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al actualizar el comerciante'
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
