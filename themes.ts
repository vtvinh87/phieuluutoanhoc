
import { Theme } from './types';

export interface ThemeConfig {
  name: string;
  backgroundUrl: string;
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
  buttonSecondaryBg: string; // Added for secondary buttons
  buttonSecondaryText: string; // Added for secondary buttons
  buttonAnswerOptionBg: string; // For AnswerOption default
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
  spinnerColor: string; // Now a direct color string, e.g., '#FFFFFF'
  // General UI elements
  appContainerBg: string; // Applied to the main GameScreen div
  // Special
  frostedGlassOpacity?: string; // e.g. 'bg-opacity-70 backdrop-blur-md'
  fontFamily: string; 
}

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  [Theme.DEFAULT]: {
    name: "Mặc định",
    // Placeholder - replace with a fitting default theme background
    backgroundUrl: 'https://images.unsplash.com/photo-1536514498073-50e69d996523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjE3MDA0MHw&ixlib=rb-4.0.3&q=80&w=1920',
    primaryBg: '#0284c7', // sky-600
    primaryText: '#f0f9ff', // sky-50
    secondaryBg: 'rgba(255, 255, 255, 0.1)', 
    secondaryText: '#075985', // sky-800
    accent: '#f59e0b', // amber-500
    accentText: '#78350f', // amber-900
    buttonPrimaryBg: '#f59e0b', 
    buttonPrimaryText: '#78350f',
    buttonSecondaryBg: '#cbd5e1', // slate-300
    buttonSecondaryText: '#1e293b', // slate-800
    buttonAnswerOptionBg: '#0ea5e9', 
    buttonAnswerOptionText: 'white',
    buttonAnswerOptionRing: '#7dd3fc', 
    buttonAnswerOptionSelectedBg: '#facc15', 
    buttonAnswerOptionSelectedText: '#713f12', 
    buttonAnswerOptionSelectedRing: '#fde047', 
    correctBg: '#22c55e', 
    correctText: 'white',
    correctRing: '#86efac',
    incorrectBg: '#ef4444', 
    incorrectText: 'white',
    incorrectRing: '#fca5a5', 
    modalBgBackdrop: 'rgba(0, 0, 0, 0.65)',
    modalContentBg: 'linear-gradient(to bottom right, #0ea5e9, #0369a1)', 
    modalHeaderText: '#fde047', 
    borderColor: '#38bdf8', 
    ringColorFocus: '#7dd3fc', 
    titleTextGradientFrom: '#fde047', 
    titleTextGradientTo: '#f59e0b', 
    islandButtonLockedBg: '#94a3b8', 
    islandButtonUnlockedBg: '#f59e0b', 
    islandButtonCompletedBg: '#22c55e', 
    islandButtonLockedText: '#e2e8f0', 
    islandButtonUnlockedText: '#78350f',
    islandButtonCompletedText: 'white',
    islandButtonRingColor: '#eab308', 
    questionDisplayBg: 'rgba(3, 105, 161, 0.7)', 
    questionDisplayText: '#fde047', 
    questionDisplayImageBorder: '#f59e0b', 
    spinnerColor: '#fde047',
    appContainerBg: 'bg-sky-800 bg-opacity-70 backdrop-blur-sm',
    frostedGlassOpacity: undefined,
    fontFamily: "'Arial', sans-serif",
  },
  [Theme.NEON]: {
    name: "Chiến Binh Neon",
    backgroundUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjE3MDExMXw&ixlib=rb-4.0.3&q=80&w=1920', // Neon/Synthwave style
    primaryBg: '#0a0f14', 
    primaryText: '#00f5d4', 
    secondaryBg: 'rgba(12, 29, 45, 0.9)', // Slightly more opaque for better text contrast in modals if needed
    secondaryText: '#7DF9FF', 
    accent: '#fa2772', 
    accentText: '#0a0f14',
    buttonPrimaryBg: '#00f5d4', 
    buttonPrimaryText: '#0a0f14',
    buttonSecondaryBg: '#334155', // slate-700
    buttonSecondaryText: '#00f5d4', // bright cyan text
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
    modalContentBg: 'linear-gradient(135deg, rgba(13, 26, 38, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)', // Dark gradient with high opacity
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
    questionDisplayBg: 'rgba(12, 29, 45, 0.9)',
    questionDisplayText: '#00f5d4',
    questionDisplayImageBorder: '#fa2772',
    spinnerColor: '#00f5d4',
    appContainerBg: 'bg-black bg-opacity-70 backdrop-blur-md border-2 border-[var(--border-color)]',
    frostedGlassOpacity: undefined, 
    fontFamily: "'Orbitron', sans-serif",
  },
  [Theme.GIRLY]: {
    name: "Công Chúa Lấp Lánh",
    backgroundUrl: 'https://png.pngtree.com/background/20250208/original/pngtree-glimmering-pink-background-with-textured-glitter-design-picture-image_13423197.jpg',
    primaryBg: '#ffffff', // Changed for contrast: Solid white main card
    primaryText: '#86198f', 
    secondaryBg: '#fdf2f8', // Was rgba(255, 235, 245, 0.85) - now a more solid light pink (e.g. for modals)
    secondaryText: '#9d174d', 
    accent: '#f472b6', 
    accentText: 'white',
    buttonPrimaryBg: '#ec4899', 
    buttonPrimaryText: 'white',
    buttonSecondaryBg: '#f0abfc', // fuchsia-300
    buttonSecondaryText: '#ffffff', // white text
    buttonAnswerOptionBg: '#f9a8d4', 
    buttonAnswerOptionText: '#831843', 
    buttonAnswerOptionRing: '#fbcfe8', 
    buttonAnswerOptionSelectedBg: '#db2777', 
    buttonAnswerOptionSelectedText: 'white',
    buttonAnswerOptionSelectedRing: '#f9a8d4',
    correctBg: '#84cc16', 
    correctText: 'white',
    correctRing: '#a3e635',
    incorrectBg: '#fb7185', 
    incorrectText: 'white',
    incorrectRing: '#fda4af',
    modalBgBackdrop: 'rgba(236, 72, 153, 0.3)', 
    modalContentBg: 'linear-gradient(to bottom right, rgba(255,255,255,0.92), rgba(253,242,248,0.97))', 
    modalHeaderText: '#c026d3', 
    borderColor: '#f9a8d4', 
    ringColorFocus: '#f472b6', 
    titleTextGradientFrom: '#f9a8d4', 
    titleTextGradientTo: '#ec4899', 
    islandButtonLockedBg: '#fdf2f8', 
    islandButtonUnlockedBg: '#f472b6', 
    islandButtonCompletedBg: '#a3e635', 
    islandButtonLockedText: '#be185d', 
    islandButtonUnlockedText: 'white',
    islandButtonCompletedText: '#3f6212', 
    islandButtonRingColor: '#ec4899',
    questionDisplayBg: '#fce7f3', // Changed: solid pink-100 for contrast on white primaryBg
    questionDisplayText: '#c026d3', 
    questionDisplayImageBorder: '#f472b6', 
    spinnerColor: '#f472b6',
    appContainerBg: 'bg-pink-200 bg-opacity-75 backdrop-blur-lg', // Changed: darker page bg (pink-200)
    frostedGlassOpacity: 'backdrop-blur-lg bg-opacity-75', // Still available for other elements like modals
    fontFamily: "'EB Garamond', serif",
  },
};
