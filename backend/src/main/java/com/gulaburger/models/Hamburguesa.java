package com.gulaburger.models;

import java.util.Arrays;
import java.util.List;

/**
 * Clase modelo para Hamburguesa (extiende de Producto)
 */
public class Hamburguesa extends Producto {

    private List<String> ingredientes;

    /**
     * Constructor por defecto
     */
    public Hamburguesa() {
        super();
        // Categoría 1 = Hamburguesas
        setCategoriaId(1);
    }

    /**
     * Constructor con todos los campos de Producto
     *
     * @param id ID del producto
     * @param nombre Nombre del producto
     * @param descripcion Descripción del producto
     * @param precio Precio del producto
     * @param imagen URL de la imagen del producto
     * @param destacado Indica si es un producto destacado
     * @param categoriaId ID de la categoría a la que pertenece (1 = Hamburguesas)
     * @param categoriaNombre Nombre de la categoría
     */
    public Hamburguesa(int id, String nombre, String descripcion, double precio, String imagen,
                       boolean destacado, int categoriaId, String categoriaNombre) {
        super(id, nombre, descripcion, precio, imagen, destacado, categoriaId, categoriaNombre);
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
     * @param categoriaId ID de la categoría a la que pertenece (1 = Hamburguesas)
     * @param categoriaNombre Nombre de la categoría
     * @param ingredientes Lista de ingredientes de la hamburguesa
     */
    public Hamburguesa(int id, String nombre, String descripcion, double precio, String imagen,
                       boolean destacado, int categoriaId, String categoriaNombre, List<String> ingredientes) {
        super(id, nombre, descripcion, precio, imagen, destacado, categoriaId, categoriaNombre);
        this.ingredientes = ingredientes;
    }

    /**
     * Constructor para crear una nueva hamburguesa (sin ID)
     *
     * @param nombre Nombre del producto
     * @param descripcion Descripción del producto
     * @param precio Precio del producto
     * @param imagen URL de la imagen del producto
     * @param destacado Indica si es un producto destacado
     * @param ingredientes Lista de ingredientes de la hamburguesa
     */
    public Hamburguesa(String nombre, String descripcion, double precio, String imagen,
                       boolean destacado, List<String> ingredientes) {
        super(nombre, descripcion, precio, imagen, destacado, 1); // 1 = Categoría Hamburguesas
        this.ingredientes = ingredientes;
    }

    /**
     * @return los ingredientes
     */
    public List<String> getIngredientes() {
        return ingredientes;
    }

    /**
     * @param ingredientes los ingredientes a establecer
     */
    public void setIngredientes(List<String> ingredientes) {
        this.ingredientes = ingredientes;
    }

    /**
     * Convierte un array de strings a lista de ingredientes
     *
     * @param ingredientesArray Array de ingredientes
     */
    public void setIngredientesFromArray(String[] ingredientesArray) {
        this.ingredientes = Arrays.asList(ingredientesArray);
    }

    @Override
    public String toString() {
        return "Hamburguesa{" + "id=" + getId() + ", nombre=" + getNombre() +
                ", precio=" + getPrecio() + ", ingredientes=" + ingredientes + '}';
    }
}