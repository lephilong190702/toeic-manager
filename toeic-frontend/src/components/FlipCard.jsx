import { useState } from "react";
import {
  BookOpenIcon,
  LightbulbIcon,
  QuoteIcon,
  Volume2Icon,
} from "lucide-react";

function FlipCard({ word }) {
  const [flipped, setFlipped] = useState(false);

  const playAudio = () => {
    if (word.audioUrl) new Audio(word.audioUrl).play();
  };

  return (
    <div className="w-full max-w-xl min-h-[600px] cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div className="relative w-full h-full transition-transform duration-700" style={{ perspective: "1500px" }}>
        <div
          className={`absolute w-full h-full rounded-2xl bg-white border border-blue-200 shadow-2xl p-10 space-y-6 text-center transform transition-transform duration-700 ease-in-out ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front side */}
          <div
            className={`absolute inset-0 w-full h-full p-10 space-y-6 text-center rounded-2xl bg-white ${
              flipped ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <h2 className="text-5xl font-extrabold text-blue-800">{word.vocabulary}</h2>
            <p className="text-gray-500 text-lg italic mt-1">({word.partOfSpeech})</p>

            {(word.ipa || word.audioUrl) && (
              <div className="mx-auto flex justify-center items-center gap-3 bg-blue-50 rounded-full px-4 py-2 w-fit border border-blue-200">
                {word.ipa && (
                  <span className="text-blue-800 font-mono text-xl">{word.ipa}</span>
                )}
                {word.audioUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition"
                    title="Play pronunciation"
                  >
                    <Volume2Icon size={18} />
                  </button>
                )}
              </div>
            )}

            <p className="text-sm text-gray-400 mt-6">(Click to flip)</p>
          </div>

          {/* Back side */}
          <div
            className={`absolute inset-0 w-full h-full p-10 space-y-4 text-left rounded-2xl bg-white transform rotate-y-180 ${
              flipped ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <div className="flex items-start gap-2">
              <BookOpenIcon className="text-blue-500 mt-1" size={20} />
              <p className="text-lg text-gray-800 leading-relaxed">
                <strong className="text-blue-700">Meaning:</strong> {word.meaning}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <QuoteIcon className="text-green-600 mt-1" size={20} />
              <p className="italic text-gray-700 leading-relaxed">
                <strong className="text-green-700">Example:</strong> “{word.example}”
              </p>
            </div>

            <div className="flex items-start gap-2">
              <LightbulbIcon className="text-yellow-500 mt-1" size={20} />
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-yellow-700">Tip:</strong> {word.tip}
              </p>
            </div>

            <div className="flex justify-start flex-wrap gap-2 pt-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
                Topic: {word.topic}
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1 rounded-full">
                Level: {word.level}
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-6">(Click to flip back)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
