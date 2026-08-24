const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 18px',
    border: 'none',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'background 0.15s',
  },
  primary: {
    background: 'var(--color-primary)',
    color: '#fff',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-primary)',
    border: '1.5px solid var(--color-primary)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-muted)',
  },
}

export default function Button({ variant = 'primary', children, style, ...props }) {
  return (
    <button
      style={{ ...styles.base, ...styles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
