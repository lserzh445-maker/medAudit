const colorMap = {
  primary: { background: 'var(--color-primary)', color: '#fff' },
  yes:     { background: 'var(--color-yes)',     color: '#fff' },
  no:      { background: 'var(--color-no)',      color: '#fff' },
  muted:   { background: 'var(--color-bg)',      color: 'var(--color-muted)', border: '1px solid var(--color-muted)' },
}

export default function Badge({ color = 'primary', children, style }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        ...colorMap[color],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
