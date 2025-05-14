package com.gulaburger.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.HashMap;
import java.util.Map;

/**
 * Utilidad para crear respuestas JSON estandarizadas
 */
public class ResponseUtil {

    private static final Gson GSON = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();

    private ResponseUtil() {
        // Constructor privado para evitar instanciación
    }

    /**
     * Crea una respuesta JSON exitosa
     *
     * @param data Datos a incluir en la respuesta
     * @return JSON con la respuesta
     */
    public static String crearRespuestaOK(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("code", 200);
        response.put("data", data);

        return GSON.toJson(response);
    }

    /**
     * Crea una respuesta JSON de error
     *
     * @param mensaje Mensaje de error
     * @param codigo Código HTTP de error
     * @return JSON con la respuesta
     */
    public static String crearRespuestaError(String mensaje, int codigo) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("code", codigo);

        Map<String, String> data = new HashMap<>();
        data.put("mensaje", mensaje);

        response.put("data", data);

        return GSON.toJson(response);
    }

    /**
     * Convierte un mapa a un objeto JSON
     *
     * @param data Mapa de datos
     * @return String JSON
     */
    public static String toJson(Map<String, Object> data) {
        return GSON.toJson(data);
    }

    /**
     * Parsea un string JSON a un mapa
     *
     * @param json String JSON
     * @return Mapa con los datos
     */
    public static Map<String, Object> fromJson(String json) {
        @SuppressWarnings("unchecked")
        Map<String, Object> map = GSON.fromJson(json, Map.class);
        return map;
    }
}