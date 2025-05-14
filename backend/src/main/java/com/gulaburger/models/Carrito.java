package com.gulaburger.models;

import java.util.Date;

/**
 * Clase modelo para Carrito
 */
public class Carrito {

    private int id;
    private int usuarioId;
    private int productoId;
    private int cantidad;
    private Date fechaAgregado;

    // Campos adicionales para mostrar información del producto
    private String nombre;
    private String descripcion;
    private double precio;
    private String imagen;

    /**
     * Constructor por defecto
     */
    public Carrito() {
    }

    /**
     * Constructor para la base de datos
     *
     * @param id ID del item en el carrito
     * @param usuarioId ID del usuario dueño del carrito
     * @param productoId ID del producto en el carrito
     * @param cantidad Cantidad del producto
     * @param fechaAgregado Fecha en que se agregó al carrito
     */
    public Carrito(int id, int usuarioId, int productoId, int cantidad, Date fechaAgregado) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.fechaAgregado = fechaAgregado;
    }

    /**
     * Constructor completo con información del producto
     *
     * @param id ID del item en el carrito
     * @param usuarioId ID del usuario dueño del carrito
     * @param productoId ID del producto en el carrito
     * @param cantidad Cantidad del producto
     * @param fechaAgregado Fecha en que se agregó al carrito
     * @param nombre Nombre del producto
     * @param descripcion Descripción del producto
     * @param precio Precio del producto
     * @param imagen URL de la imagen del producto
     */
    public Carrito(int id, int usuarioId, int productoId, int cantidad, Date fechaAgregado,
                   String nombre, String descripcion, double precio, String imagen) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.fechaAgregado = fechaAgregado;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
    }

    /**
     * Constructor para agregar un producto al carrito (sin ID)
     *
     * @param usuarioId ID del usuario dueño del carrito
     * @param productoId ID del producto en el carrito
     * @param cantidad Cantidad del producto
     */
    public Carrito(int usuarioId, int productoId, int cantidad) {
        this.usuarioId = usuarioId;
        this.productoId = productoId;
        this.cantidad = cantidad;
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
     * @return el id del producto
     */
    public int getProductoId() {
        return productoId;
    }

    /**
     * @param productoId el id del producto a establecer
     */
    public void setProductoId(int productoId) {
        this.productoId = productoId;
    }

    /**
     * @return la cantidad
     */
    public int getCantidad() {
        return cantidad;
    }

    /**
     * @param cantidad la cantidad a establecer
     */
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    /**
     * @return la fecha de agregado
     */
    public Date getFechaAgregado() {
        return fechaAgregado;
    }

    /**
     * @param fechaAgregado la fecha de agregado a establecer
     */
    public void setFechaAgregado(Date fechaAgregado) {
        this.fechaAgregado = fechaAgregado;
    }

    /**
     * @return el nombre del producto
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * @param nombre el nombre del producto a establecer
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * @return la descripción del producto
     */
    public String getDescripcion() {
        return descripcion;
    }

    /**
     * @param descripcion la descripción del producto a establecer
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    /**
     * @return el precio del producto
     */
    public double getPrecio() {
        return precio;
    }

    /**
     * @param precio el precio del producto a establecer
     */
    public void setPrecio(double precio) {
        this.precio = precio;
    }

    /**
     * @return la URL de la imagen del producto
     */
    public String getImagen() {
        return imagen;
    }

    /**
     * @param imagen la URL de la imagen del producto a establecer
     */
    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    /**
     * Calcula el subtotal (precio * cantidad)
     *
     * @return El subtotal del item
     */
    public double getSubtotal() {
        return this.precio * this.cantidad;
    }

    @Override
    public String toString() {
        return "Carrito{" + "id=" + id + ", usuarioId=" + usuarioId + ", productoId=" + productoId +
                ", cantidad=" + cantidad + ", nombre=" + nombre + ", precio=" + precio +
                ", subtotal=" + getSubtotal() + '}';
    }
}