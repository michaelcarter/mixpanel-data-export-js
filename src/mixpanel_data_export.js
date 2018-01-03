var md5 = require("js-md5");
var Q = require("q");
var _ = {
  extend: require('amp-extend'),
};

if (typeof window !== "object" && typeof require === "function") {
  require('Base64');
}

var MixpanelExport = (function() {

  function MixpanelExport(opts) {
    this.opts = opts;
    if (!(this.opts.api_key && this.opts.api_secret)) {
      throw "Error: api_key and api_secret must be passed to MixpanelExport constructor.";
    }
    this.api_key = this.opts.api_key;
    this.api_secret = this.opts.api_secret;
    this.timeout_after = this.opts.timeout_after || 60;
    this.isNode = (typeof window !== 'object');
    this._requestNumber = 0;
  }

  // Node-only function. Not supported in browser due to lack of JSONP support on export endpoint.
  MixpanelExport.prototype.export = function(parameters, callback) {
    if (!this.isNode) throw new Error(this._browserUnsupported("export"));
    return this.get("export", parameters, callback);
  };

  // Node-only function. Not supported in browser due to lack of JSONP support on engage endpoint.
  MixpanelExport.prototype.engage = function(parameters, callback) {
    if (!this.isNode) throw new Error(this._browserUnsupported("engage"));
    return this.get(["engage"], parameters, callback);
  };

  MixpanelExport.prototype.annotations = function(parameters, callback) {
    return this.get("annotations", parameters, callback);
  };

  MixpanelExport.prototype.createAnnotation = function(parameters, callback) {
    return this.get(["annotations", "create"], parameters, callback);
  };

  MixpanelExport.prototype.updateAnnotation = function(parameters, callback) {
    return this.get(["annotations", "update"], parameters, callback);
  };

  MixpanelExport.prototype.deleteAnnotation = function(parameters, callback) {
    return this.get(["annotations", "delete"], parameters, callback);
  };

  MixpanelExport.prototype.events = function(parameters, callback) {
    return this.get("events", parameters, callback);
  };

  MixpanelExport.prototype.topEvents = function(parameters, callback) {
    return this.get(["events", "top"], parameters, callback);
  };

  MixpanelExport.prototype.eventNames = function(parameters, callback) {
    return this.get(["events", "names"], parameters, callback);
  };

  MixpanelExport.prototype.eventProperties = function(parameters, callback) {
    return this.get(["events", "properties"], parameters, callback);
  };

  MixpanelExport.prototype.topEventProperties = function(parameters, callback) {
    return this.get(["events", "properties", "top"], parameters, callback);
  };

  MixpanelExport.prototype.eventPropertyValues = function(parameters, callback) {
    return this.get(["events", "properties", "values"], parameters, callback);
  };

  MixpanelExport.prototype.funnels = function(parameters, callback) {
    return this.get(["funnels"], parameters, callback);
  };

  MixpanelExport.prototype.listFunnels = function(parameters, callback) {
    return this.get(["funnels", "list"], parameters, callback);
  };

  MixpanelExport.prototype.segmentation = function(parameters, callback) {
    return this.get(["segmentation"], parameters, callback);
  };
  
  MixpanelExport.prototype.multiseg = function(parameters, callback) {
    return this.get(["segmentation/multiseg"], parameters, callback);
  };


  MixpanelExport.prototype.numericSegmentation = function(parameters, callback) {
    return this.get(["segmentation", "numeric"], parameters, callback);
  };

  MixpanelExport.prototype.sumSegmentation = function(parameters, callback) {
    return this.get(["segmentation", "sum"], parameters, callback);
  };

  MixpanelExport.prototype.averageSegmentation = function(parameters, callback) {
    return this.get(["segmentation", "average"], parameters, callback);
  };

  MixpanelExport.prototype.retention = function(parameters, callback) {
    return this.get(["retention"], parameters, callback);
  };

  MixpanelExport.prototype.addiction = function(parameters, callback) {
    return this.get(["retention", "addiction"], parameters, callback);
  };

  MixpanelExport.prototype.get = function(method, parameters, callback) {
    var deferred = Q.defer();
    var getMethod = ((this.isNode) ? 'node' : 'jsonp');

    this['_'+ getMethod + 'Get'](method, parameters, function(data) {
      if (callback) {
        return callback(data);
      }
      deferred.resolve(data);
    });

    return deferred.promise;
  };

  // PRIVATE METHODS:

  // a JSONP implementation of 'get' for the browser, uses deprecated auth
  // because we can't set basic authentication headers on JSONP requests.
  MixpanelExport.prototype._jsonpGet = function(method, parameters, callback) {
    var self = this;
    var requestNumber = this._requestNumber++
    var requestUrl = this._buildDeprecatedAuthURL(method, parameters) + "&callback=mpSuccess" + requestNumber;
    var script = document.createElement("script");
    window['mpSuccess' + requestNumber] = function(response) {
      callback(self._parseResponse(method, parameters, response));
    };
    script.src = requestUrl;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  MixpanelExport.prototype._nodeGet = function(method, parameters, callback) {
    var request = this._xmlHttpRequest();
    var self = this;

    request.open("get", this._buildRequestURL(method, parameters), true);
    request.setRequestHeader('Authorization', 'Basic ' + this._base64Encode(this.api_secret + ':'));
    request.onload = function() {
      callback(self._parseResponse(method, parameters, this.responseText));
    };
    request.send();
  };

  MixpanelExport.prototype._browserUnsupported = function(methodName) {
    return "MixpanelExport: The '" + methodName + "' method cannot be used in your browser.";
  };

  // Parses Mixpanel's strange formatting for the export endpoint.
  MixpanelExport.prototype._parseResponse = function(method, parameters, result) {
    if (parameters && parameters.format === "csv") {
      return result;
    }

    if (typeof result === "object") {
      return result;
    }

    if (method === "export") {
      var step1 = result.replace(new RegExp('\n', 'g'), ',');
      var step2 = '['+step1+']';
      var result = step2.replace(',]', ']');
      return JSON.parse(result);
    }

    return JSON.parse(result);
  };

  MixpanelExport.prototype._buildRequestURL = function(method, parameters) {
    if (!parameters) {
      parameters = {};
    }
    return this._buildAPIStub(method, parameters) + this._getParameterString(Object.keys(parameters), parameters);
  };

  MixpanelExport.prototype._buildDeprecatedAuthURL = function(method, parameters) {
    return this._buildAPIStub(method, parameters) + this._getDeprecatedAuthParameterString(parameters);
  };

  MixpanelExport.prototype._buildAPIStub = function(method) {
    var apiStub = (method === "export") ? "https://data.mixpanel.com/api/2.0/" : "https://mixpanel.com/api/2.0/";
    apiStub += (typeof method.join === "function") ? method.join("/") : method;
    apiStub += "/?";

    return apiStub;
  };

  MixpanelExport.prototype._getDeprecatedAuthParameterString = function(parameters) {
    var connection_params = _.extend({
      api_key: this.api_key,
      expire: Math.round(new Date().getTime() / 1000) + this.timeout_after
    }, parameters);
    var keys = Object.keys(connection_params).sort();
    var sig_keys = keys.filter(function(key) {
      return key !== "callback"
    });

    return this._getParameterString(keys, connection_params) + "&sig=" + this._getSignature(sig_keys, connection_params);
  };

  MixpanelExport.prototype._getParameterString = function(keys, connection_params) {
    var self = this;

    return keys.map(function(key) {
      return "" + key + "=" + (self._urlEncode(connection_params[key]));
    }).join("&");
  };

  MixpanelExport.prototype._getSignature = function(keys, connection_params) {
    var self = this;

    var sig = keys.map(function(key) {
      return "" + key + "=" + (self._stringifyIfArray(connection_params[key]));
    }).join("") + this.api_secret;

    return md5(sig);
  };

  MixpanelExport.prototype._urlEncode = function(param) {
    return encodeURIComponent(this._stringifyIfArray(param));
  };

  MixpanelExport.prototype._stringifyIfArray = function(array) {
    if (!Array.isArray(array)) {
      return array;
    }

    return JSON.stringify(array);
  };

  MixpanelExport.prototype._base64Encode = function(string) {
    if (typeof window === "object" && window.btoa) {
      return window.btoa(string)
    }
    return new Buffer(string).toString('base64');
  };

  MixpanelExport.prototype._xmlHttpRequest = function() {
    if (typeof window === "object" && window.XMLHttpRequest) {
      return new window.XMLHttpRequest;
    }
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    return new XMLHttpRequest;
  };

  return MixpanelExport;
})();

module.exports = MixpanelExport;
