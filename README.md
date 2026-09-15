# 💊 RxCheck — AI Drug Interaction Checker

A full-stack AI-powered application that checks drug interactions using Google Gemini AI.

🔗 **Live Demo:** https://rxcheck-client.onrender.com

> ⚠️ First load may take 30-60 seconds as the free-tier API wakes up from sleep.

---

## What it does

Enter two medication names and RxCheck returns:
- **Severity level** — Low, Moderate, High, or Critical
- **Plain-English explanation** of the interaction
- **Symptoms** to watch for
- **Recommendation** on what to do

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, JavaScript, CSS3 |
| Backend | .NET Core 9, Web API, C# |
| AI | Google Gemini 3.6 Flash API |
| Server | Nginx (reverse proxy + static serving) |
| Containers | Docker, Docker Compose |
| Deployment | Render.com |

---

## Architecture

Browser → Nginx (port 80)
├── / → React static files
└── /api → .NET Core 9 Web API → Google Gemini AI


---

## Running Locally

### Prerequisites
- .NET 9 SDK
- Node.js 18+
- Docker Desktop

### Without Docker

**Terminal 1 — API:**
```bash
cd RxCheck.API
dotnet run
```

**Terminal 2 — Frontend:**
```bash
cd rxcheck-client
npm install
npm start
```

App runs at `http://localhost:3000`

### With Docker

Create a `.env` file at the root:

GEMINI_API_KEY=your_gemini_api_key_here


Then:
```bash
docker-compose up --build
```

App runs at `http://localhost:3000`

---

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `GeminiApiKey` | `RxCheck.API/appsettings.json` | Google Gemini API key |
| `GEMINI_API_KEY` | `.env` (root) | Used by Docker Compose |

Copy `RxCheck.API/appsettings.example.json` and rename to `appsettings.json`, then add your key.

---

## API Reference

### POST `/api/DrugInteraction/check`

**Request:**
```json
{
  "drugOne": "Aspirin",
  "drugTwo": "Warfarin"
}
```

**Response:**
```json
{
  "severity": "High",
  "summary": "Taking aspirin and warfarin together significantly increases bleeding risk.",
  "symptoms": ["Unusual bruising", "Blood in urine", "Nosebleeds"],
  "recommendation": "Consult your doctor before taking these medications together."
}
```

---

## Planned Features (Layer 3)

- **Redis caching** — cache-aside pattern with 24hr TTL to reduce Gemini API calls
- **Rate limiting** — maximum 10 requests per minute per IP to protect the API

---

## Disclaimer

RxCheck is a personal project built for learning purposes. It is not a substitute for professional medical advice. Always consult a qualified healthcare professional before making decisions about medications.
