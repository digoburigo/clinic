import { render } from '@react-email/components';
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { ReactElement } from "react";

interface Props {
	emailTemplate: ReactElement;
	to: string;
	subject: string;
}

export async function sendEmail({ emailTemplate, to, subject }: Props) {
	const html = await render(emailTemplate);

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