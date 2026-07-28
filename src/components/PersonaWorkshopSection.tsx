import React, { useState, useEffect } from 'react';
import { MBTI, PersonaDiagnosisResult, TeamChemistryResult } from '../types';
import { MBTI_FRAGRANCE_LIST, DESIRED_IMAGE_KEYWORDS, MBTI_MAP, SAMPLE_BALANCE_GAME_QUESTIONS } from '../data/mbtiData';
import { fetchPersonaDiagnosis, fetchTeamChemistry } from '../services/aiService';
import { Sparkles, Users, Trophy, Loader2, Heart, Star, CheckCircle2, Award, Gamepad2, ArrowLeft, ArrowRight } from 'lucide-react';

interface PersonaWorkshopSectionProps {
  userMBTI: MBTI;
  setUserMBTI: (mbti: MBTI) => void;
  teamId: number;
}

export const PersonaWorkshopSection: React.FC<PersonaWorkshopSectionProps> = ({
  userMBTI,
  setUserMBTI,
  teamId,
}) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'persona' | 'chemistry' | 'contest'>('balance');

  // Step 2-0: Balance Game State
  const [balanceIdx, setBalanceIdx] = useState<number>(0);
  const [balanceChoices, setBalanceChoices] = useState<MBTI[]>([]);

  const handleBalancePick = (mbti: MBTI) => {
    const updated = [...balanceChoices, mbti];
    setBalanceChoices(updated);
    if (balanceIdx < SAMPLE_BALANCE_GAME_QUESTIONS.length - 1) {
      setBalanceIdx((prev) => prev + 1);
    }
  };

  const handleBalancePrev = () => {
    if (balanceIdx > 0) {
      setBalanceIdx((prev) => prev - 1);
      setBalanceChoices((prev) => prev.slice(0, -1));
    }
  };

  // Step 2-1: Persona Diagnosis State
  const [desiredImage, setDesiredImage] = useState<string>(DESIRED_IMAGE_KEYWORDS[0]);
  const [selectedFragranceMBTIs, setSelectedFragranceMBTIs] = useState<MBTI[]>(['ISTJ', 'ENFP']);
  const [personaResult, setPersonaResult] = useState<PersonaDiagnosisResult | null>(null);
  const [isLoadingPersona, setIsLoadingPersona] = useState<boolean>(false);

  // Step 2-2: Team Chemistry State
  const [teamMembers, setTeamMembers] = useState<MBTI[]>(['ISTJ', 'ENFP', 'INTP', 'ISFP']);
  const [chemistryResult, setChemistryResult] = useState<TeamChemistryResult | null>(null);
  const [isLoadingChemistry, setIsLoadingChemistry] = useState<boolean>(false);

  // Step 2-3: Copywriting Contest State
  const [copyCandidates, setCopyCandidates] = useState<
    { id: number; name: string; story: string; votes: number }[]
  >([
    {
      id: 1,
      name: `${teamId}조 불꽃 시너지: 우디와 시트러스의 하모니`,
      story: 'Dry Woody의 정갈한 차분함과 Citrus Fruity의 창의적 열정이 만난 환상의 팀 케미',
      votes: 3,
    },
    {
      id: 2,
      name: '지적인 사색과 상쾌한 스파클링 융합',
      story: '서로 다른 MBTI 성향이 어우러져 깊은 신뢰와 밝은 기운을 동시에 발산하는 완벽한 조화',
      votes: 5,
    },
    {
      id: 3,
      name: '온화한 위로와 당찬 도전의 앙상블',
      story: '포근한 머스크 위에 얹어진 싱그러운 플로럴로 완성되는 우리 조 대표 시너지',
      votes: 2,
    },
  ]);
  const [votedId, setVotedId] = useState<number | null>(2);

  const handleRunPersonaDiagnosis = async () => {
    setIsLoadingPersona(true);
    const result = await fetchPersonaDiagnosis(userMBTI, desiredImage, selectedFragranceMBTIs);
    setPersonaResult(result);
    setIsLoadingPersona(false);
  };

  useEffect(() => {
    handleRunPersonaDiagnosis();
  }, [userMBTI, desiredImage, selectedFragranceMBTIs]);

  const handleRunTeamChemistry = async () => {
    setIsLoadingChemistry(true);
    const result = await fetchTeamChemistry(teamId, teamMembers);
    setChemistryResult(result);
    setIsLoadingChemistry(false);
  };

  const [newCandidateName, setNewCandidateName] = useState<string>('');
  const [newCandidateStory, setNewCandidateStory] = useState<string>('');

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim()) return;

    const newId = Date.now();
    setCopyCandidates((prev) => [
      ...prev,
      {
        id: newId,
        name: newCandidateName.trim(),
        story: newCandidateStory.trim() || '수강생 아이디어 네이밍',
        votes: 1,
      },
    ]);
    setVotedId(newId);
    setNewCandidateName('');
    setNewCandidateStory('');
  };

  const toggleFragranceMBTI = (mbti: MBTI) => {
    if (selectedFragranceMBTIs.includes(mbti)) {
      if (selectedFragranceMBTIs.length > 1) {
        setSelectedFragranceMBTIs((prev) => prev.filter((m) => m !== mbti));
      }
    } else {
      if (selectedFragranceMBTIs.length < 3) {
        setSelectedFragranceMBTIs((prev) => [...prev, mbti]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#f5f2ed] rounded-3xl p-6 border border-[#e5e0d8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#5a5a40] text-white px-2.5 py-0.5 rounded-full">
              2단계 AI 탐구 프로그램 (40분)
            </span>
            <span className="text-xs text-[#8c8273] font-medium">내면 심리 & 팀 케미스트리</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d2a26]">
            AI MBTI 페르소나 & 케미스트리 워크숍
          </h2>
          <p className="text-xs text-[#6e685e] mt-1">
            내 본래 MBTI 성향과 오늘 끌리는 향의 이상형 차이를 분석하고, 조원 간의 완벽한 향기 시너지를 탐색합니다.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-2xl border border-[#e5e0d8] shadow-sm">
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'balance'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-[#6e685e] hover:text-[#2d2a26]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#f27d26]" />
            1. MBTI 밸런스 게임
          </button>

          <button
            onClick={() => setActiveTab('persona')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'persona'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-[#6e685e] hover:text-[#2d2a26]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            2. 페르소나 진단
          </button>

          <button
            onClick={() => setActiveTab('chemistry')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'chemistry'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-[#6e685e] hover:text-[#2d2a26]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            3. 조별 케미스트리
          </button>

          <button
            onClick={() => setActiveTab('contest')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'contest'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-[#6e685e] hover:text-[#2d2a26]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            4. 조별 케미 선발전
          </button>
        </div>
      </div>

      {/* Tab 0: MBTI Balance Game */}
      {activeTab === 'balance' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e5e0d8] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#e5e0d8] pb-4 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f27d26] bg-[#f27d26]/10 px-2.5 py-1 rounded-full border border-[#f27d26]/20">
                조별 아이스브레이킹 게임
              </span>
              <h3 className="text-xl font-serif font-bold text-[#2d2a26] mt-1 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[#f27d26]" /> MBTI 향수 밸런스 게임 ⚖️
              </h3>
              <p className="text-xs text-[#8c8273]">
                조원들과 상의하며 각 문항에서 나의 직감과 마음에 더 와닿는 향의 분위기를 선택해 보세요!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#5a5a40] bg-[#f5f2ed] px-3 py-1 rounded-full">
                QUESTION {balanceIdx + 1} / {SAMPLE_BALANCE_GAME_QUESTIONS.length}
              </span>
            </div>
          </div>

          <div className="text-center space-y-2 py-2">
            <h4 className="text-lg md:text-xl font-serif font-bold text-[#2d2a26]">
              {SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].title}
            </h4>
          </div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Option A */}
            <button
              onClick={() => handleBalancePick(SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionA.mbti)}
              className="p-8 rounded-3xl bg-[#fdfbf7] border-2 border-[#e5e0d8] hover:border-[#f27d26] hover:bg-white transition-all text-center space-y-4 group shadow-sm flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-4xl block transform group-hover:scale-110 transition-transform">
                {MBTI_MAP.get(SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionA.mbti)?.emoji}
              </span>
              <div>
                <p className="text-base font-serif font-bold text-[#2d2a26] group-hover:text-[#f27d26]">
                  {SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionA.label}
                </p>
                <p className="text-xs text-[#8c8273] mt-1.5 leading-relaxed">
                  {MBTI_MAP.get(SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionA.mbti)?.description}
                </p>
              </div>
            </button>

            {/* Option B */}
            <button
              onClick={() => handleBalancePick(SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionB.mbti)}
              className="p-8 rounded-3xl bg-[#fdfbf7] border-2 border-[#e5e0d8] hover:border-[#f27d26] hover:bg-white transition-all text-center space-y-4 group shadow-sm flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-4xl block transform group-hover:scale-110 transition-transform">
                {MBTI_MAP.get(SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionB.mbti)?.emoji}
              </span>
              <div>
                <p className="text-base font-serif font-bold text-[#2d2a26] group-hover:text-[#f27d26]">
                  {SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionB.label}
                </p>
                <p className="text-xs text-[#8c8273] mt-1.5 leading-relaxed">
                  {MBTI_MAP.get(SAMPLE_BALANCE_GAME_QUESTIONS[balanceIdx].optionB.mbti)?.description}
                </p>
              </div>
            </button>
          </div>

          {/* Controls Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-[#e5e0d8] gap-3">
            <div className="flex items-center gap-3">
              {balanceIdx > 0 && (
                <button
                  onClick={handleBalancePrev}
                  className="px-4 py-2 bg-[#f5f2ed] border border-[#e5e0d8] rounded-2xl text-xs font-bold text-[#5a5a40] hover:bg-[#e5e0d8] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> 이전 문항 보기
                </button>
              )}
              <span className="text-xs text-[#8c8273]">
                선택한 MBTI: <strong className="text-[#5a5a40]">{balanceChoices.join(', ') || '없음'}</strong>
              </span>
            </div>

            <button
              onClick={() => setActiveTab('persona')}
              className="px-5 py-2.5 bg-[#5a5a40] text-white rounded-2xl text-xs font-bold hover:bg-[#4a4a35] transition-colors flex items-center gap-1.5"
            >
              다음: 페르소나 진단 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 1: Persona Diagnosis */}
      {activeTab === 'persona' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#e5e0d8] shadow-sm space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8c8273] block mb-2">
                1) 나의 실제 MBTI 선택
              </label>
              <div className="grid grid-cols-4 gap-2">
                {MBTI_FRAGRANCE_LIST.map((item) => (
                  <button
                    key={item.mbti}
                    onClick={() => setUserMBTI(item.mbti)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      userMBTI === item.mbti
                        ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow-sm'
                        : 'bg-[#fdfbf7] text-[#2d2a26] border-[#e5e0d8] hover:border-[#5a5a40]'
                    }`}
                  >
                    {item.mbti}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8c8273] block mb-2">
                2) 내가 남들에게 보여지고 싶은 이미지
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DESIRED_IMAGE_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setDesiredImage(kw)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      desiredImage === kw
                        ? 'bg-[#f27d26] text-white border-[#f27d26] font-bold shadow-sm'
                        : 'bg-[#fdfbf7] text-[#6e685e] border-[#e5e0d8] hover:border-[#f27d26]'
                    }`}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8c8273] block mb-2">
                3) 오늘 마음이 가는 향 선택 (최대 3개)
              </label>
              <div className="flex flex-wrap gap-2">
                {MBTI_FRAGRANCE_LIST.map((item) => {
                  const isSel = selectedFragranceMBTIs.includes(item.mbti);
                  return (
                    <button
                      key={item.mbti}
                      onClick={() => toggleFragranceMBTI(item.mbti)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                        isSel
                          ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                          : 'bg-[#f5f2ed] text-[#8c8273] border-[#e5e0d8]'
                      }`}
                    >
                      <span>{item.emoji}</span> {item.mbti} ({item.noteName})
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleRunPersonaDiagnosis}
              disabled={isLoadingPersona}
              className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              {isLoadingPersona ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> AI가 내면 페르소나를 진단하는 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#f27d26]" /> AI 내면 성향 & 보완 비율 진단하기
                </>
              )}
            </button>
          </div>

          {/* Diagnosis Result Card (6 cols) */}
          <div className="lg:col-span-6 bg-[#f5f2ed] rounded-3xl p-6 border border-[#e5e0d8] shadow-sm flex flex-col justify-between">
            {personaResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#e5e0d8] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#f27d26] bg-[#f27d26]/10 px-2.5 py-1 rounded-full border border-[#f27d26]/20">
                    AI PERSONA DIAGNOSIS
                  </span>
                  <span className="text-xs font-mono font-bold text-[#5a5a40]">
                    실제 {personaResult.realMBTI}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2d2a26]">
                    {personaResult.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#8c8273] mt-1">
                    {personaResult.complementaryRatioText}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#e5e0d8] space-y-2">
                  <p className="text-xs text-[#2d2a26] leading-relaxed italic">
                    &quot;{personaResult.aiAdvice}&quot;
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8c8273] tracking-wider mb-2">
                    💡 오늘 추천하는 보완 향 노트
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {personaResult.recommendedNotes.map((note) => (
                      <span
                        key={note}
                        className="text-xs bg-[#5a5a40] text-white px-3 py-1 rounded-xl font-medium shadow-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 space-y-3">
                <div className="w-16 h-16 bg-white rounded-full border border-[#e5e0d8] mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#5a5a40]" />
                </div>
                <h4 className="text-sm font-bold text-[#2d2a26]">
                  내 성격 vs 이상형 페르소나 비교
                </h4>
                <p className="text-xs text-[#8c8273] max-w-sm mx-auto leading-relaxed">
                  좌측에서 본인의 실제 MBTI와 남들에게 보여주고 싶은 이미지 키워드를 선택한 후 진단 버튼을 눌러주세요.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-[#e5e0d8] flex items-center justify-between text-[11px] text-[#8c8273]">
              <span>실제 MBTI: {userMBTI}</span>
              <span>선택 이미지: {desiredImage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Team Chemistry */}
      {activeTab === 'chemistry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#e5e0d8] shadow-sm space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8c8273] block mb-2">
                우리 조원들의 MBTI 설정 ({teamId}조)
              </label>
              <p className="text-xs text-[#8c8273] mb-3">
                조원들의 MBTI를 추가해 우리 조 대표 향수 케미스트리를 분석합니다.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {teamMembers.map((mbti, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold bg-[#5a5a40] text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    {mbti} ({MBTI_MAP.get(mbti)?.noteName})
                    <button
                      onClick={() =>
                        setTeamMembers((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-[#e5e0d8] hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {MBTI_FRAGRANCE_LIST.map((item) => (
                  <button
                    key={item.mbti}
                    onClick={() => setTeamMembers((prev) => [...prev, item.mbti])}
                    className="py-1.5 rounded-lg text-xs font-semibold bg-[#fdfbf7] border border-[#e5e0d8] hover:border-[#5a5a40]"
                  >
                    + {item.mbti}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunTeamChemistry}
              disabled={isLoadingChemistry}
              className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              {isLoadingChemistry ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 팀 케미스트리를 조합하는 중...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 text-[#f27d26]" /> 우리 조 대표 향수 케미스트리 분석하기
                </>
              )}
            </button>
          </div>

          {/* Chemistry Result Card */}
          <div className="lg:col-span-6 bg-[#f5f2ed] rounded-3xl p-6 border border-[#e5e0d8] shadow-sm flex flex-col justify-between">
            {chemistryResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#e5e0d8] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#f27d26] bg-[#f27d26]/10 px-2.5 py-1 rounded-full border border-[#f27d26]/20">
                    TEAM CHEMISTRY ANALYSIS
                  </span>
                  <span className="text-xs font-mono font-bold text-[#5a5a40]">
                    {teamId}조 팀 케미
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2d2a26]">
                    {chemistryResult.representativeTitle}
                  </h3>
                  <p className="text-xs text-[#2d2a26] mt-2 leading-relaxed bg-white p-4 rounded-2xl border border-[#e5e0d8]">
                    {chemistryResult.chemistryDescription}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8c8273] tracking-wider mb-2">
                    ✨ 우리 조 시너지 향 노트 조합
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chemistryResult.synergyNotes.map((note) => (
                      <span
                        key={note}
                        className="text-xs bg-[#5a5a40] text-white px-3 py-1 rounded-xl font-medium"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8c8273] tracking-wider mb-2">
                    🌟 조원별 유명인 매칭표
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {chemistryResult.celebrityMatches.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-[#e5e0d8] text-xs"
                      >
                        <p className="font-bold text-[#5a5a40]">{item.mbti}</p>
                        <p className="text-[11px] text-[#8c8273] truncate">
                          {item.celebs.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 space-y-3">
                <Users className="w-12 h-12 text-[#5a5a40] mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-[#2d2a26]">조원들의 MBTI 시너지 탐색</h4>
                <p className="text-xs text-[#8c8273] max-w-sm mx-auto leading-relaxed">
                  같은 조 수강생들의 MBTI를 추가하여 AI가 제시하는 &apos;우리 조 대표 향수 케미스트리&apos; 분석 결과를 확인해 보세요!
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-[#e5e0d8] flex items-center justify-between text-[11px] text-[#8c8273]">
              <span>구성원: {teamMembers.join(', ')}</span>
              <span>{teamId}조 아틀리에</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Copywriting Contest */}
      {activeTab === 'contest' && (
        <div className="bg-white rounded-3xl p-6 border border-[#e5e0d8] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e0d8] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f27d26] bg-[#f27d26]/10 px-2.5 py-1 rounded-full border border-[#f27d26]/20">
                STEP 2-4 TEAM CHEMISTRY CONTEST
              </span>
              <h3 className="text-lg font-serif font-bold text-[#2d2a26] mt-1">
                조별 케미스트리 카피라이팅 선발전 🏆
              </h3>
              <p className="text-xs text-[#8c8273]">
                우리 조의 MBTI 시너지와 대표 향수 케미스트리를 표현한 아이디어에 투표해 보세요!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5a5a40]">총 투표수:</span>
              <span className="text-sm font-mono font-bold text-[#f27d26] bg-[#f5f2ed] px-3 py-1 rounded-full border border-[#e5e0d8]">
                {copyCandidates.reduce((a, b) => a + b.votes, 0)} 표
              </span>
            </div>
          </div>

          {/* Add New Team Chemistry Idea Form */}
          <form
            onSubmit={handleAddCandidate}
            className="bg-[#f5f2ed] p-4 md:p-5 rounded-2xl border border-[#e5e0d8] space-y-3"
          >
            <h4 className="text-xs font-bold text-[#5a5a40] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#f27d26]" /> 우리 조 케미스트리 카피라이팅 제안하기
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="조 대표 카피라이팅 (예: 3조 불꽃 시너지: 우디와 시트러스의 조화)"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                className="md:col-span-5 px-3 py-2 bg-white rounded-xl border border-[#e5e0d8] text-xs focus:outline-none focus:border-[#f27d26]"
              />
              <input
                type="text"
                placeholder="팀 케미 설명 (예: 자유로운 ENFP와 차분한 INTJ가 만든 열정적인 오크우드 향)"
                value={newCandidateStory}
                onChange={(e) => setNewCandidateStory(e.target.value)}
                className="md:col-span-5 px-3 py-2 bg-white rounded-xl border border-[#e5e0d8] text-xs focus:outline-none focus:border-[#f27d26]"
              />
              <button
                type="submit"
                className="md:col-span-2 px-4 py-2 bg-[#5a5a40] text-white rounded-xl text-xs font-bold hover:bg-[#4a4a35] transition-colors"
              >
                + 등록하기
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {copyCandidates.map((candidate, idx) => {
              const isVoted = votedId === candidate.id;
              return (
                <div
                  key={candidate.id}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isVoted
                      ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow-md scale-[1.02]'
                      : 'bg-[#fdfbf7] text-[#2d2a26] border-[#e5e0d8] hover:border-[#f27d26]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isVoted ? 'bg-[#f27d26] text-white' : 'bg-[#e5e0d8] text-[#5a5a40]'
                        }`}
                      >
                        후보 #{idx + 1}
                      </span>
                      <span className="text-xs font-bold font-mono flex items-center gap-1">
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isVoted ? 'fill-white text-white' : 'text-[#f27d26]'
                          }`}
                        />
                        {candidate.votes}표
                      </span>
                    </div>

                    <h4
                      className={`text-base font-serif font-bold ${
                        isVoted ? 'text-white' : 'text-[#2d2a26]'
                      }`}
                    >
                      &quot;{candidate.name}&quot;
                    </h4>

                    <p
                      className={`text-xs leading-relaxed ${
                        isVoted ? 'text-[#e5e0d8]' : 'text-[#8c8273]'
                      }`}
                    >
                      {candidate.story}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCopyCandidates((prev) =>
                        prev.map((c) => (c.id === candidate.id ? { ...c, votes: c.votes + 1 } : c))
                      );
                      setVotedId(candidate.id);
                    }}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isVoted
                        ? 'bg-white text-[#5a5a40]'
                        : 'bg-[#f5f2ed] text-[#2d2a26] hover:bg-[#5a5a40] hover:text-white'
                    }`}
                  >
                    {isVoted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#f27d26]" /> 선택됨
                      </>
                    ) : (
                      '투표하기'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
