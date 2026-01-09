import { EstadisticasRepositoryPort } from '../../../application/ports/EstadisticasRepositoryPort';
import { pool } from '../../config/Database/DatabaseDonfig';

/**
 * ADAPTADOR: Repositorio de Estadísticas
 *
 * Este archivo implementa el adaptador para el repositorio de estadísticas del sistema.
 * Proporciona métodos para obtener estadísticas de solicitudes, contratos, usuarios y actividad del sistema.
 */

export class EstadisticasRepositoryAdapter implements EstadisticasRepositoryPort {
  
  /**
   * Obtiene estadísticas de solicitudes iniciales por estado y fecha.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de solicitudes iniciales agrupadas por estado y día.
   */
  async getSolicitudesInicialesStats(desde?: Date, hasta?: Date): Promise<any> {
    const query = `
      SELECT 
        estado,
        COUNT(*) as cantidad,
        DATE_TRUNC('day', fecha_creacion) as dia
      FROM solicitudes_iniciales
      WHERE ($1::DATE IS NULL OR fecha_creacion >= $1)
        AND ($2::DATE IS NULL OR fecha_creacion <= $2)
      GROUP BY estado, dia
      ORDER BY dia DESC;
    `;
    const result = await pool.query(query, [desde, hasta]);
    return result.rows;
  }

  /**
   * Obtiene estadísticas de solicitudes formales por estado y fecha.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de solicitudes formales agrupadas por estado y día.
   */
  async getSolicitudesFormalesStats(desde?: Date, hasta?: Date): Promise<any> {
    const query = `
      SELECT 
        estado,
        COUNT(*) as cantidad,
        DATE_TRUNC('day', fecha_solicitud) as dia
      FROM solicitudes_formales
      WHERE ($1::DATE IS NULL OR fecha_solicitud >= $1)
        AND ($2::DATE IS NULL OR fecha_solicitud <= $2)
      GROUP BY estado, dia
      ORDER BY dia DESC;
    `;
    const result = await pool.query(query, [desde, hasta]);
    return result.rows;
  }

  /**
   * Obtiene estadísticas de tiempos de aprobación de solicitudes.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de tiempos promedio de aprobación por día.
   */
  async getTiemposAprobacionStats(desde?: Date, hasta?: Date): Promise<any> {
    const query = `
      SELECT 
        AVG(EXTRACT(EPOCH FROM (fecha_aprobacion - fecha_creacion)) / 3600) as horas_promedio,
        DATE_TRUNC('day', fecha_creacion) as dia
      FROM solicitudes_iniciales
      WHERE estado = 'aprobada'
        AND ($1::DATE IS NULL OR fecha_creacion >= $1)
        AND ($2::DATE IS NULL OR fecha_creacion <= $2)
      GROUP BY dia
      ORDER BY dia DESC;
    `;
    const result = await pool.query(query, [desde, hasta]);
    return result.rows;
  }

  /**
   * Obtiene estadísticas de tasa de conversión de solicitudes iniciales a formales.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de tasa de conversión.
   */
  async getTasaConversionStats(desde?: Date, hasta?: Date): Promise<any> {
    const query = `
      WITH iniciales_aprobadas AS (
        SELECT COUNT(*) as total
        FROM solicitudes_iniciales
        WHERE estado = 'aprobada'
          AND ($1::DATE IS NULL OR fecha_creacion >= $1)
          AND ($2::DATE IS NULL OR fecha_creacion <= $2)
      ),
      formales_generadas AS (
        SELECT COUNT(DISTINCT solicitud_inicial_id) as total
        FROM solicitudes_formales
        WHERE ($1::DATE IS NULL OR fecha_solicitud >= $1)
          AND ($2::DATE IS NULL OR fecha_solicitud <= $2)
      )
      SELECT 
        ia.total as iniciales_aprobadas,
        fg.total as formales_generadas,
        CASE 
          WHEN ia.total > 0 THEN (fg.total::FLOAT / ia.total) * 100 
          ELSE 0 
        END as tasa_conversion
      FROM iniciales_aprobadas ia, formales_generadas fg;
    `;
    const result = await pool.query(query, [desde, hasta]);
    return result.rows[0];
  }

  /**
   * Obtiene estadísticas de contratos por fecha.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de contratos agrupadas por día.
   */
  async getContratosStats(desde?: Date, hasta?: Date): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as cantidad,
        AVG(monto) as monto_promedio,
        SUM(monto) as monto_total,
        DATE_TRUNC('day', fecha_generacion) as dia
      FROM contratos
      WHERE ($1::DATE IS NULL OR fecha_generacion >= $1)
        AND ($2::DATE IS NULL OR fecha_generacion <= $2)
      GROUP BY dia
      ORDER BY dia DESC;
    `;
    const result = await pool.query(query, [desde, hasta]);
    return result.rows;
  }

  /**
   * Obtiene estadísticas de comerciantes con sus solicitudes y créditos.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas detalladas por comerciante.
   */
  async getEstadisticasComerciantes(desde?: string, hasta?: string): Promise<any> {
    const query = `SELECT 
      c.usuario_id AS comerciante_id,
      u.nombre || ' ' || u.apellido AS nombre_comerciante,
      COUNT(DISTINCT si.id) AS solicitudes_iniciales,
      COUNT(DISTINCT CASE WHEN si.estado = 'aprobada' THEN si.id END) AS solicitudes_iniciales_aprobadas,
      COUNT(DISTINCT CASE WHEN si.estado = 'rechazada' THEN si.id END) AS solicitudes_iniciales_rechazadas,
      COUNT(DISTINCT CASE WHEN si.estado = 'pendiente' THEN si.id END) AS solicitudes_iniciales_pendientes,
      COUNT(DISTINCT CASE WHEN si.estado = 'expirada' THEN si.id END) AS solicitudes_iniciales_expiradas,
      COUNT(DISTINCT sf.id) AS solicitudes_formales,
      COUNT(DISTINCT CASE WHEN sf.estado = 'aprobada' THEN sf.id END) AS solicitudes_formales_aprobadas,
      COUNT(DISTINCT CASE WHEN sf.estado = 'rechazada' THEN sf.id END) AS solicitudes_formales_rechazadas,
      COUNT(DISTINCT CASE WHEN sf.estado = 'pendiente' THEN sf.id END) AS solicitudes_formales_pendientes,
      COUNT(DISTINCT ct.id) AS creditos_aprobados
    FROM comerciantes c
    JOIN usuarios u ON c.usuario_id = u.id
    LEFT JOIN solicitudes_iniciales si 
        ON si.comerciante_id = c.usuario_id
        AND ($1::TIMESTAMP IS NULL OR si.fecha_creacion >= $1::TIMESTAMP)
        AND ($2::TIMESTAMP IS NULL OR si.fecha_creacion <= $2::TIMESTAMP)
    LEFT JOIN solicitudes_formales sf 
        ON sf.comerciante_id = c.usuario_id
        AND ($1::TIMESTAMP IS NULL OR sf.fecha_solicitud >= $1::TIMESTAMP)
        AND ($2::TIMESTAMP IS NULL OR sf.fecha_solicitud <= $2::TIMESTAMP)
    LEFT JOIN contratos ct 
        ON ct.solicitud_formal_id = sf.id
        AND ct.estado = 'aprobado'
    GROUP BY c.usuario_id, u.nombre, u.apellido
    ORDER BY solicitudes_iniciales DESC;`;

    // Asegurar que los valores sean nulos si no están definidos
    const params = [
      desde ? desde : null,
      hasta ? hasta : null
    ];

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Obtiene estadísticas de analistas con tiempos de procesamiento.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de rendimiento por analista.
   */
  async getEstadisticasAnalistas(desde?: string, hasta?: string): Promise<any> {
    const query = `
      SELECT
          a.usuario_id AS analista_id,
          u.nombre || ' ' || u.apellido AS nombre_analista,
          -- Solicitudes aprobadas
          COUNT(sf.id) FILTER (WHERE sf.estado = 'aprobada') AS total_aprobadas,
          AVG(CASE WHEN sf.estado = 'aprobada' THEN EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600 END) AS tiempo_promedio_aprobadas,
          MIN(CASE WHEN sf.estado = 'aprobada' THEN EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600 END) AS tiempo_minimo_aprobadas,
          MAX(CASE WHEN sf.estado = 'aprobada' THEN EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600 END) AS tiempo_maximo_aprobadas,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CASE WHEN sf.estado = 'aprobada' THEN EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600 END) AS mediana_aprobadas,
          -- Solicitudes rechazadas
          COUNT(sf.id) FILTER (WHERE sf.estado = 'rechazada') AS total_rechazadas,
          AVG(CASE WHEN sf.estado = 'rechazada' THEN EXTRACT(EPOCH FROM (sf.fecha_actualizacion - sf.fecha_solicitud)) / 3600 END) AS tiempo_promedio_rechazadas,
          MIN(CASE WHEN sf.estado = 'rechazada' THEN EXTRACT(EPOCH FROM (sf.fecha_actualizacion - sf.fecha_solicitud)) / 3600 END) AS tiempo_minimo_rechazadas,
          MAX(CASE WHEN sf.estado = 'rechazada' THEN EXTRACT(EPOCH FROM (sf.fecha_actualizacion - sf.fecha_solicitud)) / 3600 END) AS tiempo_maximo_rechazadas,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CASE WHEN sf.estado = 'rechazada' THEN EXTRACT(EPOCH FROM (sf.fecha_actualizacion - sf.fecha_solicitud)) / 3600 END) AS mediana_rechazadas
      FROM solicitudes_formales sf
      JOIN analistas a ON sf.analista_aprobador_id = a.usuario_id
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE 
          sf.estado IN ('aprobada', 'rechazada')  -- Incluir ambos estados
          AND (
              (sf.estado = 'aprobada' AND sf.fecha_aprobacion IS NOT NULL) 
              OR 
              (sf.estado = 'rechazada')
          )
          AND ($1::TIMESTAMP IS NULL OR sf.fecha_solicitud >= $1)
          AND ($2::TIMESTAMP IS NULL OR sf.fecha_solicitud <= $2)
      GROUP BY a.usuario_id, u.nombre, u.apellido
      ORDER BY tiempo_promedio_aprobadas ASC;
    `;
    const result = await pool.query(query, [desde, hasta]);
    return result.rows;
  }

  /**
   * Obtiene estadísticas de actividad general del sistema.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de actividad del sistema por día.
   */
  async getActividadSistema(desde?: string, hasta?: string): Promise<any> {
    const query = `
      SELECT 
        DATE_TRUNC('day', fecha_hora)::DATE AS dia,
        COUNT(*) AS total_acciones,
        COUNT(*) FILTER (WHERE entidad_afectada = 'solicitudes_iniciales') AS modificaciones_solicitudes_iniciales,
        COUNT(*) FILTER (WHERE entidad_afectada = 'solicitudes_formales') AS modificaciones_solicitudes_formales,
        COUNT(*) FILTER (WHERE entidad_afectada = 'clientes') AS modificaciones_clientes,
        COUNT(*) FILTER (WHERE entidad_afectada = 'contratos') AS modificaciones_contratos
      FROM historial
      WHERE fecha_hora BETWEEN 
          COALESCE($1::TIMESTAMP, '1970-01-01'::TIMESTAMP) 
          AND 
          COALESCE($2::TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 day')
      GROUP BY dia
      ORDER BY dia DESC;
    `;
    
    
    const result = await pool.query(query, [desde, hasta]);
    return result.rows;
  }

  /**
   * Obtiene estadísticas de tiempos de resolución.
   * @param desde - Fecha de inicio para filtrar (opcional).
   * @param hasta - Fecha de fin para filtrar (opcional).
   * @returns Promise<any> - Estadísticas de tiempos de resolución.
   */
  async getTiemposResolucion(desde?: string, hasta?: string): Promise<any> {
    const query = `
      SELECT 
            a.usuario_id AS analista_id,
            u.nombre || ' ' || u.apellido AS nombre_analista,
            COUNT(sf.id) AS total_solicitudes,
            AVG(EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600) AS horas_promedio,
            PERCENTILE_CONT(0.5) WITHIN GROUP (
                ORDER BY EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600
            ) AS horas_mediana,
            MIN(EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600) AS horas_minimo,
            MAX(EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600) AS horas_maximo
        FROM analistas a
        INNER JOIN usuarios u ON a.usuario_id = u.id
        LEFT JOIN solicitudes_formales sf 
            ON sf.analista_aprobador_id = a.usuario_id
            AND sf.estado IN ('aprobada', 'rechazada')
            AND sf.fecha_solicitud >= COALESCE($1::TIMESTAMP, '1970-01-01'::TIMESTAMP)
            AND sf.fecha_solicitud < COALESCE($2::TIMESTAMP, CURRENT_DATE + INTERVAL '1 day')
        GROUP BY a.usuario_id, u.nombre, u.apellido
        ORDER BY horas_promedio DESC;
    `;
    const result = await pool.query(query, [desde, hasta]);
    return result.rows;
  }

  /**
   * Obtiene estadísticas generales del sistema
   */
  async getEstadisticasSistema(desde?: string, hasta?: string): Promise<any> {
  // Consulta para solicitudes iniciales
  const queryIniciales = `
    SELECT estado, COUNT(*) as cantidad
    FROM solicitudes_iniciales
    WHERE ($1::TIMESTAMP IS NULL OR fecha_creacion >= $1)
      AND ($2::TIMESTAMP IS NULL OR fecha_creacion <= $2)
    GROUP BY estado
  `;
  
  // Consulta para solicitudes formales
  const queryFormales = `
    SELECT estado, COUNT(*) as cantidad
    FROM solicitudes_formales
    WHERE ($1::TIMESTAMP IS NULL OR fecha_solicitud >= $1)
      AND ($2::TIMESTAMP IS NULL OR fecha_solicitud <= $2)
    GROUP BY estado
  `;
  
  // Consulta para compras
  const queryCompras = `
    SELECT estado::text as estado, COUNT(*) as cantidad
    FROM compras
    WHERE ($1::TIMESTAMP IS NULL OR fecha_creacion >= $1)
      AND ($2::TIMESTAMP IS NULL OR fecha_creacion <= $2)
    GROUP BY estado
  `;
  
  const params = [desde || null, hasta || null];
  
  const [inicialesResult, formalesResult, comprasResult] = await Promise.all([
    pool.query(queryIniciales, params),
    pool.query(queryFormales, params),
    pool.query(queryCompras, params)
  ]);
  
  // Convertir a objetos JSON
  const estadisticasIniciales: Record<string, number> = {};
  inicialesResult.rows.forEach(row => {
    estadisticasIniciales[row.estado] = parseInt(row.cantidad);
  });
  
  const estadisticasFormales: Record<string, number> = {};
  formalesResult.rows.forEach(row => {
    estadisticasFormales[row.estado] = parseInt(row.cantidad);
  });
  
  const estadisticasCompras: Record<string, number> = {};
  comprasResult.rows.forEach(row => {
    estadisticasCompras[row.estado] = parseInt(row.cantidad);
  });
  
  // Calcular totales
  const totalIniciales = Object.values(estadisticasIniciales).reduce((a, b) => a + b, 0);
  const totalFormales = Object.values(estadisticasFormales).reduce((a, b) => a + b, 0);
  const totalCompras = Object.values(estadisticasCompras).reduce((a, b) => a + b, 0);
  
  // Obtener monto total aprobado
  const montoQuery = `
    SELECT COALESCE(SUM(monto_total), 0) as monto_total
    FROM compras 
    WHERE estado = 'aprobada'
      AND ($1::TIMESTAMP IS NULL OR fecha_creacion >= $1)
      AND ($2::TIMESTAMP IS NULL OR fecha_creacion <= $2)
  `;
  
  const montoResult = await pool.query(montoQuery, params);
  const montoTotalAprobado = parseFloat(montoResult.rows[0].monto_total) || 0;
  
  return {
    estadisticas: {
      solicitudes_iniciales: estadisticasIniciales,
      solicitudes_formales: estadisticasFormales,
      compras: estadisticasCompras
    },
    totales: {
      solicitudes_iniciales: totalIniciales,
      solicitudes_formales: totalFormales,
      compras: totalCompras,
      monto_total_aprobado: montoTotalAprobado
    }
  };
}

  /**
   * Obtiene estadísticas de compras
   */
  async getEstadisticasCompras(desde?: string, hasta?: string): Promise<any> {
  const query = `
    WITH top_comerciantes_data AS (
      SELECT 
        c.comerciante_id,
        u.nombre || ' ' || u.apellido as nombre_comerciante,
        COUNT(*) as total_compras,
        SUM(c.monto_total) as monto_total
      FROM compras c
      LEFT JOIN usuarios u ON c.comerciante_id = u.id
      WHERE c.estado = 'aprobada'
        AND ($1::TIMESTAMP IS NULL OR c.fecha_creacion >= $1)
        AND ($2::TIMESTAMP IS NULL OR c.fecha_creacion <= $2)
      GROUP BY c.comerciante_id, u.nombre, u.apellido
      ORDER BY total_compras DESC
      LIMIT 5
    ),
    todas_las_compras AS (
      SELECT * FROM compras
      WHERE ($1::TIMESTAMP IS NULL OR fecha_creacion >= $1)
        AND ($2::TIMESTAMP IS NULL OR fecha_creacion <= $2)
    )
    SELECT 
      -- Conteo por estado
      COUNT(*) FILTER (WHERE estado = 'aprobada') as compras_aprobadas,
      COUNT(*) FILTER (WHERE estado = 'pendiente') as compras_pendientes,
      COUNT(*) FILTER (WHERE estado = 'rechazada') as compras_rechazadas,
      COUNT(*) as total_compras,
      
      -- Métricas financieras
      COALESCE(SUM(monto_total) FILTER (WHERE estado = 'aprobada'), 0) as monto_total_aprobado,
      COALESCE(AVG(monto_total) FILTER (WHERE estado = 'aprobada'), 0) as monto_promedio_aprobado,
      COALESCE(SUM(cantidad_cuotas) FILTER (WHERE estado = 'aprobada'), 0) as total_cuotas_aprobadas,
      COALESCE(AVG(cantidad_cuotas) FILTER (WHERE estado = 'aprobada'), 0) as cuotas_promedio_aprobadas,
      
      -- Distribución por cantidad de cuotas
      COUNT(*) FILTER (WHERE estado = 'aprobada' AND cantidad_cuotas BETWEEN 3 AND 6) as compras_3_6_cuotas,
      COUNT(*) FILTER (WHERE estado = 'aprobada' AND cantidad_cuotas BETWEEN 7 AND 10) as compras_7_10_cuotas,
      COUNT(*) FILTER (WHERE estado = 'aprobada' AND cantidad_cuotas BETWEEN 11 AND 14) as compras_11_14_cuotas,
      
      -- Por comerciante (top 5)
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'comerciante_id', tcd.comerciante_id,
              'nombre_comerciante', tcd.nombre_comerciante,
              'total_compras', tcd.total_compras,
              'monto_total', tcd.monto_total
            )
          )
          FROM top_comerciantes_data tcd
        ), 
        '[]'::json
      ) as top_comerciantes
    FROM todas_las_compras;
  `;
  
  const params = [desde || null, hasta || null];
  const result = await pool.query(query, params);
  return result.rows[0];
}

  /**
   * Obtiene estadísticas agrupadas por comercio
   */
  async getEstadisticasPorComercio(desde?: string, hasta?: string, comercio_id?: string): Promise<any> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [desde || null, hasta || null];
    
    if (comercio_id) {
      params.push(comercio_id);
      whereClause += ' AND c.numero_comercio = $3';
    }
    
    const query = `
      WITH comercios_data AS (
        SELECT 
          c.numero_comercio,
          c.nombre_comercio,
          COUNT(DISTINCT cm.usuario_id) as total_comerciantes,
          
          -- Solicitudes iniciales por comercio
          COUNT(DISTINCT si.id) as solicitudes_iniciales,
          COUNT(DISTINCT CASE WHEN si.estado = 'aprobada' THEN si.id END) as solicitudes_iniciales_aprobadas,
          COUNT(DISTINCT CASE WHEN si.estado = 'rechazada' THEN si.id END) as solicitudes_iniciales_rechazadas,
          COUNT(DISTINCT CASE WHEN si.estado = 'pendiente' THEN si.id END) as solicitudes_iniciales_pendientes,
          
          -- Solicitudes formales por comercio
          COUNT(DISTINCT sf.id) as solicitudes_formales,
          COUNT(DISTINCT CASE WHEN sf.estado = 'aprobada' THEN sf.id END) as solicitudes_formales_aprobadas,
          COUNT(DISTINCT CASE WHEN sf.estado = 'rechazada' THEN sf.id END) as solicitudes_formales_rechazadas,
          COUNT(DISTINCT CASE WHEN sf.estado = 'pendiente' THEN sf.id END) as solicitudes_formales_pendientes,
          
          -- Compras por comercio
          COUNT(DISTINCT cp.id) as compras,
          COUNT(DISTINCT CASE WHEN cp.estado = 'aprobada' THEN cp.id END) as compras_aprobadas,
          COUNT(DISTINCT CASE WHEN cp.estado = 'pendiente' THEN cp.id END) as compras_pendientes,
          COUNT(DISTINCT CASE WHEN cp.estado = 'rechazada' THEN cp.id END) as compras_rechazadas,
          
          -- Métricas financieras
          SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END) as monto_total_aprobado,
          AVG(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total END) as monto_promedio_aprobado
          
        FROM comercios c
        LEFT JOIN comerciantes cm ON c.numero_comercio = cm.numero_comercio
        LEFT JOIN solicitudes_iniciales si 
          ON si.comerciante_id = cm.usuario_id
          AND ($1::TIMESTAMP IS NULL OR si.fecha_creacion >= $1)
          AND ($2::TIMESTAMP IS NULL OR si.fecha_creacion <= $2)
        LEFT JOIN solicitudes_formales sf 
          ON sf.comerciante_id = cm.usuario_id
          AND ($1::TIMESTAMP IS NULL OR sf.fecha_solicitud >= $1)
          AND ($2::TIMESTAMP IS NULL OR sf.fecha_solicitud <= $2)
        LEFT JOIN compras cp 
          ON cp.comerciante_id = cm.usuario_id
          AND ($1::TIMESTAMP IS NULL OR cp.fecha_creacion >= $1)
          AND ($2::TIMESTAMP IS NULL OR cp.fecha_creacion <= $2)
        ${whereClause}
        GROUP BY c.numero_comercio, c.nombre_comercio
      )
      SELECT 
        *,
        CASE 
          WHEN solicitudes_iniciales > 0 
          THEN (solicitudes_iniciales_aprobadas::FLOAT / solicitudes_iniciales) * 100 
          ELSE 0 
        END as tasa_aprobacion_iniciales,
        
        CASE 
          WHEN solicitudes_formales > 0 
          THEN (solicitudes_formales_aprobadas::FLOAT / solicitudes_formales) * 100 
          ELSE 0 
        END as tasa_aprobacion_formales,
        
        CASE 
          WHEN compras > 0 
          THEN (compras_aprobadas::FLOAT / compras) * 100 
          ELSE 0 
        END as tasa_aprobacion_compras
        
      FROM comercios_data
      ORDER BY monto_total_aprobado DESC;
    `;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Obtiene estadísticas por comerciante específico
   */
  async getEstadisticasPorComerciante(desde?: string, hasta?: string, comerciante_id?: string): Promise<any> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [desde || null, hasta || null];
    
    if (comerciante_id) {
      params.push(comerciante_id);
      whereClause += ' AND cm.usuario_id = $3';
    }
    
    const query = `
      SELECT 
        cm.usuario_id as comerciante_id,
        u.nombre || ' ' || u.apellido as nombre_comerciante,
        c.numero_comercio,
        c.nombre_comercio,
        
        -- Solicitudes iniciales
        COUNT(DISTINCT si.id) as total_solicitudes_iniciales,
        COUNT(DISTINCT CASE WHEN si.estado = 'aprobada' THEN si.id END) as solicitudes_iniciales_aprobadas,
        COUNT(DISTINCT CASE WHEN si.estado = 'rechazada' THEN si.id END) as solicitudes_iniciales_rechazadas,
        COUNT(DISTINCT CASE WHEN si.estado = 'pendiente' THEN si.id END) as solicitudes_iniciales_pendientes,
        COUNT(DISTINCT CASE WHEN si.estado = 'expirada' THEN si.id END) as solicitudes_iniciales_expiradas,
        
        -- Solicitudes formales
        COUNT(DISTINCT sf.id) as total_solicitudes_formales,
        COUNT(DISTINCT CASE WHEN sf.estado = 'aprobada' THEN sf.id END) as solicitudes_formales_aprobadas,
        COUNT(DISTINCT CASE WHEN sf.estado = 'rechazada' THEN sf.id END) as solicitudes_formales_rechazadas,
        COUNT(DISTINCT CASE WHEN sf.estado = 'pendiente' THEN sf.id END) as solicitudes_formales_pendientes,
        COUNT(DISTINCT CASE WHEN sf.estado = 'aprobada_sin_aumento' THEN sf.id END) as solicitudes_formales_aprobadas_sin_aumento,
        
        -- Compras
        COUNT(DISTINCT cp.id) as total_compras,
        COUNT(DISTINCT CASE WHEN cp.estado = 'aprobada' THEN cp.id END) as compras_aprobadas,
        COUNT(DISTINCT CASE WHEN cp.estado = 'pendiente' THEN cp.id END) as compras_pendientes,
        COUNT(DISTINCT CASE WHEN cp.estado = 'rechazada' THEN cp.id END) as compras_rechazadas,
        
        -- Métricas financieras de compras
        SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END) as monto_total_compras,
        AVG(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total END) as monto_promedio_compras,
        SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.cantidad_cuotas ELSE 0 END) as total_cuotas,
        AVG(CASE WHEN cp.estado = 'aprobada' THEN cp.cantidad_cuotas END) as cuotas_promedio,
        
        -- Tiempos de procesamiento
        AVG(CASE WHEN si.estado = 'aprobada' THEN EXTRACT(EPOCH FROM (si.fecha_aprobacion - si.fecha_creacion)) / 3600 END) as tiempo_promedio_aprobacion_iniciales,
        AVG(CASE WHEN sf.estado = 'aprobada' THEN EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600 END) as tiempo_promedio_aprobacion_formales
        
      FROM comerciantes cm
      INNER JOIN usuarios u ON cm.usuario_id = u.id
      INNER JOIN comercios c ON cm.numero_comercio = c.numero_comercio
      LEFT JOIN solicitudes_iniciales si 
        ON si.comerciante_id = cm.usuario_id
        AND ($1::TIMESTAMP IS NULL OR si.fecha_creacion >= $1)
        AND ($2::TIMESTAMP IS NULL OR si.fecha_creacion <= $2)
      LEFT JOIN solicitudes_formales sf 
        ON sf.comerciante_id = cm.usuario_id
        AND ($1::TIMESTAMP IS NULL OR sf.fecha_solicitud >= $1)
        AND ($2::TIMESTAMP IS NULL OR sf.fecha_solicitud <= $2)
      LEFT JOIN compras cp 
        ON cp.comerciante_id = cm.usuario_id
        AND ($1::TIMESTAMP IS NULL OR cp.fecha_creacion >= $1)
        AND ($2::TIMESTAMP IS NULL OR cp.fecha_creacion <= $2)
      ${whereClause}
      GROUP BY cm.usuario_id, u.nombre, u.apellido, c.numero_comercio, c.nombre_comercio
      ORDER BY monto_total_compras DESC;
    `;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Obtiene ranking de comercios por ventas/compras
   */
  async getRankingComercios(desde?: string, hasta?: string, limite: number = 10): Promise<any> {
  const query = `
    WITH tendencia_data AS (
      SELECT 
        c.numero_comercio,
        TO_CHAR(cp.fecha_creacion, 'YYYY-MM') as mes,
        COUNT(cp.id) as compras,
        SUM(cp.monto_total) as monto_total
      FROM comercios c
      LEFT JOIN comerciantes cm ON c.numero_comercio = cm.numero_comercio
      LEFT JOIN compras cp 
        ON cp.comerciante_id = cm.usuario_id
        AND cp.estado = 'aprobada'
        AND ($1::TIMESTAMP IS NULL OR cp.fecha_creacion >= $1)
        AND ($2::TIMESTAMP IS NULL OR cp.fecha_creacion <= $2)
      GROUP BY c.numero_comercio, TO_CHAR(cp.fecha_creacion, 'YYYY-MM')
    )
    SELECT 
      c.numero_comercio,
      c.nombre_comercio,
      COUNT(DISTINCT cm.usuario_id) as total_comerciantes,
      COUNT(DISTINCT cp.id) as total_compras,
      COUNT(DISTINCT CASE WHEN cp.estado = 'aprobada' THEN cp.id END) as compras_aprobadas,
      COALESCE(SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END), 0) as monto_total_aprobado,
      COALESCE(AVG(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total END), 0) as monto_promedio_aprobado,
      RANK() OVER (ORDER BY COALESCE(SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END), 0) DESC) as ranking_monto,
      RANK() OVER (ORDER BY COUNT(DISTINCT CASE WHEN cp.estado = 'aprobada' THEN cp.id END) DESC) as ranking_cantidad,
      
      -- Distribución por mes (últimos 6 meses)
      COALESCE(
        (SELECT json_agg(
          json_build_object(
            'mes', td.mes,
            'compras', td.compras,
            'monto_total', td.monto_total
          )
          ORDER BY td.mes DESC
        )
        FROM tendencia_data td
        WHERE td.numero_comercio = c.numero_comercio
        ), 
        '[]'::json
      ) as tendencia_mensual
      
    FROM comercios c
    LEFT JOIN comerciantes cm ON c.numero_comercio = cm.numero_comercio
    LEFT JOIN compras cp 
      ON cp.comerciante_id = cm.usuario_id
      AND ($1::TIMESTAMP IS NULL OR cp.fecha_creacion >= $1)
      AND ($2::TIMESTAMP IS NULL OR cp.fecha_creacion <= $2)
      AND cp.estado = 'aprobada'
    GROUP BY c.numero_comercio, c.nombre_comercio
    HAVING COUNT(DISTINCT CASE WHEN cp.estado = 'aprobada' THEN cp.id END) > 0
    ORDER BY monto_total_aprobado DESC
    LIMIT $3;
  `;
  
  const params = [desde || null, hasta || null, limite];
  const result = await pool.query(query, params);
  return result.rows;
}

  /**
   * Obtiene ranking de comerciantes por ventas/compras
   */
  async getRankingComerciantes(desde?: string, hasta?: string, comercio_id?: string, limite: number = 10): Promise<any> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [desde || null, hasta || null];
    
    if (comercio_id) {
      params.push(comercio_id);
      whereClause += ' AND c.numero_comercio = $3';
      params.push(limite);
    } else {
      params.push(limite);
    }
    
    const paramIndex = params.length;
    
    const query = `
      SELECT 
        cm.usuario_id as comerciante_id,
        u.nombre || ' ' || u.apellido as nombre_comerciante,
        c.numero_comercio,
        c.nombre_comercio,
        u.email,
        COUNT(DISTINCT cp.id) as total_compras,
        COUNT(DISTINCT CASE WHEN cp.estado = 'aprobada' THEN cp.id END) as compras_aprobadas,
        SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END) as monto_total_aprobado,
        AVG(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total END) as monto_promedio_aprobado,
        AVG(CASE WHEN cp.estado = 'aprobada' THEN cp.cantidad_cuotas END) as cuotas_promedio,
        
        -- Ranking general
        RANK() OVER (ORDER BY SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END) DESC) as ranking_monto_global,
        
        -- Ranking dentro del comercio
        RANK() OVER (
          PARTITION BY c.numero_comercio 
          ORDER BY SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END) DESC
        ) as ranking_monto_comercio,
        
        -- Porcentaje de contribución dentro del comercio
        CASE 
          WHEN SUM(SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END)) OVER (PARTITION BY c.numero_comercio) > 0
          THEN (SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END) * 100.0) / 
               SUM(SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END)) OVER (PARTITION BY c.numero_comercio)
          ELSE 0
        END as porcentaje_contribucion,
        
        -- Estadísticas de conversión
        COUNT(DISTINCT si.id) as solicitudes_iniciales,
        COUNT(DISTINCT sf.id) as solicitudes_formales,
        CASE 
          WHEN COUNT(DISTINCT si.id) > 0 
          THEN (COUNT(DISTINCT sf.id)::FLOAT / COUNT(DISTINCT si.id)) * 100 
          ELSE 0 
        END as tasa_conversion_formales,
        CASE 
          WHEN COUNT(DISTINCT sf.id) > 0 
          THEN (COUNT(DISTINCT cp.id)::FLOAT / COUNT(DISTINCT sf.id)) * 100 
          ELSE 0 
        END as tasa_conversion_compras
        
      FROM comerciantes cm
      INNER JOIN usuarios u ON cm.usuario_id = u.id
      INNER JOIN comercios c ON cm.numero_comercio = c.numero_comercio
      LEFT JOIN solicitudes_iniciales si 
        ON si.comerciante_id = cm.usuario_id
        AND ($1::TIMESTAMP IS NULL OR si.fecha_creacion >= $1)
        AND ($2::TIMESTAMP IS NULL OR si.fecha_creacion <= $2)
      LEFT JOIN solicitudes_formales sf 
        ON sf.comerciante_id = cm.usuario_id
        AND ($1::TIMESTAMP IS NULL OR sf.fecha_solicitud >= $1)
        AND ($2::TIMESTAMP IS NULL OR sf.fecha_solicitud <= $2)
      LEFT JOIN compras cp 
        ON cp.comerciante_id = cm.usuario_id
        AND ($1::TIMESTAMP IS NULL OR cp.fecha_creacion >= $1)
        AND ($2::TIMESTAMP IS NULL OR cp.fecha_creacion <= $2)
      ${whereClause}
      GROUP BY cm.usuario_id, u.nombre, u.apellido, u.email, c.numero_comercio, c.nombre_comercio
      HAVING COUNT(DISTINCT CASE WHEN cp.estado = 'aprobada' THEN cp.id END) > 0
      ORDER BY monto_total_aprobado DESC
      LIMIT $${paramIndex};
    `;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Obtiene todos los comercios con sus códigos
   */
  async getTodosComercios(): Promise<any> {
    const query = `
      SELECT 
        numero_comercio as codigo,
        nombre_comercio as nombre,
        cuil,
        direccion_comercio as direccion,
        fecha_creacion
      FROM comercios
      ORDER BY nombre_comercio;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Obtiene los comerciantes asociados a un comercio específico
   */
  async getComerciantesPorComercio(comercio_id: string): Promise<any> {
    const query = `
      SELECT 
        c.usuario_id as comerciante_id,
        u.nombre || ' ' || u.apellido as nombre_completo,
        u.email,
        u.telefono,
        u.activo,
        u.fecha_creacion,
        u.ultimo_login,
        -- Estadísticas del comerciante en este comercio
        COUNT(DISTINCT si.id) as total_solicitudes_iniciales,
        COUNT(DISTINCT sf.id) as total_solicitudes_formales,
        COUNT(DISTINCT cp.id) as total_compras,
        SUM(CASE WHEN cp.estado = 'aprobada' THEN cp.monto_total ELSE 0 END) as monto_total_compras
      FROM comerciantes c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      LEFT JOIN solicitudes_iniciales si ON si.comerciante_id = c.usuario_id
      LEFT JOIN solicitudes_formales sf ON sf.comerciante_id = c.usuario_id
      LEFT JOIN compras cp ON cp.comerciante_id = c.usuario_id
      WHERE c.numero_comercio = $1
      GROUP BY c.usuario_id, u.nombre, u.apellido, u.email, u.telefono, 
               u.activo, u.fecha_creacion, u.ultimo_login
      ORDER BY nombre_completo;
    `;
    const result = await pool.query(query, [comercio_id]);
    return result.rows;
  }

  /**
   * Obtiene todos los analistas del sistema
   */
  async getTodosAnalistas(): Promise<any> {
    const query = `
      SELECT 
        a.usuario_id as analista_id,
        u.nombre || ' ' || u.apellido as nombre_completo,
        u.email,
        u.telefono,
        u.activo,
        u.fecha_creacion,
        u.ultimo_login,
        -- Estadísticas del analista
        COUNT(DISTINCT sf.id) as total_solicitudes_asignadas,
        COUNT(DISTINCT CASE WHEN sf.estado = 'aprobada' THEN sf.id END) as solicitudes_aprobadas,
        COUNT(DISTINCT CASE WHEN sf.estado = 'rechazada' THEN sf.id END) as solicitudes_rechazadas,
        AVG(CASE WHEN sf.estado = 'aprobada' THEN EXTRACT(EPOCH FROM (sf.fecha_aprobacion - sf.fecha_solicitud)) / 3600 END) as tiempo_promedio_aprobacion
      FROM analistas a
      INNER JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN solicitudes_formales sf ON sf.analista_aprobador_id = a.usuario_id
      GROUP BY a.usuario_id, u.nombre, u.apellido, u.email, u.telefono, 
               u.activo, u.fecha_creacion, u.ultimo_login
      ORDER BY nombre_completo;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}
