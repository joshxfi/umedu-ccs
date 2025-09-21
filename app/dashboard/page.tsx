import { redirect } from "next/navigation";

import { ForumNavbar } from "../forum/components/forum-navbar";
import { getSession } from "@/lib/auth";
import { DashboardView } from "./components/dashboard-view";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const { session } = await getSession();
  const { key } = await searchParams;

  if (!session || key !== process.env.API_ADMIN_SECRET) {
    redirect("/");
  }

  return (
    <div className="pb-16">
      <ForumNavbar />

      <main className="container mx-auto max-w-5xl pt-28 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Review posts from the forum with admin-only access.
          </p>
        </div>

        <DashboardView />
      </main>
    </div>
  );
}
