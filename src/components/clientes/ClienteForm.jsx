import { useState } from 'react'
import { AlertErrors } from '../ui'

const EMPTY = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' }

function validate(fields) {
  const errs = []
  if (!fields.nombre || fields.nombre.trim().length < 2) errs.push('Nombre inválido. Debe tener al menos 2 caracteres.')
  if (!fields.apellido || fields.apellido.trim().length < 2) errs.push('Apellido inválido. Debe tener al menos 2 caracteres.')
  if (!fields.email || !fields.email.includes('@')) errs.push('Email inválido.')
  return errs
}

export default function ClienteForm({ initial = EMPTY, onSubmit, submitLabel, cancelHref }) {
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
    try { await onSubmit(fields) }
    catch (err) { setErrors([err.message]) }
    finally { setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AlertErrors errors={errors} onClose={() => setErrors([])} />

      <div className="form-group">
        <label className="form-label" htmlFor="nombre">
          <i className="bi bi-person" /> Nombre *
        </label>
        <input id="nombre" className="form-control" type="text" required
          value={fields.nombre} onChange={set('nombre')} placeholder="Ingrese el nombre" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="apellido">
          <i className="bi bi-person" /> Apellido *
        </label>
        <input id="apellido" className="form-control" type="text" required
          value={fields.apellido} onChange={set('apellido')} placeholder="Ingrese el apellido" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          <i className="bi bi-envelope" /> Email *
        </label>
        <input id="email" className="form-control" type="email" required
          value={fields.email} onChange={set('email')} placeholder="ejemplo@correo.com" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="telefono">
          <i className="bi bi-telephone" /> Teléfono
        </label>
        <input id="telefono" className="form-control" type="tel"
          value={fields.telefono} onChange={set('telefono')} placeholder="Ingrese el teléfono" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="direccion">
          <i className="bi bi-geo-alt" /> Dirección
        </label>
        <textarea id="direccion" className="form-control" rows={3}
          value={fields.direccion} onChange={set('direccion')} placeholder="Ingrese la dirección" />
      </div>

      <div className="btn-group" style={{ marginTop: '1.5rem' }}>
        <button type="submit" className="btn btn-success btn-lg btn-block" disabled={submitting}>
          <i className="bi bi-check-circle" /> {submitting ? 'Guardando…' : submitLabel}
        </button>
        <a href={cancelHref} className="btn btn-secondary btn-lg btn-block">
          <i className="bi bi-x-circle" /> Cancelar
        </a>
      </div>
    </form>
  )
}