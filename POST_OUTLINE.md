# GhostScout — DEV challenge post outline

## The problem

Job tools that "score your resume" usually mean pasting your work history into a closed vendor. The resume is the product. You do not get to see the model, move it, or run it at home. For a developer who is already uneasy about where application data goes, that trade is a bad one.

## Who it's for

Developers who are actively job hunting, want a fast read on a remote role, and would rather run an open-weight model than hand a résumé to an API they cannot inspect.

## Why open models beat a closed API here

- **Privacy.** Private mode talks to Ollama on the user's machine. The resume does not have to leave the laptop.
- **Cost.** A local model is close to free to run. A hosted open-weight endpoint is a small bill, not a seat on a closed resume product.
- **No lock-in.** Both modes speak the OpenAI chat-completions shape. Swap the base URL and the model name without rewriting the app.
- **Fine-tuning later.** An open-weight model can be tuned on the user's own writing. A closed scoring API cannot.

## How it's built

One Next.js page. Remotive for the job feed. A match route that calls either Ollama or a hosted OpenAI-compatible endpoint and asks for JSON: score, missing skills, highlights, or a short outreach email. Three free scans in localStorage, then Stripe Checkout test mode for a $9/month Pro Scout plan. No database. No auth.

## First-user feedback

Placeholders until real notes land. The footer posts `{ helpful, note? }` and the server logs it.

- User A: _[what they tried]_ — _[did the score feel fair?]_
- User B: _[private vs hosted]_ — _[did they trust where the resume went?]_
- User C: _[would they pay $9]_ — _[what was missing?]_

## What's next

- Stripe webhooks and a real entitlement, instead of a browser flag
- A tighter prompt once a few real resumes have been scanned
- Optional fine-tune of the open-weight model on the user's own sent emails, still on their machine
