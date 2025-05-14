package com.gulaburger.actions;

import com.gulaburger.dao.PedidoDAO;
import com.gulaburger.dao.CarritoDAO;
import com.gulaburger.dao.ProductoDAO;
import com.gulaburger.dao.UsuarioDAO;
import com.gulaburger.models.Pedido;
import com.gulaburger.models.LineaPedido;
import com.gulaburger.models.Carrito;
import com.gulaburger.models.Producto;
import com.gulaburger.models.Usuario;
import com.gulaburger.utils.ResponseUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Action para operaciones relacionadas con pedidos
 */
public class PedidoAction {

    private static final Logger LOGGER = Logger.getLogger(PedidoAction.class.getName());
    private final PedidoDAO pedidoDAO;
    private final CarritoDAO carritoDAO;
    private final ProductoDAO productoDAO;
    private final UsuarioDAO usuarioDAO;

    /**
     * Constructor
     */
    public PedidoAction() {
        this.pedidoDAO = new PedidoDAO();
        this.carritoDAO = new CarritoDAO();
        this.productoDAO = new ProductoDAO();
        this.usuarioDAO = new UsuarioDAO();
    }

    /**
     * Lista todos los pedidos (solo admin)
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarPedidos(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Pedido> pedidos = pedidoDAO.findAll();

            // Agregar información de usuario a cada pedido
            for (Pedido pedido : pedidos) {
                Usuario usuario = usuarioDAO.findById(pedido.getUsuarioId());
                if (usuario != null) {
                    pedido.setUsuarioNombre(usuario.getNombre());
                }
            }

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("pedidos", pedidos);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar pedidos", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lista los pedidos de un usuario
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario
     * @return Resultado de la operación en formato JSON
     */
    public String listarPedidosUsuario(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            List<Pedido> pedidos = pedidoDAO.findByUsuario(usuarioId);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("pedidos", pedidos);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar pedidos del usuario", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Ver detalle de un pedido
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param pedidoId ID del pedido
     * @param usuarioId ID del usuario autenticado
     * @param rol Rol del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String verPedido(HttpServletRequest request, HttpServletResponse response,
                            int pedidoId, int usuarioId, String rol) {
        try {
            Pedido pedido = pedidoDAO.findById(pedidoId);

            if (pedido == null) {
                return ResponseUtil.crearRespuestaError("Pedido no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Verificar permisos: solo el dueño del pedido o un admin puede verlo
            if (pedido.getUsuarioId() != usuarioId && !"admin".equals(rol)) {
                return ResponseUtil.crearRespuestaError("No tienes permiso para ver este pedido", HttpServletResponse.SC_FORBIDDEN);
            }

            // Agregar información de usuario si es admin
            if ("admin".equals(rol)) {
                Usuario usuario = usuarioDAO.findById(pedido.getUsuarioId());
                if (usuario != null) {
                    pedido.setUsuarioNombre(usuario.getNombre());
                }
            }

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("pedido", pedido);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al ver pedido", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crea un nuevo pedido a partir del carrito
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String crearPedido(HttpServletRequest request, HttpServletResponse response,
                              Map<String, Object> data, int usuarioId) {
        try {
            // Validar datos
            String direccionEntrega = (String) data.get("direccion_entrega");
            String telefono = (String) data.get("telefono");

            if (direccionEntrega == null || telefono == null) {
                return ResponseUtil.crearRespuestaError("Dirección de entrega y teléfono son obligatorios",
                        HttpServletResponse.SC_BAD_REQUEST);
            }

            // Obtener carrito del usuario
            List<Carrito> itemsCarrito = carritoDAO.findByUsuario(usuarioId);

            if (itemsCarrito.isEmpty()) {
                return ResponseUtil.crearRespuestaError("El carrito está vacío", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Crear pedido
            Pedido pedido = new Pedido(usuarioId, direccionEntrega, telefono);

            // Añadir líneas de pedido
            double total = 0.0;
            for (Carrito item : itemsCarrito) {
                LineaPedido linea = new LineaPedido(
                        0, // ID temporal, se asignará al insertar
                        0, // ID de pedido temporal, se asignará al insertar
                        item.getProductoId(),
                        item.getCantidad(),
                        item.getPrecio()
                );

                // Calcular subtotal
                linea.calcularSubtotal();

                // Agregar línea al pedido
                pedido.agregarLinea(linea);

                // Acumular total
                total += linea.getSubtotal();
            }

            // Establecer total del pedido
            pedido.setTotal(total);

            // Insertar pedido en la base de datos
            int pedidoId = pedidoDAO.insert(pedido);

            if (pedidoId > 0) {
                // Vaciar carrito del usuario
                carritoDAO.vaciarCarrito(usuarioId);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", pedidoId);
                respuesta.put("mensaje", "Pedido creado exitosamente");
                respuesta.put("total", total);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al crear pedido", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al crear pedido", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualiza el estado de un pedido (solo admin)
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @return Resultado de la operación en formato JSON
     */
    public String actualizarEstado(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
        try {
            Integer pedidoId = null;
            String estado = (String) data.get("estado");

            // Obtener pedidoId
            if (data.containsKey("pedido_id")) {
                if (data.get("pedido_id") instanceof Integer) {
                    pedidoId = (Integer) data.get("pedido_id");
                } else if (data.get("pedido_id") instanceof Number) {
                    pedidoId = ((Number) data.get("pedido_id")).intValue();
                } else if (data.get("pedido_id") instanceof String) {
                    pedidoId = Integer.parseInt((String) data.get("pedido_id"));
                }
            }

            // Validar datos
            if (pedidoId == null || estado == null) {
                return ResponseUtil.crearRespuestaError("ID del pedido y estado son obligatorios",
                        HttpServletResponse.SC_BAD_REQUEST);
            }

            // Verificar que el estado sea válido
            if (!estado.equals("pendiente") && !estado.equals("preparando") &&
                    !estado.equals("entregado") && !estado.equals("cancelado")) {
                return ResponseUtil.crearRespuestaError("Estado no válido. Los estados permitidos son: " +
                                "pendiente, preparando, entregado, cancelado",
                        HttpServletResponse.SC_BAD_REQUEST);
            }

            // Verificar que el pedido existe
            Pedido pedido = pedidoDAO.findById(pedidoId);

            if (pedido == null) {
                return ResponseUtil.crearRespuestaError("Pedido no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Actualizar estado
            boolean actualizado = pedidoDAO.updateEstado(pedidoId, estado);

            if (actualizado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Estado del pedido actualizado exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al actualizar estado del pedido",
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en ID del pedido", ex);
            return ResponseUtil.crearRespuestaError("El ID del pedido debe ser un número",
                    HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar estado del pedido", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor",
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}