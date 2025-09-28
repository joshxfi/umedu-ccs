import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { InboxIcon } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { PostCardDialog } from "./post-card-dialog";
import { DashboardPost } from "@/types/dashboard";
import { Logo } from "@/components/logo";

type Props = {
  post: DashboardPost;
};

export function MessageCard({ post }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const fontSizeClass = useMemo(() => {
    const wordCount = post.content.trim().split(/\s+/).length;
    if (wordCount < 50) return "[font-size:clamp(1rem,0.5vw+1rem,1.25rem)]";
    if (wordCount < 120) return "[font-size:clamp(0.875rem,0.4vw+0.9rem,1rem)]";
    return "[font-size:clamp(0.75rem,0.3vw+0.8rem,0.9rem)]";
  }, [post.content]);

  return (
    <>
      <button
        type="button"
        id={`umedu-${post.id}`}
        onClick={() => setIsOpen(true)}
        className="text-left w-full p-4"
      >
        <Card className="w-full justify-between overflow-hidden aspect-square">
          <CardContent>
            <CardTitle className="mb-2 min-w-0 break-words text-xl leading-tight">
              {post.title}
            </CardTitle>

            <div
              className={cn(
                "min-w-0 break-words dark:prose-invert text-muted-foreground font-medium",
                fontSizeClass,
              )}
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                {post.content.replace(/\s+/g, " ")}
              </Markdown>
            </div>

            <div className="space-x-2 mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>

          <div className="space-y-6">
            <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <InboxIcon className="size-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>

              <Logo />
            </CardFooter>
          </div>
        </Card>
      </button>

      <PostCardDialog post={post} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
