import React from 'react';
import { API_KEY_ERROR_MESSAGE } from '../../constants';
import { AlertTriangleIcon } from '../icons';

interface ApiKeyErrorScreenProps {
  onReload: () => void;
}

export const ApiKeyErrorScreen: React.FC<ApiKeyErrorScreenProps> = ({ onReload }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fadeInScale p-4">
      <div className="bg-[var(--incorrect-bg)] text-[var(--incorrect-text)] p-6 sm:p-8 rounded-lg shadow-xl max-w-md mx-auto">
        <AlertTriangleIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[var(--accent-color)]" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Lỗi Cấu Hình</h1>
        <p className="text-lg sm:text-xl mb-6">{API_KEY_ERROR_MESSAGE}</p>
        <button
          onClick={onReload}
          className="bg-[var(--button-primary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-6 rounded-lg text-base sm:text-lg shadow-[var(--button-primary-shadow,theme(boxShadow.md))]"
        >
          Tải Lại Trang
        </button>
      </div>
    </div>
);
