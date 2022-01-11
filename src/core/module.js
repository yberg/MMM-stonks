import { render, h } from 'preact';

import * as dbUtils from '../utils/db';
import Summary from './components/Summary.jsx';
import './style.scss';

/** @jsx h */

Module.register('MMM-stonks', {
  getStyles() {
    return ['main.css'];
  },

  async start() {
    this.db = await this.connect();

    this.loadSummary();
    setInterval(() => {
      this.loadSummary();
    }, 60000);
  },

  async loadSummary() {
    const stocks = await this.db.getAll('stocks');
    const watchlist = await this.db.getAll('watchlist');
    this.sendSocketNotification('STONKS:SUMMARY_REQUEST', { stocks, watchlist });
  },

  async connect() {
    return dbUtils.connect('MMM-stonks');
  },

  socketNotificationReceived(notificationIdentifier, payload) {
    console.log({ notificationIdentifier, payload });
    if (notificationIdentifier === 'STONKS:SUMMARY_RESPONSE') {
      Log.log(notificationIdentifier, payload);
      this.summary = payload;
      this.updateDom(250);
    }
  },

  getDom() {
    var wrapper = document.createElement('div');
    render(<Summary summary={this.summary} />, wrapper);
    return wrapper;
  },
});
