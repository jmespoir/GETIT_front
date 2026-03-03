import { create } from 'zustand';

// Zustand store for global app configuration
export const useAppStore = create((set) => ({
  // 전역 설정 상태
  generation: 9,
  generationText: '9기',

  // 기수를 업데이트하는 함수
  setGeneration: (generation) =>
    set({
      generation,
      generationText: `${generation}기`,
    }),
}));
