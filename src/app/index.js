import { render, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import * as db from '../utils/db';

/** @jsx h */

const App = ({}) => {
  const [stocks, setStocks] = useState({});
  const [watchlist, setWatchlist] = useState({});
  const dbPromise = useRef();

  useEffect(() => {
    (async () => {
      dbPromise.current = await connect();

      const stockRecords = await dbPromise.current.getAll('stocks');
      const stocks = stockRecords.reduce(
        (acc, stock) => ({ ...acc, [stock.symbol]: stock.amount }),
        {},
      );
      setStocks(stocks);

      const watchlistRecords = await dbPromise.current.getAll('watchlist');
      const watchlist = watchlistRecords.reduce(
        (acc, stock) => ({ ...acc, [stock.symbol]: null }),
        {},
      );
      setWatchlist(watchlist);
    })();
  }, []);

  const connect = () => {
    return db.connect('MMM-stonks');
  };

  const save = async () => {
    await Promise.all([
      dbPromise.current.clear('stocks'),
      dbPromise.current.clear('watchlist'),
    ]);
    const stockPromises = Object.entries(stocks)
      .filter(([symbol]) => !!symbol)
      .map(async ([symbol, amount]) => {
        return dbPromise.current.put('stocks', {
          symbol,
          amount,
        });
      });
    const watchlistPromises = Object.entries(watchlist)
      .filter(([symbol]) => !!symbol)
      .map(async ([symbol]) => {
        return dbPromise.current.put('watchlist', {
          symbol,
        });
      });
    await Promise.all([...stockPromises, watchlistPromises]);
  };

  return (
    <div>
      <h2>Aktier</h2>
      {Object.entries(stocks)
        .filter(([symbol]) => symbol != null)
        .map(([symbol, amount]) => (
          <div>
            <input
              type="text"
              value={symbol}
              onInput={(e) => {
                const _stocks = { ...stocks };
                delete _stocks[symbol];
                setStocks({
                  ..._stocks,
                  [e.target.value]: amount,
                });
              }}
            />
            <input
              type="number"
              value={amount}
              onInput={(e) => {
                setStocks({ ...stocks, [symbol]: Number(e.target.value) });
              }}
            />
            <button
              onClick={() => {
                const _stocks = { ...stocks };
                delete _stocks[symbol];
                setStocks(_stocks);
              }}
            >
              Ta bort
            </button>
          </div>
        ))}
      <button onClick={() => setStocks({ ...stocks, '': 0 })}>
        Lägg till ny
      </button>

      <hr />

      <h2>Bevakningar</h2>
      {Object.entries(watchlist)
        .filter(([symbol]) => symbol != null)
        .map(([symbol]) => (
          <div>
            <input
              type="text"
              value={symbol}
              onInput={(e) => {
                const _watchlist = { ...watchlist };
                delete _watchlist[symbol];
                setWatchlist({
                  ..._watchlist,
                  [e.target.value]: null,
                });
              }}
            />
            <button
              onClick={() => {
                const _watchlist = { ...watchlist };
                delete _watchlist[symbol];
                setWatchlist(_watchlist);
              }}
            >
              Ta bort
            </button>
          </div>
        ))}
      <button onClick={() => setWatchlist({ ...watchlist, '': null })}>
        Lägg till ny
      </button>

      <hr />

      <button onClick={save}>Spara</button>
    </div>
  );
};

render(<App />, document.getElementById('root'));
