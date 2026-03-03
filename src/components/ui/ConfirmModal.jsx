import React from "react";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel?.();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Confirmar</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
