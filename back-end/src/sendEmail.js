import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ 
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function sendEmail(to, subject, text) {
	const cmd = new SendEmailCommand({
		Source: process.env.EMAIL_FROM,
		Destination: { ToAddresses: [to] },
		Message: {
			Subject: { Data: subject },
			Body: { 
				Text: { Data: text },
				Html: { Data: text.replace(/\n/g, "<br>") }, // Convert text to simple HTML
			},
		},
	});
	
	return ses.send(cmd);
}
