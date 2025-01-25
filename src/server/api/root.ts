import { postRouter } from "~/server/api/custom-routers/post";
import {
  createCallerFactory,
  createTRPCRouter,
  mergeTRPCRouters,
} from "~/server/api/trpc";
import { createRouter } from "./generated-routers/routers";
import { userRouter } from "./custom-routers/user";

export const generatedRouter = createRouter();
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const customRouter = createTRPCRouter({
  _post: postRouter,
  _user: userRouter,
});

export const appRouter = mergeTRPCRouters(customRouter, generatedRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
