package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.modelos.Resena;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Resena (Reseña/Valoración)
 */
public class ResenaDAO {

    private static final Logger LOGGER = Logger.getLogger(ResenaDAO.class.getName());
    private final ConexionDB conexion;

    /**
     * Constructor
     */
    public ResenaDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Obtiene todas las reseñas de un restaurante
     *
     * @param restauranteId ID del restaurante
     * @return Lista de reseñas del restaurante
     */
    public List<Resena> findByRestaurante(int restauranteId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Resena> resenas = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESENA_FIND_BY_RESTAURANTE);
            stmt.setInt(1, restauranteId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Resena resena = new Resena(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getInt("restaurante_id"),
                        rs.getInt("puntuacion"),
                        rs.getString("comentario"),
                        rs.getTimestamp("fecha_creacion"),
                        rs.getString("usuario_nombre"),
                        null // No tenemos el nombre del restaurante porque ya lo sabemos
                );

                resenas.add(resena);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener reseñas del restaurante", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return resenas;
    }

    /**
     * Obtiene todas las reseñas de un usuario
     *
     * @param usuarioId ID del usuario
     * @return Lista de reseñas del usuario
     */
    public List<Resena> findByUsuario(int usuarioId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Resena> resenas = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESENA_FIND_BY_USUARIO);
            stmt.setInt(1, usuarioId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Resena resena = new Resena(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getInt("restaurante_id"),
                        rs.getInt("puntuacion"),
                        rs.getString("comentario"),
                        rs.getTimestamp("fecha_creacion"),
                        null, // No tenemos el nombre del usuario porque ya lo sabemos
                        rs.getString("restaurante_nombre")
                );

                resenas.add(resena);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener reseñas del usuario", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return resenas;
    }

    /**
     * Inserta una nueva reseña
     *
     * @param resena Reseña a insertar
     * @return ID de la reseña insertada o -1 si hay error
     */
    public int insert(Resena resena) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESENA_INSERT);

            stmt.setInt(1, resena.getUsuarioId());
            stmt.setInt(2, resena.getRestauranteId());
            stmt.setInt(3, resena.getPuntuacion());
            stmt.setString(4, resena.getComentario());

            rs = stmt.executeQuery();

            if (rs.next()) {
                id = rs.getInt(1);
                resena.setId(id);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar reseña", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return id;
    }

    /**
     * Elimina una reseña por su ID
     *
     * @param id ID de la reseña a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESENA_DELETE);
            stmt.setInt(1, id);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar reseña", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Obtiene la valoración media de un restaurante
     *
     * @param restauranteId ID del restaurante
     * @return Valoración media o 0 si no hay reseñas
     */
    public double getValoracionMedia(int restauranteId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        double valoracion = 0.0;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESENA_AVG_PUNTUACION);
            stmt.setInt(1, restauranteId);
            rs = stmt.executeQuery();

            if (rs.next()) {
                valoracion = rs.getDouble(1);
                if (rs.wasNull()) {
                    valoracion = 0.0;
                }
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener valoración media", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return valoracion;
    }

    /**
     * Cuenta el número de reseñas de un restaurante
     *
     * @param restauranteId ID del restaurante
     * @return Número de reseñas
     */
    public int countByRestaurante(int restauranteId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int count = 0;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESENA_COUNT_BY_RESTAURANTE);
            stmt.setInt(1, restauranteId);
            rs = stmt.executeQuery();

            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al contar reseñas", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return count;
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