import { Graph } from '../types/graph'
import { dijkstra } from '../algorithms/dijkstra'
import { bellmanFord } from '../algorithms/bellmanFord'
import { aStar } from '../algorithms/astar'
import { bidirectionalDijkstra } from '../algorithms/bidirectionalDijkstra'
import { generateRandomGraph } from '../utils/graphUtils'
import { Download, Upload, RotateCcw } from 'lucide-react'
import ScanGridButton from './ScanGridButton'

interface ControlPanelProps {
  graph: Graph
  setGraph: (graph: Graph) => void
  selectedAlgorithm: string
  setSelectedAlgorithm: (algorithm: string) => void
  sourceNode: number
  setSourceNode: (node: number) => void
  setResults: (results: any) => void
}

export default function ControlPanel({
  graph,
  setGraph,
  selectedAlgorithm,
  setSelectedAlgorithm,
  sourceNode,
  setSourceNode,
  setResults,
}: ControlPanelProps) {
  const runAlgorithm = () => {
    let result
    switch (selectedAlgorithm) {
      case 'dijkstra':
        result = dijkstra(graph, sourceNode)
        break
      case 'bellman-ford':
        result = bellmanFord(graph, sourceNode)
        break
      case 'astar':
        result = aStar(graph, sourceNode, null, 'euclidean')
        break
      case 'bidirectional':
        const target = graph.nodes.find((n) => n.id !== sourceNode)?.id || 1
        result = bidirectionalDijkstra(graph, sourceNode, target)
        break
      default:
        result = dijkstra(graph, sourceNode)
    }
    setResults(result)
  }

  const generateGraph = () => {
    const newGraph = generateRandomGraph(
      Math.floor(Math.random() * 8) + 5,
      0.4,
      [1, 15]
    )
    setGraph(newGraph)
    setResults(null)
  }

  const resetGraph = () => {
    const resetNodes = graph.nodes.map((node) => ({ ...node, status: 'active' as const }))
    const resetEdges = graph.edges.map((edge) => ({ ...edge, status: 'active' as const }))
    setGraph({ nodes: resetNodes, edges: resetEdges })
    setResults(null)
  }

  const exportGraph = () => {
    const data = JSON.stringify(graph, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'graph.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedGraph = JSON.parse(e.target?.result as string)
          setGraph(importedGraph)
          setResults(null)
        } catch (error) {
          console.error('Failed to import graph:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const addEdge = () => {
    if (graph.nodes.length < 2) return
    const source = Math.floor(Math.random() * graph.nodes.length)
    let target = Math.floor(Math.random() * graph.nodes.length)
    while (target === source) {
      target = Math.floor(Math.random() * graph.nodes.length)
    }
    const weight = Math.floor(Math.random() * 10) + 1
    
    // Check if edge already exists
    const exists = graph.edges.some(
      (e) =>
        (e.source === source && e.target === target) ||
        (e.source === target && e.target === source)
    )
    
    if (!exists) {
      setGraph({
        ...graph,
        edges: [...graph.edges, { source, target, weight }],
      })
    }
  }

  const removeNode = () => {
    if (graph.nodes.length <= 2) return
    const nodeId = graph.nodes[graph.nodes.length - 1].id
    const newNodes = graph.nodes.filter((n) => n.id !== nodeId)
    const newEdges = graph.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    )
    setGraph({ nodes: newNodes, edges: newEdges })
    setResults(null)
  }

  return (
    <div className="w-80 glass-panel rounded-xl p-5 overflow-auto card-hover slide-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
          <span className="text-xl">⚡</span>
        </div>
        <h2 className="text-xl font-bold gold-gradient-text">Controls</h2>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <span className="text-yellow-400">🎯</span> Algorithm
        </label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          className="w-full input-gold rounded-lg px-4 py-3 text-sm"
        >
          <option value="dijkstra">Dijkstra (Binary Heap)</option>
          <option value="bellman-ford">Bellman-Ford</option>
          <option value="astar">A* (Euclidean)</option>
          <option value="bidirectional">Bidirectional Dijkstra</option>
        </select>
      </div>

      {/* Source Node Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <span className="text-yellow-400">📍</span> Source Node
        </label>
        <select
          value={sourceNode}
          onChange={(e) => setSourceNode(Number(e.target.value))}
          className="w-full input-gold rounded-lg px-4 py-3 text-sm"
        >
          {graph.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label} (ID: {node.id})
            </option>
          ))}
        </select>
      </div>

      {/* Run Button */}
      <div className="mb-6">
        <ScanGridButton
          label="RUN ALGORITHM"
          addIcon={true}
          icon={{
            type: "symbol",
            symbol: "▶",
            size: 24,
            color: "#FFD700",
            hoverColor: "#FFA500",
            side: "left",
            padding: 8,
          }}
          colors={{
            fill: "rgba(0, 0, 0, 0.6)",
            hoverFill: "rgba(0, 0, 0, 0.8)",
            textColor: "#FFD700",
            hoverTextColor: "#FFA500",
          }}
          scan={{
            color: "#FFD700",
            speed: 60,
          }}
          border={{
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "rgba(255, 215, 0, 0.5)",
          }}
          rounded={8}
          padding="16px 24px"
          font={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "1px",
          }}
          glitchIntensity={2}
          onClick={runAlgorithm}
          style={{ width: "100%" }}
        />
      </div>

      {/* Graph Operations */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <span className="text-yellow-400">🔧</span> Graph Operations
        </h3>
        <div className="space-y-2">
          <button
            onClick={generateGraph}
            className="w-full input-gold hover:bg-black/70 text-white text-sm py-2.5 px-4 rounded-lg transition-all flex items-center gap-2"
          >
            <span>🎲</span> Generate Random Graph
          </button>
          <button
            onClick={addEdge}
            className="w-full input-gold hover:bg-black/70 text-white text-sm py-2.5 px-4 rounded-lg transition-all flex items-center gap-2"
          >
            <span>➕</span> Add Random Edge
          </button>
          <button
            onClick={removeNode}
            className="w-full input-gold hover:bg-black/70 text-white text-sm py-2.5 px-4 rounded-lg transition-all flex items-center gap-2"
          >
            <span>➖</span> Remove Last Node
          </button>
          <button
            onClick={resetGraph}
            className="w-full input-gold hover:bg-black/70 text-white text-sm py-2.5 px-4 rounded-lg transition-all flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Reset Failures
          </button>
        </div>
      </div>

      {/* Import/Export */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <span className="text-yellow-400">💾</span> Import / Export
        </h3>
        <div className="space-y-2">
          <button
            onClick={exportGraph}
            className="w-full input-gold hover:bg-black/70 text-white text-sm py-2.5 px-4 rounded-lg transition-all flex items-center gap-2"
          >
            <Download size={14} />
            Export JSON
          </button>
          <label className="w-full input-gold hover:bg-black/70 text-white text-sm py-2.5 px-4 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
            <Upload size={14} />
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={importGraph}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Graph Stats */}
      <div className="glass-panel rounded-xl p-4 gold-border-gradient">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <span className="text-yellow-400">📊</span> Graph Stats
        </h3>
        <div className="text-sm text-gray-200 space-y-2">
          <div className="flex justify-between items-center p-2 bg-black/30 rounded-lg">
            <span className="flex items-center gap-2">
              <span className="text-yellow-400">🔵</span> Nodes
            </span>
            <span className="font-bold text-yellow-400 text-lg">{graph.nodes.length}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-black/30 rounded-lg">
            <span className="flex items-center gap-2">
              <span className="text-yellow-400">🔗</span> Edges
            </span>
            <span className="font-bold text-yellow-400 text-lg">{graph.edges.length}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-black/30 rounded-lg">
            <span className="flex items-center gap-2">
              <span className="text-red-400">❌</span> Failed Edges
            </span>
            <span className="font-bold text-red-400 text-lg">
              {graph.edges.filter((e) => e.status === 'failed').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
