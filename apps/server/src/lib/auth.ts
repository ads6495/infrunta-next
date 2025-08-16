import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { User } from "prisma/generated/client";
import { Resend } from "resend";
import prisma from "../../prisma";
import config from "../config/config";
import { sendEmail } from "./resend";

const resend = new Resend(config.RESEND_API_KEY);

const findUserRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
    },
  });
  return user?.role;
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60, // we should set this to 1 day
    },
  },
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await sendEmail({
        to: data.user.email,
        subject: "Infrunta - Reset your password",
        html: `Click the link to reset your password: ${data.url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendEmail({
          to: user.email,
          subject: "Infrunta - Verify your email address",
          html: `Click the link to verify your email: ${url}`,
        });
        await resend.contacts.create({
          email: user.email,
          audienceId: config.RESEND_AUDIENCE_ID,
        });
      } catch (error) {
        console.error({
          error,
          message:
            "Error in sending verification email and creating resend contact",
        });
      }
    },
  },
  callbacks: {
    session: async ({ user, session }: { user: User; session: any }) => {
      const role = await findUserRole(session.userId);
      return {
        user: {
          ...user,
          role,
        },
        session,
      };
    },
  },
});
