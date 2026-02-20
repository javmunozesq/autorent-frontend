import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clientesApi } from '../../api'
import ClienteForm from '../../components/clientes/ClienteForm'
import { AlertSuccess } from '../../components/ui'

export default function EditarCliente() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    clientesApi.getById(id)
      .then(c => setInitial({
        nombre: c.nombre ?? '',
        apellido: c.apellido ?? '',
        email: c.email ?? '',
        telefono: c.telefono ?? '',
        direccion: c.direccion ?? '',
      }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    await clientesApi.update(id, data)
    setSuccess('Cliente actualizado correctamente.')
    setTimeout(() => navigate('/'), 1500)
  }

  if (loading) return (
    <div className="bg-gradient-blue-green" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">
        <h1 className="page-title">Editar Cliente</h1>
        <p className="page-subtitle">Modifica los datos del cliente y guarda los cambios.</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '560px' }}>
            <div className="card">
              <div className="card-header">
                <h2><i className="bi bi-pencil-square" /> Modificar Datos del Cliente</h2>
              </div>
              <div className="card-body">
                <AlertSuccess message={success} />
                {initial && (
                  <ClienteForm
                    initial={initial}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar Cambios"
                    cancelHref="/"
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