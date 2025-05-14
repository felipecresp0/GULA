package com.gulaburger.actions;

import com.gulaburger.dao.ReservaDAO;
import com.gulaburger.dao.RestauranteDAO;
import com.gulaburger.models.Reserva;
import com.gulaburger.models.Restaurante;
import com.gulaburger.utils.ResponseUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Action para operaciones relacionadas con reservas
 */
public class ReservaAction {

    private static final Logger LOGGER = Logger.getLogger(ReservaAction.class.getName());
    private final ReservaDAO reservaDAO;
    private final RestauranteDAO restauranteDAO;

    /**
     * Constructor
     */
    public ReservaAction() {
        this.reservaDAO = new ReservaDAO();
        this.restauranteDAO = new RestauranteDAO();
    }

    /**
     * Lista todas las reservas (solo admin)
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarReservas(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Reserva> reservas = reservaDAO.findAll();

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("reservas", reservas);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar reservas", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lista las reservas de un usuario
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario
     * @return Resultado de la operación en formato JSON
     */
    public String listarReservasUsuario(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            List<Reserva> reservas = reservaDAO.findByUsuario(usuarioId);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("reservas", reservas);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar reservas del usuario", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lista las reservas de un restaurante (solo admin)
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param restauranteId ID del restaurante
     * @return Resultado de la operación en formato JSON
     */
    public String listarReservasRestaurante(HttpServletRequest request, HttpServletResponse response, int restauranteId) {
        try {
            // Verificar que el restaurante existe
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante == null) {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            List<Reserva> reservas = reservaDAO.findByRestaurante(restauranteId);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("reservas", reservas);
            respuesta.put("restaurante", restaurante);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar reservas del restaurante", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene una reserva por su ID
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param reservaId ID de la reserva
     * @param usuarioId ID del usuario autenticado
     * @param rol Rol del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String obtenerReserva(HttpServletRequest request, HttpServletResponse response,
                                 int reservaId, int usuarioId, String rol) {
        try {
            Reserva reserva = reservaDAO.findById(reservaId);

            if (reserva == null) {
                return ResponseUtil.crearRespuestaError("Reserva no encontrada", HttpServletResponse.SC_NOT_FOUND);
            }

            // Verificar permisos: solo el dueño de la reserva o un admin puede verla
            if (reserva.getUsuarioId() != usuarioId && !"admin".equals(rol)) {
                return ResponseUtil.crearRespuestaError("No tienes permiso para ver esta reserva", HttpServletResponse.SC_FORBIDDEN);
            }

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("reserva", reserva);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener reserva", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crea una nueva reserva
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String crearReserva(HttpServletRequest request, HttpServletResponse response,
                               Map<String, Object> data, int usuarioId) {
        try {
            Integer restauranteId = null;
            String fechaStr = (String) data.get("fecha");
            String hora = (String) data.get("hora");
            Integer personas = null;
            String comentarios = (String) data.get("comentarios");

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

            // Obtener personas
            if (data.containsKey("personas")) {
                if (data.get("personas") instanceof Integer) {
                    personas = (Integer) data.get("personas");
                } else if (data.get("personas") instanceof Number) {
                    personas = ((Number) data.get("personas")).intValue();
                } else if (data.get("personas") instanceof String) {
                    personas = Integer.parseInt((String) data.get("personas"));
                }
            }

            // Validar campos obligatorios
            if (restauranteId == null || fechaStr == null || hora == null || personas == null) {
                return ResponseUtil.crearRespuestaError("Restaurante, fecha, hora y número de personas son obligatorios",
                        HttpServletResponse.SC_BAD_REQUEST);
            }

            // Verificar que el restaurante existe
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante == null) {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Convertir string de fecha a Date
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date fecha = dateFormat.parse(fechaStr);

            // Verificar disponibilidad
            int ocupadas = reservaDAO.countReservasPorHora(restauranteId, fecha, hora);

            if (ocupadas >= restaurante.getCapacidad()) {
                return ResponseUtil.crearRespuestaError("No hay disponibilidad para la fecha y hora seleccionadas",
                        HttpServletResponse.SC_CONFLICT);
            }

            // Crear reserva
            Reserva reserva = new Reserva(usuarioId, restauranteId, fecha, hora, personas, comentarios);

            // Insertar en la base de datos
            int id = reservaDAO.insert(reserva);

            if (id > 0) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", id);
                respuesta.put("mensaje", "Reserva creada exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al crear reserva", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en datos numéricos", ex);
            return ResponseUtil.crearRespuestaError("Los valores numéricos deben ser válidos", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al crear reserva", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Cancela una reserva
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param reservaId ID de la reserva a cancelar
     * @param usuarioId ID del usuario autenticado
     * @param rol Rol del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String cancelarReserva(HttpServletRequest request, HttpServletResponse response,
                                  int reservaId, int usuarioId, String rol) {
        try {
            // Verificar que la reserva existe
            Reserva reserva = reservaDAO.findById(reservaId);

            if (reserva == null) {
                return ResponseUtil.crearRespuestaError("Reserva no encontrada", HttpServletResponse.SC_NOT_FOUND);
            }

            // Verificar permisos: solo el dueño de la reserva o un admin puede cancelarla
            if (reserva.getUsuarioId() != usuarioId && !"admin".equals(rol)) {
                return ResponseUtil.crearRespuestaError("No tienes permiso para cancelar esta reserva", HttpServletResponse.SC_FORBIDDEN);
            }

            // Cambiar estado a "cancelada"
            boolean actualizado = reservaDAO.updateEstado(reservaId, "cancelada");

            if (actualizado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Reserva cancelada exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al cancelar reserva", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al cancelar reserva", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene los slots de disponibilidad para un restaurante y fecha
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param restauranteIdStr ID del restaurante (como String)
     * @param fechaStr Fecha de la reserva (como String)
     * @return Resultado de la operación en formato JSON
     */
    public String obtenerDisponibilidad(HttpServletRequest request, HttpServletResponse response,
                                        String restauranteIdStr, String fechaStr) {
        try {
            // Convertir ID a entero
            int restauranteId = Integer.parseInt(restauranteIdStr);

            // Verificar que el restaurante existe
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante == null) {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Convertir string de fecha a Date
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date fecha = dateFormat.parse(fechaStr);

            // Obtener slots disponibles
            List<Map<String, Object>> slots = reservaDAO.getDisponibilidad(restauranteId, fecha);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("slots", slots);
            respuesta.put("restaurante_id", restauranteId);
            respuesta.put("fecha", fechaStr);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en ID de restaurante", ex);
            return ResponseUtil.crearRespuestaError("El ID del restaurante debe ser un número", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener disponibilidad", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}