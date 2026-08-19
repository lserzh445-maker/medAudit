export default function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: '20px',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
