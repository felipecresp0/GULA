package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.models.Producto;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Producto
 */
public class ProductoDAO {

    private static final Logger LOGGER = Logger.getLogger(ProductoDAO.class.getName());
    private final ConexionDB conexion;

    /**
     * Constructor
     */
    public ProductoDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Obtiene todos los productos
     *
     * @return Lista de productos
     */
    public List<Producto> findAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Producto> productos = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_FIND_ALL);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Producto producto = new Producto(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen"),
                        rs.getBoolean("destacado"),
                        rs.getInt("categoria_id"),
                        rs.getString("categoria_nombre")
                );

                productos.add(producto);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener todos los productos", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return productos;
    }

    /**
     * Obtiene un producto por su ID
     *
     * @param id ID del producto
     * @return El producto encontrado o null si no existe
     */
    public Producto findById(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Producto producto = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_FIND_BY_ID);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                producto = new Producto(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen"),
                        rs.getBoolean("destacado"),
                        rs.getInt("categoria_id"),
                        rs.getString("categoria_nombre")
                );
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener producto por ID", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return producto;
    }

    /**
     * Inserta un nuevo producto
     *
     * @param producto Producto a insertar
     * @return ID del producto insertado o -1 si hay error
     */
    public int insert(Producto producto) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_INSERT);

            stmt.setString(1, producto.getNombre());
            stmt.setString(2, producto.getDescripcion());
            stmt.setDouble(3, producto.getPrecio());
            stmt.setString(4, producto.getImagen());
            stmt.setBoolean(5, producto.isDestacado());
            stmt.setInt(6, producto.getCategoriaId());

            rs = stmt.executeQuery();

            if (rs.next()) {
                id = rs.getInt(1);
                producto.setId(id);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar producto", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return id;
    }

    /**
     * Actualiza un producto existente
     *
     * @param producto Producto con los datos actualizados
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean update(Producto producto) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_UPDATE);

            stmt.setString(1, producto.getNombre());
            stmt.setString(2, producto.getDescripcion());
            stmt.setDouble(3, producto.getPrecio());
            stmt.setString(4, producto.getImagen());
            stmt.setBoolean(5, producto.isDestacado());
            stmt.setInt(6, producto.getCategoriaId());
            stmt.setInt(7, producto.getId());

            int filasActualizadas = stmt.executeUpdate();
            resultado = filasActualizadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar producto", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Elimina un producto por su ID
     *
     * @param id ID del producto a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_DELETE);
            stmt.setInt(1, id);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar producto", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Obtiene los productos destacados
     *
     * @return Lista de productos destacados
     */
    public List<Producto> findDestacados() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Producto> productos = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_FIND_DESTACADOS);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Producto producto = new Producto(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen"),
                        rs.getBoolean("destacado"),
                        rs.getInt("categoria_id"),
                        rs.getString("categoria_nombre")
                );

                productos.add(producto);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener productos destacados", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return productos;
    }

    /**
     * Obtiene los productos por categoría
     *
     * @param categoriaId ID de la categoría
     * @return Lista de productos de la categoría
     */
    public List<Producto> findByCategoria(int categoriaId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Producto> productos = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PRODUCTO_FIND_BY_CATEGORIA);
            stmt.setInt(1, categoriaId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Producto producto = new Producto(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen"),
                        rs.getBoolean("destacado"),
                        rs.getInt("categoria_id"),
                        rs.getString("categoria_nombre")
                );

                productos.add(producto);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener productos por categoría", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return productos;
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