import Navbar from "@/components/landing/navbar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-neutral-50">
        <Navbar />
        {children}
    </main>
  );
};

export default Layout;
