import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientesApi } from '../../api'
import ClienteForm from '../../components/clientes/ClienteForm'
import { AlertSuccess } from '../../components/ui'

export default function NuevoCliente() {
  const navigate = useNavigate()
  const [success, setSuccess] = useState('')

  const handleSubmit = async (data) => {
    await clientesApi.create(data)
    setSuccess('Cliente creado correctamente.')
    setTimeout(() => navigate('/'), 1500)
  }

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">
        <h1 className="page-title">Agregar Nuevo Cliente</h1>
        <p className="page-subtitle">Complete el formulario para registrar un nuevo cliente en el sistema.</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '560px' }}>
            <div className="card">
              <div className="card-header">
                <h2><i className="bi bi-person-plus-fill" /> Datos del Cliente</h2>
              </div>
              <div className="card-body">
                <AlertSuccess message={success} />
                <ClienteForm
                  onSubmit={handleSubmit}
                  submitLabel="Guardar Cliente"
                  cancelHref="/"
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