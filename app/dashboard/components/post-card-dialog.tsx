import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveImage } from "@/lib/utils";
import { DashboardPost } from "@/types/dashboard";
import { ImageDownIcon, MessageSquareXIcon } from "lucide-react";
import { toast } from "sonner";

type Props = {
  post: DashboardPost;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function PostCardDialog({ post, isOpen, setIsOpen }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="min-w-0">
          <DialogTitle>{post.title}</DialogTitle>
          <DialogDescription className="truncate max-w-full">
            {post.content}
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => saveImage(`umedu-${post.id}`)} variant="outline">
          <ImageDownIcon />
          Save Image
        </Button>
        <Button
          onClick={() => toast.info("Double click to delete post")}
          variant="destructive"
        >
          <MessageSquareXIcon />
          Delete Post
        </Button>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
