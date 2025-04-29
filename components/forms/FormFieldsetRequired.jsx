export default function FormFieldset({type, name, title, placeholder, value, onChange}) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{title}</legend>
            <input 
                onChange={onChange} 
                type={type} 
                name={name} 
                id={name} 
                value={value} 
                placeholder={placeholder} 
                className="input w-100" 
                required
            />
        </fieldset>
    ) 
}
