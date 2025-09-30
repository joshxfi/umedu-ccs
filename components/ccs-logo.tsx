import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "@/public/ccs-logo.png";

export function CCSLogo({ className }: { className?: string }) {
  return (
    <Image
      placeholder="blur"
      className={cn("size-16", className)}
      src={logo}
      alt="CCS Council Logo"
    />
  );
}
