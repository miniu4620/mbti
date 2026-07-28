import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MBTI_FRAGRANCE_LIST, MBTI_MAP } from '../data/mbtiData';
import { MBTI } from '../types';
import { Check, Sparkles, Trophy, HelpCircle, Plus, Trash2, Edit2, X } from 'lucide-react';

interface BingoCellState {
  id: number;
  mbti: MBTI | null;
  isChecked: boolean;
}

interface BingoSectionProps {
  onCompleteBingo: () => void;
  teamId: number;
  setTeamId: (id: number) => void;
}

export const BingoSection: React.FC<BingoSectionProps> = ({
  onCompleteBingo,
  teamId,
  setTeamId,
}) => {
  // Initially 16 empty cells
  const [grid, setGrid] = useState<BingoCellState[]>(() => {
    return Array.from({ length: 16 }, (_, index) => ({
      id: index,
      mbti: null,
      isChecked: false,
    }));
  });

  const [bingoCount, setBingoCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<BingoCellState | null>(null);
  const [pickerCellId, setPickerCellId] = useState<number | null>(null);

  // Calculate Bingos
  const checkBingos = (currentGrid: BingoCellState[]): number => {
    let count = 0;
    // Rows
    for (let r = 0; r < 4; r++) {
      if (
        currentGrid[r * 4].mbti && currentGrid[r * 4].isChecked &&
        currentGrid[r * 4 + 1].mbti && currentGrid[r * 4 + 1].isChecked &&
        currentGrid[r * 4 + 2].mbti && currentGrid[r * 4 + 2].isChecked &&
        currentGrid[r * 4 + 3].mbti && currentGrid[r * 4 + 3].isChecked
      ) {
        count++;
      }
    }
    // Cols
    for (let c = 0; c < 4; c++) {
      if (
        currentGrid[c].mbti && currentGrid[c].isChecked &&
        currentGrid[c + 4].mbti && currentGrid[c + 4].isChecked &&
        currentGrid[c + 8].mbti && currentGrid[c + 8].isChecked &&
        currentGrid[c + 12].mbti && currentGrid[c + 12].isChecked
      ) {
        count++;
      }
    }
    // Diagonals
    if (
      currentGrid[0].mbti && currentGrid[0].isChecked &&
      currentGrid[5].mbti && currentGrid[5].isChecked &&
      currentGrid[10].mbti && currentGrid[10].isChecked &&
      currentGrid[15].mbti && currentGrid[15].isChecked
    ) {
      count++;
    }
    if (
      currentGrid[3].mbti && currentGrid[3].isChecked &&
      currentGrid[6].mbti && currentGrid[6].isChecked &&
      currentGrid[9].mbti && currentGrid[9].isChecked &&
      currentGrid[12].mbti && currentGrid[12].isChecked
    ) {
      count++;
    }
    return count;
  };

  const handleCellClick = (cell: BingoCellState) => {
    if (!cell.mbti) {
      // Empty cell clicked: open MBTI selection modal
      setPickerCellId(cell.id);
      return;
    }

    // Cell has MBTI: toggle checked status (game played)
    const updatedGrid = grid.map((c) =>
      c.id === cell.id ? { ...c, isChecked: !c.isChecked } : c
    );
    setGrid(updatedGrid);

    const count = checkBingos(updatedGrid);
    setBingoCount(count);

    const clicked = updatedGrid.find((c) => c.id === cell.id) || null;
    setSelectedCell(clicked);

    playClickAudio();

    if (count >= 4 && !isCompleted) {
      setIsCompleted(true);
      triggerConfetti();
      onCompleteBingo();
    }
  };

  const handleAssignMBTI = (cellId: number, mbti: MBTI) => {
    const updatedGrid = grid.map((c) =>
      c.id === cellId ? { ...c, mbti, isChecked: false } : c
    );
    setGrid(updatedGrid);
    setPickerCellId(null);
    const count = checkBingos(updatedGrid);
    setBingoCount(count);

    const assignedCell = updatedGrid.find((c) => c.id === cellId) || null;
    setSelectedCell(assignedCell);
  };

  const handleResetGrid = () => {
    const emptyGrid = Array.from({ length: 16 }, (_, idx) => ({
      id: idx,
      mbti: null,
      isChecked: false,
    }));
    setGrid(emptyGrid);
    setBingoCount(0);
    setIsCompleted(false);
    setSelectedCell(null);
  };

  const playClickAudio = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // AudioContext fallback
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5a5a40', '#f27d26', '#eab308', '#ec4899', '#3b82f6'],
      });
    } catch (e) {
      console.log('Confetti effect fired');
    }
  };

  const filledCount = grid.filter((c) => c.mbti !== null).length;
  const activeInfo = selectedCell && selectedCell.mbti ? MBTI_MAP.get(selectedCell.mbti) : null;

  // Used MBTIs list for highlighting in picker
  const usedMBTIs = grid.map((c) => c.mbti).filter((m): m is MBTI => m !== null);

  return (
    <div className="space-y-6">
      {/* Top Banner Intro */}
      <div className="bg-[#f5f2ed] rounded-3xl p-5 md:p-6 border border-[#e5e0d8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#5a5a40] text-white px-2.5 py-0.5 rounded-full">
              1단계 아이스브레이킹
            </span>
            <span className="text-xs text-[#8c8273] font-medium">조별 16가지 MBTI 향 시향</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d2a26]">
            4x4 MBTI 향기 커스텀 빙고
          </h2>
          <p className="text-xs text-[#6e685e] mt-1">
            1) 빈 칸을 눌러 16가지 MBTI 향을 직접 배치하세요.
            2) 불리는 MBTI 향을 클릭해 체크하고 4빙고를 달성하세요! 🎉
          </p>
        </div>

        {/* Team Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-[#e5e0d8] flex items-center gap-2 shadow-sm">
            <span className="text-xs font-semibold text-[#8c8273]">내 조:</span>
            <select
              value={teamId}
              onChange={(e) => setTeamId(Number(e.target.value))}
              className="text-xs font-bold text-[#5a5a40] bg-transparent focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
                <option key={t} value={t}>
                  {t}조
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetGrid}
            className="px-3.5 py-2 bg-white text-[#8c8273] hover:text-red-600 border border-[#e5e0d8] hover:border-red-300 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            초기화
          </button>
        </div>
      </div>

      {/* Main Grid & Inspector Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4x4 Bingo Board (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 md:p-6 border border-[#e5e0d8] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#f27d26]" />
              <span className="text-xs font-bold uppercase text-[#8c8273]">
                BINGO BOARD ({filledCount}/16 채움)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6e685e]">달성 빙고:</span>
              <span
                className={`text-base font-mono font-bold px-3 py-0.5 rounded-full ${
                  bingoCount >= 4
                    ? 'bg-[#f27d26] text-white animate-bounce'
                    : 'bg-[#f5f2ed] text-[#5a5a40]'
                }`}
              >
                {bingoCount} / 4 Bingo
              </span>
            </div>
          </div>

          {/* 4x4 Responsive Grid */}
          <div className="grid grid-cols-4 gap-2 md:gap-3 aspect-square max-w-lg mx-auto">
            {grid.map((cell) => {
              const info = cell.mbti ? MBTI_MAP.get(cell.mbti) : null;
              return (
                <div key={cell.id} className="relative group">
                  <button
                    onClick={() => handleCellClick(cell)}
                    className={`w-full h-full rounded-2xl p-2 border transition-all flex flex-col items-center justify-center text-center select-none cursor-pointer relative min-h-[70px] md:min-h-[90px] ${
                      !cell.mbti
                        ? 'bg-[#f9f8f5] border-dashed border-[#ccc] hover:border-[#f27d26] hover:bg-[#f5f2ed] text-[#8c8273]'
                        : cell.isChecked
                        ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow-md scale-[1.02]'
                        : 'bg-[#fdfbf7] text-[#2d2a26] border-[#e5e0d8] hover:border-[#f27d26] hover:bg-white'
                    }`}
                  >
                    {!cell.mbti ? (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Plus className="w-5 h-5 text-[#8c8273]" />
                        <span className="text-[10px] font-bold text-[#8c8273]">MBTI 배치</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm md:text-lg">{info?.emoji}</span>
                        <div>
                          <p
                            className={`text-xs md:text-sm font-black font-mono tracking-tight ${
                              cell.isChecked ? 'text-white' : 'text-[#2d2a26]'
                            }`}
                          >
                            {cell.mbti}
                          </p>
                          <p
                            className={`text-[9px] md:text-[10px] truncate max-w-[60px] ${
                              cell.isChecked ? 'text-[#e5e0d8]' : 'text-[#8c8273]'
                            }`}
                          >
                            {info?.noteName}
                          </p>
                        </div>

                        {cell.isChecked && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#f27d26] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </>
                    )}
                  </button>

                  {/* Change MBTI button overlay for filled cells */}
                  {cell.mbti && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPickerCellId(cell.id);
                      }}
                      className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-[#5a5a40] p-1 rounded-full border border-[#e5e0d8] shadow-sm text-[9px]"
                      title="MBTI 변경"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Status bar */}
          <div className="mt-4 pt-4 border-t border-[#e5e0d8] flex items-center justify-between text-xs text-[#8c8273]">
            <p>💡 빈 칸을 터치해 MBTI를 채우고, 불린 MBTI 칸을 터치하여 체크(불림) 처리하세요.</p>
            {bingoCount >= 4 && (
              <span className="text-[#f27d26] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 4빙고 달성 성공!
              </span>
            )}
          </div>
        </div>

        {/* Right Info Card & Celebrity Match (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#1a1a1a] rounded-3xl p-6 text-white border border-[#333] shadow-lg flex flex-col justify-between min-h-[360px]">
            {activeInfo ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f27d26] bg-[#f27d26]/10 px-2.5 py-1 rounded-full border border-[#f27d26]/20">
                      MBTI FRAGRANCE
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white mt-2 flex items-center gap-2">
                      <span>{activeInfo.emoji}</span> {activeInfo.mbti}
                    </h3>
                  </div>
                  <span className="text-sm font-semibold text-[#8c8273]">
                    {activeInfo.noteName}
                  </span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {activeInfo.description}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8c8273] font-bold mb-2">
                    🌟 대표 유명인
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeInfo.celebrities.map((celeb) => (
                      <span
                        key={celeb}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/10 font-medium"
                      >
                        {celeb}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center space-y-3 py-8">
                <HelpCircle className="w-10 h-10 text-[#8c8273] mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-gray-300">배치된 MBTI 향 카드를 터치해 보세요</h4>
                <p className="text-xs text-[#8c8273] leading-relaxed max-w-xs mx-auto">
                  조원들과 시향지로 MBTI 향을 맡아본 후 불린 칸을 터치하면 상세 향 설명과 유명인 매칭 정보를 확인하실 수 있습니다.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#8c8273]">
              <span>팀원들과 불린 향을 맞혀보세요</span>
              <span className="text-[#f27d26] font-bold">{bingoCount}/4 빙고</span>
            </div>
          </div>
        </div>
      </div>

      {/* MBTI Selection Modal for Empty Cell */}
      {pickerCellId !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fdfbf7] rounded-3xl max-w-lg w-full border border-[#e5e0d8] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e5e0d8] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#5a5a40]">
                  빙고판 {pickerCellId + 1}번 칸에 배치할 MBTI 선택
                </h3>
                <p className="text-xs text-[#8c8273]">16가지 MBTI 향 중 하나를 선택하세요.</p>
              </div>
              <button
                onClick={() => setPickerCellId(null)}
                className="w-7 h-7 rounded-full bg-[#f5f2ed] border border-[#e5e0d8] flex items-center justify-center text-[#5a5a40] hover:bg-[#5a5a40] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MBTI_FRAGRANCE_LIST.map((item) => {
                const isUsed = usedMBTIs.includes(item.mbti);
                return (
                  <button
                    key={item.mbti}
                    onClick={() => handleAssignMBTI(pickerCellId, item.mbti)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isUsed
                        ? 'bg-[#f5f2ed] text-[#8c8273] border-[#e5e0d8] hover:border-[#5a5a40]'
                        : 'bg-white text-[#2d2a26] border-[#e5e0d8] hover:border-[#f27d26] hover:bg-[#fdfbf7] shadow-sm'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-xs font-black font-mono">{item.mbti}</span>
                    <span className="text-[9px] text-[#8c8273] truncate max-w-[80px]">
                      {item.noteName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPickerCellId(null)}
                className="px-4 py-2 bg-[#f5f2ed] text-[#5a5a40] rounded-xl text-xs font-bold"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
