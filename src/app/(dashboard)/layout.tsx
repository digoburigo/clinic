import { redirect } from "next/navigation";
import { AppSidebar } from "~/components/app-sidebar";
import { Breadcrumbs } from "~/components/breadcrumbs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authSession = await useSession();

  if (!authSession?.user) {
    return redirect("/login");
  }

  if (!authSession?.user?.emailVerified) {
    return redirect("/verify-email");
  }

  if (authSession?.user?.role === "admin") {
    return redirect("/admin");
  }

  const member = await api.member.findFirst({
    where: {
      userId: authSession.user.id,
    },
  });

  if (member?.role === "patient") {
    return redirect("/patient-area");
  }

  if (!authSession?.session.activeOrganizationId) {
    return redirect("/home");
  }

  return (
    <SidebarProvider>
      <AppSidebar memberRole={member?.role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
