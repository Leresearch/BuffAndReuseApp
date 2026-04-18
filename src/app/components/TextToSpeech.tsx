import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  autoRead?: boolean;
}

export function TextToSpeech({ text, autoRead = false }: TextToSpeechProps) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (autoRead && isSupported && text) {
      handleSpeak();
    }
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (isReading && !isPaused) {
      // Stop reading
      window.speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
      return;
    }

    if (isPaused) {
      // Resume reading
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start new speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSpeak}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
          isReading
            ? 'bg-gray-700 text-white hover:bg-gray-800 border-2 border-gray-900'
            : 'bg-[#e6f0f9] text-[#0053A0] hover:bg-[#99c2e6] border-2 border-[#99c2e6]'
        }`}
        aria-label={isReading ? 'Stop reading' : 'Read text aloud'}
      >
        {isReading ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Read Aloud</span>
          </>
        )}
      </button>

      {isReading && (
        <button
          onClick={handlePause}
          className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm bg-[#f5f0ed] text-[#8B4513] hover:bg-[#D4A574] border-2 border-[#D4A574] transition-all"
          aria-label={isPaused ? 'Resume reading' : 'Pause reading'}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

// Line reader component that reads one line at a time
export function LineReader({ lines }: { lines: string[] }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakLine = (lineIndex: number) => {
    if (!isSupported || lineIndex >= lines.length) {
      setIsReading(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(lines[lineIndex]);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      const nextLine = lineIndex + 1;
      if (nextLine < lines.length) {
        setCurrentLine(nextLine);
        speakLine(nextLine);
      } else {
        setIsReading(false);
        setCurrentLine(0);
      }
    };

    utterance.onerror = () => {
      setIsReading(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStart = () => {
    if (!isSupported) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setCurrentLine(0);
    } else {
      setIsReading(true);
      setCurrentLine(0);
      speakLine(0);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleStart}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isReading
            ? 'bg-gray-700 text-white hover:bg-gray-800 border-2 border-gray-900'
            : 'bg-[#0053A0] text-white hover:bg-[#003d7a]'
        }`}
        aria-label={isReading ? 'Stop line reader' : 'Start line reader'}
      >
        {isReading ? (
          <>
            <VolumeX className="w-5 h-5" />
            <span>Stop Line Reader</span>
          </>
        ) : (
          <>
            <Volume2 className="w-5 h-5" />
            <span>Start Line Reader</span>
          </>
        )}
      </button>

      {isReading && (
        <div className="bg-[#e6f0f9] border-2 border-[#0053A0] rounded-lg p-4">
          <p className="text-sm text-[#004080] mb-2 font-semibold">Currently reading:</p>
          <div className="space-y-1">
            {lines.map((line, index) => (
              <p
                key={index}
                className={`text-sm transition-all ${
                  index === currentLine
                    ? 'text-[#0053A0] font-bold bg-[#99c2e6] px-2 py-1 rounded'
                    : index < currentLine
                    ? 'text-gray-400 line-through'
                    : 'text-gray-600'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
