Mixpanel Data Export (v 1.8.2)
==============================

Simply put, this is a JavaScript library that makes [Mixpanel's data export API](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) easy to use. Simply instantiate the class with your API secret and key and then make calls to api methods and get correctly formatted data back via a promise, callback or stream.

## Installation

**Node:**

```javascript
var MixpanelExport = require('mixpanel-data-export');
```

**Browser (self-hosted):**

```html
<script src="your/path/to/mixpanel_data_export.min.js"></script>
```

## Usage Instructions

Every method detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) is available in the library. However, some of the namings have been adjusted to read more semantically, for example, `topEventProperties` , and `eventPropertyValues`. The full list of methods is as follows...

**Annotations:**
 - `annotations(parameters)`
 - `createAnnotation(parameters)`
 - `updateAnnotation(parameters)`

**Export:**
 - `export(parameters)` (node only, see: https://github.com/michaelcarter/mixpanel-data-export-js/issues/3)
 - `exportStream(parameters)` (node only, please see: [Streaming Exports](#streaming-exports))

**Events:**
 - `events(parameters)`
 - `topEvents(parameters)`
 - `eventNames(parameters)`

**Event Properties:**
 - `eventProperties(parameters)`
 - `topEventProperties(parameters)`
 - `eventPropertyValues(parameters)`

**Funnels:**
 - `funnels(parameters)`
 - `listFunnels(parameters)`

**Segmentation:**
 - `segmentation(parameters)`
 - `numericSegmentation(parameters)`
 - `sumSegmentation(parameters)`
 - `averageSegmentation(parameters)`

**Retention:**
 - `retention(parameters)`
 - `addiction(parameters)`

**People Analytics:**
 - `engage(parameters)` (node only, see: https://github.com/michaelcarter/mixpanel-data-export-js/issues/6)

An example usage might be:

```javascript
panel = new MixpanelExport({
  api_key: "my_api_key",
  api_secret: "my_api_secret"
});

panel.retention({
  from_date: "2014-02-28",
  to_date: "2014-03-10",
  born_event: "Rendering items"
}).then(function(data) {
  console.log(data);
});
```

Callbacks are also supported:

```javascript
result = panel.retention({
  from_date: "2014-02-28",
  to_date: "2014-03-10",
  born_event: "Rendering items"
}, function(data) {
  console.log(data);
});
```

A full list of available API methods is detailed on [mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js). If you find any that are missing please let me know, or better yet put in a pull request.

## Undocumented Endpoints
For any other requests (e.g. undocumented API endpoints), you can make raw requests to the API using `get`. The library will still handle all of param ordering and md5 signature stuff that the API requires, so you'll just need to supply a request type & parameters:

 - `panel.get(requestType, parameters)` 

 `requestType` expects an array forming a path to the endpoint. Taking the "top events" endpoint as an example - it's available at `http://mixpanel.com/api/2.0/events/top/`, so to request it you'd call `panel.get(['events', 'top'], parameters)`.


## Streaming Exports

Due to the large size of an export response, it's often appropriate to stream the data instead of waiting for it all:

```javascript 
// Create a stream object
var exportStream = panel.exportStream({
    from_date: "2015-03-01",
    to_date: "2015-03-02"
});

// Listen on stream data
exportStream.on('data', function(data) {
  // do something with it
});

// Listen for a stream error
exportStream.on('error', function(err) {
  // handle error
});

// Listen for the end of the stream
exportStream.on('end', function() {
  // move on to do other stuff
});

// Pause the stream
exportStream.pause()

// Resume the stream
exportStream.resume()
```

Please note this option is only available in node environments, it's not supported in browser.
