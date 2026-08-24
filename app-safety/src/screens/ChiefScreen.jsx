import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import ReadinessRing from '../components/chief/ReadinessRing.jsx'
import { QUESTIONS } from '../data/questions.js'
import { BLOCK } from '../config/block.js'
import useAuditStore from '../store/useAuditStore.js'
import { summarize } from '../lib/analytics.js'
import { isOverdue } from '../lib/issues.js'
import { DECISION_ORDER, DECISIONS, recommendedDecision } from '../lib/decisions.js'

export default function ChiefScreen() {
  const answers = useAuditStore((s) => s.answers)
  const issues = useAuditStore((s) => s.issues)
  const decision = useAuditStore((s) => s.decision)
  const setDecision = useAuditStore((s) => s.setDecision)

  const s = summarize(QUESTIONS, answers)
  const openCount = Object.values(issues).filter((i) => i.status !== 'закрыт').length
  const overdueCount = Object.values(issues).filter((i) => isOverdue(i)).length
  const rec = recommendedDecision(s.isReady)

  return (
    <AppShell>
      <Card style={{ marginBottom: '16px' }}>
        <div className="verdict">
          <ReadinessRing pct={s.readinessPct} ready={s.isReady} />
          <div className="verlabel">
            <div className="eyebrow">Готовность объекта</div>
            <div className={`big ${s.isReady ? 'ver-ready' : 'ver-not'}`}>
              {s.isReady ? 'Объект готов' : 'Объект не готов'}
            </div>
            <div className="ver-phrase">
              Готовность объекта к функционированию по блоку «{BLOCK.readinessLabel}».
              {s.isReady ? ' Открытых несоответствий нет.' : ` Открытых несоответствий: ${openCount}.`}
            </div>
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <div className="eyebrow" style={{ marginBottom: '10px' }}>Аналитика блока «{BLOCK.title}»</div>
        <div className="cab-grid">
          <div className="cab-stat">
            <div className="num" style={{ color: 'var(--color-yes)' }}>{s.yes}</div>
            <div className="cap">ответов «да»</div>
          </div>
          <div className="cab-stat">
            <div className="num" style={{ color: 'var(--color-no)' }}>{s.no}</div>
            <div className="cap">ответов «нет»</div>
          </div>
          <div className="cab-stat">
            <div className="num">{openCount}</div>
            <div className="cap">открытых проблем</div>
          </div>
          <div className="cab-stat">
            <div className="num" style={{ color: overdueCount ? 'var(--color-no)' : 'var(--color-text)' }}>{overdueCount}</div>
            <div className="cap">просрочено</div>
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <div className="eyebrow" style={{ marginBottom: '10px' }}>Меры по итогам оценки</div>
        <div className="measures">
          {DECISION_ORDER.map((key) => {
            const chosen = decision?.action === key
            const isRec = !decision && key === rec
            return (
              <button
                key={key}
                type="button"
                className={`measure ${chosen ? 'chosen' : ''} ${isRec ? 'rec' : ''}`}
                onClick={() => setDecision(key)}
              >
                <span>{DECISIONS[key].label}</span>
                {isRec && <span className="rec-tag">рекомендовано</span>}
                {chosen && <span className="rec-tag">✓ выбрано</span>}
              </button>
            )
          })}
        </div>
        {decision && (
          <div className="decision-note">
            Решение: {DECISIONS[decision.action].done} · {new Date(decision.decidedAt).toLocaleDateString('ru-RU')}
          </div>
        )}
      </Card>

      <Card>
        <div className="eyebrow" style={{ marginBottom: '10px' }}>Отчёты</div>
        <div className="reports">
          <button type="button" className="btn ghost" disabled>⬇ Excel</button>
          <button type="button" className="btn ghost" disabled>⬇ PDF</button>
        </div>
        <div className="reports-note">Выгрузка отчётов доступна в полной версии системы.</div>
      </Card>
    </AppShell>
  )
}
