// import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { admin, organization } from "better-auth/plugins";
import { sendEmail } from "../email";
import {
  ac,
  customOwnerAc,
  customAdminAc,
  cutomMemberAc,
  patientAc,
} from "./permissions";
import OrganizationInvitationEmail from "../email/templates/OrganizationInvitationEmail";
import EmailVerificationEmail from "../email/templates/EmailVerificationEmail";
import ResetPasswordEmail from "../email/templates/ResetPasswordEmail";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const orgs = await db.organization.findMany({
            where: {
              members: {
                some: {
                  userId: session.userId,
                },
              },
            },
          });

          const activeOrganizationId = orgs.length > 0 ? orgs.at(0)?.id : null;

          return {
            data: {
              ...session,
              activeOrganizationId,
            },
          };
        },
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: false,
    async sendVerificationEmail({ user, url }) {
      console.log("Sending verification email to", user.email);

      // change callback url to /
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      params.set("callbackUrl", "/");

      const res = await sendEmail({
        emailTemplate: EmailVerificationEmail({
          email: user.email,
          url: parsedUrl.toString(),
        }),
        to: user.email,
        subject: "Verifique seu email",
      });
      console.log(res, user.email);
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: process.env.SEED === "true" ? false : true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        emailTemplate: ResetPasswordEmail({
          resetLink: url,
        }),
        to: user.email,
        subject: "Troca de senha",
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    organization({
      ac: ac,
      roles: {
        owner: customOwnerAc,
        admin: customAdminAc,
        member: cutomMemberAc,
        patient: patientAc,
      },
      organizationLimit: 2,
      membershipLimit: 200,
      async sendInvitationEmail(data) {
        try {
          const user = await db.user.findFirst({
            where: {
              email: data.email,
            },
          });

          const inviteLink =
            process.env.NODE_ENV === "development"
              ? `http://localhost:3000/accept-invitation/${data.id}?has=${Boolean(user) ? "true" : "false"}`
              : `${
                  process.env.BETTER_AUTH_URL || "https://demo.better-auth.com"
                }/accept-invitation/${data.id}?has=${Boolean(user) ? "true" : "false"}`;

          await sendEmail({
            emailTemplate: OrganizationInvitationEmail({
              email: data.email,
              invitedByUsername: data.inviter.user.name,
              invitedByEmail: data.inviter.user.email,
              teamName: data.organization.name,
              inviteLink,
            }),
            to: data.email,
            subject: "Você foi convidado para entrar em uma organização",
          });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    admin(),
    nextCookies(),
  ],
});

export const useSession = async () => {
  return await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
};
