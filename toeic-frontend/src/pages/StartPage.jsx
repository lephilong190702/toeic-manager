import { useState } from "react";
import FlashcardSlider from "./FlashcardSlider";
import { SparklesIcon } from "lucide-react";
import api from "../services/api";
import levenshtein from "js-levenshtein";
import englishWords from "./englishWords.json";
import { useUser } from "../context/UserContext";

function StartPage() {
  const { user } = useUser();
  const [inputText, setInputText] = useState("");
  const [wordList, setWordList] = useState([]);
  const [generatedList, setGeneratedList] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [suggestions, setSuggestions] = useState({});
  const [error, setError] = useState("");

  const suggestWords = (input) => {
    return englishWords
      .map((word) => ({
        word,
        distance: levenshtein(input, word),
      }))
      .filter((entry) => entry.distance <= 2)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map((entry) => entry.word);
  };

  const handlePreview = () => {
    if (!inputText.trim()) {
      setError("❌ Please enter some words before preview.");
      return;
    }

    const rawWords = inputText
      .split(/[\s,]+/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);

    if (rawWords.length === 0) {
      setError("❌ Please enter valid words.");
      return;
    }

    const suggestionMap = {};
    rawWords.forEach((word) => {
      const suggested = suggestWords(word);
      if (suggested.length && !suggested.includes(word)) {
        suggestionMap[word] = suggested;
      }
    });

    setSuggestions(suggestionMap);
    setWordList(rawWords);
    setGeneratedList([]);
    setError("");
  };

  const handleGenerate = async () => {
    setError("");

    if (!user) {
      setError("❌ Please log in to use this feature.");
      return;
    }

    if (!inputText.trim()) {
      setError("❌ Input is empty. Please enter words before generating.");
      return;
    }

    if (wordList.length === 0) {
      setError("❌ Please click 'Preview Words' before generating.");
      return;
    }

    setIsGenerating(true);
    setGeneratedList([]);
    setProgress({ current: 0, total: wordList.length });

    try {
      const res = await api.generateBatch(wordList);
      const validWords = [];

      for (let i = 0; i < res.data.length; i++) {
        const wordData = res.data[i];

        // Giả lập delay để hiển thị tiến trình rõ hơn
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!wordData.error) {
          validWords.push(wordData);
        }

        setProgress({ current: i + 1, total: wordList.length });
      }

      if (validWords.length === 0) {
        setError("❌ No flashcards were generated. All words may have failed.");
      }

      setGeneratedList(validWords);
    } catch (err) {
      console.error("Batch generate failed:", err);
      setError("❌ An unexpected error occurred. Please try again.");
    }

    setIsGenerating(false);
  };

  const handleBack = () => {
    setInputText("");
    setWordList([]);
    setSuggestions({});
    setGeneratedList([]);
    setProgress({ current: 0, total: 0 });
    setError("");
  };

  if (generatedList.length > 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center p-4">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-full shadow hover:bg-blue-50"
        >
          ← Back to Input
        </button>
        <FlashcardSlider wordList={generatedList} mode="learning" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-blue-200 p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <SparklesIcon className="text-blue-500" size={36} />
          <h1 className="text-2xl font-bold text-gray-800">TOEIC Vocabulary</h1>
          <p className="text-sm text-gray-500">
            Enter multiple words to generate flashcards
          </p>
        </div>

        <textarea
          rows={5}
          placeholder="e.g. efficient, revenue, negotiate"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="mt-6 w-full p-4 border border-gray-300 rounded-2xl text-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handlePreview}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 font-semibold hover:from-blue-200 hover:to-blue-400 transition-all"
        >
          Preview Words
        </button>

        {error && (
          <div className="mt-4 text-red-600 font-medium text-sm text-left">
            {error}
          </div>
        )}

        {wordList.length > 0 && (
          <>
            <div className="mt-6 text-left text-gray-700">
              <p className="font-semibold mb-2">Words to generate:</p>
              <ul className="flex flex-col gap-2">
                {wordList.map((word, index) => {
                  const suggestedList = suggestions[word];
                  const hasSuggestion = suggestedList && suggestedList.length > 0;
                  return (
                    <li key={index}>
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium border transition ${hasSuggestion
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "bg-blue-50 text-blue-800 border-blue-300"
                          }`}
                      >
                        {word}
                      </span>
                      {hasSuggestion && (
                        <div className="text-sm text-yellow-700 mt-1 ml-2">
                          ⚠ Did you mean:&nbsp;
                          {suggestedList.map((s, i) => (
                            <span
                              key={i}
                              className="font-semibold underline cursor-pointer mr-2 hover:text-yellow-900"
                              onClick={() => {
                                const newInput = inputText.replace(new RegExp(`\\b${word}\\b`, "gi"), s);
                                setInputText(newInput);
                                handlePreview();
                              }}
                            >
                              {s}
                            </span>
                          ))}
                          ?
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all ${isGenerating
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                }`}
            >
              {isGenerating
                ? `Generating ${progress.current}/${progress.total}...`
                : "Generate Flashcards"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default StartPage;
