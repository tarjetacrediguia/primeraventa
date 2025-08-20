// src/infrastructure/adapters/repository/CompraRepositoryAdapter.ts
import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../../application/ports/CompraRepositoryPort";
import { ItemCompra } from "../../../domain/entities/ItemCompra";
import { pool } from "../../config/Database/DatabaseDonfig";

export class CompraRepositoryAdapter implements CompraRepositoryPort {
    async getAllCompras(): Promise<Compra[]> {
        const client = await pool.connect();
        try {
            const query = `
                SELECT * FROM compras
            `;
            const res = await client.query(query);
            
            const compras: Compra[] = [];
            for (const row of res.rows) {
                const itemsRes = await client.query(
                    'SELECT * FROM items_compra WHERE compra_id = $1',
                    [row.id]
                );
                
                const items = itemsRes.rows.map(item => 
                    new ItemCompra(item.id, item.compra_id, item.nombre, item.precio, item.cantidad)
                );
                
                compras.push(new Compra({
                    id: row.id,
                    solicitudFormalId: row.solicitud_formal_id,
                    descripcion: row.descripcion,
                    cantidadCuotas: row.cantidad_cuotas,
                    items: items,
                    estado: row.estado,
                    montoTotal: row.monto_total,
                    ponderador: row.ponderador,
                    montoTotalPonderado: row.monto_total_ponderado,
                    clienteId: row.cliente_id,
                    fechaCreacion: row.fecha_creacion,
                    fechaActualizacion: row.fecha_actualizacion,
                    valorCuota: row.valor_cuota,
                    numeroTarjeta: row.numero_tarjeta,
                    numeroCuenta: row.numero_cuenta,
                    comercianteId: row.comerciante_id,
                    analistaAprobadorId: row.analista_aprobador_id
                }));
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
                ponderador, 
                monto_total_ponderado,
                cuotas_solicitadas, 
                valor_cuota,
                numero_tarjeta,
                numero_cuenta,
                comerciante_id,
                analista_aprobador_id
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING id, fecha_creacion, fecha_actualizacion
            `;
            const compraValues = [
                compra.getSolicitudFormalId(),
                clienteId,
                compra.getMontoTotal(),
                compra.getDescripcion(),
                compra.getCantidadCuotas(),
                compra.getEstado(),
                compra.getPonderador(),
                compra.getMontoTotalPonderado(),
                compra.getCantidadCuotas(),
                compra.getValorCuota(),
                compra.getNumeroTarjeta(),
                compra.getNumeroCuenta(),
                compra.getComercianteId(),
                compra.getAnalistaAprobadorId()
            ];
            const compraRes = await client.query(compraQuery, compraValues);
            const compraId = compraRes.rows[0].id;
            const fechaCreacion = compraRes.rows[0].fecha_creacion;
            const fechaActualizacion = compraRes.rows[0].fecha_actualizacion;

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

            await client.query('COMMIT');

            // Devolver la compra con los IDs asignados
            return new Compra({
                id: compraId,
                solicitudFormalId: compra.getSolicitudFormalId(),
                descripcion: compra.getDescripcion(),
                cantidadCuotas: compra.getCantidadCuotas(),
                items: compra.getItems(),
                estado: compra.getEstado(),
                montoTotal: compra.getMontoTotal(),
                ponderador: compra.getPonderador(),
                montoTotalPonderado: compra.getMontoTotalPonderado(),
                clienteId: clienteId,
                fechaCreacion: fechaCreacion,
                fechaActualizacion: fechaActualizacion,
                valorCuota: compra.getValorCuota(),
                numeroTarjeta: compra.getNumeroTarjeta(),
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
                SELECT * FROM compras WHERE id = $1
            `;
            const compraRes = await client.query(compraQuery, [id]);
            if (compraRes.rows.length === 0) {
                return null;
            }
            const compraData = compraRes.rows[0];

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

            return new Compra({
                id: compraData.id,
                solicitudFormalId: compraData.solicitud_formal_id,
                descripcion: compraData.descripcion,
                cantidadCuotas: compraData.cantidad_cuotas,
                items: items,
                estado: compraData.estado,
                montoTotal: compraData.monto_total,
                ponderador: compraData.ponderador,
                montoTotalPonderado: compraData.monto_total_ponderado,
                clienteId: compraData.cliente_id,
                fechaCreacion: compraData.fecha_creacion,
                fechaActualizacion: compraData.fecha_actualizacion,
                valorCuota: compraData.valor_cuota,
                numeroTarjeta: compraData.numero_tarjeta,
                numeroCuenta: compraData.numero_cuenta,
                comercianteId: compraData.comerciante_id,
                analistaAprobadorId: compraData.analista_aprobador_id
            });
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
                valor_cuota = $6, ponderador = $7,
                monto_total_ponderado = $8,
                numero_tarjeta = $9,
                numero_cuenta = $10,
                cliente_id = $11,
                fecha_actualizacion = CURRENT_TIMESTAMP,
                comerciante_id = $13,
                analista_aprobador_id = $14
                WHERE id = $12
                RETURNING fecha_actualizacion
            `;
            const compraValues = [
                compra.getMontoTotal(),
                compra.getDescripcion(),
                compra.getCantidadCuotas(),
                compra.getEstado(),
                compra.getCantidadCuotas(),
                compra.getValorCuota(),
                compra.getPonderador(),
                compra.getMontoTotalPonderado(),
                compra.getNumeroTarjeta(),
                compra.getNumeroCuenta(),
                clienteId,
                compra.getId(),
                compra.getComercianteId(),
                compra.getAnalistaAprobadorId()
            ];
            const compraRes = await client.query(compraQuery, compraValues);
            const fechaActualizacion = compraRes.rows[0].fecha_actualizacion;

            // Actualizar items: 
            // - Eliminar items que ya no están
            // - Actualizar o insertar los nuevos
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

            // Eliminar items primero
            await client.query('DELETE FROM items_compra WHERE compra_id = $1', [id]);

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

    async getComprasBySolicitudFormalId(solicitudFormalId: number): Promise<Compra> {
    const client = await pool.connect();
    try {
        // Obtener compras por solicitud formal
        const comprasQuery = `
            SELECT * FROM compras WHERE solicitud_formal_id = $1
        `;
        const comprasRes = await client.query(comprasQuery, [solicitudFormalId]);

        // Verificar si se encontraron compras
        if (comprasRes.rowCount === 0) {
            throw new Error(`No se encontraron compras para la solicitud formal: ${solicitudFormalId}`);
        }

        // Tomar la primera compra (asumiendo que solo hay una por solicitud)
        const compraData = comprasRes.rows[0];

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

        // Crear y retornar la instancia de Compra
        return new Compra({
            id: compraData.id,
            solicitudFormalId: compraData.solicitud_formal_id,
            descripcion: compraData.descripcion,
            cantidadCuotas: compraData.cantidad_cuotas,
            items: items,
            estado: compraData.estado,
            montoTotal: compraData.monto_total,
            ponderador: compraData.ponderador,
            montoTotalPonderado: compraData.monto_total_ponderado,
            clienteId: compraData.cliente_id,
            fechaCreacion: compraData.fecha_creacion,
            fechaActualizacion: compraData.fecha_actualizacion,
            valorCuota: compraData.valor_cuota,
            numeroTarjeta: compraData.numero_tarjeta,
            numeroCuenta: compraData.numero_cuenta,
            comercianteId: compraData.comerciante_id,
            analistaAprobadorId: compraData.analista_aprobador_id
        });
    } finally {
        client.release();
    }
}

    async getComprasByEstado(estado: EstadoCompra): Promise<Compra[]> {
    const client = await pool.connect();
    try {
        const query = `
            SELECT * FROM compras 
            WHERE estado = $1
        `;
        const res = await client.query(query, [estado]);
        
        const compras: Compra[] = [];
        for (const row of res.rows) {
            // Obtener items para cada compra
            const itemsRes = await client.query(
                'SELECT * FROM items_compra WHERE compra_id = $1',
                [row.id]
            );
            
            const items = itemsRes.rows.map(item => 
                new ItemCompra(item.id, item.compra_id, item.nombre, item.precio, item.cantidad)
            );
            
            compras.push(new Compra({
                    id: row.id,
                    solicitudFormalId: row.solicitud_formal_id,
                    descripcion: row.descripcion,
                    cantidadCuotas: row.cantidad_cuotas,
                    items: items,
                    estado: row.estado,
                    montoTotal: row.monto_total,
                    ponderador: row.ponderador,
                    montoTotalPonderado: row.monto_total_ponderado,
                    clienteId: row.cliente_id,
                    fechaCreacion: row.fecha_creacion,
                    fechaActualizacion: row.fecha_actualizacion,
                    valorCuota: row.valor_cuota,
                    numeroTarjeta: row.numero_tarjeta,
                    numeroCuenta: row.numero_cuenta,
                    comercianteId: row.comerciante_id,
                    analistaAprobadorId: row.analista_aprobador_id
                }));
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
                SELECT * FROM compras 
                WHERE comerciante_id = $1
            `;
            const res = await client.query(query, [comercianteId]);
            
            const compras: Compra[] = [];
            for (const row of res.rows) {
                const itemsRes = await client.query(
                    'SELECT * FROM items_compra WHERE compra_id = $1',
                    [row.id]
                );
                
                const items = itemsRes.rows.map(item => 
                    new ItemCompra(item.id, item.compra_id, item.nombre, item.precio, item.cantidad)
                );
                compras.push(new Compra({
                    id: row.id,
                    solicitudFormalId: row.solicitud_formal_id,
                    descripcion: row.descripcion,
                    cantidadCuotas: row.cantidad_cuotas,
                    items: items,
                    estado: row.estado,
                    montoTotal: row.monto_total,
                    ponderador: row.ponderador,
                    montoTotalPonderado: row.monto_total_ponderado,
                    clienteId: row.cliente_id,
                    fechaCreacion: row.fecha_creacion,
                    fechaActualizacion: row.fecha_actualizacion,
                    valorCuota: row.valor_cuota,
                    numeroTarjeta: row.numero_tarjeta,
                    numeroCuenta: row.numero_cuenta,
                    comercianteId: row.comerciante_id,
                    analistaAprobadorId: row.analista_aprobador_id
                }));
            }
            return compras;
        } finally {
            client.release();
        }
    }
}