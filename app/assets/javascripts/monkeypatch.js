
// File to monkey patch React and add other sweet methods

React.get = function (url, data, options) {
  React.ajax('GET', url, data, options);
};

React.post = function (url, data, options) {
  React.ajax('POST', url, data, options);
};

React.put = function (url, data, options) {
  React.ajax('PUT', url, data, options);
};

React.delete = function (url, data, options) {
  React.ajax('DELETE', url, data, options);
};


React.ajax = function (verb, url, data, options) {
  options = options || {};

  var requestInfo = _.extend(options, {
    method: verb,
    url: url
  });

  if (_.contains(['POST', 'PUT'], verb)) {
    data = data || {};
    requestInfo.contentType = 'application/json';
    requestInfo.data = JSON.stringify(data);
  } else {
    if (data) {
      requestInfo.url += ('?' + React.createQueryParams(data));
    }
  }

  $.ajax(requestInfo);
};

React.createQueryParams = function (data) {
  var keys = _.keys(data);

  return _.map(keys, function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  }).join('&');
};

React.setCookie = function (name, value) {
  var days_til_expiration = 30;
  var date = new Date();
  date.setTime(date.getTime() + (days_til_expiration * 24 * 60 * 60 * 1000));
  var expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires;
};

React.cloudfront = 'https://ds8ypexjwou5.cloudfront.net';