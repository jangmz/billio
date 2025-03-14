import { Poppins } from "next/font/google";
import "./globals.css";

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
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
