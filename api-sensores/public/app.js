// ==========================================
// LÓGICA DE CONTROL DEL DASHBOARD (FRONTEND)
// ASIGNATURA: Tecnologías Web (EA3)
// ==========================================

const API_URL = 'http://localhost:3000/api/sensores';

// Referencias a elementos del DOM
const connectionStatus = document.getElementById('connectionStatus');
const statusText = document.getElementById('statusText');
const sensorForm = document.getElementById('sensorForm');
const formToast = document.getElementById('formToast');
const filtroTipo = document.getElementById('filtroTipo');
const tablaCuerpo = document.getElementById('tablaCuerpo');
const tableEmptyState = document.getElementById('tableEmptyState');

// Elementos de contadores KPI
const kpiTemp = document.getElementById('kpiTemp');
const kpiPres = document.getElementById('kpiPres');
const kpiVibr = document.getElementById('kpiVibr');

// Variable global para almacenar el objeto Chart.js y evitar conflictos de renderizado
let sensorChart = null;

/**
 * Muestra notificaciones temporales en el formulario.
 * @param {string} mensaje - Mensaje a mostrar.
 * @param {boolean} esExito - Define si el mensaje es de éxito o error.
 */
function mostrarToast(mensaje, esExito) {
    formToast.textContent = mensaje;
    formToast.className = `toast ${esExito ? 'success' : 'error'}`;
    
    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
        formToast.style.display = 'none';
    }, 4000);
}

/**
 * Actualiza el indicador visual de conexión con la API REST.
 * @param {boolean} online - Indica si el backend responde.
 */
function actualizarEstadoConexion(online) {
    if (online) {
        connectionStatus.classList.remove('offline');
        statusText.textContent = 'Conectado a API';
    } else {
        connectionStatus.classList.add('offline');
        statusText.textContent = 'Servidor Desconectado';
    }
}

/**
 * Función Principal para cargar y mostrar sensores.
 * Cumple con todos los requisitos de la FASE 6:
 * 1. Consume la API mediante fetch().
 * 2. Obtiene el JSON.
 * 3. Cuenta los sensores por tipo.
 * 4. Construye/actualiza el gráfico de barras.
 * 5. Construye la tabla HTML.
 * @param {string} tipo - Tipo de sensor para filtrar en la API.
 */
async function cargarSensores(tipo = '') {
    try {
        // 1 y 2. Construir URL de consumo y realizar el fetch
        let url = API_URL;
        if (tipo) {
            url += `?tipo=${encodeURIComponent(tipo)}`;
        }

        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP Error ${respuesta.status}`);
        }

        const sensores = await respuesta.json();
        actualizarEstadoConexion(true);

        // 3. Contar sensores por tipo
        let contadorTemp = 0;
        let contadorPres = 0;
        let contadorVibr = 0;

        sensores.forEach(sensor => {
            if (sensor.tipo === 'temperatura') contadorTemp++;
            else if (sensor.tipo === 'presion') contadorPres++;
            else if (sensor.tipo === 'vibracion') contadorVibr++;
        });

        // Actualizar contadores visuales (KPIs)
        kpiTemp.textContent = contadorTemp;
        kpiPres.textContent = contadorPres;
        kpiVibr.textContent = contadorVibr;

        // 4. Construir/actualizar gráfico de barras mediante Chart.js
        renderizarGrafico(contadorTemp, contadorPres, contadorVibr);

        // 5. Construir la tabla HTML
        renderizarTabla(sensores);

    } catch (error) {
        console.error('Error al conectar con la API REST:', error);
        actualizarEstadoConexion(false);
        // Vaciar la tabla y mostrar un estado de error
        tablaCuerpo.innerHTML = '';
        tableEmptyState.style.display = 'block';
        tableEmptyState.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i><p>Error al conectar con el servidor.</p>';
    }
}

/**
 * Dibuja o actualiza el gráfico de barras con Chart.js.
 * @param {number} temp - Cantidad de sensores de temperatura.
 * @param {number} pres - Cantidad de sensores de presión.
 * @param {number} vibr - Cantidad de sensores de vibración.
 */
function renderizarGrafico(temp, pres, vibr) {
    const ctx = document.getElementById('chartSensores').getContext('2d');

    // IMPORTANTE: Si ya existe un gráfico anterior, destruirlo para limpiar el canvas
    if (sensorChart) {
        sensorChart.destroy();
    }

    // Configuración y creación del gráfico (Requisito: tipo 'bar')
    sensorChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperatura', 'Presión', 'Vibración'],
            datasets: [{
                label: 'Cantidad de Sensores',
                data: [temp, pres, vibr],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.65)',  // Rojo - Temperatura
                    'rgba(16, 185, 129, 0.65)', // Verde - Presión
                    'rgba(245, 158, 11, 0.65)'  // Amarillo - Vibración
                ],
                borderColor: [
                    '#ef4444',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Ocultar leyenda puesto que solo hay un dataset
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Sensores: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: { family: 'Inter', weight: '500' }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9ca3af',
                        stepSize: 1,
                        beginAtZero: true,
                        font: { family: 'Inter' }
                    }
                }
            }
        }
    });
}

/**
 * Renderiza la lista de sensores dentro del cuerpo de la tabla HTML.
 * @param {Array} sensores - Listado de objetos sensor.
 */
function renderizarTabla(sensores) {
    tablaCuerpo.innerHTML = '';

    if (sensores.length === 0) {
        tableEmptyState.style.display = 'block';
        return;
    }

    tableEmptyState.style.display = 'none';

    sensores.forEach(sensor => {
        const fila = document.createElement('tr');
        
        // Estilo según el tipo de sensor
        let badgeClass = 'badge-temp';
        let tipoIcon = 'fa-temperature-half';
        if (sensor.tipo === 'presion') {
            badgeClass = 'badge-pres';
            tipoIcon = 'fa-gauge-simple-high';
        } else if (sensor.tipo === 'vibracion') {
            badgeClass = 'badge-vibr';
            tipoIcon = 'fa-wave-square';
        }

        // Formatear la fecha
        const fecha = new Date(sensor.fecha_registro).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        fila.innerHTML = `
            <td><strong>${escaparHTML(sensor.nombre)}</strong></td>
            <td>
                <span class="badge ${badgeClass}">
                    <i class="fa-solid ${tipoIcon}"></i> ${sensor.tipo}
                </span>
            </td>
            <td><code>${parseFloat(sensor.valor).toFixed(2)} ${escaparHTML(sensor.unidad)}</code></td>
            <td>${escaparHTML(sensor.ubicacion)}</td>
            <td><small class="text-secondary">${fecha}</small></td>
            <td style="text-align: center;">
                <button class="btn-action-delete" onclick="eliminarSensor(${sensor.id})" title="Eliminar sensor">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;

        tablaCuerpo.appendChild(fila);
    });
}

/**
 * Escapa HTML para prevenir ataques XSS si se inyectan textos maliciosos en la DB.
 * @param {string} string - Texto a escapar.
 * @returns {string} - Texto seguro.
 */
function escaparHTML(string) {
    const mapa = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (mapa[match]));
}

/**
 * Evento al enviar el formulario (POST /api/sensores).
 */
sensorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const tipo = document.getElementById('tipo').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const unidad = document.getElementById('unidad').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, tipo, valor, unidad, ubicacion })
        });

        const data = await respuesta.json();

        if (respuesta.status === 201) {
            mostrarToast('¡Sensor registrado exitosamente!', true);
            sensorForm.reset();
            // Recargar sensores respetando el filtro actual
            cargarSensores(filtroTipo.value);
        } else {
            mostrarToast(data.error || 'Error al guardar el registro.', false);
        }
    } catch (error) {
        console.error('Error al registrar sensor:', error);
        mostrarToast('Error al enviar los datos. Compruebe la conexión.', false);
    }
});

/**
 * Función global para eliminar un sensor (DELETE /api/sensores/:id).
 * Se asocia en el onclick de los botones de la tabla.
 * @param {number} id - Identificador único del sensor.
 */
window.eliminarSensor = async function(id) {
    if (!confirm('¿Está seguro de que desea eliminar este registro de sensor?')) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await respuesta.json();

        if (respuesta.status === 200) {
            mostrarToast('Registro eliminado con éxito.', true);
            // Recargar la tabla
            cargarSensores(filtroTipo.value);
        } else {
            alert(data.error || 'No se pudo eliminar el registro.');
        }
    } catch (error) {
        console.error('Error al eliminar sensor:', error);
        alert('Error al intentar eliminar. Verifique la conexión con el servidor.');
    }
};

/**
 * Evento para la reactividad del filtro (Requisito Obligatorio)
 */
filtroTipo.addEventListener('change', (e) => {
    cargarSensores(e.target.value);
});

// Carga inicial al arrancar el dashboard
document.addEventListener('DOMContentLoaded', () => {
    cargarSensores();
});
