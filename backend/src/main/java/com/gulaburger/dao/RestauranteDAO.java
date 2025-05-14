package com.gulaburger.dao;

import com.gulaburger.db.ConexionDB;
import com.gulaburger.db.SQLQueries;
import com.gulaburger.models.Restaurante;

import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DAO para la entidad Restaurante
 */
public class RestauranteDAO {

    private static final Logger LOGGER = Logger.getLogger(RestauranteDAO.class.getName());
    private final ConexionDB conexion;
    private final ResenaDAO resenaDAO;

    /**
     * Constructor
     */
    public RestauranteDAO() {
        this.conexion = ConexionDB.getInstance();
        this.resenaDAO = new ResenaDAO();
    }

    /**
     * Obtiene todos los restaurantes
     *
     * @return Lista de restaurantes
     */
    public List<Restaurante> findAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Restaurante> restaurantes = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESTAURANTE_FIND_ALL);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Restaurante restaurante = createRestauranteFromResultSet(rs);

                // Obtener valoración media y total de reseñas
                enrichRestauranteWithRatings(conn, restaurante);

                restaurantes.add(restaurante);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener todos los restaurantes", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return restaurantes;
    }

    /**
     * Obtiene un restaurante por su ID
     *
     * @param id ID del restaurante
     * @return El restaurante encontrado o null si no existe
     */
    public Restaurante findById(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Restaurante restaurante = null;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESTAURANTE_FIND_BY_ID);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                restaurante = createRestauranteFromResultSet(rs);

                // Obtener valoración media y total de reseñas
                enrichRestauranteWithRatings(conn, restaurante);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener restaurante por ID", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return restaurante;
    }

    /**
     * Busca restaurantes por código postal
     *
     * @param codigoPostal Código postal o prefijo
     * @return Lista de restaurantes que coinciden con el código postal
     */
    public List<Restaurante> findByCodigoPostal(String codigoPostal) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Restaurante> restaurantes = new ArrayList<>();

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESTAURANTE_FIND_BY_CP);
            stmt.setString(1, codigoPostal + "%"); // Búsqueda con comodín para prefijos
            rs = stmt.executeQuery();

            while (rs.next()) {
                Restaurante restaurante = createRestauranteFromResultSet(rs);

                // Obtener valoración media y total de reseñas
                enrichRestauranteWithRatings(conn, restaurante);

                restaurantes.add(restaurante);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al buscar restaurantes por código postal", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return restaurantes;
    }

    /**
     * Inserta un nuevo restaurante
     *
     * @param restaurante Restaurante a insertar
     * @return ID del restaurante insertado o -1 si hay error
     */
    public int insert(Restaurante restaurante) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int id = -1;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESTAURANTE_INSERT);

            stmt.setString(1, restaurante.getNombre());
            stmt.setString(2, restaurante.getDireccion());
            stmt.setString(3, restaurante.getCodigoPostal());
            stmt.setDouble(4, restaurante.getLatitud());
            stmt.setDouble(5, restaurante.getLongitud());
            stmt.setString(6, restaurante.getTelefono());
            stmt.setString(7, restaurante.getHorarioApertura());
            stmt.setString(8, restaurante.getHorarioCierre());
            stmt.setInt(9, restaurante.getCapacidad());

            rs = stmt.executeQuery();

            if (rs.next()) {
                id = rs.getInt(1);
                restaurante.setId(id);
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al insertar restaurante", ex);
        } finally {
            cerrarRecursos(conn, stmt, rs);
        }

        return id;
    }

    /**
     * Actualiza un restaurante existente
     *
     * @param restaurante Restaurante con los datos actualizados
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean update(Restaurante restaurante) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESTAURANTE_UPDATE);

            stmt.setString(1, restaurante.getNombre());
            stmt.setString(2, restaurante.getDireccion());
            stmt.setString(3, restaurante.getCodigoPostal());
            stmt.setDouble(4, restaurante.getLatitud());
            stmt.setDouble(5, restaurante.getLongitud());
            stmt.setString(6, restaurante.getTelefono());
            stmt.setString(7, restaurante.getHorarioApertura());
            stmt.setString(8, restaurante.getHorarioCierre());
            stmt.setInt(9, restaurante.getCapacidad());
            stmt.setInt(10, restaurante.getId());

            int filasActualizadas = stmt.executeUpdate();
            resultado = filasActualizadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al actualizar restaurante", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Elimina un restaurante por su ID
     *
     * @param id ID del restaurante a eliminar
     * @return true si se eliminó correctamente, false en caso contrario
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean resultado = false;

        try {
            conn = conexion.getConnection();
            stmt = conn.prepareStatement(SQLQueries.RESTAURANTE_DELETE);
            stmt.setInt(1, id);

            int filasEliminadas = stmt.executeUpdate();
            resultado = filasEliminadas > 0;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al eliminar restaurante", ex);
        } finally {
            cerrarRecursos(conn, stmt, null);
        }

        return resultado;
    }

    /**
     * Crea un objeto Restaurante a partir de un ResultSet
     *
     * @param rs ResultSet con los datos del restaurante
     * @return Objeto Restaurante
     * @throws SQLException Si hay un error al acceder a los datos
     */
    private Restaurante createRestauranteFromResultSet(ResultSet rs) throws SQLException {
        return new Restaurante(
                rs.getInt("id"),
                rs.getString("nombre"),
                rs.getString("direccion"),
                rs.getString("codigo_postal"),
                rs.getDouble("latitud"),
                rs.getDouble("longitud"),
                rs.getString("telefono"),
                rs.getString("horario_apertura"),
                rs.getString("horario_cierre"),
                rs.getInt("capacidad")
        );
    }

    /**
     * Enriquece un objeto Restaurante con información de valoraciones
     *
     * @param conn Conexión a utilizar
     * @param restaurante Restaurante a enriquecer
     * @throws SQLException Si hay un error de SQL
     */
    private void enrichRestauranteWithRatings(Connection conn, Restaurante restaurante) throws SQLException {
        PreparedStatement stmtAvg = null;
        PreparedStatement stmtCount = null;
        ResultSet rsAvg = null;
        ResultSet rsCount = null;

        try {
            // Obtener valoración media
            stmtAvg = conn.prepareStatement(SQLQueries.RESENA_AVG_PUNTUACION);
            stmtAvg.setInt(1, restaurante.getId());
            rsAvg = stmtAvg.executeQuery();

            if (rsAvg.next()) {
                double valoracion = rsAvg.getDouble(1);
                if (!rsAvg.wasNull()) {
                    restaurante.setValoracion(valoracion);
                } else {
                    restaurante.setValoracion(0.0);
                }
            }

            // Obtener total de reseñas
            stmtCount = conn.prepareStatement(SQLQueries.RESENA_COUNT_BY_RESTAURANTE);
            stmtCount.setInt(1, restaurante.getId());
            rsCount = stmtCount.executeQuery();

            if (rsCount.next()) {
                restaurante.setTotalResenas(rsCount.getInt(1));
            }

            // Aquí podrías añadir lógica para obtener fotos si existieran en la base de datos
            // Por ahora, asignamos un array vacío o algunas fotos por defecto
            restaurante.setFotos(new String[]{
                    "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/restaurante1.jpg",
                    "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/restaurante2.jpg"
            });

        } finally {
            if (rsAvg != null) rsAvg.close();
            if (rsCount != null) rsCount.close();
            if (stmtAvg != null) stmtAvg.close();
            if (stmtCount != null) stmtCount.close();
        }
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