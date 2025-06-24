import { useEffect, useState } from "react";
import {
  BookOpenIcon,
  LightbulbIcon,
  QuoteIcon,
  Volume2Icon,
} from "lucide-react";
import "./PostcardView.css";

function PostcardView({ word, resetFlipSignal, onMarkLearned }) {
  const [flipped, setFlipped] = useState(false);
  const [learnedLocal, setLearnedLocal] = useState(word.learned || false);

  useEffect(() => {
    setFlipped(false); // reset khi chuyển flashcard
  }, [resetFlipSignal]);

  useEffect(() => {
    setLearnedLocal(word.learned || false); // đồng bộ trạng thái learned
  }, [word]);

  const playAudio = (e) => {
    e.stopPropagation();
    if (word.audioUrl) {
      const audio = new Audio(word.audioUrl);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  const handleMarkLearned = (e) => {
    e.stopPropagation();
    const newLearned = !learnedLocal;
    onMarkLearned(word.id, newLearned);
    setLearnedLocal(newLearned);
  };

  return (
    <div className="postcard-container">
      <div className="flip-wrapper">
        <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
          {/* FRONT */}
          <div className="front-card">
            <div className="flex flex-col items-center space-y-6 z-10">
              <div>
                <h2 className="text-5xl font-extrabold text-blue-800">
                  {word.vocabulary}
                </h2>
                <p className="text-gray-500 text-lg italic mt-1">
                  ({word.partOfSpeech})
                </p>
              </div>

              {(word.ipa || word.audioUrl) && (
                <div
                  className="flex justify-center items-center gap-3 bg-blue-50 rounded-full px-4 py-2 w-fit border border-blue-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {word.ipa && (
                    <span className="text-blue-800 font-mono text-xl">
                      {word.ipa}
                    </span>
                  )}
                  {word.audioUrl && (
                    <button
                      onClick={playAudio}
                      className="audio-btn"
                      title="Play pronunciation"
                      type="button"
                    >
                      <Volume2Icon size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div
              className="absolute inset-0 z-0"
              onClick={() => setFlipped(true)}
              style={{ cursor: "pointer" }}
            />
            <div className="note-text">(Click to flip)</div>
          </div>

          {/* BACK */}
          <div
            className="back-card relative"
            onClick={() => setFlipped(false)}
          >
            {/* Button Mark - Top Right */}
            <button
              onClick={handleMarkLearned}
              className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow ${
                learnedLocal
                  ? "bg-green-100 text-green-800 border border-green-400"
                  : "bg-gray-200 hover:bg-green-200 text-gray-800"
              }`}
            >
              {learnedLocal ? "✓ Learned" : "Mark as Learned"}
            </button>

            {/* Nội dung chính */}
            <div className="flex flex-col items-start justify-center space-y-6 w-full max-w-xl mx-auto px-4 py-8">
              <div className="flex items-start gap-2">
                <BookOpenIcon className="text-blue-500 mt-1" size={20} />
                <p className="text-lg text-gray-800 leading-relaxed">
                  <strong className="text-blue-700">Meaning:</strong>{" "}
                  {word.meaning}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <QuoteIcon className="text-green-600 mt-1" size={20} />
                <p className="italic text-gray-700 leading-relaxed">
                  <strong className="text-green-700">Example:</strong> “
                  {word.example}”
                </p>
              </div>
              <div className="flex items-start gap-2">
                <LightbulbIcon className="text-yellow-500 mt-1" size={20} />
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-yellow-700">Tip:</strong> {word.tip}
                </p>
              </div>
              <div className="flex justify-start flex-wrap gap-2 pt-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
                  Topic: {word.topic}
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1 rounded-full">
                  Level: {word.level}
                </span>
              </div>
            </div>

            <div className="note-text text-center">(Click to flip)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostcardView;
