import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface IslandLoadingScreenProps {
  message: string;
}

export const IslandLoadingScreen: React.FC<IslandLoadingScreenProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[300px]">
    <LoadingSpinner text={message} />
  </div>
);
