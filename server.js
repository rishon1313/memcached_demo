const express = require('express');
const Memcached = require('memcached');

const app = express();
const memcached = new Memcached('localhost:11211'); // Change this to your Memcached server's address

// In-memory "database" (for demonstration purposes)
const database = {};

app.use(express.json());

// Route to set a key-value pair in Memcached and the "database"
app.get('/set', (req, res) => {
  const key = req.query.key;
  const value = req.query.value;

  if (!key || !value) {
    return res.status(400).json({ error: 'Both key and value are required as URL parameters.' });
  }

  // First, check if the key is in Memcached
  memcached.get(key, (err, cachedValue) => {
    if (err) {
      console.error('Error getting value from Memcached:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (cachedValue) {
      // If found in Memcached, return it
      return res.status(200).json({ key, value: cachedValue });
    }

    // If not in Memcached, store it in both Memcached and the "database"
    memcached.set(key, value, 10000, (err) => {
      if (err) {
        console.error('Error setting value in Memcached:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Store in "database" (for demonstration purposes)
      database[key] = value;

      res.status(201).json({ message: 'Value stored in Memcached and database' });
    });
  });
});

// Route to get a value from Memcached or the "database"
app.get('/get', (req, res) => {
  const key = req.query.key;

  if (!key) {
    return res.status(400).json({ error: 'Key is required as a URL parameter.' });
  }

  // First, check if the key is in Memcached
  memcached.get(key, (err, cachedValue) => {
    if (err) {
      console.error('Error getting value from Memcached:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (cachedValue) {
      // If found in Memcached, return it
      return res.status(200).json({ key, value: cachedValue });
    }

    // If not in Memcached, check the "database" (for demonstration purposes)
    const valueFromDatabase = database[key];

    if (valueFromDatabase) {
      // If found in the "database," store it in Memcached for future requests
      memcached.set(key, valueFromDatabase, 0, 0, (err) => {
        if (err) {
          console.error('Error setting value in Memcached:', err);
        }
      });

      return res.status(200).json({ key, value: valueFromDatabase });
    }

    // If not found in Memcached or the "database," return a "Not Found" response
    return res.status(404).json({ error: 'Key not found in Memcached or database' });
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
