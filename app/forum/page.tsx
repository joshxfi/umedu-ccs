import { CCSLogo } from "@/components/ccs-logo";
import { ForumFeed } from "./forum-feed";

export default function ForumPage() {
  return (
    <section className="w-full">
      <CCSLogo className="size-36 mx-auto mb-4" />

      <ForumFeed />
    </section>
  );
}
