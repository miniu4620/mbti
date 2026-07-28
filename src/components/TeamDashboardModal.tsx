import React from 'react';
import { MBTI_FRAGRANCE_LIST } from '../data/mbtiData';
import { X, Tv, Users, BarChart3, Sparkles } from 'lucide-react';

interface TeamDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTeamId: number;
}

export const TeamDashboardModal: React.FC<TeamDashboardModalProps> = ({
  isOpen,
  onClose,
  activeTeamId,
}) => {
  if (!isOpen) return null;

  // Mock aggregated team data for demonstration
  const teamsData = [
    { team: 1, topNote: 'ISTJ (Dry Woody)', count: 4, leadMBTI: 'ISTJ' },
    { team: 2, topNote: 'ENFP (Citrus Fruity)', count: 5, leadMBTI: 'ENFP' },
    { team: 3, topNote: 'INTJ (Citrus)', count: 3, leadMBTI: 'INTJ' },
    { team: 4, topNote: 'INFJ (Musky)', count: 6, leadMBTI: 'INFJ' },
    { team: 5, topNote: 'ESFP (Fresh Clean)', count: 4, leadMBTI: 'ESFP' },
    { team: 6, topNote: 'ESTJ (Fresh Green)', count: 3, leadMBTI: 'ESTJ' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e0d8] shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e5e0d8] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f27d26] animate-ping"></span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#5a5a40]">
              실시간 조별 향 지도 대시보드 (강사용/빔프로젝터 모드)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f2ed] border border-[#e5e0d8] flex items-center justify-center text-[#5a5a40] hover:bg-[#5a5a40] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#6e685e]">
          현재 수강생들이 선택 중인 조별 메인 인기도와 조별 대표 MBTI 향의 분포를 실시간 그래프로 시각화합니다.
        </p>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamsData.map((item) => {
            const isCurrent = item.team === activeTeamId;
            return (
              <div
                key={item.team}
                className={`p-5 rounded-3xl border transition-all ${
                  isCurrent
                    ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow-lg scale-[1.02]'
                    : 'bg-white text-[#2d2a26] border-[#e5e0d8]'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      isCurrent ? 'bg-[#f27d26] text-white' : 'bg-[#f5f2ed] text-[#5a5a40]'
                    }`}
                  >
                    {item.team}조 대표
                  </span>

                  <span className="text-xs font-mono font-bold">{item.count}명 선택</span>
                </div>

                <h3
                  className={`text-lg font-serif font-bold ${
                    isCurrent ? 'text-white' : 'text-[#2d2a26]'
                  }`}
                >
                  {item.topNote}
                </h3>

                <div className="mt-3 w-full h-2 bg-[#f5f2ed] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f27d26] rounded-full"
                    style={{ width: `${(item.count / 8) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Aggregate Scent Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#e5e0d8] space-y-4">
          <h3 className="text-sm font-bold text-[#5a5a40] uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#f27d26]" /> 16가지 MBTI 향 실시간 전체 선택 분포
          </h3>

          <div className="space-y-2">
            {MBTI_FRAGRANCE_LIST.slice(0, 6).map((item, idx) => {
              const mockVal = [8, 6, 5, 4, 4, 3][idx];
              return (
                <div key={item.mbti} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-mono font-bold text-[#2d2a26]">{item.mbti}</span>
                  <div className="flex-1 h-3 bg-[#f5f2ed] rounded-full overflow-hidden border border-[#e5e0d8]">
                    <div
                      className="h-full bg-[#5a5a40] rounded-full"
                      style={{ width: `${(mockVal / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right font-mono font-bold text-[#f27d26]">
                    {mockVal}명
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-2xl text-xs font-bold uppercase tracking-wider"
          >
            대시보드 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
