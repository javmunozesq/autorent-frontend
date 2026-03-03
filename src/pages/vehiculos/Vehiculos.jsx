import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { vehiculosApi, reservasApi } from '../../api'
import { LoadingSpinner, StatusBadge, ConfirmModal } from '../../components/ui'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [modelos, setModelos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      // Cargar vehículos primero (es crítico)
      const v = await vehiculosApi.getAll()
      console.log("vehiculos raw:", v)

      // Intentos independientes para modelos, categorías y reservas.
      // Usamos Promise.allSettled para que un 404/500 en modelos/categorias no rompa todo.
      const results = await Promise.allSettled([
        // métodos pueden estar en vehiculosApi o en otros módulos; aquí usamos vehiculosApi.getModelos/getCategorias
        (vehiculosApi.getModelos ? vehiculosApi.getModelos() : Promise.resolve([])),
        (vehiculosApi.getCategorias ? vehiculosApi.getCategorias() : Promise.resolve([])),
        (reservasApi.getAll ? reservasApi.getAll() : Promise.resolve([])),
      ])

      const modelosResp = results[0].status === 'fulfilled' ? results[0].value : []
      const categoriasResp = results[1].status === 'fulfilled' ? results[1].value : []
      const reservasResp = results[2].status === 'fulfilled' ? results[2].value : []

      if (results[0].status === 'rejected') console.warn("Modelos no cargados:", results[0].reason)
      if (results[1].status === 'rejected') console.warn("Categorías no cargadas:", results[1].reason)
      if (results[2].status === 'rejected') console.warn("Reservas no cargadas:", results[2].reason)

      // Crear set de vehiculos reservados (ajusta el campo según tu API: aquí asumimos reserva.vehiculo_id)
      const vehiculosReservados = new Set(
        (Array.isArray(reservasResp) ? reservasResp : []).map(r => Number(r.vehiculo_id))
      )

      // Añadir flag 'reservado' a cada vehículo
      const vehiculosConFlag = (Array.isArray(v) ? v : []).map(item => ({
        ...item,
        reservado: vehiculosReservados.has(Number(item.id))
      }))

      setVehiculos(vehiculosConFlag)
      setModelos(Array.isArray(modelosResp) ? modelosResp : [])
      setCategorias(Array.isArray(categoriasResp) ? categoriasResp : [])
    } catch (e) {
      console.error("Error cargando datos de vehículos:", e)
      setError(e.message || String(e))
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
            {error && (
              <div style={{ padding: 12, color: 'var(--danger)', background: 'rgba(255,0,0,0.03)', marginBottom: 12 }}>
                Error cargando datos: {error}
              </div>
            )}

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
                          <td style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <StatusBadge status={v.estado} />
                            {v.reservado && <span className="badge badge-warning" title="Vehículo con reserva">Reservado</span>}
                          </td>
                          <td>{Number(v.precio_dia || 0).toFixed(2)} €</td>
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