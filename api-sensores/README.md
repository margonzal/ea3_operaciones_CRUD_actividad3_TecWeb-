# Sistema de Monitoreo Mecánico - API REST & Dashboard

Este proyecto implementa una solución completa para el monitoreo de variables mecánicas de sensores (temperatura, presión y vibración) en maquinaria industrial. Está compuesto por una base de datos relacional (MySQL), una API RESTful estructurada en Node.js con Express y un Dashboard web dinámico e interactivo diseñado bajo principios estéticos modernos.

Este proyecto ha sido desarrollado siguiendo estrictamente las especificaciones de la actividad académica para la entrega **González_Ramos_EA3**.

---

## 🛠️ Tecnologías Utilizadas

### Backend (API REST)
* **Node.js**: Entorno de ejecución para Javascript en el servidor.
* **Express**: Framework web minimalista para crear la API REST.
* **mysql2 (mysql2/promise)**: Driver para conectar e interactuar de forma asíncrona con la base de datos MySQL mediante pools y promesas.
* **dotenv**: Carga de variables de entorno desde un archivo `.env`.
* **cors**: Middleware para habilitar solicitudes de origen cruzado (CORS).

### Frontend (Dashboard)
* **HTML5**: Estructura semántica de la página.
* **Vanilla CSS (Aesthetics Premium)**: Diseño premium con Glassmorphism, interfaz reactiva en modo oscuro y animaciones fluidas.
* **Chart.js (vía CDN)**: Biblioteca para renderizar gráficos de barras interactivos.
* **FontAwesome (vía CDN)**: Iconos vectoriales de control.
* **JavaScript (Fetch API)**: Cliente para consumir la API REST y gestionar el DOM en tiempo real.

### Base de Datos
* **MySQL**: Motor de base de datos relacional para persistencia de datos.

---

## 📂 Estructura del Proyecto

La estructura física del proyecto es la siguiente:

```text
EA3_Operaciones CRUD y Dashboard/
├── api-sensores/
│   ├── node_modules/         # Dependencias instaladas (omitidas en control de versiones)
│   ├── db.js                 # Pool de conexiones a MySQL (mysql2/promise)
│   ├── server.js             # Servidor Express y lógica de endpoints REST
│   ├── schema.sql            # Script SQL de base de datos y registros iniciales
│   ├── package.json          # Manifiesto y scripts del proyecto
│   ├── .gitignore            # Exclusión de archivos sensibles
│   ├── .env                  # Variables de entorno locales (sensible, no se entrega)
│   ├── .env.example          # Plantilla de variables de entorno
│   └── README.md             # Este archivo de documentación
├── dashboard/
│   ├── index.html            # Interfaz gráfica premium del Dashboard
│   └── app.js                # Lógica del frontend y consumo de la API
└── capturas/                 # Carpeta contenedora de capturas de pruebas realizadas
```

---

## 🚀 Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas en tu equipo:
1. **Node.js** (Versión LTS recomendada) e **npm**.
2. **Servidor MySQL** (Local o remoto, por ejemplo a través de XAMPP, WampServer o MySQL Installer).
3. **Cliente de base de datos** (como DBeaver, HeidiSQL o phpMyAdmin) o terminal de MySQL.
4. **Postman** (para la simulación y pruebas de endpoints).

---

## 🔧 Instalación y Configuración

Sigue estos pasos ordenados para desplegar el proyecto localmente:

### Paso 1: Configurar la Base de Datos
1. Inicia tu servidor MySQL.
2. Abre tu cliente MySQL favorito (o terminal).
3. Ejecuta las sentencias contenidas en el script [schema.sql](file:///c:/Users/USUARIO/Documents/IUDIGITAL%20Actividades/Sexto/Tecnologias%20web/EA3_Operaciones%20CRUD%20y%20Dashboard/api-sensores/schema.sql) para crear la base de datos `monitoreo_mecanico`, la tabla `sensores` e insertar los 4 registros iniciales.
   * *Comando de consola alternativa:*
     ```bash
     mysql -u tu_usuario -p < api-sensores/schema.sql
     ```

### Paso 2: Instalar Dependencias del Backend
1. Abre tu terminal en la carpeta `api-sensores/`.
2. Instala las dependencias declaradas en el `package.json`:
   ```bash
   npm install
   ```

### Paso 3: Configurar Variables de Entorno
1. Duplica el archivo `.env.example` en la carpeta `api-sensores/` y cámbiale el nombre a `.env`:
   * *En Windows (PowerShell):*
     ```powershell
     Copy-Item .env.example .env
     ```
2. Abre el archivo `.env` recién creado y define tus credenciales reales de conexión a MySQL. Por ejemplo:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=mi_contraseña_segura
   DB_NAME=monitoreo_mecanico
   PORT=3000
   ```
   *(El archivo `.env` ha sido incluido en el `.gitignore` para no ser subido por accidente).*

### Paso 4: Iniciar la API REST
1. Dentro de la carpeta `api-sensores/`, inicia el servidor de desarrollo:
   ```bash
   node server.js
   ```
2. Deberías ver en consola el mensaje:  
   `Servidor de monitoreo escuchando en el puerto 3000`

### Paso 5: Abrir el Dashboard
1. Abre el archivo `dashboard/index.html` en cualquier navegador web moderno.
2. Comprueba que el indicador superior derecho muestre **"Conectado a API"** (color verde). Si el servidor Express está apagado o hay un problema de red, el indicador cambiará a **"Servidor Desconectado"** (color rojo).

---

## 📡 Especificación de la API REST (Endpoints)

Todas las consultas SQL de la API se realizan mediante **sentencias parametrizadas** para garantizar la seguridad contra ataques de inyección SQL.

### 1. Obtener todos los sensores
* **Método**: `GET`
* **URL**: `http://localhost:3000/api/sensores`
* **Parámetro opcional de filtro**: `tipo` (Valores permitidos: `temperatura`, `presion`, `vibracion`)
  * Ejemplo filtrado: `http://localhost:3000/api/sensores?tipo=temperatura`
* **Respuestas esperadas**:
  * `200 OK`: Devuelve un arreglo JSON con los registros ordenados por `fecha_registro DESC`.
  * `400 Bad Request`: Si el filtro de tipo es incorrecto.
  * `500 Internal Server Error`: Problema de conexión a base de datos.

### 2. Registrar un nuevo sensor
* **Método**: `POST`
* **URL**: `http://localhost:3000/api/sensores`
* **Cuerpo de la petición (JSON)**:
  ```json
  {
    "nombre": "Sensor Presión Reactor 1",
    "tipo": "presion",
    "valor": 145.80,
    "unidad": "PSI",
    "ubicacion": "Planta de Envasado B"
  }
  ```
* **Respuestas esperadas**:
  * `201 Created`: Sensor registrado exitosamente. Retorna el ID generado y los datos.
  * `400 Bad Request`: Si faltan campos obligatorios o el tipo es inválido.

### 3. Actualizar un sensor existente
* **Método**: `PUT`
* **URL**: `http://localhost:3000/api/sensores/:id` (Reemplazar `:id` por el ID numérico del sensor)
* **Cuerpo de la petición (JSON)**:
  ```json
  {
    "nombre": "Sensor Temperatura Motor A (Actualizado)",
    "tipo": "temperatura",
    "valor": 80.20,
    "unidad": "°C",
    "ubicacion": "Bloque de Cilindros - Zona Norte"
  }
  ```
* **Respuestas esperadas**:
  * `200 OK`: Actualización completada correctamente.
  * `400 Bad Request`: Datos de entrada inválidos.
  * `404 Not Found`: Si el ID especificado no existe en la base de datos.

### 4. Eliminar un sensor
* **Método**: `DELETE`
* **URL**: `http://localhost:3000/api/sensores/:id`
* **Respuestas esperadas**:
  * `200 OK`: Registro eliminado con éxito.
  * `404 Not Found`: Si el ID especificado no existe.

---

## 🧪 Pruebas con Postman y Evidencias de Ejecución

Para la entrega, se debe generar y almacenar las capturas de pantalla de las pruebas en la carpeta `/capturas`. A continuación se detalla la configuración recomendada para cada prueba en Postman:

1. **Prueba GET General**: Realiza una petición `GET` a `http://localhost:3000/api/sensores`. Comprueba que retorne los 4 registros por defecto con un código `200 OK`. Toma una captura de pantalla y guárdala como `captura_get.png`.
2. **Prueba POST**: Configura una petición `POST` a `http://localhost:3000/api/sensores` con la pestaña *Body* configurada en `raw` y formato `JSON`. Inserta un nuevo sensor y verifica que la respuesta sea `201 Created`. Toma una captura de pantalla y guárdala como `captura_post.png`.
3. **Prueba GET con Filtro**: Realiza una petición `GET` a `http://localhost:3000/api/sensores?tipo=temperatura` y valida que solo aparezcan sensores de dicho tipo.
4. **Prueba PUT**: Realiza una petición `PUT` a `http://localhost:3000/api/sensores/1` con datos nuevos para modificar el sensor de ID 1. Valida el código `200 OK`. Guarda la captura como `captura_put.png`.
5. **Prueba DELETE**: Realiza una petición `DELETE` a `http://localhost:3000/api/sensores/4` (o un ID de prueba). Valida el código `200 OK`. Guarda la captura como `captura_delete.png`.

---

## 📈 Funcionamiento del Dashboard

1. **Carga Inicial**: Al abrir el Dashboard en el navegador, este carga de forma predeterminada todos los sensores y los representa inmediatamente en una tabla dinámica.
2. **Contadores KPIs**: Muestra en tiempo real la cantidad de sensores agregados agrupados por su tipo (`temperatura`, `presión`, `vibración`).
3. **Gráfico de Barras**: Dibuja un gráfico de barras interactivo con colores distintivos por tipo de sensor usando la API de Chart.js.
4. **Interactividad del Filtro**: Si se cambia la opción del filtro dropdown ("Filtrar por Tipo"), el dashboard realiza una llamada reactiva (`cargarSensores(tipo)`) utilizando la URL parametrizada `?tipo=...` de la API. La tabla y el gráfico se actualizan automáticamente en tiempo real mostrando únicamente los sensores consultados.
5. **Formulario de Registro**: Permite ingresar un nuevo sensor directamente desde la interfaz. Al hacer clic en "Guardar Registro", realiza una petición `POST` en segundo plano, muestra un cartel (toast) de éxito y actualiza la lista global de sensores inmediatamente sin refrescar la página.
6. **Eliminación Directa**: Cada sensor en la tabla posee un botón con icono de papelera. Al pulsarlo y confirmar, realiza una solicitud `DELETE` al servidor backend y actualiza las métricas y la tabla reactivamente.
