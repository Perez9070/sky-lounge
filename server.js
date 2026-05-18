const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");

function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
        return;
      }

      const separatorIndex = trimmedLine.indexOf("=");
      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
}

loadLocalEnv();

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const imagesDir = path.join(publicDir, "images");
const supportEmail = process.env.SUPPORT_EMAIL || "perezmainaabel@gmail.com";
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS?.replace(/\s/g, "");
const emailFromName = process.env.EMAIL_FROM_NAME || "Flight Control Website";

app.use(express.json({ limit: "20kb" }));
app.use(express.static(publicDir));
app.use("/images", express.static(imagesDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/support-message", async (req, res) => {
  const { question, customerEmail, pageUrl } = req.body || {};
  const trimmedQuestion = typeof question === "string" ? question.trim() : "";
  const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
  const safePageUrl = typeof pageUrl === "string" ? pageUrl.trim() : "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedQuestion || trimmedQuestion.length > 1200) {
    return res.status(400).json({
      success: false,
      message: "Please send a request between 1 and 1200 characters."
    });
  }

  if (!emailPattern.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid customer email address."
    });
  }

  if (!smtpUser || !smtpPass) {
    return res.status(503).json({
      success: false,
      message: "Email delivery is not configured yet. Add SMTP_USER and SMTP_PASS to the server environment."
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: `"${emailFromName}" <${smtpUser}>`,
      to: supportEmail,
      replyTo: trimmedEmail,
      subject: "Flight Control customer support question",
      text: [
        "A customer asked this question in the website chat:",
        "",
        trimmedQuestion,
        "",
        `Customer email: ${trimmedEmail}`,
        `Page: ${safePageUrl || "Not provided"}`
      ].join("\n"),
      html: `
        <p>A customer asked this question in the website chat:</p>
        <blockquote>${escapeHtml(trimmedQuestion).replace(/\n/g, "<br>")}</blockquote>
        <p><strong>Customer email:</strong> ${escapeHtml(trimmedEmail)}</p>
        <p><strong>Page:</strong> ${escapeHtml(safePageUrl || "Not provided")}</p>
      `
    });

    return res.json({
      success: true,
      message: "Your request was sent to Flight Control."
    });
  } catch (error) {
    console.error("Email delivery failed:", error);

    return res.status(502).json({
      success: false,
      message: "Email delivery failed. Please try again."
    });
  }
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
