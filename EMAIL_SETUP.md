# Support Email Setup

The customer support chat sends unanswered questions through a backend endpoint:

```text
POST /api/support-message
```

It uses Web3Forms because it has a free contact-form email API and keeps the access key on the server.

## Setup

1. Create a free access key at https://web3forms.com/
2. Create a `.env` file in the project root.
3. Add:

```env
PORT=3000
SUPPORT_EMAIL=perezmainaabel@gmail.com
WEB3FORMS_ACCESS_KEY=your_access_key_here
```

4. Install dependencies and run the server:

```bash
npm install
npm start
```

When the chatbot cannot answer a customer, it asks for their email and sends the question to the support inbox in real time.
