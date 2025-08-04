
import { useState, useCallback } from 'react';
import { ToastMessage } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';

export const useToast = () => {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success', icon?: React.ReactNode) => {
    setCurrentToast({ id: uuidv4(), message, type, icon });
  }, []);
  
  const dismissToast = useCallback(() => {
      setCurrentToast(null);
  }, []);

  return { currentToast, showToast, dismissToast };
};
