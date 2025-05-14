export default function FormTextareaRequired({ title, name, placeholder, onChange }) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{title}</legend>
            <textarea 
                name={name} 
                id={name} 
                className="textarea textarea-bordered w-full"
                placeholder={placeholder}
                rows={6}
                onChange={onChange}
                required
            ></textarea>
        </fieldset>
    )
}
