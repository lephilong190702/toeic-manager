# TOEIC Vocabulary Manager

A full-stack web application to **manage and learn TOEIC vocabulary** with AI-powered flashcards.

## 🔍 Features

- ✏️ Add / Edit / Delete TOEIC words
- 🎯 Filter by **topic**, **level**, or **part of speech**
- 📊 Mark words as **learned** and review them later
- 🪄 Auto-generate flashcards using AI (meaning, IPA, example, tip)
- 🔁 Flashcard learning interface (flip view + audio + example)
- 🤖 Suggest similar words if user input contains typos
- 📋 Batch input: enter multiple words and generate in one go

## 🧠 AI Integration

- Backend uses **OpenRouter.ai** to generate word content
- Only saves words successfully generated
- Frontend shows progress and skips failed items
- Provides spelling correction suggestions with `js-levenshtein`

## 🧰 Tech Stack

### Backend
- **Spring Boot**
- Spring WebFlux + WebClient
- Spring Data JPA
- MySQL
- Lombok
- Maven

### Frontend
- **ReactJS** (Vite)
- TailwindCSS
- Axios
- React Context API
- `js-levenshtein` for typo suggestions
