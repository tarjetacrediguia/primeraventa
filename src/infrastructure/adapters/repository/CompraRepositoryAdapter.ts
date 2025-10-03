// src/infrastructure/adapters/repository/CompraRepositoryAdapter.ts
import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../../application/ports/CompraRepositoryPort";
//import { ItemCompra } from "../../../domain/entities/ItemCompra";
import { pool } from "../../config/Database/DatabaseDonfig";

export class CompraRepositoryAdapter implements CompraRepositoryPort {
    async rechazarSolicitudesInicialesPorCompra(
    cuilCliente: string, 
    solicitudInicialExcluida: number
): Promise<Array<{ id: number, comercianteId: number | null }>> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log(`🔄 Rechazando solicitudes iniciales para CUIL: ${cuilCliente}, excluyendo: ${solicitudInicialExcluida}`);

        // 1. Obtener el ID del cliente por CUIL
        const clienteQuery = `SELECT id FROM clientes WHERE cuil = $1`;
        const clienteResult = await client.query(clienteQuery, [cuilCliente]);
        
        if (clienteResult.rows.length === 0) {
            throw new Error(`Cliente con CUIL ${cuilCliente} no encontrado`);
        }

        const clienteId = clienteResult.rows[0].id;

        // 2. Actualizar todas las solicitudes iniciales del mismo cliente (excepto la que originó la compra)
        const updateQuery = `
            UPDATE solicitudes_iniciales 
            SET estado = 'rechazada',
                motivo_rechazo = 'Rechazada por concreción de compra en otro local',
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE cliente_id = $1
            AND id != $2
            AND estado IN ('pendiente', 'aprobada')
            RETURNING id, comerciante_id
        `;
        
        const updateResult = await client.query(updateQuery, [clienteId, solicitudInicialExcluida]);
        const solicitudesRechazadas = updateResult.rows;

        console.log(`📝 Solicitudes rechazadas: ${solicitudesRechazadas.length}`);

        await client.query('COMMIT');
        console.log(`✅ Solicitudes rechazadas exitosamente para CUIL: ${cuilCliente}`);

        // Devolver la lista de solicitudes rechazadas con sus comerciantes
        return solicitudesRechazadas.map(row => ({
            id: row.id,
            comercianteId: row.comerciante_id
        }));

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error rechazando solicitudes iniciales:', error);
        throw error;
    } finally {
        client.release();
    }
}
    async getAllCompras(): Promise<Compra[]> {
        const client = await pool.connect();
        try {
            const query = `
                SELECT c.*, 
                   cl.nombre_completo as cliente_nombre,
                   cl.apellido as cliente_apellido,
                   cl.cuil as cliente_cuil,
                   co.nombre_comercio,
                   co.usuario_id as comerciante_id
            FROM compras c
            LEFT JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN comerciantes co ON c.comerciante_id = co.usuario_id
            `;
            const res = await client.query(query);
            
            const compras: Compra[] = [];
            for (const row of res.rows) {
                /*
                const itemsRes = await client.query(
                    'SELECT * FROM items_compra WHERE compra_id = $1',
                    [row.id]
                );
                
                const items = itemsRes.rows.map(item => 
                    new ItemCompra(item.id, item.compra_id, item.nombre, item.precio, item.cantidad)
                );
                */
                const compra =new Compra({
                    id: row.id,
                    solicitudFormalId: row.solicitud_formal_id,
                    descripcion: row.descripcion,
                    cantidadCuotas: row.cantidad_cuotas,
                    //items: items,
                    estado: row.estado,
                    montoTotal: row.monto_total,
                    clienteId: row.cliente_id,
                    fechaCreacion: row.fecha_creacion,
                    fechaActualizacion: row.fecha_actualizacion,
                    valorCuota: row.valor_cuota,
                    numeroAutorizacion: row.numero_autorizacion,
                    numeroCuenta: row.numero_cuenta,
                    comercianteId: row.comerciante_id,
                    analistaAprobadorId: row.analista_aprobador_id,
                    motivoRechazo: row.motivo_rechazo
                });
                // Agregar propiedades adicionales
            (compra as any).cliente_nombre = `${row.cliente_nombre} ${row.cliente_apellido}`;
            (compra as any).nombre_comercio = row.nombre_comercio;
            (compra as any).comerciante_id = row.comerciante_id;
            (compra as any).cliente_cuil = row.cliente_cuil;

            compras.push(compra);
            }
            
            return compras;
        } finally {
            client.release();
        }
    }
    async getSolicitudFormalIdByCompraId(compraId: number): Promise<number | null> {
        const client = await pool.connect();
        try {
            const query = `
                SELECT solicitud_formal_id 
                FROM compras 
                WHERE id = $1
            `;
            const result = await client.query(query, [compraId]);
            
            return result.rows[0]?.solicitud_formal_id || null;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }
    async saveCompra(compra: Compra,clienteId:number): Promise<Compra> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insertar compra
            const compraQuery = `
                INSERT INTO compras (solicitud_formal_id, 
                cliente_id,
                monto_total, 
                descripcion, 
                cantidad_cuotas, 
                estado, 
                cuotas_solicitadas, 
                valor_cuota,
                numero_autorizacion,
                numero_cuenta,
                comerciante_id,
                analista_aprobador_id,
                motivo_rechazo
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id, fecha_creacion, fecha_actualizacion
            `;
            const compraValues = [
                compra.getSolicitudFormalId(),
                clienteId,
                compra.getMontoTotal(),
                compra.getDescripcion(),
                compra.getCantidadCuotas(),
                compra.getEstado(),
                compra.getCantidadCuotas(),
                compra.getValorCuota(),
                compra.getNumeroAutorizacion(),
                compra.getNumeroCuenta(),
                compra.getComercianteId(),
                compra.getAnalistaAprobadorId(),
                compra.getMotivoRechazo() || null
            ];
            const compraRes = await client.query(compraQuery, compraValues);
            const compraId = compraRes.rows[0].id;
            const fechaCreacion = compraRes.rows[0].fecha_creacion;
            const fechaActualizacion = compraRes.rows[0].fecha_actualizacion;
            /*
            // Insertar items
            for (const item of compra.getItems()) { 
                const itemQuery = `
                    INSERT INTO items_compra (compra_id, nombre, precio, cantidad)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                const itemValues = [
                    compraId,
                    item.getNombre(),
                    item.getPrecio(),
                    item.getCantidad()
                ];
                const itemRes = await client.query(itemQuery, itemValues);
                // Asignar el ID generado al item
                item.setId(itemRes.rows[0].id);
            }
*/
            await client.query('COMMIT');

            // Devolver la compra con los IDs asignados
            return new Compra({
                id: compraId,
                solicitudFormalId: compra.getSolicitudFormalId(),
                descripcion: compra.getDescripcion(),
                cantidadCuotas: compra.getCantidadCuotas(),
                //items: compra.getItems(),
                estado: compra.getEstado(),
                montoTotal: compra.getMontoTotal(),
                clienteId: clienteId,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                valorCuota: compra.getValorCuota(),
                numeroAutorizacion: compra.getNumeroAutorizacion(),
                numeroCuenta: compra.getNumeroCuenta(),
                comercianteId: compra.getComercianteId(),
                analistaAprobadorId: compra.getAnalistaAprobadorId()
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getCompraById(id: number): Promise<Compra | null> {
        const client = await pool.connect();
        try {
            // Obtener compra
            const compraQuery = `
                    SELECT c.*, 
                    cl.nombre_completo as cliente_nombre,
                    cl.apellido as cliente_apellido,
                    cl.cuil as cliente_cuil,
                    co.nombre_comercio,
                    co.usuario_id as comerciante_id
                FROM compras c
                LEFT JOIN clientes cl ON c.cliente_id = cl.id
                LEFT JOIN comerciantes co ON c.comerciante_id = co.usuario_id
                WHERE c.id = $1
            `;
            const compraRes = await client.query(compraQuery, [id]);
            if (compraRes.rows.length === 0) {
                return null;
            }
            const compraData = compraRes.rows[0];
            /*
            // Obtener items de la compra
            const itemsQuery = `
                SELECT * FROM items_compra WHERE compra_id = $1
            `;
            const itemsRes = await client.query(itemsQuery, [id]);
            const items = itemsRes.rows.map(row => new ItemCompra(
                row.id,
                row.compra_id,
                row.nombre,
                row.precio,
                row.cantidad
            ));
            */
            const compra = new Compra({
                id: compraData.id,
                solicitudFormalId: compraData.solicitud_formal_id,
                descripcion: compraData.descripcion,
                cantidadCuotas: compraData.cantidad_cuotas,
                //items: items,
                estado: compraData.estado,
                montoTotal: compraData.monto_total,
                clienteId: compraData.cliente_id,
                fechaCreacion: compraData.fecha_creacion,
                fechaActualizacion: compraData.fecha_actualizacion,
                valorCuota: compraData.valor_cuota,
                numeroAutorizacion: compraData.numero_autorizacion,
                numeroCuenta: compraData.numero_cuenta,
                comercianteId: compraData.comerciante_id,
                analistaAprobadorId: compraData.analista_aprobador_id,
                motivoRechazo: compraData.motivo_rechazo
            });

            // Agregar información adicional al objeto plano
            (compra as any).cliente_nombre = `${compraData.cliente_nombre} ${compraData.cliente_apellido}`;
        (compra as any).nombre_comercio = compraData.nombre_comercio;
        (compra as any).comerciante_id = compraData.comerciante_id;
        (compra as any).cliente_cuil = compraData.cliente_cuil;

        return compra;
        } finally {
            client.release();
        }
    }

    async updateCompra(compra: Compra,clienteId:number): Promise<Compra> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Actualizar compra
            const compraQuery = `
                UPDATE compras
                SET monto_total = $1, 
                descripcion = $2, 
                cantidad_cuotas = $3, 
                estado = $4, 
                cuotas_solicitadas = $5, 
                valor_cuota = $6, 
                numero_autorizacion = $7,
                numero_cuenta = $8,
                cliente_id = $9,
                fecha_actualizacion = CURRENT_TIMESTAMP,
                comerciante_id = $11,
                analista_aprobador_id = $12,
                motivo_rechazo = $13
                WHERE id = $10
                RETURNING fecha_actualizacion
            `;
            const compraValues = [
                compra.getMontoTotal(),
                compra.getDescripcion(),
                compra.getCantidadCuotas(),
                compra.getEstado(),
                compra.getCantidadCuotas(),
                compra.getValorCuota(),
                compra.getNumeroAutorizacion(),
                compra.getNumeroCuenta(),
                clienteId,
                compra.getId(),
                compra.getComercianteId(),
                compra.getAnalistaAprobadorId(),
                compra.getMotivoRechazo() || null
            ];
            const compraRes = await client.query(compraQuery, compraValues);
            const fechaActualizacion = compraRes.rows[0].fecha_actualizacion;

            // Actualizar items: 
            // - Eliminar items que ya no están
            // - Actualizar o insertar los nuevos
            /*
            const itemsActuales = compra.getItems();
            const itemsIds = itemsActuales.map(item => item.getId()).filter(id => id !== 0); // Filtrar nuevos (id=0)

            // Eliminar items que no están en la lista actual
            if (itemsIds.length > 0) {
                await client.query(`
                    DELETE FROM items_compra 
                    WHERE compra_id = $1 AND id NOT IN (${itemsIds.join(',')})
                `, [compra.getId()]);
            } else {
                await client.query(`
                    DELETE FROM items_compra 
                    WHERE compra_id = $1
                `, [compra.getId()]);
            }

            // Actualizar o insertar items
            for (const item of itemsActuales) {
                if (item.getId() !== 0) {
                    // Actualizar item existente
                    const updateQuery = `
                        UPDATE items_compra
                        SET nombre = $1, precio = $2, cantidad = $3
                        WHERE id = $4
                    `;
                    await client.query(updateQuery, [
                        item.getNombre(),
                        item.getPrecio(),
                        item.getCantidad(),
                        item.getId()
                    ]);
                } else {
                    // Insertar nuevo item
                    const insertQuery = `
                        INSERT INTO items_compra (compra_id, nombre, precio, cantidad)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id
                    `;
                    const res = await client.query(insertQuery, [
                        compra.getId(),
                        item.getNombre(),
                        item.getPrecio(),
                        item.getCantidad()
                    ]);
                    item.setId(res.rows[0].id);
                }
            }
            */
            await client.query('COMMIT');

            // Devolver compra actualizada
            compra.setFechaActualizacion(fechaActualizacion);
            return compra;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteCompra(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            /*
            // Eliminar items primero
            await client.query('DELETE FROM items_compra WHERE compra_id = $1', [id]);
            */
            // Eliminar compra
            await client.query('DELETE FROM compras WHERE id = $1', [id]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getComprasBySolicitudFormalId(solicitudFormalId: number): Promise<any> {
    const client = await pool.connect();
    try {
        // Obtener compras por solicitud formal
        const comprasQuery = `
            SELECT c.*, 
                   cl.nombre_completo as cliente_nombre,
                   cl.apellido as cliente_apellido,
                   cl.cuil as cliente_cuil,
                   co.nombre_comercio,
                   co.usuario_id as comerciante_id
            FROM compras c
            LEFT JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN comerciantes co ON c.comerciante_id = co.usuario_id
            WHERE c.solicitud_formal_id = $1
        `;
        const comprasRes = await client.query(comprasQuery, [solicitudFormalId]);

        // Verificar si se encontraron compras
        if (comprasRes.rowCount === 0) {
            throw new Error(`No se encontraron compras para la solicitud formal: ${solicitudFormalId}`);
        }

        // Tomar la primera compra (asumiendo que solo hay una por solicitud)
        const compraData = comprasRes.rows[0];
        /*
        // Obtener items de la compra
        const itemsQuery = `
            SELECT * FROM items_compra WHERE compra_id = $1
        `;
        const itemsRes = await client.query(itemsQuery, [compraData.id]);
        const items = itemsRes.rows.map(row => new ItemCompra(
            row.id,
            row.compra_id,
            row.nombre,
            row.precio,
            row.cantidad
        ));
        */
        // Crear y retornar la instancia de Compra
        const compra = new Compra({
            id: compraData.id,
            solicitudFormalId: compraData.solicitud_formal_id,
            descripcion: compraData.descripcion,
            cantidadCuotas: compraData.cantidad_cuotas,
            //items: items,
            estado: compraData.estado,
            montoTotal: compraData.monto_total,
            clienteId: compraData.cliente_id,
            fechaCreacion: compraData.fecha_creacion,
            fechaActualizacion: compraData.fecha_actualizacion,
            valorCuota: compraData.valor_cuota,
            numeroAutorizacion: compraData.numero_autorizacion,
            numeroCuenta: compraData.numero_cuenta,
            comercianteId: compraData.comerciante_id,
            analistaAprobadorId: compraData.analista_aprobador_id,
            motivoRechazo: compraData.motivo_rechazo
        });

        (compra as any).cliente_nombre = `${compraData.cliente_nombre} ${compraData.cliente_apellido}`;
        (compra as any).nombre_comercio = compraData.nombre_comercio;
        (compra as any).comerciante_id = compraData.comerciante_id;
        (compra as any).cliente_cuil = compraData.cliente_cuil;

        return compra;
    } finally {
        client.release();
    }
}

    async getComprasByEstado(estado: EstadoCompra): Promise<Compra[]> {
    const client = await pool.connect();
    try {
        const query = `
            SELECT c.*, 
                   cl.nombre_completo as cliente_nombre,
                   cl.apellido as cliente_apellido,
                   cl.cuil as cliente_cuil,
                   co.nombre_comercio,
                   co.usuario_id as comerciante_id
            FROM compras c
            LEFT JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN comerciantes co ON c.comerciante_id = co.usuario_id
            WHERE c.estado = $1
        `;
        const res = await client.query(query, [estado]);
        
        const compras: Compra[] = [];
        for (const row of res.rows) {
            /*
            // Obtener items para cada compra
            const itemsRes = await client.query(
                'SELECT * FROM items_compra WHERE compra_id = $1',
                [row.id]
            );
            
            const items = itemsRes.rows.map(item => 
                new ItemCompra(item.id, item.compra_id, item.nombre, item.precio, item.cantidad)
            );
            */
            const compra = new Compra({
                    id: row.id,
                    solicitudFormalId: row.solicitud_formal_id,
                    descripcion: row.descripcion,
                    cantidadCuotas: row.cantidad_cuotas,
                    //items: items,
                    estado: row.estado,
                    montoTotal: row.monto_total,
                    clienteId: row.cliente_id,
                    fechaCreacion: row.fecha_creacion,
                    fechaActualizacion: row.fecha_actualizacion,
                    valorCuota: row.valor_cuota,
                    numeroAutorizacion: row.numero_autorizacion,
                    numeroCuenta: row.numero_cuenta,
                    comercianteId: row.comerciante_id,
                    analistaAprobadorId: row.analista_aprobador_id,
                    motivoRechazo: row.motivo_rechazo
                });

                (compra as any).cliente_nombre = `${row.cliente_nombre} ${row.cliente_apellido}`;
        (compra as any).nombre_comercio = row.nombre_comercio;
        (compra as any).comerciante_id = row.comerciante_id;
        (compra as any).cliente_cuil = row.cliente_cuil;

            compras.push(compra);
        }
        
        return compras;
    } finally {
        client.release();
    }
}



    async getComprasByComerciante(comercianteId: number): Promise<Compra[]> {
        const client = await pool.connect();
        try {
            const query = `
                SELECT c.*, 
                   cl.nombre_completo as cliente_nombre,
                   cl.apellido as cliente_apellido,
                   cl.cuil as cliente_cuil,
                   co.nombre_comercio,
                   co.usuario_id as comerciante_id
            FROM compras c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            INNER JOIN comerciantes co ON c.comerciante_id = co.usuario_id
            WHERE c.comerciante_id = $1
            `;
            const res = await client.query(query, [comercianteId]);
            
            const compras: Compra[] = [];
            for (const row of res.rows) {
                /*
                const itemsRes = await client.query(
                    'SELECT * FROM items_compra WHERE compra_id = $1',
                    [row.id]
                );
                
                const items = itemsRes.rows.map(item => 
                    new ItemCompra(item.id, item.compra_id, item.nombre, item.precio, item.cantidad)
                );
                */
                const compra = new Compra({
                    id: row.id,
                    solicitudFormalId: row.solicitud_formal_id,
                    descripcion: row.descripcion,
                    cantidadCuotas: row.cantidad_cuotas,
                    //items: items,
                    estado: row.estado,
                    montoTotal: row.monto_total,
                    clienteId: row.cliente_id,
                    fechaCreacion: row.fecha_creacion,
                    fechaActualizacion: row.fecha_actualizacion,
                    valorCuota: row.valor_cuota,
                    numeroAutorizacion: row.numero_autorizacion,
                    numeroCuenta: row.numero_cuenta,
                    comercianteId: row.comerciante_id,
                    analistaAprobadorId: row.analista_aprobador_id,
                    motivoRechazo: row.motivo_rechazo
                });

                (compra as any).cliente_nombre = `${row.cliente_nombre} ${row.cliente_apellido}`;
        (compra as any).nombre_comercio = row.nombre_comercio;
        (compra as any).comerciante_id = row.comerciante_id;
        (compra as any).cliente_cuil = row.cliente_cuil;

                compras.push(compra);
            }
            return compras;
        } finally {
            client.release();
        }
    }
}