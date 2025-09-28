import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { GitBranchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  renderButtons?: () => React.ReactNode;
};

export function ForumNavbar({ renderButtons, className }: Props) {
  return (
    <nav
      className={cn(
        "flex justify-between items-center w-full mx-auto py-6 fixed top-0 left-0 right-0 bg-background container z-50",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Link href="/forum" className="font-bold tracking-tighter">
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
