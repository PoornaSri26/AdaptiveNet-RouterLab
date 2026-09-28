import { Graph } from '../types/graph'

export const graphPresets = {
  grid: (size: number = 4): Graph => {
    const nodes = []
    const edges = []
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const id = i * size + j
        nodes.push({
          id,
          label: String.fromCharCode(65 + id),
          x: 150 + j * 120,
          y: 100 + i * 100,
        })
      }
    }
    
    // Add edges (horizontal and vertical)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const id = i * size + j
        
        // Horizontal edge
        if (j < size - 1) {
          edges.push({
            source: id,
            target: id + 1,
            weight: Math.floor(Math.random() * 5) + 1,
          })
        }
        
        // Vertical edge
        if (i < size - 1) {
          edges.push({
            source: id,
            target: id + size,
            weight: Math.floor(Math.random() * 5) + 1,
          })
        }
      }
    }
    
    return { nodes, edges }
  },
  
  smallWorld: (n: number = 10, k: number = 4, p: number = 0.1): Graph => {
    const nodes = Array.from({ length: n }, (_, i) => ({
      id: i,
      label: String.fromCharCode(65 + i),
      x: 100 + (i % 5) * 150,
      y: 100 + Math.floor(i / 5) * 120,
    }))
    
    const edges = []
    
    // Create ring structure
    for (let i = 0; i < n; i++) {
      for (let j = 1; j <= k / 2; j++) {
        const target = (i + j) % n
        edges.push({
          source: i,
          target,
          weight: Math.floor(Math.random() * 5) + 1,
        })
      }
    }
    
    // Add random shortcuts
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.random() < p) {
          edges.push({
            source: i,
            target: j,
            weight: Math.floor(Math.random() * 5) + 1,
          })
        }
      }
    }
    
    return { nodes, edges }
  },
  
  scaleFree: (n: number = 10, m: number = 2): Graph => {
    const nodes: any[] = [
      { id: 0, label: 'A', x: 400, y: 300 }
    ]
    
    const edges: any[] = []
    
    for (let i = 1; i < n; i++) {
      // Preferential attachment
      const targets: number[] = []
      const totalDegree = edges.length * 2
      
      for (let j = 0; j < nodes.length; j++) {
        const degree = edges.filter((e: any) => e.source === j || e.target === j).length
        const probability = (degree + 1) / (totalDegree + nodes.length)
        if (Math.random() < probability) {
          targets.push(j)
        }
      }
      
      // Connect to m nodes
      const actualTargets = targets.slice(0, m)
      if (actualTargets.length === 0) {
        actualTargets.push(0) // Connect to first node if no targets
      }
      
      const angle = (i / n) * 2 * Math.PI
      const radius = 150 + Math.random() * 100
      nodes.push({
        id: i,
        label: String.fromCharCode(65 + i),
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
      })
      
      actualTargets.forEach(target => {
        edges.push({
          source: i,
          target,
          weight: Math.floor(Math.random() * 5) + 1,
        })
      })
    }
    
    return { nodes, edges }
  },
  
  tree: (depth: number = 3, branching: number = 3): Graph => {
    const nodes: any[] = []
    const edges: any[] = []
    let id = 0
    
    const addNode = (parentId: number | null, level: number, angle: number, radius: number) => {
      const nodeId = id++
      const x = 400 + Math.cos(angle) * radius
      const y = 100 + level * 100
      
      nodes.push({
        id: nodeId,
        label: String.fromCharCode(65 + nodeId),
        x,
        y,
      })
      
      if (parentId !== null) {
        edges.push({
          source: parentId,
          target: nodeId,
          weight: Math.floor(Math.random() * 5) + 1,
        })
      }
      
      if (level < depth) {
        const childRadius = radius * 0.7
        const spread = (Math.PI * 2) / branching
        for (let i = 0; i < branching; i++) {
          const childAngle = angle - spread/2 + (i * spread) + (Math.random() - 0.5) * 0.2
          addNode(nodeId, level + 1, childAngle, childRadius)
        }
      }
    }
    
    addNode(null, 0, 0, 200)
    
    return { nodes, edges }
  },
  
  complete: (n: number = 5): Graph => {
    const nodes = Array.from({ length: n }, (_, i) => ({
      id: i,
      label: String.fromCharCode(65 + i),
      x: 100 + (i % 3) * 200,
      y: 100 + Math.floor(i / 3) * 150,
    }))
    
    const edges: any[] = []
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        edges.push({
          source: i,
          target: j,
          weight: Math.floor(Math.random() * 5) + 1,
        })
      }
    }
    
    return { nodes, edges }
  },
}