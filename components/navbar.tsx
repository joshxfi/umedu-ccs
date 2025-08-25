import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { GitBranchIcon } from "lucide-react";
import { Badge } from "./ui/badge";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-bold tracking-tighter">
          <span>
            um<i>edu</i>{" "}
          </span>
        </Link>
        <Badge variant="secondary" className="font-semibold">
          <GitBranchIcon className="size-4" /> CCS
        </Badge>
      </div>
      <ModeToggle />
    </nav>
  );
}
