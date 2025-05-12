import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { MdSpaceDashboard, MdCategory, MdContactSupport } from "react-icons/md";
import { BsFillHousesFill } from "react-icons/bs";
import { RiBillFill } from "react-icons/ri";
import { HiDocumentReport } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import SignOutMenuButton from "../buttons/SignOutMenuButton";

export default function SideMenu() {
  return (
    <div>
        {/* menu button */}
        <button 
            type="button" 
            data-drawer-target="logo-sidebar" 
            data-drawer-toggle="logo-sidebar" 
            aria-controls="logo-sidebar"
            className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-black-100 rounded-lg sm:hidden hover: bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-700"    
        >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
        </button> 
        {/* side menu */}
        <aside
            id="logo-sidebar"
            aria-label="Sidebar"
            className="fixed shadow-lg top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        >
            <div className="h-full px-3 py-4 overflow-y-auto bg-base-100 flex flex-col justify-between">
                {/* logo with app name */}
                <div>
                    <div className="flex gap-3 justify-center items-center mb-5">
                        {/* logo image */}
                        <Image src={Logo} width={44} alt="App logo"/>
                        <span className="self-center text-yellow-600 font-extrabold text-4xl whitespace-nowrap">
                            Billio
                        </span>
                    </div>
                    <ul className="space-y-2 font-medium">
                        <li>
                            {/* icon + title */}
                            <Link href="/dashboard" className="flex items-center rounded-lg p-2 hover:bg-yellow-400 group">
                                <MdSpaceDashboard size={28}/>
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/residences" className="flex items-center rounded-lg p-2 hover:bg-yellow-400 group">
                                <BsFillHousesFill size={28}/>
                                <span className="ms-3">Residences</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/categories" className="flex item-center rounded-lg p-2 hover:bg-yellow-400 group">
                                <MdCategory size={28} />
                                <span className="ms-3">Categories</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/bills" className="flex item-center rounded-lg p-2 hover:bg-yellow-400 group">
                                <RiBillFill size={28} />
                                <span className="ms-3">Bills</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/reports" className="flex item-center rounded-lg p-2 hover:bg-yellow-400 group">
                                <HiDocumentReport size={28} />
                                <span className="ms-3">Reports</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link href="/dashboard/profile" className="flex item-center rounded-lg p-2 hover:bg-yellow-400 group">
                            <FaUser size={28} />
                            <span className="ms-3">My profile</span>
                        </Link>
                    </li>
                    <li>
                        <SignOutMenuButton />
                    </li>
                    <li>
                        <Link href="/dashboard/support-feedback" className="flex item-center rounded-lg p-2 hover:bg-yellow-400 group">
                            <MdContactSupport size={28} />
                            <span className="ms-3">Support & Feedback</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside> 
    </div>
  );
}
