const storage = require('node-persist');
const axios = require('axios');

const BASE_URL = 'https://free.currconv.com/api/v7/convert';

const getDateString = () => {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}-${date.getDate()}`;
  return dateString;
};

const getStoredConversionRate = async (from, to) => {
  await storage.init({ dir: 'modules/MMM-stonks/storage' });
  const rates = await storage.getItem('rates');
  return rates?.[from]?.[to]?.[getDateString()];
};

const getLastStoredConversionRate = async (from, to) => {
  await storage.init({ dir: 'modules/MMM-stonks/storage' });
  const rates = await storage.getItem('rates');
  return rates?.[from]?.[to]?.last || 1;
};

const storeConversionRate = async (from, to, rate) => {
  await storage.init({ dir: 'modules/MMM-stonks/storage' });
  const rates = (await storage.getItem('rates')) || {};
  if (!rates[from]) {
    rates[from] = {};
  }
  if (!rates[from][to]) {
    rates[from][to] = {};
  }
  rates[from][to][getDateString()] = rate;
  rates[from][to].last = rate;
  await storage.setItem('rates', rates);
};

export const getConversionRate = async (from, to, apiKey) => {
  if (from === to) {
    return 1;
  }

  const storedRate = await getStoredConversionRate(from, to);
  if (storedRate) {
    return storedRate;
  }

  let rate;
  try {
    const data = await axios.get(BASE_URL, {
      params: {
        q: `${from}_${to}`,
        compact: 'ultra',
        apiKey: apiKey,
      },
    });
    rate = data.data[`${from}_${to}`];
    await storeConversionRate(from, to, rate);
  } catch (error) {
    rate = await getLastStoredConversionRate(from, to);
  }
  return rate;
};
