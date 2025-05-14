package com.gulaburger.models;

import java.util.Date;

/**
 * Clase modelo para Resena (Reseña/Valoración)
 */
public class Resena {

    private int id;
    private int usuarioId;
    private int restauranteId;
    private int puntuacion;
    private String comentario;
    private Date fechaCreacion;

    // Campos adicionales para mostrar
    private String usuarioNombre;
    private String restauranteNombre;

    /**
     * Constructor por defecto
     */
    public Resena() {
    }

    /**
     * Constructor completo
     *
     * @param id ID de la reseña
     * @param usuarioId ID del usuario que hace la reseña
     * @param restauranteId ID del restaurante reseñado
     * @param puntuacion Puntuación (1-5 estrellas)
     * @param comentario Comentario de la reseña
     * @param fechaCreacion Fecha de creación
     */
    public Resena(int id, int usuarioId, int restauranteId, int puntuacion,
                  String comentario, Date fechaCreacion) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.restauranteId = restauranteId;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fechaCreacion = fechaCreacion;
    }

    /**
     * Constructor para crear una nueva reseña (sin ID)
     *
     * @param usuarioId ID del usuario que hace la reseña
     * @param restauranteId ID del restaurante reseñado
     * @param puntuacion Puntuación (1-5 estrellas)
     * @param comentario Comentario de la reseña
     */
    public Resena(int usuarioId, int restauranteId, int puntuacion, String comentario) {
        this.usuarioId = usuarioId;
        this.restauranteId = restauranteId;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
    }

    /**
     * Constructor completo con datos adicionales
     *
     * @param id ID de la reseña
     * @param usuarioId ID del usuario que hace la reseña
     * @param restauranteId ID del restaurante reseñado
     * @param puntuacion Puntuación (1-5 estrellas)
     * @param comentario Comentario de la reseña
     * @param fechaCreacion Fecha de creación
     * @param usuarioNombre Nombre del usuario
     * @param restauranteNombre Nombre del restaurante
     */
    public Resena(int id, int usuarioId, int restauranteId, int puntuacion,
                  String comentario, Date fechaCreacion, String usuarioNombre,
                  String restauranteNombre) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.restauranteId = restauranteId;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fechaCreacion = fechaCreacion;
        this.usuarioNombre = usuarioNombre;
        this.restauranteNombre = restauranteNombre;
    }

    /**
     * @return el id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id el id a establecer
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return el id del usuario
     */
    public int getUsuarioId() {
        return usuarioId;
    }

    /**
     * @param usuarioId el id del usuario a establecer
     */
    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    /**
     * @return el id del restaurante
     */
    public int getRestauranteId() {
        return restauranteId;
    }

    /**
     * @param restauranteId el id del restaurante a establecer
     */
    public void setRestauranteId(int restauranteId) {
        this.restauranteId = restauranteId;
    }

    /**
     * @return la puntuación
     */
    public int getPuntuacion() {
        return puntuacion;
    }

    /**
     * @param puntuacion la puntuación a establecer
     */
    public void setPuntuacion(int puntuacion) {
        // Validar rango 1-5
        if (puntuacion < 1) {
            this.puntuacion = 1;
        } else if (puntuacion > 5) {
            this.puntuacion = 5;
        } else {
            this.puntuacion = puntuacion;
        }
    }

    /**
     * @return el comentario
     */
    public String getComentario() {
        return comentario;
    }

    /**
     * @param comentario el comentario a establecer
     */
    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    /**
     * @return la fecha de creación
     */
    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    /**
     * @param fechaCreacion la fecha de creación a establecer
     */
    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    /**
     * @return el nombre del usuario
     */
    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    /**
     * @param usuarioNombre el nombre del usuario a establecer
     */
    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    /**
     * @return el nombre del restaurante
     */
    public String getRestauranteNombre() {
        return restauranteNombre;
    }

    /**
     * @param restauranteNombre el nombre del restaurante a establecer
     */
    public void setRestauranteNombre(String restauranteNombre) {
        this.restauranteNombre = restauranteNombre;
    }

    @Override
    public String toString() {
        return "Resena{" + "id=" + id + ", usuarioId=" + usuarioId +
                ", restauranteId=" + restauranteId + ", puntuacion=" + puntuacion +
                ", fechaCreacion=" + fechaCreacion + ", usuarioNombre=" + usuarioNombre + '}';
    }
}