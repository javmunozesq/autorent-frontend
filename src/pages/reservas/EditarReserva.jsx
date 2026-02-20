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
    Promise.all([
      reservasApi.getById(id),
      clientesApi.getAll(),
      vehiculosApi.getAll(),
      empleadosApi.getAll(),
    ])
      .then(([r, c, v, e]) => {
        setInitial({
          cliente_id:     String(r.cliente_id ?? ''),
          vehiculo_id:    String(r.vehiculo_id ?? ''),
          empleado_id:    String(r.empleado_id ?? ''),
          estado:         r.estado ?? 'confirmada',
          fecha_inicio:   r.fecha_inicio?.slice(0, 10) ?? '',
          fecha_fin:      r.fecha_fin?.slice(0, 10) ?? '',
          total_estimado: r.total_estimado != null ? String(r.total_estimado) : '',
          notas:          r.notas ?? '',
        })
        setClientes(c)
        setVehiculos(v)
        setEmpleados(e)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    await reservasApi.update(id, data)
    setSuccess('Reserva actualizada correctamente.')
    setTimeout(() => navigate('/reservas'), 1500)
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
                {initial && (
                  <ReservaForm
                    initial={initial}
                    clientes={clientes}
                    vehiculos={vehiculos}
                    empleados={empleados}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar Cambios"
                    cancelHref="/reservas"
                  />
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