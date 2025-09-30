import { deletePostAction } from "@/actions/dashboard";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageDownIcon, MessageSquareXIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type Props = {
  post: DashboardPost;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function PostCardDialog({ post, isOpen, setIsOpen }: Props) {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePostAction,
    onSuccess: () => {
      toast.success("Post deleted successfully");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  });

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
          disabled={mutation.isPending}
          onDoubleClick={async () =>
            await mutation.mutateAsync({ id: post.id, key })
          }
          variant="destructive"
        >
          <MessageSquareXIcon />
          Delete Post
        </Button>
        <DialogFooter className="text-destructive text-xs">
          Double click to delete post
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
