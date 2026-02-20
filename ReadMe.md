# Autorent — Frontend React

Frontend en React para el sistema de gestión de alquiler de vehículos Autorent, migrado desde templates Jinja2 a una SPA conectada a la API REST.

## Stack

- **React 18** + **React Router 6** — SPA con rutas cliente
- **Vite** — bundler y servidor de desarrollo
- **CSS propio** — sin framework externo, diseño fiel al original Bootstrap
- **Bootstrap Icons** — iconografía (CDN)

## Estructura

```
src/
├── api/index.js              # Capa de acceso a la API REST
├── components/
│   ├── layout/               # Header + Footer
│   ├── ui/index.jsx          # AlertErrors, StatusBadge, ConfirmModal, Spinner
│   ├── clientes/ClienteForm  # Formulario reutilizable
│   ├── vehiculos/VehiculoForm
│   └── reservas/ReservaForm + ReservaDetailModal
├── pages/
│   ├── Dashboard.jsx
│   ├── clientes/index.jsx    # NuevoCliente + EditarCliente
│   ├── vehiculos/index.jsx   # Vehiculos + NuevoVehiculo + EditarVehiculo
│   └── reservas/index.jsx    # Reservas + NuevaReserva + EditarReserva
├── App.jsx                   # Router principal
└── main.jsx
```

## Instalación

```bash
cd autorent-frontend
npm install
```

## Configuración

Copia el archivo de entorno y ajusta la URL de tu API:

```bash
cp .env.example .env
```

Edita `.env`:

```env
# Si usas el proxy de Vite (recomendado en desarrollo):
VITE_API_URL=/api

# O apunta directamente al backend:
VITE_API_URL=http://localhost:8000
```

El proxy está preconfigurado en `vite.config.js`: todo lo que llegue a `/api` se redirige a `http://localhost:8000` quitando el prefijo `/api`. Ajústalo si tu backend está en otro puerto.

## Desarrollo

```bash
npm run dev
```

Accede a `http://localhost:5173`.

## Producción

```bash
npm run build
# Los estáticos quedan en /dist
```

## Rutas disponibles

| Ruta | Página |
|------|--------|
| `/` | Dashboard (panel general) |
| `/clientes/nuevo` | Crear cliente |
| `/clientes/editar/:id` | Editar cliente |
| `/vehiculos` | Listado de flota |
| `/vehiculos/nuevo` | Crear vehículo |
| `/vehiculos/editar/:id` | Editar vehículo |
| `/reservas` | Listado de reservas |
| `/reservas/nueva` | Crear reserva |
| `/reservas/editar/:id` | Editar reserva |

## Adaptación a tu API

En `src/api/index.js` están definidos todos los endpoints. Si tu API usa rutas distintas (p.ej. `/api/v1/clientes` en lugar de `/clientes`), solo tienes que cambiarlas ahí. El `BASE` se toma de `VITE_API_URL`.