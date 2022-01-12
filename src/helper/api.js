const yahoo = require('yahoo-finance');

const { getConversionRate } = require('./converter');

let _stocks = [];
let _rates = {};

export const getQuote = async (symbol) => {
  const quote = await yahoo.quote({
    symbol,
    modules: ['price'],
  });
  return quote;
};

export const getQuotes = async (symbols) => {
  const quotes = await Promise.all(symbols.map((symbol) => getQuote(symbol)));
  return quotes;
};

export const getTotalValue = (
  quotes,
  { property = 'regularMarketPrice', predicate = () => true } = {},
) => {
  const value = quotes.filter(predicate).reduce((total, quote) => {
    const { symbol, currency: quoteCurrency } = quote.price;
    const amount = _stocks[symbol];
    return total + amount * quote.price[property] * _rates[quoteCurrency];
  }, 0);
  return value;
};

export const getTotalChange = (quotes) => {
  const currentTotalValue = getTotalValue(quotes);
  const previousTotalValue = getTotalValue(quotes, {
    property: 'regularMarketPreviousClose',
  });
  return {
    change: currentTotalValue - previousTotalValue,
    changePercent:
      (currentTotalValue - previousTotalValue) / previousTotalValue,
  };
};

export const getChanges = (quotes) => {
  const changes = quotes.map((quote) => {
    const {
      symbol,
      currency: quoteCurrency,
      regularMarketChange,
      regularMarketChangePercent,
    } = quote.price;
    const amount = _stocks[symbol];
    return {
      symbol,
      change: regularMarketChange * amount * _rates[quoteCurrency],
      changePercent: regularMarketChangePercent,
    };
  });
  changes.sort((a, b) => a.change - b.change);
  return changes;
};

export const getSummary = async ({
  stocks = {},
  watchlist = {},
  currconvApiKey,
}) => {
  _stocks = stocks;
  const stockSymbols = Object.keys(stocks);
  const watchlistSymbols = Object.keys(watchlist);
  const quotes = await getQuotes(stockSymbols);
  const watchlistQuotes = await getQuotes(watchlistSymbols);

  const currencies = [
    ...new Set(
      [...quotes, ...watchlistQuotes].map((quote) => quote.price.currency),
    ),
  ];
  const rates = (
    await Promise.all(
      currencies.map((currency) =>
        getConversionRate(currency, 'SEK', currconvApiKey),
      ),
    )
  ).reduce((acc, rate, index) => ({ ...acc, [currencies[index]]: rate }), {});
  _rates = rates;

  const summary = {
    value: getTotalValue(quotes),
    change: getTotalChange(quotes),
    changes: getChanges(quotes),
    quotes: quotes.reduce(
      (acc, quote) => ({
        ...acc,
        [quote.price.symbol]: quote.price,
      }),
      {},
    ),
    watchlist: watchlistQuotes.reduce(
      (acc, quote) => ({
        ...acc,
        [quote.price.symbol]: quote.price,
      }),
      {},
    ),
    rates,
  };
  return summary;
};
