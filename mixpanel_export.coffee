class MixpanelExport

  constructor: (@opts) ->
    unless @opts.api_key and @opts.api_secret
      throw "Error: api_key and api_secret must be passed to Mixpanel constructor."

    @api_key = @opts.api_key
    @api_secret = @opts.api_secret
    @api_stub = "//mixpanel.com/api/2.0/" or @opts.api_stub
    @timeout_after = 10 or @opts.timeout_after

  events: (parameters) -> @get("events", parameters)

  top_events: (parameters) -> @get(["events", "top"], parameters)

  names: (parameters) -> @get(["events", "names"], parameters)

  properties: (parameters) -> @get(["events", "properties"], parameters)

  top_properties: (parameters) -> @get(["events", "properties", "top"], parameters)

  values: (parameters) -> @get(["events", "properties", "values"], parameters)

  funnels: (parameters) -> @get(["funnels"], parameters)

  list: (parameters) -> @get(["funnels", "list"], parameters)

  segmentation: (parameters) -> @get(["segmentation"], parameters)

  numeric: (parameters) -> @get(["segmentation", "numeric"], parameters)

  sum: (parameters) -> @get(["segmentation", "sum"], parameters)

  average: (parameters) -> @get(["segmentation", "average"], parameters)

  retention: (parameters) -> @get(["retention"], parameters)

  engage: (parameters) -> @get(["engage"], parameters)

  get: (method, parameters) ->
    result =
      request_url: @_build_request_url(method, parameters)
      req: new XMLHttpRequest
      done: (data) -> throw "[MixpanelExport] You must implement the .done(json) method on the result of your API call!"
      get: ->
        @req.open "get", @request_url, true
        @req.onload = => 
          result = JSON.parse(@req.responseText)
          @done(result)
        @req.send()

    result.get()
    result

  _build_request_url: (method, parameters) ->
    "#{@api_stub}#{method.join?("/") or method}/?#{@_request_parameter_string(parameters)}"

  _request_parameter_string: (args) ->
    connection_params = @_extend
      api_key: @api_key
      expire: @_timeout()
      callback: ""
    , args

    keys = @_keys(connection_params).sort()
    sig_keys = @_without(keys, "callback")

    @_get_parameter_string(keys, connection_params) + "&sig=" + @_get_signature(sig_keys, connection_params)

  _get_parameter_string: (keys, connection_params) ->
    @_map(keys, ((key) => "#{key}=#{@_url_encode(connection_params[key])}")).join("&")

  _get_signature: (keys, connection_params) ->
    sig = @_map(keys, ((key) => "#{key}=#{@_sig_encode(connection_params[key])}")).join("") + @api_secret
    CryptoJS.MD5(sig)    

  _url_encode: (param) ->
    if Array.isArray(param)
      encodeURIComponent(JSON.stringify(param))
    else
      param

  _sig_encode: (param) ->
    if Array.isArray(param)
      JSON.stringify(param)
    else
      param

  _timeout: ->
    Math.round(new Date().getTime()/1000) + @timeout_after

  # Begin underscore replacements
  
  _map: (array, action) ->    
    result = []
    result.push action(val) for val in array
    result

  _keys: (obj) ->
    result = [];
    result.push key for key of obj
    result

  _without: (array, key) ->
    array.filter ((value) -> value != key)

  _extend: (obj, source) ->
    obj[key] = val for key, val of source
    obj
