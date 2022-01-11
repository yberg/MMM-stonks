import { h } from 'preact';

import Stock from './Stock.jsx';
import Total from './Total.jsx';

/** @jsx h */

const Summary = ({ summary }) => {
  if (!summary) {
    return null;
  }

  const { change, changes, quotes, watchlist } = summary;
  const worst = changes.slice(0, 3);
  const best = changes
    .slice(changes.length - 3, changes.length)
    .sort((a, b) => b.change - a.change);

  return (
    <div className="container">
      <Total change={change} />
      <div className="space" />
      <div className="stocks">
        <div className="stocks__label">Bäst idag</div>
        {best.map((change) => (
          <Stock
            quote={quotes[change.symbol]}
            change={change.change}
            changePercent={change.changePercent}
          />
        ))}
        <div className="space" />
        <div className="stocks__label">Sämst idag</div>
        {worst.map((change) => (
          <Stock
            quote={quotes[change.symbol]}
            change={change.change}
            changePercent={change.changePercent}
          />
        ))}
      </div>
      <div className="space" />
      <div className="stocks">
        <div className="stocks__label">Bevakningar</div>
        {Object.entries(watchlist).map(([symbol, quote]) => (
          <Stock
            quote={quote}
            value={quote.regularMarketPrice}
            changePercent={quote.regularMarketChangePercent}
          />
        ))}
      </div>
    </div>
  );
};

export default Summary;
