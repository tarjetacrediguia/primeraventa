// src/infrastructure/adapters/repository/ConfiguracionRepositoryAdapter.ts
import { ConfiguracionRepositoryPort } from "../../../application/ports/ConfiguracionRepositoryPort";
import { Configuracion } from "../../../domain/entities/Configuracion";
import { pool } from "../../config/Database/DatabaseDonfig";

export class ConfiguracionRepositoryAdapter implements ConfiguracionRepositoryPort {
    async obtenerConfiguracion(): Promise<Configuracion[]> {
        try {
            const query = 'SELECT clave, valor, descripcion, fecha_actualizacion FROM configuracion';
            const result = await pool.query(query);
            return result.rows.map(row => new Configuracion(
                row.clave,
                row.valor,
                row.descripcion,
                row.fecha_actualizacion
            ));
        } catch (error) {
            console.error('Error al obtener configuración:', error);
            throw new Error('Error al obtener configuración');
        }
    }
    async actualizarConfiguracion(clave: string, valor: any): Promise<Configuracion> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Verificar si existe la configuración
        const existsQuery = 'SELECT 1 FROM configuracion WHERE clave = $1';
        const existsResult = await client.query(existsQuery, [clave]);
        
        if (existsResult.rows.length === 0) {
            throw new Error(`Configuración con clave ${clave} no encontrada`);
        }

        // Actualizar el valor
        const updateQuery = `
            UPDATE configuracion 
            SET valor = $1, fecha_actualizacion = CURRENT_TIMESTAMP 
            WHERE clave = $2 
            RETURNING clave, valor, descripcion, fecha_actualizacion
        `;
        const result = await client.query(updateQuery, [valor, clave]);
        
        await client.query('COMMIT');
        
        const row = result.rows[0];
        return new Configuracion(
            row.clave,
            row.valor,
            row.descripcion,
            row.fecha_actualizacion
        );
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
    async crearConfiguracion(configuracion: Configuracion): Promise<Configuracion> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const insertQuery = `
                INSERT INTO configuracion (clave, valor, descripcion, fecha_actualizacion)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING clave, valor, descripcion, fecha_actualizacion
            `;
            const result = await client.query(insertQuery, [
                configuracion.clave,
                configuracion.valor,
                configuracion.descripcion
            ]);
            const row = result.rows[0];
            await client.query('COMMIT');
            return new Configuracion(
                row.clave,
                row.valor,
                row.descripcion,
                row.fecha_actualizacion
            );
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error al crear configuración:', error);
            throw error;
        } finally {
            client.release();
        }
    }
    async obtenerDiasExpiracion(): Promise<number> {
        const clave = 'dias_expiracion_solicitudes_iniciales';
        
        try {
            const query = 'SELECT valor FROM configuracion WHERE clave = $1';
            const result = await pool.query(query, [clave]);
            
            if (result.rows.length > 0) {
                return parseInt(result.rows[0].valor, 10);
            }
            
            // Valor por defecto si no existe en configuración
            return 30;
        } catch (error) {
            console.error('Error al obtener días de expiración:', error);
            return 30; // Valor por defecto en caso de error
        }
    }
}
