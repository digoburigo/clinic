import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { vercel } from "@t3-oss/env-nextjs/presets-zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    BETTER_AUTH_URL: z.string(),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    // DIRECT_URL: z.string(),
    TURSO_DATABASE_URL: z.string(),
    TURSO_DATABASE_AUTH_TOKEN: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_FROM_EMAIL: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

// -- OLD
// export const env = createEnv({
//   /**
//    * Specify your server-side environment variables schema here. This way you can ensure the app
//    * isn't built with invalid env vars.
//    */
//   server: {
//     NODE_ENV: z
//       .enum(["development", "test", "production"])
//       .default("development"),
//     DATABASE_URL: z.string().url(),
//     // DIRECT_URL: z.string(),
//     TURSO_DATABASE_URL: z.string(),
//     TURSO_DATABASE_AUTH_TOKEN: z.string(),
//     BETTER_AUTH_SECRET: z.string(),
//     BETTER_AUTH_URL: z.string(),
//     GOOGLE_CLIENT_ID: z.string(),
//     GOOGLE_CLIENT_SECRET: z.string(),
//     SMTP_HOST: z.string(),
//     SMTP_PORT: z.string(),
//     SMTP_USER: z.string(),
//     SMTP_PASSWORD: z.string(),
//     SMTP_FROM_EMAIL: z.string(),
//   },

//   /**
//    * Specify your client-side environment variables schema here. This way you can ensure the app
//    * isn't built with invalid env vars. To expose them to the client, prefix them with
//    * `NEXT_PUBLIC_`.
//    */
//   client: {
//     // NEXT_PUBLIC_CLIENTVAR: z.string(),
//   },

//   /**
//    * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
//    * middlewares) or client-side so we need to destruct manually.
//    */
//   runtimeEnv: {
//     DATABASE_URL: process.env.DATABASE_URL,
//     // DIRECT_URL: process.env.DIRECT_URL,
//     NODE_ENV: process.env.NODE_ENV,
//     TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
//     TURSO_DATABASE_AUTH_TOKEN: process.env.TURSO_DATABASE_AUTH_TOKEN,
//     BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
//     BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
//     GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
//     GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
//     SMTP_HOST: process.env.SMTP_HOST,
//     SMTP_PORT: process.env.SMTP_PORT,
//     SMTP_USER: process.env.SMTP_USER,
//     SMTP_PASSWORD: process.env.SMTP_PASSWORD,
//     SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
//     // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
//   },
//   /**
//    * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
//    * useful for Docker builds.
//    */
//   skipValidation: !!process.env.SKIP_ENV_VALIDATION,
//   /**
//    * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
//    * `SOME_VAR=''` will throw an error.
//    */
//   emptyStringAsUndefined: true,
// });
