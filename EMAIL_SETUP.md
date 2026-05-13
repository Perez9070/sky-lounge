# Gmail SMTP Email Setup

The customer support chat sends unanswered questions through the backend endpoint:

```text
POST /api/support-message
```

This app now sends those messages through Gmail SMTP with Nodemailer.

## Required Settings

Use these values for a Gmail address:

```env
PORT=3000
SUPPORT_EMAIL=perezmainaabel@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_16_character_gmail_app_password
EMAIL_FROM_NAME=Flight Control Website
```

If you are sending the support messages to yourself, set `SUPPORT_EMAIL` to the Gmail address where you want to receive the messages. It can be the same address as `SMTP_USER`.

For port `587`, keep `SMTP_SECURE=false`. If you use port `465`, set `SMTP_SECURE=true`.

## Gmail App Password

Do not use your normal Gmail password. Google requires an app password for SMTP sign-in in this kind of app.

1. Turn on 2-Step Verification for your Google account.
2. Create a Gmail app password from your Google Account security settings.
3. Put that app password in `SMTP_PASS`.
4. Put your full Gmail address in `SMTP_USER`.

## Render Setup

In Render, deploy this project as a Web Service.

```text
Build Command: npm install
Start Command: npm start
```

Then add these environment variables in Render:

```text
SUPPORT_EMAIL=perezmainaabel@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM_NAME=Flight Control Website
```

Render can read the non-secret values from `render.yaml`, but you still need to enter `SMTP_USER` and `SMTP_PASS` in Render because they are marked as secret values.

## Local Testing

Create a local `.env` file with the same values, then run:

```bash
npm install
npm start
```

When the chatbot cannot answer a customer, it asks for their email and sends the question to `SUPPORT_EMAIL`.
