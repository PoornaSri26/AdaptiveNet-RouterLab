import { create } from 'zustand'
import { AlgorithmResult } from '../types/graph'

interface AlgorithmState {
  results: AlgorithmResult | null
  executionHistory: AlgorithmResult[]
  currentStep: number
  isPlaying: boolean
  playbackSpeed: number
  
  // Actions
  setResults: (results: AlgorithmResult | null) => void
  addToHistory: (results: AlgorithmResult) => void
  setCurrentStep: (step: number) => void
  setIsPlaying: (playing: boolean) => void
  setPlaybackSpeed: (speed: number) => void
  clearResults: () => void
  clearHistory: () => void
}

export const useAlgorithmStore = create<AlgorithmState>((set) => ({
  results: null,
  executionHistory: [],
  currentStep: 0,
  isPlaying: false,
  playbackSpeed: 1,

  setResults: (results: AlgorithmResult | null) => set({ results }),
  
  addToHistory: (results: AlgorithmResult) => set((state) => ({
    executionHistory: [...state.executionHistory, results],
  })),
  
  setCurrentStep: (step: number) => set({ currentStep: step }),
  
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  
  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),
  
  clearResults: () => set({ results: null, currentStep: 0 }),
  
  clearHistory: () => set({ executionHistory: [], currentStep: 0 }),
}))