// src/infrastructure/adapters/repository/ComercioRepositoryAdapter.ts
import { ComercioRepositoryPort } from "../../../application/ports/ComercioRepositoryPort";
import { Comercio } from "../../../domain/entities/Comercio";
import { pool } from "../../config/Database/DatabaseDonfig";

export class ComercioRepositoryAdapter implements ComercioRepositoryPort {
    
    async saveComercio(comercio: Comercio): Promise<Comercio> {
        const query = `
            INSERT INTO comercios (numero_comercio, nombre_comercio, cuil, direccion_comercio)
            VALUES ($1, $2, $3, $4)
            RETURNING fecha_creacion, fecha_actualizacion
        `;
        
        const values = [
            comercio.getNumeroComercio(),
            comercio.getNombreComercio(),
            comercio.getCuil(),
            comercio.getDireccionComercio()
        ];

        const result = await pool.query(query, values);
        const row = result.rows[0];
        
        return new Comercio({
            numeroComercio: comercio.getNumeroComercio(),
            nombreComercio: comercio.getNombreComercio(),
            cuil: comercio.getCuil(),
            direccionComercio: comercio.getDireccionComercio(),
            fechaCreacion: row.fecha_creacion,
            fechaActualizacion: row.fecha_actualizacion
        });
    }

    async getComercioByNumero(numeroComercio: string): Promise<Comercio | null> {
        const query = `
            SELECT numero_comercio, nombre_comercio, cuil, direccion_comercio, 
                   fecha_creacion, fecha_actualizacion
            FROM comercios 
            WHERE numero_comercio = $1
        `;
        
        const result = await pool.query(query, [numeroComercio]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComercio(result.rows[0]);
    }

    async findByCuil(cuil: string): Promise<Comercio | null> {
        const query = `
            SELECT numero_comercio, nombre_comercio, cuil, direccion_comercio,
                   fecha_creacion, fecha_actualizacion
            FROM comercios 
            WHERE cuil = $1
        `;
        
        const result = await pool.query(query, [cuil]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComercio(result.rows[0]);
    }

    async updateComercio(comercio: Comercio): Promise<Comercio> {
        const query = `
            UPDATE comercios 
            SET nombre_comercio = $1, direccion_comercio = $2,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE numero_comercio = $3
            RETURNING *
        `;
        
        const values = [
            comercio.getNombreComercio(),
            comercio.getDireccionComercio(),
            comercio.getNumeroComercio()
        ];

        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            throw new Error("Comercio no encontrado");
        }
        
        return this.mapRowToComercio(result.rows[0]);
    }

    async deleteComercio(numeroComercio: string): Promise<void> {
        await pool.query('DELETE FROM comercios WHERE numero_comercio = $1', [numeroComercio]);
    }

    async getAllComercios(): Promise<Comercio[]> {
        const query = `
            SELECT numero_comercio, nombre_comercio, cuil, direccion_comercio,
                   fecha_creacion, fecha_actualizacion
            FROM comercios 
            ORDER BY nombre_comercio
        `;
        
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToComercio(row));
    }

    private mapRowToComercio(row: any): Comercio {
        return new Comercio({
            numeroComercio: row.numero_comercio,
            nombreComercio: row.nombre_comercio,
            cuil: row.cuil,
            direccionComercio: row.direccion_comercio,
            fechaCreacion: row.fecha_creacion,
            fechaActualizacion: row.fecha_actualizacion
        });
    }
}