export default function MatrixCell({ index, value, selected, onSelect }) {
  const status = value === 'yes' ? 'yes' : value === 'no' ? 'no' : 'un'
  return (
    <button
      type="button"
      className={`mx-cell ${status} ${selected ? 'sel' : ''}`}
      onClick={() => onSelect(index)}
    >
      {index}
    </button>
  )
}
