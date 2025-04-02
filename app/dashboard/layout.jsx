import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { auth } from "@/config/auth";
import SideMenu from "@/components/menus/SideMenu";

const poppins = Poppins({
  weight: ["400", "700"],
  subset: ["latin"],
});

export const metadata = {
  title: "Dashboard | Billio"
};

export default async function DashboardLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50">
          {
            session?.user && <SideMenu />
          }
        </header>
        <main>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-1 border-gray-200 border-dashed rounded-lg">
                    {children}
                </div>
            </div>
        </main>
      </body>
    </html>
  );
}
