// src/infrastructure/routes/controllers/sistema.controller.ts
import { Request, Response } from 'express';

export const getVersion = (req: Request, res: Response) => {
  try {
    const version = process.env.VERSION || '1.0.0'; // Valor por defecto si no existe
    res.status(200).json({ version });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la versión' });
  }
};