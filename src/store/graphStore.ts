import { create } from 'zustand'
import { Graph } from '../types/graph'

interface GraphState {
  graph: Graph
  history: Graph[]
  historyIndex: number
  maxHistory: number
  
  // Actions
  setGraph: (graph: Graph) => void
  updateGraph: (graph: Graph) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
}

const initialState: Graph = {
  nodes: [
    { id: 0, label: 'A', x: 400, y: 100 },
    { id: 1, label: 'B', x: 200, y: 300 },
    { id: 2, label: 'C', x: 600, y: 300 },
    { id: 3, label: 'D', x: 300, y: 500 },
    { id: 4, label: 'E', x: 500, y: 500 },
  ],
  edges: [
    { source: 0, target: 1, weight: 4 },
    { source: 0, target: 2, weight: 2 },
    { source: 1, target: 2, weight: 1 },
    { source: 1, target: 3, weight: 5 },
    { source: 2, target: 4, weight: 10 },
    { source: 3, target: 4, weight: 3 },
  ],
}

export const useGraphStore = create<GraphState>((set, get) => ({
  graph: initialState,
  history: [initialState],
  historyIndex: 0,
  maxHistory: 50,

  setGraph: (graph: Graph) => {
    const state = get()
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(graph)
    
    // Limit history size
    if (newHistory.length > state.maxHistory) {
      newHistory.shift()
    }
    
    set({
      graph,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  updateGraph: (graph: Graph) => {
    const state = get()
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(graph)
    
    if (newHistory.length > state.maxHistory) {
      newHistory.shift()
    }
    
    set({
      graph,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      set({
        graph: state.history[newIndex],
        historyIndex: newIndex,
      })
    }
  },

  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      set({
        graph: state.history[newIndex],
        historyIndex: newIndex,
      })
    }
  },

  canUndo: () => {
    return get().historyIndex > 0
  },

  canRedo: () => {
    return get().historyIndex < get().history.length - 1
  },

  clearHistory: () => {
    const state = get()
    set({
      history: [state.graph],
      historyIndex: 0,
    })
  },
}))