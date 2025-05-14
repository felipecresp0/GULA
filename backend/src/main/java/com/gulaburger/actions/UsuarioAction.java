package com.gulaburger.actions;

import com.gulaburger.dao.UsuarioDAO;
import com.gulaburger.models.Usuario;
import com.gulaburger.utils.JWTUtil;
import com.gulaburger.utils.ResponseUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Action para operaciones relacionadas con usuarios
 */
public class UsuarioAction {

    private static final Logger LOGGER = Logger.getLogger(UsuarioAction.class.getName());
    private final UsuarioDAO usuarioDAO;

    /**
     * Constructor
     */
    public UsuarioAction() {
        this.usuarioDAO = new UsuarioDAO();
    }

    /**
     * Procesa un inicio de sesión
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @return Resultado de la operación en formato JSON
     */
    public String login(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
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
     * Procesa un registro de usuario
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @return Resultado de la operación en formato JSON
     */
    public String registro(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data) {
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
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("id", id);
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
     * Obtiene el perfil del usuario autenticado
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String perfil(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            Usuario usuario = usuarioDAO.findById(usuarioId);

            if (usuario != null) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("usuario", usuario.getUsuarioSeguro());

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Usuario no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener perfil", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualiza los datos del usuario autenticado
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param data Datos de la solicitud
     * @param usuarioId ID del usuario autenticado
     * @return Resultado de la operación en formato JSON
     */
    public String actualizarPerfil(HttpServletRequest request, HttpServletResponse response, Map<String, Object> data, int usuarioId) {
        try {
            Usuario usuario = usuarioDAO.findById(usuarioId);

            if (usuario == null) {
                return ResponseUtil.crearRespuestaError("Usuario no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            String nombre = (String) data.get("nombre");
            String email = (String) data.get("email");
            String contrasena = (String) data.get("contrasena");

            if (nombre != null) {
                usuario.setNombre(nombre);
            }

            if (email != null) {
                // Verificar si el nuevo email ya existe para otro usuario
                Usuario existente = usuarioDAO.findByEmail(email);
                if (existente != null && existente.getId() != usuarioId) {
                    return ResponseUtil.crearRespuestaError("El email ya está registrado", HttpServletResponse.SC_CONFLICT);
                }

                usuario.setEmail(email);
            }

            boolean actualizarContrasena = contrasena != null && !contrasena.isEmpty();

            if (actualizarContrasena) {
                if (contrasena.length() < 6) {
                    return ResponseUtil.crearRespuestaError("La contraseña debe tener al menos 6 caracteres", HttpServletResponse.SC_BAD_REQUEST);
                }

                usuario.setContrasena(contrasena);
            }

            boolean actualizado = usuarioDAO.update(usuario, actualizarContrasena);

            if (actualizado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Perfil actualizado exitosamente");
                respuesta.put("usuario", usuario.getUsuarioSeguro());

                // Si se actualizó el email o la contraseña, generar nuevo token
                if (actualizarContrasena || email != null) {
                    String token = JWTUtil.generarToken(usuario);
                    respuesta.put("token", token);
                }

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al actualizar perfil", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar perfil", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene todos los usuarios (solo para administradores)
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @return Resultado de la operación en formato JSON
     */
    public String listarUsuarios(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Usuario> usuarios = usuarioDAO.findAll();

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("usuarios", usuarios);

            return ResponseUtil.crearRespuestaOK(respuesta);

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al listar usuarios", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Elimina un usuario (solo para administradores)
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param usuarioId ID del usuario a eliminar
     * @return Resultado de la operación en formato JSON
     */
    public String eliminarUsuario(HttpServletRequest request, HttpServletResponse response, int usuarioId) {
        try {
            Usuario usuario = usuarioDAO.findById(usuarioId);

            if (usuario == null) {
                return ResponseUtil.crearRespuestaError("Usuario no encontrado", HttpServletResponse.SC_NOT_FOUND);
            }

            // No permitir eliminar al administrador principal
            if ("admin".equals(usuario.getEmail())) {
                return ResponseUtil.crearRespuestaError("No se puede eliminar al administrador principal", HttpServletResponse.SC_FORBIDDEN);
            }

            boolean eliminado = usuarioDAO.delete(usuarioId);

            if (eliminado) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Usuario eliminado exitosamente");

                return ResponseUtil.crearRespuestaOK(respuesta);
            } else {
                return ResponseUtil.crearRespuestaError("Error al eliminar usuario", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar usuario", ex);
            return ResponseUtil.crearRespuestaError("Error en el servidor", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}