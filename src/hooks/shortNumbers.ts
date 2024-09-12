import { useState, useCallback, useRef } from 'react';

const useShortNumber = () => {
    const [formattedNumber, setFormattedNumber] = useState('');

    const formatNumber = useCallback((number: number): string => {
        const suffixes = ['', 'k', 'm', 'b', 't'];
        const suffixNum = Math.floor(Math.log10(Math.abs(number)) / 3);
        let shortValue = (number / Math.pow(1000, suffixNum)).toFixed(1);

        if (shortValue.endsWith('.0')) {
            shortValue = shortValue.slice(0, -2);
        }

        return shortValue + suffixes[suffixNum];
    }, []);

    const shortenNumber = useCallback((number: number): string => {
        const formatted = formatNumber(Math.abs(number));
        setFormattedNumber(formatted);
        return formatted;
    }, [formatNumber]);

    const memoizedShortenNumber = useRef(shortenNumber);

    return { formattedNumber, shortenNumber: memoizedShortenNumber.current };
};

export default useShortNumber;