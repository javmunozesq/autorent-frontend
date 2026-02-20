import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { vehiculosApi } from '../../api'
import { LoadingSpinner, StatusBadge, ConfirmModal } from '../../components/ui'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [modelos, setModelos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [v, m, c] = await Promise.all([
        vehiculosApi.getAll(),
        vehiculosApi.getModelos(),
        vehiculosApi.getCategorias(),
      ])
      setVehiculos(v)
      setModelos(m)
      setCategorias(c)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    try {
      await vehiculosApi.delete(confirmDelete)
      setConfirmDelete(null)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  if (loading) return <div className="bg-gradient-blue-green"><LoadingSpinner /></div>

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">

        <div className="toolbar">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>Vehículos</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', margin: 0 }}>Listado y gestión de la flota</p>
          </div>
          <Link to="/vehiculos/nuevo" className="btn btn-primary">
            <i className="bi bi-plus-lg" /> Nuevo Vehículo
          </Link>
        </div>

        <section className="section-card">
          <div style={{ padding: 0 }}>
            {vehiculos.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-car-front" />
                No hay vehículos registrados. <Link to="/vehiculos/nuevo">Añadir vehículo</Link>.
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Matrícula</th>
                        <th>VIN</th>
                        <th>Marca / Modelo</th>
                        <th>Color</th>
                        <th>Kms</th>
                        <th>Estado</th>
                        <th>Precio/día</th>
                        <th>Ubicación</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiculos.map(v => (
                        <tr key={v.id}>
                          <td>{v.id}</td>
                          <td><strong>{v.matricula}</strong></td>
                          <td>{v.vin || '-'}</td>
                          <td>
                            {(v.marca || v.modelo_nombre)
                              ? `${v.marca ?? ''} ${v.modelo_nombre ?? ''}`.trim()
                              : `ID ${v.modelo_id}`}
                          </td>
                          <td>{v.color || '-'}</td>
                          <td>{v.kilometraje || 0}</td>
                          <td><StatusBadge status={v.estado} /></td>
                          <td>{parseFloat(v.precio_dia).toFixed(2)} €</td>
                          <td>{v.ubicacion || '-'}</td>
                          <td className="text-end">
                            <Link
                              to={`/vehiculos/editar/${v.id}`}
                              className="btn btn-sm btn-outline-secondary"
                              style={{ marginRight: '.3rem' }}
                            >
                              <i className="bi bi-pencil" />
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setConfirmDelete(v.id)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '.65rem 1rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                  Total vehículos: <strong>{vehiculos.length}</strong>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Paneles laterales */}
        <div className="side-panels">
          <div className="panel">
            <h6>Modelos</h6>
            {modelos.length === 0 ? (
              <p className="muted">No hay modelos registrados.</p>
            ) : (
              <ul>
                {modelos.map(m => (
                  <li key={m.id}>
                    <strong>{m.marca}</strong> {m.modelo} {m.anio ? `(${m.anio})` : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="panel">
            <h6>Categorías</h6>
            {categorias.length === 0 ? (
              <p className="muted">No hay categorías definidas.</p>
            ) : (
              <ul>
                {categorias.map(c => (
                  <li key={c.id}>
                    <strong>{c.nombre}</strong> <span className="muted">— {c.descripcion ?? ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Confirmar Eliminación"
          message="¿Está seguro que desea eliminar este vehículo?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}