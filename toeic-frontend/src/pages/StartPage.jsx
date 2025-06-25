import { useState } from "react";
import FlashcardSlider from "./FlashcardSlider";
import { SparklesIcon } from "lucide-react";
import api from "../services/api";
import levenshtein from "js-levenshtein";
import englishWords from "./englishWords.json";

function StartPage() {
  const [inputText, setInputText] = useState("");
  const [wordList, setWordList] = useState([]);
  const [generatedList, setGeneratedList] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [suggestions, setSuggestions] = useState({});

  // Gợi ý từ gần đúng dựa trên khoảng cách Levenshtein
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

  // Phân tích danh sách từ và đưa ra gợi ý
  const handlePreview = () => {
    const rawWords = inputText
      .split(/[\s,]+/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);

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
  };

  // Gửi danh sách từ để AI sinh postcard
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedList([]);
    setProgress({ current: 0, total: wordList.length });

    try {
      const res = await api.generateBatch(wordList);
      const validWords = [];

      for (let i = 0; i < res.data.length; i++) {
        const wordData = res.data[i];
        if (!wordData.error) {
          validWords.push(wordData);
        }

        setProgress({ current: i + 1, total: wordList.length });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setGeneratedList(validWords);
    } catch (err) {
      console.error("Batch generate failed:", err);
    }

    setIsGenerating(false);
  };

  // Nếu đã có danh sách đã generate, hiển thị FlashcardSlider
  if (generatedList.length > 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
        <FlashcardSlider wordList={generatedList} mode="learning" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-blue-200 p-8 text-center">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4">
          <SparklesIcon className="text-blue-500" size={36} />
          <h1 className="text-2xl font-bold text-gray-800">TOEIC Vocabulary</h1>
          <p className="text-sm text-gray-500">
            Enter multiple words to generate flashcards
          </p>
        </div>

        {/* Input */}
        <textarea
          rows={5}
          placeholder="e.g. efficient, revenue, negotiate"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="mt-6 w-full p-3 border border-gray-300 rounded-lg text-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Preview Button */}
        <button
          onClick={handlePreview}
          className="mt-4 w-full py-3 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition"
        >
          Preview Words
        </button>

        {/* Danh sách từ cần generate */}
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
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
                          hasSuggestion
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-blue-50 text-blue-800 border-blue-300"
                        }`}
                      >
                        {word}
                      </span>

                      {/* Hiển thị gợi ý nếu có */}
                      {hasSuggestion && (
                        <div className="text-sm text-yellow-700 mt-1 ml-2">
                          ⚠ Did you mean:&nbsp;
                          {suggestedList.map((s, i) => (
                            <span
                              key={i}
                              className="font-semibold underline cursor-pointer mr-2 hover:text-yellow-900"
                              onClick={() => {
                                const newInput = inputText.replace(
                                  new RegExp(`\\b${word}\\b`, "gi"),
                                  s
                                );
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

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`mt-4 w-full py-3 rounded-lg font-semibold text-white transition ${
                isGenerating
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
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
