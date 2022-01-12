import { render, h } from 'preact';

import Summary from './components/Summary.jsx';
import './style.scss';

/** @jsx h */

Module.register('MMM-stonks', {
  getStyles() {
    return ['main.css'];
  },

  async start() {
    this.loadSummary();
    setInterval(() => {
      this.loadSummary();
    }, 60000);
  },

  async loadSummary() {
    this.sendSocketNotification('STONKS:GET_SUMMARY');
  },

  socketNotificationReceived(notificationIdentifier, payload) {
    console.log({ notificationIdentifier, payload });
    if (notificationIdentifier === 'STONKS:GET_SUMMARY_RESPONSE') {
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
