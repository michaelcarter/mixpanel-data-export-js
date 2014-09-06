Mixpanel Data Export (v 1.4.0)
==============================

Introduction
------------

Simply put, this is a JavaScript library that makes [Mixpanel's data export API](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) easy to use. Simply instantiate the class with your API secret and key and then make calls to api methods and get data back in a callback.

NPM Usage
---------

The npm name for the library is [mixpanel-data-export](https://npmjs.org/package/mixpanel-data-export), and you can use it just as you would below, with the standard `var MixpanelExport = require('mixpanel-data-export');`.

General Usage Instructions
--------------------------

Every method detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) is available in the library. However, where the `top` method is duplicated the method name has a specifier appended, so we get methods like `topProperties()`, and `topEvents()`.

The full list of methods is as follows:

 - `export(parameters, callback)` (node only, see: https://github.com/michaelcarter/mixpanel-data-export-js/issues/3)
 - `annotations(parameters, callback)`
 - `createAnnotation(parameters, callback)`
 - `updateAnnotation(parameters, callback)`
 - `events(parameters, callback)`
 - `topEvents(parameters, callback)`
 - `names(parameters, callback)`
 - `properties(parameters, callback)`
 - `topProperties(parameters, callback)`
 - `values(parameters, callback)`
 - `funnels(parameters, callback)`
 - `list(parameters, callback)`
 - `segmentation(parameters, callback)`
 - `numeric(parameters, callback)`
 - `sum(parameters, callback)`
 - `average(parameters, callback)`
 - `retention(parameters, callback)`
 - `engage(parameters, callback)` (node only, see: https://github.com/michaelcarter/mixpanel-data-export-js/issues/6)

An example usage might be:

```javascript
panel = new MixpanelExport({
  api_key: "my_api_key",
  api_secret: "my_api_secret"
});

result = panel.retention({
  from_date: "2014-02-28",
  to_date: "2014-03-10",
  born_event: "Rendering items"
}, function(data) {
  console.log(data);
});
```

A full list of available API methods is detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js). If you find any that are missing please let me know, or better yet put in a pull request.

Dependencies (only a concern for implementing in browser)
---------------------------------------------------------

Currently, this requires the following libraries:

 - [CryptoJS's MD5 implementation](https://code.google.com/p/crypto-js/) This will just need to be under the CryptoJS namespace when used in a browser. A simple inclusion may look like:

 ```html
<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js"></script>
<script src="mixpanel_data_export_min.js"></script>
 ```

