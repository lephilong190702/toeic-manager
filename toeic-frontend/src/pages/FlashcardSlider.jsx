import { useState, useEffect } from "react";
import PostcardView from "./PostcardView";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { regeneratePostcard, toggleLearned } from "../services/api";

function FlashcardSlider({ wordList = [], onRefreshStats, onRefreshHistory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipSignal, setFlipSignal] = useState(0);
  const [wordListState, setWordListState] = useState([]);

  useEffect(() => {
    setWordListState(wordList);
  }, [wordList]);

  if (!Array.isArray(wordListState) || wordListState.length === 0) {
    return <p className="text-center text-gray-500 py-8">No flashcards available.</p>;
  }

  const currentWord = wordListState[currentIndex] || wordListState[0];

  const updateWordInList = (id, updatedFields) => {
    setWordListState((prevList) =>
      prevList.map((word) =>
        word.id === id ? { ...word, ...updatedFields } : word
      )
    );
  };

  const handleMarkLearned = async (id) => {
    try {
      await toggleLearned(id);
      setWordListState((prev) => {
        const updated = prev.filter((w) => w.id !== id);
        const nextIndex = Math.min(currentIndex, updated.length - 1);
        setCurrentIndex(nextIndex);
        return updated;
      });
      onRefreshStats?.();
      onRefreshHistory?.();
    } catch (err) {
      console.error("Failed to toggle learned status:", err);
    }
  };

  const handleRegenerate = async (id) => {
    try {
      const res = await regeneratePostcard(id);
      updateWordInList(id, res.data);
      triggerFlip();
    } catch (err) {
      console.error("Failed to regenerate word:", err);
    }
  };

  const triggerFlip = () => {
    setFlipSignal((prev) => prev + 1);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : wordListState.length - 1;
      triggerFlip();
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % wordListState.length;
      triggerFlip();
      return newIndex;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-xl overflow-y-auto min-h-[680px] flex justify-center items-center">
      <div className="relative w-full max-w-xl">
        {/* Previous button */}
        <button
          onClick={goToPrevious}
          className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white border shadow p-3 rounded-full hover:bg-gray-100 transition z-10"
          title="Previous"
        >
          <ChevronLeft size={28} className="text-gray-700" />
        </button>

        {/* Flashcard */}
        <PostcardView
          word={currentWord}
          resetFlipSignal={flipSignal}
          onMarkLearned={handleMarkLearned}
          onRegenerate={handleRegenerate}
        />

        {/* Next button */}
        <button
          onClick={goToNext}
          className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white border shadow p-3 rounded-full hover:bg-gray-100 transition z-10"
          title="Next"
        >
          <ChevronRight size={28} className="text-gray-700" />
        </button>

        {/* Slide indicator */}
        <div className="absolute -bottom-10 w-full text-center text-sm text-gray-500">
          Flashcard {currentIndex + 1} / {wordListState.length}
        </div>
      </div>
    </div>
  );
}

export default FlashcardSlider;
