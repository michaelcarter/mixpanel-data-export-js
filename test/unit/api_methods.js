var MixpanelExport = require('../../src/mixpanel_data_export');
var assert = require("assert");

var panel = new MixpanelExport({
  api_key: "test_key",
  api_secret: "test_secret"
});

describe('API Methods', function(){
  describe('events', function(){
    it('has events method', function() {
      assert.ok(panel.events);
    });
  });

  describe('topEvents', function() {
    it('has topEvents method', function() {
      assert.ok(panel.topEvents);
    });
  });

  describe('eventNames', function() {
    it('has eventNames method', function() {
      assert.ok(panel.eventNames);
    });
  });

  describe('eventProperties', function() {
    it('has eventProperties method', function() {
      assert.ok(panel.eventProperties);
    });
  });

  describe('topEventProperties', function() {
    it('has topEventProperties method', function() {
      assert.ok(panel.topEventProperties);
    });
  });

  describe('eventPropertyValues', function() {
    it('has eventPropertyValues method', function() {
      assert.ok(panel.eventPropertyValues);
    });
  });

  describe('funnels', function() {
    it('has funnels method', function() {
      assert.ok(panel.funnels);
    });
  });

  describe('listFunnels', function() {
    it('has listFunnels method', function() {
      assert.ok(panel.listFunnels);
    });
  });

  describe('segmentation', function() {
    it('has segmentation method', function() {
      assert.ok(panel.segmentation);
    });
  });

  describe('numericSegmentation', function() {
    it('has numericSegmentation method', function() {
      assert.ok(panel.numericSegmentation);
    });
  });

  describe('sumSegmentation', function() {
    it('has sumSegmentation method', function() {
      assert.ok(panel.sumSegmentation);
    });
  });

  describe('averageSegmentation', function() {
    it('has averageSegmentation method', function() {
      assert.ok(panel.averageSegmentation);
    });
  });

  describe('retention', function() {
    it('has retention method', function() {
      assert.ok(panel.retention);
    });
  });

  describe('engage', function() {
    it('has engage method', function() {
      assert.ok(panel.engage);
    });
  });

  describe('addiction', function() {
    it('has addiction method', function() {
      assert.ok(panel.engage);
    });
  });
});

describe('_getSignature', function() {
  var sig;
  var sig2;

  beforeEach(function() {
    sig = panel._getSignature(['test1','test2','test3'], {
      test1: "test_value_1",
      test2: "test_value_2",
    });

    sig2 = panel._getSignature(['test1','test2','test3'], {
      test1: "test_value_1",
      test2: "test_value_changed_2",
    });
  });

  it('returns a different encoded string for different parameters', function() {
    assert.ok(sig.length);
    assert.ok(sig2.length);
    assert.notEqual(sig, sig2);
  });

  it('returns a valid md5', function() {
    assert.ok(sig.match(/^[0-9a-f]{32}$/i).length);
    assert.ok(sig2.match(/^[0-9a-f]{32}$/i).length);
  });
});

describe('_urlEncode', function() {
  it('JSON encodes and then URI encodes an array', function(){
    var result = panel._urlEncode(['test1','test2','test3']);
    assert.equal(result, '%5B%22test1%22%2C%22test2%22%2C%22test3%22%5D');
  });

  it('URI encodes anything else', function() {
    var result = panel._urlEncode('test parameter');
    assert.equal(result, 'test%20parameter');
  });
});

describe('_sigEncode', function() {
  it('JSON encodes an array', function(){
    var result = panel._sigEncode(['test1','test2','test3']);
    assert.equal(result, '["test1","test2","test3"]');
  });

  it('returns anything else', function() {
    var result = panel._sigEncode('test parameter');
    assert.equal(result, 'test parameter');
  });
});

describe('_getParameterString', function() {

  it('returns a url parameter string for a given hash', function() {
    var result = panel._getParameterString(['this', 'is', 'parameter', 'string'], {
      this: "test",
      is: "test number two",
      parameter: ['one', 'two', 'three', 'four'],
      string: "last parameter"
    });

    assert.equal(result, 'this=test&is=test%20number%20two&parameter=%5B%22one%22%2C%22two%22%2C%22three%22%2C%22four%22%5D&string=last%20parameter');
  });
});

describe('_requestParameterString', function() {
  var result;

  before(function() {
    result = panel._requestParameterString({
      this: "test",
      is: "test number two",
      parameter: ['one', 'two', 'three', 'four'],
      string: "last parameter"
    });
  });

  it('includes an api_key parameter', function() {
    assert.ok(result.match(/^api_key=.*$/i));
  });

  it('includes an expire parameter', function() {
    assert.ok(result.match(/^.*&expire=.*$/i));
  });

  it('includes a sig parameter', function() {
    assert.ok(result.match(/^.*&sig=.*$/i));
  });
});
