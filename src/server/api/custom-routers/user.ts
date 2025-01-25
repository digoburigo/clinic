import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { auth } from "~/server/auth";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        organizationId: z.string(),
        memberRole: z.enum(["member", "owner", "admin"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // create user
      const user = await auth.api.createUser({
        body: {
          email: input.email,
          password: "123456",
          name: input.email,
          role: "user",
        },
      });

      // create invite for user to join organization with id
      const invite = await auth.api.createInvitation({
        body: {
          email: input.email,
          organizationId: input.organizationId,
          role: input.memberRole,
          userId: user.user.id,
        },
      });

      return null;
    }),
});
