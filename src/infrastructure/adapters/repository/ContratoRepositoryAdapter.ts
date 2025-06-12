// src/infrastructure/adapters/repository/ContratoRepositoryAdapter.ts

import { ContratoRepositoryPort } from "../../../application/ports/ContratoRepositoryPort";
import { Contrato } from "../../../domain/entities/Contrato";
import { pool } from '../../config/Database/DatabaseDonfig';

export class ContratoRepositoryAdapter implements ContratoRepositoryPort {
    async saveContrato(contrato: Contrato): Promise<Contrato> {
        return this.createContrato(contrato);
    }

    async getContratoById(id: string): Promise<Contrato | null> {
        const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos 
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToContrato(result.rows[0]);
    }

    async updateContrato(contrato: Contrato): Promise<Contrato> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const query = `
                UPDATE contratos 
                SET fecha_generacion = $1, 
                    monto = $2, 
                    estado = $3, 
                    solicitud_formal_id = $4, 
                    cliente_id = $5, 
                    numero_tarjeta = $6, 
                    numero_cuenta = $7
                WHERE id = $8
            `;
            await client.query(query, [
                contrato.getFechaGeneracion(),
                contrato.getMonto(),
                contrato.getEstado(),
                contrato.getSolicitudFormalId(),
                contrato.getClienteId(),
                contrato.getNumeroTarjeta(),
                contrato.getNumeroCuenta(),
                contrato.getId()
            ]);
            
            await client.query('COMMIT');
            
            // Devolver el contrato actualizado
            const updated = await this.getContratoById(contrato.getId().toString());
            if (!updated) {
                throw new Error("Error al recuperar contrato actualizado");
            }
            return updated;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteContrato(id: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM contratos WHERE id = $1', [id]);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async createContrato(contrato: Contrato): Promise<Contrato> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const query = `
      INSERT INTO contratos 
        (solicitud_formal_id, cliente_id, fecha_generacion, 
         monto, estado, numero_tarjeta, numero_cuenta)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, fecha_generacion, monto, estado, 
                solicitud_formal_id, cliente_id, 
                numero_tarjeta, numero_cuenta
    `;
    const result = await pool.query(query, [
      contrato.getSolicitudFormalId(),
      contrato.getClienteId(),
      contrato.getFechaGeneracion(),
      contrato.getMonto(),
      contrato.getEstado(),
      contrato.getNumeroTarjeta(),
      contrato.getNumeroCuenta()
    ]);

            await client.query('COMMIT');
            
            const savedData = result.rows[0];
            return this.mapRowToContrato(savedData);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getAllContratos(): Promise<Contrato[]> {
        const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos
        `;
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToContrato(row));
    }

    async getContratosBySolicitudFormalId(solicitudFormalId: number): Promise<Contrato[]> {
        const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos
            WHERE solicitud_formal_id = $1
        `;
        const result = await pool.query(query, [solicitudFormalId]);
        return result.rows.map(row => this.mapRowToContrato(row));
    }

    async getContratosByAnalistaId(analistaId: number): Promise<Contrato[]> {
        const query = `
            SELECT c.id, c.fecha_generacion, c.monto, c.estado, 
                   c.solicitud_formal_id, c.cliente_id, 
                   c.numero_tarjeta, c.numero_cuenta
            FROM contratos c
            JOIN solicitudes_formales sf ON c.solicitud_formal_id = sf.id
            WHERE sf.analista_aprobador_id = $1
        `;
        const result = await pool.query(query, [analistaId]);
        return result.rows.map(row => this.mapRowToContrato(row));
    }

    async getContratosByComercianteId(comercianteId: number): Promise<Contrato[]> {
        const query = `
            SELECT c.id, c.fecha_generacion, c.monto, c.estado, 
                   c.solicitud_formal_id, c.cliente_id, 
                   c.numero_tarjeta, c.numero_cuenta
            FROM contratos c
            JOIN solicitudes_formales sf ON c.solicitud_formal_id = sf.id
            WHERE sf.comerciante_id = $1
        `;
        const result = await pool.query(query, [comercianteId]);
        return result.rows.map(row => this.mapRowToContrato(row));
    }

    async getContratosByEstado(estado: string): Promise<Contrato[]> {
        const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos
            WHERE estado = $1
        `;
        const result = await pool.query(query, [estado]);
        return result.rows.map(row => this.mapRowToContrato(row));
    }

    private mapRowToContrato(row: any): Contrato {
        return new Contrato(
            row.id,
            row.fecha_generacion,
            parseFloat(row.monto),
            row.estado,
            Number(row.solicitud_formal_id),
            Number(row.cliente_id),
            row.numero_tarjeta,
            row.numero_cuenta
        );
    }
}