package com.gulaburger.models;

/**
 * Clase modelo para Restaurante
 */
public class Restaurante {

    private int id;
    private String nombre;
    private String direccion;
    private String codigoPostal;
    private double latitud;
    private double longitud;
    private String telefono;
    private String horarioApertura;
    private String horarioCierre;
    private int capacidad;

    // Campos adicionales para mostrar
    private double valoracion;
    private int totalResenas;
    private String[] fotos;

    /**
     * Constructor por defecto
     */
    public Restaurante() {
    }

    /**
     * Constructor completo
     *
     * @param id ID del restaurante
     * @param nombre Nombre del restaurante
     * @param direccion Dirección del restaurante
     * @param codigoPostal Código postal
     * @param latitud Latitud para geolocalización
     * @param longitud Longitud para geolocalización
     * @param telefono Teléfono de contacto
     * @param horarioApertura Hora de apertura
     * @param horarioCierre Hora de cierre
     * @param capacidad Capacidad (mesas disponibles)
     */
    public Restaurante(int id, String nombre, String direccion, String codigoPostal,
                       double latitud, double longitud, String telefono,
                       String horarioApertura, String horarioCierre, int capacidad) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.latitud = latitud;
        this.longitud = longitud;
        this.telefono = telefono;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
        this.capacidad = capacidad;
    }

    /**
     * Constructor para crear un nuevo restaurante (sin ID)
     *
     * @param nombre Nombre del restaurante
     * @param direccion Dirección del restaurante
     * @param codigoPostal Código postal
     * @param latitud Latitud para geolocalización
     * @param longitud Longitud para geolocalización
     * @param telefono Teléfono de contacto
     * @param horarioApertura Hora de apertura
     * @param horarioCierre Hora de cierre
     * @param capacidad Capacidad (mesas disponibles)
     */
    public Restaurante(String nombre, String direccion, String codigoPostal,
                       double latitud, double longitud, String telefono,
                       String horarioApertura, String horarioCierre, int capacidad) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.latitud = latitud;
        this.longitud = longitud;
        this.telefono = telefono;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
        this.capacidad = capacidad;
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
     * @return el nombre
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * @param nombre el nombre a establecer
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * @return la dirección
     */
    public String getDireccion() {
        return direccion;
    }

    /**
     * @param direccion la dirección a establecer
     */
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    /**
     * @return el código postal
     */
    public String getCodigoPostal() {
        return codigoPostal;
    }

    /**
     * @param codigoPostal el código postal a establecer
     */
    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    /**
     * @return la latitud
     */
    public double getLatitud() {
        return latitud;
    }

    /**
     * @param latitud la latitud a establecer
     */
    public void setLatitud(double latitud) {
        this.latitud = latitud;
    }

    /**
     * @return la longitud
     */
    public double getLongitud() {
        return longitud;
    }

    /**
     * @param longitud la longitud a establecer
     */
    public void setLongitud(double longitud) {
        this.longitud = longitud;
    }

    /**
     * @return el teléfono
     */
    public String getTelefono() {
        return telefono;
    }

    /**
     * @param telefono el teléfono a establecer
     */
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    /**
     * @return el horario de apertura
     */
    public String getHorarioApertura() {
        return horarioApertura;
    }

    /**
     * @param horarioApertura el horario de apertura a establecer
     */
    public void setHorarioApertura(String horarioApertura) {
        this.horarioApertura = horarioApertura;
    }

    /**
     * @return el horario de cierre
     */
    public String getHorarioCierre() {
        return horarioCierre;
    }

    /**
     * @param horarioCierre el horario de cierre a establecer
     */
    public void setHorarioCierre(String horarioCierre) {
        this.horarioCierre = horarioCierre;
    }

    /**
     * @return la capacidad
     */
    public int getCapacidad() {
        return capacidad;
    }

    /**
     * @param capacidad la capacidad a establecer
     */
    public void setCapacidad(int capacidad) {
        this.capacidad = capacidad;
    }

    /**
     * @return la valoración media
     */
    public double getValoracion() {
        return valoracion;
    }

    /**
     * @param valoracion la valoración media a establecer
     */
    public void setValoracion(double valoracion) {
        this.valoracion = valoracion;
    }

    /**
     * @return el total de reseñas
     */
    public int getTotalResenas() {
        return totalResenas;
    }

    /**
     * @param totalResenas el total de reseñas a establecer
     */
    public void setTotalResenas(int totalResenas) {
        this.totalResenas = totalResenas;
    }

    /**
     * @return las fotos del restaurante
     */
    public String[] getFotos() {
        return fotos;
    }

    /**
     * @param fotos las fotos del restaurante a establecer
     */
    public void setFotos(String[] fotos) {
        this.fotos = fotos;
    }

    @Override
    public String toString() {
        return "Restaurante{" + "id=" + id + ", nombre=" + nombre +
                ", direccion=" + direccion + ", codigoPostal=" + codigoPostal +
                ", latitud=" + latitud + ", longitud=" + longitud + '}';
    }
}