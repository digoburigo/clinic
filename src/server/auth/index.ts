import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { headers } from "next/headers";
import { admin, organization } from "better-auth/plugins";
import { sendEmail } from "../email";
import OrganizationInvitationEmail from "emails/OrganizationInvitationEmail";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
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
        const inviteLink = `https://example.com/accept-invitation/${data.id}`;
        await sendEmail({
          emailTemplate: OrganizationInvitationEmail({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          }),
          to: data.email,
          subject: "You've been invited to join an organization",
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
