package com.gulaburger.models;

import java.util.Date;

/**
 * Clase modelo para Reserva
 */
public class Reserva {

    private int id;
    private int usuarioId;
    private int restauranteId;
    private Date fecha;
    private String hora;
    private int personas;
    private String estado;
    private String comentarios;

    // Campos adicionales para mostrar
    private String restauranteNombre;
    private String usuarioNombre;
    private String usuarioEmail;

    /**
     * Constructor por defecto
     */
    public Reserva() {
    }

    /**
     * Constructor completo
     *
     * @param id ID de la reserva
     * @param usuarioId ID del usuario que hace la reserva
     * @param restauranteId ID del restaurante
     * @param fecha Fecha de la reserva
     * @param hora Hora de la reserva
     * @param personas Número de personas
     * @param estado Estado de la reserva (confirmada, pendiente, cancelada)
     * @param comentarios Comentarios adicionales
     */
    public Reserva(int id, int usuarioId, int restauranteId, Date fecha, String hora,
                   int personas, String estado, String comentarios) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.restauranteId = restauranteId;
        this.fecha = fecha;
        this.hora = hora;
        this.personas = personas;
        this.estado = estado;
        this.comentarios = comentarios;
    }

    /**
     * Constructor para crear una nueva reserva (sin ID)
     *
     * @param usuarioId ID del usuario que hace la reserva
     * @param restauranteId ID del restaurante
     * @param fecha Fecha de la reserva
     * @param hora Hora de la reserva
     * @param personas Número de personas
     * @param comentarios Comentarios adicionales
     */
    public Reserva(int usuarioId, int restauranteId, Date fecha, String hora,
                   int personas, String comentarios) {
        this.usuarioId = usuarioId;
        this.restauranteId = restauranteId;
        this.fecha = fecha;
        this.hora = hora;
        this.personas = personas;
        this.estado = "confirmada"; // Estado por defecto
        this.comentarios = comentarios;
    }

    /**
     * Constructor completo con datos adicionales
     *
     * @param id ID de la reserva
     * @param usuarioId ID del usuario que hace la reserva
     * @param restauranteId ID del restaurante
     * @param fecha Fecha de la reserva
     * @param hora Hora de la reserva
     * @param personas Número de personas
     * @param estado Estado de la reserva (confirmada, pendiente, cancelada)
     * @param comentarios Comentarios adicionales
     * @param restauranteNombre Nombre del restaurante
     * @param usuarioNombre Nombre del usuario
     */
    public Reserva(int id, int usuarioId, int restauranteId, Date fecha, String hora,
                   int personas, String estado, String comentarios,
                   String restauranteNombre, String usuarioNombre) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.restauranteId = restauranteId;
        this.fecha = fecha;
        this.hora = hora;
        this.personas = personas;
        this.estado = estado;
        this.comentarios = comentarios;
        this.restauranteNombre = restauranteNombre;
        this.usuarioNombre = usuarioNombre;
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
     * @return la fecha de la reserva
     */
    public Date getFecha() {
        return fecha;
    }

    /**
     * @param fecha la fecha de la reserva a establecer
     */
    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    /**
     * @return la hora de la reserva
     */
    public String getHora() {
        return hora;
    }

    /**
     * @param hora la hora de la reserva a establecer
     */
    public void setHora(String hora) {
        this.hora = hora;
    }

    /**
     * @return el número de personas
     */
    public int getPersonas() {
        return personas;
    }

    /**
     * @param personas el número de personas a establecer
     */
    public void setPersonas(int personas) {
        this.personas = personas;
    }

    /**
     * @return el estado de la reserva
     */
    public String getEstado() {
        return estado;
    }

    /**
     * @param estado el estado de la reserva a establecer
     */
    public void setEstado(String estado) {
        this.estado = estado;
    }

    /**
     * @return los comentarios adicionales
     */
    public String getComentarios() {
        return comentarios;
    }

    /**
     * @param comentarios los comentarios adicionales a establecer
     */
    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
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
     * @return el email del usuario
     */
    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    /**
     * @param usuarioEmail el email del usuario a establecer
     */
    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    @Override
    public String toString() {
        return "Reserva{" + "id=" + id + ", usuarioId=" + usuarioId +
                ", restauranteId=" + restauranteId + ", fecha=" + fecha +
                ", hora=" + hora + ", personas=" + personas +
                ", estado=" + estado + '}';
    }
}