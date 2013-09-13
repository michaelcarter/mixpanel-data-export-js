Mixpanel Data Export
====================

Introduction
------------

Simply put, this is a JavaScript class that makes [Mixpanel's data export API](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) easy to use. Simply instantiate the class with your API secret and key and then make calls to api methods and get objects back. A NPM is also provided for noders.

V 1.0.2 Notes
-------------
Version 1.0.2 brings some changes to more closely map method names to to the [data export API page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js). All method names are in camel case, but where the `top` method is duplicated the method name has a specifier appended. E.g. `topProperties`, and `topEvents`.

NPM Usage
---------

The npm name for the library is [mixpanel-data-export](https://npmjs.org/package/mixpanel-data-export), and you can use it just as you would below, with the standard `var MixpanelExport = require('mixpanel-data-export');` added at the beginning of your file.

General Usage Instructions
--------------------------

Every method detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) is available in the library. However, where the `top` method is duplicated the method name has a specifier appended. E.g. `topProperties`, and `topEvents`.

```javascript
panel = new MixpanelExport({
  api_key: "my_api_key",
  api_secret: "my_api_secret"
});

result = panel.retention({
  from_date: "2013-06-13", 
  to_date: "2013-06-29", 
  born_event: "Rendering items"
});

result.done(function (data) {
  console.log(data);
});
```

A full list of available API methods is detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js). If you find any that are missing please let me know, or better yet put in a pull request.

Dependencies
------------

Currently, this requires the following libraries: 

 - [CryptoJS's MD5 implementation](https://code.google.com/p/crypto-js/)
 - [XmlHttpRequest](https://npmjs.org/package/xmlhttprequest) (NPM Only)

