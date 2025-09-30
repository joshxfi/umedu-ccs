import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "pb-8 flex flex-col items-center text-muted-foreground text-sm",
        className,
      )}
    >
      <div>
        <Link
          href="https://umedu.omsimos.com"
          className="font-bold tracking-tighter"
        >
          um<i>edu</i>
        </Link>{" "}
        by{" "}
        <Link href="https://www.instagram.com/josh.xfi/" className="underline" target="_blank">
          joshxfi
        </Link>
      </div>
    </footer>
  );
}
