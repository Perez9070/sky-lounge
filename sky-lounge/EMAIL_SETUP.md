# Web3Forms Email Setup

The customer support chat and contact form send messages through the backend endpoint:

```text
POST /api/support-message
```

The backend forwards those messages to Web3Forms:

```text
https://api.web3forms.com/submit
```

## Required Setting

Create a Web3Forms access key, then use this environment variable:

```env
PORT=3000
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

The access key controls which email address receives the form messages in Web3Forms.

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

When the chatbot cannot answer a customer, or when the contact form is submitted, the site posts to `/api/support-message`. The server then sends the message to Web3Forms.
