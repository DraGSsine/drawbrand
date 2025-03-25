import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({
  textClass,
  mode,
  size = 40,
}: {
  textClass?: string;
  mode: string;
  size: number;
}) => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      {/* Logo Icon */}
      <Image
        src={mode === "dark" ? "/logo.svg" : "/logo-white.svg"}
        alt="DrawBrand Logo"
        width={size}
        height={size}
        className="object-contain rounded-[5px] overflow-hidden"
      />
      {/* Logo Title */}
      <span
        className={cn(
          "text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent",
          textClass
        )}
      >
        DrawBrand
      </span>
    </Link>
  );
};

export default Logo;
