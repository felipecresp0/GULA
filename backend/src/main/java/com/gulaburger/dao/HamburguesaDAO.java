package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.models.Hamburguesa;
import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Hamburguesa
 */
public class HamburguesaDAO {

    private static final Logger LOGGER = Logger.getLogger(HamburguesaDAO.class.getName());
    private final ConexionDB conexion;

    /**
     * Constructor
     */
    public HamburguesaDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Obtiene todas las hamburguesas
     *
     * @return Lista de hamburguesas
     */
    public List<Hamburguesa> findAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Hamburguesa> hamburguesas = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.HAMBURGUESA_FIND_ALL);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Hamburguesa hamburguesa = new Hamburguesa(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen"),
                        rs.getBoolean("destacado"),
                        rs.getInt("categoria_id"),
                        "Hamburguesas" // Categoría fija para hamburguesas
                );

                // Obtener ingredientes
                Array ingredientesArray = rs.getArray("ingredientes");
                if (ingredientesArray != null) {
                    String[] ingredientes = (String[]) ingredientesArray.getArray();
                    hamburguesa.setIngredientesFromArray(ingredientes);
                }

                hamburguesas.add(hamburguesa);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener todas las hamburguesas", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return hamburguesas;
    }

    /**
     * Obtiene una hamburguesa por su ID
     *
     * @param id ID de la hamburguesa
     * @return La hamburguesa encontrada o null si no existe
     */
    public Hamburguesa findById(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Hamburguesa hamburguesa = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.HAMBURGUESA_FIND_BY_ID);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                hamburguesa = new Hamburguesa(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen"),
                        rs.getBoolean("destacado"),
                        rs.getInt("categoria_id"),
                        "Hamburguesas" // Categoría fija para hamburguesas
                );

                // Obtener ingredientes
                Array ingredientesArray = rs.getArray("ingredientes");
                if (ingredientesArray != null) {
                    String[] ingredientes = (String[]) ingredientesArray.getArray();
                    hamburguesa.setIngredientesFromArray(ingredientes);
                }
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener hamburguesa por ID", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return hamburguesa;
    }

    /**
     * Inserta una nueva hamburguesa
     *
     * @param hamburguesa Hamburguesa a insertar
     * @return ID de la hamburguesa insertada o -1 si hay error
     */
    public int insert(Hamburguesa hamburguesa) {
        Connection conn = null;
        PreparedStatement stmtProducto = null;
        PreparedStatement stmtHamburguesa = null;
        ResultSet rsProducto = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            conn.setAutoCommit(false);

            // Primero insertar en la tabla producto
            stmtProducto = conn.prepareStatement(SQLQueries.PRODUCTO_INSERT);
            stmtProducto.setString(1, hamburguesa.getNombre());
            stmtProducto.setString(2, hamburguesa.getDescripcion());
            stmtProducto.setDouble(3, hamburguesa.getPrecio());
            stmtProducto.setString(4, hamburguesa.getImagen());
            stmtProducto.setBoolean(5, hamburguesa.isDestacado());
            stmtProducto.setInt(6, hamburguesa.getCategoriaId());

            rsProducto = stmtProducto.executeQuery();

            if (rsProducto.next()) {
                id = rsProducto.getInt(1);
                hamburguesa.setId(id);

                // Luego insertar en la tabla hamburguesa
                stmtHamburguesa = conn.prepareStatement(SQLQueries.HAMBURGUESA_INSERT);
                stmtHamburguesa.setInt(1, id);

                // Convertir lista de ingredientes a array SQL
                List<String> ingredientes = hamburguesa.getIngredientes();
                if (ingredientes != null && !ingredientes.isEmpty()) {
                    String[] ingredientesArray = ingredientes.toArray(new String[0]);
                    Array sqlArray = conn.createArrayOf("text", ingredientesArray);
                    stmtHamburguesa.setArray(2, sqlArray);
                } else {
                    stmtHamburguesa.setNull(2, java.sql.Types.ARRAY);
                }

                stmtHamburguesa.executeUpdate();

                conn.commit();
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar hamburguesa", ex);
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    LOGGER.log(Level.SEVERE, "Error al hacer rollback", rollbackEx);
                }
            }
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                } catch (SQLException autocommitEx) {
                    LOGGER.log(Level.SEVERE, "Error al restablecer autocommit", autocommitEx);
                }
            }
            cerrarRecursos(null, stmtHamburguesa, null);
            cerrarRecursos(conn, stmtProducto, rsProducto);
        }

        return id;
    }

    /**
     * Actualiza una hamburguesa existente
     *
     * @param hamburguesa Hamburguesa con los datos actualizados
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean update(Hamburguesa hamburguesa) {
        Connection conn = null;
        PreparedStatement stmtProducto = null;
        PreparedStatement stmtHamburguesa = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            conn.setAutoCommit(false);

            // Primero actualizar la tabla producto
            stmtProducto = conn.prepareStatement(SQLQueries.PRODUCTO_UPDATE);
            stmtProducto.setString(1, hamburguesa.getNombre());
            stmtProducto.setString(2, hamburguesa.getDescripcion());
            stmtProducto.setDouble(3, hamburguesa.getPrecio());
            stmtProducto.setString(4, hamburguesa.getImagen());
            stmtProducto.setBoolean(5, hamburguesa.isDestacado());
            stmtProducto.setInt(6, hamburguesa.getCategoriaId());
            stmtProducto.setInt(7, hamburguesa.getId());

            int filasProducto = stmtProducto.executeUpdate();

            if (filasProducto > 0) {
                // Luego actualizar la tabla hamburguesa
                stmtHamburguesa = conn.prepareStatement(SQLQueries.HAMBURGUESA_UPDATE);

                // Convertir lista de ingredientes a array SQL
                List<String> ingredientes = hamburguesa.getIngredientes();
                if (ingredientes != null && !ingredientes.isEmpty()) {
                    String[] ingredientesArray = ingredientes.toArray(new String[0]);
                    Array sqlArray = conn.createArrayOf("text", ingredientesArray);
                    stmtHamburguesa.setArray(1, sqlArray);
                } else {
                    stmtHamburguesa.setNull(1, java.sql.Types.ARRAY);
                }

                stmtHamburguesa.setInt(2, hamburguesa.getId());

                int filasHamburguesa = stmtHamburguesa.executeUpdate();
                resultado = filasHamburguesa > 0;

                conn.commit();
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar hamburguesa", ex);
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    LOGGER.log(Level.SEVERE, "Error al hacer rollback", rollbackEx);
                }
            }
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                } catch (SQLException autocommitEx) {
                    LOGGER.log(Level.SEVERE, "Error al restablecer autocommit", autocommitEx);
                }
            }
            cerrarRecursos(null, stmtHamburguesa, null);
            cerrarRecursos(conn, stmtProducto, null);
        }

        return resultado;
    }

    /**
     * Elimina una hamburguesa por su ID
     *
     * @param id ID de la hamburguesa a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            // Al eliminar el producto en cascada, también se elimina la hamburguesa
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_DELETE);
            stmt.setInt(1, id);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar hamburguesa", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Obtiene las hamburguesas destacadas
     *
     * @return Lista de hamburguesas destacadas
     */
    public List<Hamburguesa> findDestacadas() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Hamburguesa> hamburguesas = new ArrayList<>();

        try {
            conn = conexion.getConnection();

            // Consulta personalizada para obtener solo hamburguesas destacadas
            String query = SQLQueries.HAMBURGUESA_FIND_ALL + " AND p.destacado = true";
            stmt = conn.prepareStatement(query);

            rs = stmt.executeQuery();

            while (rs.next()) {
                Hamburguesa hamburguesa = new Hamburguesa(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen"),
                        rs.getBoolean("destacado"),
                        rs.getInt("categoria_id"),
                        "Hamburguesas" // Categoría fija para hamburguesas
                );

                // Obtener ingredientes
                Array ingredientesArray = rs.getArray("ingredientes");
                if (ingredientesArray != null) {
                    String[] ingredientes = (String[]) ingredientesArray.getArray();
                    hamburguesa.setIngredientesFromArray(ingredientes);
                }

                hamburguesas.add(hamburguesa);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener hamburguesas destacadas", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return hamburguesas;
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