import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Gmail prefers 465 for secure SSL
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_PASS, // App Password, NOT your normal Gmail password
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
  // ✅ Allow all origins (for testing only)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle preflight request
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { name, phone, company, email, from, to, howHeard, services } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "Carletta@DakotasLTWA.com", 
    subject: `New Quote Request - ${getEasternTime()}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>From:</strong> ${from}</p>
      <p><strong>To:</strong> ${to}</p>
      <p><strong>How Heard:</strong> ${howHeard}</p>
      <p><strong>Services:</strong> ${services?.join(", ") || "None"}</p>
      <p><strong>Submitted At (ET):</strong> ${getEasternTime()}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Quote submitted successfully!" });
  } catch (error) {
    console.error("❌ Quote form error:", error);
    res.status(500).json({ message: "Failed to send quote." });
  }
}
