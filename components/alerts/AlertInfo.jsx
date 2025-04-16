export default function AlertInfo({ information }) {
    return (
        <div role="alert" className="alert bg-yellow-400">
            <span>{information}</span>
        </div>
    )
}
