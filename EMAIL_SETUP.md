# Web3Forms Email Setup

The customer support chat and contact form send messages directly from the browser to Web3Forms:

```text
https://api.web3forms.com/submit
```

The Express server only exposes the configured access key to the browser at:

```text
GET /api/web3forms-config
```

## Required Setting

Create a Web3Forms access key, then use this environment variable:

```env
PORT=3000
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

The access key controls which email address receives the form messages in Web3Forms.
Web3Forms access keys are public form identifiers, so the browser can use this value.

## Render Setup

In Render, deploy this project as a Web Service.

```text
Build Command: npm install
Start Command: npm start
```

Then add this environment variable in Render:

```text
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

`render.yaml` already declares `WEB3FORMS_ACCESS_KEY` as a secret value, so you still need to enter the real key in the Render dashboard.

## Local Testing

Create a local `.env` file with the same value, then run:

```bash
npm install
npm start
```

When the chatbot cannot answer a customer, or when the contact form is submitted, the browser fetches `/api/web3forms-config` and then posts the form data directly to Web3Forms.
