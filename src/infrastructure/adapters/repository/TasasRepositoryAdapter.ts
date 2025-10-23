// src/infrastructure/adapters/repository/tasasRepositoryAdapter.ts

import { Pool, PoolClient } from 'pg';
import { TasasRepositoryPort } from "../../../application/ports/TasasRepositoryPort";
import { ConjuntoTasas } from "../../../domain/entities/ConjuntoTasas";
import { pool } from "../../config/Database/DatabaseDonfig";

export class TasasRepositoryAdapter implements TasasRepositoryPort {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async findTasaActivaByCodigo(codigo: string): Promise<{ valor: number; descripcion: string } | null> {
    const client = await this.pool.connect();
    try {
        const query = `
            SELECT t.valor, t.descripcion
            FROM tasas t
            JOIN conjuntos_tasas ct ON t.conjunto_id = ct.id
            WHERE ct.activo = true AND t.codigo = $1
        `;
        const result = await client.query(query, [codigo]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        return {
            valor: parseFloat(row.valor),
            descripcion: row.descripcion
        };
    } finally {
        client.release();
    }
}

    async createConjuntoTasas(conjunto: ConjuntoTasas): Promise<ConjuntoTasas> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            
            if (conjunto.activo) {
                await client.query('UPDATE conjuntos_tasas SET activo = false');
            }

            const query = `
                INSERT INTO conjuntos_tasas (nombre, descripcion, activo)
                VALUES ($1, $2, $3)
                RETURNING id, fecha_creacion, fecha_actualizacion
            `;
            
            const result = await client.query(query, [
                conjunto.nombre,
                conjunto.descripcion,
                conjunto.activo
            ]);
            
            const row = result.rows[0];
            const nuevoConjunto = new ConjuntoTasas(
                row.id,
                conjunto.nombre,
                conjunto.descripcion,
                new Date(row.fecha_creacion),
                new Date(row.fecha_actualizacion),
                conjunto.activo,
                conjunto.tasas
            );
            
            // Insertar tasas simplificado
            for (const [codigo, tasaData] of nuevoConjunto.tasas) {
                await this.upsertTasaConClient(
                    client, 
                    nuevoConjunto.id, 
                    codigo, 
                    tasaData.valor, 
                    tasaData.descripcion
                );
            }
            
            await client.query('COMMIT');
            return nuevoConjunto;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateConjuntoTasas(conjunto: ConjuntoTasas): Promise<ConjuntoTasas> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            
            if (conjunto.activo) {
                await client.query('UPDATE conjuntos_tasas SET activo = false WHERE id != $1', [conjunto.id]);
            }

            const updateQuery = `
                UPDATE conjuntos_tasas
                SET nombre = $1, descripcion = $2, activo = $3, fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $4
                RETURNING fecha_actualizacion
            `;
            
            const result = await client.query(updateQuery, [
                conjunto.nombre,
                conjunto.descripcion,
                conjunto.activo,
                conjunto.id
            ]);
            
            const fechaActualizacion = new Date(result.rows[0].fecha_actualizacion);
            
            // Actualizar tasas
            await client.query('DELETE FROM tasas WHERE conjunto_id = $1', [conjunto.id]);
            
            for (const [codigo, tasaData] of conjunto.tasas) {
                await this.upsertTasaConClient(
                    client, 
                    conjunto.id, 
                    codigo, 
                    tasaData.valor, 
                    tasaData.descripcion
                );
            }
            
            await client.query('COMMIT');
            
            return new ConjuntoTasas(
                conjunto.id,
                conjunto.nombre,
                conjunto.descripcion,
                conjunto.fechaCreacion,
                fechaActualizacion,
                conjunto.activo,
                conjunto.tasas
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteConjuntoTasas(id: number): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            
            // Verificar si el conjunto está activo
            const conjunto = await this.findConjuntoTasasById(id);
            if (!conjunto) throw new Error("Conjunto de tasas no encontrado");
            if (conjunto.activo) throw new Error("No se puede eliminar un conjunto activo");
            
            // Eliminar tasas asociadas
            await client.query('DELETE FROM tasas WHERE conjunto_id = $1', [id]);
            
            // Eliminar el conjunto
            await client.query('DELETE FROM conjuntos_tasas WHERE id = $1', [id]);
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async findConjuntoTasasById(id: number): Promise<ConjuntoTasas | null> {
        const client = await this.pool.connect();
        try {
            const conjuntoQuery = 'SELECT * FROM conjuntos_tasas WHERE id = $1';
            const conjuntoRes = await client.query(conjuntoQuery, [id]);
            if (conjuntoRes.rows.length === 0) return null;
            
            const conjuntoRow = conjuntoRes.rows[0];
            const conjunto = new ConjuntoTasas(
                conjuntoRow.id,
                conjuntoRow.nombre,
                conjuntoRow.descripcion,
                new Date(conjuntoRow.fecha_creacion),
                new Date(conjuntoRow.fecha_actualizacion),
                conjuntoRow.activo
            );
            
            // Obtener tasas con descripciones
            const tasasQuery = 'SELECT codigo, valor, descripcion FROM tasas WHERE conjunto_id = $1';
            const tasasRes = await client.query(tasasQuery, [id]);
            
            tasasRes.rows.forEach(row => {
                conjunto.agregarTasa(row.codigo, row.valor, row.descripcion);
            });
            
            return conjunto;
        } finally {
            client.release();
        }
    }

    async findAllConjuntosTasas(): Promise<ConjuntoTasas[]> {
        const client = await this.pool.connect();
        try {
            // Obtener todos los conjuntos
            const conjuntosQuery = 'SELECT * FROM conjuntos_tasas ORDER BY id';
            const conjuntosRes = await client.query(conjuntosQuery);
            const conjuntos: ConjuntoTasas[] = [];
            
            for (const conjuntoRow of conjuntosRes.rows) {
                // Obtener tasas para cada conjunto
                const tasasQuery = 'SELECT codigo, valor FROM tasas WHERE conjunto_id = $1';
                const tasasRes = await client.query(tasasQuery, [conjuntoRow.id]);
                const tasasMap: Record<string, number> = {};
                
                tasasRes.rows.forEach(row => {
                    tasasMap[row.codigo] = row.valor;
                });
                
                // Crear instancia
                const conjunto = new ConjuntoTasas(
                    conjuntoRow.id,
                    conjuntoRow.nombre,
                    conjuntoRow.descripcion,
                    new Date(conjuntoRow.fecha_creacion),
                    new Date(conjuntoRow.fecha_actualizacion),
                    conjuntoRow.activo
                );
                
                // Agregar tasas
                for (const [codigo, valor] of Object.entries(tasasMap)) {
                    conjunto.agregarTasa(codigo, valor);
                }
                
                conjuntos.push(conjunto);
            }
            
            return conjuntos;
        } finally {
            client.release();
        }
    }

    async activateConjuntoTasas(id: number): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            
            // Desactivar todos los conjuntos
            await client.query('UPDATE conjuntos_tasas SET activo = false');
            
            // Activar el conjunto específico
            await client.query('UPDATE conjuntos_tasas SET activo = true WHERE id = $1', [id]);
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deactivateOtherConjuntos(exceptId: number): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('UPDATE conjuntos_tasas SET activo = false WHERE id != $1', [exceptId]);
        } finally {
            client.release();
        }
    }

    async agregarTasaAConjunto(conjuntoId: number, codigo: string, valor: number, descripcion: string = ""): Promise<void> {
        const client = await this.pool.connect();
        try {
            const query = `
                INSERT INTO tasas (conjunto_id, codigo, valor, descripcion)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (conjunto_id, codigo) DO UPDATE
                SET valor = EXCLUDED.valor, descripcion = EXCLUDED.descripcion
            `;
            
            await client.query(query, [conjuntoId, codigo, valor, descripcion]);
        } finally {
            client.release();
        }
    }

    async actualizarTasaEnConjunto(conjuntoId: number, codigo: string, nuevoValor: number, nuevaDescripcion: string = ""): Promise<void> {
        const client = await this.pool.connect();
        try {
            const query = `
                UPDATE tasas
                SET valor = $1, descripcion = $2
                WHERE conjunto_id = $3 AND codigo = $4
            `;
            
            await client.query(query, [nuevoValor, nuevaDescripcion, conjuntoId, codigo]);
        } finally {
            client.release();
        }
    }

    async eliminarTasaDeConjunto(conjuntoId: number, codigo: string): Promise<void> {
        const client = await this.pool.connect();
        try {
            const query = 'DELETE FROM tasas WHERE conjunto_id = $1 AND codigo = $2';
            await client.query(query, [conjuntoId, codigo]);
        } finally {
            client.release();
        }
    }

    // Método privado para uso interno con transacciones
    private async upsertTasaConClient(
        client: PoolClient, 
        conjuntoId: number, 
        codigo: string, 
        valor: number, 
        descripcion: string = ""
    ): Promise<void> {
        const query = `
            INSERT INTO tasas (conjunto_id, codigo, valor, descripcion)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (conjunto_id, codigo) DO UPDATE
            SET valor = EXCLUDED.valor, descripcion = EXCLUDED.descripcion
        `;
        await client.query(query, [conjuntoId, codigo, valor, descripcion]);
    }
}