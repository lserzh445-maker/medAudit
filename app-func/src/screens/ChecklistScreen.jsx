import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import QuestionRow from '../components/checklist/QuestionRow.jsx'
import { QUESTIONS } from '../data/questions.js'
import { BLOCK } from '../config/block.js'
import useAuditStore from '../store/useAuditStore.js'
import { summarize } from '../lib/analytics.js'

export default function ChecklistScreen() {
  const answers = useAuditStore((s) => s.answers)
  const setAnswer = useAuditStore((s) => s.setAnswer)
  const completedAt = useAuditStore((s) => s.completedAt)
  const completeSession = useAuditStore((s) => s.completeSession)
  const reopenSession = useAuditStore((s) => s.reopenSession)
  const s = summarize(QUESTIONS, answers)
  const answered = s.total - s.unanswered
  const canFinish = s.unanswered === 0

  return (
    <AppShell>
      <Card style={{ marginBottom: '16px' }}>
        <div className="check-head">
          <div>
            <div className="eyebrow">Аудиторская сессия</div>
            <h2 className="check-title ph">Наименование медицинской организации</h2>
            <div className="ph-line">Адрес объекта</div>
            <div className="check-sub">Первичный аудит · черновик</div>
          </div>
          <span className="chip">Черновик</span>
        </div>
        <div className="prog"><i style={{ width: `${s.total ? (answered / s.total) * 100 : 0}%` }} /></div>
        <div className="progtxt">
          Отвечено {answered} из {s.total}{canFinish ? '' : ' · пока есть пропуски, завершить нельзя'}
        </div>
        <div className="counts">
          <span className="c-yes">Да: {s.yes}</span>
          <span className="c-no">Нет: {s.no}</span>
          <span className="c-un">Без ответа: {s.unanswered}</span>
        </div>
      </Card>

      {completedAt ? (
        <Card>
          <div className="eyebrow">Проверка завершена</div>
          <h2 className="check-title">Готовность {s.readinessPct}%</h2>
          <div className="check-sub">
            Завершено {new Date(completedAt).toLocaleDateString('ru-RU')} · ответов «да»: {s.yes} · «нет»: {s.no}
          </div>
          <div className="done-note">
            Результаты переданы главврачу. Перейдите в «Кабинет главврача»
            для решения: повторный аудит, передача подрядчику или согласование запуска.
          </div>
          <button type="button" className="btn ghost" onClick={reopenSession}>
            Возобновить проверку
          </button>
        </Card>
      ) : (
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
