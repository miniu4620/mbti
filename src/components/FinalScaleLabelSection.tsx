import React, { useState, useEffect } from 'react';
import { MBTI, SavedRecipeCard } from '../types';
import { MBTI_MAP } from '../data/mbtiData';
import { fetchGenerateLabel } from '../services/aiService';
import { Sparkles, Save, Check, RefreshCw, Scale, Layers, Camera, Droplets } from 'lucide-react';

interface FinalScaleLabelSectionProps {
  userMBTI: MBTI;
  teamId: number;
  chosenType: 'A' | 'B';
  selectedMBTIsA: MBTI[];
  selectedMBTIsB: MBTI[];
  recipe10Drops: Record<string, number>;
  typeBRecipe: Record<string, number>;
  onSaveToGuestbook: (card: SavedRecipeCard) => void;
}

export const FinalScaleLabelSection: React.FC<FinalScaleLabelSectionProps> = ({
  userMBTI,
  teamId,
  chosenType: initialChosenType,
  selectedMBTIsA,
  selectedMBTIsB,
  recipe10Drops,
  typeBRecipe,
  onSaveToGuestbook,
}) => {
  const [chosenType, setChosenType] = useState<'A' | 'B'>(initialChosenType);
  const [creatorName, setCreatorName] = useState<string>('지우');
  const [perfumeTitle, setPerfumeTitle] = useState<string>('나만의 향수 of 지우');
  const [storyLines, setStoryLines] = useState<string[]>([
    '고요한 새벽의 차분함이 주는 깊은 안식처',
    '아침 햇살처럼 상쾌하게 일어나는 시트러스 한 방울',
    '오늘, 나만의 특별한 온도와 속도로 완성되는 삶의 향기',
  ]);

  const [isLoadingLabel, setIsLoadingLabel] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Get active 10-drop recipe and active MBTIs based on chosen type (A or B)
  const active10Drops = chosenType === 'A' ? recipe10Drops : typeBRecipe;
  const activeSelectedMBTIs = chosenType === 'A' ? selectedMBTIsA : selectedMBTIsB;

  // 30ml remaining conversion calculation: (10 drops x 5 = 50 drops remaining)
  const recipeAdditional50Drops: Record<string, number> = {};
  const recipeTotal60Drops: Record<string, number> = {};

  Object.entries(active10Drops).forEach(([mbti, drops]) => {
    const num = Number(drops) || 0;
    recipeAdditional50Drops[mbti] = num * 5;
    recipeTotal60Drops[mbti] = num * 6;
  });

  const totalAdded50Drops = (Object.values(recipeAdditional50Drops) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleGenerateAILabel = async () => {
    setIsLoadingLabel(true);
    const result = await fetchGenerateLabel(
      creatorName,
      userMBTI,
      chosenType,
      active10Drops,
      ['#치유', '#새로운시작', '#나만의속도']
    );
    setPerfumeTitle(result.perfumeTitle);
    setStoryLines(result.threeLineStory);
    setIsLoadingLabel(false);
  };

  useEffect(() => {
    handleGenerateAILabel();
  }, [chosenType]);

  const handleSaveCard = () => {
    const card: SavedRecipeCard = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString('ko-KR'),
      creatorName,
      userMBTI,
      teamId,
      chosenType,
      recipe10Drops: active10Drops,
      recipe30mlDrops: recipeTotal60Drops,
      recipeGrams: {},
      perfumeTitle,
      threeLineStory: storyLines,
      keywords: ['#나만의향수', '#30ml본품'],
    };
    onSaveToGuestbook(card);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#f5f2ed] rounded-3xl p-5 md:p-6 border border-[#e5e0d8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#5a5a40] text-white px-2.5 py-0.5 rounded-full">
              5단계 본품 제작
            </span>
            <span className="text-xs text-[#8c8273] font-medium">30ml 환산 (추가 50방울) & AI 라벨</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d2a26]">
            30ml 본품 자동 환산 & 나만의 디지털 향수 카드
          </h2>
          <p className="text-xs text-[#6e685e] mt-1">
            💡 샘플 10방울을 먼저 30ml 본품에 투입했으므로, 여기서는 <span className="font-bold text-[#f27d26]">레시피 × 5 (추가 50방울)</span>를 투입하면 60방울(30ml)이 완성됩니다!
          </p>
        </div>

        {/* Creator Name & Regenerate Button */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="조향사 이름"
            className="px-4 py-2 bg-white rounded-2xl border border-[#e5e0d8] text-xs font-bold text-[#2d2a26] focus:outline-none focus:border-[#5a5a40]"
          />

          <button
            onClick={handleGenerateAILabel}
            disabled={isLoadingLabel}
            className="px-4 py-2 bg-[#5a5a40] text-white rounded-2xl text-xs font-bold hover:bg-[#4a4a35] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLabel ? 'animate-spin' : ''}`} />
            AI 라벨 문구 재생성
          </button>
        </div>
      </div>

      {/* Type Selector (A or B) */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#8c8273]">제작할 레시피 타입:</span>
        <button
          onClick={() => {
            setChosenType('A');
            setIsSaved(false);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            chosenType === 'A'
              ? 'bg-[#5a5a40] text-white shadow-md'
              : 'bg-white text-[#8c8273] border border-[#e5e0d8]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#f27d26]" /> A타입 레시피
        </button>

        <button
          onClick={() => {
            setChosenType('B');
            setIsSaved(false);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            chosenType === 'B'
              ? 'bg-[#5a5a40] text-white shadow-md'
              : 'bg-white text-[#8c8273] border border-[#e5e0d8]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#f27d26]" /> B타입 레시피
        </button>
      </div>

      {/* Main Grid: 30ml Auto Scale Display (Left 6) vs Digital Label Card (Right 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 30ml Auto Scale Display (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 md:p-6 border-4 border-[#5a5a40] shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-[#e5e0d8] pb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#f27d26]" />
                <div>
                  <h3 className="text-base font-serif font-bold text-[#2d2a26]">
                    [{chosenType}타입] 30ml 본품 추가 투입 레시피
                  </h3>
                  <p className="text-xs text-[#8c8273]">
                    샘플 10방울 투입완료 + 추가 투입 (×5배 = 50방울)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#8c8273] uppercase">TARGET</span>
                <p className="text-sm font-mono font-bold text-[#f27d26]">30ml 완성</p>
              </div>
            </div>

            {/* Recipe Scale Numbers (x5) */}
            <div className="space-y-3">
              {Object.entries(active10Drops).map(([mbti, drops10]) => {
                const info = MBTI_MAP.get(mbti as MBTI);
                const drops50 = recipeAdditional50Drops[mbti];
                const drops60Total = recipeTotal60Drops[mbti];

                return (
                  <div
                    key={mbti}
                    className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e5e0d8] flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info?.emoji}</span>
                      <div>
                        <p className="text-base font-serif font-bold text-[#2d2a26]">
                          {mbti} <span className="text-xs font-sans text-[#8c8273]">({info?.noteName})</span>
                        </p>
                        <p className="text-xs text-[#8c8273]">10방울 중 {drops10}방울 비율</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-mono font-black text-[#f27d26]">
                        + {drops50} <span className="text-xs font-normal text-[#2d2a26]">방울 추가</span>
                      </p>
                      <p className="text-[10px] text-[#8c8273]">총 누적: {drops60Total}방울</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scale Summary Box */}
            <div className="bg-[#f5f2ed] p-4 rounded-2xl border border-[#e5e0d8] flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-[#5a5a40] flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-[#f27d26]" /> 이번에 추가할 방울 수
                </p>
                <p className="text-xs text-[#8c8273]">30ml 용기에 방울대로 더 넣어주세요</p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-serif font-black text-[#f27d26]">{totalAdded50Drops} 방울</p>
                <p className="text-[10px] text-[#8c8273]">(기존 10방울 + 추가 50방울 = 총 60방울)</p>
              </div>
            </div>
          </div>

          {/* Save Card Button on Left Panel */}
          <div className="pt-3 border-t border-[#e5e0d8] flex items-center justify-between">
            <span className="text-xs text-[#8c8273]">
              {teamId}조 • {userMBTI} • {chosenType}타입
            </span>

            <button
              onClick={handleSaveCard}
              disabled={isSaved}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isSaved
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#5a5a40] text-white hover:bg-[#4a4a35] shadow-md'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> 보관함 저장 완료!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> 레시피 보관함에 저장
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: AI Digital Perfume Card for Photo/Screenshot (6 Cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#1c1c1c] to-[#121212] rounded-3xl p-6 md:p-8 text-white border border-[#333] shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Aesthetic background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f27d26]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Header branding */}
            <div className="border-b border-white/10 pb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-serif italic tracking-wider text-[#f27d26] font-bold">
                  미니유공방 퍼스널 시그니처
                </span>
                <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full text-amber-300 border border-white/10">
                  30ml Perfume
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                &quot;{perfumeTitle.replace(/^Aura of\s*/i, '나만의 향수 of ')}&quot;
              </h3>
            </div>

            {/* Selected Fragrances Badge List (NO DROP COUNTS!) */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c8273] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SELECTED FRAGRANCE NOTES
              </p>

              <div className="flex flex-wrap gap-2">
                {activeSelectedMBTIs.map((mbti) => {
                  const info = MBTI_MAP.get(mbti);
                  return (
                    <div
                      key={mbti}
                      className="bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-2xl border border-white/10 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <span className="text-lg">{info?.emoji}</span>
                      <div>
                        <p className="text-xs font-bold font-mono text-amber-200">{mbti}</p>
                        <p className="text-[10px] text-gray-300">{info?.noteName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Encouragement Message Box */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center py-6">
              <p className="text-sm md:text-base font-serif italic text-amber-100 font-bold leading-relaxed">
                &quot;오늘, 당신의 새로운 걸음을 진심으로 응원합니다&quot;
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="flex justify-between items-center text-xs text-[#8c8273] pt-2">
              <span>Perfumer: <strong className="text-white">{creatorName}</strong> ({userMBTI})</span>
              <span>Team {teamId} • {new Date().toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          {/* Photo guide badge footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-amber-300 bg-amber-400/10 py-3 rounded-2xl border border-amber-400/20 relative z-10">
            <Camera className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-semibold">이 화면을 캡처하거나 사진 찍어서 간직해 보세요! 📸</span>
          </div>
        </div>
      </div>
    </div>
  );
};
