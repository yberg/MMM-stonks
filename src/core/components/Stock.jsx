import { h } from 'preact';

import {
  formatValue,
  formatChange,
  formatChangePercent,
} from '../utils/format';

/** @jsx h */

const Stock = ({ quote, value, change, changePercent }) => {
  return (
    <div className="stock">
      <img
        src={`/MMM-stonks/flags/${quote.exchange}.svg`}
        className="stock__flag"
        onError={(e) => (e.target.style.display = 'none')}
      />
      <div className="stock__name">{quote.shortName}</div>
      <div
        className={`stock__change ${
          (change || changePercent) < 0 ? 'negative' : 'positive'
        }`}
      >
        {value && formatValue(value, quote.currency)}{' '}
        {change && formatChange(change)}&emsp;
        {changePercent && `(${formatChangePercent(changePercent)})`}
      </div>
    </div>
  );
};

export default Stock;
