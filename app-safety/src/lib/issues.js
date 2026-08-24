export const ISSUE_STATUSES = [
  'выявлен',
  'передан на устранение',
  'устранение заявлено',
  'повторный аудит',
  'возвращён на доработку',
  'закрыт',
]

export const STATUS_CLASS = {
  'выявлен': 'st-vyv',
  'передан на устранение': 'st-per',
  'устранение заявлено': 'st-zay',
  'повторный аудит': 'st-pov',
  'возвращён на доработку': 'st-voz',
  'закрыт': 'st-zak',
}

export function isOverdue(issue, now = new Date()) {
  if (!issue || !issue.dueDate || issue.status === 'закрыт') return false
  return new Date(issue.dueDate + 'T23:59:59') < now
}

export function daysOverdue(issue, now = new Date()) {
  if (!isOverdue(issue, now)) return 0
  const due = new Date(issue.dueDate + 'T23:59:59')
  return Math.ceil((now - due) / 86400000)
}
