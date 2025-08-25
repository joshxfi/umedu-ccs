import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { GitBranchIcon } from "lucide-react";

type Props = {
  renderButtons?: () => React.ReactNode;
};

export function ForumNavbar({ renderButtons }: Props) {
  return (
    <nav className="flex justify-between items-center w-full max-w-xl mx-auto py-6 fixed top-0 left-0 right-0 bg-background container z-50">
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

      <div className="flex items-center gap-2">
        <ModeToggle />
        {renderButtons?.()}
      </div>
    </nav>
  );
}
