import { useState } from 'react'
import { AlertErrors } from '../ui'

const EMPTY = {
  matricula: '', vin: '', modelo_id: '', color: '',
  kilometraje: 0, estado: 'disponible', precio_dia: '', ubicacion: ''
}

function validate(f) {
  const errs = []
  if (!f.matricula?.trim()) errs.push('La matrícula es obligatoria.')
  if (!f.modelo_id) errs.push('Seleccione un modelo.')
  if (!f.precio_dia || parseFloat(f.precio_dia) <= 0) errs.push('Ingrese un precio por día válido mayor que 0.')
  return errs
}

export default function VehiculoForm({ initial = EMPTY, modelos = [], onSubmit, submitLabel, cancelHref }) {
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
        modelo_id: parseInt(fields.modelo_id),
        kilometraje: parseInt(fields.kilometraje) || 0,
        precio_dia: parseFloat(fields.precio_dia),
      })
    } catch (err) { setErrors([err.message]) }
    finally { setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AlertErrors errors={errors} onClose={() => setErrors([])} />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="matricula">
            <i className="bi bi-card-text" /> Matrícula *
          </label>
          <input id="matricula" className="form-control" type="text" required maxLength={20}
            value={fields.matricula} onChange={set('matricula')} placeholder="Ej: 1234ABC" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="vin">
            <i className="bi bi-upc-scan" /> VIN
          </label>
          <input id="vin" className="form-control" type="text" maxLength={50}
            value={fields.vin} onChange={set('vin')} placeholder="Número de chasis (opcional)" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="modelo_id">
            <i className="bi bi-list-ul" /> Modelo *
          </label>
          <select id="modelo_id" className="form-select" required
            value={fields.modelo_id} onChange={set('modelo_id')}>
            <option value="">-- Seleccione modelo --</option>
            {modelos.map(m => (
              <option key={m.id} value={m.id}>
                {m.marca} {m.modelo} {m.anio ? `(${m.anio})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="color">
            <i className="bi bi-palette" /> Color
          </label>
          <input id="color" className="form-control" type="text" maxLength={50}
            value={fields.color} onChange={set('color')} placeholder="Ej: Blanco" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="kilometraje">
            <i className="bi bi-speedometer2" /> Kilometraje
          </label>
          <input id="kilometraje" className="form-control" type="number" min={0} step={1}
            value={fields.kilometraje} onChange={set('kilometraje')} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="estado">
            <i className="bi bi-info-circle" /> Estado *
          </label>
          <select id="estado" className="form-select" required
            value={fields.estado} onChange={set('estado')}>
            <option value="disponible">Disponible</option>
            <option value="alquilado">Alquilado</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="reservado">Reservado</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="precio_dia">
            <i className="bi bi-currency-dollar" /> Precio por día *
          </label>
          <input id="precio_dia" className="form-control" type="number" min={0.01} step={0.01} required
            value={fields.precio_dia} onChange={set('precio_dia')} placeholder="Ej: 35.00" />
        </div>

        <div className="form-group form-full">
          <label className="form-label" htmlFor="ubicacion">
            <i className="bi bi-geo-alt" /> Ubicación
          </label>
          <input id="ubicacion" className="form-control" type="text" maxLength={150}
            value={fields.ubicacion} onChange={set('ubicacion')} placeholder="Ej: Madrid - Centro" />
        </div>
      </div>

      <div className="btn-group" style={{ marginTop: '1.5rem' }}>
        <button type="submit" className="btn btn-success btn-lg btn-block" disabled={submitting}>
          <i className="bi bi-check-circle" /> {submitting ? 'Guardando…' : submitLabel}
        </button>
        <a href={cancelHref} className="btn btn-secondary btn-lg btn-block">
          <i className="bi bi-arrow-left" /> Volver a Vehículos
        </a>
      </div>
    </form>
  )
}