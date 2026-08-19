import { NavLink } from 'react-router-dom'
import useAuditStore from '../../store/useAuditStore.js'
import Button from '../ui/Button.jsx'

const links = [
  { to: '/checklist', label: 'Проверка' },
  { to: '/matrix',    label: 'Матрица' },
  { to: '/registry',  label: 'Реестр' },
  { to: '/chief',     label: 'Кабинет главврача' },
]

const navStyle = (isActive) => ({
  display: 'block',
  padding: '10px 16px',
  borderRadius: 'var(--radius)',
  fontWeight: isActive ? 700 : 400,
  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
  background: isActive ? 'var(--color-bg)' : 'transparent',
})

export default function Sidebar() {
  const logout = useAuditStore((s) => s.logout)

  return (
    <nav
      style={{
        width: '220px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '16px 12px',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-bg)',
        minHeight: '100%',
      }}
    >
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} style={({ isActive }) => navStyle(isActive)}>
          {l.label}
        </NavLink>
      ))}
      <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <Button variant="ghost" style={{ width: '100%' }} onClick={logout}>
          Выйти
        </Button>
      </div>
    </nav>
  )
}
