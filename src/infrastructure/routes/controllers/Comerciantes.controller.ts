import { Request, Response } from 'express';
import { CreateComercianteUseCase } from '../../../application/use-cases/Comerciante/CreateComercianteUseCase';
import { ComercianteRepositoryAdapter } from '../../adapters/repository/ComercianteRepositoryAdapter';

const comercianteRepository = new ComercianteRepositoryAdapter();

export const createComerciante = async (req: Request, res: Response) => {
    try {
        const {
            nombre,
            apellido,
            email,
            password,
            telefono,
            nombreComercio,
            nombre_comercio,
            cuil,
            direccionComercio,
            permisos
        } = req.body;

        const nombreComercioFinal = nombreComercio || nombre_comercio;

        if (!nombreComercioFinal) {
            throw new Error("El nombre del comercio es obligatorio");
        }

        const useCase = new CreateComercianteUseCase(comercianteRepository);
        const comerciante = await useCase.execute(
            nombre,
            apellido,
            email,
            password,
            telefono,
            nombreComercioFinal,
            cuil,
            direccionComercio,
            permisos
        );

        res.status(201).json({
            success: true,
            data: comerciante
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error al crear el comerciante'
        });
    }
};

export const updateComerciante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            apellido,
            email,
            telefono,
            nombreComercio,
            nombre_comercio,
            cuil,
            direccionComercio,
            permisos
        } = req.body;

        const nombreComercioFinal = nombreComercio || nombre_comercio;

        const comerciante = await comercianteRepository.getComercianteById(id);
        if (!comerciante) {
            throw new Error("Comerciante no encontrado");
        }

        // Actualizar solo los campos proporcionados
        if (nombre) comerciante.setNombre(nombre);
        if (apellido) comerciante.setApellido(apellido);
        if (email) comerciante.setEmail(email);
        if (telefono) comerciante.setTelefono(telefono);
        if (nombreComercioFinal) comerciante.setNombreComercio(nombreComercioFinal);
        if (cuil) comerciante.setCuil(cuil);
        if (direccionComercio) comerciante.setDireccionComercio(direccionComercio);
        if (permisos) comerciante.setPermisos(permisos);

        const comercianteActualizado = await comercianteRepository.updateComerciante(comerciante);

        res.status(200).json({
            success: true,
            data: comercianteActualizado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error al actualizar el comerciante'
        });
    }
};

export const deleteComerciante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await comercianteRepository.deleteComerciante(id);
        res.status(200).json({
            success: true,
            message: "Comerciante eliminado exitosamente"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error al eliminar el comerciante'
        });
    }
};

export const getComerciante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const comerciante = await comercianteRepository.getComercianteById(id);
        
        if (!comerciante) {
            throw new Error("Comerciante no encontrado");
        }

        res.status(200).json({
            success: true,
            data: comerciante
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener el comerciante'
        });
    }
};

export const listComerciantes = async (req: Request, res: Response) => {
    try {
        const comerciantes = await comercianteRepository.getAllComerciantes();
        res.status(200).json({
            success: true,
            data: comerciantes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener los comerciantes'
        });
    }
}; 