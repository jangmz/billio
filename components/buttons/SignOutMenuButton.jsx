"use client";

import { logout } from "@/_actions/authActions";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOutMenuButton() {
  return (
    <button onClick={logout} className="flex item-center rounded-lg p-2 w-full hover:bg-yellow-400 hover:cursor-pointer group">
        <FaSignOutAlt size={28} />
        <span className="ms-3">Sign out</span>
    </button>
  )
}
