// src/design-system/theme.js
// HackOS Neo - Futuristic Design System

export const colors = {
  // Deep Netflix Palette
  brand: {
    primary: 'from-red-600 to-red-800',
    secondary: 'from-zinc-800 to-zinc-950',
    accent: 'red-600',
    neon: {
      cyan: 'shadow-[0_0_15px_rgba(229,9,20,0.3)]',
      purple: 'shadow-[0_0_15px_rgba(184,7,16,0.3)]',
      pink: 'shadow-[0_0_15px_rgba(220,38,38,0.3)]',
    }
  },

  // State Colors
  state: {
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/20',
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      gradient: 'from-red-500 to-red-700',
      glow: 'shadow-red-500/20',
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      gradient: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
    },
    info: {
      bg: 'bg-[#181818]',
      border: 'border-zinc-800',
      text: 'text-zinc-300',
      gradient: 'from-zinc-700 to-zinc-900',
      glow: 'shadow-zinc-500/20',
    },
  },

  // Background Layers (Netflix Dark)
  bg: {
    base: 'bg-[#141414]', // Netflix rich black
    gradient: 'bg-gradient-to-b from-[#181818] via-[#141414] to-[#141414]',
    card: 'bg-[#181818] border border-zinc-800/80',
    cardHover: 'bg-[#232323] border-zinc-700',
    elevated: 'bg-[#1c1c1c] border border-zinc-800',
    input: 'bg-[#333] border-none',
    inputHover: 'bg-[#444] border-none',
  },

  // Borders
  border: {
    subtle: 'border-zinc-800/50',
    default: 'border-zinc-800',
    strong: 'border-zinc-700',
    neon: 'border-red-600/50',
  },

  // Text
  text: {
    primary: 'text-[#e5e5e5]',
    secondary: 'text-[#a3a3a3]',
    tertiary: 'text-[#777777]',
    muted: 'text-[#555555]',
    gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700',
  },
};

export const buttons = {
  primary: `
    px-6 py-2.5 rounded-md 
    bg-[#E50914] hover:bg-[#B80710] 
    text-white font-bold 
    transition-all duration-200 
    hover:scale-[1.01] active:scale-[0.99]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondary: `
    px-6 py-2.5 rounded-md 
    bg-zinc-800/80 hover:bg-zinc-700 
    text-white font-bold 
    transition-all duration-200 
    border border-zinc-700 hover:border-zinc-600
  `,
  ghost: `
    px-6 py-2.5 rounded-md 
    text-zinc-400 hover:text-white 
    hover:bg-zinc-800/40 
    transition-all duration-200
  `,
  outline: `
    px-6 py-2.5 rounded-md 
    bg-transparent border border-red-600/70
    text-red-500 hover:bg-red-600/10 
    transition-all duration-200
  `
};

export const cards = {
  neo: `
    bg-[#181818] 
    border border-zinc-800/60 
    rounded-xl 
    shadow-xl shadow-black/80
    transition-all duration-300
  `,
  interactive: `
    bg-[#181818] 
    border border-zinc-800/60 
    rounded-xl 
    shadow-xl shadow-black/80
    transition-all duration-300
    hover:bg-[#232323] hover:border-zinc-700
    hover:scale-[1.03]
    cursor-pointer active:scale-[0.99]
  `,
  glass: `
    bg-[#1f1f1f]
    border border-zinc-800
    rounded-xl
  `
};

export const layout = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-16 md:py-24',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
};

export const typography = {
  h1: 'text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight text-white',
  h3: 'text-xl md:text-2xl font-bold text-white',
  body: 'text-base text-[#e5e5e5] leading-relaxed',
  label: 'text-xs font-bold uppercase tracking-wider text-zinc-500',
  gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700',
};

// Helper Utilities
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getButton(variant = 'primary') {
  return buttons[variant] || buttons.primary;
}

export function getCard(variant = 'neo') {
  return cards[variant] || cards.neo;
}

export default {
  colors,
  buttons,
  cards,
  layout,
  typography,
  cn,
  getButton,
  getCard,
};
