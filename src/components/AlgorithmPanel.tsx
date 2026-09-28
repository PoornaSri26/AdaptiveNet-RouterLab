
import { useAlgorithmStore } from '../store/algorithmStore'

export default function AlgorithmPanel() {
  const results = useAlgorithmStore((state) => state.results)
  if (!results) {
    return (
      <div className="glass-panel rounded-xl p-4 md:p-5 fade-in">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
            <span className="text-lg md:text-xl">📈</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold gold-gradient-text">Algorithm Results</h3>
        </div>
        <div className="text-center py-6 md:py-8">
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">🚀</div>
          <p className="text-gray-400 text-sm md:text-base">Run an algorithm to see results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-xl p-4 md:p-5 overflow-auto fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 md:mb-4 gap-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
            <span className="text-lg md:text-xl">📈</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold gold-gradient-text">Algorithm Results</h3>
        </div>
        <div className="glass-panel px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm">
          <span className="text-yellow-400 font-semibold">{results.algorithm}</span>
          <span className="text-gray-400 ml-1 md:ml-2">
            ⏱️ {results.executionTime.toFixed(2)}ms
          </span>
        </div>
      </div>

      {results.hasNegativeCycle && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-2 md:p-3 mb-3 md:mb-4 animate-pulse-gold">
          <p className="text-red-400 text-xs md:text-sm flex items-center gap-2">
            <span>⚠️</span> Negative cycle detected!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="glass-panel rounded-xl p-3 md:p-4">
          <h4 className="text-xs md:text-sm font-medium text-gray-300 mb-2 md:mb-3 flex items-center gap-2">
            <span className="text-yellow-400">🛤️</span> Shortest Paths
          </h4>
          <div className="space-y-2 max-h-24 md:max-h-32 overflow-auto">
            {results.paths.map((path) => (
              <div key={path.destination} className="p-2 bg-black/30 rounded-lg text-xs md:text-sm">
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

        <div className="glass-panel rounded-xl p-3 md:p-4">
          <h4 className="text-xs md:text-sm font-medium text-gray-300 mb-2 md:mb-3 flex items-center gap-2">
            <span className="text-yellow-400">📊</span> Distance Array
          </h4>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-1 md:gap-2 text-xs">
            {results.distances.map((dist, i) => (
              <div
                key={i}
                className={`p-1 md:p-2 rounded-lg text-center border transition-all ${
                  dist === Infinity
                    ? 'bg-black/30 border-yellow-600/20 text-gray-500'
                    : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400 gold-glow'
                }`}
              >
                <div className="font-bold text-gray-300 mb-0.5 md:mb-1 text-xs">{i}</div>
                <div className="font-semibold text-xs">{dist === Infinity ? '∞' : dist}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
