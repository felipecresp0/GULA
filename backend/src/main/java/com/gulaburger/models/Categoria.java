package com.gulaburger.models;

/**
 * Clase modelo para Categoria
 */
public class Categoria {

    private int id;
    private String nombre;
    private String descripcion;

    /**
     * Constructor por defecto
     */
    public Categoria() {
    }

    /**
     * Constructor completo
     *
     * @param id ID de la categoría
     * @param nombre Nombre de la categoría
     * @param descripcion Descripción de la categoría
     */
    public Categoria(int id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    /**
     * Constructor para crear una nueva categoría (sin ID)
     *
     * @param nombre Nombre de la categoría
     * @param descripcion Descripción de la categoría
     */
    public Categoria(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
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
     * @return la descripción
     */
    public String getDescripcion() {
        return descripcion;
    }

    /**
     * @param descripcion la descripción a establecer
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @Override
    public String toString() {
        return "Categoria{" + "id=" + id + ", nombre=" + nombre + ", descripcion=" + descripcion + '}';
    }
}