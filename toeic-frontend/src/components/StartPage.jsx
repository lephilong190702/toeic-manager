import { useState } from "react";
import api from "../services/api";
import PostcardView from "./PostcardView";
import { SparklesIcon } from "lucide-react";

function StartPage() {
  const [vocabulary, setVocabulary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordData, setWordData] = useState(null);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!vocabulary.trim()) {
      setError("Please enter a word.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api.createWord({ vocabulary });
      setWordData(response.data);
    } catch (err) {
      console.error("Error creating word:", err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (wordData) {
    return <PostcardView word={wordData} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center border border-blue-200">
        <div className="flex flex-col items-center space-y-4">
          <SparklesIcon className="text-blue-500" size={36} />
          <h1 className="text-3xl font-bold text-gray-800">
            TOEIC Vocabulary
          </h1>
          <p className="text-gray-500 text-sm">Type a word to generate your postcard</p>
        </div>

        <input
          type="text"
          placeholder="e.g. resilient"
          value={vocabulary}
          onChange={(e) => setVocabulary(e.target.value)}
          className="mt-6 w-full px-4 py-3 border border-gray-300 rounded-xl text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <button
          onClick={handleStart}
          disabled={isLoading}
          className={`mt-4 w-full py-3 rounded-xl font-semibold text-lg transition ${
            isLoading
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Generating..." : "START"}
        </button>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default StartPage;
