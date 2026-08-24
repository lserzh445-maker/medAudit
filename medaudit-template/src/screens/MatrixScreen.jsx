import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import MatrixCell from '../components/matrix/MatrixCell.jsx'
import { QUESTIONS } from '../data/questions.js'
import { BLOCK } from '../config/block.js'
import useAuditStore from '../store/useAuditStore.js'
import { summarize } from '../lib/analytics.js'

export default function MatrixScreen() {
  const answers = useAuditStore((s) => s.answers)
  const s = summarize(QUESTIONS, answers)

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
            <MatrixCell key={q.id} index={i + 1} question={q} value={answers[q.id]} />
          ))}
        </div>

        <div className="mx-legend">
          <span><i style={{ background: 'var(--color-yes)' }} />да</span>
          <span><i style={{ background: 'var(--color-no)' }} />нет</span>
          <span><i style={{ background: 'var(--color-line)' }} />без ответа</span>
        </div>

        <div className="check-sub" style={{ marginTop: '10px' }}>Наведите на клетку — покажется вопрос</div>
      </Card>
    </AppShell>
  )
}
