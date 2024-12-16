"use client"

import { authClient } from "~/lib/auth-client";
import { api } from "~/trpc/react";

export function PostList() {
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const { data: posts, isLoading } = api.post.findMany.useQuery({
    where: {
      organizationId: activeOrganization?.id,
    },
  })

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {posts?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
