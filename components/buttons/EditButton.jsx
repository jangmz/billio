import { FaEdit } from "react-icons/fa"

export default function EditButton({ className }) {
    return (
        <div className={`flex gap-2 items-center btn btn-outline btn-primary ${className}`}>
            <FaEdit />
            <button type="button">
                Edit
            </button>
        </div>
    )
}
