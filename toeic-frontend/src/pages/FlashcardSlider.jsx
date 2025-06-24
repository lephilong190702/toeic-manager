import { useState } from "react";
import PostcardView from "./PostcardView";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { regeneratePostcard, toggleLearned } from "../services/api";

function FlashcardSlider({ wordList }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipSignal, setFlipSignal] = useState(0);
  const [wordListState, setWordListState] = useState(wordList);

  const handleMarkLearned = async (id) => {
    try {
      await toggleLearned(id);
      setWordListState((prev) =>
        prev.map((w) => (w.id === id ? { ...w, learned: !w.learned } : w))
      );
    } catch (err) {
      console.error("Toggle learned failed:", err);
    }
  };

  const handleRegenerate = async (id) => {
    try {
      const res = await regeneratePostcard(id);
      setWordListState((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...res.data } : w))
      );
      setFlipSignal((f) => f + 1); // reset mặt trước
    } catch (err) {
      console.error("Regenerate failed:", err);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : wordListState.length - 1;
      setFlipSignal((f) => f + 1);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % wordListState.length;
      setFlipSignal((f) => f + 1);
      return newIndex;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-xl overflow-y-auto min-h-[680px] flex justify-center items-center">
      <div className="relative w-full max-w-xl">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white border shadow p-3 rounded-full hover:bg-gray-100 transition z-10"
          title="Previous"
        >
          <ChevronLeft size={28} className="text-gray-700" />
        </button>

        {/* Flashcard */}
        <PostcardView
          word={wordListState[currentIndex]}
          resetFlipSignal={flipSignal}
          onMarkLearned={handleMarkLearned}
          onRegenerate={handleRegenerate}
        />

        {/* Next button */}
        <button
          onClick={handleNext}
          className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white border shadow p-3 rounded-full hover:bg-gray-100 transition z-10"
          title="Next"
        >
          <ChevronRight size={28} className="text-gray-700" />
        </button>

        {/* Index indicator */}
        <div className="absolute -bottom-10 w-full text-center text-sm text-gray-500">
          Flashcard {currentIndex + 1} / {wordListState.length}
        </div>
      </div>
    </div>
  );
}

export default FlashcardSlider;