import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Graph } from '../types/graph'

interface MinimapProps {
  graph: Graph
  width?: number
  height?: number
}

export default function Minimap({ 
  graph, 
  width = 150, 
  height = 100 
}: MinimapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Calculate graph bounds
    const xPadding = 20
    const yPadding = 20
    const graphWidth = Math.max(...graph.nodes.map(n => n.x)) + xPadding * 2
    const graphHeight = Math.max(...graph.nodes.map(n => n.y)) + yPadding * 2

    const scaleX = width / graphWidth
    const scaleY = height / graphHeight
    const scale = Math.min(scaleX, scaleY)

    // Draw edges
    svg.selectAll('line.minimap-edge')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('class', 'minimap-edge')
      .attr('x1', (d: any) => (graph.nodes.find(n => n.id === d.source)!.x + xPadding) * scale)
      .attr('y1', (d: any) => (graph.nodes.find(n => n.id === d.source)!.y + yPadding) * scale)
      .attr('x2', (d: any) => (graph.nodes.find(n => n.id === d.target)!.x + xPadding) * scale)
      .attr('y2', (d: any) => (graph.nodes.find(n => n.id === d.target)!.y + yPadding) * scale)
      .attr('stroke', (d: any) => d.status === 'failed' ? '#ef4444' : 'rgba(255, 215, 0, 0.3)')
      .attr('stroke-width', 1)

    // Draw nodes
    svg.selectAll('circle.minimap-node')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('class', 'minimap-node')
      .attr('cx', (d: any) => (d.x + xPadding) * scale)
      .attr('cy', (d: any) => (d.y + yPadding) * scale)
      .attr('r', 2)
      .attr('fill', (d: any) => d.status === 'failed' ? '#ef4444' : '#FFD700')

  }, [graph, width, height])

  return (
    <div className="absolute bottom-4 left-4 glass-panel rounded-lg p-2 z-20">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-black/50 rounded"
      />
    </div>
  )
}