import { useEffect, useState } from "react";
import {
  BookOpenIcon,
  LightbulbIcon,
  QuoteIcon,
  Volume2Icon,
  SparklesIcon,
} from "lucide-react";
import "./PostcardView.css";

function PostcardView({ word, resetFlipSignal, onMarkLearned, onRegenerate, shouldReset }) {
  const [flipped, setFlipped] = useState(false);
  const [learnedLocal, setLearnedLocal] = useState(word.learned || false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setFlipped(false), [resetFlipSignal]);
  useEffect(() => setLearnedLocal(word.learned || false), [word.learned]);
  useEffect(() => setFlipped(false), [shouldReset]);

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
    setLearnedLocal(newLearned);
    onMarkLearned(word.id);
  };

  const handleRegenerate = async (e) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await onRegenerate(word.id);
    } catch (err) {
      console.error("Regenerate failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlip = () => {
    if (!isLoading) setFlipped((f) => !f);
  };

  return (
    <div
      className="postcard-container"
      onClick={toggleFlip}
      role="button"
      tabIndex={0}
      onKeyPress={toggleFlip}
      aria-pressed={flipped}
    >
      <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
        {/* FRONT SIDE */}
        <div className="front-card">
          <div className="flex flex-col items-center space-y-4 z-10">
            <div className="text-center">
              <h2 className="text-5xl font-extrabold text-blue-800">
                {word.vocabulary}
              </h2>
              <p className="text-gray-700 text-lg italic mt-1">
                ({word.partOfSpeech})
              </p>
            </div>

            {(word.ipa || word.audioUrl) && (
              <div
                className="flex justify-center items-center gap-3 bg-blue-50 rounded-full px-4 py-2 w-fit border border-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                {word.ipa && (
                  <span className="text-blue-800 font-mono text-xl select-text">
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
          <div className="note-text">(Click card to flip)</div>
        </div>

        {/* BACK SIDE */}
        <div className="back-card">
          <button
            onClick={handleMarkLearned}
            className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow transition duration-200 ${
              learnedLocal
                ? "bg-green-100 text-green-800 border border-green-400 hover:bg-green-200"
                : "bg-gray-200 hover:bg-green-100 text-gray-800"
            }`}
            aria-pressed={learnedLocal}
            type="button"
          >
            {learnedLocal ? "✓ Learned" : "Mark as Learned"}
          </button>

          <div className="flex flex-col items-start justify-center space-y-4 w-full px-4 py-6">
            {/* Meaning */}
            <div className="flex items-start gap-2">
              <BookOpenIcon className="text-blue-600 mt-1" size={22} />
              <p className="text-lg text-gray-900 leading-relaxed">
                <strong className="text-blue-700">Meaning:</strong> {word.meaning}
              </p>
            </div>

            {/* Example */}
            <div className="flex items-start gap-2">
              <QuoteIcon className="text-green-600 mt-1" size={22} />
              <p className="italic text-gray-800 leading-relaxed">
                <strong className="text-green-700">Example:</strong> “{word.example}”
              </p>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2">
              <LightbulbIcon className="text-yellow-500 mt-1" size={22} />
              <p className="text-gray-800 leading-relaxed">
                <strong className="text-yellow-700">Tip:</strong> {word.tip}
              </p>
            </div>

            {/* Tags */}
            <div className="flex justify-start flex-wrap gap-3 pt-3">
              <span className="bg-blue-100 text-blue-900 text-sm font-medium px-5 py-1 rounded-full select-text">
                Topic: {word.topic}
              </span>
              <span className="bg-green-100 text-green-900 text-sm font-medium px-5 py-1 rounded-full select-text">
                Level: {word.level}
              </span>
            </div>

            {/* Regenerate Button */}
            <div className="pt-6 w-full flex justify-center">
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="px-5 py-2 bg-yellow-200 text-yellow-900 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-full text-sm font-semibold shadow border border-yellow-400 flex items-center gap-3 transition duration-300 ease-in-out"
                type="button"
                aria-busy={isLoading}
              >
                <SparklesIcon size={18} className={isLoading ? "animate-spin" : ""} />
                {isLoading ? "Regenerating..." : "Generate Again"}
              </button>
            </div>
          </div>

          <div className="note-text text-center">(Click card to flip)</div>
        </div>
      </div>
    </div>
  );
}

export default PostcardView;
