import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["400", "700"],
  subset: ["latin"],
});

export const metadata = {
  title: "Billio",
  description: "The best expense tracking app for your house/apartment.",
  keywords: "expense tracker, utility expense tracker, apartment, house, landlord"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>
        <main>
          {children}
        </main>
        <footer className="bg-base-200 border-t">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
