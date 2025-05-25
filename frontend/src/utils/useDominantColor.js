
import { useState, useEffect } from 'react';
//@ts-ignore
import ColorThief from "colorthief";

export const useDominantColor = (imageUrl, fallbackColor = [40, 40, 40]) => {
  const [dominantColor, setDominantColor] = useState(fallbackColor);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setDominantColor(fallbackColor);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous'; // This is sufficient for Cloudinary
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setDominantColor(color);
      } catch (error) {
        console.error('Error extracting color:', error);
        setDominantColor(fallbackColor);
      }
      setIsLoading(false);
    };

    img.onerror = () => {
      console.error('Error loading image');
      setDominantColor(fallbackColor);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return { dominantColor, isLoading };
};