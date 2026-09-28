
import { useAlgorithmStore } from '../store/algorithmStore'
import { BarChart2, Rocket, Clock, AlertTriangle, Route } from 'lucide-react'

export default function AlgorithmPanel() {
  const results = useAlgorithmStore((state) => state.results)
  if (!results) {
    return (
      <div className="glass-panel rounded-xl p-5 md:p-6 fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
            <BarChart2 size={20} className="text-black" />
          </div>
          <h3 className="text-xl font-bold gold-gradient-text">Algorithm Results</h3>
        </div>
        <div className="text-center py-8">
          <Rocket size={48} className="mx-auto mb-3 text-yellow-400" />
          <p className="text-gray-400 text-base">Run an algorithm to see results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-xl p-5 md:p-6 overflow-auto fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
            <BarChart2 size={20} className="text-black" />
          </div>
          <h3 className="text-xl font-bold gold-gradient-text">Algorithm Results</h3>
        </div>
        <div className="glass-panel px-3 py-2 rounded-lg text-sm">
          <span className="text-yellow-400 font-semibold">{results.algorithm}</span>
          <span className="text-gray-400 ml-2 flex items-center gap-1">
            <Clock size={12} /> {results.executionTime.toFixed(2)}ms
          </span>
        </div>
      </div>

      {results.hasNegativeCycle && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 mb-5 animate-pulse-gold">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle size={14} /> Negative cycle detected!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div className="glass-panel rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Route size={14} className="text-yellow-400" /> Shortest Paths
          </h4>
          <div className="space-y-3 max-h-32 md:max-h-40 overflow-auto">
            {results.paths.map((path) => (
              <div key={path.destination} className="p-3 bg-black/30 rounded-lg text-sm">
                <div className="flex justify-between items-center mb-2">
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
            <BarChart2 size={14} className="text-yellow-400" /> Distance Array
          </h4>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2 text-sm">
            {results.distances.map((dist, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-center border transition-all ${
                  dist === Infinity
                    ? 'bg-black/30 border-yellow-600/20 text-gray-500'
                    : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400 gold-glow'
                }`}
              >
                <div className="font-bold text-gray-300 mb-1 text-xs">{i}</div>
                <div className="font-semibold text-sm">{dist === Infinity ? '∞' : dist}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
