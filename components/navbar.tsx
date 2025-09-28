import Link from "next/link";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <ModeToggle />
    </nav>
  );
}
