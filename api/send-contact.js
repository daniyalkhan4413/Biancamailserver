import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function getEasternTime() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

export default async function handler(req, res) {
  // ✅ Allow ALL origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, message } = req.body || {};

  if (!email || !name) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const mailOptions = {
    from: `"BIANCA" <${process.env.GMAIL_USER}>`,
    to: "matiasriesco88@hotmail.com",
    replyTo: email, // ✅ reply goes to sender
    subject: `New Contact Form Submission - ${getEasternTime()}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Message:</strong> ${message || "-"}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Contact email sent successfully!" });
  } catch (error) {
    console.error("❌ Contact form error:", error?.message || error);
    return res.status(500).json({
      message: "Failed to send contact email.",
      error: error?.message,
    });
  }
}
