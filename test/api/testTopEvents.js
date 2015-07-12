var MixpanelExport = require('../../src/mixpanel_data_export');
var testClientConfig = require('../testClientConfig');
var assert = require('assert');

describe('TopEvents', function() {

  var panel;

  beforeEach(function() {
    panel = new MixpanelExport(testClientConfig);
  });

  describe('the method', function() {

    it('works with a promise', function(done) {
      this.timeout(10000);

      panel.topEvents({
        type: 'general'
      }).then(function(data) {
        assert.ok(data);
        done();
      });
    });

    it('works with a callback', function(done) {
      this.timeout(10000);

      panel.topEvents({
        type: 'general'
      }, function(data) {
        assert.ok(data)
        done();
      });
    });

  });

});
