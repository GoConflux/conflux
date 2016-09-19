
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

// Give jQuery a autoGrow method for textareas:
$.fn.autoGrow=function(a){return this.each(function(){var d=$.extend({extraLine:true},a);var e=function(g){$(g).after('<div class="autogrow-textarea-mirror"></div>');return $(g).next(".autogrow-textarea-mirror")[0]};var b=function(g){f.innerHTML=String(g.value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").replace(/\n/g,"<br />")+(d.extraLine?".<br/>.":"");if($(g).height()!=$(f).height()){$(g).height($(f).height())}};var c=function(){b(this)};var f=e(this);f.style.display="none";f.style.wordWrap="break-word";f.style.whiteSpace="normal";f.style.padding=$(this).css("paddingTop")+" "+$(this).css("paddingRight")+" "+$(this).css("paddingBottom")+" "+$(this).css("paddingLeft");f.style.width=$(this).css("width");f.style.fontFamily=$(this).css("font-family");f.style.fontSize=$(this).css("font-size");f.style.lineHeight=$(this).css("line-height");f.style.letterSpacing=$(this).css("letter-spacing");this.style.overflow="hidden";this.style.minHeight=this.rows+"em";this.onkeyup=c;this.onfocus=c;b(this)})};