import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reservasApi, clientesApi, vehiculosApi, empleadosApi } from '../../api'
import ReservaForm from '../../components/reservas/ReservaForm'
import { AlertSuccess } from '../../components/ui'

export default function NuevaReserva() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      clientesApi.getAll().catch(err => { console.error('clientesApi.getAll', err); return [] }),
      vehiculosApi.getAll().catch(err => { console.error('vehiculosApi.getAll', err); return [] }),
      empleadosApi.getAll().catch(err => { console.error('empleadosApi.getAll', err); return [] }),
    ])
      .then(([cRes, vRes, eRes]) => {
        const unwrap = (x) => (x == null ? [] : (x.data !== undefined ? x.data : x))
        setClientes(Array.isArray(unwrap(cRes?.value ?? cRes)) ? unwrap(cRes?.value ?? cRes) : [])
        setVehiculos(Array.isArray(unwrap(vRes?.value ?? vRes)) ? unwrap(vRes?.value ?? vRes) : [])
        setEmpleados(Array.isArray(unwrap(eRes?.value ?? eRes)) ? unwrap(eRes?.value ?? eRes) : [])
      })
      .catch((err) => {
        console.error('Error cargando listas para nueva reserva:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (data) => {
    try {
      const created = await reservasApi.create(data)
      setSuccess('Reserva creada correctamente.')
      setTimeout(() => navigate('/reservas', { state: { refresh: true, created } }), 900)
      return created
    } catch (err) {
      console.error('Error crear reserva:', err)
      throw err
    }
  }

  if (loading) return (
    <div className="bg-gradient-blue-green" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">
        <h1 className="page-title">Crear Nueva Reserva</h1>
        <p className="page-subtitle">Rellena los datos para registrar una nueva reserva.</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '760px' }}>
            <div className="card">
              <div className="card-header">
                <h2><i className="bi bi-calendar-plus" /> Nueva Reserva</h2>
              </div>
              <div className="card-body">
                <AlertSuccess message={success} />
                <ReservaForm
                  initial={null}
                  clientes={clientes}
                  vehiculos={vehiculos}
                  empleados={empleados}
                  onSubmit={handleSubmit}
                  submitLabel="Crear Reserva"
                  cancelHref="/reservas"
                />
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '.8rem' }}>
                  Nota: la comprobación de disponibilidad se realiza en el servidor.
                </p>
              </div>
              <div className="card-footer-note">Los campos marcados con * son obligatorios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}