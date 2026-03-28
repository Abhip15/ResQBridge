# ResQBridge — Emergency Response Assistant

ResQBridge is a Gemini-powered emergency response assistant designed for bystanders at accident scenes. A bystander describes what they see (text and/or photo), and the app uses Google's Gemini 1.5 Pro multimodal API to extract structured incident data — location, casualty count, severity, nearest hospital, dispatch recommendations, and step-by-step bystander instructions — all in seconds. If the API is unavailable, the app falls back gracefully to mock data so the screen is never blank.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key
cp .env.example .env
# Edit .env and replace your_key_here with your key from https://aistudio.google.com/apikey

# 3. Start development server
npm run dev

# 4. Run tests
npm run test
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        App.jsx                          │
│              useEmergencyAnalysis (hook)                 │
│         ┌──────────┴──────────────┐                     │
│         ▼                         ▼                     │
│   InputScreen.jsx          ResultsScreen.jsx            │
│   - transcript input       - severity badge             │
│   - photo upload           - incident summary           │
│   - loading state          - dispatch + ETA countdown   │
│         │                  - bystander instructions      │
│         ▼                  - confidence gauge            │
│   geminiService.js               │                      │
│   - input sanitisation           ▼                      │
│   - injection detection    hospitalMatcher.js            │
│   - MIME validation        - zone-based matching         │
│   - Gemini 1.5 Pro call   - specialisation scoring       │
│   - response validation    - traffic-adjusted ETA        │
│   - mock fallback                                       │
│         │                                               │
│         ▼                                               │
│   Gemini 1.5 Pro API (multimodal: text + image)         │
└─────────────────────────────────────────────────────────┘
```

## Google Services Used

- **Gemini 2.5 Flash Multimodal API** — Analyses emergency transcripts and scene photos in a single `generateContent` call via the `@google/generative-ai` SDK. Extracts structured JSON (location, casualties, severity, dispatch, bystander instructions) with confidence scoring. Supports regional Indian languages by instructing the model to translate before extraction.

- **Google Fonts (Noto Sans)** — Loaded via `@fontsource/noto-sans` for consistent typography with Devanagari script support, ensuring Hindi and other regional language text renders correctly in extracted results.

## Known Limitations

- **No real dispatch system** — Hospital matching and ETA are simulated from a hardcoded list of 5 Bengaluru hospitals. In production this would integrate with a real ambulance dispatch API.
- **Client-side API key** — The Gemini API key is exposed in the browser bundle (Vite injects `VITE_` env vars at build time). A production app would proxy requests through a backend to keep the key server-side.
- **No persistent storage** — Results are lost on page refresh. There is no database or session persistence.
- **Single-city coverage** — Hospital zones only cover Bengaluru. The matcher defaults to Manipal Whitefield for unrecognised locations.
- **No real-time location** — The app relies on the transcript for location rather than GPS/geolocation APIs.
- **Image analysis depends on quality** — Gemini's ability to extract useful info from a scene photo varies with lighting, angle, and resolution.
