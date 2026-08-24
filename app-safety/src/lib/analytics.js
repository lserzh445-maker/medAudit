export function summarize(questions, answers) {
  const total = questions.length
  let yes = 0
  let no = 0

  for (const q of questions) {
    const a = answers[q.id]
    if (a === 'yes') yes++
    else if (a === 'no') no++
  }

  const unanswered = total - yes - no
  const readinessPct = total ? Math.round((yes / total) * 100) : 0
  const isReady = no === 0 && unanswered === 0

  return { yes, no, unanswered, total, readinessPct, isReady }
}

export function openIssues(questions, answers) {
  return questions.filter((q) => answers[q.id] === 'no')
}
