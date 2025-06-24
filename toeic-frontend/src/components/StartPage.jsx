import { useState } from "react";
import FlashcardSlider from "./FlashcardSlider";
import { SparklesIcon } from "lucide-react";
import api from "../services/api";
import levenshtein from "js-levenshtein";
import englishWords from "./englishWords.json";
import styles from "./StartPage.module.css";

function StartPage() {
  const [inputText, setInputText] = useState("");
  const [wordList, setWordList] = useState([]);
  const [generatedList, setGeneratedList] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [suggestions, setSuggestions] = useState({});

  const suggestWords = (input) => {
    const matches = englishWords
      .map((word) => ({
        word,
        distance: levenshtein(input, word),
      }))
      .filter((entry) => entry.distance <= 2)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    return matches.map((m) => m.word);
  };

  const handlePreview = () => {
    const words = inputText
      .split(/[\s,]+/)
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 0);

    const suggestionMap = {};
    words.forEach((word) => {
      const suggestedList = suggestWords(word);
      if (suggestedList.length && !suggestedList.includes(word)) {
        suggestionMap[word] = suggestedList;
      }
    });

    setSuggestions(suggestionMap);
    setWordList(words);
    setGeneratedList([]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedList([]);
    setProgress({ current: 0, total: wordList.length });

    try {
      const res = await api.generateBatch(wordList);
      const validWords = [];

      for (let i = 0; i < res.data.length; i++) {
        const wordData = res.data[i];
        if (!wordData.error) {
          validWords.push(wordData);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        setGeneratedList([...validWords]);
        setProgress({ current: i + 1, total: wordList.length });
      }
    } catch (err) {
      console.error("Batch failed:", err);
    }

    setIsGenerating(false);
  };

  if (generatedList.length > 0) {
    return <FlashcardSlider wordList={generatedList} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className="flex flex-col items-center space-y-4">
          <SparklesIcon className="text-blue-500" size={36} />
          <h1 className={styles.title}>TOEIC Vocabulary</h1>
          <p className={styles.subtitle}>
            Enter multiple words to generate flashcards
          </p>
        </div>

        <textarea
          rows={5}
          placeholder="e.g. efficient, revenue, negotiate"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={styles.textarea}
        />

        <button
          onClick={handlePreview}
          className={`${styles.button} ${styles.previewButton}`}
        >
          Preview Words
        </button>

        {wordList.length > 0 && (
          <>
            <div className="mt-4 text-left text-gray-700">
              <p className="font-semibold mb-2">Words to generate:</p>
              <ul className="flex flex-col gap-2">
                {wordList.map((word, index) => {
                  const suggestedList = suggestions[word];
                  const isSuggested = suggestedList && suggestedList.length > 0;

                  return (
                    <li key={index}>
                      <span
                        className={`${styles.wordTag} ${
                          isSuggested ? styles.suggested : styles.normal
                        }`}
                      >
                        {word}
                      </span>

                      {isSuggested && (
                        <div className={styles.suggestionText}>
                          ⚠ Did you mean:&nbsp;
                          {suggestedList.map((s, i) => (
                            <span
                              key={i}
                              className={styles.suggestionWord}
                              onClick={() => {
                                const newInput = inputText.replace(
                                  new RegExp(`\\b${word}\\b`, "gi"),
                                  s
                                );
                                setInputText(newInput);
                                handlePreview();
                              }}
                            >
                              {s}
                            </span>
                          ))}
                          ?
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`${styles.button} ${
                isGenerating ? styles.disabledButton : styles.generateButton
              }`}
            >
              {isGenerating
                ? `Generating ${progress.current}/${progress.total}...`
                : "Generate Flashcards"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default StartPage;
