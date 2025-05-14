package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.models.Carrito;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Carrito
 */
public class CarritoDAO {

    private static final Logger LOGGER = Logger.getLogger(CarritoDAO.class.getName());
    private final ConexionDB conexion;

    /**
     * Constructor
     */
    public CarritoDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Obtiene todos los items del carrito de un usuario
     *
     * @param usuarioId ID del usuario
     * @return Lista de items en el carrito
     */
    public List<Carrito> findByUsuario(int usuarioId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Carrito> items = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.CARRITO_FIND_BY_USUARIO);
            stmt.setInt(1, usuarioId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Carrito item = new Carrito(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getInt("producto_id"),
                        rs.getInt("cantidad"),
                        rs.getTimestamp("fecha_agregado"),
                        rs.getString("nombre"),
                        rs.getString("descripcion"),
                        rs.getDouble("precio"),
                        rs.getString("imagen")
                );

                items.add(item);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener carrito del usuario", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return items;
    }

    /**
     * Busca un item en el carrito por usuario y producto
     *
     * @param usuarioId ID del usuario
     * @param productoId ID del producto
     * @return Item encontrado o null si no existe
     */
    public Carrito findItem(int usuarioId, int productoId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Carrito item = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.CARRITO_FIND_ITEM);
            stmt.setInt(1, usuarioId);
            stmt.setInt(2, productoId);
            rs = stmt.executeQuery();

            if (rs.next()) {
                item = new Carrito();
                item.setId(rs.getInt("id"));
                item.setCantidad(rs.getInt("cantidad"));
                item.setUsuarioId(usuarioId);
                item.setProductoId(productoId);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al buscar item en el carrito", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return item;
    }

    /**
     * Agrega un producto al carrito o actualiza la cantidad si ya existe
     *
     * @param usuarioId ID del usuario
     * @param productoId ID del producto
     * @param cantidad Cantidad a agregar
     * @return ID del item creado o actualizado o -1 si hay error
     */
    public int agregarProducto(int usuarioId, int productoId, int cantidad) {
        // Verificar si el producto ya está en el carrito
        Carrito itemExistente = findItem(usuarioId, productoId);

        if (itemExistente != null) {
            // Actualizar cantidad
            int nuevaCantidad = itemExistente.getCantidad() + cantidad;
            return actualizarCantidad(itemExistente.getId(), nuevaCantidad) ? itemExistente.getId() : -1;
        } else {
            // Insertar nuevo item
            return insertarItem(usuarioId, productoId, cantidad);
        }
    }

    /**
     * Inserta un nuevo item en el carrito
     *
     * @param usuarioId ID del usuario
     * @param productoId ID del producto
     * @param cantidad Cantidad inicial
     * @return ID del item creado o -1 si hay error
     */
    private int insertarItem(int usuarioId, int productoId, int cantidad) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.CARRITO_INSERT);
            stmt.setInt(1, usuarioId);
            stmt.setInt(2, productoId);
            stmt.setInt(3, cantidad);

            rs = stmt.executeQuery();

            if (rs.next()) {
                id = rs.getInt(1);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar item en el carrito", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return id;
    }

    /**
     * Actualiza la cantidad de un item del carrito
     *
     * @param itemId ID del item
     * @param cantidad Nueva cantidad
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean actualizarCantidad(int itemId, int cantidad) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.CARRITO_UPDATE_CANTIDAD);
            stmt.setInt(1, cantidad);
            stmt.setInt(2, itemId);

            int filasActualizadas = stmt.executeUpdate();
            resultado = filasActualizadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar cantidad en el carrito", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Elimina un item del carrito
     *
     * @param itemId ID del item a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean eliminarItem(int itemId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.CARRITO_DELETE_ITEM);
            stmt.setInt(1, itemId);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar item del carrito", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Vacía el carrito de un usuario
     *
     * @param usuarioId ID del usuario
     * @return true si se vació correctamente, false en caso contrario
     */
    public boolean vaciarCarrito(int usuarioId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.CARRITO_DELETE_ALL_BY_USUARIO);
            stmt.setInt(1, usuarioId);

            stmt.executeUpdate();
            resultado = true; // Considerar exitoso incluso si no había items

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al vaciar carrito", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Obtiene el contador de items en el carrito de un usuario
     *
     * @param usuarioId ID del usuario
     * @return Suma de cantidades de todos los items o 0 si hay error
     */
    public int obtenerContador(int usuarioId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int contador = 0;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.CARRITO_COUNT_ITEMS);
            stmt.setInt(1, usuarioId);
            rs = stmt.executeQuery();

            if (rs.next()) {
                contador = rs.getInt(1);
                if (rs.wasNull()) {
                    contador = 0;
                }
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener contador de carrito", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return contador;
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