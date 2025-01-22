"use client";

import { api } from "~/trpc/react";

export function PostList() {
  const [posts] = api.post.findMany.useSuspenseQuery();

  if (posts.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <div>{posts?.map((post) => <div key={post.id}>{post.title}</div>)}</div>
  );
}
