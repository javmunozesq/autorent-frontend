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
    setLoading(true)
    Promise.all([
      vehiculosApi.getById(id).catch(err => { console.error('vehiculosApi.getById error', err); return null }),
      vehiculosApi.getModelos().catch(err => { console.error('vehiculosApi.getModelos error', err); return [] }),
    ])
      .then(([vRaw, mRaw]) => {
        console.debug('EditarVehiculo - raw responses:', { vRaw, mRaw })

        const unwrap = (x) => {
          if (x == null) return null
          return x.data !== undefined ? x.data : x
        }

        const v = unwrap(vRaw)
        const m = Array.isArray(unwrap(mRaw)) ? unwrap(mRaw) : []

        console.debug('EditarVehiculo - unwrapped:', { v, modelosCount: m.length })

        if (!v) {
          console.error('EditarVehiculo: vehículo no encontrado o formato inesperado', vRaw)
          setInitial(null)
        } else {
          setInitial({
            id: v.id,
            matricula: v.matricula ?? '',
            vin: v.vin ?? '',
            modelo_id: v.modelo_id != null ? String(v.modelo_id) : (v.modeloId != null ? String(v.modeloId) : ''),
            color: v.color ?? '',
            kilometraje: v.kilometraje != null ? String(v.kilometraje) : '0',
            estado: v.estado ?? 'disponible',
            precio_dia: v.precio_dia != null ? String(v.precio_dia) : (v.precioDia != null ? String(v.precioDia) : ''),
            ubicacion: v.ubicacion ?? '',
          })
        }

        setModelos(m)
      })
      .catch((err) => {
        console.error('Error Promise.all EditarVehiculo:', err)
        setInitial(null)
      })
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
                {initial ? (
                  <VehiculoForm
                    initial={initial}
                    modelos={modelos}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar Cambios"
                    cancelHref="/vehiculos"
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