import { openDB } from 'idb';

export const connect = (db) => {
  return openDB(db, 1, {
    upgrade(db, oldVersion) {
      switch (oldVersion) {
        case 0:
          db.createObjectStore('stocks', { keyPath: 'symbol' });
          db.createObjectStore('watchlist', { keyPath: 'symbol' });
      }
    },
  });
};
