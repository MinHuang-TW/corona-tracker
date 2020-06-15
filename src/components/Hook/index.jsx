import { useState, useEffect } from 'react';

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  return windowWidth;
}

export const useKey = (setPickerOpen) => {
  const [key, setKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = ({ key, keyCode }) => {
      if (key === 'Escape') setPickerOpen(false);
      if ((keyCode >= 65) & (keyCode <= 90)) setKey(key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
    // eslint-disable-next-line
  }, []);
  return [key, setKey];
}