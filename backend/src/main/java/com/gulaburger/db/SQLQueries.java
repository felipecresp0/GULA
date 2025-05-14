package com.gulaburger.db;

/**
 * Clase que centraliza todas las consultas SQL utilizadas en la aplicación
 */
public class SQLQueries {

    // Consultas para USUARIO
    public static final String USUARIO_FIND_BY_EMAIL =
            "SELECT id, nombre, email, contrasena, rol, fecha_registro FROM usuario WHERE email = ?";

    public static final String USUARIO_INSERT =
            "INSERT INTO usuario (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?) RETURNING id";

    public static final String USUARIO_UPDATE =
            "UPDATE usuario SET nombre = ?, email = ?, contrasena = ?, rol = ? WHERE id = ?";

    public static final String USUARIO_DELETE =
            "DELETE FROM usuario WHERE id = ?";

    public static final String USUARIO_FIND_BY_ID =
            "SELECT id, nombre, email, rol, fecha_registro FROM usuario WHERE id = ?";

    public static final String USUARIO_FIND_ALL =
            "SELECT id, nombre, email, rol, fecha_registro FROM usuario ORDER BY fecha_registro DESC";

    // Consultas para PRODUCTO
    public static final String PRODUCTO_FIND_ALL =
            "SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.destacado, p.categoria_id, c.nombre as categoria_nombre " +
                    "FROM producto p " +
                    "LEFT JOIN categoria c ON p.categoria_id = c.id " +
                    "ORDER BY p.id";

    public static final String PRODUCTO_FIND_BY_ID =
            "SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.destacado, p.categoria_id, c.nombre as categoria_nombre " +
                    "FROM producto p " +
                    "LEFT JOIN categoria c ON p.categoria_id = c.id " +
                    "WHERE p.id = ?";

    public static final String PRODUCTO_INSERT =
            "INSERT INTO producto (nombre, descripcion, precio, imagen, destacado, categoria_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?) RETURNING id";

    public static final String PRODUCTO_UPDATE =
            "UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, destacado = ?, categoria_id = ? " +
                    "WHERE id = ?";

    public static final String PRODUCTO_DELETE =
            "DELETE FROM producto WHERE id = ?";

    public static final String PRODUCTO_FIND_DESTACADOS =
            "SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.destacado, p.categoria_id, c.nombre as categoria_nombre " +
                    "FROM producto p " +
                    "LEFT JOIN categoria c ON p.categoria_id = c.id " +
                    "WHERE p.destacado = true " +
                    "ORDER BY p.id";

    public static final String PRODUCTO_FIND_BY_CATEGORIA =
            "SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.destacado, p.categoria_id, c.nombre as categoria_nombre " +
                    "FROM producto p " +
                    "LEFT JOIN categoria c ON p.categoria_id = c.id " +
                    "WHERE p.categoria_id = ? " +
                    "ORDER BY p.id";

    // Consultas para HAMBURGUESA (subclase de PRODUCTO)
    public static final String HAMBURGUESA_FIND_ALL =
            "SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.destacado, p.categoria_id, " +
                    "h.ingredientes " +
                    "FROM producto p " +
                    "JOIN hamburguesa h ON p.id = h.id " +
                    "WHERE p.categoria_id = 1 " + // 1 = categoría de hamburguesas
                    "ORDER BY p.id";

    public static final String HAMBURGUESA_FIND_BY_ID =
            "SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.destacado, p.categoria_id, " +
                    "h.ingredientes " +
                    "FROM producto p " +
                    "JOIN hamburguesa h ON p.id = h.id " +
                    "WHERE p.id = ?";

    public static final String HAMBURGUESA_INSERT =
            "INSERT INTO hamburguesa (id, ingredientes) VALUES (?, ?)";

    public static final String HAMBURGUESA_UPDATE =
            "UPDATE hamburguesa SET ingredientes = ? WHERE id = ?";

    // Consultas para CARRITO
    public static final String CARRITO_FIND_BY_USUARIO =
            "SELECT c.id, c.usuario_id, c.producto_id, c.cantidad, c.fecha_agregado, " +
                    "p.nombre, p.descripcion, p.precio, p.imagen " +
                    "FROM carrito c " +
                    "JOIN producto p ON c.producto_id = p.id " +
                    "WHERE c.usuario_id = ? " +
                    "ORDER BY c.fecha_agregado DESC";

    public static final String CARRITO_FIND_ITEM =
            "SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?";

    public static final String CARRITO_INSERT =
            "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?) RETURNING id";

    public static final String CARRITO_UPDATE_CANTIDAD =
            "UPDATE carrito SET cantidad = ? WHERE id = ?";

    public static final String CARRITO_DELETE_ITEM =
            "DELETE FROM carrito WHERE id = ?";

    public static final String CARRITO_DELETE_ALL_BY_USUARIO =
            "DELETE FROM carrito WHERE usuario_id = ?";

    public static final String CARRITO_COUNT_ITEMS =
            "SELECT SUM(cantidad) FROM carrito WHERE usuario_id = ?";

    // Consultas para PEDIDO
    public static final String PEDIDO_INSERT =
            "INSERT INTO pedido (usuario_id, estado, total, direccion_entrega, telefono) " +
                    "VALUES (?, ?, ?, ?, ?) RETURNING id";

    public static final String PEDIDO_FIND_BY_USUARIO =
            "SELECT id, usuario_id, fecha_pedido, estado, total, direccion_entrega, telefono " +
                    "FROM pedido " +
                    "WHERE usuario_id = ? " +
                    "ORDER BY fecha_pedido DESC";

    public static final String PEDIDO_FIND_BY_ID =
            "SELECT id, usuario_id, fecha_pedido, estado, total, direccion_entrega, telefono " +
                    "FROM pedido " +
                    "WHERE id = ?";

    public static final String PEDIDO_UPDATE_ESTADO =
            "UPDATE pedido SET estado = ? WHERE id = ?";

    // Consultas para LINEA_PEDIDO
    public static final String LINEA_PEDIDO_INSERT =
            "INSERT INTO linea_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) " +
                    "VALUES (?, ?, ?, ?, ?)";

    public static final String LINEA_PEDIDO_FIND_BY_PEDIDO =
            "SELECT lp.id, lp.pedido_id, lp.producto_id, lp.cantidad, lp.precio_unitario, lp.subtotal, " +
                    "p.nombre as producto_nombre, p.descripcion as producto_descripcion, p.imagen as producto_imagen " +
                    "FROM linea_pedido lp " +
                    "JOIN producto p ON lp.producto_id = p.id " +
                    "WHERE lp.pedido_id = ? " +
                    "ORDER BY lp.id";

    // Consultas para RESTAURANTE
    public static final String RESTAURANTE_FIND_ALL =
            "SELECT id, nombre, direccion, codigo_postal, latitud, longitud, telefono, horario_apertura, horario_cierre, capacidad " +
                    "FROM restaurante " +
                    "ORDER BY nombre";

    public static final String RESTAURANTE_FIND_BY_ID =
            "SELECT id, nombre, direccion, codigo_postal, latitud, longitud, telefono, horario_apertura, horario_cierre, capacidad " +
                    "FROM restaurante " +
                    "WHERE id = ?";

    public static final String RESTAURANTE_FIND_BY_CP =
            "SELECT id, nombre, direccion, codigo_postal, latitud, longitud, telefono, horario_apertura, horario_cierre, capacidad " +
                    "FROM restaurante " +
                    "WHERE codigo_postal LIKE ? " +
                    "ORDER BY nombre";

    public static final String RESTAURANTE_INSERT =
            "INSERT INTO restaurante (nombre, direccion, codigo_postal, latitud, longitud, telefono, horario_apertura, horario_cierre, capacidad) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

    public static final String RESTAURANTE_UPDATE =
            "UPDATE restaurante SET nombre = ?, direccion = ?, codigo_postal = ?, latitud = ?, longitud = ?, " +
                    "telefono = ?, horario_apertura = ?, horario_cierre = ?, capacidad = ? " +
                    "WHERE id = ?";

    public static final String RESTAURANTE_DELETE =
            "DELETE FROM restaurante WHERE id = ?";

    // Consultas para RESERVA
    public static final String RESERVA_INSERT =
            "INSERT INTO reserva (usuario_id, restaurante_id, fecha, hora, personas, estado, comentarios) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id";

    public static final String RESERVA_FIND_BY_USUARIO =
            "SELECT r.id, r.usuario_id, r.restaurante_id, r.fecha, r.hora, r.personas, r.estado, r.comentarios, " +
                    "rest.nombre as restaurante_nombre " +
                    "FROM reserva r " +
                    "JOIN restaurante rest ON r.restaurante_id = rest.id " +
                    "WHERE r.usuario_id = ? " +
                    "ORDER BY r.fecha DESC, r.hora DESC";

    public static final String RESERVA_FIND_BY_RESTAURANTE =
            "SELECT r.id, r.usuario_id, r.restaurante_id, r.fecha, r.hora, r.personas, r.estado, r.comentarios, " +
                    "u.nombre as usuario_nombre, u.email as usuario_email " +
                    "FROM reserva r " +
                    "JOIN usuario u ON r.usuario_id = u.id " +
                    "WHERE r.restaurante_id = ? " +
                    "ORDER BY r.fecha, r.hora";

    public static final String RESERVA_FIND_BY_ID =
            "SELECT r.id, r.usuario_id, r.restaurante_id, r.fecha, r.hora, r.personas, r.estado, r.comentarios, " +
                    "rest.nombre as restaurante_nombre, u.nombre as usuario_nombre " +
                    "FROM reserva r " +
                    "JOIN restaurante rest ON r.restaurante_id = rest.id " +
                    "JOIN usuario u ON r.usuario_id = u.id " +
                    "WHERE r.id = ?";

    public static final String RESERVA_UPDATE_ESTADO =
            "UPDATE reserva SET estado = ? WHERE id = ?";

    public static final String RESERVA_DELETE =
            "DELETE FROM reserva WHERE id = ?";

    public static final String RESERVA_COUNT_POR_HORA =
            "SELECT COUNT(*) FROM reserva WHERE restaurante_id = ? AND fecha = ? AND hora = ? AND estado != 'cancelada'";

    // Consultas para RESEÑA
    public static final String RESENA_INSERT =
            "INSERT INTO resena (usuario_id, restaurante_id, puntuacion, comentario) " +
                    "VALUES (?, ?, ?, ?) RETURNING id";

    public static final String RESENA_FIND_BY_RESTAURANTE =
            "SELECT r.id, r.usuario_id, r.restaurante_id, r.puntuacion, r.comentario, r.fecha_creacion, " +
                    "u.nombre as usuario_nombre " +
                    "FROM resena r " +
                    "JOIN usuario u ON r.usuario_id = u.id " +
                    "WHERE r.restaurante_id = ? " +
                    "ORDER BY r.fecha_creacion DESC";

    public static final String RESENA_FIND_BY_USUARIO =
            "SELECT r.id, r.usuario_id, r.restaurante_id, r.puntuacion, r.comentario, r.fecha_creacion, " +
                    "rest.nombre as restaurante_nombre " +
                    "FROM resena r " +
                    "JOIN restaurante rest ON r.restaurante_id = rest.id " +
                    "WHERE r.usuario_id = ? " +
                    "ORDER BY r.fecha_creacion DESC";

    public static final String RESENA_DELETE =
            "DELETE FROM resena WHERE id = ?";

    public static final String RESENA_AVG_PUNTUACION =
            "SELECT AVG(puntuacion) FROM resena WHERE restaurante_id = ?";

    public static final String RESENA_COUNT_BY_RESTAURANTE =
            "SELECT COUNT(*) FROM resena WHERE restaurante_id = ?";

    // Consultas para DISPONIBILIDAD
    public static final String DISPONIBILIDAD_SLOTS =
            "SELECT hora, " +
                    "(capacidad - COALESCE(SUM(personas), 0)) as mesas_disponibles " +
                    "FROM generate_series('10:00'::time, '22:00'::time, '30 minutes'::interval) AS hora " +
                    "LEFT JOIN restaurante ON id = ? " +
                    "LEFT JOIN reserva ON reserva.restaurante_id = ? AND " +
                    "                     reserva.fecha = ? AND " +
                    "                     reserva.hora = hora AND " +
                    "                     reserva.estado != 'cancelada' " +
                    "GROUP BY hora, capacidad " +
                    "ORDER BY hora";

    // Consultas para FOODTRUCK
    public static final String FOODTRUCK_FIND_ALL =
            "SELECT id, nombre, ciudad, fecha_evento, hora_inicio, hora_fin, descripcion, imagen " +
                    "FROM foodtruck " +
                    "ORDER BY fecha_evento, hora_inicio";

    public static final String FOODTRUCK_FIND_BY_ID =
            "SELECT id, nombre, ciudad, fecha_evento, hora_inicio, hora_fin, descripcion, imagen " +
                    "FROM foodtruck " +
                    "WHERE id = ?";

    public static final String FOODTRUCK_INSERT =
            "INSERT INTO foodtruck (nombre, ciudad, fecha_evento, hora_inicio, hora_fin, descripcion, imagen) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id";

    public static final String FOODTRUCK_UPDATE =
            "UPDATE foodtruck SET nombre = ?, ciudad = ?, fecha_evento = ?, hora_inicio = ?, " +
                    "hora_fin = ?, descripcion = ?, imagen = ? " +
                    "WHERE id = ?";

    public static final String FOODTRUCK_DELETE =
            "DELETE FROM foodtruck WHERE id = ?";

    public static final String FOODTRUCK_FIND_PROXIMOS =
            "SELECT id, nombre, ciudad, fecha_evento, hora_inicio, hora_fin, descripcion, imagen " +
                    "FROM foodtruck " +
                    "WHERE fecha_evento >= CURRENT_DATE " +
                    "ORDER BY fecha_evento, hora_inicio " +
                    "LIMIT 4";
}