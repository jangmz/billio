"use client";

import { logout } from "@/_actions/authActions";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

export default function SignOutMenuButton() {
  return (
    <Link href="#" onClick={logout} className="flex item-center rounded-lg p-2 hover:bg-yellow-400 group">
        <FaSignOutAlt size={28} />
        <span className="ms-3">Sign out</span>
    </Link>
  )
}
