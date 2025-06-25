
import React from 'react';
import { ThemeAccessory, PlayerOwnedAccessoriesState, PlayerGemsState, Theme } from '../types';
import { SHOP_TITLE_TEXT, SHOP_BACK_BUTTON_TEXT, PLAYER_GEMS_TEXT, BUTTON_CLICK_SOUND_URL, HOVER_SOUND_URL } from '../constants';
import { THEME_CONFIGS } from '../themes'; // Corrected import path
import { GemIcon, ShoppingBagIcon, CheckCircleIcon, LockClosedIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface ShopScreenProps {
  playerGems: PlayerGemsState;
  accessories: ThemeAccessory[];
  ownedAccessories: PlayerOwnedAccessoriesState;
  onBuyAccessory: (accessory: ThemeAccessory) => void;
  onGoBack: () => void;
  playSound: (soundUrl: string, volume?: number) => void;
}

const AccessoryCard: React.FC<{
  accessory: ThemeAccessory;
  isOwned: boolean;
  canAfford: boolean;
  onBuy: () => void;
  playSound: (soundUrl: string, volume?: number) => void;
}> = ({ accessory, isOwned, canAfford, onBuy, playSound }) => {
  const { themeConfig } = useTheme();

  const handleBuyClick = () => {
    playSound(BUTTON_CLICK_SOUND_URL, 0.6);
    onBuy();
  };

  const getApplicableThemesText = (themes: Theme[] | 'all'): string => {
    if (themes === 'all') return "Tất cả giao diện";
    return themes.map(t => THEME_CONFIGS[t]?.name || t).join(', ');
  };

  return (
    <div
      className={`
        p-3 sm:p-4 rounded-xl shadow-lg flex flex-col justify-between
        border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
        ${isOwned ? 'border-[var(--correct-ring)] bg-[var(--correct-bg)] bg-opacity-10' : 'border-[var(--border-color)] bg-[var(--secondary-bg)]'}
        ${themeConfig.frostedGlassOpacity || ''}
      `}
    >
      <div>
        <div className="flex items-center mb-2 sm:mb-3">
          {accessory.iconUrl ? (
            <img src={accessory.iconUrl} alt={accessory.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-md mr-3 object-contain bg-white/20 p-1" />
          ) : (
            <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--accent-color)] mr-3" />
          )}
          <h3 className={`text-md sm:text-lg font-bold ${isOwned ? 'text-[var(--correct-text)]' : 'text-[var(--primary-text)]'}`}>{accessory.name}</h3>
        </div>
        <p className="text-xs sm:text-sm text-[var(--secondary-text)] opacity-90 mb-2 sm:mb-3 h-10 sm:h-12 overflow-y-auto line-clamp-2 sm:line-clamp-3">
          {accessory.description}
        </p>
        <p className="text-xs text-[var(--secondary-text)] opacity-70 mb-1">
          Áp dụng cho: <span className="font-medium">{getApplicableThemesText(accessory.appliesToTheme)}</span>
        </p>
        <p className="text-xs text-[var(--secondary-text)] opacity-70 mb-2 sm:mb-3">
          Loại: <span className="font-medium">{accessory.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
        </p>
      </div>

      <div className="mt-auto">
        {isOwned ? (
          <div className="flex items-center justify-center text-sm sm:text-base font-semibold p-2.5 sm:p-3 rounded-lg bg-[var(--correct-bg)] text-[var(--correct-text)] opacity-80">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Đã Sở Hữu
          </div>
        ) : (
          <button
            onClick={handleBuyClick}
            disabled={!canAfford}
            onMouseEnter={() => !isOwned && playSound(HOVER_SOUND_URL, 0.2)}
            className={`
              w-full flex items-center justify-center p-2.5 sm:p-3 rounded-lg shadow-md transition-all duration-200
              text-sm sm:text-base font-bold
              ${canAfford ? 'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-90 active:scale-95 active:brightness-90' 
                          : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70'}
            `}
          >
            <GemIcon className="w-5 h-5 mr-2" />
            {canAfford ? `Mua (${accessory.price})` : `Cần ${accessory.price}`}
          </button>
        )}
      </div>
    </div>
  );
};

const ShopScreen: React.FC<ShopScreenProps> = ({
  playerGems,
  accessories,
  ownedAccessories,
  onBuyAccessory,
  onGoBack,
  playSound,
}) => {
  const { themeConfig } = useTheme();

  return (
    <div className="w-full h-full flex flex-col items-stretch animate-fadeInScale p-1 sm:p-2 md:p-3">
      <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 px-2 sm:px-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start mb-2 sm:mb-0">
          <ShoppingBagIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--accent-color)] mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)]">
            {SHOP_TITLE_TEXT}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-[var(--secondary-bg)] shadow-md border border-[var(--border-color)]">
          <GemIcon className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 filter drop-shadow-[0_2px_3px_rgba(250,204,21,0.7)]" />
          <span className="text-lg sm:text-xl font-bold text-[var(--primary-text)]">{playerGems}</span>
        </div>
      </header>

      {accessories.length > 0 ? (
        <div className="flex-grow overflow-y-auto pr-1 sm:pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 pb-3">
          {accessories.map((acc) => (
            <AccessoryCard
              key={acc.id}
              accessory={acc}
              isOwned={!!ownedAccessories[acc.id]}
              canAfford={playerGems >= acc.price}
              onBuy={() => onBuyAccessory(acc)}
              playSound={playSound}
            />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4 sm:p-6 text-[var(--secondary-text)] opacity-70">
          <ShoppingBagIcon className="w-16 h-16 text-[var(--accent-color)] opacity-50 mb-4" />
          <p className="text-lg sm:text-xl font-semibold">Cửa hàng đang được cập nhật!</p>
          <p className="text-sm sm:text-base mt-1">Hiện chưa có phụ kiện nào. Vui lòng quay lại sau.</p>
        </div>
      )}

      <div className="flex-shrink-0 mt-4 sm:mt-6">
        <button
          onClick={() => {
            playSound(BUTTON_CLICK_SOUND_URL, 0.5);
            onGoBack();
          }}
          onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
          className="w-full max-w-xs mx-auto bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-95 text-[var(--button-secondary-text)] font-bold py-3 sm:py-3.5 px-6 rounded-xl shadow-lg text-base sm:text-lg transition-all transform hover:scale-105 active:scale-95"
        >
          {SHOP_BACK_BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
};

export default ShopScreen;
