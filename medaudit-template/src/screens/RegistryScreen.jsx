import { useState, useMemo } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import IssueCard from '../components/registry/IssueCard.jsx'
import { QUESTIONS } from '../data/questions.js'
import { BLOCK } from '../config/block.js'
import useAuditStore from '../store/useAuditStore.js'
import { isOverdue } from '../lib/issues.js'

const QMAP = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.text]))

export default function RegistryScreen() {
  const issues = useAuditStore((s) => s.issues)
  const setIssueStatus = useAuditStore((s) => s.setIssueStatus)
  const setIssueDue = useAuditStore((s) => s.setIssueDue)
  const setIssueAssignee = useAuditStore((s) => s.setIssueAssignee)
  const [filter, setFilter] = useState('all')

  const list = Object.values(issues)
  const issueKeys = Object.keys(issues).sort().join(',')

  // membership фиксируется при смене фильтра/появлении-удалении факта,
  // но НЕ при смене статуса существующего — карточка не выпрыгивает при правке
  const visibleIds = useMemo(() => {
    return Object.values(issues)
      .filter((it) => {
        if (filter === 'open') return it.status !== 'закрыт'
        if (filter === 'closed') return it.status === 'закрыт'
        if (filter === 'over') return isOverdue(it)
        return true
      })
      .map((it) => it.questionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, issueKeys])

  // живые объекты — контролируемые поля отражают актуальное состояние
  const filtered = visibleIds.map((id) => issues[id]).filter(Boolean)

  return (
    <AppShell>
      <Card>
        <div className="eyebrow">Реестр негативных фактов</div>
        <h2 className="check-title">Блок «{BLOCK.title}»</h2>
        <div className="check-sub">Каждый ответ «нет» попадает сюда автоматически и живёт, пока не закрыт</div>
        <div className="reg-filters">
          {[['all', 'Все'], ['open', 'Открытые'], ['closed', 'Закрытые'], ['over', '⚠ Просроченные']].map(([k, label]) => (
            <span key={k} className={`reg-f ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{label}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="reg-empty">
            {list.length === 0
              ? 'Пока нет проблем — ответьте «нет» на экране «Проверка».'
              : 'Нет фактов по этому фильтру.'}
          </div>
        ) : (
          filtered.map((it) => (
            <IssueCard
              key={it.questionId}
              issue={it}
              questionText={QMAP[it.questionId] || it.questionId}
              blockTitle={BLOCK.title}
              onStatus={setIssueStatus}
              onDue={setIssueDue}
              onAssignee={setIssueAssignee}
            />
          ))
        )}
      </Card>
    </AppShell>
  )
}
