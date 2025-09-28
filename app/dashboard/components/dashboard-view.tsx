"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ImagesIcon, MessageCircleDashedIcon } from "lucide-react";

import { PostCardSkeleton } from "@/app/forum/components/post-card-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { DashboardPostsResponse } from "@/types/dashboard";
import { MessageCard } from "./message-card";
import { saveImagesBulk } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function clampLimit(limit: number | undefined) {
  if (!limit) return DEFAULT_LIMIT;
  if (Number.isNaN(limit)) return DEFAULT_LIMIT;
  return Math.min(Math.max(limit, 1), MAX_LIMIT);
}

function getPaginationPages(current: number, totalPages: number) {
  const siblings = 1;
  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);

  for (let page = current - siblings; page <= current + siblings; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function buildHref({
  key,
  page,
  limit,
}: {
  key?: string | null;
  page: number;
  limit: number;
}) {
  const params = new URLSearchParams();
  if (key) {
    params.set("key", key);
  }
  params.set("page", String(page));
  params.set("limit", String(limit));
  return `?${params.toString()}`;
}

export function DashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const adminKey = searchParams.get("key");

  const currentPage = useMemo(() => {
    const rawPage = searchParams.get("page");
    if (!rawPage) {
      return 1;
    }

    const parsed = Number.parseInt(rawPage, 10);
    if (Number.isNaN(parsed)) {
      return 1;
    }

    return Math.max(parsed, 1);
  }, [searchParams]);

  const currentLimit = useMemo(() => {
    const rawLimit = searchParams.get("limit");
    if (!rawLimit) return DEFAULT_LIMIT;

    const parsed = Number.parseInt(rawLimit, 10);
    return clampLimit(parsed);
  }, [searchParams]);

  const offset = (currentPage - 1) * currentLimit;

  const queryKey = [
    "dashboard-posts",
    { key: adminKey ?? "", page: currentPage, limit: currentLimit },
  ] as const;

  const fetchDashboardPosts = async (): Promise<DashboardPostsResponse> => {
    const params = new URLSearchParams({
      limit: String(currentLimit),
      offset: String(offset),
    });

    if (adminKey) {
      params.set("key", adminKey);
    }

    const res = await fetch(`/api/dashboard-posts?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to load dashboard posts");
    }

    return (await res.json()) as DashboardPostsResponse;
  };

  const { data, error, isError, isFetching, isLoading } = useQuery({
    queryKey,
    queryFn: fetchDashboardPosts,
    placeholderData: keepPreviousData,
    enabled: Boolean(adminKey),
  });

  const isInitialLoading = isLoading && !data;
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const total = data?.total ?? 0;
  const effectiveLimit = data?.limit ?? currentLimit;
  const usedOffset = data?.offset ?? offset;
  const posts = data?.posts ?? [];

  const pageCount = data ? Math.max(Math.ceil(total / effectiveLimit), 1) : 1;
  const effectivePage = data
    ? Math.min(Math.floor(usedOffset / effectiveLimit) + 1, pageCount)
    : currentPage;

  const hasPreviousPage = effectivePage > 1;
  const hasNextPage = effectivePage < pageCount;

  const firstItemIndex = total === 0 ? 0 : usedOffset + 1;
  const lastItemIndex = Math.min(usedOffset + effectiveLimit, total);

  const paginationPages = getPaginationPages(effectivePage, pageCount);

  const handleNavigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(currentLimit));
    if (adminKey) {
      params.set("key", adminKey);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleDownloadAll = async () => {
    if (isInitialLoading || !posts.length || isDownloadingAll) {
      return;
    }

    setIsDownloadingAll(true);
    try {
      await saveImagesBulk(posts.map((post) => `umedu-${post.id}`));
    } finally {
      setIsDownloadingAll(false);
    }
  };

  if (!adminKey) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertTitle>Missing admin key</AlertTitle>
        <AlertDescription>
          Add your admin key to the URL to access the dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertTitle>Failed to load posts</AlertTitle>
        <AlertDescription>
          {(error as Error).message ?? "An unexpected error occurred."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex px-4 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground space-y-1 sm:space-y-0">
          <div>
            Showing {total === 0 ? 0 : firstItemIndex}–{lastItemIndex} of{" "}
            {total}
          </div>
          <div>
            {/* Page {effectivePage} of {pageCount} */}
            {isFetching ? " · Updating…" : ""}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadAll}
          disabled={
            isInitialLoading || !posts.length || isDownloadingAll || isFetching
          }
          className="self-start sm:self-auto"
        >
          {isDownloadingAll ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <ImagesIcon />
          )}
          {isDownloadingAll ? "Downloading..." : "Download All"}
        </Button>
      </div>

      {isInitialLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: Math.min(currentLimit, 6) }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Alert className="max-w-2xl">
          <MessageCircleDashedIcon className="size-5" />
          <AlertTitle>No posts yet</AlertTitle>
          <AlertDescription>
            When new posts arrive they will appear in this dashboard.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid md:grid-cols-2">
          {posts.map((post) => (
            <MessageCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  hasPreviousPage
                    ? buildHref({
                        key: adminKey,
                        page: effectivePage - 1,
                        limit: currentLimit,
                      })
                    : undefined
                }
                aria-disabled={!hasPreviousPage}
                className={
                  !hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={(event) => {
                  if (!hasPreviousPage) return;
                  event.preventDefault();
                  handleNavigate(effectivePage - 1);
                }}
              />
            </PaginationItem>

            {paginationPages.map((pageNumber, index) => {
              const previousPage = paginationPages[index - 1];
              const showEllipsis =
                index > 0 && pageNumber - Number(previousPage) > 1;

              return (
                <React.Fragment key={pageNumber}>
                  {showEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href={buildHref({
                        key: adminKey,
                        page: pageNumber,
                        limit: currentLimit,
                      })}
                      isActive={pageNumber === effectivePage}
                      aria-current={
                        pageNumber === effectivePage ? "page" : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        if (pageNumber === effectivePage) return;
                        handleNavigate(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href={
                  hasNextPage
                    ? buildHref({
                        key: adminKey,
                        page: effectivePage + 1,
                        limit: currentLimit,
                      })
                    : undefined
                }
                aria-disabled={!hasNextPage}
                className={
                  !hasNextPage ? "pointer-events-none opacity-50" : undefined
                }
                onClick={(event) => {
                  if (!hasNextPage) return;
                  event.preventDefault();
                  handleNavigate(effectivePage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
