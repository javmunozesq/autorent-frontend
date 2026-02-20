import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { vehiculosApi } from '../../api'
import VehiculoForm from '../../components/vehiculos/VehiculoForm'
import { AlertSuccess } from '../../components/ui'

export default function EditarVehiculo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)
  const [modelos, setModelos] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    Promise.all([
      vehiculosApi.getById(id),
      vehiculosApi.getModelos(),
    ])
      .then(([v, m]) => {
        setInitial({
          ...v,
          modelo_id: String(v.modelo_id ?? ''),
          kilometraje: v.kilometraje ?? 0,
          precio_dia: v.precio_dia != null ? String(v.precio_dia) : '',
          vin: v.vin ?? '',
          color: v.color ?? '',
          ubicacion: v.ubicacion ?? '',
        })
        setModelos(m)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    await vehiculosApi.update(id, data)
    setSuccess('Vehículo actualizado correctamente.')
    setTimeout(() => navigate('/vehiculos'), 1500)
  }

  if (loading) return (
    <div className="bg-gradient-blue-green" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">
        <h1 className="page-title">Editar Vehículo</h1>
        <p className="page-subtitle">Modifique los datos del vehículo y guarde los cambios.</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '680px' }}>
            <div className="card">
              <div className="card-header">
                <h2><i className="bi bi-pencil-square" /> Modificar Vehículo</h2>
              </div>
              <div className="card-body">
                <AlertSuccess message={success} />
                {initial && (
                  <VehiculoForm
                    initial={initial}
                    modelos={modelos}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar Cambios"
                    cancelHref="/vehiculos"
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