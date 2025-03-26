export default function CardLanding({ title, text }) {
  return (
    <div className="card card-xl rounded-box w-96 border-2 border-yellow-600 bg-yellow-500/20">
        <div className="card-body">
            <h2 className="card-title text-2xl text-center uppercase">
                {title}
            </h2>
            <p className="font-light">
                {text}
            </p>
        </div>
    </div>
  )
}
