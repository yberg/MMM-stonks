const yahoo = require("yahoo-finance");
const { stocks, watchlist } = require("./portfolio");
const converters = require("./converters").default;

export const getStock = (symbol) => stocks.find((s) => s.symbol === symbol);

export const getQuote = async (symbol) => {
	const quote = await yahoo.quote({
		symbol,
		modules: ["price"]
	});
	return quote;
};

export const getQuotes = async (symbols) => {
	const quotes = await Promise.all(symbols.map((symbol) => getQuote(symbol)));
	return quotes;
};

export const getTotalValue = (quotes, { property = "regularMarketPrice", currency = "SEK", predicate = () => true } = {}) => {
	const value = quotes.filter(predicate).reduce((total, quote) => {
		const { symbol, currency: quoteCurrency } = quote.price;
		const stock = getStock(symbol);
		return total + stock.amount * quote.price[property] * converters[quoteCurrency][currency];
	}, 0);
	return value;
};

export const getTotalChange = (quotes) => {
	const currentTotalValue = getTotalValue(quotes);
	const previousTotalValue = getTotalValue(quotes, {
		property: "regularMarketPreviousClose"
	});
	return {
		change: currentTotalValue - previousTotalValue,
		changePercent: (currentTotalValue - previousTotalValue) / previousTotalValue
	};
};

export const getChanges = (quotes, { currency = "SEK" } = {}) => {
	const changes = quotes.map((quote) => {
		const { symbol, currency: quoteCurrency, regularMarketChange, regularMarketChangePercent } = quote.price;
		const stock = getStock(symbol);
		return {
			symbol,
			change: regularMarketChange * stock.amount * converters[quoteCurrency][currency],
			changePercent: regularMarketChangePercent
		};
	});
	changes.sort((a, b) => a.change - b.change);
	return changes;
};

export const getSummary = async () => {
	const stockSymbols = stocks.map((stock) => stock.symbol);
	const watchlistSymbols = watchlist.map((quote) => quote.symbol);
	const quotes = await getQuotes(stockSymbols);
	const watchlistQuotes = await getQuotes(watchlistSymbols);
	const summary = {
		value: getTotalValue(quotes),
		change: getTotalChange(quotes),
		changes: getChanges(quotes),
		quotes: quotes.reduce(
			(acc, quote) => ({
				...acc,
				[quote.price.symbol]: quote.price
			}),
			{}
		),
		watchlist: watchlistQuotes.reduce(
			(acc, quote) => ({
				...acc,
				[quote.price.symbol]: quote.price
			}),
			{}
		)
	};
	return summary;
};
