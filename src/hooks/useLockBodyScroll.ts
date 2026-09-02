import { useEffect } from 'react';

export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const mainEl = document.getElementById('main-content');
    const originalMainOverflow = mainEl ? mainEl.style.overflow : '';

    // Lock scrolling on document, body, and main container
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (mainEl) {
      mainEl.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      if (mainEl) {
        mainEl.style.overflow = originalMainOverflow;
      }
    };
  }, [isLocked]);
}
