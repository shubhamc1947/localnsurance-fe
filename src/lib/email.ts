import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(`[EMAIL] Sending to: ${to}, Subject: ${subject}`);

  try {
    const info = await transporter.sendMail({
      from: `"Localsurance" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(`[EMAIL] Sent successfully. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${to}:`, error);
    throw error;
  }
}
