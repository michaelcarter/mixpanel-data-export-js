var MixpanelExport = require('../../src/mixpanel_data_export');
var testClientConfig = require('../testClientConfig');
var assert = require('assert');
var Q = require('q');
var split = require('split');

var exportRequestOptions = {
  from_date: '2015-03-09',
  to_date: '2015-03-09'
}

describe('exportStream', function() {

  // Don't bother running these in the headless test browser.
  if (typeof window === "object") {
    return;
  }

  var panel;

  beforeEach(function() {
    panel = new MixpanelExport(testClientConfig);
  });

  describe('the method', function() {

    it('returns the same results using streaming or an ordinary export', function(done) {
      this.timeout(30000);

      var parseLine = function(line) {        
        return (line.length) ? JSON.parse(line) : undefined;
      };

      var streamExport = function(fetchOptions) {
        var deferred = Q.defer();
        var stream = panel.exportStream(fetchOptions).pipe(split(parseLine));
        var streamedData = [];
        
        stream.on('data', function(data) {
          streamedData.push(data);
        });

        stream.on('end', function() {
          deferred.resolve(streamedData);
        });

        stream.on('error', deferred.reject);

        return deferred.promise;
      };

      var promisedExports = [streamExport(exportRequestOptions), panel.export(exportRequestOptions)]

      Q.all(promisedExports)
        .then(function(exports) {
          assert(exports[0].length === exports[1].length);
          done();
        })
        .catch(function(err){
          console.error(err);
          done(err);
        });
    });

    it('streams objects and make pauses/resumes correctly', function(done) {
      this.timeout(30000);

      var stream = panel.exportStream(exportRequestOptions);
      var buffer = [];
      var smallBatchLength = 50;

      stream.on('data', function(data) {
        buffer.push(data);

        if (buffer.length >= smallBatchLength) {
          stream.pause();
          assert.ok(buffer.length == smallBatchLength);

          setTimeout(function() {
            buffer = [];
            stream.resume();
          }, 0)
        }
      });

      stream.on('error', done);
      stream.on('end', done);
    });

  });

});
