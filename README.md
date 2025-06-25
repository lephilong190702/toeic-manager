# 📝 TOEIC Vocabulary Manager

An AI-powered web app to manage and learn TOEIC vocabulary using smart flashcards and interactive review.

---

## 🚀 Features

- ✏️ **Add / Edit / Delete** words with custom input
- 🧠 **Auto-generate flashcards** (meaning, IPA, example, tip) using AI
- 📋 **Batch input** multiple words at once
- 🤖 **Spelling suggestions** using Levenshtein distance
- ✅ **Mark as learned** and review later
- 🔁 **Flashcard view** with flip animation, audio, and regenerate options
- 🎯 **Filter words** by topic, level, part of speech
- 📈 **Learning stats** (learned/unlearned, history by week/month/year)
- 🪄 **AI Integration**
  - Uses [OpenRouter.ai](https://openrouter.ai/) as backend
  - Only saves words with successful AI generation
  - Regeneration updates content without changing ID
  - Real-time progress display during batch generation

---

## 🧰 Tech Stack

### 🔙 Backend
- Java + Spring Boot (REST + WebFlux)
- JPA (Hibernate) + MySQL
- Lombok + Maven
- OpenRouter.ai API integration

### 🔜 Frontend
- ReactJS (Vite)
- TailwindCSS
- Axios for API calls
- React Context API
- `js-levenshtein` for spelling suggestions
