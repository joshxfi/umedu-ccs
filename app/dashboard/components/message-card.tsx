import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { CalendarIcon } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PostCardDialog } from "./post-card-dialog";
import { DashboardPost } from "@/types/dashboard";

type Props = {
  post: DashboardPost;
};

export function MessageCard({ post }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        key={post.id}
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-left w-full"
      >
        <div id={`umedu-${post.id}`}>
          <Card className="w-full justify-between overflow-hidden">
            <CardContent>
              <CardTitle className="mb-2 leading-tight">{post.title}</CardTitle>
              <div className="min-w-0 break-words dark:prose-invert text-muted-foreground font-medium">
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
              <CardFooter className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Posted {formatDate(post.createdAt)}</span>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </button>

      <PostCardDialog post={post} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
