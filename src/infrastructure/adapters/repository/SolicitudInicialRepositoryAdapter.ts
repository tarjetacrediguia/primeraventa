//src/infrastructure/adapters/repository/SolicitudInicialRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Solicitudes Iniciales
 *
 * Este archivo implementa el adaptador para el repositorio de solicitudes iniciales del sistema.
 * Proporciona métodos para gestionar solicitudes iniciales y su relación con clientes y comerciantes.
 */

import { SolicitudInicialRepositoryPort } from "../../../application/ports/SolicitudInicialRepositoryPort";
import { Cliente } from "../../../domain/entities/Cliente";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { pool } from "../../config/Database/DatabaseDonfig";

export class SolicitudInicialRepositoryAdapter implements SolicitudInicialRepositoryPort {
    /**
     * Obtiene las solicitudes iniciales que están próximas a expirar.
     * @param diasExpiracion - Número de días después de los cuales una solicitud se considera expirada.
     * @returns Promise<SolicitudInicial[]> - Array de solicitudes iniciales que están próximas a expirar.
     */
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
            row.clienteId,
            undefined, // comercianteId (no se necesita para esta operación)
            []        // comentarios (inicializar como array vacío)
        ));
    }
    /**
     * Marca una solicitud inicial como expirada.
     * @param solicitudId - ID de la solicitud inicial a expirar.
     * @returns Promise<void> - No retorna valor.
     */
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

    
    /**
     * Crea una nueva solicitud inicial en la base de datos.
     * @param solicitudInicial - Objeto SolicitudInicial a crear.
     * @returns Promise<SolicitudInicial> - La solicitud inicial creada con su ID asignado.
     */
    async createSolicitudInicial(solicitudInicial: SolicitudInicial,cliente:Cliente): Promise<SolicitudInicial> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Buscar cliente por DNI o crear uno nuevo
            let clienteId: number;
            
            const clienteQuery = `SELECT id FROM clientes WHERE cuil = $1`;
            const clienteResult = await client.query(clienteQuery, [cliente.getCuil()]);
            
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
                    cliente.getDni(),
                    cliente.getCuil(),
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
                    reciboSueldo, comentarios, motivo_rechazo
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, fecha_creacion
            `;
            
            const values = [
                clienteId,
                solicitudInicial.getComercianteId() || null,
                solicitudInicial.getFechaCreacion(),
                solicitudInicial.getEstado(),
                solicitudInicial.getReciboSueldo() || null,
                solicitudInicial.getComentarios(),
                solicitudInicial.getMotivoRechazo() || null
            ];
            
            const result = await client.query(query, values);
            const createdRow = result.rows[0];
            
            await client.query('COMMIT');
            
            // Retornar la solicitud creada con su ID
            return new SolicitudInicial(
                createdRow.id.toString(),
                createdRow.fecha_creacion,
                solicitudInicial.getEstado(),
                clienteId,
                solicitudInicial.getComercianteId(),
                solicitudInicial.getComentarios(),
                undefined, // analistaAprobadorId
                undefined, // administradorAprobadorId
                cliente.getDni(),
                cliente.getCuil(),
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene una solicitud inicial por su ID.
     * @param id - ID de la solicitud inicial a buscar.
     * @returns Promise<SolicitudInicial | null> - La solicitud inicial encontrada o null si no existe.
     */
    async getSolicitudInicialById(id: number): Promise<SolicitudInicial | null> {
        const query = `
            SELECT 
            si.id, 
            si.fecha_creacion, 
            si.estado, 
            si.reciboSueldo, 
            si.comentarios, 
            si.comerciante_id,
            si.analista_aprobador_id,
            si.administrador_aprobador_id,
            si.motivo_rechazo,
            c.dni as dni_cliente, 
            c.id as cliente_id,
            c.cuil as cuil_cliente
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

    /**
     * Actualiza los datos de una solicitud inicial existente.
     * @param solicitudInicial - Objeto SolicitudInicial con los datos actualizados.
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada.
     */
    async updateSolicitudInicial(solicitudInicial: SolicitudInicial,cliente:Cliente): Promise<SolicitudInicial> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Verificar que el cliente existe y obtener su ID
            const clienteQuery = `SELECT id FROM clientes WHERE cuil = $1`;
            const clienteResult = await client.query(clienteQuery, [cliente.getCuil()]);
            if (clienteResult.rows.length === 0) {
                throw new Error(`Cliente con CUIL ${cliente.getCuil()} no encontrado`);
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
                analista_aprobador_id = $6,   -- Cambiado a $6
                administrador_aprobador_id = $7, -- Cambiado a $7
                fecha_actualizacion = CURRENT_TIMESTAMP,
                motivo_rechazo = $9
            WHERE id = $8
            RETURNING *
        `;
        
        
        const values = [
            clienteId,
            solicitudInicial.getComercianteId() || null,
            solicitudInicial.getEstado(),
            solicitudInicial.getReciboSueldo() || null,
            solicitudInicial.getComentarios(),
            solicitudInicial.getAnalistaAprobadorId() === undefined ? 
                null : Number(solicitudInicial.getAnalistaAprobadorId()),
            solicitudInicial.getAdministradorAprobadorId() === undefined ? 
                null : Number(solicitudInicial.getAdministradorAprobadorId()),
            solicitudInicial.getId(),
            solicitudInicial.getMotivoRechazo() || null
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

    /**
     * Actualiza el estado de aprobación o rechazo de una solicitud inicial.
     * @param solicitudInicial - Objeto SolicitudInicial con el nuevo estado.
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada.
     */
    async updateSolicitudInicialAprobaciónRechazo(solicitudInicial: SolicitudInicial,cliente:Cliente): Promise<SolicitudInicial> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Verificar que el cliente existe y obtener su ID
            const clienteQuery = `SELECT id FROM clientes WHERE cuil = $1`;
            const clienteResult = await client.query(clienteQuery, [cliente.getCuil()]);
            if (clienteResult.rows.length === 0) {
                throw new Error(`Cliente con CUIL ${cliente.getCuil()} no encontrado`);
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
                analista_aprobador_id = $6,   -- Cambiado a $6
                administrador_aprobador_id = $7, -- Cambiado a $7
                fecha_aprobacion = CURRENT_TIMESTAMP,
                motivo_rechazo = $9
            WHERE id = $8 
            RETURNING *
        `;
        
        
        const values = [
            clienteId,
            solicitudInicial.getComercianteId() || null,
            solicitudInicial.getEstado(),
            solicitudInicial.getReciboSueldo() || null,
            solicitudInicial.getComentarios(),
            solicitudInicial.getAnalistaAprobadorId() === undefined ? 
                null : Number(solicitudInicial.getAnalistaAprobadorId()),
            solicitudInicial.getAdministradorAprobadorId() === undefined ? 
                null : Number(solicitudInicial.getAdministradorAprobadorId()),
            solicitudInicial.getId(),
            solicitudInicial.getMotivoRechazo() || null
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

    /**
     * Obtiene todas las solicitudes iniciales del sistema.
     * @returns Promise<SolicitudInicial[]> - Array de todas las solicitudes iniciales.
     */
    async getAllSolicitudesIniciales(): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
            si.id, 
            si.fecha_creacion, 
            si.estado, 
            si.reciboSueldo, 
            si.comentarios, 
            si.comerciante_id,
            c.dni as dni_cliente, 
            c.cuil as cuil_cliente,
            si.motivo_rechazo,
            u.nombre as comerciante_nombre,
            u.apellido as comerciante_apellido,
            com.nombre_comercio
        FROM solicitudes_iniciales si
        INNER JOIN clientes c ON si.cliente_id = c.id
        LEFT JOIN comerciantes com ON si.comerciante_id = com.usuario_id
        LEFT JOIN usuarios u ON com.usuario_id = u.id
        ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    /**
     * Obtiene las solicitudes iniciales por DNI del cliente.
     * @param dni - DNI del cliente.
     * @returns Promise<SolicitudInicial[]> - Array de solicitudes iniciales del cliente.
     */
    async getSolicitudesInicialesByDni(dni: string): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente, si.motivo_rechazo
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE c.dni = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [dni]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    /**
     * Obtiene las solicitudes iniciales por estado.
     * @param estado - Estado de las solicitudes a buscar.
     * @returns Promise<SolicitudInicial[]> - Array de solicitudes iniciales con el estado especificado.
     */
    async getSolicitudesInicialesByEstado(estado: string): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, 
                si.fecha_creacion, 
                si.estado, 
                si.reciboSueldo, 
                si.comentarios, 
                si.comerciante_id,
                c.dni as dni_cliente, 
                c.cuil as cuil_cliente,
                si.motivo_rechazo,
                u.nombre as comerciante_nombre,
                u.apellido as comerciante_apellido,
                com.nombre_comercio
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            LEFT JOIN comerciantes com ON si.comerciante_id = com.usuario_id
            LEFT JOIN usuarios u ON com.usuario_id = u.id
            WHERE si.estado = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [estado]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    /**
     * Obtiene las solicitudes iniciales por fecha de creación.
     * @param fecha - Fecha de creación de las solicitudes.
     * @returns Promise<SolicitudInicial[]> - Array de solicitudes iniciales creadas en esa fecha.
     */
    async getSolicitudesInicialesByFecha(fecha: Date): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, 
                si.fecha_creacion, 
                si.estado, 
                si.reciboSueldo, 
                si.comentarios, 
                si.comerciante_id,
                c.dni as dni_cliente, 
                c.cuil as cuil_cliente,
                si.motivo_rechazo,
                u.nombre as comerciante_nombre,
                u.apellido as comerciante_apellido,
                com.nombre_comercio
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            LEFT JOIN comerciantes com ON si.comerciante_id = com.usuario_id
            LEFT JOIN usuarios u ON com.usuario_id = u.id
            WHERE DATE(si.fecha_creacion) = DATE($1)
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [fecha]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    /**
     * Obtiene las solicitudes iniciales por ID del comerciante.
     * @param comercianteId - ID del comerciante.
     * @returns Promise<SolicitudInicial[]> - Array de solicitudes iniciales del comerciante.
     */
    async getSolicitudesInicialesByComercianteId(comercianteId: number): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, 
                si.fecha_creacion, 
                si.estado, 
                si.reciboSueldo, 
                si.comentarios, 
                si.comerciante_id,
                c.dni as dni_cliente, 
                c.cuil as cuil_cliente,
                si.motivo_rechazo,
                u.nombre as comerciante_nombre,
                u.apellido as comerciante_apellido,
                com.nombre_comercio
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            LEFT JOIN comerciantes com ON si.comerciante_id = com.usuario_id
            LEFT JOIN usuarios u ON com.usuario_id = u.id
            WHERE si.comerciante_id = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [comercianteId]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    /**
     * Obtiene las solicitudes iniciales por ID del cliente.
     * @param clienteId - ID del cliente.
     * @returns Promise<SolicitudInicial[]> - Array de solicitudes iniciales del cliente.
     */
    async getSolicitudesInicialesByClienteId(clienteId: number): Promise<SolicitudInicial[]> {
        const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente, si.motivo_rechazo
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.cliente_id = $1
            ORDER BY si.fecha_creacion DESC
        `;
        
        const result = await pool.query(query, [clienteId]);
        return result.rows.map(row => this.mapRowToSolicitudInicial(row));
    }

    private mapRowToSolicitudInicial(row: any): SolicitudInicial {
    const solicitud = new SolicitudInicial(
        Number(row.id), 
        new Date(row.fecha_creacion), 
        row.estado as 'pendiente' | 'aprobada' | 'rechazada' | 'expirada',
        Number(row.cliente_id),
        row.comerciante_id ? Number(row.comerciante_id) : undefined,
        row.comentarios || [],
        row.analista_aprobador_id ? Number(row.analista_aprobador_id) : undefined,
        row.administrador_aprobador_id ? Number(row.administrador_aprobador_id) : undefined,
        row.dni_cliente,
        row.cuil_cliente,
        row.motivo_rechazo
    );

    // Agregar datos del comerciante a la solicitud
    if (row.comerciante_nombre && row.comerciante_apellido) {
        solicitud.setComercianteNombre(`${row.comerciante_nombre} ${row.comerciante_apellido}`);
    }
    
    if (row.nombre_comercio) {
        solicitud.setNombreComercio(row.nombre_comercio);
    }

    return solicitud;
}
    /**
     * Obtiene las solicitudes iniciales por comerciante y estado.
     * @param comercianteId - ID del comerciante.
     * @param estado - Estado de las solicitudes.
     * @returns Promise<SolicitudInicial[]> - Array de solicitudes iniciales del comerciante con el estado especificado.
     */
    async getSolicitudesInicialesByComerciante(
    comercianteId: number
): Promise<SolicitudInicial[]> {
    const query = `
        SELECT 
            si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
            si.comentarios, si.comerciante_id,
            c.dni as dni_cliente, c.cuil as cuil_cliente, si.motivo_rechazo, c.id as cliente_id
        FROM solicitudes_iniciales si
        INNER JOIN clientes c ON si.cliente_id = c.id
        WHERE si.comerciante_id = $1
        ORDER BY si.fecha_creacion DESC
    `;
    
    const result = await pool.query(query, [comercianteId]);
    return result.rows.map(row => this.mapRowToSolicitudInicial(row));
}


}
