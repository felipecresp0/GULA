package com.gulaburger.servlets;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.gulaburger.dao.UsuarioDAO;
import com.gulaburger.models.Usuario;
import com.gulaburger.utils.JWTUtil;
import com.gulaburger.utils.PasswordUtil;
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
 * Servlet específico para autenticación
 * (Complementario al ApiServlet)
 */
@WebServlet(name = "AuthServlet", urlPatterns = {"/auth/*"})
public class AuthServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(AuthServlet.class.getName());

    private static final Gson GSON = new Gson();

    private final UsuarioDAO usuarioDAO;

    /**
     * Constructor
     */
    public AuthServlet() {
        this.usuarioDAO = new UsuarioDAO();
    }

    /**
     * Maneja las peticiones POST
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Configurar response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Habilitar CORS
        configurarCORS(response);

        // URL path sin el contexto de la aplicación y "/auth"
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            responderError(response, "Ruta no especificada", HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String accion = pathInfo.substring(1);

        // Obtener datos JSON del body
        Map<String, Object> data = obtenerDatosJSON(request);
        if (data == null) {
            responderError(response, "Formato JSON inválido", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Ejecutar la acción correspondiente
        String resultado = null;

        try {
            switch (accion) {
                case "login":
                    resultado = procesarLogin(request, response, data);
                    break;

                case "registro":
                    resultado = procesarRegistro(request, response, data);
                    break;

                case "verificar":
                    resultado = verificarToken(request, response);
                    break;

                default:
                    responderError(response, "Acción no válida", HttpServletResponse.SC_BAD_REQUEST);
                    return;
            }

            if (resultado != null) {
                try (PrintWriter out = response.getWriter()) {
                    out.print(resultado);
                    out.flush();
                }
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error procesando petición de autenticación", ex);
            responderError(response, "Error interno del servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Procesa una petición de login
     */
    private String procesarLogin(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
        try {
            String email = (String) data.get("email");
            String contrasena = (String) data.get("contrasena");

            if (email == null || contrasena == null) {
                return ResponseUtil.crearRespuestaError("Email y contraseña son requeridos", HttpServletResponse.SC_BAD_REQUEST);
            }

            Usuario usuario = usuarioDAO.verificarCredenciales(email, contrasena);

            if (usuario != null) {
                // Generar token JWT
                String token = JWTUtil.generarToken(usuario);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("token", token);
                respuesta.put("usuario", usuario.getUsuarioSeguro());
                respuesta.put("mensaje", "Login exitoso");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Credenciales inválidas", HttpServletResponse.SC_UNAUTHORIZED);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error en login", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Procesa una petición de registro
     */
    private String procesarRegistro(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
        try {
            String nombre = (String) data.get("nombre");
            String email = (String) data.get("email");
            String contrasena = (String) data.get("contrasena");

            if (nombre == null || email == null || contrasena == null) {
                return ResponseUtil.crearRespuestaError("Todos los campos son requeridos", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Validaciones básicas
            if (contrasena.length() < 6) {
                return ResponseUtil.crearRespuestaError("La contraseña debe tener al menos 6 caracteres", HttpServletResponse.SC_BAD_REQUEST);
            }

            // Verificar si el email ya existe
            Usuario existente = usuarioDAO.findByEmail(email);
            if (existente != null) {
                return ResponseUtil.crearRespuestaError("El email ya está registrado", HttpServletResponse.SC_CONFLICT);
            }

            // Crear usuario (por defecto rol = cliente)
            Usuario nuevoUsuario = new Usuario(nombre, email, contrasena, "cliente");
            int id = usuarioDAO.insert(nuevoUsuario);

            if (id > 0) {
                // Generar token para iniciar sesión automáticamente
                String token = JWTUtil.generarToken(nuevoUsuario);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", id);
                respuesta.put("token", token);
                respuesta.put("usuario", nuevoUsuario.getUsuarioSeguro());
                respuesta.put("mensaje", "Usuario registrado exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al registrar usuario", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error en registro", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Verifica un token JWT
     */
    private String verificarToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            String token = obtenerToken(request);

            if (token == null) {
                return ResponseUtil.crearRespuestaError("Token no proporcionado", HttpServletResponse.SC_UNAUTHORIZED);
            }

            if (JWTUtil.isTokenValido(token)) {
                int usuarioId = JWTUtil.extraerUsuarioId(token);
                String email = JWTUtil.extraerUsuarioEmail(token);
                String rol = JWTUtil.extraerUsuarioRol(token);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("valido", true);
                respuesta.put("usuario_id", usuarioId);
                respuesta.put("email", email);
                respuesta.put("rol", rol);

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Token inválido o expirado", HttpServletResponse.SC_UNAUTHORIZED);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al verificar token", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
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
}