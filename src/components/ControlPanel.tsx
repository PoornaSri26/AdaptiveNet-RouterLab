import { dijkstra } from '../algorithms/dijkstra'
import { bellmanFord } from '../algorithms/bellmanFord'
import { aStar } from '../algorithms/astar'
import { bidirectionalDijkstra } from '../algorithms/bidirectionalDijkstra'
import { generateRandomGraph } from '../utils/graphUtils'
import { graphPresets } from '../utils/graphPresets'
import { toast } from '../utils/toast'
import { Download, Upload, RotateCcw, Search, ChevronDown, ChevronUp, Undo2, Redo2, Settings, Target, Wrench, Database, BarChart2, Circle, Link2, X, Play, Clock, AlertTriangle, Route, Sparkles, MapPin, Plus, Minus, ArrowDown, ArrowUp } from 'lucide-react'
import ScanGridButton from './ScanGridButton'
import { useState, useRef } from 'react'
import { useGraphStore } from '../store/graphStore'
import { useUIStore } from '../store/uiStore'
import { useAlgorithmStore } from '../store/algorithmStore'
import { useTheme } from '../contexts/ThemeContext'

export default function ControlPanel() {
  const { theme } = useTheme()
  const panelRef = useRef<HTMLDivElement>(null)
  const graph = useGraphStore((state) => state.graph)
  const setGraph = useGraphStore((state) => state.setGraph)
  const undo = useGraphStore((state) => state.undo)
  const redo = useGraphStore((state) => state.redo)
  const canUndo = useGraphStore((state) => state.canUndo())
  const canRedo = useGraphStore((state) => state.canRedo())
  
  const selectedAlgorithm = useUIStore((state) => state.selectedAlgorithm)
  const setSelectedAlgorithm = useUIStore((state) => state.setSelectedAlgorithm)
  const sourceNode = useUIStore((state) => state.sourceNode)
  const setSourceNode = useUIStore((state) => state.setSourceNode)
  
  const setResults = useAlgorithmStore((state) => state.setResults)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    algorithm: true,
    graph: true,
    import: true,
    stats: true,
  })

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
    toast.success(`${selectedAlgorithm} completed successfully`)
  }

  const generateGraph = () => {
    const newGraph = generateRandomGraph(
      Math.floor(Math.random() * 8) + 5,
      0.4,
      [1, 15]
    )
    setGraph(newGraph)
    setResults(null)
    toast.success('Random graph generated')
  }

  const loadPreset = (preset: keyof typeof graphPresets) => {
    const newGraph = graphPresets[preset]()
    setGraph(newGraph)
    setResults(null)
    toast.success(`${preset} graph loaded`)
  }

  const resetGraph = () => {
    const resetNodes = graph.nodes.map((node) => ({ ...node, status: 'active' as const }))
    const resetEdges = graph.edges.map((edge) => ({ ...edge, status: 'active' as const }))
    const newGraph = { nodes: resetNodes, edges: resetEdges }
    setGraph(newGraph)
    setResults(null)
    toast.info('Graph failures reset')
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
    toast.success('Graph exported successfully')
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
          toast.success('Graph imported successfully')
        } catch (error) {
          toast.error('Failed to import graph: Invalid file format')
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
    
    const exists = graph.edges.some(
      (e) =>
        (e.source === source && e.target === target) ||
        (e.source === target && e.target === source)
    )
    
    if (!exists) {
      const newGraph = {
        ...graph,
        edges: [...graph.edges, { source, target, weight }],
      }
      setGraph(newGraph)
      toast.success('Edge added')
    } else {
      toast.warning('Edge already exists')
    }
  }

  const removeNode = () => {
    if (graph.nodes.length <= 2) {
      toast.warning('Cannot remove more nodes (minimum 2 required)')
      return
    }
    const nodeId = graph.nodes[graph.nodes.length - 1].id
    const newNodes = graph.nodes.filter((n) => n.id !== nodeId)
    const newEdges = graph.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    )
    const newGraph = { nodes: newNodes, edges: newEdges }
    setGraph(newGraph)
    setResults(null)
    toast.success('Node removed')
  }

  const handleUndo = () => {
    undo()
    setResults(null)
    toast.info('Undo performed')
  }

  const handleRedo = () => {
    redo()
    setResults(null)
    toast.info('Redo performed')
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const filteredNodes = graph.nodes.filter(node => 
    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.id.toString().includes(searchQuery)
  )

  return (
    <div ref={panelRef} className="w-full glass-panel rounded-xl p-5 overflow-auto card-hover slide-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center gold-glow">
            <Settings size={20} className="text-black" />
          </div>
          <h2 className="text-xl font-bold gold-gradient-text">Controls</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="w-10 h-10 rounded-lg input-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
            title="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="w-10 h-10 rounded-lg input-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
            title="Redo"
          >
            <Redo2 size={14} />
          </button>
          <button
            onClick={() => {
              if (panelRef.current) {
                panelRef.current.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="w-10 h-10 rounded-lg input-gold transition-all flex items-center justify-center flex-shrink-0"
            title="Scroll to top"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => {
              if (panelRef.current) {
                panelRef.current.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' })
              }
            }}
            className="w-10 h-10 rounded-lg input-gold transition-all flex items-center justify-center flex-shrink-0"
            title="Scroll to bottom"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 input-gold rounded-lg pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Algorithm Section */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('algorithm')}
          className={`w-full h-11 flex items-center justify-between text-sm font-medium px-4 rounded-lg input-gold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <span className="flex items-center gap-2">
            <Target size={16} className="text-yellow-500" /> Algorithm
          </span>
          {expandedSections.algorithm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.algorithm && (
          <div className="space-y-4 animate-fade-in">
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full h-11 input-gold rounded-lg px-4 text-sm"
            >
              <option value="dijkstra">Dijkstra (Binary Heap)</option>
              <option value="bellman-ford">Bellman-Ford</option>
              <option value="astar">A* (Euclidean)</option>
              <option value="bidirectional">Bidirectional Dijkstra</option>
            </select>

            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <MapPin size={16} className="text-yellow-500" /> Source Node
              </label>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(Number(e.target.value))}
                className="w-full h-11 input-gold rounded-lg px-4 text-sm"
              >
                {filteredNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label} (ID: {node.id})
                  </option>
                ))}
              </select>
            </div>

            <ScanGridButton
              label="RUN"
              addIcon={true}
              icon={{
                type: "lucide",
                icon: "Play",
                size: 18,
                color: "#FFD700",
                hoverColor: "#FFA500",
                side: "left",
                padding: 6,
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
              padding="12px 20px"
              font={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "1px",
              }}
              glitchIntensity={2}
              onClick={runAlgorithm}
              style={{ width: "100%", height: "44px" }}
            />
          </div>
        )}
      </div>

      {/* Graph Operations Section */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('graph')}
          className={`w-full h-11 flex items-center justify-between text-sm font-medium px-4 rounded-lg input-gold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <span className="flex items-center gap-2">
            <Wrench size={16} className="text-yellow-500" /> Graph Operations
          </span>
          {expandedSections.graph ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.graph && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-4">
              <label className={`block text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Graph Presets</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => loadPreset('grid')}
                  className={`h-11 input-gold text-sm py-2 px-3 rounded-lg transition-all ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => loadPreset('smallWorld')}
                  className={`h-11 input-gold text-sm py-2 px-3 rounded-lg transition-all ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
                >
                  Small World
                </button>
                <button
                  onClick={() => loadPreset('scaleFree')}
                  className={`h-11 input-gold text-sm py-2 px-3 rounded-lg transition-all ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
                >
                  Scale Free
                </button>
                <button
                  onClick={() => loadPreset('tree')}
                  className={`h-11 input-gold text-sm py-2 px-3 rounded-lg transition-all ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
                >
                  Tree
                </button>
              </div>
            </div>

            <button
              onClick={generateGraph}
              className={`w-full h-11 input-gold text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
            >
              <Sparkles size={16} /> Generate Random Graph
            </button>
            <button
              onClick={addEdge}
              className={`w-full h-11 input-gold text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
            >
              <Plus size={16} /> Add Random Edge
            </button>
            <button
              onClick={removeNode}
              className={`w-full h-11 input-gold text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
            >
              <Minus size={16} /> Remove Last Node
            </button>
            <button
              onClick={resetGraph}
              className={`w-full h-11 input-gold text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
            >
              <RotateCcw size={16} />
              Reset Failures
            </button>
          </div>
        )}
      </div>

      {/* Import/Export Section */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('import')}
          className={`w-full h-11 flex items-center justify-between text-sm font-medium px-4 rounded-lg input-gold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <span className="flex items-center gap-2">
            <Database size={16} className="text-yellow-500" /> Import / Export
          </span>
          {expandedSections.import ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.import && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={exportGraph}
              className={`w-full h-11 input-gold text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}
            >
              <Download size={16} />
              Export JSON
            </button>
            <label className={`w-full h-11 input-gold text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${theme === 'dark' ? 'text-white hover:bg-black/70' : 'text-gray-900 hover:bg-gray-200'}`}>
              <Upload size={16} />
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={importGraph}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Graph Stats Section */}
      <div>
        <button
          onClick={() => toggleSection('stats')}
          className={`w-full h-11 flex items-center justify-between text-sm font-medium px-4 rounded-lg input-gold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <span className="flex items-center gap-2">
            <BarChart2 size={16} className="text-yellow-500" /> Graph Stats
          </span>
          {expandedSections.stats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {expandedSections.stats && (
          <div className="glass-panel rounded-xl p-5 gold-border-gradient animate-fade-in">
            <div className={`text-sm space-y-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              <div className={`flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`}>
                <span className="flex items-center gap-2">
                  <Circle size={16} className="text-yellow-500" /> Nodes
                </span>
                <span className="font-bold text-yellow-500 text-base">{graph.nodes.length}</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`}>
                <span className="flex items-center gap-2">
                  <Link2 size={16} className="text-yellow-500" /> Edges
                </span>
                <span className="font-bold text-yellow-500 text-base">{graph.edges.length}</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`}>
                <span className="flex items-center gap-2">
                  <X size={16} className="text-red-400" /> Failed Edges
                </span>
                <span className="font-bold text-red-400 text-base">
                  {graph.edges.filter((e) => e.status === 'failed').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}