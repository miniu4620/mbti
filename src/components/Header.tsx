import React from 'react';
import { Sparkles, Users, Award, BookOpen, Tv, Gamepad2, HeartHandshake } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  onOpenTeamDashboard: () => void;
  onOpenGuestbook: () => void;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  onOpenTeamDashboard,
  onOpenGuestbook,
  isProjectorMode,
  onToggleProjectorMode,
}) => {
  const steps = [
    { num: 1, label: '4x4 빙고' },
    { num: 2, label: 'AI 페르소나 & 케미' },
    { num: 3, label: '선호 향 선택' },
    { num: 4, label: '10방울 블렌딩' },
    { num: 5, label: '30ml 환산 & 라벨' },
  ];

  return (
    <header className="bg-white border-b border-[#e5e0d8] px-4 md:px-8 py-4 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title branding */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f27d26] animate-pulse"></span>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-[#5a5a40] tracking-tight">
                MBTI Perfume
              </h1>
            </div>
            <p className="text-xs text-[#8c8273] tracking-tight font-medium mt-0.5">
              MINIU WORKSHOP
            </p>
          </div>

          <button
            onClick={onToggleProjectorMode}
            className="md:hidden px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 bg-[#f5f2ed] text-[#5a5a40] border-[#e5e0d8]"
          >
            <Tv className="w-3.5 h-3.5" />
            {isProjectorMode ? '수강생 모드' : '강사 빔 모드'}
          </button>
        </div>

        {/* Action Toolbar for Mobile */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={onOpenTeamDashboard}
            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#f5f2ed] text-[#5a5a40] border border-[#e5e0d8] flex items-center gap-1 shrink-0"
          >
            <Users className="w-3 h-3 text-[#f27d26]" />
            조별 향 지도
          </button>
          <button
            onClick={onOpenGuestbook}
            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#f5f2ed] text-[#5a5a40] border border-[#e5e0d8] flex items-center gap-1 shrink-0"
          >
            <BookOpen className="w-3 h-3 text-[#f27d26]" />
            디지털 방명록
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            return (
              <button
                key={step.num}
                onClick={() => onSelectStep(step.num)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#5a5a40] text-white shadow-sm scale-105'
                    : 'bg-[#f5f2ed] text-[#6e685e] hover:bg-[#e5e0d8]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-[#f27d26] text-white' : 'bg-[#e5e0d8] text-[#5a5a40]'
                  }`}
                >
                  {step.num}
                </span>
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Action Toolbar */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenTeamDashboard}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f5f2ed] text-[#5a5a40] hover:bg-[#e5e0d8] border border-[#e5e0d8] flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-[#f27d26]" />
            실시간 조별 향 지도
          </button>

          <button
            onClick={onOpenGuestbook}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f5f2ed] text-[#5a5a40] hover:bg-[#e5e0d8] border border-[#e5e0d8] flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#f27d26]" />
            디지털 방명록
          </button>

          <button
            onClick={onToggleProjectorMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              isProjectorMode
                ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                : 'bg-[#f5f2ed] text-[#5a5a40] border-[#e5e0d8]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            {isProjectorMode ? '수강생 모드' : '강사 빔 모드'}
          </button>
        </div>
      </div>
    </header>
  );
};
