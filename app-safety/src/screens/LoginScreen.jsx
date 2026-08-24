import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuditStore from '../store/useAuditStore.js'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'

export default function LoginScreen() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const storeLogin = useAuditStore((s) => s.login)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!login.trim() || !password.trim()) {
      setError('Заполните все поля')
      return
    }
    storeLogin()
    navigate('/checklist', { replace: true })
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--color-bg)',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: 'var(--color-text)',
    background: 'var(--color-bg)',
    outline: 'none',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
      }}
    >
      <Card style={{ width: '360px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>МедАудит</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '24px' }}>
          Войдите для продолжения
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <p style={{ color: 'var(--color-no)', fontSize: '13px' }}>{error}</p>
          )}

          <Button type="submit" style={{ marginTop: '4px' }}>Войти</Button>
        </form>
      </Card>
    </div>
  )
}
