import { useToastStore } from './Toast'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

const toastIcons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
}

const toastStyles = {
  success: 'border-green-500/30 bg-green-900/20',
  error: 'border-red-500/30 bg-red-900/20',
  info: 'border-blue-500/30 bg-blue-900/20',
  warning: 'border-yellow-500/30 bg-yellow-900/20',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const { clearToasts } = useToastStore.getState()
        clearToasts()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg animate-fade-in ${toastStyles[toast.type]}`}
          role="alert"
          aria-live="polite"
        >
          {toastIcons[toast.type]}
          <span className="text-sm text-gray-200">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}