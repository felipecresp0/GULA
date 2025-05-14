package com.gulaburger.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.io.InputStream;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Clase para gestionar la conexión con la base de datos PostgreSQL
 */
public class ConexionDB {

    private static final Logger LOGGER = Logger.getLogger(ConexionDB.class.getName());

    // Instancia singleton
    private static ConexionDB instance = null;

    // Propiedades de conexión
    private String url;
    private String username;
    private String password;

    /**
     * Constructor privado para patrón singleton
     */
    private ConexionDB() {
        loadProperties();
    }

    /**
     * Obtiene la instancia única de ConexionDB
     * @return La instancia de ConexionDB
     */
    public static synchronized ConexionDB getInstance() {
        if (instance == null) {
            instance = new ConexionDB();
        }
        return instance;
    }

    /**
     * Carga las propiedades de conexión desde el archivo db.properties
     */
    private void loadProperties() {
        Properties props = new Properties();

        try (InputStream input = getClass().getClassLoader().getResourceAsStream("db.properties")) {
            if (input == null) {
                LOGGER.severe("No se pudo encontrar el archivo db.properties");
                throw new RuntimeException("No se pudo encontrar el archivo db.properties");
            }

            props.load(input);

            url = props.getProperty("db.url");
            username = props.getProperty("db.username");
            password = props.getProperty("db.password");

            // Registrar el driver JDBC
            Class.forName("org.postgresql.Driver");

        } catch (IOException | ClassNotFoundException ex) {
            LOGGER.log(Level.SEVERE, "Error al cargar propiedades de la base de datos", ex);
            throw new RuntimeException("Error al cargar propiedades de la base de datos", ex);
        }
    }

    /**
     * Establece una conexión con la base de datos
     * @return Una conexión a la base de datos
     * @throws SQLException si hay un error al conectar
     */
    public Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(url, username, password);
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error al obtener conexión a la base de datos", ex);
            throw ex;
        }
    }

    /**
     * Cierra de forma segura una conexión
     * @param conn La conexión a cerrar
     */
    public void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException ex) {
                LOGGER.log(Level.WARNING, "Error al cerrar conexión", ex);
            }
        }
    }
}