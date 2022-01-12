const express = require('express');
const cors = require('cors');
const storage = require('node-persist');

export const start = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const port = 8008;

  const storageOptions = {
    dir: 'modules/MMM-stonks/storage',
  };

  app.get('/stocks', async (req, res) => {
    await storage.init(storageOptions);
    const stocks = await storage.getItem('stocks');
    res.json(stocks);
  });

  app.put('/stocks', async (req, res) => {
    await storage.init(storageOptions);
    await storage.setItem('stocks', req.body);
    res.send(200);
  });

  app.get('/watchlist', async (req, res) => {
    await storage.init(storageOptions);
    const watchlist = await storage.getItem('watchlist');
    res.json(watchlist);
  });

  app.put('/watchlist', async (req, res) => {
    await storage.init(storageOptions);
    await storage.setItem('watchlist', req.body);
    res.send(200);
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};
