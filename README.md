# 🍽️ Sistema de Gestión de Pedidos - Microservicios

Sistema completo de gestión de pedidos basado en arquitectura de microservicios con Docker Compose.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Servicios](#servicios)
- [URLs de Acceso](#urls-de-acceso)
- [Comandos Post-Instalación](#comandos-post-instalación)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## 🏗️ Arquitectura

El sistema está compuesto por los siguientes componentes:

### Microservicios
- **OrdersService** (NestJS) - Gestión de pedidos
- **CatalogoService** (Laravel/PHP) - Catálogo de productos y restaurantes
- **UserService** (Django/Python) - Gestión de usuarios
- **PaymentNotificationsService** (Node.js) - Notificaciones de pago por email
- **Frontend** (React/Vite) - Interfaz de usuario

### Bases de Datos
- **PostgreSQL** - OrdersService
- **MySQL** - CatalogoService y UserService
- **Redis** - Cache para CatalogoService

### Infraestructura
- **RabbitMQ** - Message broker para comunicación entre servicios
- **Nginx** - Reverse proxy y balanceador de carga

## 📦 Requisitos Previos

- Docker 
- Docker Compose
- Git

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd Nube
```

### 2. Estructura del Proyecto
```
Nube/
├── CatalogoSerice/
├── OrdersService/
├── PaymentNotificationsService/
├── UserService/
├── Pedidos-front/
├── nginx/
├── docker-compose.yml
└── README.md
```

### 3. Levantar los Servicios
```bash
# Construir y levantar todos los contenedores
docker-compose up -d --build

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f orders-service
```

## 🔧 Comandos Post-Instalación

### UserService (Django)
```bash
# Ejecutar migraciones
docker-compose exec user-service python manage.py migrate

# Crear superusuario
docker-compose exec user-service python manage.py createsuperuser

# Recolectar archivos estáticos
docker-compose exec user-service python manage.py collectstatic --noinput
```

### CatalogoService (Laravel)
```bash
# Instalar dependencias
docker-compose exec catalogo-service composer install

# Generar key de aplicación
docker-compose exec catalogo-service php artisan key:generate

# Ejecutar migraciones
docker-compose exec catalogo-service php artisan migrate

# Generar documentación API
docker-compose exec catalogo-service php artisan l5-swagger:generate
```

### OrdersService (NestJS)
```bash
# Ver logs del servicio
docker-compose logs -f orders-service

# Instalar nuevas dependencias (si es necesario)
docker-compose exec orders-service npm install
```

## 🌐 URLs de Acceso

### Aplicación Principal
- ejecutar el front 
``` bash 
cd Pedidos-front
npm install 
npm run dev
```
- URL : http://localhost:5173

### APIs de Microservicios (a través de Nginx Proxy)

#### OrdersService
- Base URL: http://localhost/api/orders
- Endpoints principales:
  - `POST /api/orders/api/v1/orders` - Crear pedido
  - `GET /api/orders/api/v1/orders` - Listar pedidos
  - `GET /api/orders/api/v1/orders/:id` - Obtener pedido por ID
  - `PATCH /api/orders/api/v1/orders/:id` - Actualizar pedido
  - `DELETE /api/orders/api/v1/orders/:id` - Eliminar pedido

#### CatalogoService
- Base URL: http://localhost/api/catalogo
- Documentación Swagger: http://localhost/api/catalogo/documentation
- Endpoints principales:
  - `GET /api/catalogo/restaurants` - Listar restaurantes
  - `POST /api/catalogo/restaurants` - Crear restaurante
  - `GET /api/catalogo/categories` - Listar categorías
  - `GET /api/catalogo/products` - Listar productos

#### UserService
- Base URL: http://localhost/api/users
- Admin Panel: http://localhost/api/users/admin
- Endpoints principales:
  - `POST /api/users/register` - Registro de usuario
  - `POST /api/users/login` - Inicio de sesión
  - `GET /api/users/profile` - Perfil de usuario
  - `PUT /api/users/profile` - Actualizar perfil

#### PaymentNotificationsService
- Base URL: http://localhost/api/notifications
- Health Check: http://localhost/api/notifications/health
- Endpoints principales:
  - `POST /api/notifications/payment` - Enviar notificación de pago
  - `GET /api/notifications/status` - Estado del servicio

### Servicios de Infraestructura

#### RabbitMQ Management
- URL: http://localhost:15672
- Usuario: `guest`
- Contraseña: `guest`

#### Bases de Datos (acceso directo)
- PostgreSQL (OrdersService): `localhost:5432`
  - DB: `orders_db`
  - Usuario: `serdev`
  - Contraseña: `nifer2030`

- MySQL (CatalogoService): `localhost:3306`
  - DB: `db_catalogo`
  - Usuario: `sail`
  - Contraseña: `password`

- MySQL (UserService): `localhost:3307`
  - DB: `pedidos_user_service`
  - Usuario: `user`
  - Contraseña: `yes`

## 📊 Servicios

### OrdersService (NestJS)
- **Puerto Interno**: 3000
- **Tecnología**: NestJS, TypeScript, PostgreSQL
- **Función**: Gestión completa de pedidos
- **Message Queue**: Publica eventos en `order_events`

### CatalogoService (Laravel)
- **Puerto Interno**: 8000
- **Tecnología**: Laravel 10, PHP 8.2, MySQL, Redis
- **Función**: Gestión de restaurantes, categorías y productos
- **Cache**: Redis para optimización de consultas

### UserService (Django)
- **Puerto Interno**: 8000
- **Tecnología**: Django 4.2, Python 3.11, MySQL
- **Función**: Autenticación y gestión de usuarios
- **WSGI Server**: Gunicorn

### PaymentNotificationsService (Node.js)
- **Puerto Interno**: 3004
- **Tecnología**: Node.js, Express
- **Función**: Envío de notificaciones por email
- **Message Queue**: Consume eventos de `payment_events` y `order_events`

### Frontend (React)
- **Puerto Interno**: 80
- **Tecnología**: React 18, Vite, TypeScript
- **Función**: Interfaz de usuario

## 🔄 Gestión de Servicios
```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart orders-service

# Ver estado de los servicios
docker-compose ps

# Ejecutar comandos en un contenedor
docker-compose exec <service-name> <command>

# Reconstruir un servicio específico
docker-compose up -d --build orders-service
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS** - Framework Node.js para OrdersService
- **Laravel 10** - Framework PHP para CatalogoService
- **Django 4.2** - Framework Python para UserService
- **Express** - Framework Node.js para PaymentNotificationsService

### Frontend
- **React 18** - Librería de UI
- **Vite** - Build tool
- **TypeScript** - Lenguaje tipado

### Bases de Datos
- **PostgreSQL 16** - Base de datos relacional
- **MySQL 8.0** - Base de datos relacional
- **Redis** - Cache en memoria

### Message Broker
- **RabbitMQ 3** - Sistema de mensajería

### Proxy
- **Nginx** - Reverse proxy y servidor web

## 📝 Notas Importantes

1. **Healthchecks**: Todos los servicios de base de datos tienen healthchecks configurados para garantizar que estén listos antes de iniciar los servicios dependientes.

2. **Volúmenes Persistentes**: Los datos de las bases de datos se almacenan en volúmenes de Docker para persistencia.

3. **Red Interna**: Todos los servicios se comunican a través de la red `app-network`.

4. **Variables de Entorno**: Las credenciales y configuraciones están en el archivo `docker-compose.yml`. En producción, usa archivos `.env` separados.

5. **JWT Secret**: El token JWT `grupo8` debe cambiarse en producción.

## 🐛 Troubleshooting

### Los servicios no inician correctamente
```bash
# Revisar logs
docker-compose logs

# Verificar estado de contenedores
docker-compose ps
```

### Error de conexión a base de datos
```bash
# Verificar que las bases de datos estén saludables
docker-compose ps

# Reiniciar servicios de base de datos
docker-compose restart postgres catalogo-db user-db
```

### RabbitMQ no conecta
```bash
# Verificar estado de RabbitMQ
docker-compose logs rabbitmq

# Acceder a management UI
# http://localhost:15672
```

## 📄 Licencia

Este proyecto es parte de un trabajo académico para el curso de Computación en la Nube.

## 👥 Equipo

Grupo 8 - Semestre 2-2025

---

**Desarrollado con ❤️ usando Docker y Microservicios**