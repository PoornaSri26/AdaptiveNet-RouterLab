import { AlgorithmResult } from '../types/graph'

interface AlgorithmPanelProps {
  results: AlgorithmResult | null
  algorithm: string
}

export default function AlgorithmPanel({ results, algorithm }: AlgorithmPanelProps) {
  if (!results) {
    return (
      <div className="glass-panel rounded-xl p-5 fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
            <span className="text-xl">📈</span>
          </div>
          <h3 className="text-xl font-bold gold-gradient-text">Algorithm Results</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🚀</div>
          <p className="text-gray-400">Run an algorithm to see results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-xl p-5 overflow-auto fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
            <span className="text-xl">📈</span>
          </div>
          <h3 className="text-xl font-bold gold-gradient-text">Algorithm Results</h3>
        </div>
        <div className="glass-panel px-3 py-2 rounded-lg text-sm">
          <span className="text-yellow-400 font-semibold">{results.algorithm}</span>
          <span className="text-gray-400 ml-2">
            ⏱️ {results.executionTime.toFixed(2)}ms
          </span>
        </div>
      </div>

      {results.hasNegativeCycle && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 mb-4 animate-pulse-gold">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span> Negative cycle detected!
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-yellow-400">🛤️</span> Shortest Paths
          </h4>
          <div className="space-y-2 max-h-32 overflow-auto">
            {results.paths.map((path) => (
              <div key={path.destination} className="p-2 bg-black/30 rounded-lg text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">Node {path.destination}</span>
                  <span className="text-yellow-400 font-bold">{path.distance}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {path.path.join(' → ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-yellow-400">📊</span> Distance Array
          </h4>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {results.distances.map((dist, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-center border transition-all ${
                  dist === Infinity
                    ? 'bg-black/30 border-yellow-600/20 text-gray-500'
                    : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400 gold-glow'
                }`}
              >
                <div className="font-bold text-gray-300 mb-1">{i}</div>
                <div className="font-semibold">{dist === Infinity ? '∞' : dist}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
