package com.gulaburger.actions;

import com.gulaburger.dao.ResenaDAO;
import com.gulaburger.dao.RestauranteDAO;
import com.gulaburger.models.Resena;
import com.gulaburger.models.Restaurante;
import com.gulaburger.utils.ResponseUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Action para operaciones relacionadas con reseñas
 */
public class ResenaAction {

    private static final Logger LOGGER = Logger.getLogger(ResenaAction.class.getName());
    private final ResenaDAO resenaDAO;
    private final RestauranteDAO restauranteDAO;

    /**
     * Constructor
     */
    public ResenaAction() {
        this.resenaDAO = new ResenaDAO();
        this.restauranteDAO = new RestauranteDAO();
    }

    /**
     * Lista las reseñas de un restaurante
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param restauranteId ID del restaurante
     * @return Resultado de la operación en formato JSON
     */
    public String listarResenasPorRestaurante(HttpServletRequest request, HttpServletResponse response, int restauranteId) {
        try {
            // Verificar que el restaurante existe
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante == null) {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            List<Resena> resenas = resenaDAO.findByRestaurante(restauranteId);

            // Obtener valoración media
            double valoracionMedia = resenaDAO.getValoracionMedia(restauranteId);
            int totalResenas = resenaDAO.countByRestaurante(restauranteId);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("resenas", resenas);
            respuesta.put("restaurante_id", restauranteId);
            respuesta.put("restaurante_nombre", restaurante.getNombre());
            respuesta.put("valoracion_media", valoracionMedia);
            respuesta.put("total_resenas", totalResenas);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar reseñas del restaurante", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lista las reseñas de un usuario
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario
     * @return Resultado de la operación en formato JSON
     */
    public String listarResenasPorUsuario(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            List<Resena> resenas = resenaDAO.findByUsuario(usuarioId);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("resenas", resenas);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar reseñas del usuario", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crea una nueva reseña
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String crearResena(HttpServletRequest request, HttpServletResponse response,
                              Map<String, Object> data, int usuarioId) {
        try {
            Integer restauranteId = null;
            Integer puntuacion = null;
            String comentario = (String) data.get("comentario");

            // Obtener restauranteId
            if (data.containsKey("restaurante_id")) {
                if (data.get("restaurante_id") instanceof Integer) {
                    restauranteId = (Integer) data.get("restaurante_id");
                } else if (data.get("restaurante_id") instanceof Number) {
                    restauranteId = ((Number) data.get("restaurante_id")).intValue();
                } else if (data.get("restaurante_id") instanceof String) {
                    restauranteId = Integer.parseInt((String) data.get("restaurante_id"));
                }
            }

            // Obtener puntuación
            if (data.containsKey("puntuacion")) {
                if (data.get("puntuacion") instanceof Integer) {
                    puntuacion = (Integer) data.get("puntuacion");
                } else if (data.get("puntuacion") instanceof Number) {
                    puntuacion = ((Number) data.get("puntuacion")).intValue();
                } else if (data.get("puntuacion") instanceof String) {
                    puntuacion = Integer.parseInt((String) data.get("puntuacion"));
                }
            }

            // Validar campos obligatorios
            if (restauranteId == null || puntuacion == null) {
                return ResponseUtil.crearRespuestaError("Restaurante y puntuación son obligatorios",
                        HttpServletResponse.SC_BAD_REQUEST);
            }

            // Validar rango de puntuación (1-5)
            if (puntuacion < 1 || puntuacion > 5) {
                return ResponseUtil.crearRespuestaError("La puntuación debe estar entre 1 y 5",
                        HttpServletResponse.SC_BAD_REQUEST);
            }

            // Verificar que el restaurante existe
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante == null) {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Crear reseña
            Resena resena = new Resena(usuarioId, restauranteId, puntuacion, comentario);

            // Insertar en la base de datos
            int id = resenaDAO.insert(resena);

            if (id > 0) {
                // Actualizar valoración media del restaurante
                double valoracionMedia = resenaDAO.getValoracionMedia(restauranteId);
                int totalResenas = resenaDAO.countByRestaurante(restauranteId);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", id);
                respuesta.put("mensaje", "Reseña creada exitosamente");
                respuesta.put("valoracion_media", valoracionMedia);
                respuesta.put("total_resenas", totalResenas);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al crear reseña", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en datos numéricos", ex);
            return ResponseUtil.crearRespuestaError("Los valores numéricos deben ser válidos", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al crear reseña", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Elimina una reseña
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param resenaId ID de la reseña a eliminar
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String eliminarResena(HttpServletRequest request, HttpServletResponse response,
                                 int resenaId, int usuarioId) {
        try {
            // Obtener reseña (no hay método directo, tendríamos que implementarlo)
            // Por ahora, simplemente verificamos si se pudo eliminar

            boolean eliminado = resenaDAO.delete(resenaId);

            if (eliminado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Reseña eliminada exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al eliminar reseña o reseña no encontrada",
                        HttpServletResponse.SC_NOT_FOUND);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar reseña", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}