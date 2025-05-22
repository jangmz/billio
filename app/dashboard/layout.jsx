import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { auth } from "@/auth";
import SideMenu from "@/components/menus/SideMenu";

const poppins = Poppins({
  weight: ["400", "700"],
  subset: ["latin"],
});

export const metadata = {
  title: "Billio"
};

export default async function DashboardLayout({ children }) {
  const session = await auth();

  return (
    <body className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        {
          session?.user && <SideMenu />
        }
      </header>
      <div>
          <div className="p-4 md:ml-64">
              <div className="p-2">
                  {children}
              </div>
          </div>
      </div>
    </body>
  );
}
