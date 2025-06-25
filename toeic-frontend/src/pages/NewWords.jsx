import { useEffect, useState } from "react";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import FlashcardSlider from "./FlashcardSlider";
import { getUnlearned } from "../services/api";

function NewWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUnlearned()
      .then((res) => setWords(res.data))
      .catch((err) => {
        console.error("Failed to fetch unlearned words", err);
        setWords([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-sky-50 px-4 py-6 flex flex-col">
      <div className="max-w-screen-xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <SparklesIcon className="text-blue-500" size={30} />
          <div>
            <h1 className="text-2xl font-bold text-blue-700">New Words to Learn</h1>
            <p className="text-gray-600 text-sm mt-1">
              Practice newly generated flashcards not yet marked as learned.
            </p>
          </div>
        </div>
      </div>

      {/* Main flashcard content */}
      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-gray-500 text-lg">
            <Loader2Icon className="animate-spin w-6 h-6 text-blue-500" />
            <span>Loading new words...</span>
          </div>
        ) : words.length > 0 ? (
          <FlashcardSlider wordList={words} mode="new"  />
        ) : (
          <div className="text-center text-gray-400 text-base">
            ✅ You’ve learned all available words! Nothing new to study.
          </div>
        )}
      </div>
    </div>
  );
}

export default NewWords;
