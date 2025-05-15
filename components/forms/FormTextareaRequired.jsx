export default function FormTextareaRequired({ title, name, value, placeholder, onChange }) {
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
                value={value}
                required
            ></textarea>
        </fieldset>
    )
}
