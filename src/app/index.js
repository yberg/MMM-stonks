import { render, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

/** @jsx h */

const BASE_URL = 'http://localhost:8008';

const App = ({}) => {
  const [stocks, setStocks] = useState({});
  const [watchlist, setWatchlist] = useState({});

  useEffect(() => {
    (async () => {
      const stocks = await getStocks();
      setStocks(stocks);

      const watchlist = await getWatchlist();
      setWatchlist(watchlist);
    })();
  }, []);

  const getStocks = async () => {
    const res = await fetch(`${BASE_URL}/stocks`);
    return res.json();
  };

  const saveStocks = async () => {
    const res = await fetch(`${BASE_URL}/stocks`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stocks),
    });
    return res.json();
  };

  const getWatchlist = async () => {
    const res = await fetch(`${BASE_URL}/watchlist`);
    return res.json();
  };

  const saveWatchlist = async () => {
    const res = await fetch(`${BASE_URL}/watchlist`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(watchlist),
    });
    return res.json();
  };

  const save = async () => {
    await Promise.all([saveStocks(), saveWatchlist()]);
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
