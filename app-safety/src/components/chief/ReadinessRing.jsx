export default function ReadinessRing({ pct, ready }) {
  const color = ready ? 'var(--color-yes)' : 'var(--color-no)'
  return (
    <div className="ring" style={{ background: `conic-gradient(${color} 0 ${pct}%, var(--color-line) ${pct}% 100%)` }}>
      <b>{pct}%</b>
    </div>
  )
}
