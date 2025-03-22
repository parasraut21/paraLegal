import nodemailer from "nodemailer";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 465,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD, 
    },
  });

  try {
     await transport.verify();
    // console.log("SMTP connection test result:", testResult);
  } catch (error) {
    console.error("SMTP connection failed:", error);
    return;
  }

  try {
    await transport.sendMail({
      from: 'info@lawspeak.ai', 
      to,
      subject,
      html: body, 
    });
    // console.log("Email sent successfully:", sendResult);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
