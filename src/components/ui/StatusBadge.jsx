export default function StatusBadge({ status }) {
  const map = {
    activo: "badge badge-success",
    reservado: "badge badge-warning",
    inactivo: "badge badge-secondary",
  };
  const cls = map[status] ?? "badge badge-light";
  return <span className={cls}>{status ?? "desconocido"}</span>;
}