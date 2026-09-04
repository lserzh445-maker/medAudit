import { NavLink } from 'react-router-dom'
import { BLOCK } from '../../config/block.js'
import useAuditStore from '../../store/useAuditStore.js'

const LINKS = [
  { to: '/checklist', label: 'Проверка' },
  { to: '/matrix',    label: 'Матрица' },
  { to: '/registry',  label: 'Реестр' },
  { to: '/chief',     label: 'Кабинет главврача' },
]

export default function AppShell({ children }) {
  const logout = useAuditStore((s) => s.logout)
  const resetSession = useAuditStore((s) => s.resetSession)
  const handleReset = () => {
    if (window.confirm('Сбросить все ответы, проблемы и решение? Действие необратимо.')) {
      resetSession()
    }
  }
  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="bar">
        <div className="bar-inner">
          <div className="bar-row1">
            <div className="brand">
              <span className="logo">✓</span>
              Аудит готовности здания МО · {BLOCK.title}
            </div>
            <div className="bar-actions">
              <button type="button" className="bar-reset" onClick={handleReset}>Сбросить</button>
              <button type="button" className="bar-logout" onClick={logout}>Выйти</button>
            </div>
          </div>
          <nav className="tabs">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <main className="app-main">{children}</main>
    </div>
  )
}
