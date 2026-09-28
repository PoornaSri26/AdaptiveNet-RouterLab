import { useToastStore } from '../components/Toast'

export const toast = {
  success: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'success', message, duration })
  },
  error: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'error', message, duration })
  },
  info: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'info', message, duration })
  },
  warning: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'warning', message, duration })
  },
}