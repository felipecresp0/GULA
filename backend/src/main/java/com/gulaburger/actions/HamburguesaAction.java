package com.gulaburger.actions;

import com.gulaburger.dao.HamburguesaDAO;
import com.gulaburger.models.Hamburguesa;
import com.gulaburger.utils.ResponseUtil;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Action para operaciones relacionadas con hamburguesas
 */
public class HamburguesaAction {

    private static final Logger LOGGER = Logger.getLogger(HamburguesaAction.class.getName());
    private final HamburguesaDAO hamburguesaDAO;

    /**
     * Constructor
     */
    public HamburguesaAction() {
        this.hamburguesaDAO = new HamburguesaDAO();
    }

    /**
     * Lista todas las hamburguesas
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarHamburguesas(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Hamburguesa> hamburguesas = hamburguesaDAO.findAll();

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("hamburguesas", hamburguesas);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar hamburguesas", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene una hamburguesa por su ID
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param hamburguesaId ID de la hamburguesa
     * @return Resultado de la operación en formato JSON
     */
    public String obtenerHamburguesa(HttpServletRequest request, HttpServletResponse response, int hamburguesaId) {
        try {
            Hamburguesa hamburguesa = hamburguesaDAO.findById(hamburguesaId);

            if (hamburguesa != null) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("hamburguesa", hamburguesa);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Hamburguesa no encontrada", HttpServletResponse.SC_NOT_FOUND);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener hamburguesa", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crea una nueva hamburguesa
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @return Resultado de la operación en formato JSON
     */
    public String crearHamburguesa(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
        try {
            String nombre = (String) data.get("nombre");
            String descripcion = (String) data.get("descripcion");
            Double precio = null;

            if (data.get("precio") != null) {
                if (data.get("precio") instanceof Double) {
                    precio = (Double) data.get("precio");
                } else if (data.get("precio") instanceof Number) {
                    precio = ((Number) data.get("precio")).doubleValue();
                } else if (data.get("precio") instanceof String) {
                    precio = Double.parseDouble((String) data.get("precio"));
                }
            }

            String imagen = (String) data.get("imagen");
            Boolean destacado = (Boolean) data.get("destacado");

            // Extraer ingredientes (pueden venir como List o como String separada por comas)
            List<String> ingredientes = null;
            Object ingredientesObj = data.get("ingredientes");

            if (ingredientesObj instanceof List) {
                ingredientes = (List<String>) ingredientesObj;
            } else if (ingredientesObj instanceof String) {
                ingredientes = Arrays.asList(((String) ingredientesObj).split(","));
            }

            // Validar campos obligatorios
            if (nombre == null || descripcion == null || precio == null) {
                return ResponseUtil.crearRespuestaError("Nombre, descripción y precio son obligatorios", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Si no hay imagen, usar una por defecto
            if (imagen == null || imagen.isEmpty()) {
                imagen = "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/default-hamburguesa.png";
            }

            // Si no se especifica destacado, por defecto es false
            if (destacado == null) {
                destacado = false;
            }

            Hamburguesa hamburguesa = new Hamburguesa(nombre, descripcion, precio, imagen, destacado, ingredientes);

            int id = hamburguesaDAO.insert(hamburguesa);

            if (id > 0) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", id);
                respuesta.put("mensaje", "Hamburguesa creada exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al crear hamburguesa", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en el precio", ex);
            return ResponseUtil.crearRespuestaError("El precio debe ser un número válido", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al crear hamburguesa", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualiza una hamburguesa existente
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param hamburguesaId ID de la hamburguesa a actualizar
     * @return Resultado de la operación en formato JSON
     */
    public String actualizarHamburguesa(HttpServletRequest request, HttpServletResponse response,
                                        Map<String, Object> data, int hamburguesaId) {
        try {
            // Verificar que la hamburguesa existe
            Hamburguesa hamburguesa = hamburguesaDAO.findById(hamburguesaId);

            if (hamburguesa == null) {
                return ResponseUtil.crearRespuestaError("Hamburguesa no encontrada", HttpServletResponse.SC_NOT_FOUND);
            }

            // Actualizar solo los campos que vienen en la solicitud
            if (data.containsKey("nombre")) {
                hamburguesa.setNombre((String) data.get("nombre"));
            }

            if (data.containsKey("descripcion")) {
                hamburguesa.setDescripcion((String) data.get("descripcion"));
            }

            if (data.containsKey("precio")) {
                if (data.get("precio") instanceof Double) {
                    hamburguesa.setPrecio((Double) data.get("precio"));
                } else if (data.get("precio") instanceof Number) {
                    hamburguesa.setPrecio(((Number) data.get("precio")).doubleValue());
                } else if (data.get("precio") instanceof String) {
                    hamburguesa.setPrecio(Double.parseDouble((String) data.get("precio")));
                }
            }

            if (data.containsKey("imagen")) {
                hamburguesa.setImagen((String) data.get("imagen"));
            }

            if (data.containsKey("destacado")) {
                hamburguesa.setDestacado((Boolean) data.get("destacado"));
            }

            // Actualizar ingredientes si vienen en la solicitud
            if (data.containsKey("ingredientes")) {
                Object ingredientesObj = data.get("ingredientes");
                List<String> ingredientes = null;

                if (ingredientesObj instanceof List) {
                    ingredientes = (List<String>) ingredientesObj;
                } else if (ingredientesObj instanceof String) {
                    ingredientes = Arrays.asList(((String) ingredientesObj).split(","));
                }

                hamburguesa.setIngredientes(ingredientes);
            }

            boolean actualizado = hamburguesaDAO.update(hamburguesa);

            if (actualizado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Hamburguesa actualizada exitosamente");
                respuesta.put("hamburguesa", hamburguesa);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al actualizar hamburguesa", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en el precio", ex);
            return ResponseUtil.crearRespuestaError("El precio debe ser un número válido", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar hamburguesa", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Elimina una hamburguesa
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param hamburguesaId ID de la hamburguesa a eliminar
     * @return Resultado de la operación en formato JSON
     */
    public String eliminarHamburguesa(HttpServletRequest request, HttpServletResponse response, int hamburguesaId) {
        try {
            // Verificar que la hamburguesa existe
            Hamburguesa hamburguesa = hamburguesaDAO.findById(hamburguesaId);

            if (hamburguesa == null) {
                return ResponseUtil.crearRespuestaError("Hamburguesa no encontrada", HttpServletResponse.SC_NOT_FOUND);
            }

            boolean eliminado = hamburguesaDAO.delete(hamburguesaId);

            if (eliminado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Hamburguesa eliminada exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al eliminar hamburguesa", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar hamburguesa", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lista las hamburguesas destacadas
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarDestacadas(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Hamburguesa> hamburguesas = hamburguesaDAO.findDestacadas();

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("hamburguesas", hamburguesas);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar hamburguesas destacadas", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}