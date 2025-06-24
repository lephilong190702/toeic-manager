# 📝 TOEIC Vocabulary Manager

AI-powered web app to manage and learn TOEIC vocabulary using flashcards.

## 🚀 Features

- ✏️ Add / Edit / Delete words
- 🧠 Auto-generate flashcards (meaning, IPA, example, tip)
- 📋 Batch input multiple words
- 🎯 Filter by topic, level, part of speech
- ✅ Mark as learned & review later
- 🔁 Flashcard view (flip, audio, regenerate)
- 🤖 Spelling suggestions (Levenshtein distance)

## 🧠 AI Integration

- Uses [OpenRouter.ai](https://openrouter.ai)
- Only saves words with successful generation
- Regenerate updates content without changing ID
- Progress feedback during batch generation

## 🧰 Tech Stack

### Backend
- Spring Boot + WebFlux + JPA
- MySQL
- Lombok, Maven

### Frontend
- React (Vite)
- TailwindCSS, Axios
- React Context API
- `js-levenshtein`

## ▶️ Usage

```bash
# Backend
cd toeic
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev

Update .env or application.properties:

# properties
openrouter.api.key=YOUR_KEY
spring.datasource.url=jdbc:mysql://localhost:3306/toeic_vocab
