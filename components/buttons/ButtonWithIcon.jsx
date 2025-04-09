import Link from "next/link";

export default function ButtonWithIcon({ link, text, icon }) {
    return (
        <Link href={link} className="btn btn-primary flex gap-2 items-center">
            {icon}
            {text}
        </Link>
    );
}
