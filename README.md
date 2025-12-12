# 🎨 Marketplace Artesanal - Equipo K

Plataforma Fullstack MERN para la compra-venta de artesanías locales, desplegada en Oracle Cloud Infrastructure (OCI) con configuración de DNS propia.

## 🚀 Demo en Vivo
🌐 **URL:** [http://marketplacek.jcarlos19.com](http://marketplacek.jcarlos19.com)
*(Infraestructura propia con servidor de nombres Bind9)*

## 🛠️ Stack Tecnológico
* **Frontend:** React 18, Redux Toolkit (Manejo de estado global: Auth y Carrito).
* **Backend:** Node.js, Express, JWT (Autenticación).
* **Base de Datos:** MongoDB Atlas (Relaciones Usuario-Producto-Orden).
* **Infraestructura:** Oracle Cloud VM (Ubuntu 24.04).
* **DevOps:** Nginx (Reverse Proxy), PM2 (Process Manager), Bind9 (DNS Server).
* **Testing:** Jest & Supertest.

## ✨ Funcionalidades Clave

### 1. Roles de Usuario (ACL)
El sistema diferencia entre dos tipos de usuarios:
* **Vendedores:** Pueden publicar (`POST`), editar (`PUT`) y eliminar (`DELETE`) sus propias artesanías.
* **Compradores:** Tienen acceso exclusivo al Carrito de Compras y creación de Órdenes.

### 2. Infraestructura DNS (Bind9)
El proyecto no utiliza un dominio pre-configurado. Se implementó un **Servidor DNS Autoritativo** en la misma instancia de OCI utilizando **Bind9**, gestionando la zona `marketplacek.jcarlos19.com` y resolviendo peticiones DNS (Puerto 53 UDP/TCP) a través del firewall de Oracle.

### 3. Flujo de Compra
Implementación de lógica de negocio para:
* Gestión de estado del carrito en Frontend (Persistencia en LocalStorage).
* Generación de Órdenes de Compra en Backend vinculadas al usuario.

## 📦 Instalación

### Variables de Entorno (.env)



