// ==========================================
// CONFIGURACIÓN DE LA CONEXIÓN A MYSQL
// ASIGNATURA: Tecnologías Web (EA3)
// ==========================================

// Importa la versión basada en promesas de mysql2 para poder usar async/await
const mysql = require('mysql2/promise');

// Carga las variables de entorno desde el archivo .env a process.env
require('dotenv').config();

/**
 * Crea un pool de conexiones a la base de datos.
 * El pool permite reutilizar conexiones existentes y gestionar múltiples
 * consultas simultáneas de manera eficiente.
 */
const pool = mysql.createPool({
    // Host de la base de datos (por ejemplo, localhost)
    host: process.env.DB_HOST || 'localhost',
    
    // Puerto de la base de datos MySQL (por defecto es 3306)
    port: parseInt(process.env.DB_PORT || '3306'),
    
    // Usuario de la base de datos
    user: process.env.DB_USER || 'root',
    
    // Contraseña del usuario
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    
    // Nombre de la base de datos a la cual conectarse
    database: process.env.DB_NAME || 'monitoreo_mecanico',
    
    // Número máximo de conexiones simultáneas permitidas en el pool
    connectionLimit: 10,
    
    // Permite encolar consultas cuando no hay conexiones disponibles en el pool
    waitForConnections: true,
    
    // Tiempo de espera máximo en milisegundos para obtener una conexión del pool
    queueLimit: 0
});

// Exporta el pool para que sea utilizado en el servidor de la API
module.exports = pool;
