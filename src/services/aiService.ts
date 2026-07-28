import { MBTI, PersonaDiagnosisResult, TeamChemistryResult, AIPerfumeAnalysis } from '../types';
import { MBTI_MAP, DESIRED_IMAGE_DESCRIPTIONS, MBTI_NOTE_TRAITS } from '../data/mbtiData';

export function generateDynamicPersonaAdvice(
  realMBTI: MBTI,
  desiredImage: string,
  selectedMBTIs: MBTI[]
): PersonaDiagnosisResult {
  const imageDesc = DESIRED_IMAGE_DESCRIPTIONS[desiredImage] || `'${desiredImage}'의 특별한 매력`;
  const scentTraits = selectedMBTIs.map((m) => MBTI_NOTE_TRAITS[m] || `${m}의 감성 노트`).join(', ');

  const title = `'${desiredImage.replace('#', '')}'를 품은 ${realMBTI}의 향기 페르소나`;
  const aiAdvice = `실제 MBTI는 ${realMBTI}이지만, 오늘 당신이 이끌린 향은 ${selectedMBTIs.join(
    ', '
  )}의 특별한 선율이네요! '${desiredImage}' 표현에 담긴 ${imageDesc}와 함께, ${scentTraits}이 자연스럽게 어우러져 당신만의 차별화된 매력과 깊은 안식처를 완성합니다.`;

  const recommendedNotes = selectedMBTIs.map((m) => {
    const info = MBTI_MAP.get(m);
    return info ? `${info.mbti} (${info.noteName})` : `${m} 노트`;
  });

  return {
    realMBTI,
    desiredImage,
    title,
    complementaryRatioText: `선호 이미지 [${desiredImage}] x 끌린 향 [${selectedMBTIs.join(', ')}] 조화`,
    recommendedNotes,
    dropsRecommendation: {},
    aiAdvice,
  };
}

export async function fetchPersonaDiagnosis(
  realMBTI: MBTI,
  desiredImage: string,
  selectedMBTIs: MBTI[]
): Promise<PersonaDiagnosisResult> {
  try {
    const res = await fetch('/api/ai/diagnose-persona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ realMBTI, desiredImage, selectedMBTIs }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        realMBTI,
        desiredImage,
        title: data.title || `'${desiredImage.replace('#', '')}'를 품은 ${realMBTI}의 향기 페르소나`,
        complementaryRatioText: `선호 이미지 [${desiredImage}] x 끌린 향 [${selectedMBTIs.join(', ')}] 조화`,
        recommendedNotes: data.recommendedNotes || selectedMBTIs.map((m) => MBTI_MAP.get(m)?.noteName || m),
        dropsRecommendation: {},
        aiAdvice: data.aiAdvice || generateDynamicPersonaAdvice(realMBTI, desiredImage, selectedMBTIs).aiAdvice,
      };
    }
  } catch (err) {
    console.warn('API call error, fallback:', err);
  }

  return generateDynamicPersonaAdvice(realMBTI, desiredImage, selectedMBTIs);
}

export async function fetchTeamChemistry(
  teamId: number,
  membersMBTI: MBTI[]
): Promise<TeamChemistryResult> {
  try {
    const res = await fetch('/api/ai/team-chemistry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId, membersMBTI }),
    });

    if (res.ok) {
      const data = await res.json();
      const celebMatches = membersMBTI.map((mbti) => ({
        mbti,
        celebs: MBTI_MAP.get(mbti)?.celebrities || [],
      }));

      return {
        teamId,
        membersMBTI,
        representativeTitle: data.representativeTitle || `${teamId}조의 하모니`,
        chemistryDescription: data.chemistryDescription || '서로 다른 MBTI 향이 어우러져 매력적인 팀 향기를 완성합니다.',
        synergyNotes: data.synergyNotes || ['Dry Woody', 'Citrus', 'Fresh Green'],
        celebrityMatches: celebMatches,
      };
    }
  } catch (err) {
    console.warn('Team chem fallback:', err);
  }

  const celebMatches = membersMBTI.map((mbti) => ({
    mbti,
    celebs: MBTI_MAP.get(mbti)?.celebrities || [],
  }));

  return {
    teamId,
    membersMBTI,
    representativeTitle: `${teamId}조의 열정적인 융합 아틀리에`,
    chemistryDescription: `각기 다른 ${membersMBTI.join(
      ', '
    )} 성향이 모여 우디의 단단함과 시트러스의 창의적인 스파크가 시너지를 만드는 뛰어난 팀 케미스트리입니다!`,
    synergyNotes: membersMBTI.map((m) => MBTI_MAP.get(m)?.noteName || m),
    celebrityMatches: celebMatches,
  };
}

export async function fetchTypeBRecommendation(
  selectedMBTIs: MBTI[]
): Promise<AIPerfumeAnalysis> {
  const notes = selectedMBTIs.map((mbti) => {
    const info = MBTI_MAP.get(mbti);
    return {
      mbti,
      noteName: info?.noteName || '',
      noteCategory: info?.noteCategory || 'Middle',
    };
  });

  try {
    const res = await fetch('/api/ai/recommend-type-b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedNotes: notes }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        psychologyInsight: data.psychologyInsight || 'Top/Middle/Base 노트의 지속 시간을 극대화하도록 조율된 AI 레시피입니다.',
        harmonyScore: data.harmonyScore || 96,
        typeBRecipe: data.typeBRecipe || {},
        recommendedKeywords: ['#밸런스', '#잔향지속', '#감성레이어링'],
      };
    }
  } catch (e) {
    console.warn('Type B fallback:', e);
  }

  // Mathematical default distribution
  const recipe: Record<string, number> = {};
  const len = selectedMBTIs.length;
  let remain = 10;
  selectedMBTIs.forEach((m, idx) => {
    if (idx === len - 1) {
      recipe[m] = remain;
    } else {
      const val = Math.max(1, Math.floor(10 / len));
      recipe[m] = val;
      remain -= val;
    }
  });

  return {
    psychologyInsight: '탑노트의 은은한 첫인상부터 베이스의 깊고 편안한 잔향까지 세심히 조율한 AI 하모니 비율입니다.',
    harmonyScore: 98,
    typeBRecipe: recipe,
    recommendedKeywords: ['#감성노트', '#완벽하모니', '#안정적잔향'],
  };
}

export async function fetchGenerateLabel(
  creatorName: string,
  mbti: MBTI,
  chosenType: 'A' | 'B',
  recipe: Record<string, number>,
  keywords: string[]
): Promise<{ perfumeTitle: string; threeLineStory: string[] }> {
  try {
    const res = await fetch('/api/ai/generate-label', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorName, mbti, chosenType, recipe, keywords }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        perfumeTitle: data.perfumeTitle ? data.perfumeTitle.replace(/^Aura of\s*/i, '나만의 향수 of ') : `나만의 향수 of ${creatorName || '조향사'}`,
        threeLineStory: data.threeLineStory || [
          '오늘, 당신의 새로운 걸음을 진심으로 응원합니다',
        ],
      };
    }
  } catch (err) {
    console.warn('Label gen fallback:', err);
  }

  return {
    perfumeTitle: `Aura of ${creatorName || mbti}`,
    threeLineStory: [
      '은은한 우디의 고요함 속에 톡톡 튀는 시트러스 한 방울',
      '지친 일상 속 나를 보듬고 기분 좋은 에너지를 불어넣는 촉촉한 잔향',
      '오늘, 당신의 새로운 걸음을 진심으로 응원하는 나만의 향수',
    ],
  };
}
