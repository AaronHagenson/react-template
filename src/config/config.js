import axios from 'axios';
import $ from 'jquery';

const isIis = require('./configSource');

let config = {};
let loaded = false;

export function trimTrailingSlash(path) {
  if (path.charAt(path.length - 1) === '/') {
    return path.substring(0, path.length - 1);
  } else {
    return path;
  }
}

function loadNodeConfiguration() {
  return new Promise((resolve, reject) => {
    axios.get(`${location.origin}/configuration`)
      .then(response => {
        config = response.data;
        resolve();
        loaded = true;
      })
      .catch(err => {
        loaded = false;
        reject(`Unable to get configuration: ${err}`);
      });
  });
}

function loadIisConfiguration() {
  return new Promise((resolve, reject) => {
    let absoluteRoot = global.window.location.origin + global.window.location.pathname;
    absoluteRoot = trimTrailingSlash(absoluteRoot);

    $.getJSON(`${absoluteRoot}/config.json`, data => {
      config = data;
      resolve();
      loaded = true;
    }, err => {
      loaded = false;
      reject(`Unable to get configuration: ${err}`);
    });
  });
}

const Config = {
  loadConfiguration: () => {
    if (isIis.isIis()) {
      return loadIisConfiguration();
    } else {
      return loadNodeConfiguration();
    }
  },
  getConfig: () => {
    if (loaded) {
      return config;
    } else {
      throw 'Config not loaded';
    }
  }
};

export default Config;
