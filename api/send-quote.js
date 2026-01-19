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
  // ✅ CORS (unchanged)
  const allowedOrigin = "https://www.riescologistics.com";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, phone, company, email, from, to, howHeard, services } = req.body;

  const mailOptions = {
    from: `"REISCO LOGISTICS" <${process.env.GMAIL_USER}>`,
    to: "dk1056896@gmail.com", // send to yourself
    replyTo: email, // ✅ reply goes to customer
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
    console.error("❌ Quote form error:", error?.message || error);
    res.status(500).json({ message: "Failed to send quote." });
  }
}
