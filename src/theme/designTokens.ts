// Design Token System for AdaptiveNet RouterLab
// Based on Tailwind CSS design principles with custom gold theme

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
} as const

export const typography = {
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '48px',
    '5xl': '64px',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const

export const borderRadius = {
  none: '0px',
  sm: '4px',
  base: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  gold: '0 0 20px rgba(212, 175, 55, 0.3)',
  'gold-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
} as const

export const colors = {
  // Primary Gold Theme
  gold: {
    50: '#FFFBE6',
    100: '#FFF8CC',
    200: '#FFE999',
    300: '#FFD666',
    400: '#FFD700',
    500: '#D4AF37',
    600: '#B8941F',
    700: '#9A7B1A',
    800: '#7C6516',
    900: '#5E4F12',
  },
  // Dark theme colors
  dark: {
    bg: '#050508',
    bgSecondary: '#0d0d1a',
    bgTertiary: '#1a1a2e',
    text: '#F5F5F5',
    textSecondary: '#9CA3AF',
    border: 'rgba(212, 175, 55, 0.3)',
  },
  // Light theme colors
  light: {
    bg: '#FFFFFF',
    bgSecondary: '#F9FAFB',
    bgTertiary: '#F3F4F6',
    text: '#111827',
    textSecondary: '#6B7280',
    border: 'rgba(212, 175, 55, 0.4)',
  },
  // Semantic colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  // Graph visualization colors
  graph: {
    node: 'rgba(0, 0, 0, 0.6)',
    nodeSelected: 'rgba(255, 215, 0, 0.3)',
    nodeFailed: '#EF4444',
    edge: 'rgba(255, 215, 0, 0.4)',
    edgeHighlighted: '#FFD700',
    edgeFailed: '#EF4444',
    path: '#FFD700',
    visited: 'rgba(59, 130, 246, 0.5)',
    frontier: 'rgba(16, 185, 129, 0.5)',
  },
} as const

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
} as const

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const