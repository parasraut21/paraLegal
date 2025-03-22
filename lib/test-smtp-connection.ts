// test-smtp-connection.ts
import nodemailer from "nodemailer";

async function testConnection() {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    // console.log("Connection successful:", result);
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

testConnection();