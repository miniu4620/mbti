export type MBTI =
  | 'ISTJ'
  | 'ISTP'
  | 'ISFJ'
  | 'ISFP'
  | 'INTJ'
  | 'INTP'
  | 'INFJ'
  | 'INFP'
  | 'ESTJ'
  | 'ESTP'
  | 'ESFJ'
  | 'ESFP'
  | 'ENFJ'
  | 'ENFP'
  | 'ENTJ'
  | 'ENTP';

export type NoteCategory = 'Top' | 'Middle' | 'Base';

export interface MBTIInfo {
  mbti: MBTI;
  noteName: string;
  celebrities: string[];
  noteCategory: NoteCategory;
  description: string;
  color: string;
  bgLight: string;
  accentColor: string;
  emoji: string;
}

export interface BingoCell {
  id: number;
  mbti: MBTI;
  isChecked: boolean;
}

export interface PersonaDiagnosisResult {
  realMBTI: MBTI;
  desiredImage: string;
  title: string;
  complementaryRatioText: string;
  recommendedNotes: string[];
  dropsRecommendation: Record<string, number>;
  aiAdvice: string;
}

export interface TeamChemistryResult {
  teamId: number;
  membersMBTI: MBTI[];
  representativeTitle: string;
  chemistryDescription: string;
  synergyNotes: string[];
  celebrityMatches: { mbti: MBTI; celebs: string[] }[];
}

export interface AIPerfumeAnalysis {
  psychologyInsight: string;
  harmonyScore: number;
  typeBRecipe: Record<string, number>;
  recommendedKeywords: string[];
}

export interface SavedRecipeCard {
  id: string;
  createdAt: string;
  creatorName: string;
  userMBTI: MBTI;
  teamId: number;
  chosenType: 'A' | 'B';
  recipe10Drops: Record<string, number>;
  recipe30mlDrops: Record<string, number>;
  recipeGrams: Record<string, number>;
  perfumeTitle: string;
  threeLineStory: string[];
  keywords: string[];
  likesCount?: number;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  mbti: MBTI;
  message: string;
  createdAt: string;
  perfumeTitle?: string;
  teamId: number;
}
