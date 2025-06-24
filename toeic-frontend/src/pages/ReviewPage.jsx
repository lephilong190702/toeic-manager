import { useEffect, useState } from "react";
import FlashcardSlider from "./FlashcardSlider";
import api from "../services/api";
import { BookOpenCheckIcon } from "lucide-react";

function ReviewPage() {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.getTopics();
        setTopics(res.data);
      } catch (err) {
        console.error("❌ Failed to load topics:", err);
      }
    };
    fetchTopics();
  }, []);

  const handleTopicClick = async (topicId) => {
    setSelectedTopicId(topicId);
    setIsLoading(true);
    try {
      const res = await api.getLearnedWordsByTopic(topicId);
      setWords(res.data);
    } catch (err) {
      console.error("❌ Failed to load words:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-sky-50 px-4 py-6 flex flex-col">
      <div className="max-w-screen-xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BookOpenCheckIcon className="text-sky-600" size={30} />
          <div>
            <h1 className="text-2xl font-bold text-sky-800">Review Flashcards</h1>
            <p className="text-gray-600 text-sm mt-1">
              Select a topic to revise your learned TOEIC vocabulary
            </p>
          </div>
        </div>

        {/* Topic buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm border transition-all text-left ${
                selectedTopicId === topic.id
                  ? "bg-sky-600 text-white"
                  : "bg-white text-sky-800 border-sky-300 hover:bg-sky-100"
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcard result section */}
      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <div className="text-center text-gray-500 text-lg">Loading flashcards...</div>
        ) : words.length > 0 ? (
          <FlashcardSlider wordList={words} />
        ) : selectedTopicId ? (
          <div className="text-center text-gray-400 text-base">
            No learned words in this topic.
          </div>
        ) : (
          <div className="text-center text-gray-400 text-base">
            Please select a topic to begin.
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewPage;
