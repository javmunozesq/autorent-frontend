import { StatusBadge } from '../ui'
import { Link } from 'react-router-dom'

export default function ReservaDetailModal({ reserva, onClose }) {
  if (!reserva) return null

  const cliente = `${reserva.cliente_nombre ?? ''} ${reserva.cliente_apellido ?? ''}`.trim() || `ID ${reserva.cliente_id}`
  const vehiculo = reserva.vehiculo_matricula ?? `ID ${reserva.vehiculo_id}`
  const total = reserva.total_estimado != null
    ? `${parseFloat(reserva.total_estimado).toFixed(2)} €`
    : '-'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5><i className="bi bi-calendar-check" /> Detalles de la Reserva</h5>
          <button className="modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">ID</span>
                <span className="detail-value">{reserva.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cliente</span>
                <span className="detail-value">{cliente}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehículo</span>
                <span className="detail-value">{vehiculo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <span className="detail-value"><StatusBadge status={reserva.estado} /></span>
              </div>
            </div>
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">Inicio</span>
                <span className="detail-value">{reserva.fecha_inicio}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fin</span>
                <span className="detail-value">{reserva.fecha_fin}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Reservado</span>
                <span className="detail-value">{reserva.fecha_reserva ?? '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total</span>
                <span className="detail-value">{total}</span>
              </div>
            </div>
          </div>
          {reserva.notas && (
            <div style={{ marginTop: '1rem' }}>
              <p className="detail-label">Notas</p>
              <p style={{ marginTop: '.35rem', fontSize: '.9rem' }}>{reserva.notas}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Link to={`/reservas/editar/${reserva.id}`} className="btn btn-outline-secondary">
            <i className="bi bi-pencil" /> Editar
          </Link>
          <button className="btn btn-secondary" onClick={onClose}>
            <i className="bi bi-x-circle" /> Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}