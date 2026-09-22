import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures that whenever the route pathname changes, the window scroll
 * position is immediately and cleanly reset to the top.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};
