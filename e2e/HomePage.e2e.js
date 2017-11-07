module.exports = {
  'Start launch_url': function(browser) {
    let launchUrl = browser.launch_url;

    browser.url(launchUrl).waitForElementVisible('body', 1000);
  },
  'Check for Hello, World!': function(browser) {
    browser.assert.containsText('.jumbotron', 'Hello, World!');
    browser.end();
  }
};
