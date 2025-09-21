import type { Post, Tag } from "@/db/schema";

export type DashboardPost = Post & { tags: Tag[] };

export type DashboardPostsResponse = {
  posts: DashboardPost[];
  total: number;
  limit: number;
  offset: number;
};
