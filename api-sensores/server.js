// ==========================================
// API REST DE MONITOREO DE SENSORES
// ASIGNATURA: Tecnologías Web (EA3)
// ==========================================

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');

// Carga de variables de entorno (en caso de ejecutar directamente)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
// Permite solicitudes desde otros dominios (esencial para el Dashboard)
app.use(cors());
// Analiza el cuerpo de las peticiones en formato JSON (reemplaza body-parser)
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
// Log para depuración: ruta absoluta que Express usa para servir archivos estáticos
const staticPath = path.join(__dirname, 'public');
console.log('Static files served from:', staticPath);

// ==========================================
// ENDPOINTS
// ==========================================

/**
 * 1. POST /api/sensores
 * Registra un nuevo sensor en el sistema.
 * Códigos HTTP de respuesta:
 * - 201 Created: Inserción exitosa.
 * - 400 Bad Request: Campos inválidos o ausentes.
 * - 500 Internal Server Error: Error en base de datos.
 */
app.post('/api/sensores', async (req, res) => {
    const { nombre, tipo, valor, unidad, ubicacion } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !tipo || valor === undefined || !unidad || !ubicacion) {
        return res.status(400).json({ 
            error: 'Todos los campos son obligatorios: nombre, tipo, valor, unidad, ubicacion.' 
        });
    }

    // Validación de tipo de sensor (ENUM en la base de datos)
    const tiposPermitidos = ['temperatura', 'presion', 'vibracion'];
    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ 
            error: 'Tipo de sensor inválido. Debe ser temperatura, presion o vibracion.' 
        });
    }

    // Validación del valor numérico
    if (isNaN(parseFloat(valor))) {
        return res.status(400).json({ 
            error: 'El valor debe ser un número válido.' 
        });
    }

    try {
        // Consulta SQL parametrizada para prevenir Inyección SQL
        const query = 'INSERT INTO sensores (nombre, tipo, valor, unidad, ubicacion) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query, [nombre, tipo, valor, unidad, ubicacion]);

        // Responder con código 201 y los datos del registro insertado
        res.status(201).json({
            id: result.insertId,
            nombre,
            tipo,
            valor,
            unidad,
            ubicacion,
            mensaje: 'Sensor registrado correctamente.'
        });
    } catch (error) {
        console.error('Error al insertar sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar el sensor.' });
    }
});

/**
 * 2. GET /api/sensores (Soporta filtro opcional ?tipo=...)
 * Obtiene la lista de sensores ordenada por fecha_registro DESC.
 * Códigos HTTP de respuesta:
 * - 200 OK: Lista obtenida con éxito.
 * - 400 Bad Request: Filtro de tipo inválido.
 * - 500 Internal Server Error: Error en base de datos.
 */
app.get('/api/sensores', async (req, res) => {
    const { tipo } = req.query;
    let query = 'SELECT * FROM sensores';
    let queryParams = [];

    // Si se pasa un parámetro de tipo, validamos y construimos el WHERE
    if (tipo) {
        const tiposPermitidos = ['temperatura', 'presion', 'vibracion'];
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({ 
                error: 'Filtro por tipo inválido. Debe ser temperatura, presion o vibracion.' 
            });
        }
        query += ' WHERE tipo = ?';
        queryParams.push(tipo);
    }

    // Requisito: Ordenar por fecha_registro descendente
    query += ' ORDER BY fecha_registro DESC';

    try {
        const [rows] = await pool.execute(query, queryParams);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al consultar sensores:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar los sensores.' });
    }
});

/**
 * 3. PUT /api/sensores/:id
 * Actualiza los datos de un sensor existente por su ID.
 * Códigos HTTP de respuesta:
 * - 200 OK: Actualización exitosa.
 * - 400 Bad Request: Campos inválidos o ausentes.
 * - 404 Not Found: El sensor con el ID provisto no existe.
 * - 500 Internal Server Error: Error en base de datos.
 */
app.put('/api/sensores/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, tipo, valor, unidad, ubicacion } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !tipo || valor === undefined || !unidad || !ubicacion) {
        return res.status(400).json({ 
            error: 'Todos los campos son obligatorios: nombre, tipo, valor, unidad, ubicacion.' 
        });
    }

    // Validación de tipo de sensor
    const tiposPermitidos = ['temperatura', 'presion', 'vibracion'];
    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ 
            error: 'Tipo de sensor inválido. Debe ser temperatura, presion o vibracion.' 
        });
    }

    // Validación del valor numérico
    if (isNaN(parseFloat(valor))) {
        return res.status(400).json({ 
            error: 'El valor debe ser un número válido.' 
        });
    }

    try {
        // Consulta SQL parametrizada para actualizar
        const query = 'UPDATE sensores SET nombre = ?, tipo = ?, valor = ?, unidad = ?, ubicacion = ? WHERE id = ?';
        const [result] = await pool.execute(query, [nombre, tipo, valor, unidad, ubicacion, id]);

        // Verificar si se afectaron filas (si el ID existía)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Sensor con id ${id} no encontrado.` });
        }

        res.status(200).json({
            id,
            nombre,
            tipo,
            valor,
            unidad,
            ubicacion,
            mensaje: 'Sensor actualizado correctamente.'
        });
    } catch (error) {
        console.error('Error al actualizar sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el sensor.' });
    }
});

/**
 * 4. DELETE /api/sensores/:id
 * Elimina un sensor por su ID.
 * Códigos HTTP de respuesta:
 * - 200 OK: Eliminación exitosa.
 * - 404 Not Found: El sensor con el ID provisto no existe.
 * - 500 Internal Server Error: Error en base de datos.
 */
app.delete('/api/sensores/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Consulta SQL parametrizada para eliminar
        const query = 'DELETE FROM sensores WHERE id = ?';
        const [result] = await pool.execute(query, [id]);

        // Verificar si se afectaron filas (si el ID existía)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Sensor con id ${id} no encontrado.` });
        }

        res.status(200).json({
            id,
            mensaje: 'Sensor eliminado correctamente.'
        });
    } catch (error) {
        console.error('Error al eliminar sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el sensor.' });
    }
});

// INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor de monitoreo escuchando en el puerto ${PORT}`);
});

// Ruta de depuración: devuelve el contenido de public/index.html (lectura directa)
const fs = require('fs');
app.get('/__debug_index', (req, res) => {
    const p = path.join(__dirname, 'public', 'index.html');
    fs.readFile(p, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo index.html:', err);
            return res.status(500).send('Error leyendo index.html');
        }
        res.type('html').send(data);
    });
});

// Rutas explícitas para servir el frontend (fallback si express.static no funciona)
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.js'));
});
