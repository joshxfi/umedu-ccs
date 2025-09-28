"use server";

import { desc, eq, count } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/db";
import { postTable } from "@/db/schema";
import type { DashboardPostsResponse } from "@/types/dashboard";
import { safeDecrypt } from "@/lib/utils";

const getTotalCached = unstable_cache(
  async (forumId: string) => {
    const [totalResult] = await db
      .select({ value: count() })
      .from(postTable)
      .where(eq(postTable.forumId, forumId));
    return Number(totalResult?.value ?? 0);
  },
  ["dashboard:total"],
  { revalidate: 30 },
);

const getPageCached = unstable_cache(
  async (forumId: string, limit: number, offset: number) => {
    return db.query.postTable.findMany({
      with: { tagsToPosts: { with: { tag: true } } },
      where: eq(postTable.forumId, forumId),
      orderBy: [desc(postTable.createdAt), desc(postTable.id)],
      limit,
      offset,
    });
  },
  ["dashboard:page"],
  { revalidate: 30 },
);

export async function getDashboardPosts({
  forumId,
  limit,
  offset,
}: {
  forumId: string;
  limit: number;
  offset: number;
}): Promise<DashboardPostsResponse> {
  const [total, posts] = await Promise.all([
    getTotalCached(forumId),
    getPageCached(forumId, limit, offset),
  ]);

  const postsData = await Promise.all(
    posts.map(async ({ tagsToPosts, ...rest }) => {
      const title = await safeDecrypt(rest.title);
      const content = await safeDecrypt(rest.content);
      return {
        ...rest,
        title,
        content,
        tags: tagsToPosts.map((t) => t.tag),
      };
    }),
  );

  return {
    posts: postsData,
    total,
    limit,
    offset,
  };
}
