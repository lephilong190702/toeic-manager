import { useState } from "react";
import PostcardView from "./PostcardView";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toggleLearned } from "../services/api"; // dùng đúng API bạn đã định nghĩa

function FlashcardSlider({ wordList }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipSignal, setFlipSignal] = useState(0);
  const [wordListState, setWordListState] = useState(wordList);

  const handleMarkLearned = async (id) => {
    try {
      await toggleLearned(id); // chỉ cần gọi toggle
      setWordListState((prevList) =>
        prevList.map((word) =>
          word.id === id ? { ...word, learned: !word.learned } : word
        )
      );
    } catch (err) {
      console.error("Toggle learned failed:", err);
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col justify-center items-center px-4 py-10">
      <PostcardView
        word={wordListState[currentIndex]}
        resetFlipSignal={flipSignal}
        onMarkLearned={handleMarkLearned}
      />

      <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-6">
        <button
          onClick={handlePrev}
          className="bg-white border shadow p-3 rounded-full hover:bg-gray-100 transition"
          title="Previous"
        >
          <ChevronLeft size={28} className="text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          className="bg-white border shadow p-3 rounded-full hover:bg-gray-100 transition"
          title="Next"
        >
          <ChevronRight size={28} className="text-gray-700" />
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 mt-6">
        Flashcard {currentIndex + 1} / {wordListState.length}
      </div>
    </div>
  );
}

export default FlashcardSlider;
