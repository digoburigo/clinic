import { redirect } from "next/navigation";
import { Suspense } from "react";
import StepperDemo from "~/components/custom-stepper";
import { PostList } from "~/components/post-list";
import { Card, CardContent, CardTitle, CardHeader } from "~/components/ui/card";
import { useSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Page() {
  const authSession = await useSession();

  if (!authSession?.user) {
    redirect("/login");
  }

  void api.post.findMany.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <PostList />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <StepperDemo />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}


