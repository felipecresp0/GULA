package com.gulaburger.actions;

import com.gulaburger.dao.CarritoDAO;
import com.gulaburger.dao.ProductoDAO;
import com.gulaburger.models.Carrito;
import com.gulaburger.models.Producto;
import com.gulaburger.utils.ResponseUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Action para operaciones relacionadas con el carrito de compras
 */
public class CarritoAction {

    private static final Logger LOGGER = Logger.getLogger(CarritoAction.class.getName());
    private final CarritoDAO carritoDAO;
    private final ProductoDAO productoDAO;

    /**
     * Constructor
     */
    public CarritoAction() {
        this.carritoDAO = new CarritoDAO();
        this.productoDAO = new ProductoDAO();
    }

    /**
     * Ver el carrito de un usuario
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String verCarrito(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            List<Carrito> items = carritoDAO.findByUsuario(usuarioId);

            // Calcular total del carrito
            double total = 0;
            for (Carrito item : items) {
                total += item.getSubtotal();
            }

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("items", items);
            respuesta.put("total", total);
            respuesta.put("cantidad_items", items.size());

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al ver carrito", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Agregar un producto al carrito
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String agregarProducto(HttpServletRequest request, HttpServletResponse response,
                                  Map<String, Object> data, int usuarioId) {
        try {
            Integer productoId = null;
            Integer cantidad = 1; // Valor por defecto

            // Obtener productoId
            if (data.containsKey("producto_id")) {
                if (data.get("producto_id") instanceof Integer) {
                    productoId = (Integer) data.get("producto_id");
                } else if (data.get("producto_id") instanceof Number) {
                    productoId = ((Number) data.get("producto_id")).intValue();
                } else if (data.get("producto_id") instanceof String) {
                    productoId = Integer.parseInt((String) data.get("producto_id"));
                }
            } else if (data.containsKey("hamburguesa_id")) {
                if (data.get("hamburguesa_id") instanceof Integer) {
                    productoId = (Integer) data.get("hamburguesa_id");
                } else if (data.get("hamburguesa_id") instanceof Number) {
                    productoId = ((Number) data.get("hamburguesa_id")).intValue();
                } else if (data.get("hamburguesa_id") instanceof String) {
                    productoId = Integer.parseInt((String) data.get("hamburguesa_id"));
                }
            } else if (data.containsKey("bebida_id")) {
                if (data.get("bebida_id") instanceof Integer) {
                    productoId = (Integer) data.get("bebida_id");
                } else if (data.get("bebida_id") instanceof Number) {
                    productoId = ((Number) data.get("bebida_id")).intValue();
                } else if (data.get("bebida_id") instanceof String) {
                    productoId = Integer.parseInt((String) data.get("bebida_id"));
                }
            }

            // Obtener cantidad
            if (data.containsKey("cantidad")) {
                if (data.get("cantidad") instanceof Integer) {
                    cantidad = (Integer) data.get("cantidad");
                } else if (data.get("cantidad") instanceof Number) {
                    cantidad = ((Number) data.get("cantidad")).intValue();
                } else if (data.get("cantidad") instanceof String) {
                    cantidad = Integer.parseInt((String) data.get("cantidad"));
                }
            }

            // Validar datos
            if (productoId == null) {
                return ResponseUtil.crearRespuestaError("Debe especificar el ID del producto", HttpServletResponse.SC_BAD_REQUEST);
            }

            if (cantidad <= 0) {
                return ResponseUtil.crearRespuestaError("La cantidad debe ser mayor a 0", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Verificar que el producto existe
            Producto producto = productoDAO.findById(productoId);
            if (producto == null) {
                return ResponseUtil.crearRespuestaError("Producto no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Agregar al carrito
            int itemId = carritoDAO.agregarProducto(usuarioId, productoId, cantidad);

            if (itemId > 0) {
                // Obtener el contador actualizado
                int contador = carritoDAO.obtenerContador(usuarioId);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Producto agregado al carrito");
                respuesta.put("item_id", itemId);
                respuesta.put("contador", contador);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al agregar al carrito", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en ID de producto o cantidad", ex);
            return ResponseUtil.crearRespuestaError("El ID del producto y la cantidad deben ser números", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al agregar producto al carrito", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar la cantidad de un producto en el carrito
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String actualizarCantidad(HttpServletRequest request, HttpServletResponse response,
                                     Map<String, Object> data, int usuarioId) {
        try {
            Integer itemId = null;
            Integer cantidad = null;

            // Obtener itemId
            if (data.containsKey("id")) {
                if (data.get("id") instanceof Integer) {
                    itemId = (Integer) data.get("id");
                } else if (data.get("id") instanceof Number) {
                    itemId = ((Number) data.get("id")).intValue();
                } else if (data.get("id") instanceof String) {
                    itemId = Integer.parseInt((String) data.get("id"));
                }
            }

            // Obtener cantidad
            if (data.containsKey("cantidad")) {
                if (data.get("cantidad") instanceof Integer) {
                    cantidad = (Integer) data.get("cantidad");
                } else if (data.get("cantidad") instanceof Number) {
                    cantidad = ((Number) data.get("cantidad")).intValue();
                } else if (data.get("cantidad") instanceof String) {
                    cantidad = Integer.parseInt((String) data.get("cantidad"));
                }
            }

            // Validar datos
            if (itemId == null || cantidad == null) {
                return ResponseUtil.crearRespuestaError("Debe especificar el ID del item y la cantidad", HttpServletResponse.SC_BAD_REQUEST);
            }

            if (cantidad <= 0) {
                return ResponseUtil.crearRespuestaError("La cantidad debe ser mayor a 0", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Actualizar cantidad
            boolean actualizado = carritoDAO.actualizarCantidad(itemId, cantidad);

            if (actualizado) {
                // Obtener el contador actualizado
                int contador = carritoDAO.obtenerContador(usuarioId);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Cantidad actualizada");
                respuesta.put("contador", contador);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al actualizar cantidad", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en ID de item o cantidad", ex);
            return ResponseUtil.crearRespuestaError("El ID del item y la cantidad deben ser números", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar cantidad en el carrito", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar un item del carrito
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param itemId ID del item a eliminar
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String eliminarItem(HttpServletRequest request, HttpServletResponse response,
                               int itemId, int usuarioId) {
        try {
            boolean eliminado = carritoDAO.eliminarItem(itemId);

            if (eliminado) {
                // Obtener el contador actualizado
                int contador = carritoDAO.obtenerContador(usuarioId);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Item eliminado del carrito");
                respuesta.put("contador", contador);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al eliminar item", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar item del carrito", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar un producto del carrito (usando productoId)
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String eliminarProducto(HttpServletRequest request, HttpServletResponse response,
                                   Map<String, Object> data, int usuarioId) {
        try {
            Integer productoId = null;

            // Obtener productoId
            if (data.containsKey("producto_id")) {
                if (data.get("producto_id") instanceof Integer) {
                    productoId = (Integer) data.get("producto_id");
                } else if (data.get("producto_id") instanceof Number) {
                    productoId = ((Number) data.get("producto_id")).intValue();
                } else if (data.get("producto_id") instanceof String) {
                    productoId = Integer.parseInt((String) data.get("producto_id"));
                }
            }

            // Validar datos
            if (productoId == null) {
                return ResponseUtil.crearRespuestaError("Debe especificar el ID del producto", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Buscar el item en el carrito
            Carrito item = carritoDAO.findItem(usuarioId, productoId);

            if (item == null) {
                return ResponseUtil.crearRespuestaError("Producto no encontrado en el carrito", HttpServletResponse.SC_NOT_FOUND);
            }

            // Eliminar del carrito
            boolean eliminado = carritoDAO.eliminarItem(item.getId());

            if (eliminado) {
                // Obtener el contador actualizado
                int contador = carritoDAO.obtenerContador(usuarioId);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Producto eliminado del carrito");
                respuesta.put("contador", contador);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al eliminar producto", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en ID de producto", ex);
            return ResponseUtil.crearRespuestaError("El ID del producto debe ser un número", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar producto del carrito", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Vaciar el carrito de un usuario
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String vaciarCarrito(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            boolean vaciado = carritoDAO.vaciarCarrito(usuarioId);

            if (vaciado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Carrito vaciado correctamente");
                respuesta.put("contador", 0);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al vaciar carrito", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al vaciar carrito", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener el contador de items en el carrito
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String obtenerContador(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            int contador = carritoDAO.obtenerContador(usuarioId);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("cantidad", contador);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener contador del carrito", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}