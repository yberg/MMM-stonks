const NodeHelper = require('node_helper');
const Log = require('logger');

const api = require('./api');

module.exports = NodeHelper.create({
  start() {
    Log.log(this.name + ' is started!');
  },

  async socketNotificationReceived(notification, payload) {
    if (notification === 'STONKS:SUMMARY_REQUEST') {
      const summary = await api.getSummary({
        stocks: payload.stocks,
        watchlist: payload.watchlist,
      });
      this.sendSocketNotification('STONKS:SUMMARY_RESPONSE', summary);
    }
  },
});
