import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import ZoomControls from './ZoomControls'
import Minimap from './Minimap'
import Tooltip from './Tooltip'
import { useGraphStore } from '../store/graphStore'
import { useAlgorithmStore } from '../store/algorithmStore'
import { Globe, Grid, Lightbulb } from 'lucide-react'

export default function GraphVisualizer() {
  const graph = useGraphStore((state) => state.graph)
  const setGraph = useGraphStore((state) => state.setGraph)
  const results = useAlgorithmStore((state) => state.results)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [draggedNode, setDraggedNode] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const [hoveredEdge, setHoveredEdge] = useState<{ source: number; target: number; weight: number } | null>(null)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [graphScale, setGraphScale] = useState(1)
  const GRID_SIZE = 20

  const snapToGridValue = useCallback((value: number) => {
    if (!snapToGrid) return value
    return Math.round(value / GRID_SIZE) * GRID_SIZE
  }, [snapToGrid])

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.3))
  }, [])

  const handleZoomFit = useCallback(() => {
    if (!svgRef.current) return
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    
    if (graph.nodes.length === 0) return
    
    const xPadding = 50
    const yPadding = 50
    const graphWidth = Math.max(...graph.nodes.map(n => n.x)) + xPadding * 2
    const graphHeight = Math.max(...graph.nodes.map(n => n.y)) + yPadding * 2
    
    const scaleX = width / graphWidth
    const scaleY = height / graphHeight
    const newZoom = Math.min(scaleX, scaleY, 1)
    
    setZoom(newZoom)
  }, [graph])

  const handleReset = useCallback(() => {
    setZoom(1)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setContainerSize({ width, height })
        setGraphScale(Math.min(width / 800, height / 600, 1))
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const scale = Math.min(containerSize.width / 800, containerSize.height / 600, 1)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Scale coordinates to fit container
    const scale = graphScale

    // Create arrow marker
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#9ca3af')

    // Create arrow marker for highlighted paths
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead-highlight')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#FFD700')

    // Get highlighted edges from results
    const highlightedEdges = new Set<string>()
    if (results) {
      for (const path of results.paths) {
        for (let i = 0; i < path.path.length - 1; i++) {
          const u = path.path[i]
          const v = path.path[i + 1]
          highlightedEdges.add(`${u}-${v}`)
          highlightedEdges.add(`${v}-${u}`)
        }
      }
    }

    // Draw edges
    svg.selectAll<SVGLineElement, any>('line')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('x1', (d: any) => graph.nodes.find((n) => n.id === d.source)!.x * scale)
      .attr('y1', (d: any) => graph.nodes.find((n) => n.id === d.source)!.y * scale)
      .attr('x2', (d: any) => graph.nodes.find((n) => n.id === d.target)!.x * scale)
      .attr('y2', (d: any) => graph.nodes.find((n) => n.id === d.target)!.y * scale)
      .attr('stroke', (d: any) => {
        if (d.status === 'failed') return '#ef4444'
        const key = `${d.source}-${d.target}`
        return highlightedEdges.has(key) ? '#FFD700' : 'rgba(255, 215, 0, 0.4)'
      })
      .attr('stroke-width', (d: any) => highlightedEdges.has(`${d.source}-${d.target}`) ? 3 : 2)
      .attr('stroke-opacity', (d: any) => highlightedEdges.has(`${d.source}-${d.target}`) ? 1 : 0.6)
      .attr('marker-end', (d: any) => highlightedEdges.has(`${d.source}-${d.target}`) ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)')
      .style('cursor', 'pointer')
      .on('mouseenter', (_event: MouseEvent, d: any) => {
        setHoveredEdge({ source: d.source, target: d.target, weight: d.weight })
      })
      .on('mouseleave', () => {
        setHoveredEdge(null)
      })
      .on('click', (_event: MouseEvent, d: any) => {
        const newEdges = graph.edges.map((edge) =>
          edge.source === d.source && edge.target === d.target
            ? { ...edge, status: (edge.status === 'failed' ? 'active' : 'failed') as 'active' | 'failed' }
            : edge
        )
        setGraph({ ...graph, edges: newEdges })
      })

    // Draw edge labels
    svg.selectAll<SVGTextElement, any>('text.edge-label')
      .data(graph.edges)
      .enter()
      .append('text')
      .attr('class', 'edge-label')
      .attr('x', (d: any) => {
        const n1 = graph.nodes.find((n) => n.id === d.source)!
        const n2 = graph.nodes.find((n) => n.id === d.target)!
        return ((n1.x + n2.x) / 2) * scale
      })
      .attr('y', (d: any) => {
        const n1 = graph.nodes.find((n) => n.id === d.source)!
        const n2 = graph.nodes.find((n) => n.id === d.target)!
        return ((n1.y + n2.y) / 2 - 10) * scale
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#9ca3af')
      .attr('font-size', `${12 * scale}px`)
      .text((d: any) => d.weight)

    // Draw nodes
    svg.selectAll<SVGCircleElement, any>('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => d.x * scale)
      .attr('cy', (d: any) => d.y * scale)
      .attr('r', 20 * scale)
      .attr('fill', (d: any) => {
        if (d.status === 'failed') return '#ef4444'
        if (selectedNode === d.id) return 'rgba(255, 215, 0, 0.3)'
        return 'rgba(0, 0, 0, 0.6)'
      })
      .attr('stroke', (d: any) => highlightedEdges.size > 0 && results?.paths.some((p) => p.path.includes(d.id)) ? '#FFD700' : 'rgba(255, 215, 0, 0.5)')
      .attr('stroke-width', (d: any) => highlightedEdges.size > 0 && results?.paths.some((p) => p.path.includes(d.id)) ? 3 : 2)
      .style('cursor', 'grab')
      .on('mousedown', (event: MouseEvent, d: any) => {
        event.stopPropagation()
        setDraggedNode(d.id)
        setSelectedNode(d.id)
      })
      .on('click', (event: MouseEvent, d: any) => {
        event.stopPropagation()
        setSelectedNode(d.id)
      })

    // Draw node labels
    svg.selectAll<SVGTextElement, any>('text.node-label')
      .data(graph.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('x', (d: any) => d.x * scale)
      .attr('y', (d: any) => (d.y + 5) * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', `${14 * scale}px`)
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text((d: any) => d.label)

    // Draw edge labels
    svg.selectAll<SVGTextElement, any>('text.edge-label')
      .data(graph.edges)
      .enter()
      .append('text')
      .attr('class', 'edge-label')
      .attr('x', (d: any) => {
        const n1 = graph.nodes.find((n) => n.id === d.source)!
        const n2 = graph.nodes.find((n) => n.id === d.target)!
        return (n1.x + n2.x) / 2
      })
      .attr('y', (d: any) => {
        const n1 = graph.nodes.find((n) => n.id === d.source)!
        const n2 = graph.nodes.find((n) => n.id === d.target)!
        return (n1.y + n2.y) / 2 - 10
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#9ca3af')
      .attr('font-size', '12px')
      .text((d: any) => d.weight)

    // Drag behavior
    svg.on('mousemove', (event: MouseEvent) => {
      if (draggedNode !== null) {
        const [x, y] = d3.pointer(event)
        const scaledX = x / scale
        const scaledY = y / scale
        const snappedX = snapToGridValue(scaledX)
        const snappedY = snapToGridValue(scaledY)
        const newNodes = graph.nodes.map((node) =>
          node.id === draggedNode ? { ...node, x: snappedX, y: snappedY } : node
        )
        setGraph({ ...graph, nodes: newNodes })
      }
    })

    svg.on('mouseup', () => {
      setDraggedNode(null)
    })

    svg.on('mouseleave', () => {
      setDraggedNode(null)
    })

    // Double click to add node
    svg.on('dblclick', (event: MouseEvent) => {
      const [x, y] = d3.pointer(event)
      const scaledX = x / scale
      const scaledY = y / scale
      const newId = Math.max(...graph.nodes.map((n) => n.id)) + 1
      const newNode = {
        id: newId,
        label: String.fromCharCode(65 + (newId % 26)) + (newId >= 26 ? Math.floor(newId / 26) : ''),
        x: snapToGridValue(scaledX),
        y: snapToGridValue(scaledY),
      }
      setGraph({ ...graph, nodes: [...graph.nodes, newNode] })
    })

    // Wheel zoom
    svg.on('wheel', (event: WheelEvent) => {
      event.preventDefault()
      const delta = event.deltaY > 0 ? 0.9 : 1.1
      setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)))
    })

  }, [graph, results, selectedNode, draggedNode, snapToGridValue, graphScale])

  return (
    <div className="flex-1 glass-panel rounded-xl p-3 md:p-4 overflow-auto card-hover fade-in relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 md:mb-4 gap-2">
        <h3 className="text-base md:text-lg font-semibold gold-gradient-text flex items-center gap-2">
          <Globe size={18} className="text-yellow-500" /> Network Graph
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`glass-panel px-2 md:px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1 ${snapToGrid ? 'text-yellow-400 border-yellow-500' : 'text-gray-400'}`}
          >
            <Grid size={12} /> {snapToGrid ? 'Grid On' : 'Grid Off'}
          </button>
          <div className="glass-panel px-2 md:px-3 py-1 rounded-full text-xs text-yellow-400 hidden md:block">
            Interactive Canvas
          </div>
        </div>
      </div>
      
      <div ref={containerRef} className="relative min-h-[350px] md:min-h-[450px]">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="bg-black/50 border border-yellow-600/30 rounded-xl backdrop-blur-md gold-glow"
        />
        
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomFit={handleZoomFit}
          onReset={handleReset}
          zoom={zoom}
        />
        
        <Minimap
          graph={graph}
        />
        
        {hoveredEdge && (
          <Tooltip content={`Edge: ${hoveredEdge.source} → ${hoveredEdge.target}, Weight: ${hoveredEdge.weight}`}>
            <div className="absolute top-0 left-0 w-0 h-0" />
          </Tooltip>
        )}
      </div>
      
      <div className="mt-3 md:mt-4 p-2 md:p-3 glass-panel rounded-lg">
        <p className="text-xs md:text-sm text-gray-300 flex items-center gap-2">
          <Lightbulb size={14} className="text-yellow-400" />
          <span className="hidden md:inline">Click node to select • Double-click to add node • Drag to move • Click edge to toggle failure • Scroll to zoom</span>
          <span className="md:hidden">Tap node to select • Double-tap to add node • Drag to move • Scroll to zoom</span>
        </p>
      </div>
    </div>
  )
}
