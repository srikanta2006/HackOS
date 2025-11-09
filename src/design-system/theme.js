// src/design-system/theme.js
// Unified Design System for Hackathon Collaboration Platform

// ============================================
// COLORS
// ============================================
export const colors = {
  // Brand Colors
  brand: {
    primary: 'from-green-400 to-blue-500',
    primaryHover: 'from-green-500 to-blue-600',
    primaryGlow: 'shadow-[0_0_30px_rgba(74,222,128,0.25)]',
    primaryGlowHover: 'shadow-[0_0_40px_rgba(74,222,128,0.4)]',
  },

  // State Colors
  state: {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      gradient: 'from-green-500 to-green-600',
      glow: 'shadow-green-500/20',
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      gradient: 'from-red-500 to-red-600',
      glow: 'shadow-red-500/20',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      gradient: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/20',
    },
  },

  // Background Layers (Glassmorphism)
  bg: {
    base: 'bg-[#0a0e17]',
    gradient: 'bg-gradient-to-br from-[#0a0e17] via-gray-900 to-[#0f172a]',
    card: 'bg-gray-900/40 backdrop-blur-md',
    cardHover: 'bg-gray-900/60',
    elevated: 'bg-gray-800/80 backdrop-blur-xl',
    input: 'bg-gray-800/50',
    inputHover: 'bg-gray-800',
  },

  // Borders
  border: {
    default: 'border-white/5',
    subtle: 'border-white/10',
    hover: 'border-white/20',
    focus: 'border-green-500/50',
    active: 'border-green-500',
  },

  // Text
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-400',
    muted: 'text-gray-500',
    disabled: 'text-gray-600',
    gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500',
  },
};

// ============================================
// BUTTONS
// ============================================
export const buttons = {
  // Primary Action Button
  primary: `
    px-6 py-3 rounded-xl 
    bg-gradient-to-r from-green-500 to-blue-500 
    hover:from-green-600 hover:to-blue-600 
    text-white font-bold 
    transition-all duration-300 
    shadow-lg shadow-green-500/20 
    hover:shadow-green-500/40 
    hover:scale-105
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  `,

  // Secondary Button
  secondary: `
    px-6 py-3 rounded-xl 
    bg-gray-800/50 hover:bg-gray-700 
    text-white font-bold 
    transition-all duration-300 
    border border-gray-700 hover:border-gray-600
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Danger/Warning Button
  danger: `
    px-6 py-3 rounded-xl 
    bg-gradient-to-r from-red-500 to-red-600 
    hover:from-red-600 hover:to-red-700 
    text-white font-bold 
    transition-all duration-300 
    shadow-lg shadow-red-500/20 
    hover:shadow-red-500/40
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Success Button
  success: `
    px-6 py-3 rounded-xl 
    bg-gradient-to-r from-green-500 to-green-600 
    hover:from-green-600 hover:to-green-700 
    text-white font-bold 
    transition-all duration-300 
    shadow-lg shadow-green-500/20
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Warning Button
  warning: `
    px-6 py-3 rounded-xl 
    bg-gradient-to-r from-yellow-500 to-orange-500 
    hover:from-yellow-600 hover:to-orange-600 
    text-white font-black 
    transition-all duration-300 
    shadow-lg shadow-yellow-500/30 
    hover:shadow-yellow-500/50
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Ghost Button
  ghost: `
    px-6 py-3 rounded-xl 
    bg-transparent hover:bg-white/5 
    text-gray-300 hover:text-white 
    font-medium 
    transition-all duration-300 
    border border-transparent hover:border-white/10
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Small Button
  small: `
    px-4 py-2 rounded-lg 
    text-sm font-bold 
    transition-all duration-300
  `,

  // Icon Button
  icon: `
    w-10 h-10 rounded-full 
    flex items-center justify-center 
    bg-white/5 hover:bg-white/10 
    text-gray-400 hover:text-white 
    transition-all duration-300
  `,
};

// ============================================
// CARDS
// ============================================
export const cards = {
  // Base Card
  base: `
    bg-gray-900/40 backdrop-blur-md 
    border border-white/5 
    rounded-3xl 
    shadow-xl
  `,

  // Hoverable Card
  hoverable: `
    bg-gray-900/40 backdrop-blur-md 
    border border-white/5 
    rounded-3xl 
    shadow-xl 
    transition-all duration-300 
    hover:bg-gray-900/60 
    hover:border-white/10 
    hover:shadow-2xl 
    hover:-translate-y-1
  `,

  // Interactive Card (clickable)
  interactive: `
    bg-gray-900/40 backdrop-blur-md 
    border border-white/5 
    rounded-3xl 
    shadow-xl 
    transition-all duration-300 
    hover:bg-gray-900/60 
    hover:border-white/10 
    hover:shadow-2xl 
    hover:-translate-y-1
    cursor-pointer
    active:scale-98
  `,

  // Elevated Card
  elevated: `
    bg-gray-800/80 backdrop-blur-xl 
    border border-white/10 
    rounded-2xl 
    shadow-2xl
  `,

  // Compact Card (for sidebars)
  compact: `
    bg-white/5 
    border border-white/5 
    rounded-2xl 
    transition-all duration-300 
    hover:bg-white/10 
    hover:border-white/10
  `,
};

// ============================================
// INPUTS
// ============================================
export const inputs = {
  // Text Input
  text: `
    w-full px-4 py-3 rounded-xl 
    bg-gray-800/50 
    border border-gray-700 
    focus:border-green-500 
    focus:ring-2 focus:ring-green-500/20 
    text-white placeholder-gray-500 
    transition-all duration-300 
    outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Textarea
  textarea: `
    w-full px-4 py-3 rounded-xl 
    bg-gray-800/50 
    border border-gray-700 
    focus:border-green-500 
    focus:ring-2 focus:ring-green-500/20 
    text-white placeholder-gray-500 
    transition-all duration-300 
    outline-none 
    resize-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Select
  select: `
    w-full px-4 py-3 rounded-xl 
    bg-gray-800/50 
    border border-gray-700 
    focus:border-green-500 
    focus:ring-2 focus:ring-green-500/20 
    text-white 
    transition-all duration-300 
    outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Checkbox/Radio
  checkbox: `
    w-5 h-5 rounded 
    bg-gray-800 
    border-2 border-gray-700 
    text-green-500 
    focus:ring-2 focus:ring-green-500/20 
    transition-all duration-300
  `,
};

// ============================================
// BADGES
// ============================================
export const badges = {
  // Default Badge
  default: `
    px-3 py-1 rounded-full 
    bg-gray-800/50 
    border border-gray-700 
    text-xs font-bold 
    text-gray-300
  `,

  // Success Badge
  success: `
    px-3 py-1 rounded-full 
    bg-green-500/20 
    border border-green-500/50 
    text-xs font-bold 
    text-green-400
  `,

  // Danger Badge
  danger: `
    px-3 py-1 rounded-full 
    bg-red-500/20 
    border border-red-500/50 
    text-xs font-bold 
    text-red-400
  `,

  // Warning Badge
  warning: `
    px-3 py-1 rounded-full 
    bg-yellow-500/20 
    border border-yellow-500/50 
    text-xs font-bold 
    text-yellow-400
  `,

  // Info Badge
  info: `
    px-3 py-1 rounded-full 
    bg-blue-500/20 
    border border-blue-500/50 
    text-xs font-bold 
    text-blue-400
  `,

  // Skill Badge (for tags)
  skill: `
    px-3 py-1.5 rounded-lg 
    bg-gradient-to-r from-green-500/10 to-blue-500/10 
    border border-green-500/30 
    text-xs font-bold 
    text-green-400 
    transition-all duration-300 
    hover:from-green-500/20 hover:to-blue-500/20 
    hover:border-green-500/50
  `,
};

// ============================================
// ANIMATIONS
// ============================================
export const animations = {
  // Hover Effects
  slideUp: 'transition-all duration-300 hover:-translate-y-1',
  slideDown: 'transition-all duration-300 hover:translate-y-1',
  scaleUp: 'transition-all duration-300 hover:scale-105',
  scaleDown: 'transition-all duration-300 hover:scale-95',
  
  // Glow Effects
  glow: 'transition-all duration-300 hover:shadow-lg',
  glowGreen: 'transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30',
  glowBlue: 'transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30',
  
  // Pulse
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  
  // Fade
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  
  // Spin
  spin: 'animate-spin',
};

// ============================================
// EFFECTS
// ============================================
export const effects = {
  // Glow Ring (for hover effects on cards)
  glowRing: `
    absolute -inset-0.5 
    bg-gradient-to-r from-green-500 to-blue-500 
    rounded-2xl opacity-0 
    group-hover:opacity-20 
    blur transition duration-300
  `,

  // Shimmer Effect
  shimmer: `
    absolute inset-0 
    bg-white/20 
    animate-shimmer
  `,

  // Gradient Overlay
  gradientOverlay: `
    absolute inset-0 
    bg-gradient-to-t from-black/50 to-transparent 
    opacity-0 
    group-hover:opacity-100 
    transition-opacity duration-300
  `,

  // Backdrop Blur
  blur: 'backdrop-blur-md',
  blurXl: 'backdrop-blur-xl',
};

// ============================================
// LAYOUT
// ============================================
export const layout = {
  // Container
  container: 'container mx-auto px-4',
  
  // Section Spacing
  section: 'py-12',
  sectionLg: 'py-16',
  
  // Grid Layouts
  gridCols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  gridCols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  gridCols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  
  // Flex Layouts
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  
  // Spacing
  space: {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  },
};

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  // Headings
  h1: 'text-4xl md:text-5xl font-black text-white leading-tight',
  h2: 'text-3xl md:text-4xl font-black text-white leading-tight',
  h3: 'text-2xl md:text-3xl font-bold text-white leading-tight',
  h4: 'text-xl md:text-2xl font-bold text-white',
  h5: 'text-lg md:text-xl font-bold text-white',
  h6: 'text-base md:text-lg font-bold text-white',
  
  // Body Text
  body: 'text-base text-gray-300',
  bodyLarge: 'text-lg text-gray-300',
  bodySmall: 'text-sm text-gray-400',
  
  // Special
  gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500',
  gradientLarge: 'text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500',
  
  // Labels
  label: 'text-sm font-bold text-gray-300 mb-2',
  labelSmall: 'text-xs font-bold text-gray-400 uppercase tracking-wider',
};

// ============================================
// HELPER UTILITIES
// ============================================

// Combine multiple classes safely
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Get button variant
export function getButton(variant = 'primary', size = 'default') {
  const base = buttons[variant] || buttons.primary;
  const sizeClass = size === 'small' ? buttons.small : '';
  return cn(base, sizeClass);
}

// Get badge variant
export function getBadge(variant = 'default') {
  return badges[variant] || badges.default;
}

// Get card variant
export function getCard(variant = 'base') {
  return cards[variant] || cards.base;
}

// Get input type
export function getInput(type = 'text') {
  return inputs[type] || inputs.text;
}

export default {
  colors,
  buttons,
  cards,
  inputs,
  badges,
  animations,
  effects,
  layout,
  typography,
  cn,
  getButton,
  getBadge,
  getCard,
  getInput,
};