import { desc, eq, count } from "drizzle-orm";

import { db } from "@/db";
import { postTable } from "@/db/schema";
import { aesDecrypt } from "@/lib/aes";
import type { DashboardPostsResponse } from "@/types/dashboard";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function clampLimit(limit: number | undefined) {
  if (!limit) {
    return DEFAULT_LIMIT;
  }

  if (Number.isNaN(limit)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.max(limit, 1), MAX_LIMIT);
}

export async function getDashboardPosts({
  forumId,
  limit,
  offset,
}: {
  forumId: string;
  limit: number;
  offset: number;
}): Promise<DashboardPostsResponse> {
  const [totalResult] = await db
    .select({ value: count() })
    .from(postTable)
    .where(eq(postTable.forumId, forumId));

  const total = Number(totalResult?.value ?? 0);

  const posts = await db.query.postTable.findMany({
    with: {
      tagsToPosts: {
        with: {
          tag: true,
        },
      },
    },
    where: eq(postTable.forumId, forumId),
    orderBy: [desc(postTable.createdAt), desc(postTable.id)],
    limit,
    offset,
  });

  const postsData = await Promise.all(
    posts.map(async ({ tagsToPosts, ...rest }) => {
      let title: string;
      let content: string;

      try {
        title = await aesDecrypt(rest.title);
      } catch {
        title = rest.title;
      }

      try {
        content = await aesDecrypt(rest.content);
      } catch {
        content = rest.content;
      }

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
