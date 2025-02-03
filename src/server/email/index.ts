import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { ReactElement } from "react";
import { Resend } from "resend";

interface Props {
  emailTemplate: ReactElement;
  to: string;
  subject: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ emailTemplate, to, subject }: Props) {
  const html = await render(emailTemplate);

  if (process.env.NODE_ENV === "production") {
    await resend.emails.send({
      from: "Melomar Clínica <updates@melomarclinica.com.br>",
      to,
      subject,
      html,
    });
  } else {
    const smtpOptions: SMTPTransport.Options = {
      // remove "service"
      service: "Gmail",
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: parseInt(process.env.SMTP_PORT || "2525"),
      // secure: true,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "user",
        pass: process.env.SMTP_PASSWORD || "password",
      },
    };

    const transporter = nodemailer.createTransport({
      ...smtpOptions,
    });

    const options = {
      from: process.env.SMTP_FROM_EMAIL,
      to,
      subject,
      html,
    };

    await transporter.sendMail(options);
  }
}
