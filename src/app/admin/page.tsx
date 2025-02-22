import { redirect } from "next/navigation";
import { AdminUsers } from "~/components/admin-users";
import { auth } from "~/server/auth";

import { Metadata } from "next";

import { headers } from "next/headers";
import Link from "next/link";
import { UserMenu } from "~/components/user/user-menu";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Área administrativa",
  description: "Área administrativa",
};

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  if (session.user.role !== "admin") {
    return redirect("/");
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl)">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="mx-6">
            <nav className={cn("flex items-center space-x-4 lg:space-x-6")}>
              <Link
                href="/admin"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Área administrativa
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <UserMenu showName={true} />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AdminUsers />
      </div>
    </div>
  );
}
