package com.gulaburger.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class ConexionDB {

    private static ConexionDB instancia;
    private final String url;
    private final String user;
    private final String password;

    private ConexionDB() {
        this.url = "jdbc:postgresql://localhost:5432/gula"; // reemplaza con tu config
        this.user = "usuario";
        this.password = "password";
    }

    public static ConexionDB getInstance() {
        if (instancia == null) {
            instancia = new ConexionDB();
        }
        return instancia;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }

    public void closeConnection(Connection conn) throws SQLException {
        if (conn != null && !conn.isClosed()) {
            conn.close();
        }
    }
}

