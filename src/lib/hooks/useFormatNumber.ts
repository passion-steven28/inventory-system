import { useCallback } from 'react';

/**
 * Custom hook to format numbers into a 'K' format (e.g., 10000 becomes 10k).
 * @returns A function that takes a number and returns the formatted string.
 */
export const useFormatNumber = () => {
  const formatNumber = useCallback((num: number | undefined | null): string => {
    if (num === null || num === undefined) {
      return '0'; // Or handle as needed, e.g., return '' or '-'
    }
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  }, []);

  return formatNumber;
};