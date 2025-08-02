import React from 'react';
import {
    API_KEY_ERROR_MESSAGE, NO_ISLANDS_FOR_GRADE_TEXT, RETURN_TO_GRADE_SELECTION_TEXT
} from '../../constants';
import { AlertTriangleIcon } from '../icons';

interface ErrorScreenProps {
  loadingError: string | null;
  handleReturnToGradeSelection: () => void;
  handleRetryFetchIsland: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ loadingError, handleReturnToGradeSelection, handleRetryFetchIsland }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fadeInScale p-4">
        <div className={`p-6 sm:p-8 rounded-lg shadow-xl max-w-md mx-auto bg-[var(--incorrect-bg)] text-[var(--incorrect-text)]`}>
            <AlertTriangleIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[var(--accent-color)]" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Lỗi</h1>
            <p className="text-lg sm:text-xl mb-6">{loadingError || "Đã có lỗi xảy ra."}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button onClick={handleReturnToGradeSelection} className="bg-[var(--button-secondary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-6 rounded-lg text-sm sm:text-base shadow-[var(--button-primary-shadow,theme(boxShadow.md))]">
                    {RETURN_TO_GRADE_SELECTION_TEXT}
                </button>
                {loadingError !== NO_ISLANDS_FOR_GRADE_TEXT && loadingError !== API_KEY_ERROR_MESSAGE && (
                    <button onClick={handleRetryFetchIsland} className="bg-[var(--button-primary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-6 rounded-lg text-sm sm:text-base shadow-[var(--button-primary-shadow,theme(boxShadow.md))]">
                        Thử Tải Lại
                    </button>
                )}
            </div>
        </div>
    </div>
);
