import React, { useState } from 'react';
import { MBTI } from '../types';
import { MBTI_FRAGRANCE_LIST } from '../data/mbtiData';
import { Check, ArrowRight, Layers, Copy, Sparkles } from 'lucide-react';

interface FragranceSelectionSectionProps {
  selectedMBTIsA: MBTI[];
  setSelectedMBTIsA: React.Dispatch<React.SetStateAction<MBTI[]>>;
  selectedMBTIsB: MBTI[];
  setSelectedMBTIsB: React.Dispatch<React.SetStateAction<MBTI[]>>;
  userMBTI: MBTI;
  onProceedToBlending: () => void;
}

export const FragranceSelectionSection: React.FC<FragranceSelectionSectionProps> = ({
  selectedMBTIsA,
  setSelectedMBTIsA,
  selectedMBTIsB,
  setSelectedMBTIsB,
  userMBTI,
  onProceedToBlending,
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  const activeSelected = activeTab === 'A' ? selectedMBTIsA : selectedMBTIsB;
  const setActiveSelected = activeTab === 'A' ? setSelectedMBTIsA : setSelectedMBTIsB;

  const toggleSelection = (mbti: MBTI) => {
    if (activeSelected.includes(mbti)) {
      setActiveSelected((prev) => prev.filter((m) => m !== mbti));
    } else {
      if (activeSelected.length < 5) {
        setActiveSelected((prev) => [...prev, mbti]);
      }
    }
  };

  const handleCopyAToB = () => {
    setSelectedMBTIsB([...selectedMBTIsA]);
  };

  const isValidCountA = selectedMBTIsA.length >= 3 && selectedMBTIsA.length <= 5;
  const isValidCountB = selectedMBTIsB.length >= 3 && selectedMBTIsB.length <= 5;

  const handleProceed = () => {
    // If B-type is empty or invalid, auto fill B with A
    if (!isValidCountB && isValidCountA) {
      setSelectedMBTIsB([...selectedMBTIsA]);
    }
    onProceedToBlending();
  };

  const isValidOverall = isValidCountA;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#f5f2ed] rounded-3xl p-6 border border-[#e5e0d8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#5a5a40] text-white px-2.5 py-0.5 rounded-full">
              3단계 향기 선택
            </span>
            <span className="text-xs text-[#8c8273] font-medium">A타입 & B타입 향기 조합</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d2a26]">
            나만의 MBTI 향기 선택 (A타입 / B타입)
          </h2>
          <p className="text-xs text-[#6e685e] mt-1">
            A타입과 B타입은 서로 다른 향들을 조합할 수 있습니다. 각 타입별로 3~5가지 향을 선택해 보세요!
          </p>
        </div>

        {/* Counter Badge & Proceed Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#e5e0d8] shadow-sm text-right">
            <p className="text-[10px] font-bold text-[#8c8273]">SELECTED SCENTS [{activeTab}타입]</p>
            <p
              className={`text-xl font-mono font-bold ${
                activeSelected.length >= 3 && activeSelected.length <= 5
                  ? 'text-[#f27d26]'
                  : 'text-[#8c8273]'
              }`}
            >
              {activeSelected.length} / 3~5개
            </p>
          </div>

          <button
            onClick={handleProceed}
            disabled={!isValidOverall}
            className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              isValidOverall
                ? 'bg-[#1a1a1a] text-white hover:bg-[#333] shadow-md cursor-pointer'
                : 'bg-[#e5e0d8] text-[#8c8273] cursor-not-allowed'
            }`}
          >
            4단계 10방울 블렌딩
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e0d8] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('A')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'A'
                ? 'bg-[#5a5a40] text-white shadow-md'
                : 'bg-white text-[#8c8273] border border-[#e5e0d8] hover:bg-[#f5f2ed]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#f27d26]" />
            A타입 향 선택 {isValidCountA ? '✅' : `(${selectedMBTIsA.length}/3~5개)`}
          </button>

          <button
            onClick={() => setActiveTab('B')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'B'
                ? 'bg-[#5a5a40] text-white shadow-md'
                : 'bg-white text-[#8c8273] border border-[#e5e0d8] hover:bg-[#f5f2ed]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#f27d26]" />
            B타입 향 선택 {isValidCountB ? '✅' : `(${selectedMBTIsB.length}/3~5개)`}
          </button>
        </div>

        {activeTab === 'B' && (
          <button
            onClick={handleCopyAToB}
            className="px-3.5 py-2 bg-white hover:bg-[#f5f2ed] text-[#5a5a40] border border-[#e5e0d8] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-[#f27d26]" /> A타입에서 고른 향 복사해오기
          </button>
        )}
      </div>

      {/* Selected Scents Indicator Bar */}
      <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e5e0d8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#f27d26]" />
          <span className="text-xs font-bold text-[#5a5a40]">
            [{activeTab}타입] 현재 선택된 향:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeSelected.length === 0 ? (
            <span className="text-xs text-[#8c8273] italic">아래에서 3~5개 향을 클릭하세요</span>
          ) : (
            activeSelected.map((m) => (
              <span
                key={m}
                className="bg-[#5a5a40] text-white px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold"
              >
                {m}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Fragrances Bento Grid (16 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MBTI_FRAGRANCE_LIST.map((item) => {
          const isSelected = activeSelected.includes(item.mbti);
          return (
            <div
              key={item.mbti}
              onClick={() => toggleSelection(item.mbti)}
              className={`rounded-3xl p-5 border cursor-pointer transition-all flex flex-col justify-between select-none relative ${
                isSelected
                  ? 'bg-white border-2 border-[#f27d26] shadow-md scale-[1.02]'
                  : 'bg-white border-[#e5e0d8] hover:border-[#5a5a40]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#f27d26] text-white' : 'bg-[#f5f2ed] border border-[#e5e0d8]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-[#2d2a26]">
                  {item.mbti}{' '}
                  <span className="text-sm font-sans font-semibold text-[#8c8273]">
                    ({item.noteName})
                  </span>
                </h3>

                <p className="text-xs text-[#6e685e] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e5e0d8] flex items-center justify-between text-[11px] text-[#8c8273]">
                <span className="truncate max-w-[180px]">⭐ {item.celebrities.join(', ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
