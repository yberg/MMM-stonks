const NodeHelper = require('node_helper');
const Log = require('logger');
const storage = require('node-persist');

const api = require('./api');
const { start: startServer } = require('./server');

module.exports = NodeHelper.create({
  start() {
    Log.log(this.name + ' is started!');
    startServer();
  },

  async socketNotificationReceived(notification, payload) {
    if (notification === 'STONKS:GET_SUMMARY') {
      await storage.init({ dir: 'modules/MMM-stonks/storage' });
      const stocks = await storage.getItem('stocks');
      const watchlist = await storage.getItem('watchlist');
      const summary = await api.getSummary({
        stocks,
        watchlist,
      });
      this.sendSocketNotification('STONKS:GET_SUMMARY_RESPONSE', summary);
    }
  },
});
