
import { Theme } from './types';

export interface ThemeConfig {
  name: string;
  backgroundUrl: string; // General fallback remote URL
  backgroundUrlSideBySideLayout?: string; // Specific remote URL for desktop/side-by-side
  backgroundUrlStackedLayout?: string;    // Specific remote URL for mobile/stacked
  localBackgroundUrlSideBySideLayout?: string; // Specific local path for desktop/side-by-side
  localBackgroundUrlStackedLayout?: string;    // Specific local path for mobile/stacked
  // Primary colors
  primaryBg: string; 
  primaryText: string;
  secondaryBg: string; 
  secondaryText: string;
  // Accent colors
  accent: string;
  accentText: string;
  // Button specific
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string; 
  buttonSecondaryText: string; 
  buttonAnswerOptionBg: string; 
  buttonAnswerOptionText: string;
  buttonAnswerOptionRing: string;
  buttonAnswerOptionSelectedBg: string;
  buttonAnswerOptionSelectedText: string;
  buttonAnswerOptionSelectedRing: string;
  // Feedback colors
  correctBg: string;
  correctText: string;
  correctRing: string;
  incorrectBg: string;
  incorrectText: string;
  incorrectRing: string;
  // Modal specific
  modalBgBackdrop: string; 
  modalContentBg: string;
  modalHeaderText: string;
  // Borders and Rings
  borderColor: string;
  ringColorFocus: string; 
  // Text for titles, headers
  titleTextGradientFrom: string;
  titleTextGradientTo: string;
  // Island Map Button Styles
  islandButtonLockedBg: string;
  islandButtonUnlockedBg: string;
  islandButtonCompletedBg: string;
  islandButtonLockedText: string;
  islandButtonUnlockedText: string;
  islandButtonCompletedText: string;
  islandButtonRingColor: string;
  // Question Display
  questionDisplayBg: string;
  questionDisplayText: string;
  questionDisplayImageBorder: string;
  // Spinner Color
  spinnerColor: string; 
  // General UI elements
  appContainerBg: string; 
  // Special
  frostedGlassOpacity?: string; 
  fontFamily: string; 
}

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  [Theme.DEFAULT]: { 
    name: "Frutiger Aero",
    backgroundUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjI1MDI2NHw&ixlib=rb-4.0.3&q=80&w=1920',
    backgroundUrlSideBySideLayout: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjI1MDI2NHw&ixlib=rb-4.0.3&q=80&w=1920', 
    backgroundUrlStackedLayout: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjI1MDI2NHw&ixlib=rb-4.0.3&q=80&w=1920', 
    localBackgroundUrlSideBySideLayout: undefined,
    localBackgroundUrlStackedLayout: undefined,
    primaryBg: 'bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/30', 
    primaryText: '#075985', 
    secondaryBg: 'bg-sky-50/50 backdrop-blur-sm rounded-xl shadow-md border border-white/20',
    secondaryText: '#0c4a6e', 
    accent: '#22d3ee', 
    accentText: '#083344', 
    buttonPrimaryBg: 'linear-gradient(to bottom, #67e8f9, #22d3ee)', 
    buttonPrimaryText: '#083344', 
    buttonSecondaryBg: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)', 
    buttonSecondaryText: '#334155', 
    buttonAnswerOptionBg: 'bg-white/75 hover:bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200/50',
    buttonAnswerOptionText: '#0ea5e9', 
    buttonAnswerOptionRing: '#67e8f9', 
    buttonAnswerOptionSelectedBg: 'linear-gradient(to bottom, #22d3ee, #06b6d4)', 
    buttonAnswerOptionSelectedText: 'white',
    buttonAnswerOptionSelectedRing: '#15b3c5',
    correctBg: '#22c55e', 
    correctText: 'white',
    correctRing: '#4ade80', 
    incorrectBg: '#ef4444', 
    incorrectText: 'white',
    incorrectRing: '#f87171', 
    modalBgBackdrop: 'rgba(0, 100, 150, 0.3)', 
    modalContentBg: 'bg-gradient-to-br from-white/85 via-sky-100/80 to-cyan-100/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40',
    modalHeaderText: '#075985', 
    borderColor: '#e0f2fe', 
    ringColorFocus: '#22d3ee', 
    titleTextGradientFrom: '#22d3ee', 
    titleTextGradientTo: '#06b6d4', 
    islandButtonLockedBg: 'bg-slate-300/60 backdrop-blur-sm',
    islandButtonUnlockedBg: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500 shadow-lg',
    islandButtonCompletedBg: 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg',
    islandButtonLockedText: '#475569', 
    islandButtonUnlockedText: 'white',
    islandButtonCompletedText: 'white',
    islandButtonRingColor: '#67e8f9', 
    questionDisplayBg: 'bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20',
    questionDisplayText: '#075985', 
    questionDisplayImageBorder: '#67e8f9', 
    spinnerColor: '#22d3ee', 
    appContainerBg: 'p-2 sm:p-3 md:p-4 bg-slate-100/30 backdrop-blur-2xl rounded-[28px] shadow-2xl border-2 border-white/50', 
    frostedGlassOpacity: 'bg-opacity-70 backdrop-blur-xl shadow-xl border border-white/20', 
    fontFamily: "'Inter', 'Arial', sans-serif",
  },
  [Theme.FRUTIGER_AERO]: { 
    name: "Frutiger Aero",
    backgroundUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjI1MDI2NHw&ixlib=rb-4.0.3&q=80&w=1920',
    backgroundUrlSideBySideLayout: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjI1MDI2NHw&ixlib=rb-4.0.3&q=80&w=1920', 
    backgroundUrlStackedLayout: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjI1MDI2NHw&ixlib=rb-4.0.3&q=80&w=1920', 
    localBackgroundUrlSideBySideLayout: undefined,
    localBackgroundUrlStackedLayout: undefined,
    primaryBg: 'bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/30',
    primaryText: '#075985', 
    secondaryBg: 'bg-sky-50/50 backdrop-blur-sm rounded-xl shadow-md border border-white/20',
    secondaryText: '#0c4a6e', 
    accent: '#22d3ee', 
    accentText: '#083344', 
    buttonPrimaryBg: 'linear-gradient(to bottom, #67e8f9, #22d3ee)', 
    buttonPrimaryText: '#083344', 
    buttonSecondaryBg: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)', 
    buttonSecondaryText: '#334155', 
    buttonAnswerOptionBg: 'bg-white/75 hover:bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200/50',
    buttonAnswerOptionText: '#0ea5e9', 
    buttonAnswerOptionRing: '#67e8f9', 
    buttonAnswerOptionSelectedBg: 'linear-gradient(to bottom, #22d3ee, #06b6d4)', 
    buttonAnswerOptionSelectedText: 'white',
    buttonAnswerOptionSelectedRing: '#15b3c5',
    correctBg: '#22c55e', 
    correctText: 'white',
    correctRing: '#4ade80', 
    incorrectBg: '#ef4444', 
    incorrectText: 'white',
    incorrectRing: '#f87171', 
    modalBgBackdrop: 'rgba(0, 100, 150, 0.3)', 
    modalContentBg: 'bg-gradient-to-br from-white/85 via-sky-100/80 to-cyan-100/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40',
    modalHeaderText: '#075985', 
    borderColor: '#e0f2fe', 
    ringColorFocus: '#22d3ee', 
    titleTextGradientFrom: '#22d3ee', 
    titleTextGradientTo: '#06b6d4', 
    islandButtonLockedBg: 'bg-slate-300/60 backdrop-blur-sm',
    islandButtonUnlockedBg: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500 shadow-lg',
    islandButtonCompletedBg: 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg',
    islandButtonLockedText: '#475569', 
    islandButtonUnlockedText: 'white',
    islandButtonCompletedText: 'white',
    islandButtonRingColor: '#67e8f9', 
    questionDisplayBg: 'bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20',
    questionDisplayText: '#075985', 
    questionDisplayImageBorder: '#67e8f9', 
    spinnerColor: '#22d3ee', 
    appContainerBg: 'p-2 sm:p-3 md:p-4 bg-slate-100/30 backdrop-blur-2xl rounded-[28px] shadow-2xl border-2 border-white/50',
    frostedGlassOpacity: 'bg-opacity-70 backdrop-blur-xl shadow-xl border border-white/20',
    fontFamily: "'Inter', 'Arial', sans-serif",
  },
  [Theme.NEON]: {
    name: "Chiến Binh Neon",
    backgroundUrl: 'https://i.ibb.co/5V0vDTJ/hinh-nen-neon-98.png', // General fallback for Neon
    backgroundUrlSideBySideLayout: 'https://i.ibb.co/5V0vDTJ/hinh-nen-neon-98.png', 
    backgroundUrlStackedLayout: 'https://i.ibb.co/KjRHFXD8/hinh-nen-neon-89.png',    
    localBackgroundUrlSideBySideLayout: '/pictures/background/hinh-nen-neon-98.png',
    localBackgroundUrlStackedLayout: '/pictures/background/hinh-nen-neon-89.png',
    primaryBg: '#0a0f14', 
    primaryText: '#00f5d4', 
    secondaryBg: 'rgba(12, 29, 45, 0.95)', 
    secondaryText: '#7DF9FF', 
    accent: '#fa2772', 
    accentText: '#0a0f14',
    buttonPrimaryBg: '#00f5d4', 
    buttonPrimaryText: '#0a0f14',
    buttonSecondaryBg: '#334155', 
    buttonSecondaryText: '#00f5d4', 
    buttonAnswerOptionBg: '#1a2b3c', 
    buttonAnswerOptionText: '#7DF9FF', 
    buttonAnswerOptionRing: '#00f5d4', 
    buttonAnswerOptionSelectedBg: '#fa2772', 
    buttonAnswerOptionSelectedText: '#0a0f14',
    buttonAnswerOptionSelectedRing: '#ff7eb3',
    correctBg: '#2EFF2E', 
    correctText: '#0a0f14',
    correctRing: '#90EE90',
    incorrectBg: '#FF3131', 
    incorrectText: 'white',
    incorrectRing: '#FF7F7F',
    modalBgBackdrop: 'rgba(0, 0, 0, 0.85)',
    modalContentBg: 'linear-gradient(135deg, rgba(13, 26, 38, 0.98) 0%, rgba(0, 0, 0, 0.99) 100%)', 
    modalHeaderText: '#00f5d4',
    borderColor: '#00f5d4',
    ringColorFocus: '#7DF9FF',
    titleTextGradientFrom: '#00f5d4',
    titleTextGradientTo: '#7DF9FF',
    islandButtonLockedBg: '#1e2d3d',
    islandButtonUnlockedBg: '#00f5d4',
    islandButtonCompletedBg: '#2EFF2E',
    islandButtonLockedText: '#4a5568',
    islandButtonUnlockedText: '#0a0f14',
    islandButtonCompletedText: '#0a0f14',
    islandButtonRingColor: '#7DF9FF',
    questionDisplayBg: 'rgba(12, 29, 45, 0.92)',
    questionDisplayText: '#00f5d4',
    questionDisplayImageBorder: '#fa2772',
    spinnerColor: '#00f5d4',
    appContainerBg: 'p-2 sm:p-3 md:p-4 bg-black/80 backdrop-blur-lg rounded-[28px] shadow-2xl border-2 border-[var(--border-color)]',
    frostedGlassOpacity: 'bg-opacity-80 backdrop-blur-md shadow-xl border border-gray-700/70', 
    fontFamily: "'TH Morucas', 'Orbitron', sans-serif",
  },
  [Theme.GIRLY]: {
    name: "Công Chúa Lấp Lánh",
    backgroundUrl: 'https://i.ibb.co/C3yKRPrh/hinh-nen-girly-98.png', 
    backgroundUrlSideBySideLayout: 'https://i.ibb.co/C3yKRPrh/hinh-nen-girly-98.png', 
    backgroundUrlStackedLayout: 'https://i.ibb.co/dJpY6M0M/hinh-nen-girly-89.png',   
    localBackgroundUrlSideBySideLayout: '/pictures/background/hinh-nen-girly-98.png',
    localBackgroundUrlStackedLayout: '/pictures/background/hinh-nen-girly-89.png',
    primaryBg: 'bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-pink-200/50', 
    primaryText: '#86198f', 
    secondaryBg: 'bg-pink-50/70 backdrop-blur-sm rounded-xl shadow-md border border-pink-100/50', 
    secondaryText: '#9d174d', 
    accent: '#f472b6', 
    accentText: 'white',
    buttonPrimaryBg: '#ec4899', 
    buttonPrimaryText: 'white',
    buttonSecondaryBg: '#f0abfc', 
    buttonSecondaryText: '#a21caf', 
    buttonAnswerOptionBg: 'bg-pink-100/80 hover:bg-pink-100/95 backdrop-blur-sm rounded-lg shadow-md border border-pink-200/70',
    buttonAnswerOptionText: '#db2777', 
    buttonAnswerOptionRing: '#f9a8d4', 
    buttonAnswerOptionSelectedBg: '#db2777', 
    buttonAnswerOptionSelectedText: 'white',
    buttonAnswerOptionSelectedRing: '#f472b6', 
    correctBg: '#84cc16', 
    correctText: 'white',
    correctRing: '#a3e635', 
    incorrectBg: '#fb7185', 
    incorrectText: 'white',
    incorrectRing: '#fda4af', 
    modalBgBackdrop: 'rgba(236, 72, 153, 0.35)', 
    modalContentBg: 'bg-gradient-to-br from-white/90 via-pink-50/85 to-fuchsia-100/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50', 
    modalHeaderText: '#c026d3', 
    borderColor: '#fbcfe8', 
    ringColorFocus: '#f472b6', 
    titleTextGradientFrom: '#f9a8d4', 
    titleTextGradientTo: '#ec4899', 
    islandButtonLockedBg: 'bg-pink-100/70 backdrop-blur-sm',
    islandButtonUnlockedBg: 'bg-gradient-to-br from-pink-400 to-fuchsia-500 shadow-lg',
    islandButtonCompletedBg: 'bg-gradient-to-br from-lime-400 to-green-500 shadow-lg',
    islandButtonLockedText: '#be185d', 
    islandButtonUnlockedText: 'white',
    islandButtonCompletedText: 'white',
    islandButtonRingColor: '#ec4899', 
    questionDisplayBg: 'bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-pink-100/60',
    questionDisplayText: '#c026d3', 
    questionDisplayImageBorder: '#f472b6', 
    spinnerColor: '#ec4899', 
    appContainerBg: 'p-2 sm:p-3 md:p-4 bg-pink-100/40 backdrop-blur-2xl rounded-[28px] shadow-2xl border-2 border-white/60',
    frostedGlassOpacity: 'bg-opacity-75 backdrop-blur-xl shadow-xl border border-white/30',
    fontFamily: "'SVN Skill', 'EB Garamond', serif",
  },
};
