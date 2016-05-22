var MixpanelExport = require('../../src/mixpanel_data_export');
var testClientConfig = require('../testClientConfig');
var assert = require('assert');

describe('Endpoint Tests', function() {
  Object.keys(testClientConfig.testArgs).forEach(function(requestType) {
    describe(requestType, function() {
      beforeEach(function() {
        panel = new MixpanelExport(testClientConfig);
      });

      describe('the method', function() {

        it('works with a promise', function(done) {
          this.timeout(10000);

          panel[requestType](testClientConfig.testArgs[requestType])
            .then(function(data) {
              var keys = Object.keys(data);
              assert.ok(keys.indexOf('error') === -1);
              done();
            });
        });

        it('works with a callback', function(done) {
          this.timeout(10000);

          panel[requestType](testClientConfig.testArgs[requestType], function(data) {
            var keys = Object.keys(data);
            assert.ok(keys.indexOf('error') === -1);
            done();
          });
        });

      });
    });
  });
});
