//src/infrastructure/adapters/repository/SolicitudInicialRepositoryAdapter.ts

import { SolicitudInicialRepositoryPort } from "../../../application/ports/SolicitudInicialRepositoryPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { pool } from "../../config/Database/DatabaseDonfig";

export class SolicitudInicialRepositoryAdapter implements SolicitudInicialRepositoryPort {
    async obtenerSolicitudesAExpirar(diasExpiracion: number): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, 
                si.cliente_id AS "clienteId",
                si.fecha_creacion AS "fechaCreacion",
                c.dni AS "dniCliente",
                c.cuil AS "cuilCliente"
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.estado = 'aprobada'
            AND si.fecha_creacion < NOW() - INTERVAL '1 day' * $1
            AND NOT EXISTS (
                SELECT 1
                FROM solicitudes_formales
                WHERE solicitudes_formales.solicitud_inicial_id = si.id
            )
        `;
        const result = await pool.query(query, [diasExpiracion]);
        
        return result.rows.map(row => new SolicitudInicial(
            row.id,
            new Date(row.fechaCreacion),
            'aprobada',
            row.dniCliente,
            row.clienteId,
            row.cuilCliente,
            undefined, // reciboSueldo (no se necesita para esta operación)
            undefined, // comercianteId (no se necesita para esta operación)
            []        // comentarios (inicializar como array vacío)
        ));
    }
    async expirarSolicitud(solicitudId: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Actualizar estado de la solicitud
            await client.query(`
                UPDATE solicitudes_iniciales
                SET estado = 'expirada',
                    fecha_actualizacion = NOW()
                WHERE id = $1
            `, [solicitudId]);
            
            // Registrar en historial
            await client.query(`
                INSERT INTO historial (accion, entidad_afectada, entidad_id, detalles)
                VALUES ('expiracion_automatica', 'solicitud_inicial', $1, $2)
            `, [
                solicitudId,
                JSON.stringify({ accion: "expiracion_automatica" })
            ]);
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    
    async createSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Buscar cliente por DNI o crear uno nuevo
            let clienteId: number;
            const dniCliente = solicitudInicial.getDniCliente();
            const cuilCliente = solicitudInicial.getCuilCliente();
            
            const clienteQuery = `SELECT id FROM clientes WHERE dni = $1`;
            const clienteResult = await client.query(clienteQuery, [dniCliente]);
            
            if (clienteResult.rows.length === 0) {
                // Crear nuevo cliente con datos mínimos
                const insertClienteQuery = `
                    INSERT INTO clientes (
                        nombre_completo, apellido, dni, cuil, 
                        telefono, email, fecha_nacimiento, domicilio, 
                        datos_empleador, acepta_tarjeta
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING id
                `;
                const insertClienteValues = [
                    'Nombre por definir', // nombre_completo
                    'Apellido por definir', // apellido
                    dniCliente,
                    cuilCliente,
                    null, // telefono
                    null, // email
                    null, // fecha_nacimiento
                    null, // domicilio
                    null, // datos_empleador
                    false  // acepta_tarjeta
                ];
                
                const insertResult = await client.query(insertClienteQuery, insertClienteValues);
                clienteId = insertResult.rows[0].id;
            } else {
                clienteId = clienteResult.rows[0].id;
            }
            
            // Crear la solicitud inicial
            const query = `
                INSERT INTO solicitudes_iniciales (
                    cliente_id, comerciante_id, fecha_creacion, estado, 
                    reciboSueldo, comentarios
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, fecha_creacion
            `;
            
            const values = [
                clienteId,
                solicitudInicial.getComercianteId() || null,
                solicitudInicial.getFechaCreacion(),
                solicitudInicial.getEstado(),
                solicitudInicial.getReciboSueldo() || null,
                solicitudInicial.getComentarios()
            ];
            
            const result = await client.query(query, values);
            const createdRow = result.rows[0];
            
            await client.query('COMMIT');
            
            // Retornar la solicitud creada con su ID
            return new SolicitudInicial(
                createdRow.id.toString(),
                createdRow.fecha_creacion,
                solicitudInicial.getEstado(),
                dniCliente,
                clienteId,
                cuilCliente,
                solicitudInicial.getReciboSueldo(),
                solicitudInicial.getComercianteId(),
                solicitudInicial.getComentarios()
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getSolicitudInicialById(id: number): Promise<SolicitudInicial | null> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToSolicitudInicial(result.rows[0]);
    }

    async updateSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Verificar que el cliente existe y obtener su ID
            const clienteQuery = `SELECT id FROM clientes WHERE dni = $1`;
            const clienteResult = await client.query(clienteQuery, [solicitudInicial.getDniCliente()]);
            
            if (clienteResult.rows.length === 0) {
                throw new Error(`Cliente con DNI ${solicitudInicial.getDniCliente()} no encontrado`);
            }
            
            const clienteId = clienteResult.rows[0].id;
            
            const query = `
                UPDATE solicitudes_iniciales
                SET 
                    cliente_id = $1,
                    comerciante_id = $2,
                    estado = $3,
                    reciboSueldo = $4,
                    comentarios = $5,
                    fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $6
                RETURNING *
            `;
            
            const values = [
                clienteId,
                solicitudInicial.getComercianteId() || null,
                solicitudInicial.getEstado(),
                solicitudInicial.getReciboSueldo() || null,
                solicitudInicial.getComentarios(),
                solicitudInicial.getId()
            ];
            
            const result = await client.query(query, values);
            
            if (result.rows.length === 0) {
                throw new Error(`Solicitud inicial con ID ${solicitudInicial.getId()} no encontrada`);
            }
            
            await client.query('COMMIT');
            
            // Obtener los datos completos para retornar
            const solicitudActualizada = await this.getSolicitudInicialById(solicitudInicial.getId());
            return solicitudActualizada!;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getAllSolicitudesIniciales(): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    async getSolicitudesInicialesByDni(dni: string): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE c.dni = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [dni]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    async getSolicitudesInicialesByEstado(estado: string): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.estado = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [estado]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    async getSolicitudesInicialesByFecha(fecha: Date): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE DATE(si.fecha_creacion) = DATE($1)
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [fecha]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    async getSolicitudesInicialesByComercianteId(comercianteId: number): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.comerciante_id = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [comercianteId]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    async getSolicitudesInicialesByClienteId(clienteId: number): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.cliente_id = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [clienteId]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    private mapRowToSolicitudInicial(row: any): SolicitudInicial {
        return new SolicitudInicial(
            row.id.toString(),
            row.fecha_creacion,
            row.estado as 'pendiente' | 'aprobada' | 'rechazada' | 'expirada',
            row.dni_cliente,
            row.cuil_cliente,
            row.recibosueldo || undefined, // BYTEA field
            row.comerciante_id?.toString() || undefined,
            row.comentarios || []
        );
    }
    async getSolicitudesInicialesByComercianteYEstado(
    comercianteId: number, 
    estado: string
): Promise<SolicitudInicial[]> {
    const query = `
        SELECT 
            si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
            si.comentarios, si.comerciante_id,
            c.dni as dni_cliente, c.cuil as cuil_cliente
        FROM solicitudes_iniciales si
        INNER JOIN clientes c ON si.cliente_id = c.id
        WHERE si.comerciante_id = $1 AND si.estado = $2
        ORDER BY si.fecha_creacion DESC
    `;
    
    const result = await pool.query(query, [comercianteId, estado]);
    return result.rows.map(row => this.mapRowToSolicitudInicial(row));
}


}