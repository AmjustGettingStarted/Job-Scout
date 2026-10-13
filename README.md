# GhostScout

GhostScout is a small paid web tool for developers who are job hunting and do not want their resume sent to a closed AI vendor.

Search remote roles, paste a resume, and an open-weight model returns a match score, missing tech-stack skills, and highlights worth mentioning. One click drafts a short recruiter email from the candidate's real experience. The first three scans are free. After that, Pro Scout is $9/month via Stripe Checkout in test mode.

There is no database and no account. Scan count and Pro status live in the browser.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
| --- | --- |
| `TINKER_BASE_URL` | OpenAI-compatible base URL for Hosted mode, including `/v1` |
| `TINKER_API_KEY` | Key for that endpoint |
| `TINKER_MODEL` | Open-weight model name |
| `OLLAMA_BASE_URL` | Private mode. Defaults to `http://localhost:11434/v1` |
| `OLLAMA_MODEL` | Defaults to `llama3.1` |
| `STRIPE_SECRET_KEY` | Stripe secret key, test mode |
| `STRIPE_PRICE_ID` | A $9/month recurring test price |
| `NEXT_PUBLIC_APP_URL` | Public origin, used for Checkout return URLs |

If a model is not configured, or the call fails, scans return a clearly labeled mock and the page toasts `Demo mode: no model connected`.

## Private mode (Ollama)

```bash
ollama pull llama3.1
ollama serve
```

In the app, choose **Private (Ollama)**. GhostScout calls `http://localhost:11434/v1/chat/completions`.

## Hosted mode (Tinker)

Set `TINKER_BASE_URL`, `TINKER_API_KEY`, and `TINKER_MODEL` to any OpenAI-compatible open-weight endpoint. Choose **Hosted (Tinker)**.

## Stripe test mode

Create a $9/month recurring price in the Stripe test dashboard and put its id in `STRIPE_PRICE_ID`. Use card `4242 4242 4242 4242`, any future expiry, and any CVC. After payment, the return URL is verified and this browser is marked Pro.

This build stores Pro in `localStorage` after a successful Checkout session. A production version should use Stripe webhooks and server-side entitlements so a refresh or a second browser cannot grant itself Pro.

## Deploy on Render

- Build command: `npm run build`
- Start command: `npm start`
- Add the environment variables above in the Render service settings
- Set `NEXT_PUBLIC_APP_URL` to the public Render URL
