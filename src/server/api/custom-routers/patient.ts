import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const patientRouter = createTRPCRouter({
  relateToUser: protectedProcedure
    .input(z.object({ userId: z.string(), organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findFirst({
          where: {
            id: input.userId,
          },
        });
  
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
  
        console.log(`user.email:`, user.email)


        const patient = await ctx.db.patient.findFirst({
          where: {
            email: user.email,
            organizationId: input.organizationId,
          },
        });
  
        if (!patient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Patient not found",
          });
        }
  
        await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            patientUser: {
              connect: {
                id: patient.id,
              },
            },
          },
        });

        return patient;
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
});
