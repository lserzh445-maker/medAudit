import Badge from '../ui/Badge.jsx'

const btnBase = {
  padding: '6px 20px',
  border: '1.5px solid var(--color-muted)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'background 0.12s, color 0.12s',
}

export default function QuestionRow({ index, question, value, onPick }) {
  const unanswered = value !== 'yes' && value !== 'no'

  return (
    <div
      style={{
        borderLeft: `3px solid ${unanswered ? 'var(--color-muted)' : 'transparent'}`,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: '14px 16px',
        marginBottom: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ color: 'var(--color-muted)', fontWeight: 700, minWidth: '24px', paddingTop: '1px' }}>
          {index}
        </span>
        <span style={{ flex: 1, fontSize: '15px' }}>{question.text}</span>
        {unanswered && <Badge color="muted">Нет ответа</Badge>}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingLeft: '36px' }}>
        <button
          type="button"
          onClick={() => onPick(question.id, 'yes')}
          style={{
            ...btnBase,
            background: value === 'yes' ? 'var(--color-yes)' : 'var(--color-surface)',
            color: value === 'yes' ? '#fff' : 'var(--color-text)',
            borderColor: value === 'yes' ? 'var(--color-yes)' : 'var(--color-muted)',
          }}
        >
          Да
        </button>
        <button
          type="button"
          onClick={() => onPick(question.id, 'no')}
          style={{
            ...btnBase,
            background: value === 'no' ? 'var(--color-no)' : 'var(--color-surface)',
            color: value === 'no' ? '#fff' : 'var(--color-text)',
            borderColor: value === 'no' ? 'var(--color-no)' : 'var(--color-muted)',
          }}
        >
          Нет
        </button>
      </div>

      {value === 'no' && (
        <div style={{ paddingLeft: '36px', marginTop: '6px', fontSize: '12px', color: 'var(--color-muted)' }}>
          Создана карточка проблемы → Реестр
        </div>
      )}
    </div>
  )
}
