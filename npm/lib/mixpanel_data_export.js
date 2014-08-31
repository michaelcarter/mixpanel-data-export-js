if (typeof window !== "object" && typeof require === "function") {
  var CryptoJS       = require("cryptojs").Crypto;
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}

var MixpanelExport = (function() {

  function MixpanelExport(opts) {
    this.opts = opts;
    if (!(this.opts.api_key && this.opts.api_secret)) {
      throw "Error: api_key and api_secret must be passed to MixpanelExport constructor.";
    }
    this.api_key = this.opts.api_key;
    this.api_secret = this.opts.api_secret;
    this.timeout_after = this.opts.timeout_after || 10;
    this._requestNumber = 0;
  }

  MixpanelExport.prototype.export = function(parameters, callback) {
    if (typeof window === 'object') throw new Error("Export is only supported server-side at the moment. If you can figure out how to get the jsonp working for it drop us a PR!");
    return this.get("export", parameters, callback);
  }

  MixpanelExport.prototype.events = function(parameters, callback) {
    return this.get("events", parameters, callback);
  };

  MixpanelExport.prototype.topEvents = function(parameters, callback) {
    return this.get(["events", "top"], parameters, callback);
  };

  MixpanelExport.prototype.names = function(parameters, callback) {
    return this.get(["events", "names"], parameters, callback);
  };

  MixpanelExport.prototype.properties = function(parameters, callback) {
    return this.get(["events", "properties"], parameters, callback);
  };

  MixpanelExport.prototype.topProperties = function(parameters, callback) {
    return this.get(["events", "properties", "top"], parameters, callback);
  };

  MixpanelExport.prototype.values = function(parameters, callback) {
    return this.get(["events", "properties", "values"], parameters, callback);
  };

  MixpanelExport.prototype.funnels = function(parameters, callback) {
    return this.get(["funnels"], parameters, callback);
  };

  MixpanelExport.prototype.list = function(parameters, callback) {
    return this.get(["funnels", "list"], parameters, callback);
  };

  MixpanelExport.prototype.segmentation = function(parameters, callback) {
    return this.get(["segmentation"], parameters, callback);
  };

  MixpanelExport.prototype.numeric = function(parameters, callback) {
    return this.get(["segmentation", "numeric"], parameters, callback);
  };

  MixpanelExport.prototype.sum = function(parameters, callback) {
    return this.get(["segmentation", "sum"], parameters, callback);
  };

  MixpanelExport.prototype.average = function(parameters, callback) {
    return this.get(["segmentation", "average"], parameters, callback);
  };

  MixpanelExport.prototype.retention = function(parameters, callback) {
    return this.get(["retention"], parameters, callback);
  };

  MixpanelExport.prototype.engage = function(parameters, callback) {
    return this.get(["engage"], parameters, callback);
  };

  MixpanelExport.prototype.get = function(method, parameters, callback) {
    var self = this;

    // JSONP
    if (typeof window === 'object' && method !== "export") {
      var requestNumber = this._getNewRequestNumber();
      var requestUrl = this._buildRequestURL(method, parameters) + "&callback=mpSuccess" + requestNumber;
      var success = function(data) {
        var resultJSON = (method == "export") ? self.parseExportResult(data) : data;
        callback(resultJSON);
      }
      window['mpSuccess' + requestNumber] = success;
      var script = document.createElement("script");
      script.src = requestUrl;
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    // Node and "export".
    else {
      var requestUrl = this._buildRequestURL(method, parameters)
      var request = new XMLHttpRequest;
      var success = function() {
        var resultJSON = (method == "export") ? self.parseExportResult(this.responseText) : JSON.parse(this.responseText);
        callback(resultJSON);
      }
      request.onload = success;
      request.open("get", requestUrl, true);
      request.send();
    }
  };

  // Parses Mixpanel's strange formatting for the export endpoint.
  MixpanelExport.prototype.parseExportResult = function(result){
    var step1 = result.replace(new RegExp('\n', 'g'), ',');
    var step2 = '['+step1+']';
    var result = step2.replace(',]', ']');
    return JSON.parse(result);
  };

  MixpanelExport.prototype._buildRequestURL = function(method, parameters) {
    var apiStub = (method === "export") ? "https://data.mixpanel.com/api/2.0/" : "https://mixpanel.com/api/2.0/";
    return "" + apiStub + ((typeof method.join === "function" ? method.join("/") : void 0) || method) + "/?" + (this._requestParameterString(parameters));
  };

  MixpanelExport.prototype._requestParameterString = function(args) {
    var connection_params, keys, sig_keys;
    connection_params = this._extend({
      api_key: this.api_key,
      expire: this._timeout()
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

  MixpanelExport.prototype._getNewRequestNumber = function() {
    return this._requestNumber++;
  };

  return MixpanelExport;

})();

if (typeof window !== "object" && typeof require === "function") {
  module.exports = MixpanelExport;
}