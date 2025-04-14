export default function AlertError({error}) {
    return (
        <div role="alert" className="alert alert-error">
            <span>{error}</span>
        </div>
    )
}
