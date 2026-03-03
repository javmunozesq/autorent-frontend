import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <NavLink to="/" className="brand">
            <img src="/logo_autorent.svg" alt="Autorent" className="brand-icon" />
            Autorent
          </NavLink>
          <nav>
            <ul className="nav-links">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="bi bi-speedometer2" />
                  <span>Panel</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/vehiculos" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="bi bi-car-front" />
                  <span>Vehículos</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/reservas" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="bi bi-calendar-check" />
                  <span>Reservas</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/clientes/nuevo" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="bi bi-person-plus" />
                  <span>Nuevo Cliente</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}