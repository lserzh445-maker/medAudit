import { useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import QuestionRow from '../components/checklist/QuestionRow.jsx'
import { QUESTIONS } from '../data/questions.js'
import { BLOCK } from '../config/block.js'
import useAuditStore from '../store/useAuditStore.js'
import { summarize } from '../lib/analytics.js'

function fmt(iso) {
  return iso ? new Date(iso).toLocaleDateString('ru-RU') : '—'
}

export default function ChecklistScreen() {
  const session = useAuditStore((st) => st.sessions[st.current])
  const current = useAuditStore((st) => st.current)
  const reauditUnlocked = useAuditStore((st) => st.reauditUnlocked)
  const startPrimary = useAuditStore((st) => st.startPrimary)
  const startRepeat = useAuditStore((st) => st.startRepeat)
  const setAnswer = useAuditStore((st) => st.setAnswer)
  const completeSession = useAuditStore((st) => st.completeSession)

  const [operator, setOperator] = useState('')

  // ── СОСТОЯНИЕ 1: нет активной сессии → форма старта ──
  if (!session) {
    return (
      <AppShell>
        <Card>
          <div className="eyebrow">Аудиторская сессия</div>
          <h2 className="check-title">Начало первичного аудита</h2>
          <div className="check-sub" style={{ marginBottom: '14px' }}>
            Блок «{BLOCK.title}». Укажите сотрудника и начните сессию.
          </div>
          <label className="start-field">
            ФИО сотрудника, должность
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="Иванова М.П., инженер"
            />
          </label>
          <button
            type="button"
            className={`btn ${operator.trim() ? 'primary' : 'block'}`}
            disabled={!operator.trim()}
            onClick={() => { if (operator.trim()) startPrimary(operator.trim()) }}
          >
            Начать первичный аудит
          </button>
        </Card>
      </AppShell>
    )
  }

  const answers = session.answers
  const s = summarize(QUESTIONS, answers)
  const answered = s.total - s.unanswered
  const canFinish = s.unanswered === 0
  const completed = !!session.completedAt
  const auditName = current === 'repeat' ? 'Повторный аудит' : 'Первичный аудит'

  return (
    <AppShell>
      <Card style={{ marginBottom: '16px' }}>
        <div className="check-head">
          <div>
            <div className="eyebrow">Аудиторская сессия</div>
            <h2 className="check-title ph">Наименование медицинской организации</h2>
            <div className="ph-line">Адрес объекта</div>
            <div className="check-sub">
              {auditName} · начат {fmt(session.startedAt)}
              {session.operator ? ` · ${session.operator}` : ''}
              {completed ? ` · завершён ${fmt(session.completedAt)}` : ''}
            </div>
          </div>
          <span className="chip">{completed ? 'Завершён' : 'Черновик'}</span>
        </div>
        <div className="prog"><i style={{ width: `${s.total ? (answered / s.total) * 100 : 0}%` }} /></div>
        <div className="progtxt">
          Отвечено {answered} из {s.total}{completed || canFinish ? '' : ' · пока есть пропуски, завершить нельзя'}
        </div>
        <div className="counts">
          <span className="c-yes">Да: {s.yes}</span>
          <span className="c-no">Нет: {s.no}</span>
          <span className="c-un">Без ответа: {s.unanswered}</span>
        </div>
      </Card>

      {completed ? (
        // ── СОСТОЯНИЕ 3: завершено ──
        <Card>
          <div className="eyebrow">{auditName} завершён</div>
          <h2 className="check-title">Готовность {s.readinessPct}%</h2>
          <div className="check-sub">
            {auditName} · начат {fmt(session.startedAt)}
            {session.operator ? ` · ${session.operator}` : ''} · завершён {fmt(session.completedAt)}
          </div>
          <div className="done-note">
            Результаты переданы главврачу. Перейдите в «Кабинет главврача»
            для решения по объекту.
          </div>
          {current === 'primary' && (
            reauditUnlocked ? (
              <div style={{ marginTop: '12px' }}>
                <label className="start-field">
                  ФИО сотрудника повторного аудита, должность
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    placeholder="Петров И.С., инженер"
                  />
                </label>
                <button
                  type="button"
                  className={`btn ${operator.trim() ? 'primary' : 'block'}`}
                  disabled={!operator.trim()}
                  onClick={() => { if (operator.trim()) startRepeat(operator.trim()) }}
                >
                  Начать повторный аудит
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn block"
                disabled
                title="Активируется после решения главврача «Назначить повторный аудит»"
              >
                Начать повторный аудит
              </button>
            )
          )}
          {current === 'primary' && !reauditUnlocked && (
            <div className="check-sub" style={{ marginTop: '8px', fontStyle: 'italic' }}>
              Повторный аудит станет доступен после решения главврача «Назначить повторный аудит» в Кабинете.
            </div>
          )}
        </Card>
      ) : (
        // ── СОСТОЯНИЕ 2: сессия идёт ──
        <Card>
          <div className="eyebrow" style={{ marginBottom: '6px' }}>Блок «{BLOCK.title}» · нажмите ответ</div>
          {QUESTIONS.map((q, i) => (
            <QuestionRow key={q.id} index={i + 1} question={q} value={answers[q.id]} onPick={setAnswer} />
          ))}
          <div className="foot">
            <span className="saved">✓ Сохранено автоматически</span>
            <button
              type="button"
              className={`btn ${canFinish ? 'primary' : 'block'}`}
              disabled={!canFinish}
              title={canFinish ? '' : 'Сначала ответьте на все вопросы'}
              onClick={() => { if (canFinish) completeSession() }}
            >
              Завершить проверку
            </button>
          </div>
        </Card>
      )}
    </AppShell>
  )
}
