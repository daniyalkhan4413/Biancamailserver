import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Gmail address
    pass: process.env.GMAIL_PASS, // Gmail App Password
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
  // ✅ CORS (same as before)
  const allowedOrigin = "https://reisco.vercel.app";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const mailOptions = {
    from: `"REISCO" <${process.env.GMAIL_USER}>`,
    to: "dk1056896@gmail.com", // send to yourself
    replyTo: email, // ✅ replies go to customer
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
    return res.status(500).json({ message: "Failed to send contact email." });
  }
}