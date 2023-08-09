# Electron Parking System

Electron Parking System es una aplicación de escritorio desarrollada con Electron para gestionar el sistema de estacionamiento. Permite registrar vehículos, procesar pagos y administrar clientes. Utiliza Bootstrap para una interfaz interactiva y amigable con el usuario, e IndexedDB para el almacenamiento local de datos.

## Características

- **Registro de Vehículos**: Permite registrar vehículos con su placa y tipo.
- **Procesamiento de Pagos**: Facilita el procesamiento de pagos diarios y mensuales.
- **Gestión de Clientes**: Permite agregar, editar y eliminar clientes.
- **Historial de Pagos**: Muestra un historial completo de pagos.
- **Recordatorios de Pago**: Genera recordatorios para los pagos mensuales vencidos.
- **Base de Datos Local**: Utiliza IndexedDB para almacenar todos los datos localmente en la máquina del usuario.

## Requisitos

- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clona el repositorio o descarga el código fuente.
2. Navega a la carpeta del proyecto en tu terminal.
3. Ejecuta `npm install` para instalar todas las dependencias.
4. Ejecuta `npm start` para iniciar la aplicación.

## Estructura del Proyecto

```bash
electron-parking/
├── node_modules/
├── src/
│ ├── index.html
│ ├── models/
│ │ ├── Customer.js
│ │ ├── ParkingSystem.js
│ │ ├── Payment.js
│ │ └── Vehicle.js
│ └── renderer.js
├── compiled.js
├── index.js
├── package.json
└── package-lock.json
```

## Licencia

Este proyecto está licenciado bajo la licencia GPL-V3. Consulta el archivo `LICENSE` para obtener más detalles.
