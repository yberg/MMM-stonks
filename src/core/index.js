import { render, h } from "preact";
import "./style.scss";

/** @jsx h */

const formatValue = (value, currency = "SEK") =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency }).format(value);

const formatChange = (value) =>
  `${value < 0 ? "−" : "+"}${new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK"
  }).format(Math.abs(value))}`;

const formatChangePercent = (percent) =>
  `${percent < 0 ? "−" : "+"}${(Math.abs(percent) * 100).toFixed(2)}%`;

const Total = ({ change }) => {
  return (
    <div className="total">
      <div className="total__label">Idag</div>
      <div
        className={`total__change ${
          change.change < 0 ? "negative" : "positive"
        }`}
      >
        {formatChange(change.change)}&emsp;(
        {formatChangePercent(change.changePercent)})
      </div>
    </div>
  );
};

const Stock = ({ quote, value, change, changePercent }) => {
  return (
    <div className="stock">
      <img
        src={`/MMM-stonks/flags/${quote.exchange}.svg`}
        className="stock__flag"
        onError={(e) => (e.target.style.display = "none")}
      />
      <div className="stock__name">{quote.shortName}</div>
      <div
        className={`stock__change ${
          (change || changePercent) < 0 ? "negative" : "positive"
        }`}
      >
        {value && formatValue(value, quote.currency)}{" "}
        {change && formatChange(change)}&emsp;
        {changePercent && `(${formatChangePercent(changePercent)})`}
      </div>
    </div>
  );
};

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

Module.register("MMM-stonks", {
  getStyles() {
    return ["main.css"];
  },

  start() {
    this.loadSummary();
    setInterval(() => {
      this.loadSummary();
    }, 60000);
  },

  loadSummary() {
    this.sendSocketNotification("STONKS:SUMMARY_REQUEST");
  },

  socketNotificationReceived(notificationIdentifier, payload) {
    console.log({ notificationIdentifier, payload });
    if (notificationIdentifier === "STONKS:SUMMARY_RESPONSE") {
      Log.log(notificationIdentifier, payload);
      this.summary = payload;
      this.updateDom(250);
    }
  },

  getDom() {
    var wrapper = document.createElement("div");
    render(<Summary now={Date.now()} summary={this.summary} />, wrapper);
    return wrapper;
  }
});
