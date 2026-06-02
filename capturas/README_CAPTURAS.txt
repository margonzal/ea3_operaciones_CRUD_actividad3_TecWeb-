INSTRUCCIONES PARA LAS CAPTURAS DE PRUEBAS POSTMAN
==================================================

Para completar la entrega del proyecto, debes realizar las pruebas de los endpoints en Postman y guardar las capturas de pantalla de la ventana de Postman en esta carpeta con los siguientes nombres exactos:

1. captura_post.png
   - Debe mostrar una petición POST exitosa a: http://localhost:3000/api/sensores
   - Cuerpo de la petición en JSON y la respuesta con código "201 Created".

2. captura_get.png
   - Debe mostrar una petición GET exitosa a: http://localhost:3000/api/sensores
   - La respuesta con código "200 OK" y el listado de sensores en formato JSON.

3. captura_put.png
   - Debe mostrar una petición PUT exitosa a: http://localhost:3000/api/sensores/:id (ej: id 1)
   - Cuerpo de la petición con datos actualizados y respuesta con código "200 OK".

4. captura_delete.png
   - Debe mostrar una petición DELETE exitosa a: http://localhost:3000/api/sensores/:id
   - La respuesta con código "200 OK".

Nota: Asegúrate de que en cada captura de pantalla sea visible la URL de la petición, el método HTTP, el estado de la respuesta (código HTTP) y el cuerpo JSON (si aplica).
