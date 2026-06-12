# Review Lens

Review Lens is a paste-first MVP that explains the hidden meaning of travel and local-business reviews: native-language warning signals, intentional misspellings, slang, cultural nuance, traveler advice, and business owner action items.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## MVP Scope

- No login
- No database
- No Google scraping
- No automatic review replies
- User-pasted reviews only
- Rule-based hidden-signal analysis first, AI-backed analysis later

## Optional AI Analyzer

The app works without an API key. To enable the AI-backed JSON analyzer, create `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.5
```

The API route still keeps the local analyzer as a fallback. If the OpenAI request fails or returns invalid JSON, the app returns the local rule-based result with a limitation note.

## Key Files

- `app/page.tsx`: main Review Lens interface
- `app/api/analyze/route.ts`: analysis endpoint
- `lib/analyze.ts`: local analyzer pipeline
- `lib/hidden-signals.ts`: first hidden-signal dictionary
- `types/analysis.ts`: report schema
