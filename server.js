const express = require("express");
const fs = require("fs");
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
const web3FormsAccessKey = process.env.WEB3FORMS_ACCESS_KEY;

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
      message: "Please send a question between 1 and 1200 characters."
    });
  }

  if (!emailPattern.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid customer email address."
    });
  }

  if (!web3FormsAccessKey) {
    return res.status(503).json({
      success: false,
      message: "Email delivery is not configured yet. Add WEB3FORMS_ACCESS_KEY to the server environment."
    });
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        access_key: web3FormsAccessKey,
        subject: "Flight Control customer support question",
        from_name: "Flight Control Website Chat",
        email: trimmedEmail,
        replyto: trimmedEmail,
        customer_email: trimmedEmail,
        support_email: supportEmail,
        page: safePageUrl,
        message: trimmedQuestion
      })
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      return res.status(response.status || 502).json({
        success: false,
        message: data.message || "Email provider could not send this message."
      });
    }

    return res.json({
      success: true,
      message: "Your question was sent to Flight Control support."
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Email delivery failed. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
