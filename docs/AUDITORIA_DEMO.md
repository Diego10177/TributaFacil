# Revisión previa del agente — TributaFácil

Fecha de revisión: 28/10/2026 (Lima). Fecha de referencia del caso ficticio: 29/10/2026.
Método: lectura del código, ejecución en navegador y comprobaciones del modelo con Node.js.
Esto verifica el prototipo; no valida hipótesis con usuarios ni constituye una entrevista.

## Hallazgos corregidos

| Dónde | Hallazgo en la versión anterior | Riesgo | Corrección y evidencia |
| --- | --- | --- | --- |
| Consulta | Fechas de 2024 con estados pendientes; sin filtro | Dificulta identificar lo urgente | Fecha fija coherente, orden y filtro. En navegador, Vencidos aisló el predial de S/420. |
| Navegación | Consulta y pago guardaban listas independientes | Volver podía perder contexto; datos divergentes | Una fuente de datos. Se volvió desde revisión y el predial seguía seleccionado por S/420. |
| Confirmación | Afirmaba procesar un pago y enviar correo | Confusión sobre el alcance | Avisos visibles de simulación; no se solicitan datos bancarios. |
| Constancia | Botón de descarga sin acción | El flujo terminaba sin evidencia de la operación | Descarga HTML ejecutada; archivo DEMO-2026-0001.html guardado en Downloads. |
| Cuenta posterior | Las deudas no reflejaban la confirmación | Usuario no podía comprobar el efecto | Tras simular S/420, pendiente S/427.50; predial pagado y filtro de vencidos vacío. |

## Las diez heurísticas de Nielsen

| Heurística | Evidencia observada en esta versión | Riesgo o límite pendiente |
| --- | --- | --- |
| 1. Visibilidad del estado | Selección S/420, paso de revisión, confirmación y saldo S/427.50 visibles en navegador. | No comprobado con lector de pantalla; el anuncio dinámico está implementado con aria-live. |
| 2. Relación con el mundo real | Conceptos tributo, periodo, fecha, pendiente, vencido, importe y constancia; intereses de ejemplo explicados. | Comprensión del vocabulario pendiente de la prueba humana. |
| 3. Control y libertad | Modificar selección conservó el predial; reinicio con confirmación ejecutado con teclado. | Los cambios se pierden al recargar; se informa en ayuda y constancia. |
| 4. Consistencia | Mismos nombres y S/420 en listado, resumen y constancia; mismos botones y colores. | Revisión visual del recorrido, no estudio de reconocimiento con usuarios. |
| 5. Prevención de errores | Revisar deshabilitado sin selección; confirmar deshabilitado sin método; pagados no seleccionables. Modelo rechaza pagos duplicados y selección inválida. | No existe un pago real, autenticación ni verificación de identidad. |
| 6. Reconocimiento antes que memoria | Se muestran conceptos, periodo, importe, intereses y resumen antes de confirmar. | Se debe observar si el participante distingue deuda total de importe seleccionado. |
| 7. Flexibilidad y eficiencia | Usar datos de prueba carga DNI y municipalidad; filtro Vencidos reduce el listado. | Comprobación parcial de teclado en reinicio; no auditoría exhaustiva de todos los recorridos por teclado. |
| 8. Diseño estético y minimalista | Se concentró la demo en el contribuyente; no hay registro, administración ni acciones decorativas sin función. | Evaluación visual del agente; legibilidad proyectada y dispositivos reales pendientes. |
| 9. Reconocer y corregir errores | DNI ficticio 00000002 generó mensaje claro; la interfaz ofrece Usar datos de prueba. | No contempla errores de una API municipal porque no hay integración. |
| 10. Ayuda y documentación | Ayuda abierta en navegador: datos ficticios, fecha, intereses y duración de sesión. README y guía disponibles. | Utilidad y comprensión de la ayuda pendientes del participante. |

## Comprobaciones realizadas

- Compilación de producción con Vite, sin errores.
- Prueba del modelo: total inicial 847.50; filtro de vencidos; pagados al final; rechazo de métodos y selecciones inválidas; saldo tras pagar; no doble pago; referencias sucesivas; constancia; datos iniciales al reiniciar.
- Navegador: consulta, selección inicial vacía, filtro, total, ida y vuelta, método, confirmación, descarga y saldo.
- Estado vacío de vencidos tras pagar el predial.
- Vista móvil de 390 × 844: sin desbordamiento horizontal en el listado; revisión visual. No es prueba en teléfono físico.
- Reinicio con confirmación y activación por teclado: recuperó S/847.50 y datos vacíos.
- Consulta con otro DNI de prueba: error explícito. Ayuda desplegada y revisada.

## Lo que no se ha demostrado

No hay pruebas con usuarios reales, no se ha validado H1–H6, no se ha medido reducción de moras ni recaudación. No se han probado todos los lectores de pantalla, navegadores o dispositivos. Los datos, la constancia y los medios de pago son de demostración. Seleccionar periodos no es fraccionar una deuda en cuotas.
