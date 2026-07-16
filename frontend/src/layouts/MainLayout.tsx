import { ReactNode } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Props {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: Props) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {children}
      </main>

      <Footer />
    </>
  );
}