import { BLOCK } from '../../config/block.js'
import Sidebar from './Sidebar.jsx'

export default function AppShell({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header
        style={{
          background: 'var(--color-primary)',
          color: '#fff',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'var(--shadow)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '18px' }}>МедАудит — {BLOCK.title}</span>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
