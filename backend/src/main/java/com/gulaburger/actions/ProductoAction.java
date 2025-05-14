package com.gulaburger.actions;

import com.gulaburger.dao.ProductoDAO;
import com.gulaburger.dao.CategoriaDAO;
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
 * Action para operaciones relacionadas con productos genéricos
 */
public class ProductoAction {

    private static final Logger LOGGER = Logger.getLogger(ProductoAction.class.getName());
    private final ProductoDAO productoDAO;

    /**
     * Constructor
     */
    public ProductoAction() {
        this.productoDAO = new ProductoDAO();
    }

    /**
     * Lista todos los productos
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarProductos(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Producto> productos = productoDAO.findAll();

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("productos", productos);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar productos", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene un producto por su ID
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param productoId ID del producto
     * @return Resultado de la operación en formato JSON
     */
    public String obtenerProducto(HttpServletRequest request, HttpServletResponse response, int productoId) {
        try {
            Producto producto = productoDAO.findById(productoId);

            if (producto != null) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("producto", producto);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Producto no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener producto", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crea un nuevo producto
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @return Resultado de la operación en formato JSON
     */
    public String crearProducto(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
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
            Integer categoriaId = null;

            if (data.get("categoria_id") != null) {
                if (data.get("categoria_id") instanceof Integer) {
                    categoriaId = (Integer) data.get("categoria_id");
                } else if (data.get("categoria_id") instanceof Number) {
                    categoriaId = ((Number) data.get("categoria_id")).intValue();
                } else if (data.get("categoria_id") instanceof String) {
                    categoriaId = Integer.parseInt((String) data.get("categoria_id"));
                }
            }

            // Validar campos obligatorios
            if (nombre == null || descripcion == null || precio == null || categoriaId == null) {
                return ResponseUtil.crearRespuestaError("Nombre, descripción, precio y categoría son obligatorios", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Si no hay imagen, usar una por defecto
            if (imagen == null || imagen.isEmpty()) {
                imagen = "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/default-product.png";
            }

            // Si no se especifica destacado, por defecto es false
            if (destacado == null) {
                destacado = false;
            }

            Producto producto = new Producto(nombre, descripcion, precio, imagen, destacado, categoriaId);

            int id = productoDAO.insert(producto);

            if (id > 0) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", id);
                respuesta.put("mensaje", "Producto creado exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al crear producto", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en el precio o categoría", ex);
            return ResponseUtil.crearRespuestaError("El precio debe ser un número válido", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al crear producto", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualiza un producto existente
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param productoId ID del producto a actualizar
     * @return Resultado de la operación en formato JSON
     */
    public String actualizarProducto(HttpServletRequest request, HttpServletResponse response,
                                     Map<String, Object> data, int productoId) {
        try {
            // Verificar que el producto existe
            Producto producto = productoDAO.findById(productoId);

            if (producto == null) {
                return ResponseUtil.crearRespuestaError("Producto no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // Actualizar solo los campos que vienen en la solicitud
            if (data.containsKey("nombre")) {
                producto.setNombre((String) data.get("nombre"));
            }

            if (data.containsKey("descripcion")) {
                producto.setDescripcion((String) data.get("descripcion"));
            }

            if (data.containsKey("precio")) {
                if (data.get("precio") instanceof Double) {
                    producto.setPrecio((Double) data.get("precio"));
                } else if (data.get("precio") instanceof Number) {
                    producto.setPrecio(((Number) data.get("precio")).doubleValue());
                } else if (data.get("precio") instanceof String) {
                    producto.setPrecio(Double.parseDouble((String) data.get("precio")));
                }
            }

            if (data.containsKey("imagen")) {
                producto.setImagen((String) data.get("imagen"));
            }

            if (data.containsKey("destacado")) {
                producto.setDestacado((Boolean) data.get("destacado"));
            }

            if (data.containsKey("categoria_id")) {
                Integer categoriaId = null;
                if (data.get("categoria_id") instanceof Integer) {
                    categoriaId = (Integer) data.get("categoria_id");
                } else if (data.get("categoria_id") instanceof Number) {
                    categoriaId = ((Number) data.get("categoria_id")).intValue();
                } else if (data.get("categoria_id") instanceof String) {
                    categoriaId = Integer.parseInt((String) data.get("categoria_id"));
                }

                if (categoriaId != null) {
                    producto.setCategoriaId(categoriaId);
                }
            }

            boolean actualizado = productoDAO.update(producto);

            if (actualizado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Producto actualizado exitosamente");
                respuesta.put("producto", producto);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al actualizar producto", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (NumberFormatException ex) {
            LOGGER.log(Level.WARNING, "Error de formato en el precio o categoría", ex);
            return ResponseUtil.crearRespuestaError("El precio debe ser un número válido", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar producto", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Elimina un producto
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param productoId ID del producto a eliminar
     * @return Resultado de la operación en formato JSON
     */
    public String eliminarProducto(HttpServletRequest request, HttpServletResponse response, int productoId) {
        try {
            // Verificar que el producto existe
            Producto producto = productoDAO.findById(productoId);

            if (producto == null) {
                return ResponseUtil.crearRespuestaError("Producto no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            boolean eliminado = productoDAO.delete(productoId);

            if (eliminado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Producto eliminado exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al eliminar producto", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar producto", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lista los productos destacados
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarDestacados(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Producto> productos = productoDAO.findDestacados();

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("productos", productos);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar productos destacados", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lista los productos por categoría
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param categoriaId ID de la categoría
     * @return Resultado de la operación en formato JSON
     */
    public String listarPorCategoria(HttpServletRequest request, HttpServletResponse response, int categoriaId) {
        try {
            List<Producto> productos = productoDAO.findByCategoria(categoriaId);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("productos", productos);
            respuesta.put("categoria_id", categoriaId);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar productos por categoría", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}