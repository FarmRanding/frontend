export interface Keyword {
  id: string;
  label: string;
}

// 브랜드 이미지 키워드 (1단계) - 확장
export const BRAND_IMAGE_KEYWORDS: Keyword[] = [
  { id: 'premium', label: '프리미엄' },
  { id: 'reasonable', label: '합리적인' },
  { id: 'trustworthy', label: '믿을 수 있는' },
  { id: 'value-for-money', label: '가성비 좋은' },
  { id: 'traditional', label: '전통 있는' },
  { id: 'refined', label: '세련된' },
  { id: 'comfortable', label: '편안한' },
  { id: 'honest', label: '정직한' },
  { id: 'professional', label: '전문적인' },
  { id: 'practical', label: '실속 있는' },
  { id: 'minimal', label: '미니멀한' },
  { id: 'smart-farm', label: '스마트팜' },
  { id: 'energetic', label: '활력 있는' },
  { id: 'naive', label: '소박한' },
  { id: 'unique', label: '개성 있는' },
  { id: 'clean', label: '깔끔한' },
  { id: 'cute', label: '귀여운' },
  { id: 'eco-friendly', label: '친환경적인' },
  { id: 'local-specialty', label: '지역 특산' },
  { id: 'healthy', label: '건강한' },
  { id: 'future-oriented', label: '미래지향적인' },
  { id: 'large-scale', label: '규모가 큰' },
  { id: 'direct-trade', label: '직거래 중심' },
  { id: 'small-batch', label: '소량생산' },
  { id: 'sustainable', label: '지속가능한' },
  { id: 'innovative', label: '혁신적인' },
  { id: 'young-farmer', label: '청년농부' },
  { id: 'children', label: '아이들을 위한' },
];

// 작물 매력 키워드 (2단계) - 확장
export const CROP_APPEAL_KEYWORDS: Keyword[] = [
  { id: 'high-sugar', label: '고당도' },
  { id: 'full-flesh', label: '과육 가득' },
  { id: 'organic', label: '유기농' },
  { id: 'antioxidant', label: '항산화' },
  { id: 'soft', label: '부드러운' },
  { id: 'good-texture', label: '식감 좋은' },
  { id: 'crispy', label: '아삭한' },
  { id: 'moist', label: '촉촉한' },
  { id: 'balanced-acidity', label: '산미 조화' },
  { id: 'fragrant', label: '향긋한' },
  { id: 'deep-color', label: '색이 진한' },
  { id: 'fresh', label: '신선한' },
  { id: 'uniform-size', label: '크기 균일' },
  { id: 'easy-storage', label: '보관 용이' },
  { id: 'eat-with-peel', label: '껍질째 먹는' },
  { id: 'water-rich', label: '수분 풍부' },
  { id: 'digestible', label: '소화 잘 되는' },
  { id: 'vitamin-rich', label: '비타민 풍부' },
  { id: 'easy-prep', label: '손질 간편' },
  { id: 'pesticide-free', label: '무농약' },
  { id: 'farm-direct', label: '산지 직송' },
  { id: 'juicy', label: '즙이 많은' },
  { id: 'spicy', label: '매콤한' },
  { id: 'sour', label: '새콤한' },
  { id: 'savory', label: '고소한' },
  { id: 'nutritious', label: '영양가 높은' },
  { id: 'diet', label: '다이어트' },
  { id: 'fiber-rich', label: '식이섬유 풍부' },
  { id: 'mineral-rich', label: '미네랄 풍부' },
  { id: 'seasonal', label: '제철' },
  { id: 'premium-quality', label: '프리미엄 품질' },
];

// 로고 이미지 키워드 (3단계) - 확장
export const LOGO_IMAGE_KEYWORDS: Keyword[] = [
  { id: 'illustration', label: '일러스트' },
  { id: 'simple', label: '심플한' },
  { id: 'warm', label: '따뜻한' },
  { id: 'modern', label: '모던한' },
  { id: 'cute', label: '귀여운' },
  { id: 'vintage', label: '빈티지' },
  { id: 'traditional', label: '전통적' },
  { id: 'emotional', label: '감성적인' },
  { id: 'character', label: '캐릭터형' },
  { id: 'colorful', label: '컬러풀' },
  { id: 'black-white', label: '어두운' },
  { id: 'realistic', label: '실사화' },
  { id: 'minimalist', label: '미니멀' },
  { id: 'hand-drawn', label: '손그림' },
  { id: 'natural', label: '자연스러운' },
];

// 통합 키워드 매핑 함수 - 모든 키워드를 하나의 맵으로 관리
export const ALL_KEYWORDS_MAP = new Map<string, string>();

// 모든 키워드를 맵에 추가
[...BRAND_IMAGE_KEYWORDS, ...CROP_APPEAL_KEYWORDS, ...LOGO_IMAGE_KEYWORDS].forEach(keyword => {
  ALL_KEYWORDS_MAP.set(keyword.id, keyword.label);
});

// 키워드 ID를 한글 라벨로 변환하는 함수
export const getKeywordLabel = (keywordId: string): string => {
  const label = ALL_KEYWORDS_MAP.get(keywordId);
  if (label) {
    return label;
  }
  
  // 알 수 없는 키워드인 경우 로그 출력하고 원본 반환 (개발 시 누락된 키워드 확인용)
  console.warn(`알 수 없는 키워드 ID: ${keywordId}`);
  return keywordId;
}; 