const concurrently = require('concurrently');
const path = require('path');

// Run client and server concurrently
concurrently([
  {
    command: 'node server/server.js',
    name: 'server',
    prefixColor: 'blue'
  },
  {
    command: 'npm start --prefix client',
    name: 'client',
    prefixColor: 'green'
  }
]); 