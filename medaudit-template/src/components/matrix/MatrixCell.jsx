export default function MatrixCell({ index, question, value }) {
  const status = value === 'yes' ? 'yes' : value === 'no' ? 'no' : 'un'
  return (
    <div className={`mx-cell ${status}`} title={`${index}. ${question.text}`}>
      {index}
    </div>
  )
}
