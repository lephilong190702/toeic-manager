import { useEffect, useState } from "react";
import {
  BookOpenIcon,
  LightbulbIcon,
  QuoteIcon,
  Volume2Icon,
  SparklesIcon,
} from "lucide-react";

function PostcardView({ word, resetFlipSignal, onMarkLearned, onRegenerate, shouldReset, mode = "default" }) {
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
      onClick={toggleFlip}
      role="button"
      tabIndex={0}
      onKeyPress={toggleFlip}
      aria-pressed={flipped}
      className="w-full p-4 flex justify-center items-center bg-gradient-to-br from-blue-100 to-white text-[clamp(14px,2vw,18px)]"
    >
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[440px] h-[500px] sm:h-[500px] [perspective:1500px]">
        <div className={`relative w-full h-full transition-transform duration-700 ease-in-out ${flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"}`} style={{ transformStyle: "preserve-3d" }}>
          {/* FRONT */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-blue-200 shadow-lg flex flex-col justify-center items-center px-4 py-5 sm:px-6 sm:py-6 overflow-hidden [backface-visibility:hidden] [transform:rotateY(0deg)]"
          >
            <div className="flex flex-col items-center space-y-6 z-10 w-full overflow-hidden">
              <div className="text-center w-full overflow-hidden">
                <h2 className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-extrabold text-blue-800 break-words w-full leading-snug">{word.vocabulary}</h2>
                <p className="text-gray-700 italic mt-1">({word.partOfSpeech})</p>
              </div>

              {(word.ipa || word.audioUrl) && (
                <div
                  className="flex justify-center items-center gap-3 bg-blue-50 rounded-full px-5 py-2 w-fit border border-blue-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {word.ipa && (
                    <span className="text-blue-800 font-mono select-text">{word.ipa}</span>
                  )}
                  {word.audioUrl && (
                    <button
                      onClick={playAudio}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform hover:scale-110"
                      title="Play pronunciation"
                      type="button"
                    >
                      <Volume2Icon size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 text-center absolute bottom-3 left-0 w-full select-none">(Click to see meaning)</div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-blue-200 shadow-lg text-left flex flex-col justify-center items-center px-4 py-5 sm:px-6 sm:py-6 overflow-y-auto [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            {mode !== "review" ? (
              <button
                onClick={handleMarkLearned}
                className={`absolute top-3 right-3 px-4 py-2 rounded-full text-sm font-medium shadow transition duration-200 z-10
                  ${learnedLocal ? "bg-green-100 text-green-800 border border-green-400 hover:bg-green-200" : "bg-gray-200 hover:bg-green-100 text-gray-800"}`}
                aria-pressed={learnedLocal}
                type="button"
              >
                {learnedLocal ? "✓ Learned" : "Mark as Learned"}
              </button>
            ) : (
              <div
                className="absolute top-3 right-3 px-4 py-2 bg-green-100 text-green-800 border border-green-400 rounded-full text-sm font-medium shadow select-none cursor-default z-10"
                onClick={(e) => e.stopPropagation()}
              >
                ✓ Learned
              </div>
            )}

            <div className="flex flex-col items-start justify-center space-y-4 w-full">
              <div className="flex items-start gap-2">
                <BookOpenIcon className="text-blue-600 mt-1 shrink-0" size={20} />
                <p className="text-gray-900 leading-relaxed break-words">
                  <strong className="text-blue-700">Meaning:</strong> {word.meaning}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <QuoteIcon className="text-green-600 mt-1 shrink-0" size={20} />
                <p className="italic text-gray-800 leading-relaxed break-words">
                  <strong className="text-green-700">Example:</strong> “{word.example}”
                </p>
              </div>

              <div className="flex items-start gap-2">
                <LightbulbIcon className="text-yellow-500 mt-1 shrink-0" size={20} />
                <p className="text-gray-800 leading-relaxed break-words">
                  <strong className="text-yellow-700">Tip:</strong> {word.tip}
                </p>
              </div>

              <div className="flex justify-start flex-wrap gap-3 pt-2">
                <span className="bg-blue-100 text-blue-900 text-sm font-medium px-4 py-1 rounded-full select-text">
                  Topic: {word.topic}
                </span>
                <span className="bg-green-100 text-green-900 text-sm font-medium px-4 py-1 rounded-full select-text">
                  Level: {word.level}
                </span>
              </div>

              <div className="pt-4 w-full flex justify-center">
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="px-5 py-2 bg-yellow-200 text-yellow-900 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-full text-sm font-semibold shadow border border-yellow-400 flex items-center gap-2 transition duration-300 ease-in-out"
                  type="button"
                  aria-busy={isLoading}
                >
                  <SparklesIcon size={18} className={isLoading ? "animate-spin" : ""} />
                  {isLoading ? "Regenerating..." : "Generate Again"}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center absolute bottom-3 left-0 w-full select-none">(Click to go back)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostcardView;
