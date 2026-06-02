-- ==========================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS Y TABLAS
-- ASIGNATURA: Tecnologías Web (EA3)
-- ALUMNO: González Ramos (Entrega de Actividad)
-- base de datos: monitoreo_mecanico
-- ==========================================

-- 1. Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS monitoreo_mecanico;

-- 2. Seleccionar la base de datos para su uso
USE monitoreo_mecanico;

-- 3. Crear la tabla sensores con la estructura especificada en la guía
CREATE TABLE IF NOT EXISTS sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('temperatura','presion','vibracion') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    ubicacion VARCHAR(120) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- REGISTROS DE PRUEBA (MOCK DATA)
-- Se insertan por lo menos 4 registros distribuidos según los requisitos:
-- - 2 sensores de temperatura
-- - 1 sensor de presión
-- - 1 sensor de vibración
-- ==========================================

INSERT INTO sensores (nombre, tipo, valor, unidad, ubicacion) VALUES
('Sensor Temperatura Motor A', 'temperatura', 75.50, '°C', 'Bloque de Cilindros - Zona Norte'),
('Sensor Temperatura Turbina Auxiliar', 'temperatura', 110.20, '°C', 'Cojinete de Empuje - Turbina B'),
('Sensor Presión Hidráulica Principal', 'presion', 120.40, 'PSI', 'Línea de Retorno A - Planta 2'),
('Sensor Vibración Compresor Central', 'vibracion', 3.80, 'mm/s', 'Base Estructural - Compresor 1');
