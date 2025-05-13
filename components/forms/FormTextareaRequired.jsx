export default function FormTextareaRequired({ title, name, placeholder }) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{title}</legend>
            <textarea 
                name={name} 
                id={name} 
                className="textarea textarea-bordered w-full"
                placeholder={placeholder}
                rows={6}
                required
            ></textarea>
        </fieldset>
    )
}
