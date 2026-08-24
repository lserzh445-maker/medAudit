import { useState, useRef, useEffect } from 'react'

export default function StatusSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    // pointerdown покрывает и мышь, и тач; capture — чтобы отработать
    // раньше внутренних обработчиков
    document.addEventListener('pointerdown', onDoc, true)
    return () => document.removeEventListener('pointerdown', onDoc, true)
  }, [open])

  const choose = (opt) => {
    onChange(opt)
    setOpen(false)
  }

  return (
    <div className="ss" ref={ref}>
      <button
        type="button"
        className="ss-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
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
              // onPointerDown, а не onClick: срабатывает до внешнего
              // pointerdown-слушателя закрытия и гарантирует выбор+закрытие
              onPointerDown={(e) => { e.preventDefault(); choose(opt) }}
            >
              {opt === value ? '✓ ' : ''}{opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
