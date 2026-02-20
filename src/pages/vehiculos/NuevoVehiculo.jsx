import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehiculosApi } from '../../api'
import VehiculoForm from '../../components/vehiculos/VehiculoForm'
import { AlertSuccess } from '../../components/ui'

export default function NuevoVehiculo() {
  const navigate = useNavigate()
  const [modelos, setModelos] = useState([])
  const [success, setSuccess] = useState('')

  useEffect(() => {
    vehiculosApi.getModelos().then(setModelos).catch(console.error)
  }, [])

  const handleSubmit = async (data) => {
    await vehiculosApi.create(data)
    setSuccess('Vehículo creado correctamente.')
    setTimeout(() => navigate('/vehiculos'), 1500)
  }

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">
        <h1 className="page-title">Agregar Nuevo Vehículo</h1>
        <p className="page-subtitle">Complete el formulario para registrar un vehículo en el sistema.</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '680px' }}>
            <div className="card">
              <div className="card-header">
                <h2><i className="bi bi-car-front-fill" /> Datos del Vehículo</h2>
              </div>
              <div className="card-body">
                <AlertSuccess message={success} />
                <VehiculoForm
                  modelos={modelos}
                  onSubmit={handleSubmit}
                  submitLabel="Guardar Vehículo"
                  cancelHref="/vehiculos"
                />
              </div>
              <div className="card-footer-note">Los campos marcados con * son obligatorios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}