# TributaFácil

Aplicación React + TypeScript con Vite y Tailwind CSS.

## Ejecutar localmente

Requiere Node.js 22 o superior. En una terminal dentro de esta carpeta:

```powershell
npm.cmd ci
npm.cmd start
```

Se abrirá http://127.0.0.1:5173 (o el puerto disponible indicado en consola).
Mantén la terminal abierta. Para detener: Ctrl+C.
En siguientes ocasiones solo necesitas `npm.cmd start`.

## Netlify

Ejecuta `npm.cmd run build` y sube la carpeta `dist` a Netlify.
Para despliegues desde un repositorio, netlify.toml configura el comando
`npm run build`, el directorio público `dist` y Node.js 22.
La aplicación está en la raíz del repositorio; no necesitas configurar
un directorio base en Netlify.
Para revisar la compilación local: `npm.cmd run preview`.

## Alcance

Demostración con datos de ejemplo: no consulta deudas reales, procesa pagos
ni envía notificaciones. No hay backend, autenticación ni persistencia.
La instalación y Google Fonts requieren Internet; las fuentes tienen
respaldo del sistema.

## Caso para la presentación

- Carlos Ramírez, 38 años. DNI ficticio: `00000001`.
- Municipalidad de Miraflores. También puedes pulsar **Usar datos de prueba**.
- Fecha fija del caso: 29/10/2026; no depende del reloj del equipo.
- Pendiente: S/847.50; vencido: S/420.00; previamente pagado: S/350.00.
- Seleccionar solo el predial y confirmar deja S/427.50 pendientes.
- La constancia es HTML descargable e imprimible, sin validez tributaria.
- La selección se conserva al navegar; recargar o reiniciar restaura la sesión.
- **Reiniciar demo** pide confirmación antes de restablecer el caso.
- Las pantallas originales se conservan en src/app/components como referencia;
  la demostración se concentra en el recorrido del contribuyente.

## Verificar

```powershell
npm.cmd test
npm.cmd run build
```

## Presentación en clase

- [PPT actualizado (14 diapositivas)](docs/TributaFacil-presentacion-en-vivo.pptx)
- [Guía del presentador y tabla de observación](docs/GUIA_PRESENTADOR.md)
- [Revisión previa del agente](docs/AUDITORIA_DEMO.md)
- [Vista previa de la web](docs/TributaFacil-web.png)
