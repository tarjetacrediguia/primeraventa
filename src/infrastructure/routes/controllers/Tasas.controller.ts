// src/infrastructure/controllers/Tasas.controller.ts

import { Request, Response } from 'express';
import { TasasRepositoryAdapter } from '../../adapters/repository/TasasRepositoryAdapter';
import { CreateConjuntoTasasUseCase } from '../../../application/use-cases/Tasas/CreateConjuntoTasasUseCase';
import { UpdateConjuntoTasasUseCase } from '../../../application/use-cases/Tasas/UpdateConjuntoTasasUseCase';
import { AgregarTasaAConjuntoUseCase } from '../../../application/use-cases/Tasas/AgregarTasaAConjuntoUseCase';
import { ActivarConjuntoTasasUseCase } from '../../../application/use-cases/Tasas/ActivarConjuntoTasasUseCase';
import { ListarConjuntosTasasUseCase } from '../../../application/use-cases/Tasas/ListarConjuntosTasasUseCase';
import { EliminarConjuntoTasasUseCase } from '../../../application/use-cases/Tasas/EliminarConjuntoTasasUseCase';
import { ObtenerTasaActivaPorCodigoUseCase } from '../../../application/use-cases/Tasas/ObtenerTasaActivaPorCodigoUseCase';

const repository = new TasasRepositoryAdapter();

export const createConjuntoTasas = async (req: Request, res: Response) => {
    try {
        const { 
            nombre, 
            descripcion, 
            activo,
            tasas
        } = req.body;
        const tasasMap = new Map<string, { valor: number; descripcion: string }>();
        Object.entries(tasas).forEach(([codigo, tasaData]) => {
            const { valor, descripcion } = tasaData as any;
            tasasMap.set(codigo, { valor, descripcion });
        });
        const useCase = new CreateConjuntoTasasUseCase(repository);
        const conjunto = await useCase.execute(
            nombre,
            descripcion,
            activo,
            tasasMap
        );
        
        res.status(201).json(conjunto.toPlainObject());
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
    }
};

export const getTasaActivaByCodigo = async (req: Request, res: Response) => {
    try {
        const { codigo } = req.params;
        console.log('🔍 Buscando tasa activa con código:', codigo);
        
        const useCase = new ObtenerTasaActivaPorCodigoUseCase(repository);
        const tasa = await useCase.execute(codigo);

        if (!tasa) {
            return res.status(404).json({ error: 'Tasa no encontrada' });
        }
        
        res.status(200).json({
            codigo,
            valor: tasa.valor,
            descripcion: tasa.descripcion,
            mensaje: 'Tasa obtenida exitosamente'
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('no encontrada')) {
            return res.status(404).json({ error: errorMessage });
        }
        
        if (errorMessage.includes('requerido')) {
            return res.status(400).json({ error: errorMessage });
        }
        
        res.status(500).json({ error: errorMessage });
    }
};

export const updateConjuntoTasas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            nombre, 
            descripcion, 
            activo, 
            tasas
        } = req.body;
        const tasasMap = new Map<string, { valor: number; descripcion: string }>();
        Object.entries(tasas).forEach(([codigo, tasaData]) => {
            const { valor, descripcion } = tasaData as any;
            tasasMap.set(codigo, { valor, descripcion });
        });
        const useCase = new UpdateConjuntoTasasUseCase(repository);
        const conjunto = await useCase.execute(
            parseInt(id),
            nombre,
            descripcion,
            activo,
            tasasMap
        );
        
        res.status(200).json(conjunto.toPlainObject());
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
    }
};

export const agregarTasaAConjunto = async (req: Request, res: Response) => {
    try {
        const { conjuntoId } = req.params;
        const { codigo, valor, descripcion } = req.body;
        
        const useCase = new AgregarTasaAConjuntoUseCase(repository);
        await useCase.execute(
            parseInt(conjuntoId),
            codigo,
            valor,
            descripcion
        );
        
        res.status(200).json({ message: 'Tasa agregada al conjunto' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
    }
};

export const getConjuntoTasas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const conjunto = await repository.findConjuntoTasasById(parseInt(id));
        
        if (!conjunto) {
            return res.status(404).json({ error: 'Conjunto no encontrado' });
        }
        
        res.status(200).json(conjunto.toPlainObject());
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

export const activateConjuntoTasas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const useCase = new ActivarConjuntoTasasUseCase(repository);
        await useCase.execute(parseInt(id));
        res.status(200).json({ message: 'Conjunto activado exitosamente' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
    }
};

export const listConjuntosTasas = async (req: Request, res: Response) => {
    try {
        const useCase = new ListarConjuntosTasasUseCase(repository);
        const conjuntos = await useCase.execute();
        res.status(200).json(conjuntos.map(c => c.toPlainObject()));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

export const deleteConjuntoTasas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const useCase = new EliminarConjuntoTasasUseCase(repository);
        await useCase.execute(parseInt(id));
        res.status(204).send(); // 204 No Content
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
    }
};