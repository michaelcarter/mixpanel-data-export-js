var CryptoJS = require("cryptojs").Crypto;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var MixpanelExport;

MixpanelExport = (function() {

  function MixpanelExport(opts) {
    this.opts = opts;
    if (!(this.opts.api_key && this.opts.api_secret)) {
      throw "Error: api_key and api_secret must be passed to Mixpanel constructor.";
    }
    this.api_key = this.opts.api_key;
    this.api_secret = this.opts.api_secret;
    this.api_stub = this.opts.api_stub || "http://mixpanel.com/api/2.0/";
    this.timeout_after = this.opts.timeout_after || 10;
  }

  MixpanelExport.prototype.events = function(parameters) {
    return this.get("events", parameters);
  };

  // Remove in a later release.
  MixpanelExport.prototype.top_events = function(parameters) {
    return this.get(["events", "top"], parameters);
  };

  MixpanelExport.prototype.topEvents = function(parameters) {
    return this.get(["events", "top"], parameters);
  };

  MixpanelExport.prototype.names = function(parameters) {
    return this.get(["events", "names"], parameters);
  };

  MixpanelExport.prototype.properties = function(parameters) {
    return this.get(["events", "properties"], parameters);
  };

  // Remove in a later release.
  MixpanelExport.prototype.top_properties = function(parameters) {
    return this.get(["events", "properties", "top"], parameters);
  };

  MixpanelExport.prototype.topProperties = function(parameters) {
    return this.get(["events", "properties", "top"], parameters);
  };

  MixpanelExport.prototype.values = function(parameters) {
    return this.get(["events", "properties", "values"], parameters);
  };

  MixpanelExport.prototype.funnels = function(parameters) {
    return this.get(["funnels"], parameters);
  };

  MixpanelExport.prototype.list = function(parameters) {
    return this.get(["funnels", "list"], parameters);
  };

  MixpanelExport.prototype.segmentation = function(parameters) {
    return this.get(["segmentation"], parameters);
  };

  MixpanelExport.prototype.numeric = function(parameters) {
    return this.get(["segmentation", "numeric"], parameters);
  };

  MixpanelExport.prototype.sum = function(parameters) {
    return this.get(["segmentation", "sum"], parameters);
  };

  MixpanelExport.prototype.average = function(parameters) {
    return this.get(["segmentation", "average"], parameters);
  };

  MixpanelExport.prototype.retention = function(parameters) {
    return this.get(["retention"], parameters);
  };

  MixpanelExport.prototype.engage = function(parameters) {
    return this.get(["engage"], parameters);
  };

  MixpanelExport.prototype.get = function(method, parameters) {
    var result;
    result = {
      request_url: this._buildRequestURL(method, parameters),
      req: new XMLHttpRequest,
      done: function(data) {
        throw "[MixpanelExport] You must implement the .done(json) method on the result of your API call!";
      },
      get: function() {
        var _this = this;
        this.req.open("get", this.request_url, true);
        this.req.onload = function() {
          result = JSON.parse(_this.req.responseText);
          return _this.done(result);
        };
        return this.req.send();
      }
    };
    result.get();
    return result;
  };

  MixpanelExport.prototype._buildRequestURL = function(method, parameters) {
    return "" + this.api_stub + ((typeof method.join === "function" ? method.join("/") : void 0) || method) + "/?" + (this._requestParameterString(parameters));
  };

  MixpanelExport.prototype._requestParameterString = function(args) {
    var connection_params, keys, sig_keys;
    connection_params = this._extend({
      api_key: this.api_key,
      expire: this._timeout(),
      callback: ""
    }, args);
    keys = this._keys(connection_params).sort();
    sig_keys = this._without(keys, "callback");
    return this._getParameterString(keys, connection_params) + "&sig=" + this._getSignature(sig_keys, connection_params);
  };

  MixpanelExport.prototype._getParameterString = function(keys, connection_params) {
    var _this = this;
    return this._map(keys, (function(key) {
      return "" + key + "=" + (_this._urlEncode(connection_params[key]));
    })).join("&");
  };

  MixpanelExport.prototype._getSignature = function(keys, connection_params) {
    var sig,
      _this = this;
    sig = this._map(keys, (function(key) {
      return "" + key + "=" + (_this._sigEncode(connection_params[key]));
    })).join("") + this.api_secret;
    return CryptoJS.MD5(sig);
  };

  MixpanelExport.prototype._urlEncode = function(param) {
    if (Array.isArray(param)) {
      return encodeURIComponent(JSON.stringify(param));
    } else {
      return encodeURIComponent(param);
    }
  };

  MixpanelExport.prototype._sigEncode = function(param) {
    if (Array.isArray(param)) {
      return JSON.stringify(param);
    } else {
      return param;
    }
  };

  MixpanelExport.prototype._timeout = function() {
    return Math.round(new Date().getTime() / 1000) + this.timeout_after;
  };

  MixpanelExport.prototype._map = function(array, action) {
    var result, val, _i, _len;
    result = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      val = array[_i];
      result.push(action(val));
    }
    return result;
  };

  MixpanelExport.prototype._keys = function(obj) {
    var key, result;
    result = [];
    for (key in obj) {
      result.push(key);
    }
    return result;
  };

  MixpanelExport.prototype._without = function(array, key) {
    return array.filter((function(value) {
      return value !== key;
    }));
  };

  MixpanelExport.prototype._extend = function(obj, source) {
    var key, val;
    for (key in source) {
      val = source[key];
      obj[key] = val;
    }
    return obj;
  };

  return MixpanelExport;

})();

module.exports = MixpanelExport;