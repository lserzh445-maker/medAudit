import { useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import ReadinessRing from '../components/chief/ReadinessRing.jsx'
import { QUESTIONS } from '../data/questions.js'
import { BLOCK } from '../config/block.js'
import useAuditStore from '../store/useAuditStore.js'
import { summarize } from '../lib/analytics.js'
import { isOverdue } from '../lib/issues.js'
import { DECISION_ORDER, DECISIONS, recommendedDecision } from '../lib/decisions.js'
import { DEPUTIES } from '../lib/deputies.js'

export default function ChiefScreen() {
  const sessions = useAuditStore((s) => s.sessions)
  const current = useAuditStore((s) => s.current)
  const decision = useAuditStore((s) => s.decision)
  const setDecision = useAuditStore((s) => s.setDecision)
  const unlockReaudit = useAuditStore((s) => s.unlockReaudit)
  const monitoring = useAuditStore((s) => s.monitoring)
  const assignMonitoring = useAuditStore((s) => s.assignMonitoring)
  const [deputy, setDeputy] = useState('')

  const session = sessions[current]
  const answers = session?.answers || {}
  const issues = session?.issues || {}

  const s = summarize(QUESTIONS, answers)
  const openCount = Object.values(issues).filter((i) => i.status !== 'закрыт').length
  const overdueCount = Object.values(issues).filter((i) => isOverdue(i)).length
  const rec = recommendedDecision(s.isReady)
  const monRecommended = !monitoring && s.no >= 1

  // выбор меры; «reaudit» дополнительно разблокирует старт повторного аудита
  const onMeasure = (key) => {
    setDecision(key)
    if (key === 'reaudit') unlockReaudit()
  }

  // ── сравнение аудитов (показываем, когда есть обе сессии) ──
  const cmp = (() => {
    if (!sessions.primary?.completedAt || !sessions.repeat) return null
    const p = summarize(QUESTIONS, sessions.primary.answers)
    const r = summarize(QUESTIONS, sessions.repeat.answers)
    const pOpen = Object.values(sessions.primary.issues).filter((i) => i.status !== 'закрыт').length
    const rOpen = Object.values(sessions.repeat.issues).filter((i) => i.status !== 'закрыт').length
    return { pNo: p.no, rNo: r.no, pOpen, rOpen, pPct: p.readinessPct, rPct: r.readinessPct }
  })()

  return (
    <AppShell>
      {!session ? (
        <Card>
          <div className="eyebrow">Кабинет главврача</div>
          <h2 className="check-title">Нет данных аудита</h2>
          <div className="check-sub">Начните аудиторскую сессию на вкладке «Проверка».</div>
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: '16px' }}>
            <div className="verdict">
              <ReadinessRing pct={s.readinessPct} ready={s.isReady} />
              <div className="verlabel">
                <div className="eyebrow">Готовность объекта · {current === 'repeat' ? 'повторный аудит' : 'первичный аудит'}</div>
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
              <div className="cab-stat"><div className="num" style={{ color: 'var(--color-yes)' }}>{s.yes}</div><div className="cap">ответов «да»</div></div>
              <div className="cab-stat"><div className="num" style={{ color: 'var(--color-no)' }}>{s.no}</div><div className="cap">ответов «нет»</div></div>
              <div className="cab-stat"><div className="num">{openCount}</div><div className="cap">открытых проблем</div></div>
              <div className="cab-stat"><div className="num" style={{ color: overdueCount ? 'var(--color-no)' : 'var(--color-text)' }}>{overdueCount}</div><div className="cap">просрочено</div></div>
            </div>
          </Card>

          {cmp && (
            <Card style={{ marginBottom: '16px' }}>
              <div className="eyebrow" style={{ marginBottom: '10px' }}>Динамика: первичный → повторный аудит</div>
              <div className="cmp-row">
                <div className="cmp-item">
                  <div className="cmp-nums"><b className="cmp-a">{cmp.pNo}</b><span className="cmp-arrow">→</span><b className="cmp-b">{cmp.rNo}</b></div>
                  <div className="cap">ответов «нет»</div>
                </div>
                <div className="cmp-item">
                  <div className="cmp-nums"><b className="cmp-a">{cmp.pOpen}</b><span className="cmp-arrow">→</span><b className="cmp-b">{cmp.rOpen}</b></div>
                  <div className="cap">открытых проблем</div>
                </div>
                <div className="cmp-item">
                  <div className="cmp-nums"><b className="cmp-a">{cmp.pPct}%</b><span className="cmp-arrow">→</span><b className="cmp-b">{cmp.rPct}%</b></div>
                  <div className="cap">готовность</div>
                </div>
              </div>
            </Card>
          )}

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
                    onClick={() => onMeasure(key)}
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
                {decision.action === 'reaudit' ? ' · повторный аудит разблокирован на «Проверке»' : ''}
              </div>
            )}
          </Card>

          <Card style={{ marginBottom: '16px' }}>
            <div className="eyebrow" style={{ marginBottom: '10px', display:'flex', alignItems:'center', gap:'8px' }}>
              Мониторинг устранения замечаний
              {monRecommended && <span className="rec-tag">рекомендовано</span>}
            </div>
            <div className="mon-row">
              <select
                className="mon-select"
                value={deputy}
                onChange={(e) => setDeputy(e.target.value)}
              >
                <option value="">Выберите заместителя…</option>
                {DEPUTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <button
                type="button"
                className={`btn ${deputy ? 'primary' : 'block'} ${monRecommended ? 'btn-rec' : ''}`}
                disabled={!deputy}
                onClick={() => { if (deputy) assignMonitoring(deputy) }}
              >
                Поручить мониторинг заместителю
              </button>
            </div>
            {monitoring && (
              <>
                <div className="decision-note">
                  Решение: мониторинг устранения замечаний поручен — {monitoring.deputy} · {new Date(monitoring.assignedAt).toLocaleDateString('ru-RU')}
                </div>
                <div className="mon-notify">✓ Уведомление заместителю отправлено (демонстрационная заглушка)</div>
              </>
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
        </>
      )}
    </AppShell>
  )
}
