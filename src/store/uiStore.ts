import { create } from 'zustand'

export type Theme = 'dark' | 'light'

interface UIState {
  theme: Theme
  selectedAlgorithm: string
  sourceNode: number
  targetNode: number | null
  isAlgorithmRunning: boolean
  showToasts: boolean
  
  // Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSelectedAlgorithm: (algorithm: string) => void
  setSourceNode: (node: number) => void
  setTargetNode: (node: number | null) => void
  setAlgorithmRunning: (running: boolean) => void
  setShowToasts: (show: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  selectedAlgorithm: 'dijkstra',
  sourceNode: 0,
  targetNode: null,
  isAlgorithmRunning: false,
  showToasts: true,

  setTheme: (theme: Theme) => set({ theme }),
  
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),
  
  setSelectedAlgorithm: (algorithm: string) => set({ selectedAlgorithm: algorithm }),
  
  setSourceNode: (node: number) => set({ sourceNode: node }),
  
  setTargetNode: (node: number | null) => set({ targetNode: node }),
  
  setAlgorithmRunning: (running: boolean) => set({ isAlgorithmRunning: running }),
  
  setShowToasts: (show: boolean) => set({ showToasts: show }),
}))