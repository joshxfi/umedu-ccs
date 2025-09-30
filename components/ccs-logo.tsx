import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "@/public/ccs-logo.png";

export async function CCSLogo({ className }: { className?: string }) {
  return (
    <Image
      className={cn("size-16", className)}
      src={logo}
      alt="CCS Council Logo"
    />
  );
}
