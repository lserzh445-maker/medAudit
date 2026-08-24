import { useState, useRef, useEffect } from 'react'

export default function StatusSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="ss" ref={ref}>
      <button type="button" className="ss-trigger" onClick={() => setOpen((o) => !o)}>
        <span>{value}</span>
        <span className="ss-caret">▾</span>
      </button>
      {open && (
        <ul className="ss-menu" role="listbox">
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`ss-opt ${opt === value ? 'sel' : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt === value ? '✓ ' : ''}{opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
