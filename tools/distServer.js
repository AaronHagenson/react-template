// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import {chalkProcessing} from './chalkConfig';
import fs from 'fs';

/* eslint-disable no-console */

console.log(chalkProcessing('Opening production build...'));

// Run Browsersync
browserSync({
  port: 4000,
  ui: {
    port: 4001
  },
  server: {
    baseDir: 'dist'
  },

  files: [
    'src/*.html'
  ],

  middleware: [
    // Handle /configuration route
    function (req, res, next) {
      if (req.url.includes('/configuration')) {
        fs.readFile(`${__dirname}/../dist/config.json`, 'utf8', (err, data) => {
          if (err) {
            res.end(`Unable to locate default configuration.`);
          } else {
            res.setHeader('Content-Type', 'json');
            res.end(data);
          }
        });
      } else {
        next();
      }
    },

    historyApiFallback()
  ]
});
