import { Button, Html } from "@react-email/components";
import * as React from "react";
import TailwindProvider from "./utils/tailwind";
import { EmailButton } from "./ui/email-button";

export default function EmailVerificationEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  return (
    <TailwindProvider>
      <Html>
        <p>
          Clique no botão abaixo para verificar seu email ({email}).
        </p>
        <EmailButton
          href={url}
        >
          Verificar email
        </EmailButton>
      </Html>
    </TailwindProvider>
  );
};
