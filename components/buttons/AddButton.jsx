import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function AddButton({ link, text }) {
    return (
        <Link href={link} className="btn btn-primary flex gap-2 items-center">
            <FaPlus />
            {text}
        </Link>
    );
}
