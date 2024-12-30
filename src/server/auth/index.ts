import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { headers } from "next/headers";
import { admin, organization } from "better-auth/plugins";
import { sendEmail } from "../email";
import OrganizationInvitationEmail from "../email/templates/OrganizationInvitationEmail";
import EmailVerificationEmail from "../email/templates/EmailVerificationEmail";
import ResetPasswordEmail from "../email/templates/ResetPasswordEmail";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      console.log("Sending verification email to", user.email);
      const res = await sendEmail({
        emailTemplate: EmailVerificationEmail({
          email: user.email,
          url,
        }),
        to: user.email,
        subject: "Verifique seu email",
      });
      console.log(res, user.email);
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
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
    admin(),
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 20,
      membershipLimit: 200,
      async sendInvitationEmail(data) {
        const inviteLink =
          process.env.NODE_ENV === "development"
            ? `http://localhost:3000/accept-invitation/${data.id}`
            : `${
                process.env.BETTER_AUTH_URL || "https://demo.better-auth.com"
              }/accept-invitation/${data.id}`;

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
      },
    }),
  ],
});

export const useSession = async () => {
  return await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
};
