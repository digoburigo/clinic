import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";

import type { AppRouter } from "~/server/api/root";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

// -- OLD
// // import "server-only";

// import { createHydrationHelpers } from "@trpc/react-query/rsc";
// import { headers } from "next/headers";
// import { cache } from "react";

// import { createCaller, type AppRouter } from "~/server/api/root";
// import { createTRPCContext } from "~/server/api/trpc";
// import { createQueryClient } from "./query-client";

// /**
//  * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
//  * handling a tRPC call from a React Server Component.
//  */
// const createContext = cache(async () => {
//   const heads = new Headers(await headers());
//   heads.set("x-trpc-source", "rsc");

//   return createTRPCContext({
//     headers: heads,
//   });
// });

// const getQueryClient = cache(createQueryClient);
// const caller = createCaller(createContext);

// export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
//   caller,
//   getQueryClient
// );
