# 📝 TOEIC Vocabulary Manager

An AI-powered web app that helps you manage and learn TOEIC vocabulary using intelligent flashcards and interactive review modes.

---

## 🚀 Features

- ✏️ **Add / Edit / Delete** vocabulary manually
- 📋 **Batch input** multiple words at once
- 🧠 **AI-generated flashcards**:  
  Generates English meaning, IPA, example, memory tip, part of speech, topic, and level
- 🔁 **Flashcard view** with:
  - Flip animation
  - Audio pronunciation
  - Regenerate content on demand
- ✅ **Mark as learned** and **review learned words** by topic
- 📌 **New Words Tab**:  
  Learn words that haven't been marked as learned yet
- 🧠 **Spelling suggestions** using Levenshtein distance
- 🎯 **Filter words** by topic, level, and part of speech
- 📈 **Learning statistics**:
  - Number of learned/unlearned words
  - History by week / month / year

---

## 🪄 AI Integration

- Powered by [OpenRouter.ai](https://openrouter.ai/)
- Only saves words if AI generation is successful
- Regeneration replaces existing content (same ID retained)
- Real-time generation progress shown during batch mode

---

## 🧰 Tech Stack

### 🔙 Backend

- Java + Spring Boot (REST + WebFlux)
- JPA (Hibernate) + MySQL
- Lombok + Maven
- OpenRouter.ai API integration

### 🔜 Frontend

- ReactJS (Vite)
- Tailwind CSS
- Axios for API calls
- React Context API for global state
- `js-levenshtein` for spelling correction

---

## 📂 Project Structure

```plaintext
toeic-manager/
├── toeic/                    # Spring Boot backend
│   ├── controller/           # REST API controllers
│   ├── service/              # Business logic
│   ├── repository/           # JPA repositories
│   ├── model/                # Entity classes
│   ├── dto/                  # Data Transfer Objects
│   └── config/               # Configuration classes (CORS, WebClient, etc.)
│
├── toeic-frontend/           # ReactJS frontend (Vite + Tailwind)
│   ├── components/           # UI components (e.g., Layout, Sidebar)
│   ├── pages/                # Route-based views (NewWords, ReviewPage, etc.)
│   ├── services/             # API service layer (Axios abstraction)
│   └── App.jsx               # Main React app entry
│
└── README.md                 # Project documentation
```
---
## 🏁 Getting Started

Make sure you have:
- **Java 17+**, **Maven**, **Node.js 18+**, and **MySQL** installed and running.

### Run the whole app locally:
# Backend
```bash
cd toeic
./mvnw spring-boot:run
```

# Frontend
```bash
cd toeic-frontend
npm install
npm run dev

