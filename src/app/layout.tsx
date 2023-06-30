import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/client";
import { AuthProvider } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="pt-20 sm:pt-0 pl-0 sm:pl-20 md:pl-40 min-h-screen bg-slate-900">
            {props.children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
