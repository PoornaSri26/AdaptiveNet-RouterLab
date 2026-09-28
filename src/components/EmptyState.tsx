import { Network, Plus, Upload } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-graph' | 'no-results' | 'no-algorithm'
  onAction?: () => void
  actionLabel?: string
}

export default function EmptyState({ type, onAction, actionLabel }: EmptyStateProps) {
  const states = {
    'no-graph': {
      icon: <Network className="w-16 h-16 text-yellow-400" />,
      title: 'No Graph Loaded',
      description: 'Generate a random graph or import a file to get started with network routing algorithms.',
      actionLabel: actionLabel || 'Generate Graph',
    },
    'no-results': {
      icon: <Network className="w-16 h-16 text-yellow-400" />,
      title: 'No Results Yet',
      description: 'Run an algorithm to see the shortest path calculations and visualization.',
      actionLabel: actionLabel || 'Run Algorithm',
    },
    'no-algorithm': {
      icon: <Network className="w-16 h-16 text-yellow-400" />,
      title: 'Select an Algorithm',
      description: 'Choose a routing algorithm from the control panel to analyze the network graph.',
      actionLabel: actionLabel || 'Select Algorithm',
    },
  }

  const state = states[type]

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="mb-4 gold-glow rounded-full p-4 bg-black/30">
        {state.icon}
      </div>
      <h3 className="text-xl font-semibold text-yellow-400 mb-2">{state.title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{state.description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-gold rounded-lg px-6 py-3 flex items-center gap-2"
        >
          {type === 'no-graph' && <Plus className="w-5 h-5" />}
          {type === 'no-graph' && <Upload className="w-5 h-5" />}
          {state.actionLabel}
        </button>
      )}
    </div>
  )
}