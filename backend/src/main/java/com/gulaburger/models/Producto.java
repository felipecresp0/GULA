package com.gulaburger.models;

/**
 * Clase modelo base para Producto
 */
public class Producto {

    private int id;
    private String nombre;
    private String descripcion;
    private double precio;
    private String imagen;
    private boolean destacado;
    private int categoriaId;
    private String categoriaNombre;

    /**
     * Constructor por defecto
     */
    public Producto() {
    }

    /**
     * Constructor con todos los campos
     *
     * @param id ID del producto
     * @param nombre Nombre del producto
     * @param descripcion Descripción del producto
     * @param precio Precio del producto
     * @param imagen URL de la imagen del producto
     * @param destacado Indica si es un producto destacado
     * @param categoriaId ID de la categoría a la que pertenece
     * @param categoriaNombre Nombre de la categoría
     */
    public Producto(int id, String nombre, String descripcion, double precio, String imagen,
                    boolean destacado, int categoriaId, String categoriaNombre) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.destacado = destacado;
        this.categoriaId = categoriaId;
        this.categoriaNombre = categoriaNombre;
    }

    /**
     * Constructor para crear un nuevo producto (sin ID)
     *
     * @param nombre Nombre del producto
     * @param descripcion Descripción del producto
     * @param precio Precio del producto
     * @param imagen URL de la imagen del producto
     * @param destacado Indica si es un producto destacado
     * @param categoriaId ID de la categoría a la que pertenece
     */
    public Producto(String nombre, String descripcion, double precio, String imagen,
                    boolean destacado, int categoriaId) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.destacado = destacado;
        this.categoriaId = categoriaId;
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

    /**
     * @return el precio
     */
    public double getPrecio() {
        return precio;
    }

    /**
     * @param precio el precio a establecer
     */
    public void setPrecio(double precio) {
        this.precio = precio;
    }

    /**
     * @return la imagen
     */
    public String getImagen() {
        return imagen;
    }

    /**
     * @param imagen la imagen a establecer
     */
    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    /**
     * @return si es destacado
     */
    public boolean isDestacado() {
        return destacado;
    }

    /**
     * @param destacado el destacado a establecer
     */
    public void setDestacado(boolean destacado) {
        this.destacado = destacado;
    }

    /**
     * @return el id de categoría
     */
    public int getCategoriaId() {
        return categoriaId;
    }

    /**
     * @param categoriaId el id de categoría a establecer
     */
    public void setCategoriaId(int categoriaId) {
        this.categoriaId = categoriaId;
    }

    /**
     * @return el nombre de categoría
     */
    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    /**
     * @param categoriaNombre el nombre de categoría a establecer
     */
    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }

    @Override
    public String toString() {
        return "Producto{" + "id=" + id + ", nombre=" + nombre + ", precio=" + precio +
                ", categoriaId=" + categoriaId + ", categoriaNombre=" + categoriaNombre + '}';
    }
}