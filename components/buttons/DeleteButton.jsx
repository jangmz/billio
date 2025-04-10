import { FaTrash } from "react-icons/fa6";

export default function DeleteButton({ className }) {
  return (
    <div className={`flex gap-2 items-center btn btn-outline btn-error ${className}`}>
        <FaTrash />
        <button type="button">
            Delete
        </button>
    </div>
  )
}
