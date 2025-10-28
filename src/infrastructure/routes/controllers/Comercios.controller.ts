// src/infrastructure/routes/controllers/Comercios.controller.ts
import { Request, Response } from 'express';
import { CreateComercioUseCase } from '../../../application/use-cases/Comercio/CreateComercioUseCase';
import { GetComercioUseCase } from '../../../application/use-cases/Comercio/GetComercioUseCase';
import { UpdateComercioUseCase } from '../../../application/use-cases/Comercio/UpdateComercioUseCase';
import { DeleteComercioUseCase } from '../../../application/use-cases/Comercio/DeleteComercioUseCase';
import { ListComerciosUseCase } from '../../../application/use-cases/Comercio/ListComerciosUseCase';
import { ComercioRepositoryAdapter } from '../../adapters/repository/ComercioRepositoryAdapter';
import { GetPlanesDeCuotasUseCase } from '../../../application/use-cases/Eureka/GetPlanesDeCuotasUseCase';
import { EurekaAdapter } from '../../adapters/eureka/eurekaAdapter';

const comercioRepository = new ComercioRepositoryAdapter();
const eurekaAdapter = new EurekaAdapter();

export const createComercio = async (req: Request, res: Response) => {
    try {
        const { numeroComercio, nombreComercio, cuil, direccionComercio } = req.body;

        const useCase = new CreateComercioUseCase(comercioRepository);
        const comercio = await useCase.execute(numeroComercio, nombreComercio, cuil, direccionComercio);

        res.status(201).json(comercio.toPlainObject());
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al crear el comercio'
        });
    }
};

export const getComercio = async (req: Request, res: Response) => {
    try {
        const { numeroComercio } = req.params;
        
        const useCase = new GetComercioUseCase(comercioRepository);
        const comercio = await useCase.execute(numeroComercio);

        res.status(200).json(comercio.toPlainObject());
    } catch (error) {
        if (error instanceof Error && error.message === "Comercio no encontrado") {
            return res.status(404).json("Comercio no encontrado");
        }
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al obtener el comercio'
        });
    }
};

export const updateComercio = async (req: Request, res: Response) => {
    try {
        const { numeroComercio } = req.params;
        const { nombreComercio, direccionComercio } = req.body;

        const useCase = new UpdateComercioUseCase(comercioRepository);
        const comercioActualizado = await useCase.execute(numeroComercio, nombreComercio, direccionComercio);

        res.status(200).json(comercioActualizado.toPlainObject());
    } catch (error) {
        if (error instanceof Error && error.message === "Comercio no encontrado") {
            return res.status(404).json({
                error: "Comercio no encontrado"
            });
        }
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al actualizar el comercio'
        });
    }
};

export const deleteComercio = async (req: Request, res: Response) => {
    try {
        const { numeroComercio } = req.params;
        
        const useCase = new DeleteComercioUseCase(comercioRepository);
        await useCase.execute(numeroComercio);
        
        res.status(200).json("Comercio eliminado exitosamente");
    } catch (error) {
        if (error instanceof Error && error.message === "Comercio no encontrado") {
            return res.status(404).json({
                error: "Comercio no encontrado"
            });
        }
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al eliminar el comercio'
        });
    }
};

export const listComercios = async (req: Request, res: Response) => {
    try {
        const useCase = new ListComerciosUseCase(comercioRepository);
        const comercios = await useCase.execute();
        
        res.status(200).json(
            comercios.map(comercio => comercio.toPlainObject())
        );
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al obtener los comercios'
        });
    }
};

export const getPlanesDeCuotas = async (req: Request, res: Response) => {
    try {
        const { numeroComercio } = req.params;
        const { importe } = req.query;

        if (!importe) {
            return res.status(400).json({
                error: "El parámetro 'importe' es requerido"
            });
        }

        const importeNumber = Number(importe);
        if (isNaN(importeNumber) || importeNumber <= 0) {
            return res.status(400).json({
                error: "El importe debe ser un número mayor a 0"
            });
        }

        const useCase = new GetPlanesDeCuotasUseCase(eurekaAdapter);
        const planes = await useCase.execute({
            nroComercio: numeroComercio,
            importe: importeNumber
        });

        res.status(200).json(planes);
    } catch (error) {
        console.error("Error en getPlanesDeCuotas:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Error al obtener los planes de cuotas'
        });
    }
};