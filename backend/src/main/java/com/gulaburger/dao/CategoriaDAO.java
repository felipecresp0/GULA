package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.models.Categoria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Categoria
 */
public class CategoriaDAO {

    private static final Logger LOGGER = Logger.getLogger(CategoriaDAO.class.getName());
    private final ConexionDB conexion;

    // Consultas SQL para Categoria
    private static final String SQL_FIND_ALL =
            "SELECT id, nombre, descripcion FROM categoria ORDER BY nombre";

    private static final String SQL_FIND_BY_ID =
            "SELECT id, nombre, descripcion FROM categoria WHERE id = ?";

    private static final String SQL_INSERT =
            "INSERT INTO categoria (nombre, descripcion) VALUES (?, ?) RETURNING id";

    private static final String SQL_UPDATE =
            "UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?";

    private static final String SQL_DELETE =
            "DELETE FROM categoria WHERE id = ?";

    /**
     * Constructor
     */
    public CategoriaDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Obtiene todas las categorías
     *
     * @return Lista de categorías
     */
    public List<Categoria> findAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Categoria> categorias = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQL_FIND_ALL);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Categoria categoria = new Categoria(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion")
                );

                categorias.add(categoria);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener todas las categorías", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return categorias;
    }

    /**
     * Obtiene una categoría por su ID
     *
     * @param id ID de la categoría
     * @return La categoría encontrada o null si no existe
     */
    public Categoria findById(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Categoria categoria = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQL_FIND_BY_ID);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                categoria = new Categoria(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion")
                );
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener categoría por ID", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return categoria;
    }

    /**
     * Inserta una nueva categoría
     *
     * @param categoria Categoría a insertar
     * @return ID de la categoría insertada o -1 si hay error
     */
    public int insert(Categoria categoria) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQL_INSERT);

            stmt.setString(1, categoria.getNombre());
            stmt.setString(2, categoria.getDescripcion());

            rs = stmt.executeQuery();

            if (rs.next()) {
                id = rs.getInt(1);
                categoria.setId(id);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar categoría", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return id;
    }

    /**
     * Actualiza una categoría existente
     *
     * @param categoria Categoría con los datos actualizados
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean update(Categoria categoria) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQL_UPDATE);

            stmt.setString(1, categoria.getNombre());
            stmt.setString(2, categoria.getDescripcion());
            stmt.setInt(3, categoria.getId());

            int filasActualizadas = stmt.executeUpdate();
            resultado = filasActualizadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar categoría", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Elimina una categoría por su ID
     *
     * @param id ID de la categoría a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQL_DELETE);
            stmt.setInt(1, id);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar categoría", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
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