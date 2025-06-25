import { EstadisticasRepositoryPort } from '../../../application/ports/EstadisticasRepositoryPort';
import { pool } from '../../config/Database/DatabaseDonfig';

export class EstadisticasRepositoryAdapter implements EstadisticasRepositoryPort {
  
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

async getEstadisticasComerciantes(desde?: string, hasta?: string): Promise<any> {
  console.log('Obteniendo estadísticas de comerciantes desde:', desde, 'hasta:', hasta);
  
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
    console.log('Estadísticas de analistas obtenidas:', result.rows);
    return result.rows;
  }

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
}