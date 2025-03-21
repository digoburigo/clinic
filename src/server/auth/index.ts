// import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, organization } from "better-auth/plugins";
import { headers } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";
import { sendEmail } from "../email";
import EmailVerificationEmail from "../email/templates/EmailVerificationEmail";
import OrganizationInvitationEmail from "../email/templates/OrganizationInvitationEmail";
import PatientRegistrationEmail from "../email/templates/PatientRegistrationEmail";
import ResetPasswordEmail from "../email/templates/ResetPasswordEmail";
import {
  ac,
  customAdminAc,
  customOwnerAc,
  cutomMemberAc,
  patientAc,
} from "./permissions";

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
      console.info("Sending verification email to", user.email);

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

          const inviteLinkUrl = new URL(env.NEXT_PUBLIC_BETTER_AUTH_URL);

          const isPatient = data.role === "patient";
          const pathname = isPatient
            ? "/patient-registration"
            : "/accept-invitation";
          inviteLinkUrl.pathname = `${pathname}/${data.id}`;

          const hasUser = Boolean(user);
          inviteLinkUrl.searchParams.set("has", hasUser ? "true" : "false");

          const emailTemplate = isPatient
            ? PatientRegistrationEmail
            : OrganizationInvitationEmail;

          const subject = isPatient
            ? "Você foi cadastrado como paciente"
            : "Você foi convidado para entrar em uma organização";

          await sendEmail({
            emailTemplate: emailTemplate({
              email: data.email,
              invitedByUsername: data.inviter.user.name,
              invitedByEmail: data.inviter.user.email,
              teamName: data.organization.name,
              inviteLink: inviteLinkUrl.toString(),
            }),
            to: data.email,
            subject,
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
