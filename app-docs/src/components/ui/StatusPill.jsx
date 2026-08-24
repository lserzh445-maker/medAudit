export default function StatusPill({ isReady, pct }) {
  const color = isReady ? 'var(--color-yes)' : pct >= 50 ? 'var(--color-primary)' : 'var(--color-no)'
  const label = isReady ? 'Готово' : `${pct}%`

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '999px',
        background: color,
        color: '#fff',
        fontSize: '13px',
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  )
}
