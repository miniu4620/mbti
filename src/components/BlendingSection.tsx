import React, { useEffect, useState } from 'react';
import { MBTI } from '../types';
import { MBTI_MAP } from '../data/mbtiData';
import { Plus, Minus, Beaker, ArrowRight, RefreshCw, Sparkles, Layers } from 'lucide-react';

interface BlendingSectionProps {
  selectedMBTIsA: MBTI[];
  selectedMBTIsB: MBTI[];
  recipe10Drops: Record<string, number>;
  setRecipe10Drops: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  typeBRecipe: Record<string, number>;
  setTypeBRecipe: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  chosenType: 'A' | 'B';
  setChosenType: (t: 'A' | 'B') => void;
  onProceedToFinal: () => void;
}

export const BlendingSection: React.FC<BlendingSectionProps> = ({
  selectedMBTIsA,
  selectedMBTIsB,
  recipe10Drops,
  setRecipe10Drops,
  typeBRecipe,
  setTypeBRecipe,
  chosenType,
  setChosenType,
  onProceedToFinal,
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  // Active list of MBTI scents depending on active tab
  const currentMBTIs = activeTab === 'A' ? selectedMBTIsA : selectedMBTIsB;

  // Initialize 10-drop recipes evenly if empty
  useEffect(() => {
    const initRecipe = (selectedList: MBTI[], currentRecipe: Record<string, number>) => {
      if (selectedList.length === 0) return currentRecipe;
      // Check if current recipe has valid keys matching selectedList
      const hasKeys = selectedList.every((m) => currentRecipe[m] !== undefined);
      if (!hasKeys || Object.keys(currentRecipe).length === 0) {
        const initial: Record<string, number> = {};
        const count = selectedList.length;
        let remaining = 10;
        selectedList.forEach((mbti, idx) => {
          if (idx === count - 1) {
            initial[mbti] = remaining;
          } else {
            const val = Math.max(1, Math.floor(10 / count));
            initial[mbti] = val;
            remaining -= val;
          }
        });
        return initial;
      }
      return currentRecipe;
    };

    setRecipe10Drops((prev) => initRecipe(selectedMBTIsA, prev));
    setTypeBRecipe((prev) => initRecipe(selectedMBTIsB, prev));
  }, [selectedMBTIsA, selectedMBTIsB]);

  const currentRecipe = activeTab === 'A' ? recipe10Drops : typeBRecipe;
  const setCurrentRecipe = activeTab === 'A' ? setRecipe10Drops : setTypeBRecipe;

  const totalDrops = (Object.values(currentRecipe) as number[]).reduce((a: number, b: number) => a + b, 0);
  const isExact10 = totalDrops === 10;

  const handleAdjustDrop = (mbti: MBTI, delta: number) => {
    setCurrentRecipe((prev) => {
      const current = prev[mbti] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [mbti]: next };
    });
  };

  const handleResetEqual = () => {
    const count = currentMBTIs.length;
    if (count === 0) return;
    const rec: Record<string, number> = {};
    let rem = 10;
    currentMBTIs.forEach((m, i) => {
      if (i === count - 1) rec[m] = rem;
      else {
        const v = Math.max(1, Math.floor(10 / count));
        rec[m] = v;
        rem -= v;
      }
    });
    setCurrentRecipe(rec);
  };

  const totalDropsA = (Object.values(recipe10Drops) as number[]).reduce((a: number, b: number) => a + b, 0);
  const totalDropsB = (Object.values(typeBRecipe) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#f5f2ed] rounded-3xl p-5 md:p-6 border border-[#e5e0d8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#5a5a40] text-white px-2.5 py-0.5 rounded-full">
              4단계 10방울 블렌딩
            </span>
            <span className="text-xs text-[#8c8273] font-medium">A타입 & B타입 듀얼 레시피</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d2a26]">
            나만의 향수 10방울 비율 조율하기 (A타입 / B타입)
          </h2>
          <p className="text-xs text-[#6e685e] mt-1">
            2가지 타입(A/B)으로 10방울 레시피를 각각 다르게 조율하여 시향 튜브에 테스트할 수 있습니다.
          </p>
        </div>

        {/* Live Drop Status Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#e5e0d8] shadow-sm min-w-[220px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase text-[#8c8273]">
              {activeTab}타입 방울 상태
            </span>
            <span
              className={`text-lg font-mono font-bold ${
                isExact10 ? 'text-[#f27d26]' : 'text-red-500'
              }`}
            >
              {totalDrops} / 10 방울
            </span>
          </div>

          <div className="w-full h-3 bg-[#f5f2ed] rounded-full overflow-hidden border border-[#e5e0d8]">
            <div
              className={`h-full transition-all duration-300 ${
                isExact10
                  ? 'bg-[#f27d26]'
                  : totalDrops > 10
                  ? 'bg-red-500'
                  : 'bg-[#5a5a40]'
              }`}
              style={{ width: `${Math.min(100, (totalDrops / 10) * 100)}%` }}
            ></div>
          </div>

          <p className="text-[10px] text-center text-[#8c8273] mt-1.5 font-medium">
            {isExact10 ? '✅ 정확히 10방울이 완성되었습니다!' : '⚠️ 총합이 정확히 10방울이어야 합니다.'}
          </p>
        </div>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-[#e5e0d8] pb-3">
        <button
          onClick={() => setActiveTab('A')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'A'
              ? 'bg-[#5a5a40] text-white shadow-md'
              : 'bg-white text-[#8c8273] border border-[#e5e0d8] hover:bg-[#f5f2ed]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#f27d26]" />
          A타입 레시피 {totalDropsA === 10 ? '✅' : `(${totalDropsA}/10방울)`}
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
          B타입 레시피 {totalDropsB === 10 ? '✅' : `(${totalDropsB}/10방울)`}
        </button>
      </div>

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Custom Sliders for Active Tab (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 md:p-6 border border-[#e5e0d8] shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[#e5e0d8] pb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-[#2d2a26]">
                [{activeTab}타입] 선택한 향 10방울 비율 설정
              </h3>
              <p className="text-xs text-[#8c8273]">각 향의 방울 수를 조정하여 total 10방울을 맞추세요.</p>
            </div>

            <button
              onClick={handleResetEqual}
              className="text-xs text-[#8c8273] hover:text-[#f27d26] font-semibold flex items-center gap-1 bg-[#f5f2ed] px-3 py-1.5 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 균등 초기화
            </button>
          </div>

          {/* Selected Scents Sliders */}
          <div className="space-y-4">
            {currentMBTIs.map((mbti) => {
              const info = MBTI_MAP.get(mbti);
              const drops = currentRecipe[mbti] || 0;
              return (
                <div
                  key={mbti}
                  className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e5e0d8] space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{info?.emoji}</span>
                      <div>
                        <p className="text-sm font-serif font-bold text-[#2d2a26]">{mbti}</p>
                        <p className="text-[11px] text-[#8c8273]">{info?.noteName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAdjustDrop(mbti, -1)}
                        className="w-8 h-8 rounded-xl bg-white border border-[#e5e0d8] text-[#5a5a40] font-bold flex items-center justify-center hover:bg-[#f5f2ed] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="text-lg font-mono font-bold text-[#f27d26] w-8 text-center">
                        {drops}
                      </span>

                      <button
                        onClick={() => handleAdjustDrop(mbti, 1)}
                        className="w-8 h-8 rounded-xl bg-white border border-[#e5e0d8] text-[#5a5a40] font-bold flex items-center justify-center hover:bg-[#f5f2ed] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={drops}
                    onChange={(e) =>
                      setCurrentRecipe((prev) => ({ ...prev, [mbti]: Number(e.target.value) }))
                    }
                    className="w-full accent-[#f27d26] h-1.5 bg-[#e5e0d8] rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recipe Compare & Selection (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Side-by-side Recipe Summary */}
          <div className="bg-[#f5f2ed] rounded-3xl p-6 border border-[#e5e0d8] shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-[#2d2a26] border-b border-[#e5e0d8] pb-3">
              🧪 A타입 vs B타입 레시피 비교
            </h3>

            <div className="space-y-3">
              {/* Type A Box */}
              <div
                onClick={() => setChosenType('A')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  chosenType === 'A'
                    ? 'bg-white border-2 border-[#f27d26] shadow-sm'
                    : 'bg-[#fdfbf7] border-[#e5e0d8]'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#5a5a40] flex items-center gap-1">
                    {chosenType === 'A' && <Sparkles className="w-3.5 h-3.5 text-[#f27d26]" />}
                    A타입 레시피 {chosenType === 'A' && '(본품 선택됨)'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#f27d26]">
                    {totalDropsA}/10방울
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-[#6e685e]">
                  {selectedMBTIsA.map((m) => (
                    <span key={m} className="bg-[#f5f2ed] px-2 py-0.5 rounded-lg border border-[#e5e0d8]">
                      {m}: {recipe10Drops[m] || 0}방울
                    </span>
                  ))}
                </div>
              </div>

              {/* Type B Box */}
              <div
                onClick={() => setChosenType('B')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  chosenType === 'B'
                    ? 'bg-white border-2 border-[#f27d26] shadow-sm'
                    : 'bg-[#fdfbf7] border-[#e5e0d8]'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#5a5a40] flex items-center gap-1">
                    {chosenType === 'B' && <Sparkles className="w-3.5 h-3.5 text-[#f27d26]" />}
                    B타입 레시피 {chosenType === 'B' && '(본품 선택됨)'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#f27d26]">
                    {totalDropsB}/10방울
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-[#6e685e]">
                  {selectedMBTIsB.map((m) => (
                    <span key={m} className="bg-[#f5f2ed] px-2 py-0.5 rounded-lg border border-[#e5e0d8]">
                      {m}: {typeBRecipe[m] || 0}방울
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tube Testing Guide & Proceed */}
          <div className="bg-[#1a1a1a] rounded-3xl p-6 text-white border border-[#333] shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-[#f27d26]">
              <Beaker className="w-5 h-5" />
              <h4 className="text-sm font-serif font-bold text-white">시향 튜브 테스트 가이드</h4>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
              A타입과 B타입을 각각 튜브에 <span className="text-[#f27d26] font-bold">10방울</span>씩 넣어 시향해 보신 후, 더 마음에 드는 타입을 선택(클릭)하고 본품 제작으로 진행하세요!
            </p>

            <button
              onClick={onProceedToFinal}
              disabled={!(chosenType === 'A' ? totalDropsA === 10 : totalDropsB === 10)}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                (chosenType === 'A' ? totalDropsA === 10 : totalDropsB === 10)
                  ? 'bg-[#f27d26] text-white hover:bg-[#e06c17] shadow-lg cursor-pointer'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              5단계 30ml 환산 ({chosenType}타입) & 라벨 제작
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
