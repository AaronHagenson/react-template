/* eslint-disable no-console */
const port = process.env.PORT;
const dirName = process.env.SERVE_DIR_NAME || 'dist';

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

const defaultSettings = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist', 'config.json'), 'utf8'));

function loadConfiguration() {
  let settings = {};

  for (let property in defaultSettings) {
    if (defaultSettings.hasOwnProperty(property)) {
      settings[property] = getConfigurationSetting(property);
    }
  }

  return settings;
}

function getConfigurationSetting(name) {
  if (process.env[name]) {
    return process.env[name];
  } else {
    return defaultSettings[name];
  }
}

// serve production build
const serveStatic = require('serve-static');
app.use(serveStatic(__dirname + '/' + dirName));
const settings = loadConfiguration();
console.log('Starting with config options:');
for (let configOption in settings) {
  if (settings.hasOwnProperty(configOption)) {
    console.log(`${configOption}: ${settings[configOption]}`);
  }
}

app.get('/configuration', function (req, res) {
  res.send(settings);
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }

  console.log('listening at http://localhost:' + port);
});
