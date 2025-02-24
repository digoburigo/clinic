import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "~/components/app-sidebar";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/login");
  }

  if (!session?.user?.emailVerified) {
    return redirect("/verify-email");
  }

  if (session?.user?.role === "admin") {
    return redirect("/admin");
  }

  const member = await db.member.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (member?.role === "patient") {
    return redirect("/patient-area");
  }

  if (!session?.session.activeOrganizationId) {
    return redirect("/home");
  }

  return (
    // <SidebarProvider>
    //   <AppSidebar />
    //   <SidebarInset>
    //     <header className="flex h-16 shrink-0 items-center gap-2">
    //       <div className="flex items-center gap-2 px-4">
    //         <SidebarTrigger className="-ml-1" />
    //         <Separator orientation="vertical" className="mr-2 h-4" />
    //         <Breadcrumbs />
    //       </div>
    //     </header>

    //     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    //   </SidebarInset>
    // </SidebarProvider>

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumbs />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
