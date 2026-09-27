import { useState } from 'react'
import GraphVisualizer from './components/GraphVisualizer'
import AlgorithmPanel from './components/AlgorithmPanel'
import ControlPanel from './components/ControlPanel'
import ParticleDrift from './components/ParticleDrift'
import ScanGridButton from './components/ScanGridButton'
import { Graph, Edge, Node } from './types/graph'

function App() {
  const [graph, setGraph] = useState<Graph>({
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
  })

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('dijkstra')
  const [sourceNode, setSourceNode] = useState<number>(0)
  const [results, setResults] = useState<any>(null)

  return (
    <div className="h-screen w-screen text-white flex flex-col relative overflow-hidden">
      <ParticleDrift 
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        density={250}
        speed={35}
        dotSize={4}
        linkDistance={180}
        hover={120}
        linkThickness={0.8}
      />
      
      <div className="relative z-10 flex flex-col h-full fade-in">
        <header className="glass-panel border-b border-yellow-600/30 p-6 gold-glow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gold-gradient-text mb-2">AdaptiveNet RouterLab</h1>
              <p className="text-base text-gray-300 font-light">Next-Generation Network Routing Simulator</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-panel px-4 py-2 rounded-lg">
                <span className="text-yellow-400 text-sm font-medium">✨ Premium Edition</span>
              </div>
              <ScanGridButton
                label="EXPLORE"
                addIcon={true}
                icon={{
                  type: "symbol",
                  symbol: "🚀",
                  size: 20,
                  color: "#FFD700",
                  hoverColor: "#FFA500",
                  side: "left",
                  padding: 6,
                }}
                colors={{
                  fill: "rgba(0, 0, 0, 0.5)",
                  hoverFill: "rgba(0, 0, 0, 0.7)",
                  textColor: "#FFD700",
                  hoverTextColor: "#FFA500",
                }}
                scan={{
                  color: "#FFD700",
                  speed: 50,
                }}
                border={{
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "rgba(255, 215, 0, 0.4)",
                }}
                rounded={6}
                padding="12px 20px"
                font={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: "0.5px",
                }}
                glitchIntensity={1}
                link="https://github.com/PoornaSri26/AdaptiveNet-RouterLab"
                newTab={true}
              />
            </div>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden p-4 gap-4">
          <ControlPanel
            graph={graph}
            setGraph={setGraph}
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
            sourceNode={sourceNode}
            setSourceNode={setSourceNode}
            setResults={setResults}
          />
          
          <div className="flex-1 flex flex-col gap-4">
            <GraphVisualizer
              graph={graph}
              setGraph={setGraph}
              results={results}
            />
            <AlgorithmPanel
              results={results}
              algorithm={selectedAlgorithm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
