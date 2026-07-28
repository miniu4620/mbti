import React, { useState } from 'react';
import { SavedRecipeCard, GuestbookEntry, MBTI } from '../types';
import { X, BookOpen, Heart, MessageSquare, Send, Sparkles } from 'lucide-react';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCards: SavedRecipeCard[];
  guestbookEntries: GuestbookEntry[];
  onAddEntry: (entry: GuestbookEntry) => void;
}

export const GuestbookModal: React.FC<GuestbookModalProps> = ({
  isOpen,
  onClose,
  savedCards,
  guestbookEntries,
  onAddEntry,
}) => {
  const [activeTab, setActiveTab] = useState<'guestbook' | 'vault'>('guestbook');
  const [userName, setUserName] = useState<string>('');
  const [userMBTI, setUserMBTI] = useState<MBTI>('ENFP');
  const [message, setMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmitGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: userName || '익명 수강생',
      mbti: userMBTI,
      message,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      teamId: 3,
    };

    onAddEntry(newEntry);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e0d8] shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e5e0d8] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#f27d26]" />
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#5a5a40]">
              디지털 방명록 📝
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f2ed] border border-[#e5e0d8] flex items-center justify-center text-[#5a5a40]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-[#e5e0d8] pb-2">
          <button
            onClick={() => setActiveTab('guestbook')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guestbook'
                ? 'bg-[#5a5a40] text-white'
                : 'text-[#6e685e] hover:bg-[#f5f2ed]'
            }`}
          >
            수업 소감 방명록 ({guestbookEntries.length})
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vault'
                ? 'bg-[#5a5a40] text-white'
                : 'text-[#6e685e] hover:bg-[#f5f2ed]'
            }`}
          >
            저장된 레시피 보관함 ({savedCards.length})
          </button>
        </div>

        {/* Tab 1: Recipe Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            {savedCards.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <BookOpen className="w-10 h-10 text-[#8c8273] mx-auto opacity-50" />
                <p className="text-sm font-bold text-[#2d2a26]">저장된 레시피 카드가 없습니다.</p>
                <p className="text-xs text-[#8c8273]">
                  5단계 [30ml 환산 & 라벨]에서 만들어진 나만의 향수 카드를 저장해 보세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-[#1a1a1a] text-white p-5 rounded-3xl border border-[#333] shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start border-b border-[#333] pb-2">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-[#8c8273]">
                            {card.creatorName} ({card.userMBTI})
                          </p>
                          <h4 className="text-lg font-serif italic text-[#f27d26] font-bold">
                            &quot;{card.perfumeTitle}&quot;
                          </h4>
                        </div>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-[#8c8273]">
                          {card.chosenType}타입
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        {card.threeLineStory.map((s, idx) => (
                          <p key={idx} className="text-xs text-gray-300 italic">
                            • {s}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#333] flex items-center justify-between">
                      <span className="text-[10px] text-[#f27d26] font-bold">MINIU WORKSHOP</span>

                      <div className="text-right text-[10px] text-[#8c8273]">
                        <p>{card.createdAt}</p>
                        <p className="text-white font-bold">{card.teamId}조 아틀리에</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Guestbook */}
        {activeTab === 'guestbook' && (
          <div className="space-y-6">
            {/* Form */}
            <form
              onSubmit={handleSubmitGuestbook}
              className="bg-white p-4 rounded-2xl border border-[#e5e0d8] space-y-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="이름/닉네임"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl focus:outline-none"
                />
                <select
                  value={userMBTI}
                  onChange={(e) => setUserMBTI(e.target.value as MBTI)}
                  className="px-3 py-1.5 text-xs bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl focus:outline-none font-bold text-[#5a5a40]"
                >
                  {['ENFP', 'ISTJ', 'INTJ', 'INTP', 'ISFP', 'INFJ'].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="오늘 조향 클래스 소감 한마디를 남겨주세요..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f27d26] text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#e06c17]"
                >
                  <Send className="w-3.5 h-3.5" /> 등록
                </button>
              </div>
            </form>

            {/* List */}
            <div className="space-y-3">
              {guestbookEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-4 rounded-2xl border border-[#e5e0d8] flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#5a5a40]">{entry.name}</span>
                      <span className="text-[10px] bg-[#f5f2ed] text-[#8c8273] px-2 py-0.5 rounded-full font-mono">
                        {entry.mbti}
                      </span>
                      <span className="text-[10px] text-[#8c8273]">{entry.createdAt}</span>
                    </div>
                    <p className="text-xs text-[#2d2a26] leading-relaxed">&quot;{entry.message}&quot;</p>
                  </div>

                  <span className="text-[10px] text-[#8c8273] bg-[#f5f2ed] px-2 py-1 rounded-lg">
                    {entry.teamId}조
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
