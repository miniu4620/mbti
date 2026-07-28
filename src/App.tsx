/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MBTI, SavedRecipeCard, GuestbookEntry } from './types';
import { Header } from './components/Header';
import { BingoSection } from './components/BingoSection';
import { PersonaWorkshopSection } from './components/PersonaWorkshopSection';
import { FragranceSelectionSection } from './components/FragranceSelectionSection';
import { BlendingSection } from './components/BlendingSection';
import { FinalScaleLabelSection } from './components/FinalScaleLabelSection';

import { TeamDashboardModal } from './components/TeamDashboardModal';
import { BalanceGameModal } from './components/BalanceGameModal';
import { GuestbookModal } from './components/GuestbookModal';

import { Sparkles, ArrowRight, ArrowLeft, Tv, HeartHandshake } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userMBTI, setUserMBTI] = useState<MBTI>('ENFP');
  const [teamId, setTeamId] = useState<number>(3);

  // Selected fragrances in Step 3 for Type A and Type B
  const [selectedMBTIsA, setSelectedMBTIsA] = useState<MBTI[]>(['ISTJ', 'ENFP', 'INTP']);
  const [selectedMBTIsB, setSelectedMBTIsB] = useState<MBTI[]>(['ISTJ', 'ENFP', 'INTP']);

  // Blending recipes in Step 4
  const [recipe10Drops, setRecipe10Drops] = useState<Record<string, number>>({});
  const [typeBRecipe, setTypeBRecipe] = useState<Record<string, number>>({});
  const [chosenType, setChosenType] = useState<'A' | 'B'>('A');

  // Modals & Projector Mode
  const [isTeamDashboardOpen, setIsTeamDashboardOpen] = useState<boolean>(false);
  const [isBalanceGameOpen, setIsBalanceGameOpen] = useState<boolean>(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState<boolean>(false);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);

  // Vault & Guestbook state
  const [savedCards, setSavedCards] = useState<SavedRecipeCard[]>([
    {
      id: 'sample-1',
      createdAt: '2026. 7. 28.',
      creatorName: '지우 조향사',
      userMBTI: 'ENFP',
      teamId: 3,
      chosenType: 'A',
      recipe10Drops: { ISTJ: 4, ENFP: 3, INTP: 3 },
      recipe30mlDrops: { ISTJ: 24, ENFP: 18, INTP: 18 },
      recipeGrams: { ISTJ: 1.2, ENFP: 0.9, INTP: 0.9 },
      perfumeTitle: 'Midnight Curiosity',
      threeLineStory: [
        '고요한 오크우드의 깊고 차분한 안식처',
        '생각의 정적 속에서 반짝이는 시트러스 사색',
        '오늘, 새로운 내일을 열어주는 부드러운 하모니',
      ],
      keywords: ['#차분함', '#새로운시작'],
    },
  ]);

  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([
    {
      id: 'gb-1',
      name: '민서',
      mbti: 'INTP',
      message: '처음엔 어색했는데 조원들과 함께 16가지 향을 맡으며 이야기 나누니 마음이 한결 편안해졌어요! 30ml 저울 환산이 나와서 계량도 쉬웠습니다.',
      createdAt: '오전 10:20',
      teamId: 3,
    },
    {
      id: 'gb-2',
      name: '도현',
      mbti: 'ISTJ',
      message: 'Dry Woody 향과 Citrus의 조합이 의외로 굉장히 좋았습니다. AI가 써준 스토리 카드 덕분에 더 간직하고 싶은 향수가 되었네요.',
      createdAt: '오전 10:45',
      teamId: 3,
    },
  ]);

  const handleSaveToGuestbook = (card: SavedRecipeCard) => {
    setSavedCards((prev) => [card, ...prev]);
  };

  const handleAddGuestbookEntry = (entry: GuestbookEntry) => {
    setGuestbookEntries((prev) => [entry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2d2a26] font-sans flex flex-col justify-between selection:bg-[#f27d26] selection:text-white">
      {/* Top sticky Header */}
      <Header
        currentStep={currentStep}
        onSelectStep={(s) => setCurrentStep(s)}
        onOpenTeamDashboard={() => setIsTeamDashboardOpen(true)}
        onOpenGuestbook={() => setIsGuestbookOpen(true)}
        isProjectorMode={isProjectorMode}
        onToggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
      />

      {/* Main Workshop Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Projector Header Banner if in projector mode */}
        {isProjectorMode && (
          <div className="bg-[#1a1a1a] text-white rounded-3xl p-6 border border-[#333] shadow-2xl flex justify-between items-center animate-fade-in">
            <div className="flex items-center gap-3">
              <Tv className="w-8 h-8 text-[#f27d26]" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#f27d26]">
                  INSTRUCTOR BEAM PROJECTOR MODE
                </span>
                <h2 className="text-xl font-serif font-bold text-white">
                  {currentStep}단계: {['', '4x4 빙고 아이스브레이킹', 'AI 페르소나 & 케미 워크숍', '선호 향 선택', '10방울 비율 블렌딩', '30ml 환산 & 디지털 라벨'][currentStep]}
                </h2>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-white">
              {teamId}조 대시보드 진행 중
            </span>
          </div>
        )}

        {/* Step Views */}
        {currentStep === 1 && (
          <BingoSection
            onCompleteBingo={() => {}}
            teamId={teamId}
            setTeamId={setTeamId}
          />
        )}

        {currentStep === 2 && (
          <PersonaWorkshopSection
            userMBTI={userMBTI}
            setUserMBTI={setUserMBTI}
            teamId={teamId}
          />
        )}

        {currentStep === 3 && (
          <FragranceSelectionSection
            selectedMBTIsA={selectedMBTIsA}
            setSelectedMBTIsA={setSelectedMBTIsA}
            selectedMBTIsB={selectedMBTIsB}
            setSelectedMBTIsB={setSelectedMBTIsB}
            userMBTI={userMBTI}
            onProceedToBlending={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <BlendingSection
            selectedMBTIsA={selectedMBTIsA}
            selectedMBTIsB={selectedMBTIsB}
            recipe10Drops={recipe10Drops}
            setRecipe10Drops={setRecipe10Drops}
            typeBRecipe={typeBRecipe}
            setTypeBRecipe={setTypeBRecipe}
            chosenType={chosenType}
            setChosenType={setChosenType}
            onProceedToFinal={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && (
          <FinalScaleLabelSection
            userMBTI={userMBTI}
            teamId={teamId}
            chosenType={chosenType}
            selectedMBTIsA={selectedMBTIsA}
            selectedMBTIsB={selectedMBTIsB}
            recipe10Drops={recipe10Drops}
            typeBRecipe={typeBRecipe}
            onSaveToGuestbook={handleSaveToGuestbook}
          />
        )}

        {/* Bottom Step Navigation Control Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#e5e0d8] shadow-sm flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed bg-[#f5f2ed] text-[#8c8273]'
                : 'bg-[#f5f2ed] text-[#5a5a40] hover:bg-[#e5e0d8]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> 이전 단계
          </button>

          <div className="flex items-center gap-1.5 text-xs text-[#8c8273] font-medium hidden sm:flex">
            <span>STEP {currentStep} OF 5</span>
          </div>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
            disabled={currentStep === 5}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentStep === 5
                ? 'opacity-40 cursor-not-allowed bg-[#f5f2ed] text-[#8c8273]'
                : 'bg-[#1a1a1a] text-white hover:bg-[#333]'
            }`}
          >
            다음 단계 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5e0d8] py-6 px-4 md:px-8 text-center text-xs text-[#8c8273]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AI MBTI Perfume Atelier Workshop — 청년 마음치유 & 조향 프로그램</p>
          <div className="flex items-center gap-4">
            <span>차은우 (ISTJ)</span>
            <span>•</span>
            <span>아이유 (INFJ)</span>
            <span>•</span>
            <span>방탄소년단 뷔 (INFP)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TeamDashboardModal
        isOpen={isTeamDashboardOpen}
        onClose={() => setIsTeamDashboardOpen(false)}
        activeTeamId={teamId}
      />

      <BalanceGameModal
        isOpen={isBalanceGameOpen}
        onClose={() => setIsBalanceGameOpen(false)}
        onSelectScents={(mbtis) => {
          setSelectedMBTIsA(mbtis);
          setSelectedMBTIsB(mbtis);
          setCurrentStep(3);
        }}
      />

      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        savedCards={savedCards}
        guestbookEntries={guestbookEntries}
        onAddEntry={handleAddGuestbookEntry}
      />
    </div>
  );
}
