// src/infrastructure/utils/comentariosHelper.ts

/**
 * Helper para manejar comentarios diferenciados por rol
 */

// Etiquetas para identificar el tipo de comentario
export const TIPO_COMENTARIO = {
  COMERCIANTE: '[COMERCIANTE]',
  ANALISTA: '[ANALISTA]'
};

/**
 * Crea un comentario para comerciante
 */
export function crearComentarioComerciante(mensaje: string): string {
  return `${TIPO_COMENTARIO.COMERCIANTE}${mensaje}`;
}

/**
 * Crea un comentario para analista
 */
export function crearComentarioAnalista(mensaje: string): string {
  return `${TIPO_COMENTARIO.ANALISTA}${mensaje}`;
}

/**
 * Filtra comentarios según el rol del usuario
 */
export function filtrarComentariosPorRol(comentarios: string[], rol: string): string[] {
  if (rol === 'comerciante') {
    // Comerciante solo ve comentarios etiquetados para él
    return comentarios
      .filter(comentario => comentario.startsWith(TIPO_COMENTARIO.COMERCIANTE))
      .map(comentario => comentario.substring(TIPO_COMENTARIO.COMERCIANTE.length));
  } else {
    // Analista solo ve comentarios etiquetados para él (sin etiquetas)
    return comentarios
      .filter(comentario => comentario.startsWith(TIPO_COMENTARIO.ANALISTA))
      .map(comentario => comentario.substring(TIPO_COMENTARIO.ANALISTA.length));
  }
}

/**
 * Obtiene el último comentario específico para comerciante
 */
export function obtenerUltimoComentarioComerciante(comentarios: string[]): string {
  const comentariosFiltrados = comentarios
    .filter(comentario => comentario.startsWith(TIPO_COMENTARIO.COMERCIANTE))
    .map(comentario => comentario.substring(TIPO_COMENTARIO.COMERCIANTE.length));

  return comentariosFiltrados.length > 0 
    ? comentariosFiltrados[comentariosFiltrados.length - 1] 
    : '';
}

/**
 * Obtiene el último comentario específico para analista
 */
export function obtenerUltimoComentarioAnalista(comentarios: string[]): string {
  const comentariosFiltrados = comentarios
    .filter(comentario => comentario.startsWith(TIPO_COMENTARIO.ANALISTA))
    .map(comentario => comentario.substring(TIPO_COMENTARIO.ANALISTA.length));

  return comentariosFiltrados.length > 0 
    ? comentariosFiltrados[comentariosFiltrados.length - 1] 
    : '';
}

/**
 * Obtiene todos los comentarios para analista (sin etiquetas)
 */
export function obtenerComentariosAnalista(comentarios: string[]): string[] {
  return comentarios
    .filter(comentario => comentario.startsWith(TIPO_COMENTARIO.ANALISTA))
    .map(comentario => comentario.substring(TIPO_COMENTARIO.ANALISTA.length));
}