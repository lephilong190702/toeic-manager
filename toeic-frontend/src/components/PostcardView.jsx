import { BookOpenIcon, LightbulbIcon, QuoteIcon, Volume2Icon } from "lucide-react";

function PostcardView({ word }) {
  const playAudio = () => {
    if (word.audioUrl) {
      new Audio(word.audioUrl).play();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-white px-4 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full space-y-6 border border-blue-200 text-center">

        {/* Từ vựng chính + loại từ */}
        <div>
          <h2 className="text-5xl font-extrabold text-blue-800">{word.vocabulary}</h2>
          <p className="text-gray-500 text-lg italic mt-1">({word.partOfSpeech})</p>
        </div>

        {/* IPA + Audio Button */}
        {(word.ipa || word.audioUrl) && (
          <div className="mx-auto flex justify-center items-center gap-3 bg-blue-50 rounded-full px-4 py-2 w-fit border border-blue-200">
            {word.ipa && (
              <span className="text-blue-800 font-mono text-xl">{word.ipa}</span>
            )}
            {word.audioUrl && (
              <button
                onClick={playAudio}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition"
                title="Play pronunciation"
              >
                <Volume2Icon size={18} />
              </button>
            )}
          </div>
        )}

        {/* Meaning */}
        <div className="flex items-start gap-2 text-left">
          <BookOpenIcon className="text-blue-500 mt-1" size={20} />
          <p className="text-lg text-gray-800 leading-relaxed">
            <strong className="text-blue-700">Meaning:</strong> {word.meaning}
          </p>
        </div>

        {/* Example */}
        <div className="flex items-start gap-2 text-left">
          <QuoteIcon className="text-green-600 mt-1" size={20} />
          <p className="italic text-gray-700 leading-relaxed">
            <strong className="text-green-700">Example:</strong> “{word.example}”
          </p>
        </div>

        {/* Tip */}
        <div className="flex items-start gap-2 text-left">
          <LightbulbIcon className="text-yellow-500 mt-1" size={20} />
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-yellow-700">Tip:</strong> {word.tip}
          </p>
        </div>

        {/* Topic & Level */}
        <div className="flex justify-center flex-wrap gap-2 pt-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
            Topic: {word.topic}
          </span>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1 rounded-full">
            Level: {word.level}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostcardView;
