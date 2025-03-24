export default function Button({ text, btnStyle, onClick, type }) {
  return (
    <button className={`btn ${btnStyle}`} onClick={onClick} type={type}>
      {text}
    </button>
  )
}
