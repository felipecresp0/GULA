package com.gulaburger.utils;

import com.gulaburger.models.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Utilidad para manejar JSON Web Tokens (JWT)
 */
public class JWTUtil {

    private static final Logger LOGGER = Logger.getLogger(JWTUtil.class.getName());

    // Clave secreta para firmar el token (debe ser larga y segura)
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    // Tiempo de expiración del token (24 horas en milisegundos)
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    private JWTUtil() {
        // Constructor privado para evitar instanciación
    }

    /**
     * Genera un token JWT para un usuario
     *
     * @param usuario Usuario para el que se genera el token
     * @return Token JWT
     */
    public static String generarToken(Usuario usuario) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_TIME);

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", usuario.getId());
        claims.put("nombre", usuario.getNombre());
        claims.put("email", usuario.getEmail());
        claims.put("rol", usuario.getRol());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(SECRET_KEY)
                .compact();
    }

    /**
     * Valida un token JWT y retorna los claims
     *
     * @param token Token JWT a validar
     * @return Claims del token (null si el token es inválido)
     */
    public static Claims validarToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (ExpiredJwtException ex) {
            LOGGER.log(Level.INFO, "Token expirado: {0}", ex.getMessage());
        } catch (Exception ex) {
            LOGGER.log(Level.WARNING, "Error al validar token: {0}", ex.getMessage());
        }

        return null;
    }

    /**
     * Extrae el ID de usuario de un token JWT
     *
     * @param token Token JWT
     * @return ID del usuario o -1 si el token es inválido
     */
    public static int extraerUsuarioId(String token) {
        Claims claims = validarToken(token);

        if (claims != null) {
            return claims.get("id", Integer.class);
        }

        return -1;
    }

    /**
     * Extrae el rol de usuario de un token JWT
     *
     * @param token Token JWT
     * @return Rol del usuario o null si el token es inválido
     */
    public static String extraerUsuarioRol(String token) {
        Claims claims = validarToken(token);

        if (claims != null) {
            return claims.get("rol", String.class);
        }

        return null;
    }

    /**
     * Extrae el email de usuario de un token JWT
     *
     * @param token Token JWT
     * @return Email del usuario o null si el token es inválido
     */
    public static String extraerUsuarioEmail(String token) {
        Claims claims = validarToken(token);

        if (claims != null) {
            return claims.getSubject();
        }

        return null;
    }

    /**
     * Verifica si un token es válido
     *
     * @param token Token JWT a verificar
     * @return true si el token es válido, false en caso contrario
     */
    public static boolean isTokenValido(String token) {
        return validarToken(token) != null;
    }
}