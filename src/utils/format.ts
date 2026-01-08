export const formatCurrency = (amount: number, currency = 'USD', language = 'en') => {
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  }).format(amount);
};

export const formatDate = (date: string, language = 'en') => {
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
