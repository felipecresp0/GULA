package com.gulaburger.servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.gulaburger.actions.*;
import com.gulaburger.utils.JWTUtil;
import com.gulaburger.utils.ResponseUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet principal que maneja todas las peticiones API
 */
@WebServlet(name = "ApiServlet", urlPatterns = {"/api/*"})
public class ApiServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(ApiServlet.class.getName());

    private static final Gson GSON = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();

    // Actions
    private final UsuarioAction usuarioAction;
    private final HamburguesaAction hamburguesaAction;
    private final CarritoAction carritoAction;
    private final PedidoAction pedidoAction;
    private final RestauranteAction restauranteAction;
    private final ReservaAction reservaAction;
    private final ResenaAction resenaAction;
    private final ProductoAction productoAction;

    /**
     * Constructor
     */
    public ApiServlet() {
        this.usuarioAction = new UsuarioAction();
        this.hamburguesaAction = new HamburguesaAction();
        this.carritoAction = new CarritoAction();
        this.pedidoAction = new PedidoAction();
        this.restauranteAction = new RestauranteAction();
        this.reservaAction = new ReservaAction();
        this.resenaAction = new ResenaAction();
        this.productoAction = new ProductoAction();
    }

    /**
     * Maneja las peticiones GET
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        procesarPeticion(request, response);
    }

    /**
     * Maneja las peticiones POST
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        procesarPeticion(request, response);
    }

    /**
     * Maneja las peticiones PUT
     */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        procesarPeticion(request, response);
    }

    /**
     * Maneja las peticiones DELETE
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        procesarPeticion(request, response);
    }

    /**
     * Procesa todas las peticiones dirigiéndolas a los Actions correspondientes
     */
    private void procesarPeticion(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Configurar response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Habilitar CORS
        configurarCORS(response);

        // Si es una solicitud OPTIONS (preflight CORS), responder OK y terminar
        if ("OPTIONS".equals(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // URL path sin el contexto de la aplicación y "/api"
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            responderError(response, "Ruta no especificada", HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String[] partes = pathInfo.substring(1).split("/");
        String entidad = partes.length > 0 ? partes[0] : "";
        String accion = partes.length > 1 ? partes[1] : "";
        String parametro = partes.length > 2 ? partes[2] : "";

        // Obtener datos JSON del body (para POST/PUT)
        Map<String, Object> data = null;
        if ("POST".equals(request.getMethod()) || "PUT".equals(request.getMethod())) {
            data = obtenerDatosJSON(request);
            if (data == null) {
                responderError(response, "Formato JSON inválido", HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
        }

        // Obtener token de autenticación (si existe)
        String token = obtenerToken(request);
        int usuarioId = token != null ? JWTUtil.extraerUsuarioId(token) : -1;
        String rol = token != null ? JWTUtil.extraerUsuarioRol(token) : null;

        // Verificar autenticación para rutas protegidas
        if (requiereAutenticacion(entidad, accion) && (token == null || !JWTUtil.isTokenValido(token))) {
            responderError(response, "Autenticación requerida", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Verificar rol para rutas admin
        if (requiereRolAdmin(entidad, accion) && !"admin".equals(rol)) {
            responderError(response, "Permisos insuficientes", HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // Ejecutar la acción correspondiente
        String resultado = null;

        try {
            switch (entidad) {
                case "usuarios":
                    resultado = procesarUsuarios(request, response, accion, parametro, data, usuarioId, rol);
                    break;

                case "hamburguesas":
                    resultado = procesarHamburguesas(request, response, accion, parametro, data, usuarioId, rol);
                    break;

                case "productos":
                    resultado = procesarProductos(request, response, accion, parametro, data, usuarioId, rol);
                    break;

                case "carrito":
                    resultado = procesarCarrito(request, response, accion, parametro, data, usuarioId);
                    break;

                case "pedidos":
                    resultado = procesarPedidos(request, response, accion, parametro, data, usuarioId, rol);
                    break;

                case "restaurantes":
                    resultado = procesarRestaurantes(request, response, accion, parametro, data, usuarioId, rol);
                    break;

                case "reservas":
                    resultado = procesarReservas(request, response, accion, parametro, data, usuarioId, rol);
                    break;

                case "resenas":
                    resultado = procesarResenas(request, response, accion, parametro, data, usuarioId);
                    break;

                case "disponibilidad":
                    resultado = procesarDisponibilidad(request, response, accion, parametro, data);
                    break;

                default:
                    responderError(response, "Ruta no encontrada", HttpServletResponse.SC_NOT_FOUND);
                    return;
            }

            if (resultado != null) {
                try (PrintWriter out = response.getWriter()) {
                    out.print(resultado);
                    out.flush();
                }
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error procesando petición", ex);
            responderError(response, "Error interno del servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Procesa las peticiones relacionadas con usuarios
     */
    private String procesarUsuarios(HttpServletRequest request, HttpServletResponse response,
                                    String accion, String parametro, Map<String, Object> data,
                                    int usuarioId, String rol) {
        switch (accion) {
            case "login":
                return usuarioAction.login(request, response, data);

            case "registro":
                return usuarioAction.registro(request, response, data);

            case "perfil":
                return usuarioAction.perfil(request, response, usuarioId);

            case "actualizar":
                return usuarioAction.actualizarPerfil(request, response, data, usuarioId);

            case "":
                // Listar todos (solo admin)
                if ("admin".equals(rol)) {
                    return usuarioAction.listarUsuarios(request, response);
                }
                break;

            default:
                // Si es un ID, intentar eliminar (solo admin)
                if ("admin".equals(rol) && parametro.matches("\\d+")) {
                    int idEliminar = Integer.parseInt(parametro);
                    return usuarioAction.eliminarUsuario(request, response, idEliminar);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con hamburguesas
     */
    private String procesarHamburguesas(HttpServletRequest request, HttpServletResponse response,
                                        String accion, String parametro, Map<String, Object> data,
                                        int usuarioId, String rol) {
        switch (accion) {
            case "":
                // Listar todas
                return hamburguesaAction.listarHamburguesas(request, response);

            case "destacadas":
                // Listar destacadas
                return hamburguesaAction.listarDestacadas(request, response);

            case "nueva":
                // Crear nueva (solo admin)
                if ("admin".equals(rol)) {
                    return hamburguesaAction.crearHamburguesa(request, response, data);
                }
                break;

            default:
                if (parametro.isEmpty() && accion.matches("\\d+")) {
                    // Ver detalles de una hamburguesa
                    int hamburguesaId = Integer.parseInt(accion);
                    return hamburguesaAction.obtenerHamburguesa(request, response, hamburguesaId);
                } else if (accion.matches("\\d+") && "DELETE".equals(request.getMethod()) && "admin".equals(rol)) {
                    // Eliminar hamburguesa (solo admin)
                    int hamburguesaId = Integer.parseInt(accion);
                    return hamburguesaAction.eliminarHamburguesa(request, response, hamburguesaId);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con productos (todos los tipos)
     */
    private String procesarProductos(HttpServletRequest request, HttpServletResponse response,
                                     String accion, String parametro, Map<String, Object> data,
                                     int usuarioId, String rol) {
        switch (accion) {
            case "":
                // Listar todos
                return productoAction.listarProductos(request, response);

            case "destacados":
                // Listar destacados
                return productoAction.listarDestacados(request, response);

            case "nuevo":
                // Crear nuevo (solo admin)
                if ("admin".equals(rol)) {
                    return productoAction.crearProducto(request, response, data);
                }
                break;

            case "categoria":
                // Listar por categoría
                if (!parametro.isEmpty() && parametro.matches("\\d+")) {
                    int categoriaId = Integer.parseInt(parametro);
                    return productoAction.listarPorCategoria(request, response, categoriaId);
                }
                break;

            default:
                if (parametro.isEmpty() && accion.matches("\\d+")) {
                    // Ver detalles de un producto
                    int productoId = Integer.parseInt(accion);
                    return productoAction.obtenerProducto(request, response, productoId);
                } else if (accion.matches("\\d+") && "DELETE".equals(request.getMethod()) && "admin".equals(rol)) {
                    // Eliminar producto (solo admin)
                    int productoId = Integer.parseInt(accion);
                    return productoAction.eliminarProducto(request, response, productoId);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con el carrito
     */
    private String procesarCarrito(HttpServletRequest request, HttpServletResponse response,
                                   String accion, String parametro, Map<String, Object> data,
                                   int usuarioId) {
        switch (accion) {
            case "":
                // Ver carrito
                return carritoAction.verCarrito(request, response, usuarioId);

            case "agregar":
                // Agregar producto al carrito
                return carritoAction.agregarProducto(request, response, data, usuarioId);

            case "eliminar":
                // Eliminar un producto del carrito
                return carritoAction.eliminarProducto(request, response, data, usuarioId);

            case "cantidad":
                // Actualizar cantidad de un producto
                return carritoAction.actualizarCantidad(request, response, data, usuarioId);

            case "contador":
                // Obtener contador de productos en el carrito
                return carritoAction.obtenerContador(request, response, usuarioId);

            case "vaciar":
                // Vaciar carrito
                return carritoAction.vaciarCarrito(request, response, usuarioId);

            default:
                if (parametro.isEmpty() && accion.matches("\\d+")) {
                    // Eliminar un item del carrito por ID
                    int itemId = Integer.parseInt(accion);
                    return carritoAction.eliminarItem(request, response, itemId, usuarioId);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con pedidos
     */
    private String procesarPedidos(HttpServletRequest request, HttpServletResponse response,
                                   String accion, String parametro, Map<String, Object> data,
                                   int usuarioId, String rol) {
        switch (accion) {
            case "":
                if ("admin".equals(rol)) {
                    // Listar todos los pedidos (solo admin)
                    return pedidoAction.listarPedidos(request, response);
                } else {
                    // Listar pedidos del usuario
                    return pedidoAction.listarPedidosUsuario(request, response, usuarioId);
                }

            case "nuevo":
                // Crear nuevo pedido
                return pedidoAction.crearPedido(request, response, data, usuarioId);

            case "estado":
                // Actualizar estado (solo admin)
                if ("admin".equals(rol)) {
                    return pedidoAction.actualizarEstado(request, response, data);
                }
                break;

            default:
                if (parametro.isEmpty() && accion.matches("\\d+")) {
                    // Ver detalle de un pedido
                    int pedidoId = Integer.parseInt(accion);
                    return pedidoAction.verPedido(request, response, pedidoId, usuarioId, rol);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con restaurantes
     */
    private String procesarRestaurantes(HttpServletRequest request, HttpServletResponse response,
                                        String accion, String parametro, Map<String, Object> data,
                                        int usuarioId, String rol) {
        switch (accion) {
            case "":
                // Listar todos o filtrar por código postal
                String cp = request.getParameter("cp");
                if (cp != null && !cp.isEmpty()) {
                    return restauranteAction.buscarPorCodigoPostal(request, response, cp);
                } else {
                    return restauranteAction.listarRestaurantes(request, response);
                }

            case "nuevo":
                // Crear nuevo (solo admin)
                if ("admin".equals(rol)) {
                    return restauranteAction.crearRestaurante(request, response, data);
                }
                break;

            default:
                if (parametro.isEmpty() && accion.matches("\\d+")) {
                    // Ver detalles de un restaurante
                    int restauranteId = Integer.parseInt(accion);
                    return restauranteAction.obtenerRestaurante(request, response, restauranteId);
                } else if (accion.matches("\\d+") && "admin".equals(rol) && "PUT".equals(request.getMethod())) {
                    // Actualizar restaurante (solo admin)
                    int restauranteId = Integer.parseInt(accion);
                    return restauranteAction.actualizarRestaurante(request, response, restauranteId, data);
                } else if (accion.matches("\\d+") && "admin".equals(rol) && "DELETE".equals(request.getMethod())) {
                    // Eliminar restaurante (solo admin)
                    int restauranteId = Integer.parseInt(accion);
                    return restauranteAction.eliminarRestaurante(request, response, restauranteId);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con reservas
     */
    private String procesarReservas(HttpServletRequest request, HttpServletResponse response,
                                    String accion, String parametro, Map<String, Object> data,
                                    int usuarioId, String rol) {
        switch (accion) {
            case "":
                // Listar las reservas del usuario
                return reservaAction.listarReservasUsuario(request, response, usuarioId);

            case "nueva":
                // Crear nueva reserva
                return reservaAction.crearReserva(request, response, data, usuarioId);

            case "admin":
                // Listar todas las reservas (solo admin)
                if ("admin".equals(rol)) {
                    return reservaAction.listarReservas(request, response);
                }
                break;

            case "restaurante":
                // Listar reservas de un restaurante (solo admin)
                if ("admin".equals(rol) && !parametro.isEmpty() && parametro.matches("\\d+")) {
                    int restauranteId = Integer.parseInt(parametro);
                    return reservaAction.listarReservasRestaurante(request, response, restauranteId);
                }
                break;

            default:
                if (parametro.isEmpty() && accion.matches("\\d+")) {
                    // Ver detalle de una reserva
                    int reservaId = Integer.parseInt(accion);
                    return reservaAction.obtenerReserva(request, response, reservaId, usuarioId, rol);
                } else if (accion.matches("\\d+") && "DELETE".equals(request.getMethod())) {
                    // Cancelar reserva
                    int reservaId = Integer.parseInt(accion);
                    return reservaAction.cancelarReserva(request, response, reservaId, usuarioId, rol);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con reseñas
     */
    private String procesarResenas(HttpServletRequest request, HttpServletResponse response,
                                   String accion, String parametro, Map<String, Object> data,
                                   int usuarioId) {
        switch (accion) {
            case "":
                // Crear nueva reseña
                if ("POST".equals(request.getMethod())) {
                    return resenaAction.crearResena(request, response, data, usuarioId);
                }
                // Listar reseñas del usuario
                return resenaAction.listarResenasPorUsuario(request, response, usuarioId);

            case "restaurante":
                // Listar reseñas de un restaurante
                if (!parametro.isEmpty() && parametro.matches("\\d+")) {
                    int restauranteId = Integer.parseInt(parametro);
                    return resenaAction.listarResenasPorRestaurante(request, response, restauranteId);
                }
                break;

            default:
                if (accion.matches("\\d+") && "DELETE".equals(request.getMethod())) {
                    // Eliminar reseña
                    int resenaId = Integer.parseInt(accion);
                    return resenaAction.eliminarResena(request, response, resenaId, usuarioId);
                }
                break;
        }

        return ResponseUtil.crearRespuestaError("Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Procesa las peticiones relacionadas con disponibilidad
     */
    private String procesarDisponibilidad(HttpServletRequest request, HttpServletResponse response,
                                          String accion, String parametro, Map<String, Object> data) {
        // Consultar disponibilidad para un restaurante y fecha
        String restauranteId = request.getParameter("restaurante_id");
        String fecha = request.getParameter("fecha");

        if (restauranteId != null && fecha != null) {
            return reservaAction.obtenerDisponibilidad(request, response, restauranteId, fecha);
        }

        return ResponseUtil.crearRespuestaError("Parámetros incompletos", HttpServletResponse.SC_BAD_REQUEST);
    }

    /**
     * Configura los headers CORS para permitir peticiones desde cualquier origen
     */
    private void configurarCORS(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    /**
     * Responde con un error en formato JSON
     */
    private void responderError(HttpServletResponse response, String mensaje, int codigo) {
        try {
            response.setStatus(codigo);
            try (PrintWriter out = response.getWriter()) {
                out.print(ResponseUtil.crearRespuestaError(mensaje, codigo));
            }
        } catch (IOException ex) {
            LOGGER.log(Level.SEVERE, "Error al enviar respuesta de error", ex);
        }
    }

    /**
     * Obtiene los datos JSON del body de la petición
     */
    private Map<String, Object> obtenerDatosJSON(HttpServletRequest request) {
        StringBuilder sb = new StringBuilder();
        String linea;

        try (BufferedReader reader = request.getReader()) {
            while ((linea = reader.readLine()) != null) {
                sb.append(linea);
            }

            if (sb.length() > 0) {
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> data = GSON.fromJson(sb.toString(), Map.class);
                    return data;
                } catch (JsonSyntaxException ex) {
                    LOGGER.log(Level.WARNING, "Error al parsear JSON: {0}", ex.getMessage());
                }
            } else {
                // Si no hay body, devolver un mapa vacío en lugar de null
                return new HashMap<>();
            }
        } catch (IOException ex) {
            LOGGER.log(Level.SEVERE, "Error al leer datos JSON", ex);
        }

        return null;
    }

    /**
     * Obtiene el token de autenticación del header Authorization
     */
    private String obtenerToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // Eliminar "Bearer "
        }

        return null;
    }

    /**
     * Determina si una ruta requiere autenticación
     */
    private boolean requiereAutenticacion(String entidad, String accion) {
        // Rutas públicas
        if (entidad.equals("usuarios") && (accion.equals("login") || accion.equals("registro"))) {
            return false;
        }

        if (entidad.equals("hamburguesas") && (accion.isEmpty() || accion.equals("destacadas") || accion.matches("\\d+"))) {
            return false;
        }

        if (entidad.equals("productos") && (accion.isEmpty() || accion.equals("destacados") || accion.equals("categoria") || accion.matches("\\d+"))) {
            return false;
        }

        if (entidad.equals("restaurantes") && (accion.isEmpty() || accion.matches("\\d+"))) {
            return false;
        }

        if (entidad.equals("resenas") && accion.equals("restaurante")) {
            return false;
        }

        if (entidad.equals("disponibilidad")) {
            return false;
        }

        // Resto de rutas requieren autenticación
        return true;
    }

    /**
     * Determina si una ruta requiere rol de administrador
     */
    private boolean requiereRolAdmin(String entidad, String accion) {
        // Rutas para admin
        if (entidad.equals("usuarios") && (accion.isEmpty() || (!accion.isEmpty() && !accion.equals("perfil") && !accion.equals("actualizar")))) {
            return true;
        }

        if (entidad.equals("hamburguesas") && (accion.equals("nueva") || (accion.matches("\\d+") && accion.length() > 0))) {
            return true;
        }

        if (entidad.equals("productos") && (accion.equals("nuevo") || (accion.matches("\\d+") && "DELETE".equals("request.getMethod()")))) {
            return true;
        }

        if (entidad.equals("pedidos") && (accion.isEmpty() || accion.equals("estado"))) {
            return true;
        }

        if (entidad.equals("restaurantes") && (accion.equals("nuevo") || (accion.matches("\\d+") && ("PUT".equals("request.getMethod()") || "DELETE".equals("request.getMethod()"))))) {
            return true;
        }

        if (entidad.equals("reservas") && (accion.equals("admin") || accion.equals("restaurante"))) {
            return true;
        }

        // Resto de rutas no requieren rol admin
        return false;
    }
}