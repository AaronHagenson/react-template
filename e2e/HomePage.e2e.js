module.exports = {
  before: function(browser) {
    let launchUrl = browser.launch_url;

    browser.url(launchUrl).waitForElementVisible('body', 1000);
  },
  after: function (browser) {
    browser.end();
  },
  'Check for Hello, World!': function(browser) {
    browser.waitForElementVisible('div.jumbotron', 10000)
      .assert.containsText('div.jumbotron', 'Hello, World!');
  }
};
