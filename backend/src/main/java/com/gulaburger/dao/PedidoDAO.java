package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.models.Pedido;
import com.gulaburger.models.LineaPedido;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Pedido
 */
public class PedidoDAO {

    private static final Logger LOGGER = Logger.getLogger(PedidoDAO.class.getName());
    private final ConexionDB conexion;

    /**
     * Constructor
     */
    public PedidoDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Obtiene todos los pedidos
     *
     * @return Lista de pedidos
     */
    public List<Pedido> findAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Pedido> pedidos = new ArrayList<>();

        try {
            conn = conexion.getConnection();

            // Primero obtenemos todos los pedidos
            String query = SQLQueries.PEDIDO_FIND_BY_USUARIO.replace("WHERE usuario_id = ?", "");
            stmt = conn.prepareStatement(query);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Pedido pedido = new Pedido(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getTimestamp("fecha_pedido"),
                        rs.getString("estado"),
                        rs.getDouble("total"),
                        rs.getString("direccion_entrega"),
                        rs.getString("telefono")
                );

                // Añadir las líneas de pedido
                List<LineaPedido> lineas = findLineasByPedidoId(conn, pedido.getId());
                pedido.setLineas(lineas);

                pedidos.add(pedido);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener todos los pedidos", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return pedidos;
    }

    /**
     * Obtiene los pedidos de un usuario
     *
     * @param usuarioId ID del usuario
     * @return Lista de pedidos del usuario
     */
    public List<Pedido> findByUsuario(int usuarioId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Pedido> pedidos = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PEDIDO_FIND_BY_USUARIO);
            stmt.setInt(1, usuarioId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Pedido pedido = new Pedido(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getTimestamp("fecha_pedido"),
                        rs.getString("estado"),
                        rs.getDouble("total"),
                        rs.getString("direccion_entrega"),
                        rs.getString("telefono")
                );

                // Añadir las líneas de pedido
                List<LineaPedido> lineas = findLineasByPedidoId(conn, pedido.getId());
                pedido.setLineas(lineas);

                pedidos.add(pedido);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener pedidos del usuario", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return pedidos;
    }

    /**
     * Obtiene un pedido por su ID
     *
     * @param id ID del pedido
     * @return El pedido encontrado o null si no existe
     */
    public Pedido findById(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Pedido pedido = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PEDIDO_FIND_BY_ID);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                pedido = new Pedido(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getTimestamp("fecha_pedido"),
                        rs.getString("estado"),
                        rs.getDouble("total"),
                        rs.getString("direccion_entrega"),
                        rs.getString("telefono")
                );

                // Añadir las líneas de pedido
                List<LineaPedido> lineas = findLineasByPedidoId(conn, pedido.getId());
                pedido.setLineas(lineas);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener pedido por ID", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return pedido;
    }

    /**
     * Inserta un nuevo pedido
     *
     * @param pedido Pedido a insertar
     * @return ID del pedido insertado o -1 si hay error
     */
    public int insert(Pedido pedido) {
        Connection conn = null;
        PreparedStatement stmtPedido = null;
        PreparedStatement stmtLinea = null;
        ResultSet rsPedido = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            conn.setAutoCommit(false);

            // Insertar el pedido
            stmtPedido = conn.prepareStatement(SQLQueries.PEDIDO_INSERT);
            stmtPedido.setInt(1, pedido.getUsuarioId());
            stmtPedido.setString(2, pedido.getEstado());
            stmtPedido.setDouble(3, pedido.getTotal());
            stmtPedido.setString(4, pedido.getDireccionEntrega());
            stmtPedido.setString(5, pedido.getTelefono());

            rsPedido = stmtPedido.executeQuery();

            if (rsPedido.next()) {
                id = rsPedido.getInt(1);
                pedido.setId(id);

                // Insertar las líneas de pedido
                for (LineaPedido linea : pedido.getLineas()) {
                    stmtLinea = conn.prepareStatement(SQLQueries.LINEA_PEDIDO_INSERT);
                    stmtLinea.setInt(1, id);
                    stmtLinea.setInt(2, linea.getProductoId());
                    stmtLinea.setInt(3, linea.getCantidad());
                    stmtLinea.setDouble(4, linea.getPrecioUnitario());
                    stmtLinea.setDouble(5, linea.getSubtotal());

                    stmtLinea.executeUpdate();
                }

                conn.commit();
            } else {
                conn.rollback();
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar pedido", ex);
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
            cerrarRecursos(null, stmtLinea, null);
            cerrarRecursos(conn, stmtPedido, rsPedido);
        }

        return id;
    }

    /**
     * Actualiza el estado de un pedido
     *
     * @param pedidoId ID del pedido
     * @param estado Nuevo estado
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean updateEstado(int pedidoId, String estado) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.PEDIDO_UPDATE_ESTADO);
            stmt.setString(1, estado);
            stmt.setInt(2, pedidoId);

            int filasActualizadas = stmt.executeUpdate();
            resultado = filasActualizadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar estado del pedido", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Obtiene las líneas de un pedido
     *
     * @param conn Conexión a utilizar
     * @param pedidoId ID del pedido
     * @return Lista de líneas del pedido
     * @throws SQLException Si hay un error de SQL
     */
    private List<LineaPedido> findLineasByPedidoId(Connection conn, int pedidoId) throws SQLException {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<LineaPedido> lineas = new ArrayList<>();

        try {
            stmt = conn.prepareStatement(SQLQueries.LINEA_PEDIDO_FIND_BY_PEDIDO);
            stmt.setInt(1, pedidoId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                LineaPedido linea = new LineaPedido(
                        rs.getInt("id"),
                        rs.getInt("pedido_id"),
                        rs.getInt("producto_id"),
                        rs.getInt("cantidad"),
                        rs.getDouble("precio_unitario"),
                        rs.getDouble("subtotal"),
                        rs.getString("producto_nombre"),
                        rs.getString("producto_descripcion"),
                        rs.getString("producto_imagen")
                );

                lineas.add(linea);
            }
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }
        }

        return lineas;
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