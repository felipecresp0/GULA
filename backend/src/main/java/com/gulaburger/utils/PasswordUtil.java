package com.gulaburger.utils;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.Base64;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * Utilidad para manejar contraseñas (encriptación y verificación)
 */
public class PasswordUtil {

    private static final Logger LOGGER = Logger.getLogger(PasswordUtil.class.getName());

    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";

    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordUtil() {
        // Constructor privado para evitar instanciación
    }

    /**
     * Genera un hash seguro para una contraseña
     *
     * @param password Contraseña en texto plano
     * @return String con el hash+salt en formato Base64
     */
    public static String hashPassword(String password) {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);

        byte[] hash = pbkdf2(password.toCharArray(), salt);

        // Combinar salt y hash para almacenar
        byte[] combined = new byte[salt.length + hash.length];
        System.arraycopy(salt, 0, combined, 0, salt.length);
        System.arraycopy(hash, 0, combined, salt.length, hash.length);

        return Base64.getEncoder().encodeToString(combined);
    }

    /**
     * Verifica si una contraseña coincide con un hash almacenado
     *
     * @param password Contraseña en texto plano a verificar
     * @param storedHash Hash almacenado (salt+hash en Base64)
     * @return true si la contraseña coincide, false en caso contrario
     */
    public static boolean verifyPassword(String password, String storedHash) {
        try {
            // Decodificar el hash almacenado
            byte[] combined = Base64.getDecoder().decode(storedHash);

            // Extraer salt (primeros 16 bytes)
            byte[] salt = Arrays.copyOfRange(combined, 0, 16);
            byte[] hashGuardado = Arrays.copyOfRange(combined, 16, combined.length);

            // Calcular hash de la contraseña proporcionada
            byte[] hashCalculado = pbkdf2(password.toCharArray(), salt);

            // Comparar los hashes
            return Arrays.equals(hashGuardado, hashCalculado);

        } catch (IllegalArgumentException e) {
            LOGGER.log(Level.SEVERE, "Error al verificar contraseña: hash almacenado inválido", e);
            return false;
        }
    }

    /**
     * Implementación de PBKDF2 para generar un hash seguro
     *
     * @param password Caracteres de la contraseña
     * @param salt Salt para agregar seguridad
     * @return Hash calculado
     */
    private static byte[] pbkdf2(char[] password, byte[] salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password, salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory skf = SecretKeyFactory.getInstance(ALGORITHM);
            return skf.generateSecret(spec).getEncoded();

        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            LOGGER.log(Level.SEVERE, "Error en algoritmo de hash de contraseña", e);
            throw new RuntimeException("Error al generar hash de contraseña", e);
        }
    }
}