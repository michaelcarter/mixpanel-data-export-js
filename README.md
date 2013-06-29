Mixpanel Data Export JS Library
=========================================

Introduction
------------

Simply put, this is a coffeescript class that makes [Mixpanel's data export API](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) easy to use. Simply instantiate the class with your API secret and key and then make calls to api methods and get objects back.

If you don't use coffeescript, I've put the source through [js2coffee](http://js2coffee.org/) for a Javascript version, and also provided a minified Javascript version. These should work in exactly the same way.

Dependencies
------------

Currently, this requires the following libraries: 

 - [jQuery](http://jquery.com/)
 - [CryptoJS's MD5 implementation](https://code.google.com/p/crypto-js/)
 - [Underscore.js](http://underscorejs.org/)

I'm aware these aren't ideal or even all that necessary (especially underscore). I'll endeavour to remove jQuery and Underscore at some point. Special thanks to anyone that puts in a PR to do it first though!

Usage Instructions
------------------

Every method detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) is available in the library.

**Coffeescript Implementation**

```coffeescript
panel = new MixpanelExport
  api_key: "my_api_key"
  api_secret: "my_api_secret"

call_params = 
  from_date: "2013-06-13"
  to_date: "2013-06-29"
  born_event: "Rendering items"

panel.retention(call_params).done (data) ->
  console.log data
```

**JavaScript Implementation**

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

Looking through the source you'll probably notice that under the hood this just makes use of [jQuery's $.ajax() method](http://api.jquery.com/jQuery.ajax/), as such you can use your standard `.done()`, `.fail()`, `.always()` etc methods.

A full list of available API methods is detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js). If you find any that are missing please let me know, or better yet put in a pull request.
