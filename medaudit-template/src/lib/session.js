// пустая сессия
export function emptySession(operator) {
  return {
    operator: operator || '',
    startedAt: new Date().toISOString(),
    completedAt: null,
    answers: {},
    issues: {},
  }
}

// наследование в повторный аудит:
// - ответы «да» остаются «да» (перенос ответа и закрытого факта как есть)
// - ответы «нет» переносятся, но факт открывается заново на перепроверку
//   (статус «повторный аудит», closedAt сбрасывается; срок/ответственный сохраняются)
// - неотвеченные остаются неотвеченными
export function inheritSession(prev, operator) {
  const answers = { ...prev.answers }
  const issues = {}
  for (const [qId, iss] of Object.entries(prev.issues)) {
    if (answers[qId] === 'no') {
      issues[qId] = { ...iss, status: 'повторный аудит', closedAt: null }
    } else {
      // факт был закрыт (ответ «да») — переносим как есть
      issues[qId] = { ...iss }
    }
  }
  return {
    operator: operator || '',
    startedAt: new Date().toISOString(),
    completedAt: null,
    answers,
    issues,
  }
}
