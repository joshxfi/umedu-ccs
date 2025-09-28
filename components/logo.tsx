import { GitBranchIcon } from "lucide-react";
import { Badge } from "./ui/badge";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="font-bold tracking-tighter">
        um<i>edu</i>{" "}
      </span>
      <Badge variant="secondary" className="font-semibold">
        <GitBranchIcon className="size-4" /> CCS
      </Badge>
    </div>
  );
}
