import { h } from 'preact';

import { formatChange, formatChangePercent } from '../utils/format';

/** @jsx h */

const Total = ({ change }) => {
  return (
    <div className="total">
      <div className="total__label">Idag</div>
      <div
        className={`total__change ${
          change.change < 0 ? 'negative' : 'positive'
        }`}
      >
        {formatChange(change.change)}&emsp;(
        {formatChangePercent(change.changePercent)})
      </div>
    </div>
  );
};

export default Total;
