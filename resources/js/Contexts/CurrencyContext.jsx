import React, { createContext, useContext } from 'react';
import { useLanguage } from './LanguageContext';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const { language } = useLanguage();
    
    // Automatically derive currency based on the selected language:
    // Twi (tw) -> GHS (Cedis)
    // English (en) / German (de) -> EUR
    const currency = language === 'tw' ? 'GHS' : 'EUR';

    const formatPrice = (priceEur, priceGhs) => {
        if (currency === 'GHS') {
            const val = priceGhs !== null && priceGhs !== undefined ? priceGhs : 0;
            return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(val);
        }
        const val = priceEur !== null && priceEur !== undefined ? priceEur : 0;
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
    };

    return (
        <CurrencyContext.Provider value={{ currency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
