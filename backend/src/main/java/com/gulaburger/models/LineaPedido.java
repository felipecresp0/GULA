package com.gulaburger.models;

/**
 * Clase modelo para LineaPedido
 */
public class LineaPedido {

    private int id;
    private int pedidoId;
    private int productoId;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;

    // Datos adicionales para mostrar
    private String productoNombre;
    private String productoDescripcion;
    private String productoImagen;

    /**
     * Constructor por defecto
     */
    public LineaPedido() {
    }

    /**
     * Constructor completo
     *
     * @param id ID de la línea de pedido
     * @param pedidoId ID del pedido al que pertenece
     * @param productoId ID del producto
     * @param cantidad Cantidad del producto
     * @param precioUnitario Precio unitario del producto
     * @param subtotal Subtotal de la línea (precioUnitario * cantidad)
     */
    public LineaPedido(int id, int pedidoId, int productoId, int cantidad,
                       double precioUnitario, double subtotal) {
        this.id = id;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    /**
     * Constructor para crear una nueva línea de pedido (sin ID)
     *
     * @param pedidoId ID del pedido al que pertenece
     * @param productoId ID del producto
     * @param cantidad Cantidad del producto
     * @param precioUnitario Precio unitario del producto
     */
    public LineaPedido(int pedidoId, int productoId, int cantidad, double precioUnitario) {
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = precioUnitario * cantidad;
    }

    /**
     * Constructor completo con información del producto
     *
     * @param id ID de la línea de pedido
     * @param pedidoId ID del pedido al que pertenece
     * @param productoId ID del producto
     * @param cantidad Cantidad del producto
     * @param precioUnitario Precio unitario del producto
     * @param subtotal Subtotal de la línea (precioUnitario * cantidad)
     * @param productoNombre Nombre del producto
     * @param productoDescripcion Descripción del producto
     * @param productoImagen URL de la imagen del producto
     */
    public LineaPedido(int id, int pedidoId, int productoId, int cantidad,
                       double precioUnitario, double subtotal, String productoNombre,
                       String productoDescripcion, String productoImagen) {
        this.id = id;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.productoNombre = productoNombre;
        this.productoDescripcion = productoDescripcion;
        this.productoImagen = productoImagen;
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
     * @return el id del pedido
     */
    public int getPedidoId() {
        return pedidoId;
    }

    /**
     * @param pedidoId el id del pedido a establecer
     */
    public void setPedidoId(int pedidoId) {
        this.pedidoId = pedidoId;
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
        // Actualizar el subtotal
        this.subtotal = this.precioUnitario * this.cantidad;
    }

    /**
     * @return el precio unitario
     */
    public double getPrecioUnitario() {
        return precioUnitario;
    }

    /**
     * @param precioUnitario el precio unitario a establecer
     */
    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
        // Actualizar el subtotal
        this.subtotal = this.precioUnitario * this.cantidad;
    }

    /**
     * @return el subtotal
     */
    public double getSubtotal() {
        return subtotal;
    }

    /**
     * @param subtotal el subtotal a establecer
     */
    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    /**
     * @return el nombre del producto
     */
    public String getProductoNombre() {
        return productoNombre;
    }

    /**
     * @param productoNombre el nombre del producto a establecer
     */
    public void setProductoNombre(String productoNombre) {
        this.productoNombre = productoNombre;
    }

    /**
     * @return la descripción del producto
     */
    public String getProductoDescripcion() {
        return productoDescripcion;
    }

    /**
     * @param productoDescripcion la descripción del producto a establecer
     */
    public void setProductoDescripcion(String productoDescripcion) {
        this.productoDescripcion = productoDescripcion;
    }

    /**
     * @return la URL de la imagen del producto
     */
    public String getProductoImagen() {
        return productoImagen;
    }

    /**
     * @param productoImagen la URL de la imagen del producto a establecer
     */
    public void setProductoImagen(String productoImagen) {
        this.productoImagen = productoImagen;
    }

    /**
     * Calcula el subtotal (precioUnitario * cantidad)
     */
    public void calcularSubtotal() {
        this.subtotal = this.precioUnitario * this.cantidad;
    }

    @Override
    public String toString() {
        return "LineaPedido{" + "id=" + id + ", pedidoId=" + pedidoId +
                ", productoId=" + productoId + ", cantidad=" + cantidad +
                ", precioUnitario=" + precioUnitario + ", subtotal=" + subtotal +
                ", productoNombre=" + productoNombre + '}';
    }
}