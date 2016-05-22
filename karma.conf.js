'use strict';

var customLaunchers = {
  win10chrome: { base: 'SauceLabs', browserName: 'chrome', platform: 'Windows 10' },
  win10firefox: { base: 'SauceLabs', browserName: 'firefox', platform: 'Windows 10' },
  win10ie11: { base: 'SauceLabs', browserName: 'internet explorer', platform: 'Windows 10' },
  win7ie9: { base: 'SauceLabs', browserName: 'internet explorer', platform: 'Windows 7', version: '9.0' },
  androidChrome: { base: 'SauceLabs', browserName: 'android', platform: 'Linux' },
  iosSafari: { base: 'SauceLabs', browserName: 'iphone', platform: 'OS X 10.10' },
  iosSafari92: { base: 'SauceLabs', browserName: 'iphone', platform: 'OS X 10.10', version: '9.2' }
};

module.exports = function(config) {
  config.set({
    browsers: [ 'Chrome' ],
    singleRun: true,
    frameworks: [ 'mocha' ],
    files: [
      'tmp/browserified_tests.js'
    ],
    reporters: [ 'spec' ],
    client: {
      captureConsole: true,
      timeout: 10000
    }
  });

  if (process.env.USE_CLOUD) {
    config.customLaunchers = customLaunchers;
    config.browsers = Object.keys(customLaunchers);
    config.startConnect = true;
    config.connectOptions = {
      verbose: false,
      verboseDebugging: false
    };
    config.browserNoActivityTimeout = 30000;
  }
};