import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clientesApi, vehiculosApi, reservasApi } from '../../api'
import { LoadingSpinner, ConfirmModal, StatusBadge } from '../../components/ui'

export default function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null) // { type, id }

  const load = async () => {
    setLoading(true)
    try {
      const [c, v, r] = await Promise.all([
        clientesApi.getAll(),
        vehiculosApi.getAll(),
        reservasApi.getAll(),
      ])
      setClientes(c)
      setVehiculos(v)
      setReservas(r)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      if (confirmDelete.type === 'cliente') await clientesApi.delete(confirmDelete.id)
      if (confirmDelete.type === 'reserva') await reservasApi.delete(confirmDelete.id)
      setConfirmDelete(null)
      load()
    } catch (e) { alert(e.message) }
  }

  if (loading) return <div className="bg-gradient-blue-green"><LoadingSpinner /></div>

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">
        <h1 className="page-title">Autorent — Panel de administración</h1>
        <p className="page-subtitle">Gestiona clientes, vehículos y reservas de forma sencilla.</p>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-actions">
            <Link to="/clientes/nuevo" className="btn btn-primary">
              <i className="bi bi-person-plus" /> Nuevo Cliente
            </Link>
            <Link to="/vehiculos/nuevo" className="btn btn-outline-primary">
              <i className="bi bi-car-front-fill" /> Nuevo Vehículo
            </Link>
            <Link to="/reservas/nueva" className="btn btn-success">
              <i className="bi bi-calendar-plus" /> Nueva Reserva
            </Link>
          </div>
          <span className="toolbar-info">Total clientes: <strong>{clientes.length}</strong></span>
        </div>

        {/* Clientes */}
        <section className="section-card">
          <div className="section-header">
            <h5><i className="bi bi-people" style={{ marginRight: '.4rem' }} />Clientes</h5>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            {clientes.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-person-x" />
                No hay clientes registrados. <Link to="/clientes/nuevo">Crear uno</Link>.
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.nombre} {c.apellido}</td>
                        <td>{c.email}</td>
                        <td>{c.telefono || '-'}</td>
                        <td>{c.direccion || '-'}</td>
                        <td className="text-end">
                          <Link to={`/clientes/editar/${c.id}`} className="btn btn-sm btn-outline-secondary" style={{ marginRight: '.3rem' }}>
                            <i className="bi bi-pencil" />
                          </Link>
                          <button className="btn btn-sm btn-danger"
                            onClick={() => setConfirmDelete({ type: 'cliente', id: c.id })}>
                            <i className="bi bi-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Vehículos (resumen) */}
        <section className="section-card">
          <div className="section-header">
            <h5><i className="bi bi-car-front" style={{ marginRight: '.4rem' }} />Vehículos (resumen)</h5>
          </div>
          <div style={{ padding: '0' }}>
            {vehiculos.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-car-front" />
                No hay vehículos. <Link to="/vehiculos/nuevo">Añadir vehículo</Link>.
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Matrícula</th><th>Modelo</th><th>Estado</th><th>Precio/día</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiculos.slice(0, 8).map(v => (
                        <tr key={v.id}>
                          <td>{v.id}</td>
                          <td>{v.matricula}</td>
                          <td>{v.marca ? `${v.marca} ${v.modelo_nombre ?? ''}` : `ID ${v.modelo_id}`}</td>
                          <td><StatusBadge status={v.estado} /></td>
                          <td>{parseFloat(v.precio_dia).toFixed(2)} €</td>
                          <td className="text-end">
                            <Link to={`/vehiculos/editar/${v.id}`} className="btn btn-sm btn-outline-secondary">
                              <i className="bi bi-pencil" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '.75rem 1rem' }}>
                  <Link to="/vehiculos" className="btn btn-link">Ver todos los vehículos</Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Reservas (resumen) */}
        <section className="section-card" style={{ marginBottom: '2rem' }}>
          <div className="section-header">
            <h5><i className="bi bi-calendar-week" style={{ marginRight: '.4rem' }} />Reservas recientes</h5>
          </div>
          <div style={{ padding: '0' }}>
            {reservas.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-calendar-x" />
                No hay reservas. <Link to="/reservas/nueva">Crear reserva</Link>.
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Cliente ID</th><th>Matrícula</th><th>Inicio</th><th>Fin</th>
                        <th>Estado</th><th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.slice(0, 10).map(r => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.cliente_id}</td>
                          <td>{r.vehiculo_id}</td>
                          <td>{r.fecha_inicio}</td>
                          <td>{r.fecha_fin}</td>
                          <td><StatusBadge status={r.estado} /></td>
                          <td className="text-end">
                            <Link to={`/reservas/editar/${r.id}`} className="btn btn-sm btn-outline-secondary" style={{ marginRight: '.3rem' }}>
                              <i className="bi bi-pencil" />
                            </Link>
                            <button className="btn btn-sm btn-danger"
                              onClick={() => setConfirmDelete({ type: 'reserva', id: r.id })}>
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '.75rem 1rem' }}>
                  <Link to="/reservas" className="btn btn-link">Ver todas las reservas</Link>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Confirmar Eliminación"
          message={`¿Está seguro que desea eliminar este ${confirmDelete.type}?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}