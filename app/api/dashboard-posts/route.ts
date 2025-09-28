import type { NextRequest } from "next/server";

import { getSession } from "@/lib/auth";
import { clampLimit } from "@/lib/utils";
import { getDashboardPosts } from "@/actions/dashboard";

export async function GET(req: NextRequest) {
  try {
    const { session } = await getSession();
    const searchParams = req.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!session || key !== process.env.API_ADMIN_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    const parsedLimit = limitParam
      ? Number.parseInt(limitParam, 10)
      : undefined;
    const limit = clampLimit(parsedLimit);

    const parsedOffset = offsetParam ? Number.parseInt(offsetParam, 10) : 0;
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);

    const data = await getDashboardPosts({
      forumId: session.forumId,
      limit,
      offset,
    });

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
