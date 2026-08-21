import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import QuestionRow from '../components/checklist/QuestionRow.jsx'
import { QUESTIONS } from '../data/questions.js'
import useAuditStore from '../store/useAuditStore.js'
import { summarize } from '../lib/analytics.js'

export default function ChecklistScreen() {
  const answers = useAuditStore((s) => s.answers)
  const setAnswer = useAuditStore((s) => s.setAnswer)
  const { yes, no, unanswered, total, readinessPct } = summarize(QUESTIONS, answers)
  const answered = total - unanswered

  return (
    <AppShell>
      <h1 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 700 }}>Проверка</h1>

      <Card style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '15px', fontWeight: 600 }}>
          Отвечено {answered} из {total} · готовность {readinessPct}%
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '14px' }}>
          <span style={{ color: 'var(--color-yes)', fontWeight: 600 }}>Да: {yes}</span>
          <span style={{ color: 'var(--color-no)', fontWeight: 600 }}>Нет: {no}</span>
          <span style={{ color: 'var(--color-muted)' }}>Без ответа: {unanswered}</span>
        </div>
        <div
          style={{
            height: '6px',
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius)',
            marginTop: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${total ? (answered / total) * 100 : 0}%`,
              height: '100%',
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius)',
              transition: 'width 0.2s',
            }}
          />
        </div>
      </Card>

      <div>
        {QUESTIONS.map((q, i) => (
          <QuestionRow
            key={q.id}
            index={i + 1}
            question={q}
            value={answers[q.id]}
            onPick={setAnswer}
          />
        ))}
      </div>
    </AppShell>
  )
}
