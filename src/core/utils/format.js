export const formatValue = (value, currency = 'SEK') =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency }).format(value);

export const formatChange = (value) =>
  `${value < 0 ? '−' : '+'}${new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  }).format(Math.abs(value))}`;

export const formatChangePercent = (percent) =>
  `${percent < 0 ? '−' : '+'}${(Math.abs(percent) * 100).toFixed(2)}%`;
