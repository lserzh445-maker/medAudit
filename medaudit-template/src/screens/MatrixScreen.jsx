import { useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import MatrixCell from '../components/matrix/MatrixCell.jsx'
import { QUESTIONS } from '../data/questions.js'
import { BLOCK } from '../config/block.js'
import useAuditStore from '../store/useAuditStore.js'
import { summarize } from '../lib/analytics.js'

export default function MatrixScreen() {
  const session = useAuditStore((s) => s.sessions[s.current])
  const answers = session?.answers || {}
  const s = summarize(QUESTIONS, answers)
  const [selected, setSelected] = useState(null)
  const select = (i) => setSelected(i)
  const selQ = selected ? QUESTIONS[selected - 1] : null
  const selVal = selQ ? answers[selQ.id] : undefined
  const selStatus = selVal === 'yes' ? 'yes' : selVal === 'no' ? 'no' : 'un'
  const selLabel = selStatus === 'yes' ? 'да' : selStatus === 'no' ? 'нет' : 'без ответа'

  return (
    <AppShell>
      <Card>
        <div className="mx-head">
          <div>
            <div className="eyebrow">Матрица готовности</div>
            <h2 className="check-title">Блок «{BLOCK.title}»</h2>
            <div className="mx-counts" style={{ marginTop: '8px' }}>
              <span className="mx-count yes"><i className="dot" />Да: {s.yes}</span>
              <span className="mx-count no"><i className="dot" />Нет: {s.no}</span>
              <span className="mx-count un"><i className="dot" />Без ответа: {s.unanswered}</span>
            </div>
          </div>
          <div className="mx-pct">
            <div className="val" style={{ color: s.no === 0 && s.unanswered === 0 ? 'var(--color-yes)' : 'var(--color-no)' }}>
              {s.readinessPct}%
            </div>
            <div className="lbl">готовность блока</div>
          </div>
        </div>

        <div className="mx-grid">
          {QUESTIONS.map((q, i) => (
            <MatrixCell
              key={q.id}
              index={i + 1}
              value={answers[q.id]}
              selected={selected === i + 1}
              onSelect={select}
            />
          ))}
        </div>

        {selQ && (
          <div className="mx-detail">
            <div className="d-head">
              <span className="d-num">№{selected}</span>
              <span className={`d-st ${selStatus}`}>{selLabel}</span>
            </div>
            <div className="d-text">{selQ.text}</div>
          </div>
        )}

        <div className="mx-legend">
          <span><i style={{ background: 'var(--color-yes)' }} />да</span>
          <span><i style={{ background: 'var(--color-no)' }} />нет</span>
          <span><i style={{ background: 'var(--color-line)' }} />без ответа</span>
        </div>

        <div className="check-sub" style={{ marginTop: '10px' }}>Нажмите на клетку — покажется вопрос и статус</div>
      </Card>
    </AppShell>
  )
}
