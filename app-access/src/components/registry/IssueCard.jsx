import { ISSUE_STATUSES, STATUS_CLASS, isOverdue, daysOverdue } from '../../lib/issues.js'
import StatusSelect from './StatusSelect.jsx'

export default function IssueCard({ issue, questionText, blockTitle, onStatus, onDue, onAssignee }) {
  const over = isOverdue(issue)
  return (
    <div className={`reg-card ${over ? 'over' : ''}`}>
      <div className="reg-top">
        <div>
          <span className="reg-tag">{blockTitle}</span>
          <div className="reg-qtext">{questionText}</div>
        </div>
        <span className={`reg-st ${STATUS_CLASS[issue.status] || ''}`}>{issue.status}</span>
      </div>
      <div className="reg-controls">
        <label>Статус
          <StatusSelect
            value={issue.status}
            options={ISSUE_STATUSES}
            onChange={(st) => onStatus(issue.questionId, st)}
          />
        </label>
        <label>Срок
          <input type="date" value={issue.dueDate || ''} onChange={(e) => onDue(issue.questionId, e.target.value)} />
        </label>
        <label>Ответственный
          <input type="text" placeholder="—" value={issue.assignee || ''} onChange={(e) => onAssignee(issue.questionId, e.target.value)} />
        </label>
      </div>
      {issue.dueDate && (
        <div className={`reg-due ${over ? 'over' : ''}`}>
          {over
            ? `⚠ Срок: ${issue.dueDate} — просрочено на ${daysOverdue(issue)} дн.`
            : `Срок: ${issue.dueDate}`}
          {issue.assignee ? ` · отв.: ${issue.assignee}` : ''}
        </div>
      )}
    </div>
  )
}
