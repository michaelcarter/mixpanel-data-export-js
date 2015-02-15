var MixpanelExport = require('../../src/mixpanel_data_export');
var assert = require('assert');

describe('TopEvents', function() {

  var panel;

  beforeEach(function() {
    panel = new MixpanelExport({
      api_key: "test_key",
      api_secret: "test_secret"
    });
  });

  describe('the method', function() {

    it('works with a promise', function(done) {
      this.timeout(10000);

      panel.topEvents({
        type: 'general'
      }).then(function(data) {
        promiseData = data;
        assert.ok(data)
        done();
      });
    });

    it('works with a callback', function(done) {
      this.timeout(10000);

      panel.topEvents({
        type: 'general'
      }, function(data) {
        callbackData = data;
        assert.ok(data)
        done();
      });
    });

  });

});