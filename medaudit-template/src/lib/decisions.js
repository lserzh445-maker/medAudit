export const DECISION_ORDER = ['reaudit', 'launch']

export const DECISIONS = {
  reaudit: { label: 'Назначить повторный аудит',         done: 'Назначен повторный аудит' },
  launch:  { label: 'Согласовать запуск в эксплуатацию', done: 'Запуск в эксплуатацию согласован' },
}

export function recommendedDecision(isReady) {
  return isReady ? 'launch' : 'reaudit'
}
