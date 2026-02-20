import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reservasApi, clientesApi, vehiculosApi } from '../../api'
import ReservaDetailModal from '../../components/reservas/ReservaDetailModal'
import { LoadingSpinner, StatusBadge, ConfirmModal } from '../../components/ui'

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReserva, setSelectedReserva] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [r, c, v] = await Promise.all([
        reservasApi.getAll(),
        clientesApi.getAll(),
        vehiculosApi.getAll(),
      ])
      setReservas(r)
      setClientes(c)
      setVehiculos(v)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    try {
      await reservasApi.delete(confirmDelete)
      setConfirmDelete(null)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  const disponibles = vehiculos.filter(v => v.estado === 'disponible')

  if (loading) return <div className="bg-gradient-blue-green"><LoadingSpinner /></div>

  return (
    <div className="bg-gradient-blue-green">
      <div className="container">

        <div className="toolbar">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>Reservas</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', margin: 0 }}>Gestiona las reservas de clientes y el estado de la flota</p>
          </div>
          <Link to="/reservas/nueva" className="btn btn-success">
            <i className="bi bi-calendar-plus" /> Nueva Reserva
          </Link>
        </div>

        <section className="section-card">
          <div style={{ padding: 0 }}>
            {reservas.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-calendar-x" />
                No hay reservas registradas. <Link to="/reservas/nueva">Crear una reserva</Link>.
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Vehículo</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Estado</th>
                        <th>Total estimado</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map(r => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>
                            {(r.cliente_nombre || r.cliente_apellido)
                              ? `${r.cliente_nombre ?? ''} ${r.cliente_apellido ?? ''}`.trim()
                              : `ID ${r.cliente_id}`}
                          </td>
                          <td>{r.vehiculo_matricula ?? `ID ${r.vehiculo_id}`}</td>
                          <td>{r.fecha_inicio}</td>
                          <td>{r.fecha_fin}</td>
                          <td><StatusBadge status={r.estado} /></td>
                          <td>
                            {r.total_estimado != null
                              ? `${parseFloat(r.total_estimado).toFixed(2)} €`
                              : '-'}
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              style={{ marginRight: '.3rem' }}
                              onClick={() => setSelectedReserva(r)}
                              title="Ver detalle"
                            >
                              <i className="bi bi-eye" />
                            </button>
                            <Link
                              to={`/reservas/editar/${r.id}`}
                              className="btn btn-sm btn-outline-secondary"
                              style={{ marginRight: '.3rem' }}
                            >
                              <i className="bi bi-pencil" />
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setConfirmDelete(r.id)}
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
                  Total reservas: <strong>{reservas.length}</strong>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Paneles laterales */}
        <div className="side-panels">
          <div className="panel">
            <h6>Clientes recientes</h6>
            {clientes.length === 0 ? (
              <p className="muted">No hay clientes registrados.</p>
            ) : (
              <ul>
                {clientes.slice(0, 6).map(c => (
                  <li key={c.id}>
                    {c.nombre} {c.apellido} <span className="muted">— {c.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="panel">
            <h6>Vehículos disponibles</h6>
            {disponibles.length === 0 ? (
              <p className="muted">No hay vehículos disponibles.</p>
            ) : (
              <ul>
                {disponibles.slice(0, 6).map(v => (
                  <li key={v.id}>
                    {v.matricula} <span className="muted">— {v.marca ?? ''} {v.modelo_nombre ?? ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {selectedReserva && (
        <ReservaDetailModal
          reserva={selectedReserva}
          onClose={() => setSelectedReserva(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Eliminar Reserva"
          message="¿Desea eliminar esta reserva? No podrá recuperarse."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}