import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, getMe, logoutUser } from '@/store';

export function useAuth() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.isInitialized) {
      dispatch(getMe());
    }
  }, [dispatch, authState.isInitialized]);

  return {
    ...authState,
    logout: () => dispatch(logoutUser())
  };
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
}

export function useTheme() {
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setIsDark(systemTheme === 'dark');
    } else {
      root.classList.add(theme);
      setIsDark(theme === 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme: setThemeState, isDark };
}

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
