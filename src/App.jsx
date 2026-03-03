import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/header'
import Footer from './components/layout/footer'
import Dashboard from './pages/Dashboard'
import { NuevoCliente, EditarCliente } from './pages/clientes'
import { Vehiculos, NuevoVehiculo, EditarVehiculo } from "./pages/vehiculos";
import { Reservas, NuevaReserva, EditarReserva } from "./pages/reservas";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes/nuevo" element={<NuevoCliente />} />
        <Route path="/clientes/editar/:id" element={<EditarCliente />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/vehiculos/nuevo" element={<NuevoVehiculo />} />
        <Route path="/vehiculos/editar/:id" element={<EditarVehiculo />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/reservas/nueva" element={<NuevaReserva />} />
        <Route path="/reservas/editar/:id" element={<EditarReserva />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}