export default function QuestionRow({ index, question, value, onPick }) {
  const unanswered = value !== 'yes' && value !== 'no'
  return (
    <div className={`q ${unanswered ? 'need' : ''}`}>
      <div>
        <div className="qtext">{index}. {question.text}</div>
        <div className="qmeta">
          {value === 'yes' && <span>Ответ зафиксирован</span>}
          {value === 'no' && <span className="chip made">● создана карточка проблемы</span>}
          {unanswered && <span className="flag">⚠ нужен ответ</span>}
        </div>
        {(value === 'yes' || value === 'no') && (
          <div className="attach-stub" aria-disabled="true" title="Доступно в полной версии программы">
            <span className="attach-ic">📎</span>
            Прикрепить документ
            <span className="attach-hint">— в полной версии</span>
          </div>
        )}
      </div>
      <div className="toggle">
        <button type="button" className={`yn y ${value === 'yes' ? 'sel' : ''}`} onClick={() => onPick(question.id, 'yes')}>Да</button>
        <button type="button" className={`yn n ${value === 'no' ? 'sel' : ''}`} onClick={() => onPick(question.id, 'no')}>Нет</button>
      </div>
    </div>
  )
}
