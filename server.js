const express = require("express");
const fs = require("fs");
const path = require("path");

function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#") || !trimmedLine.includes("=")) return;

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

// Web3Forms access keys are public form identifiers, but keep the value in
// Render/local env so deployments can be configured without editing HTML.
const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;

app.use(express.static(publicDir));
app.use("/images", express.static(imagesDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/web3forms-config", (req, res) => {
  if (!web3FormsKey) {
    return res.status(503).json({
      success: false,
      message: "Web3Forms key is missing in server environment.",
    });
  }

  res.set("Cache-Control", "no-store");
  res.json({
    success: true,
    accessKey: web3FormsKey,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
