export default function Button({ text, icon, btnStyle, onClick, type }) {
  return (
    <button 
      className={`btn ${btnStyle} flex gap-2 items-center`} 
      onClick={onClick} 
      type={type}
    >
      {icon}
      {text}
    </button>
  )
}
