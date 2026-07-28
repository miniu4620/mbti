import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily or when key exists
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Persona Diagnosis API
app.post('/api/ai/diagnose-persona', async (req, res) => {
  try {
    const { realMBTI, desiredImage, selectedMBTIs } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Dynamic fallback response if GEMINI_API_KEY not configured
      return res.json({
        title: `'${(desiredImage || '').replace('#', '')}'를 품은 ${realMBTI}의 향기 페르소나`,
        aiAdvice: `실제 MBTI는 ${realMBTI}이지만, 오늘 당신이 이끌린 향은 ${selectedMBTIs?.join(', ')}의 특별한 선율이네요! '${desiredImage}' 이미지에 담긴 나만의 고유한 매력과 오늘 선택한 노트들이 감각적인 균형을 이루고 있습니다.`,
        recommendedNotes: selectedMBTIs || ['Woody', 'Musk', 'Citrus'],
      });
    }

    const prompt = `
당신은 감성적이고 전문적인 향수 조향사이자 심리 분석가입니다.
수강생 정보:
- 실제 MBTI: ${realMBTI}
- 남들에게 보여지고 싶은 이미지: ${desiredImage}
- 오늘 끌린 향들의 MBTI 조합: ${selectedMBTIs?.join(', ')}

이 수강생의 내면 심리와 오늘 고른 향들의 조화를 해석해 주세요.
반드시 수강생이 선택한 보여지고 싶은 이미지 ('${desiredImage}')와 선택한 향 MBTI (${selectedMBTIs?.join(', ')})를 조합해서 독창적이고 감성적인 해석을 써주세요.

다음 JSON 형식으로만 답변하세요:
{
  "title": "'${(desiredImage || '').replace('#', '')}'를 품은 ${realMBTI}의 향기 페르소나",
  "aiAdvice": "실제 MBTI는 ${realMBTI}이지만, 오늘 당신이 이끌린 향은 ${selectedMBTIs?.join(', ')}의 특별한 선율이네요! '${desiredImage}' 이미지에 담긴 매력과 선택한 향들의 성향을 자연스럽게 조합하여 다정하게 써낸 2-3문장의 분석",
  "recommendedNotes": ["추천 노트1", "추천 노트2", "추천 노트3"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const json = JSON.parse(response.text || '{}');
    return res.json(json);
  } catch (error) {
    console.error('Gemini error:', error);
    const { realMBTI, desiredImage, selectedMBTIs } = req.body;
    return res.json({
      title: `'${(desiredImage || '').replace('#', '')}'를 품은 ${realMBTI}의 향기 페르소나`,
      aiAdvice: `실제 MBTI는 ${realMBTI}이지만, 오늘 당신이 이끌린 향은 ${selectedMBTIs?.join(', ')}의 특별한 선율이네요! '${desiredImage}' 이미지에 담긴 나만의 결을 더해 완벽한 오감 밸런스를 완성합니다.`,
      recommendedNotes: selectedMBTIs || ['Woody', 'Musk'],
    });
  }
});

// 2. Team Chemistry API
app.post('/api/ai/team-chemistry', async (req, res) => {
  try {
    const { teamId, membersMBTI } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        representativeTitle: `${teamId}조의 시너지 하모니: 열정적인 지혜`,
        chemistryDescription: `${membersMBTI.join(', ')} 가 모인 우리 조는 서로의 부족함을 보완하며 깊은 신뢰와 활기를 동시에 발산하는 완벽한 조화입니다!`,
        synergyNotes: ['Dry Woody', 'Fresh Clean', 'Citrus Fruity'],
      });
    }

    const prompt = `
우리 조 구성원들의 MBTI는 [${membersMBTI.join(', ')}] 입니다.
조원들의 MBTI 향 노트를 바탕으로 우리 조만의 대표 향수 케미스트리를 분석해 주세요.
JSON 형식으로 답변하세요:
{
  "representativeTitle": "조 대표 향수 타이틀 (예: 시원한 정열의 혁신가들)",
  "chemistryDescription": "조원들의 MBTI 조합이 만드는 흥미롭고 유쾌하며 격려가 되는 2-3문장 조화 설명",
  "synergyNotes": ["조화로운 향 노트1", "조화로운 향 노트2", "조화로운 향 노트3"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const json = JSON.parse(response.text || '{}');
    return res.json(json);
  } catch (error) {
    return res.status(500).json({
      representativeTitle: '다재다능한 융합의 앙상블',
      chemistryDescription: '다양한 개성이 어우러져 깊고 매력적인 입체적 향기를 만들어내는 조입니다.',
      synergyNotes: ['다채로운 하모니'],
    });
  }
});

// 3. Type-B Recipe Recommendation API
app.post('/api/ai/recommend-type-b', async (req, res) => {
  try {
    const { selectedNotes } = req.body; // array of { mbti, noteName, noteCategory }
    const ai = getGeminiClient();

    if (!ai) {
      // Automatic mathematical balance if no API
      const count = selectedNotes.length;
      const recipe: Record<string, number> = {};
      let remaining = 10;
      selectedNotes.forEach((n: any, idx: number) => {
        if (idx === count - 1) {
          recipe[n.mbti] = remaining;
        } else {
          const val = Math.max(1, Math.floor(10 / count));
          recipe[n.mbti] = val;
          remaining -= val;
        }
      });
      return res.json({
        typeBRecipe: recipe,
        harmonyScore: 95,
        psychologyInsight: 'Top, Middle, Base 노트의 골고루 퍼지는 완벽한 잔향 밸런스 레시피입니다.',
      });
    }

    const prompt = `
수강생이 선택한 향수 노트 목록: ${JSON.stringify(selectedNotes)}
이 노트들의 Top / Middle / Base 균형을 고려하여 총 정확히 '10방울'이 되는 AI 추천(B타입) 비율을 만드세요.
각 MBTI별 방울 수 합계는 반드시 정확히 10이어야 합니다.
JSON 응답:
{
  "typeBRecipe": { "MBTI1": 방울수, "MBTI2": 방울수 ... },
  "harmonyScore": 98,
  "psychologyInsight": "왜 이 비율이 최상의 향기 잔향과 노트 균형을 가져다주는지 한 문장 설명"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const json = JSON.parse(response.text || '{}');
    return res.json(json);
  } catch (error) {
    return res.status(500).json({
      typeBRecipe: {},
      harmonyScore: 90,
      psychologyInsight: '노트의 발향 속도를 고려한 밸런스 추천 레시피입니다.',
    });
  }
});

// 4. Generate Digital Perfume Label API
app.post('/api/ai/generate-label', async (req, res) => {
  try {
    const { mbti, chosenType, recipe, keywords, creatorName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        perfumeTitle: `나만의 향수 of ${creatorName || '조향사'}`,
        threeLineStory: [
          '오늘, 당신의 새로운 걸음을 진심으로 응원합니다',
        ],
      });
    }

    const prompt = `
조향 정보:
- 조향사 이름: ${creatorName || '나만의 향수'}
- 수강생 MBTI: ${mbti}
- 선택 타입: ${chosenType}타입
- 10방울 레시피: ${JSON.stringify(recipe)}
- 희망 키워드: ${keywords?.join(', ')}

위 정보를 바탕으로 감성적이고 시적이면서 멋진 향수 이름(형식: "나만의 향수 of ${creatorName || '이름'}")을 만들어 주세요.
JSON 응답:
{
  "perfumeTitle": "나만의 향수 of ${creatorName || '조향사'}",
  "threeLineStory": [
    "오늘, 당신의 새로운 걸음을 진심으로 응원합니다"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const json = JSON.parse(response.text || '{}');
    return res.json(json);
  } catch (error) {
    return res.status(500).json({
      perfumeTitle: `나만의 향수 of ${req.body?.creatorName || '조향사'}`,
      threeLineStory: [
        '오늘, 당신의 새로운 걸음을 진심으로 응원합니다',
      ],
    });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
