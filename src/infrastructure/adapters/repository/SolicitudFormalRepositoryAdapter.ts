//src/infrastructure/adapters/repository/SolicitudFormalRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Solicitudes Formales
 *
 * Este archivo implementa el adaptador para el repositorio de solicitudes formales del sistema.
 * Proporciona métodos para gestionar solicitudes formales y sus relaciones con referentes y contratos.
 */

import { SolicitudFormalRepositoryPort } from "../../../application/ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { Referente } from "../../../domain/entities/Referente";
import { pool } from "../../config/Database/DatabaseDonfig";

export class SolicitudFormalRepositoryAdapter implements SolicitudFormalRepositoryPort {
    async getSolicitudFormalBySolicitudInicialId(solicitudInicialId: number): Promise<SolicitudFormal | null> {
    const solicitudes = await this.getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId);
    return solicitudes.length > 0 ? solicitudes[0] : null;
}
    async getSolicitudesFormalesByCuil(cuil: string): Promise<SolicitudFormal[]> {
    const query = `
        SELECT 
            sf.id,
            c.nombre_completo,
            c.apellido,
            c.cuil,
            c.telefono,
            c.email,
            sf.fecha_solicitud,
            sf.recibo,
            sf.estado,
            sf.acepta_tarjeta,
            c.fecha_nacimiento,
            c.domicilio,
            c.datos_empleador,
            sf.comentarios,
            sf.solicitud_inicial_id,
            sf.importe_neto,
            sf.limite_base,
            sf.limite_completo,
            sf.ponderador 
        FROM solicitudes_formales sf
        INNER JOIN clientes c ON sf.cliente_id = c.id
        WHERE c.cuil = $1
        ORDER BY sf.fecha_solicitud DESC
    `;
    
    return await this.executeSolicitudesQuery(query, [cuil]);
}
    
    // src/infrastructure/adapters/repository/SolicitudFormalRepositoryAdapter.ts
    /**
     * Crea una nueva solicitud formal en la base de datos.
     * @param solicitudFormal - Objeto SolicitudFormal a crear.
     * @returns Promise<SolicitudFormal> - La solicitud formal creada con su ID asignado.
     */
    async createSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // 1. Obtener cliente_id de la solicitud inicial asociada
            const initQuery = `SELECT cliente_id FROM solicitudes_iniciales WHERE id = $1`;
            const initResult = await client.query(initQuery, [solicitudFormal.getSolicitudInicialId()]);
            
            if (initResult.rows.length === 0) {
                throw new Error('Solicitud inicial no encontrada');
            }
            
            const clienteId = initResult.rows[0].cliente_id;
            if (!clienteId) {
                throw new Error('La solicitud inicial no tiene un cliente asociado');
            }

            // 2. Actualizar cliente con los nuevos datos
            const updateClienteQuery = `
                UPDATE clientes SET
                    nombre_completo = $1,
                    apellido = $2,
                    telefono = $3,
                    email = $4,
                    fecha_nacimiento = $5,
                    domicilio = $6,
                    datos_empleador = $7,
                    acepta_tarjeta = $8
                WHERE id = $9
            `;
            await client.query(updateClienteQuery, [
                solicitudFormal.getNombreCompleto(),
                solicitudFormal.getApellido(),
                solicitudFormal.getTelefono(),
                solicitudFormal.getEmail(),
                solicitudFormal.getFechaNacimiento(),
                solicitudFormal.getDomicilio(),
                solicitudFormal.getDatosEmpleador(),
                solicitudFormal.getAceptaTarjeta(),
                clienteId
            ]);

            // 3. Crear solicitud formal usando el mismo cliente_id
            const reciboStream = solicitudFormal.getReciboStream();
            const chunks: Uint8Array[] = [];
            
            for await (const chunk of reciboStream) {
            chunks.push(chunk);
            }
            
            const reciboBuffer = Buffer.concat(chunks);

            // Insertar en la base de datos
            const solicitudQuery = `
          INSERT INTO solicitudes_formales (
                    cliente_id, 
                    solicitud_inicial_id, 
                    comerciante_id,
                    fecha_solicitud, 
                    recibo, 
                    estado, 
                    acepta_tarjeta, 
                    comentarios,
                    importe_neto,
                    limite_base,
                    limite_completo,
                    solicita_ampliacion_credito,
                    nuevo_limite_completo_solicitado
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id
        `;
        
        const solicitudValues = [
          clienteId,
          solicitudFormal.getSolicitudInicialId(),
          solicitudFormal.getComercianteId(),
          solicitudFormal.getFechaSolicitud(),
          solicitudFormal.getRecibo(),
          solicitudFormal.getEstado(),
          solicitudFormal.getAceptaTarjeta(),
          solicitudFormal.getComentarios(),
          solicitudFormal.getImporteNeto(),      
            solicitudFormal.getLimiteBase(),         
            solicitudFormal.getLimiteCompleto(),
            solicitudFormal.getSolicitaAmpliacionDeCredito(),
            solicitudFormal.getNuevoLimiteCompletoSolicitado()
        ];
            
            const solicitudResult = await client.query(solicitudQuery, solicitudValues);
            const solicitudId = solicitudResult.rows[0].id;
            
            // 4. Insertar referentes
            for (let i = 0; i < solicitudFormal.getReferentes().length; i++) {
                const referente = solicitudFormal.getReferentes()[i];
                
                const referenteQuery = `
                    INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                const referenteValues = [
                    referente.getNombreCompleto(),
                    referente.getApellido(),
                    referente.getVinculo(),
                    referente.getTelefono()
                ];
                
                const referenteResult = await client.query(referenteQuery, referenteValues);
                const referenteId = referenteResult.rows[0].id;

                const relacionQuery = `
                    INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden)
                    VALUES ($1, $2, $3)
                `;
                await client.query(relacionQuery, [solicitudId, referenteId, i + 1]);
            }

            await client.query('COMMIT');
            
            // Retornar la solicitud creada
            return await this.getSolicitudFormalById(solicitudId) as SolicitudFormal;
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al crear solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene una solicitud formal por su ID.
     * @param id - ID de la solicitud formal a buscar.
     * @returns Promise<SolicitudFormal | null> - La solicitud formal encontrada o null si no existe.
     */
    async getSolicitudFormalById(id: number): Promise<SolicitudFormal | null> {
        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.comerciante_id,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.cliente_id,
                sf.solicita_ampliacion_credito,
                sf.nuevo_limite_completo_solicitado,
                sf.ponderador
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        
        // Obtener referentes
        const referentesQuery = `
            SELECT r.nombre_completo, r.apellido, r.vinculo, r.telefono, sr.orden
            FROM referentes r
            INNER JOIN solicitud_referente sr ON r.id = sr.referente_id
            WHERE sr.solicitud_formal_id = $1
            ORDER BY sr.orden
        `;
        
        const referentesResult = await pool.query(referentesQuery, [id]);
        const referentes = referentesResult.rows.map(refRow => 
            new Referente(
                refRow.nombre_completo,
                refRow.apellido,
                refRow.vinculo,
                refRow.telefono
            )
        );
        return new SolicitudFormal(
            Number(row.id), // Convertir a número
            row.solicitud_inicial_id,
            row.comerciante_id, 
            row.nombre_completo,
            row.apellido,
            //row.dni,
            row.telefono,
            row.email,
            new Date(row.fecha_solicitud),
            row.recibo,
            row.estado,
            row.acepta_tarjeta,
            new Date(row.fecha_nacimiento),
            row.domicilio,
            row.datos_empleador,
            referentes,
            row.importe_neto,
            row.comentarios || [],
            Number(row.ponderador) || 0,
            row.solicita_ampliacion_credito || false,
            row.cliente_id || 0,
            row.fecha_aprobacion ? new Date(row.fecha_aprobacion) : undefined,
            row.analista_aprobador_id,
            row.administrador_aprobador_id,
            row.comerciante_aprobador_id,
            row.nuevo_limite_completo_solicitado !== null 
            ? Number(row.nuevo_limite_completo_solicitado) 
            : null
        );
    }

    /**
     * Actualiza los datos de una solicitud formal existente.
     * @param solicitudFormal - Objeto SolicitudFormal con los datos actualizados.
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada.
     */
    async updateSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Buscar la solicitud formal por solicitud_inicial_id
            const buscarQuery = `
                SELECT sf.id, sf.cliente_id 
                FROM solicitudes_formales sf 
                WHERE sf.solicitud_inicial_id = $1
            `;
            const buscarResult = await client.query(buscarQuery, [solicitudFormal.getSolicitudInicialId()]);
            
            if (buscarResult.rows.length === 0) {
                throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${solicitudFormal.getSolicitudInicialId()}`);
            }
            
            const solicitudId = buscarResult.rows[0].id;
            const clienteId = buscarResult.rows[0].cliente_id;

            // Actualizar cliente
            const actualizarClienteQuery = `
                UPDATE clientes 
                SET nombre_completo = $1, apellido = $2, telefono = $3, email = $4,
                    fecha_nacimiento = $5, domicilio = $6, datos_empleador = $7, acepta_tarjeta = $8
                WHERE id = $9
            `;
            await client.query(actualizarClienteQuery, [
                solicitudFormal.getNombreCompleto(),
                solicitudFormal.getApellido(),
                solicitudFormal.getTelefono(),
                solicitudFormal.getEmail(),
                solicitudFormal.getFechaNacimiento(),
                solicitudFormal.getDomicilio(),
                solicitudFormal.getDatosEmpleador(),
                solicitudFormal.getAceptaTarjeta(),
                clienteId
            ]);

            // Actualizar solicitud formal
            const actualizarSolicitudQuery = `
                UPDATE solicitudes_formales
                SET fecha_solicitud = $1, 
                    recibo = $2, 
                    estado = $3, 
                    acepta_tarjeta = $4, 
                    comentarios = $5, 
                    fecha_actualizacion = CURRENT_TIMESTAMP,
                    importe_neto = $7,
                    limite_base = $8,
                    limite_completo = $9
                WHERE id = $6
            `;
            await client.query(actualizarSolicitudQuery, [
                solicitudFormal.getFechaSolicitud(),
                solicitudFormal.getRecibo(),
                solicitudFormal.getEstado(),
                solicitudFormal.getAceptaTarjeta(),
                solicitudFormal.getComentarios(),
                solicitudId,
                solicitudFormal.getImporteNeto(),
                solicitudFormal.getLimiteBase(),
                solicitudFormal.getLimiteCompleto()
            ]);

            // Eliminar referentes existentes
            await client.query('DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
            
            const referentesIds = await client.query(
                'SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1', 
                [solicitudId]
            );
            
            for (const refId of referentesIds.rows) {
                await client.query('DELETE FROM referentes WHERE id = $1', [refId.referente_id]);
            }

            // Insertar nuevos referentes
            for (let i = 0; i < solicitudFormal.getReferentes().length; i++) {
                const referente = solicitudFormal.getReferentes()[i];
                
                const referenteQuery = `
                    INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                const referenteResult = await client.query(referenteQuery, [
                    referente.getNombreCompleto(),
                    referente.getApellido(),
                    referente.getVinculo(),
                    referente.getTelefono()
                ]);
                
                const referenteId = referenteResult.rows[0].id;
                
                await client.query(
                    'INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden) VALUES ($1, $2, $3)',
                    [solicitudId, referenteId, i + 1]
                );
            }

            await client.query('COMMIT');
            
            return await this.getSolicitudFormalById(solicitudId.toString()) as SolicitudFormal;
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al actualizar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }

    /**
     * Actualiza el estado de aprobación de una solicitud formal.
     * @param solicitudFormal - Objeto SolicitudFormal con el nuevo estado de aprobación.
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada.
     */
    async updateSolicitudFormalAprobacion(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
        
        // Obtener ID directamente de la entidad
        const solicitudId = solicitudFormal.getId();
        
        // 1. Obtener cliente_id de la solicitud
        const clienteIdQuery = 'SELECT cliente_id FROM solicitudes_formales WHERE id = $1';
        const clienteIdResult = await client.query(clienteIdQuery, [solicitudId]);
        
        if (clienteIdResult.rows.length === 0) {
            throw new Error(`Solicitud formal no encontrada: ${solicitudId}`);
        }
        
        const clienteId = clienteIdResult.rows[0].cliente_id;

            // Actualizar cliente
            const actualizarClienteQuery = `
                UPDATE clientes 
                SET nombre_completo = $1, apellido = $2, telefono = $3, email = $4,
                    fecha_nacimiento = $5, domicilio = $6, datos_empleador = $7, acepta_tarjeta = $8
                WHERE id = $9
            `;
            await client.query(actualizarClienteQuery, [
                solicitudFormal.getNombreCompleto(),
                solicitudFormal.getApellido(),
                solicitudFormal.getTelefono(),
                solicitudFormal.getEmail(),
                solicitudFormal.getFechaNacimiento(),
                solicitudFormal.getDomicilio(),
                solicitudFormal.getDatosEmpleador(),
                solicitudFormal.getAceptaTarjeta(),
                clienteId
            ]);

            // Actualizar solicitud formal
            const actualizarSolicitudQuery = `
            UPDATE solicitudes_formales
            SET 
                fecha_solicitud = $1, 
                recibo = $2, 
                estado = $3, 
                acepta_tarjeta = $4, 
                comentarios = $5,
                fecha_aprobacion = CURRENT_TIMESTAMP,
                analista_aprobador_id = $7,
                administrador_aprobador_id = $8,
                comerciante_aprobador_id = $9
            WHERE id = $6
        `;
        
        await client.query(actualizarSolicitudQuery, [
            solicitudFormal.getFechaSolicitud(),
            solicitudFormal.getRecibo(),
            solicitudFormal.getEstado(),
            solicitudFormal.getAceptaTarjeta(),
            solicitudFormal.getComentarios(),
            solicitudFormal.getId(),
            solicitudFormal.getAnalistaAprobadorId(),
            solicitudFormal.getAdministradorAprobadorId(),
            solicitudFormal.getComercianteAprobadorId() || null
        ]);

            // Eliminar referentes existentes
            await client.query('DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
            
            const referentesIds = await client.query(
                'SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1', 
                [solicitudId]
            );
            
            for (const refId of referentesIds.rows) {
                await client.query('DELETE FROM referentes WHERE id = $1', [refId.referente_id]);
            }

            // Insertar nuevos referentes
            for (let i = 0; i < solicitudFormal.getReferentes().length; i++) {
                const referente = solicitudFormal.getReferentes()[i];
                
                const referenteQuery = `
                    INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                const referenteResult = await client.query(referenteQuery, [
                    referente.getNombreCompleto(),
                    referente.getApellido(),
                    referente.getVinculo(),
                    referente.getTelefono()
                ]);
                
                const referenteId = referenteResult.rows[0].id;
                
                await client.query(
                    'INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden) VALUES ($1, $2, $3)',
                    [solicitudId, referenteId, i + 1]
                );
            }

            await client.query('COMMIT');
            
            return await this.getSolicitudFormalById(solicitudId) as SolicitudFormal;
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al actualizar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }

    /**
     * Actualiza el estado de rechazo de una solicitud formal.
     * @param solicitudFormal - Objeto SolicitudFormal con el nuevo estado de rechazo.
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada.
     */
    async updateSolicitudFormalRechazo(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
    
        const solicitudId = solicitudFormal.getId();
        
        // Actualizar solicitud formal con información de rechazo
        const actualizarSolicitudQuery = `
            UPDATE solicitudes_formales
            SET 
                estado = $1,
                comentarios = $2,
                fecha_actualizacion = CURRENT_TIMESTAMP,
                analista_aprobador_id = $3,
                administrador_aprobador_id = $4
            WHERE id = $5
        `;
        
        await client.query(actualizarSolicitudQuery, [
            solicitudFormal.getEstado(),
            solicitudFormal.getComentarios(),
            solicitudFormal.getAnalistaAprobadorId(),
            solicitudFormal.getAdministradorAprobadorId(),
            solicitudId
        ]);

        // Registrar acción en el historial
        const accion = `Solicitud formal ${solicitudId} rechazada`;
        const detalles = {
            comentarios: solicitudFormal.getComentarios(),
            aprobador_id: solicitudFormal.getAnalistaAprobadorId() || solicitudFormal.getAdministradorAprobadorId()
        };
        
        await client.query(
            'INSERT INTO historial (usuario_id, accion, entidad_afectada, entidad_id, detalles) VALUES ($1, $2, $3, $4, $5)',
            [
                solicitudFormal.getAnalistaAprobadorId() || solicitudFormal.getAdministradorAprobadorId(),
                accion,
                'solicitudes_formales',
                solicitudId,
                JSON.stringify(detalles)
            ]
        );

        await client.query('COMMIT');
        
        return await this.getSolicitudFormalById(solicitudId) as SolicitudFormal;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Error al rechazar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
        client.release();
    }
}

    /**
     * Elimina una solicitud formal por su ID.
     * @param id - ID de la solicitud formal a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    async deleteSolicitudFormal(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Buscar la solicitud formal
            const buscarQuery = 'SELECT id FROM solicitudes_formales WHERE solicitud_inicial_id = $1';
            const buscarResult = await client.query(buscarQuery, [id]);
            
            if (buscarResult.rows.length === 0) {
                throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${id}`);
            }
            
            const solicitudId = buscarResult.rows[0].id;

            // Eliminar referentes asociados
            const referentesQuery = `
                SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1
            `;
            const referentesResult = await client.query(referentesQuery, [solicitudId]);
            
            for (const ref of referentesResult.rows) {
                await client.query('DELETE FROM referentes WHERE id = $1', [ref.referente_id]);
            }

            // Eliminar relaciones solicitud-referente
            await client.query('DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
            
            // Eliminar solicitud formal (el cliente se mantiene)
            await client.query('DELETE FROM solicitudes_formales WHERE id = $1', [solicitudId]);

            await client.query('COMMIT');
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al eliminar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene todas las solicitudes formales del sistema.
     * @returns Promise<SolicitudFormal[]> - Array de todas las solicitudes formales.
     */
    async getAllSolicitudesFormales(): Promise<SolicitudFormal[]> {
        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,          
                sf.limite_base,            
                sf.limite_completo,
                sf.ponderador             
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            ORDER BY sf.fecha_solicitud DESC
        `;
        
        const result = await pool.query(query);
        const solicitudes: SolicitudFormal[] = [];
        
        for (const row of result.rows) {
            // Obtener referentes para cada solicitud
            const referentesQuery = `
                SELECT r.nombre_completo, r.apellido, r.vinculo, r.telefono
                FROM referentes r
                INNER JOIN solicitud_referente sr ON r.id = sr.referente_id
                WHERE sr.solicitud_formal_id = $1
                ORDER BY sr.orden
            `;
            
            const referentesResult = await pool.query(referentesQuery, [row.id]);
            const referentes = referentesResult.rows.map(refRow => 
                new Referente(
                    refRow.nombre_completo,
                    refRow.apellido,
                    refRow.vinculo,
                    refRow.telefono
                )
            );

            solicitudes.push(new SolicitudFormal(
                row.id.toString(),
                row.solicitud_inicial_id,
                row.comerciante_id, 
                row.nombre_completo,
                row.apellido,
                //row.dni,
                row.telefono,
                row.email,
                new Date(row.fecha_solicitud),
                Buffer.alloc(0),
                row.estado,
                row.acepta_tarjeta,
                new Date(row.fecha_nacimiento),
                row.domicilio,
                row.datos_empleador,
                referentes,
                row.importe_neto,
                row.cuotas_solicitadas,
                row.comentarios || [],
                row.ponderador
            ));
        }
        
        return solicitudes;
    }

    /**
     * Obtiene las solicitudes formales por DNI del cliente.
     * @param dni - DNI del cliente.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales del cliente.
     */
    async getSolicitudesFormalesByDni(dni: string): Promise<SolicitudFormal[]> {
        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador 
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE c.dni = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
        
        return await this.executeSolicitudesQuery(query, [dni]);
    }

    /**
     * Obtiene las solicitudes formales por estado.
     * @param estado - Estado de las solicitudes a buscar.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales con el estado especificado.
     */
    async getSolicitudesFormalesByEstado(estado: string): Promise<SolicitudFormal[]> {
        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador 
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.estado = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
        
        return await this.executeSolicitudesQuery(query, [estado]);
    }

    /**
     * Obtiene las solicitudes formales por fecha de solicitud.
     * @param fecha - Fecha de solicitud.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales creadas en esa fecha.
     */
    async getSolicitudesFormalesByFecha(fecha: Date): Promise<SolicitudFormal[]> {
        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador 
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE DATE(sf.fecha_solicitud) = DATE($1)
            ORDER BY sf.fecha_solicitud DESC
        `;
        
        return await this.executeSolicitudesQuery(query, [fecha]);
    }

    /**
     * Obtiene las solicitudes formales por ID del comerciante.
     * @param comercianteId - ID del comerciante.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales del comerciante.
     */
    async getSolicitudesFormalesByComercianteId(comercianteId: number): Promise<SolicitudFormal[]> {
        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador 
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.comerciante_id = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
        
        return await this.executeSolicitudesQuery(query, [comercianteId]);
    }

    /**
     * Obtiene las solicitudes formales por ID del analista.
     * @param analistaId - ID del analista.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales aprobadas por el analista.
     */
    async getSolicitudesFormalesByAnalistaId(analistaId: number): Promise<SolicitudFormal[]> {
        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador 
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.analista_aprobador_id = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
        
        return await this.executeSolicitudesQuery(query, [analistaId]);
    }

    /**
     * Obtiene las solicitudes formales por ID de la solicitud inicial.
     * @param solicitudInicialId - ID de la solicitud inicial.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales asociadas a la solicitud inicial.
     */
    async getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId: number): Promise<SolicitudFormal[]> {

        const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id 
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.solicitud_inicial_id = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
        
        return await this.executeSolicitudesQuery(query, [solicitudInicialId]);
    }

    /**
     * Vincula un contrato a una solicitud formal.
     * @param solicitudId - ID de la solicitud formal.
     * @param contratoId - ID del contrato a vincular.
     * @returns Promise<void> - No retorna valor.
     */
    async vincularContrato(solicitudId: number, contratoId: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Buscar la solicitud formal por solicitud_inicial_id
            const buscarQuery = 'SELECT id FROM solicitudes_formales WHERE solicitud_inicial_id = $1';
            const buscarResult = await client.query(buscarQuery, [solicitudId]);
            
            if (buscarResult.rows.length === 0) {
                throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${solicitudId}`);
            }
            
            const solicitudFormalId = buscarResult.rows[0].id;
            // Actualizar el contrato para vincularlo con la solicitud formal
            const vincularQuery = `
                UPDATE contratos 
                SET solicitud_formal_id = $1 
                WHERE id = $2
            `;
            
            const result = await client.query(vincularQuery, [solicitudFormalId, contratoId]);
            if (result.rowCount === 0) {
                throw new Error(`No existe un contrato con ID: ${contratoId}`);
            }

            await client.query('COMMIT');
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al vincular contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }

    // Método auxiliar para ejecutar consultas de solicitudes y mapear resultados
    private async executeSolicitudesQuery(query: string, params: any[]): Promise<SolicitudFormal[]> {
        const result = await pool.query(query, params);
        const solicitudes: SolicitudFormal[] = [];
        for (const row of result.rows) {
            // Obtener referentes para cada solicitud
            const referentesQuery = `
                SELECT r.nombre_completo, r.apellido, r.vinculo, r.telefono
                FROM referentes r
                INNER JOIN solicitud_referente sr ON r.id = sr.referente_id
                WHERE sr.solicitud_formal_id = $1
                ORDER BY sr.orden
            `;
            
            const referentesResult = await pool.query(referentesQuery, [row.id]);
            const referentes = referentesResult.rows.map(refRow => 
                new Referente(
                    refRow.nombre_completo,
                    refRow.apellido,
                    refRow.vinculo,
                    refRow.telefono
                )
            );

            solicitudes.push(new SolicitudFormal(
                row.id.toString(),
                row.solicitud_inicial_id,
                row.comerciante_id, 
                row.nombre_completo,
                row.apellido,
                row.telefono,
                row.email,
                new Date(row.fecha_solicitud),
                row.recibo,
                row.estado,
                row.acepta_tarjeta,
                new Date(row.fecha_nacimiento),
                row.domicilio,
                row.datos_empleador,
                referentes,
                row.importe_neto,
                row.comentarios || [],
                row.ponderador ?? 0
            ));
        }
        
        return solicitudes;
    }

    /**
     * Obtiene las solicitudes formales por comerciante y estado.
     * @param comercianteId - ID del comerciante.
     * @param estado - Estado de las solicitudes.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales del comerciante con el estado especificado.
     */
    async getSolicitudesFormalesByComercianteYEstado(
    comercianteId: number, 
    estado: string
): Promise<SolicitudFormal[]> {
    const query = `
        SELECT 
            sf.id,
            c.nombre_completo,
            c.apellido,
            c.telefono,
            c.email,
            sf.fecha_solicitud,
            sf.recibo,
            sf.estado,
            sf.acepta_tarjeta,
            c.fecha_nacimiento,
            c.domicilio,
            c.datos_empleador,
            sf.comentarios,
            sf.solicitud_inicial_id,
            sf.comerciante_id,
            sf.ponderador 
        FROM solicitudes_formales sf
        INNER JOIN clientes c ON sf.cliente_id = c.id
        WHERE sf.comerciante_id = $1 AND sf.estado = $2
        ORDER BY sf.fecha_solicitud DESC
    `;
    
    return await this.executeSolicitudesQuery(query, [comercianteId, estado]);
}

async solicitarAmpliacion(solicitud: SolicitudFormal): Promise<SolicitudFormal> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const query = `
                UPDATE solicitudes_formales
                SET estado = $1,
                    nuevo_limite_completo_solicitado = $2,
                    comentarios = $3,
                    fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $4
                RETURNING id;
            `;
            const result = await client.query(query, [
                solicitud.getEstado(),
                solicitud.getNuevoLimiteCompletoSolicitado(),
                solicitud.getComentarios(),
                solicitud.getId()
            ]);
            if (result.rows.length === 0) {
                throw new Error("Error al actualizar la solicitud");
            }
            await client.query('COMMIT');
            return await this.getSolicitudFormalById(solicitud.getId()) as SolicitudFormal;
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al solicitar ampliación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }

    async aprobarAmpliacion(solicitud: SolicitudFormal): Promise<SolicitudFormal> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const query = `
                UPDATE solicitudes_formales
                SET estado = $1,
                    limite_completo = $2,
                    nuevo_limite_completo_solicitado = NULL,
                    comentarios = $3,
                    fecha_actualizacion = CURRENT_TIMESTAMP,
                    analista_aprobador_id = $4,
                    administrador_aprobador_id = $5
                WHERE id = $6
                RETURNING id;
            `;
            const result = await client.query(query, [
                solicitud.getEstado(),
                solicitud.getLimiteCompleto(),
                solicitud.getComentarios(),
                solicitud.getAnalistaAprobadorId(),
                solicitud.getAdministradorAprobadorId(),
                solicitud.getId()
            ]);
            if (result.rows.length === 0) {
                throw new Error("Error al aprobar ampliación");
            }
            await client.query('COMMIT');
            return await this.getSolicitudFormalById(solicitud.getId()) as SolicitudFormal;
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al aprobar ampliación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }

    async rechazarAmpliacion(solicitud: SolicitudFormal): Promise<SolicitudFormal> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const query = `
                UPDATE solicitudes_formales
                SET estado = $1,
                    nuevo_limite_completo_solicitado = NULL,
                    comentarios = $2,
                    fecha_actualizacion = CURRENT_TIMESTAMP,
                    analista_aprobador_id = $3,
                    administrador_aprobador_id = $4
                WHERE id = $5
                RETURNING id;
            `;
            const result = await client.query(query, [
                solicitud.getEstado(),
                solicitud.getComentarios(),
                solicitud.getAnalistaAprobadorId(),
                solicitud.getAdministradorAprobadorId(),
                solicitud.getId()
            ]);
            if (result.rows.length === 0) {
                throw new Error("Error al rechazar ampliación");
            }
            await client.query('COMMIT');
            return await this.getSolicitudFormalById(solicitud.getId()) as SolicitudFormal;
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error al rechazar ampliación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            client.release();
        }
    }
    
}
