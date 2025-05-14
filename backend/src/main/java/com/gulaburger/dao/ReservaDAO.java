package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.models.Reserva;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Reserva
 */
public class ReservaDAO {

    private static final Logger LOGGER = Logger.getLogger(ReservaDAO.class.getName());
    private final ConexionDB conexion;

    /**
     * Constructor
     */
    public ReservaDAO() {
        this.conexion = ConexionDB.getInstance();
    }

    /**
     * Obtiene todas las reservas
     *
     * @return Lista de reservas
     */
    public List<Reserva> findAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Reserva> reservas = new ArrayList<>();

        try {
            conn = conexion.getConnection();

            // Consulta personalizada para obtener todas las reservas con información adicional
            String query = "SELECT r.id, r.usuario_id, r.restaurante_id, r.fecha, r.hora, " +
                    "r.personas, r.estado, r.comentarios, " +
                    "rest.nombre as restaurante_nombre, u.nombre as usuario_nombre, u.email as usuario_email " +
                    "FROM reserva r " +
                    "JOIN restaurante rest ON r.restaurante_id = rest.id " +
                    "JOIN usuario u ON r.usuario_id = u.id " +
                    "ORDER BY r.fecha DESC, r.hora DESC";

            stmt = conn.prepareStatement(query);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Reserva reserva = new Reserva(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getInt("restaurante_id"),
                        rs.getDate("fecha"),
                        rs.getString("hora"),
                        rs.getInt("personas"),
                        rs.getString("estado"),
                        rs.getString("comentarios"),
                        rs.getString("restaurante_nombre"),
                        rs.getString("usuario_nombre")
                );

                reserva.setUsuarioEmail(rs.getString("usuario_email"));

                reservas.add(reserva);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener todas las reservas", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return reservas;
    }

    /**
     * Obtiene las reservas de un usuario
     *
     * @param usuarioId ID del usuario
     * @return Lista de reservas del usuario
     */
    public List<Reserva> findByUsuario(int usuarioId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Reserva> reservas = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESERVA_FIND_BY_USUARIO);
            stmt.setInt(1, usuarioId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Reserva reserva = new Reserva(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getInt("restaurante_id"),
                        rs.getDate("fecha"),
                        rs.getString("hora"),
                        rs.getInt("personas"),
                        rs.getString("estado"),
                        rs.getString("comentarios"),
                        rs.getString("restaurante_nombre"),
                        null // No tenemos nombre de usuario porque ya sabemos que es el mismo
                );

                reservas.add(reserva);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener reservas del usuario", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return reservas;
    }

    /**
     * Obtiene las reservas de un restaurante
     *
     * @param restauranteId ID del restaurante
     * @return Lista de reservas del restaurante
     */
    public List<Reserva> findByRestaurante(int restauranteId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Reserva> reservas = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESERVA_FIND_BY_RESTAURANTE);
            stmt.setInt(1, restauranteId);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Reserva reserva = new Reserva(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getInt("restaurante_id"),
                        rs.getDate("fecha"),
                        rs.getString("hora"),
                        rs.getInt("personas"),
                        rs.getString("estado"),
                        rs.getString("comentarios")
                );

                reserva.setUsuarioNombre(rs.getString("usuario_nombre"));
                reserva.setUsuarioEmail(rs.getString("usuario_email"));

                reservas.add(reserva);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener reservas del restaurante", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return reservas;
    }

    /**
     * Obtiene una reserva por su ID
     *
     * @param id ID de la reserva
     * @return La reserva encontrada o null si no existe
     */
    public Reserva findById(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Reserva reserva = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESERVA_FIND_BY_ID);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                reserva = new Reserva(
                        rs.getInt("id"),
                        rs.getInt("usuario_id"),
                        rs.getInt("restaurante_id"),
                        rs.getDate("fecha"),
                        rs.getString("hora"),
                        rs.getInt("personas"),
                        rs.getString("estado"),
                        rs.getString("comentarios"),
                        rs.getString("restaurante_nombre"),
                        rs.getString("usuario_nombre")
                );
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener reserva por ID", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return reserva;
    }

    /**
     * Inserta una nueva reserva
     *
     * @param reserva Reserva a insertar
     * @return ID de la reserva insertada o -1 si hay error
     */
    public int insert(Reserva reserva) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESERVA_INSERT);

            stmt.setInt(1, reserva.getUsuarioId());
            stmt.setInt(2, reserva.getRestauranteId());
            stmt.setDate(3, new Date(reserva.getFecha().getTime()));
            stmt.setString(4, reserva.getHora());
            stmt.setInt(5, reserva.getPersonas());
            stmt.setString(6, reserva.getEstado());
            stmt.setString(7, reserva.getComentarios());

            rs = stmt.executeQuery();

            if (rs.next()) {
                id = rs.getInt(1);
                reserva.setId(id);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar reserva", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return id;
    }

    /**
     * Actualiza el estado de una reserva
     *
     * @param reservaId ID de la reserva
     * @param estado Nuevo estado
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean updateEstado(int reservaId, String estado) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESERVA_UPDATE_ESTADO);
            stmt.setString(1, estado);
            stmt.setInt(2, reservaId);

            int filasActualizadas = stmt.executeUpdate();
            resultado = filasActualizadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar estado de la reserva", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Elimina una reserva por su ID
     *
     * @param id ID de la reserva a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESERVA_DELETE);
            stmt.setInt(1, id);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar reserva", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Obtiene los slots de disponibilidad para un restaurante y fecha
     *
     * @param restauranteId ID del restaurante
     * @param fecha Fecha para consultar disponibilidad
     * @return Lista de slots con su disponibilidad (hora y mesas disponibles)
     */
    public List<Map<String, Object>> getDisponibilidad(int restauranteId, java.util.Date fecha) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Map<String, Object>> slots = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.DISPONIBILIDAD_SLOTS);
            stmt.setInt(1, restauranteId);
            stmt.setInt(2, restauranteId);
            stmt.setDate(3, new Date(fecha.getTime()));
            rs = stmt.executeQuery();

            while (rs.next()) {
                Map<String, Object> slot = new HashMap<>();
                slot.put("hora", rs.getString("hora"));
                slot.put("mesas_disponibles", rs.getInt("mesas_disponibles"));

                slots.add(slot);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener disponibilidad", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return slots;
    }

    /**
     * Cuenta el número de reservas para una hora específica
     *
     * @param restauranteId ID del restaurante
     * @param fecha Fecha de la reserva
     * @param hora Hora de la reserva
     * @return Número de reservas en esa hora
     */
    public int countReservasPorHora(int restauranteId, java.util.Date fecha, String hora) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int count = 0;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESERVA_COUNT_POR_HORA);
            stmt.setInt(1, restauranteId);
            stmt.setDate(2, new Date(fecha.getTime()));
            stmt.setString(3, hora);
            rs = stmt.executeQuery();

            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al contar reservas por hora", ex);
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