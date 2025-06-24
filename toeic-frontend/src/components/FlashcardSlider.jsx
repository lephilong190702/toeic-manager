import { useEffect, useState } from "react";
import PostcardView from "./PostcardView";
import { ChevronLeft, ChevronRight } from "lucide-react";

function FlashcardSlider({ wordList }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipSignal, setFlipSignal] = useState(0); // Dùng để reset lật

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : wordList.length - 1;
      setFlipSignal((f) => f + 1); // reset mặt trước
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % wordList.length;
      setFlipSignal((f) => f + 1); // reset mặt trước
      return newIndex;
    });
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col justify-center items-center px-4 py-10">
      {/* Flashcard */}
      <PostcardView word={wordList[currentIndex]} resetFlipSignal={flipSignal} />

      {/* Navigation Buttons */}
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

      {/* Progress */}
      <div className="text-center text-sm text-gray-500 mt-6">
        Flashcard {currentIndex + 1} / {wordList.length}
      </div>
    </div>
  );
}

export default FlashcardSlider;
