package com.gulaburger.actions;

import com.gulaburger.dao.RestauranteDAO;
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
 * Action para operaciones relacionadas con restaurantes
 */
public class RestauranteAction {

    private static final Logger LOGGER = Logger.getLogger(RestauranteAction.class.getName());
    private final RestauranteDAO restauranteDAO;

    /**
     * Constructor
     */
    public RestauranteAction() {
        this.restauranteDAO = new RestauranteDAO();
    }

    /**
     * Lista todos los restaurantes
     *
     * @param request  Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarRestaurantes(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Restaurante> restaurantes = restauranteDAO.findAll();

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("restaurantes", restaurantes);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar restaurantes", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene un restaurante por su ID
     *
     * @param request       Solicitud HTTP
     * @param response      Respuesta HTTP
     * @param restauranteId ID del restaurante
     * @return Resultado de la operación en formato JSON
     */
    public String obtenerRestaurante(HttpServletRequest request, HttpServletResponse response, int restauranteId) {
        try {
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante != null) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("restaurante", restaurante);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener restaurante", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Busca restaurantes por código postal
     *
     * @param request      Solicitud HTTP
     * @param response     Respuesta HTTP
     * @param codigoPostal Código postal o prefijo
     * @return Resultado de la operación en formato JSON
     */
    public String buscarPorCodigoPostal(HttpServletRequest request, HttpServletResponse response, String codigoPostal) {
        try {
            List<Restaurante> restaurantes = restauranteDAO.findByCodigoPostal(codigoPostal);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("restaurantes", restaurantes);
            respuesta.put("codigo_postal", codigoPostal);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al buscar restaurantes por código postal", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crea un nuevo restaurante (solo admin)
     *
     * @param request  Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data     Datos de la solicitud
     * @return Resultado de la operación en formato JSON
     */
    public String crearRestaurante(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
        try {
            String nombre = (String) data.get("nombre");
            String direccion = (String) data.get("direccion");
            String codigoPostal = (String) data.get("codigo_postal");
            String telefono = (String) data.get("telefono");
            String horarioApertura = (String) data.get("horario_apertura");
            String horarioCierre = (String) data.get("horario_cierre");

            Double latitud = null;
            Double longitud = null;
            Integer capacidad = null;

            // Obtener latitud
            if (data.get("latitud") != null) {
                if (data.get("latitud") instanceof Double) {
                    latitud = (Double) data.get("latitud");
                } else if (data.get("latitud") instanceof Number) {
                    latitud = ((Number) data.get("latitud")).doubleValue();
                } else if (data.get("latitud") instanceof String) {
                    latitud = Double.parseDouble((String) data.get("latitud"));
                }
            }

            // Obtener longitud
            if (data.get("longitud") != null) {
                if (data.get("longitud") instanceof Double) {
                    longitud = (Double) data.get("longitud");
                } else if (data.get("longitud") instanceof Number) {
                    longitud = ((Number) data.get("longitud")).doubleValue();
                } else if (data.get("longitud") instanceof String) {
                    longitud = Double.parseDouble((String) data.get("longitud"));
                }
            }

            // Obtener capacidad
            if (data.get("capacidad") != null) {
                if (data.get("capacidad") instanceof Integer) {
                    capacidad = (Integer) data.get("capacidad");
                } else if (data.get("capacidad") instanceof Number) {
                    capacidad = ((Number) data.get("capacidad")).intValue();
                } else if (data.get("capacidad") instanceof String) {
                    capacidad = Integer.parseInt((String) data.get("capacidad"));
                }
            }

            // Validar campos obligatorios
            if (nombre == null || direccion == null || codigoPostal == null || telefono == null ||
                    latitud == null || longitud == null) {
                return ResponseUtil.crearRespuestaError("Nombre, dirección, código postal, teléfono, latitud y longitud son obligatorios",
                        HttpServletResponse.SC_BAD_REQUEST);
            }

            // Valores por defecto
            if (horarioApertura == null) {
                horarioApertura = "10:00";
            }

            if (horarioCierre == null) {
                horarioCierre = "22:00";
            }

            if (capacidad == null) {
                capacidad = 50;
            }

            // Crear restaurante
            Restaurante restaurante = new Restaurante(
                    nombre, direccion, codigoPostal, latitud, longitud, telefono,
                    horarioApertura, horarioCierre, capacidad
            );

            // Insertar en la base de datos
            int id = restauranteDAO.insert(restaurante);

            if (id > 0) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", id);
                respuesta.put("mensaje", "Restaurante creado exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al crear restaurante", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en datos numéricos", ex);
            return ResponseUtil.crearRespuestaError("Los valores numéricos deben ser válidos", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al crear restaurante", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualiza un restaurante existente (solo admin)
     *
     * @param request       Solicitud HTTP
     * @param response      Respuesta HTTP
     * @param restauranteId ID del restaurante a actualizar
     * @param data          Datos de la solicitud
     * @return Resultado de la operación en formato JSON
     */
    public String actualizarRestaurante(HttpServletRequest request, HttpServletResponse response,
                                        int restauranteId, Map<String, Object> data) {
        try {
            // Verificar que el restaurante existe
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante == null) {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Actualizar solo los campos que vienen en la solicitud
            if (data.containsKey("nombre")) {
                restaurante.setNombre((String) data.get("nombre"));
            }

            if (data.containsKey("direccion")) {
                restaurante.setDireccion((String) data.get("direccion"));
            }

            if (data.containsKey("codigo_postal")) {
                restaurante.setCodigoPostal((String) data.get("codigo_postal"));
            }

            if (data.containsKey("telefono")) {
                restaurante.setTelefono((String) data.get("telefono"));
            }

            if (data.containsKey("horario_apertura")) {
                restaurante.setHorarioApertura((String) data.get("horario_apertura"));
            }

            if (data.containsKey("horario_cierre")) {
                restaurante.setHorarioCierre((String) data.get("horario_cierre"));
            }

            // Actualizar latitud
            if (data.containsKey("latitud")) {
                if (data.get("latitud") instanceof Double) {
                    restaurante.setLatitud((Double) data.get("latitud"));
                } else if (data.get("latitud") instanceof Number) {
                    restaurante.setLatitud(((Number) data.get("latitud")).doubleValue());
                } else if (data.get("latitud") instanceof String) {
                    restaurante.setLatitud(Double.parseDouble((String) data.get("latitud")));
                }
            }

            // Actualizar longitud
            if (data.containsKey("longitud")) {
                if (data.get("longitud") instanceof Double) {
                    restaurante.setLongitud((Double) data.get("longitud"));
                } else if (data.get("longitud") instanceof Number) {
                    restaurante.setLongitud(((Number) data.get("longitud")).doubleValue());
                } else if (data.get("longitud") instanceof String) {
                    restaurante.setLongitud(Double.parseDouble((String) data.get("longitud")));
                }
            }

            // Actualizar capacidad
            if (data.containsKey("capacidad")) {
                if (data.get("capacidad") instanceof Integer) {
                    restaurante.setCapacidad((Integer) data.get("capacidad"));
                } else if (data.get("capacidad") instanceof Number) {
                    restaurante.setCapacidad(((Number) data.get("capacidad")).intValue());
                } else if (data.get("capacidad") instanceof String) {
                    restaurante.setCapacidad(Integer.parseInt((String) data.get("capacidad")));
                }
            }

            // Actualizar en la base de datos
            boolean actualizado = restauranteDAO.update(restaurante);

            if (actualizado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Restaurante actualizado exitosamente");
                respuesta.put("restaurante", restaurante);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al actualizar restaurante", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en datos numéricos", ex);
            return ResponseUtil.crearRespuestaError("Los valores numéricos deben ser válidos", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar restaurante", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Elimina un restaurante (solo admin)
     *
     * @param request       Solicitud HTTP
     * @param response      Respuesta HTTP
     * @param restauranteId ID del restaurante a eliminar
     * @return Resultado de la operación en formato JSON
     */
    public String eliminarRestaurante(HttpServletRequest request, HttpServletResponse response, int restauranteId) {
        try {
            // Verificar que el restaurante existe
            Restaurante restaurante = restauranteDAO.findById(restauranteId);

            if (restaurante == null) {
                return ResponseUtil.crearRespuestaError("Restaurante no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            boolean eliminado = restauranteDAO.delete(restauranteId);

            if (eliminado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Restaurante eliminado exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al eliminar restaurante", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar restaurante", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}