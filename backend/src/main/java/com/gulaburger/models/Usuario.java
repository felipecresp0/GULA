package com.gulaburger.models;

import java.util.Date;

/**
 * Clase modelo para Usuario
 */
public class Usuario {

    private int id;
    private String nombre;
    private String email;
    private String contrasena;
    private String rol;
    private Date fechaRegistro;

    /**
     * Constructor por defecto
     */
    public Usuario() {
    }

    /**
     * Constructor con todos los campos
     *
     * @param id ID del usuario
     * @param nombre Nombre completo del usuario
     * @param email Email del usuario (único)
     * @param contrasena Contraseña del usuario (encriptada)
     * @param rol Rol del usuario (cliente, admin, empleado)
     * @param fechaRegistro Fecha de registro del usuario
     */
    public Usuario(int id, String nombre, String email, String contrasena, String rol, Date fechaRegistro) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
    }

    /**
     * Constructor para crear un nuevo usuario (sin ID ni fecha)
     *
     * @param nombre Nombre completo del usuario
     * @param email Email del usuario (único)
     * @param contrasena Contraseña del usuario (sin encriptar)
     * @param rol Rol del usuario (cliente, admin, empleado)
     */
    public Usuario(String nombre, String email, String contrasena, String rol) {
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
        this.rol = rol;
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
     * @return el email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email el email a establecer
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return la contraseña (encriptada)
     */
    public String getContrasena() {
        return contrasena;
    }

    /**
     * @param contrasena la contraseña a establecer
     */
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    /**
     * @return el rol
     */
    public String getRol() {
        return rol;
    }

    /**
     * @param rol el rol a establecer
     */
    public void setRol(String rol) {
        this.rol = rol;
    }

    /**
     * @return la fecha de registro
     */
    public Date getFechaRegistro() {
        return fechaRegistro;
    }

    /**
     * @param fechaRegistro la fecha de registro a establecer
     */
    public void setFechaRegistro(Date fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    /**
     * Versión segura del usuario para devolver al cliente (sin contraseña)
     *
     * @return Un nuevo objeto Usuario sin la contraseña
     */
    public Usuario getUsuarioSeguro() {
        Usuario seguro = new Usuario();
        seguro.setId(this.id);
        seguro.setNombre(this.nombre);
        seguro.setEmail(this.email);
        seguro.setRol(this.rol);
        seguro.setFechaRegistro(this.fechaRegistro);
        return seguro;
    }

    @Override
    public String toString() {
        return "Usuario{" + "id=" + id + ", nombre=" + nombre + ", email=" + email + ", rol=" + rol + '}';
    }
}