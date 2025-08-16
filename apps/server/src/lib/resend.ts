import { Resend } from "resend";
import config from "../config/config";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail(data: {
	to: string;
	subject: string;
	html: string;
}) {
	try {
		// Remove /api from any URLs in the HTML content
		const cleanHtml = data.html.replace(/\/api\//g, "/");
		const sendResult = await resend.emails.send({
			from: "authentication@infrunta.com",
			to: data.to,
			subject: data.subject,
			html: cleanHtml,
		});

		return sendResult;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to send email");
	}
}
