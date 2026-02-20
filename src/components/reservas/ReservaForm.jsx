import { useState } from 'react'
import { AlertErrors } from '../ui'

const EMPTY = {
  cliente_id: '', vehiculo_id: '', empleado_id: '',
  estado: 'confirmada', fecha_inicio: '', fecha_fin: '',
  total_estimado: '', notas: ''
}

function validate(f) {
  const errs = []
  if (!f.cliente_id) errs.push('Seleccione un cliente.')
  if (!f.vehiculo_id) errs.push('Seleccione un vehículo.')
  if (!f.fecha_inicio) errs.push('Ingrese la fecha de inicio.')
  if (!f.fecha_fin) errs.push('Ingrese la fecha de fin.')
  if (f.fecha_inicio && f.fecha_fin && f.fecha_inicio > f.fecha_fin)
    errs.push('La fecha de inicio no puede ser posterior a la fecha de fin.')
  if (f.total_estimado && parseFloat(f.total_estimado) < 0)
    errs.push('El total estimado debe ser un número positivo.')
  return errs
}

export default function ReservaForm({ initial = EMPTY, clientes = [], vehiculos = [], empleados = [], onSubmit, submitLabel, cancelHref }) {
  const [fields, setFields] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(fields)
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setSubmitting(true)
    try {
      await onSubmit({
        ...fields,
        cliente_id: parseInt(fields.cliente_id),
        vehiculo_id: parseInt(fields.vehiculo_id),
        empleado_id: fields.empleado_id ? parseInt(fields.empleado_id) : null,
        total_estimado: fields.total_estimado !== '' ? parseFloat(fields.total_estimado) : null,
      })
    } catch (err) { setErrors([err.message]) }
    finally { setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AlertErrors errors={errors} onClose={() => setErrors([])} />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="cliente_id">
            <i className="bi bi-person" /> Cliente *
          </label>
          <select id="cliente_id" className="form-select" required
            value={fields.cliente_id} onChange={set('cliente_id')}>
            <option value="">-- Seleccione cliente --</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido} {c.email ? `— ${c.email}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="vehiculo_id">
            <i className="bi bi-car-front-fill" /> Vehículo *
          </label>
          <select id="vehiculo_id" className="form-select" required
            value={fields.vehiculo_id} onChange={set('vehiculo_id')}>
            <option value="">-- Seleccione vehículo --</option>
            {vehiculos.map(v => (
              <option key={v.id} value={v.id}>
                {v.matricula} {(v.marca || v.modelo_nombre) ? `— ${v.marca ?? ''} ${v.modelo_nombre ?? ''}` : ''} {v.estado ? `(${v.estado})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="empleado_id">
            <i className="bi bi-person-badge" /> Empleado (opcional)
          </label>
          <select id="empleado_id" className="form-select"
            value={fields.empleado_id} onChange={set('empleado_id')}>
            <option value="">-- Ninguno --</option>
            {empleados.map(e => (
              <option key={e.id} value={e.id}>
                {e.nombre} {e.apellido} {e.puesto ? `— ${e.puesto}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="estado">
            <i className="bi bi-info-circle" /> Estado *
          </label>
          <select id="estado" className="form-select" required
            value={fields.estado} onChange={set('estado')}>
            <option value="confirmada">Confirmada</option>
            <option value="activa">Activa</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="fecha_inicio">
            <i className="bi bi-calendar-event" /> Fecha inicio *
          </label>
          <input id="fecha_inicio" className="form-control" type="date" required
            value={fields.fecha_inicio} onChange={set('fecha_inicio')} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="fecha_fin">
            <i className="bi bi-calendar-event" /> Fecha fin *
          </label>
          <input id="fecha_fin" className="form-control" type="date" required
            value={fields.fecha_fin} onChange={set('fecha_fin')} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="total_estimado">
            <i className="bi bi-currency-dollar" /> Total estimado
          </label>
          <input id="total_estimado" className="form-control" type="number" min={0} step={0.01}
            value={fields.total_estimado} onChange={set('total_estimado')} placeholder="Ej: 120.00" />
        </div>

        <div className="form-group form-full">
          <label className="form-label" htmlFor="notas">
            <i className="bi bi-journal-text" /> Notas
          </label>
          <textarea id="notas" className="form-control" rows={4}
            value={fields.notas} onChange={set('notas')} placeholder="Observaciones, condiciones, etc." />
        </div>
      </div>

      <div className="btn-group" style={{ marginTop: '1.5rem' }}>
        <button type="submit" className="btn btn-success btn-lg btn-block" disabled={submitting}>
          <i className="bi bi-check-circle" /> {submitting ? 'Guardando…' : submitLabel}
        </button>
        <a href={cancelHref} className="btn btn-secondary btn-lg btn-block">
          <i className="bi bi-arrow-left" /> Volver a Reservas
        </a>
      </div>
    </form>
  )
}