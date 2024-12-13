Documentación API Proyecto Logística

1. Introducción al Proyecto
    La aplicación es un software preparado para gestionar pedidos logísticos entre almacenes. Está diseñado para ser utilizado por diferentes perfiles de usuarios:
    •	Operador (Operator): Crea y gestiona pedidos.
    •	Administrador (Manager): Aprueba y rechaza pedidos.
    •	Jefe (Boss): Administra almacenes y empleados.


2. Arquitectura del Sistema
    La aplicación sigue una arquitectura basada en roles y permisos para garantizar el acceso seguro a los datos y las acciones específicas de cada usuario.

    Estructura ficheros del Backend:
    •	Config: Configuración del sistema (base de datos, servicio de emails, geocoder, y multer).
    •	Controllers: Manejo de lógica de negocios para cada rol.
    •	Models: Consultas a la base de datos.
    •	Routes: Definición de rutas principales y específicas.
    •	Utils: Funciones auxiliares y middlewares.
    •	Templates: Plantillas para el sistema de mensajería por correo.
    •	Uploads: Imágenes subidas por usuarios.


3. Base de Datos
    La base de datos se llama logistics y contiene las siguientes entidades:
    •	Usuarios (user): Almacena información de operadores, administradores y el jefe.
    •	Almacenes (warehouse): Define los almacenes disponibles.
    •	Pedidos (delivery): Registra el movimiento de productos entre almacenes.
    •	Productos (delivery_products): Contiene información sobre los productos manejados en los pedidos.
    •	Truck (camión): Define la flota de camiones disponibles.
    •	Product (producto): Registra los productos que comercializa la empresa.

    Relaciones Clave:
    •	Un operador pertenece a un único almacén, y un almacén puede tener muchos operadores.
    •	Un administrador pertenece a un único almacén, y un almacén solo puede tener un administrador.
    •	Un jefe administra múltiples almacenes y empleados.


4. Guía de Autenticación y Autorización
    •	JWT (JSON Web Token):
        o	Se utiliza para autenticar usuarios.
        o	Cada usuario recibe un token con datos relevantes como ID, rol, y expiración.
    •	Roles:
        o	Operator: Acceso limitado a creación y modificación de pedidos.
        o	Manager: Puede revisar, aprobar y rechazar pedidos.
        o	Boss: Gestión completa de almacenes y empleados.


5. Endpoints de la API

    Operator:
        •	GET /operator/order-list
            o	Descripción: Lista todos los pedidos asociados al operador.
            o	Respuesta: Array de pedidos.
        •	POST /operator/create-order
            o	Descripción: Crea un nuevo pedido.
            o	Body: Información del pedido (productos, almacenes de origen y destino).
            o	Respuesta: Pedido creado.

        Ejemplo:
        GET http://localhost:3000/operator/order-list
        Authorization: <token>

        Respuesta esperada:
            [
            {
                "id_delivery": 1,
                "send_date": "2024-11-01T07:30:00.000Z",
                "origin_warehouse_name": "Mediterranean Node",
                "origin_warehouse_locality": "Murcia",
                "destination_warehouse_name": "Northern Passage",
                "destination_warehouse_locality": "Pamplona",
                "status": "review",
                "plate": "1330-ABC",
                "comments": "Incomplete order"
            }
            ]


    Manager:
        •	GET /manager/outgoing-orders
            o	Descripción: Lista los pedidos salientes del almacén del administrador.
            o	Respuesta: Array de pedidos.

        •	PUT /manager/review-order/:id
            o	Descripción: Actualiza el estado de un pedido.
            o	Body: { "status": "ready for departure", "comments": "Falta 1 palé" }
            o	Respuesta: Pedido actualizado.

        Ejemplo:
        PUT http://localhost:3000/manager/review-order/22
        Content-Type: application/json
        Authorization:  <token>

            {
            "status": "corrections needed",
            "comments": "Falta 1 palé"
            }

        Respuesta esperada:
            {
            "message": "Order status updated successfully",
            "updatedOrder": [
                {
                "id_delivery": 1,
                "send_date": "2024-11-01T07:30:00.000Z",
                "received_date": null,
                "truck_id_truck": 1,
                "origin_warehouse_id": 1,
                "destination_warehouse_id": 2,
                "status": "corrections needed",
                "comments": "Falta 1 palé",
                "plate": "1330-ABC",
                "origin_warehouse_name": "Mediterranean Node",
                "destination_warehouse_name": "Northern Passage"
                }
            ]
            }


    Boss:
        •	GET /boss/users
            o	Descripción: Lista todos los usuarios.
        •	DELETE /boss/users/:id
            o	Descripción: Elimina un usuario por ID.

        Ejemplo:
        GET http://localhost:3000/boss/users
        Authorization: <token>

        Respuesta esperada:
            {
                "id_user": 1,
                "name": "Carlos",
                "surname": "López",
                "email": "carlos.lopez@gmail.com",
                "password": "$2b$08$tKwRf/IntyeQab7GOLlXcuBvf5Os5xywnA2EErdVXMukGWQSdDDDi",
                "role": "boss",
                "image": "http://localhost:3000/uploads/user-1.jpg",
                "assigned_id_truck": null,
                "assigned_id_warehouse": null
            },
            {
                "id_user": 2,
                "name": "Sofía",
                "surname": "Martínez",
                "email": "sofia.martinez@gmail.com",
                "password": "$2b$08$qO6S3yoVjq8kQMX8MRdSNORQV4OeLdjg9jbQn7WNUBoCPCNQBygUK",
                "role": "boss",
                "image": "http://localhost:3000/uploads/user-2.jpg",
                "assigned_id_truck": null,
                "assigned_id_warehouse": null
            }



6. Flujo de Trabajo por Rol
    Operador
        1.	Crea un pedido y lo envía a revisión.
        2.	Consulta el estado de sus pedidos.

    Manager
        1.	Revisa los pedidos salientes y los aprueba o rechaza.
        2.	Revisa los pedidos entrantes y los aprueba o rechaza.
        3.	Envía notificaciones de pedidos recibidos.
        4.	Recibe notificaciones de pedidos entregados y toma decisiones sobre ellos.

    Jefe
        1.	Administra almacenes y empleados.
        2.	Supervisa la actividad general del sistema.


7. Ejecución del Proyecto
    Instalación
        1.	Clona el repositorio.
        2.	Instala las dependencias con npm install.
        3.	Configura las variables de entorno en un archivo .env:
            DB_HOST=host
            DB_USER=user
            DB_PASS=password
            DB_NAME=logistics
            PRIVATEKEY=logistics
            AUTH_USER= rountravellogistics@gmail.com
            AUTH_PASS= pnaj fyug yatu tljw

    Ejecución
        •	Desarrollo: npm run dev
        •	Producción: npm start


8. Notas Finales
    •	Toda las peticiones posibles de la API se encuentran detallada en los archivos .rest proporcionados.
    •	Este proyecto utiliza herramientas como Node.js, Express y JWT para garantizar un flujo seguro y eficiente.



