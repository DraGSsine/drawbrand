"use client";
import { Crown, Layout, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/lib/queries";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "../landing/logo";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const routes = [
  {
    label: "Dashboard",
    icon: Layout,
    href: "/dashboard",
  },
];

export function Sidebar() {
  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 text-neutral-600 hover:text-neutral-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-white border-r border-neutral-200"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block w-64">
        <SidebarContent />
      </div>
    </>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const { mutate } = useMutation({
    mutationFn: async () => await api.post("/auth/signout"),
    onSuccess: () => {
      window.location.href = "/";
    },
  });
  const handleSignOut = () => {
    mutate();
    if (typeof window !== "undefined")
      window.postMessage({ type: "FROM_PAGE", token: null }, "*");
  };

  const { data } = useUserInfo();
  const limitPercentage = (data?.creditsUsed / data?.monthlyCredits) * 100;

  return (
    <div className="flex h-full">
      <div className="relative flex w-full flex-col h-full bg-white border-r border-neutral-200">
        {/* Logo Section */}
        <div className="px-6 py-8 border-b border-neutral-200">
          <Logo size={40} mode="dark" />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                pathname === route.href
                  ? "bg-neutral-100 text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              )}
            >
              <route.icon className="w-5 h-5" />
              <span className="font-medium">{route.label}</span>
              {pathname === route.href && (
                <div className="ml-auto w-1 h-6 bg-neutral-400 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 space-y-4">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-neutral-600" />
                <span className="font-medium text-neutral-900">
                  {data?.plan + " plan"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-600">
                  Credits
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-neutral-900">
                    {data?.creditsUsed}
                  </span>
                  <span className="text-neutral-400">/</span>
                  <span className="text-sm font-medium text-neutral-400">
                    {data?.monthlyCredits}
                  </span>
                </div>
              </div>
              <Progress
                value={limitPercentage}
                className="bg-neutral-200 h-2"
              />
            </div>
          </div>

          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-between px-4 py-3 text-neutral-600 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <span className="font-medium">SignOut</span>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
