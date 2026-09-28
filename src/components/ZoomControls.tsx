import { ZoomIn, ZoomOut, Maximize2, Home } from 'lucide-react'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomFit: () => void
  onReset: () => void
  zoom: number
}

export default function ZoomControls({ onZoomIn, onZoomOut, onZoomFit, onReset, zoom }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
      <button
        onClick={onZoomIn}
        className="glass-panel p-2 rounded-lg hover:bg-black/30 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5 text-yellow-400" />
      </button>
      <button
        onClick={onZoomOut}
        className="glass-panel p-2 rounded-lg hover:bg-black/30 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5 text-yellow-400" />
      </button>
      <button
        onClick={onZoomFit}
        className="glass-panel p-2 rounded-lg hover:bg-black/30 transition-colors"
        title="Zoom to Fit"
      >
        <Maximize2 className="w-5 h-5 text-yellow-400" />
      </button>
      <button
        onClick={onReset}
        className="glass-panel p-2 rounded-lg hover:bg-black/30 transition-colors"
        title="Reset View"
      >
        <Home className="w-5 h-5 text-yellow-400" />
      </button>
      <div className="glass-panel px-2 py-1 rounded-lg text-xs text-yellow-400 text-center">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}