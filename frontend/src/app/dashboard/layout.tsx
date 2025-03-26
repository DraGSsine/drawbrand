import React, { ReactNode } from "react";
import PricingDialog from "@/components/dashboard/pricing-dialog";
import NavBar from "@/components/dashboard/NavBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex-1 overflow-auto">
        <NavBar />
        {children}
      </main>
      <PricingDialog />
    </div>
  );
};

export default Layout;
