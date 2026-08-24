export const DECISION_ORDER = ['reaudit', 'contractor', 'launch']

export const DECISIONS = {
  reaudit:    { label: 'Назначить повторный аудит',           done: 'Назначен повторный аудит' },
  contractor: { label: 'Передать для устранения подрядчику',  done: 'Передано подрядчику' },
  launch:     { label: 'Согласовать запуск в эксплуатацию',   done: 'Запуск в эксплуатацию согласован' },
}

export function recommendedDecision(isReady) {
  return isReady ? 'launch' : 'reaudit'
}
