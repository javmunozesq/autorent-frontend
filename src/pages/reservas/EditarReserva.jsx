import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { reservasApi, clientesApi, vehiculosApi, empleadosApi } from '../../api'
import ReservaForm from '../../components/reservas/ReservaForm'
import { AlertSuccess } from '../../components/ui'

export default function EditarReserva() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      reservasApi.getById(id).catch(err => { console.error('reservasApi.getById error', err); return null }),
      clientesApi.getAll().catch(err => { console.error('clientesApi.getAll error', err); return [] }),
      vehiculosApi.getAll().catch(err => { console.error('vehiculosApi.getAll error', err); return [] }),
      empleadosApi.getAll().catch(err => { console.error('empleadosApi.getAll error', err); return [] }),
    ])
      .then(([rRes, cRes, vRes, eRes]) => {
        const unwrap = (x) => (x == null ? null : (x.data !== undefined ? x.data : x))
        const r = unwrap(rRes?.value ?? rRes)
        const c = unwrap(cRes?.value ?? cRes) || []
        const v = unwrap(vRes?.value ?? vRes) || []
        const e = unwrap(eRes?.value ?? eRes) || []

        const toDate = (s) => {
          if (!s) return ''
          return String(s).slice(0, 10).replace(' ', 'T') // keep YYYY-MM-DD
        }

        if (!r) {
          console.error('EditarReserva: reserva no encontrada', rRes)
          setInitial(null)
        } else {
          setInitial({
            cliente_id:     String(r.cliente_id ?? r.clienteId ?? ''),
            vehiculo_id:    String(r.vehiculo_id ?? r.vehiculoId ?? ''),
            empleado_id:    (r.empleado_id ?? r.empleadoId) != null ? String(r.empleado_id ?? r.empleadoId) : '',
            estado:         r.estado ?? 'pendiente',
            fecha_inicio:   toDate(r.fecha_inicio ?? r.fechaInicio),
            fecha_fin:      toDate(r.fecha_fin ?? r.fechaFin),
            total_estimado: (r.total_estimado ?? r.totalEstimado) != null ? String(r.total_estimado ?? r.totalEstimado) : '',
            notas:          r.notas ?? '',
          })
        }

        setClientes(Array.isArray(c) ? c : [])
        setVehiculos(Array.isArray(v) ? v : [])
        setEmpleados(Array.isArray(e) ? e : [])
      })
      .catch((err) => {
        console.error('Error Promise.all EditarReserva:', err)
        setInitial(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    try {
      const updated = await reservasApi.update(id, data) // devuelve payload
      setSuccess('Reserva actualizada correctamente.')
      // navegar pasando el objeto actualizado para que la lista lo use
      setTimeout(() => navigate('/reservas', { state: { refresh: true, updated } }), 900)
      return updated
    } catch (err) {
      console.error('Error actualizar reserva:', err)
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
        <h1 className="page-title">Editar Reserva</h1>
        <p className="page-subtitle">Actualiza los datos de la reserva y guarda los cambios.</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '760px' }}>
            <div className="card">
              <div className="card-header">
                <h2><i className="bi bi-calendar-check" /> Modificar Reserva</h2>
              </div>
              <div className="card-body">
                <AlertSuccess message={success} />
                {initial ? (
                  <ReservaForm
                    initial={initial}
                    clientes={clientes}
                    vehiculos={vehiculos}
                    empleados={empleados}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar Cambios"
                    cancelHref="/reservas"
                  />
                ) : (
                  <div>Datos no disponibles para editar.</div>
                )}
              </div>
              <div className="card-footer-note">Los campos marcados con * son obligatorios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}