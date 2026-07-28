import React, { useState } from 'react';
import { SAMPLE_BALANCE_GAME_QUESTIONS, MBTI_MAP } from '../data/mbtiData';
import { MBTI } from '../types';
import { X, Gamepad2, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface BalanceGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScents: (mbtis: MBTI[]) => void;
}

export const BalanceGameModal: React.FC<BalanceGameModalProps> = ({
  isOpen,
  onClose,
  onSelectScents,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<MBTI[]>([]);

  if (!isOpen) return null;

  const currentQuestion = SAMPLE_BALANCE_GAME_QUESTIONS[currentIdx];

  const handlePick = (mbti: MBTI) => {
    const updated = [...selectedChoices, mbti];
    setSelectedChoices(updated);

    if (currentIdx < SAMPLE_BALANCE_GAME_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished
      onSelectScents(updated);
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setSelectedChoices((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-xl w-full border border-[#e5e0d8] shadow-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-[#e5e0d8] pb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#f27d26]" />
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#5a5a40]">
              MBTI 향수 밸런스 게임 ⚖️
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f2ed] border border-[#e5e0d8] flex items-center justify-center text-[#5a5a40]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#5a5a40] text-white px-3 py-1 rounded-full">
            QUESTION {currentIdx + 1} / {SAMPLE_BALANCE_GAME_QUESTIONS.length}
          </span>
          <h3 className="text-lg font-serif font-bold text-[#2d2a26] mt-2">
            {currentQuestion.title}
          </h3>
        </div>

        {/* Options A & B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Option A */}
          <button
            onClick={() => handlePick(currentQuestion.optionA.mbti)}
            className="p-6 rounded-3xl bg-white border border-[#e5e0d8] hover:border-[#f27d26] hover:bg-[#f5f2ed] transition-all text-center space-y-3 group shadow-sm"
          >
            <span className="text-3xl block">
              {MBTI_MAP.get(currentQuestion.optionA.mbti)?.emoji}
            </span>
            <p className="text-sm font-serif font-bold text-[#2d2a26] group-hover:text-[#f27d26]">
              {currentQuestion.optionA.label}
            </p>
            <p className="text-xs text-[#8c8273]">
              {MBTI_MAP.get(currentQuestion.optionA.mbti)?.description}
            </p>
          </button>

          {/* Option B */}
          <button
            onClick={() => handlePick(currentQuestion.optionB.mbti)}
            className="p-6 rounded-3xl bg-white border border-[#e5e0d8] hover:border-[#f27d26] hover:bg-[#f5f2ed] transition-all text-center space-y-3 group shadow-sm"
          >
            <span className="text-3xl block">
              {MBTI_MAP.get(currentQuestion.optionB.mbti)?.emoji}
            </span>
            <p className="text-sm font-serif font-bold text-[#2d2a26] group-hover:text-[#f27d26]">
              {currentQuestion.optionB.label}
            </p>
            <p className="text-xs text-[#8c8273]">
              {MBTI_MAP.get(currentQuestion.optionB.mbti)?.description}
            </p>
          </button>
        </div>

        <div className="flex justify-between items-center pt-2 text-xs text-[#8c8273]">
          <div className="flex items-center gap-2">
            {currentIdx > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 bg-[#f5f2ed] border border-[#e5e0d8] rounded-xl text-xs font-bold text-[#5a5a40] hover:bg-[#e5e0d8] transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 이전 문항
              </button>
            )}
            <span>선택한 MBTI: {selectedChoices.join(', ') || '없음'}</span>
          </div>

          <button onClick={onClose} className="hover:underline">
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
};
