package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.models.Usuario;
import com.gulaburger.utils.PasswordUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Usuario
 */
public class UsuarioDAO {

    private static final Logger LOGGER = Logger.getLogger(UsuarioDAO.class.getName());
    private final ConexionDB conexion;

    /**
     * Constructor
     */
    public UsuarioDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Busca un usuario por su email
     *
     * @param email Email del usuario
     * @return El usuario encontrado o null si no existe
     */
    public Usuario findByEmail(String email) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Usuario usuario = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.USUARIO_FIND_BY_EMAIL);
            stmt.setString(1, email);
            rs = stmt.executeQuery();

            if (rs.next()) {
                usuario = new Usuario(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("email"),
                        rs.getString("contrasena"),
                        rs.getString("rol"),
                        rs.getTimestamp("fecha_registro")
                );
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al buscar usuario por email", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return usuario;
    }

    /**
     * Inserta un nuevo usuario en la base de datos
     *
     * @param usuario Usuario a insertar (con contraseña sin encriptar)
     * @return El ID del usuario insertado o -1 si hay error
     */
    public int insert(Usuario usuario) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.USUARIO_INSERT);

            // Encriptar la contraseña antes de guardarla
            String contrasenaEncriptada = PasswordUtil.hashPassword(usuario.getContrasena());

            stmt.setString(1, usuario.getNombre());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, contrasenaEncriptada);
            stmt.setString(4, usuario.getRol() != null ? usuario.getRol() : "cliente");

            rs = stmt.executeQuery();

            if (rs.next()) {
                id = rs.getInt(1);
                usuario.setId(id);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar usuario", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return id;
    }

    /**
     * Actualiza los datos de un usuario
     *
     * @param usuario Usuario con los datos actualizados
     * @param actualizarContrasena Indica si hay que actualizar la contraseña también
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean update(Usuario usuario, boolean actualizarContrasena) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            // Primero obtener el usuario actual para poder usar datos antiguos si es necesario
            Usuario usuarioActual = findById(usuario.getId());
            if (usuarioActual == null) {
                return false;
            }

            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.USUARIO_UPDATE);

            stmt.setString(1, usuario.getNombre());
            stmt.setString(2, usuario.getEmail());

            // Si hay que actualizar la contraseña, encriptarla
            if (actualizarContrasena) {
                String contrasenaEncriptada = PasswordUtil.hashPassword(usuario.getContrasena());
                stmt.setString(3, contrasenaEncriptada);
            } else {
                // Usar la contraseña antigua
                stmt.setString(3, usuarioActual.getContrasena());
            }

            stmt.setString(4, usuario.getRol());
            stmt.setInt(5, usuario.getId());

            int filasActualizadas = stmt.executeUpdate();
            resultado = filasActualizadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar usuario", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Elimina un usuario por su ID
     *
     * @param id ID del usuario a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.USUARIO_DELETE);
            stmt.setInt(1, id);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar usuario", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Busca un usuario por su ID
     *
     * @param id ID del usuario
     * @return El usuario encontrado o null si no existe
     */
    public Usuario findById(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Usuario usuario = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.USUARIO_FIND_BY_ID);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNombre(rs.getString("nombre"));
                usuario.setEmail(rs.getString("email"));
                usuario.setRol(rs.getString("rol"));
                usuario.setFechaRegistro(rs.getTimestamp("fecha_registro"));
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al buscar usuario por ID", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return usuario;
    }

    /**
     * Obtiene todos los usuarios
     *
     * @return Lista de todos los usuarios
     */
    public List<Usuario> findAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Usuario> usuarios = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.USUARIO_FIND_ALL);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Usuario usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNombre(rs.getString("nombre"));
                usuario.setEmail(rs.getString("email"));
                usuario.setRol(rs.getString("rol"));
                usuario.setFechaRegistro(rs.getTimestamp("fecha_registro"));

                usuarios.add(usuario);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener todos los usuarios", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return usuarios;
    }

    /**
     * Verifica las credenciales de un usuario
     *
     * @param email Email del usuario
     * @param contrasena Contraseña sin encriptar
     * @return El usuario autenticado o null si las credenciales son incorrectas
     */
    public Usuario verificarCredenciales(String email, String contrasena) {
        Usuario usuario = findByEmail(email);

        if (usuario != null) {
            // Verificar la contraseña
            boolean passwordValido = PasswordUtil.verifyPassword(contrasena, usuario.getContrasena());

            if (passwordValido) {
                return usuario;
            }
        }

        return null;
    }

    /**
     * Cierra los recursos de base de datos
     *
     * @param conn Conexión
     * @param stmt PreparedStatement
     * @param rs ResultSet
     */
    private void cerrarRecursos(Connection conn, PreparedStatement stmt, ResultSet rs) {
        try {
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }
            if (conn != null) {
                conexion.closeConnection(conn);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al cerrar recursos", ex);
        }
    }
}