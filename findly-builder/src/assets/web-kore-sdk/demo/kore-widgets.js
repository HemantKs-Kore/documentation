//"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  //if (typeof define === 'function' && define.amd) { // AMD
  //    define(factory);
  //} else if (typeof module !== 'undefined') {      // CommonJS
  //    module.exports = factory();
  //} else {                                         // browser globals
  window.KoreWidgetSDK = factory(); //}
})(function () {
  var koreJquery;

  if (window && window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery) {
    //load kore's jquery version
    koreJquery = window.KoreSDK.dependencies.jQuery;
  } else {
    //fall back to clients jquery version
    koreJquery = window.jQuery;
  }

  var korejstz;
  if (window.jstz) {
    korejstz = window.jstz;
  } else {
    korejstz = requireKr(2).jstz;
  }

  var KRPerfectScrollbar;
  if (window.PerfectScrollbar && typeof PerfectScrollbar === 'function') {
    KRPerfectScrollbar = window.PerfectScrollbar;
  }

  return function ($, jstz, KRPerfectScrollbar) {
    //get dependencies as arguments here 

    /**
    * @param  {Object} KoreWidgetSDK Config
    */
    function KoreWidgetSDK(config) {
      // this.config=config;
      // this.config.container=this.config.container || "body";
      // if(typeof this.config.container==="string"){
      //     this.config.container=$(this.config.container);
      // }
      // this.bot = requireKr('/KoreBot.js').instance();
      // //this.config.botOptions.
      this.init(config);
      this.initVariables();
      this.jqueryManupulations(); //this.on=$(this).on;
      this.addPolyFils();
    }

    KoreWidgetSDK.prototype = Object.create($.prototype);
    KoreWidgetSDK.prototype.addPolyFils = function () {
      var _self = this;
      if (!Array.from) {
        Array.from = (function () {
          var toStr = Object.prototype.toString;
          var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
          };
          var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
          };
          var maxSafeInteger = Math.pow(2, 53) - 1;
          var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
          };

          // The length property of the from method is 1.
          return function from(arrayLike/*, mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
              throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
              // 5. else
              // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
              if (!isCallable(mapFn)) {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
              }

              // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
              if (arguments.length > 2) {
                T = arguments[2];
              }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
              kValue = items[k];
              if (mapFn) {
                A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
              } else {
                A[k] = kValue;
              }
              k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
          };
        }());
      }
    };
    KoreWidgetSDK.prototype.jqueryManupulations = function () {
      var _self = this; // $.fn.extend({
      //   tmplProxy: function(a,b,c){
      //     return this.tmpl(a,b,c);
      //   }
      // });     


      $.prototype.tmplProxy = function (a, b, c) {
        return this.tmpl($.extend(_self.getTemplateMethods(), a), b, c);
      };
    };

    KoreWidgetSDK.prototype.initVariables = function () {
      this.vars = {}; //use this vars to store any local data variable for sdk developers. Will be avaiable as "koreWidgetSDKInstance.vars"

      var vars = this.vars;
      vars.timezone = jstz.determine();
      vars.latitude = '';
      vars.longitude = '';
      //config = {};
      vars.initialWidgetData = {};
      vars.cacheData = [];
      vars.searchObject = {
        //recents:[]
      };
    }; //********************original widget.js start */


    KoreWidgetSDK.prototype.show = function (dataConfig, sel) {
      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;
      _self.config.container = sel || {}; //#TODO :need to remove below line on prod

      window.koreWidgetSDKInstance = _self;

      var currentTimezone = _self.vars.timezone.name();

      var latitude = _self.vars.latitude;
      var longitude = _self.vars.longitude;
      var config = _self.config;

      _self.getServerDataGen("/widgetsdk/" + config.botOptions.botInfo._id + "/panels?resolveWidgets=true&from=" + config.botOptions.userIdentity, 'get').done(function (response) {
        //_self.getServerDataGen("/api/1.1/ka/users/:userId/panels?tz=" + currentTimezone + "&lat=" + latitude + "&lon=" + longitude, 'get').done(function (response) {
        // getServerData("/api/1.1/ka/users/:userId/widgets?tz=" + currentTimezone + "&lat=" + latitude + "&lon=" + longitude, 'get').done(function(response){
        initialWidgetData.panels = response;
        var panelData = [];

        for (var i = 0; i < initialWidgetData.panels.length; i++) {
          //todo: deviation :adding "id" from "_id"
          if (initialWidgetData.panels[i].widgets && initialWidgetData.panels[i].widgets.length) {
            initialWidgetData.panels[i].widgets.forEach(function (widget) {
              if (!widget.id) {
                widget.id = widget._id;
              }
            });
          } //todo: deviation :added fallback icon for panels




          panelData.push(initialWidgetData.panels[i]);
        }
        var dataHTML = $(_self.getTemplate("menu")).tmplProxy({
          'panelData': panelData,
          'helpers': helpers,
          'baseUrl': baseUrl,
          'botDetails': _self.config.botOptions.botInfo
        });
        _self.bindTemplateEvents(dataHTML, 'menu', panelData);
        if ($(_self.config.container.menu).find('.menuItemCntr').length > 0) {
          $(_self.config.container.menu).find('.menuItemCntr').remove();
        }

        $(_self.config.container.menu).addClass('kr-wiz-menu-css');
        $(_self.config.container.menu).addClass('defaultTheme-kore');
        $(_self.config.container.menu).append(dataHTML);


        if (KRPerfectScrollbar) {
          if (!_self.vars.menuPSObj) {
            _self.vars.menuPSObj = new KRPerfectScrollbar($(_self.config.container.menu).find(".menuItemBox").get(0), {
              suppressScrollX: true
            });
          } else {
            _self.vars.menuPSObj.update();
          }
        }

        _self.maintainCache();

        setTimeout(function () {
          _self.triggerEvent('onPanelsLoaded');
        }, 100);
      });
    };

    KoreWidgetSDK.prototype.setAPIDetails = function () {
      var _self = this;
      var SearchIndexID = 'sidx-f3a43e5f-74b6-5632-a488-8af83c480b88';
      if(window.selectedFindlyApp && window.selectedFindlyApp._id){
        SearchIndexID = window.selectedFindlyApp._id
      }
      var baseUrl = "https://app.findly.ai/searchAssistant";
      var businessTooBaseURL = "https://app.findly.ai/api/1.1/findly/"
      _self.API = {
        baseUrl: baseUrl,
        livesearchUrl: baseUrl + "/liveSearch/" + SearchIndexID,
        searchUrl: baseUrl + "/search/" + SearchIndexID,
        queryConfig:businessTooBaseURL+SearchIndexID+"/search/queryConfig",
        SearchIndexID: SearchIndexID,
        streamId: 'st-a4a4fabe-11d3-56cc-801d-894ddcd26c51',
        jstBarrer:'"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.wrUCyDpNEwAaf4aU5Jf2-0ajbiwmTU3Yf7ST8yFJdqM"'
      };
      _self.API.uuid = uuid.v4();
      var botIntigrationUrl = businessTooBaseURL + SearchIndexID + '/linkedbotdetails';
      if(window.selectedFindlyApp && window.selectedFindlyApp._id){
        $.ajax({
          url: botIntigrationUrl,
          type: 'GET',
          dataType: 'json',
          headers: {
            "Authorization": 'bearer '+window.findlyAccessToken,
            "AccountId":window.findlyAccountId,
            "Content-Type": "application/json"
          },
          data: {},
          success: function (data) {
            _self.API.streamId = data.findlyLinkedBotId;
            _self.API.jstBarrer = data.app.jwt;
          },
          error: function (err) {
            console.log(err)
          }
        })
      }
    };

    KoreWidgetSDK.prototype.maintainCache = function () {
      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;
      var cacheData = _self.vars.cacheData;
      var count = 0;

      for (var i = 0; i < initialWidgetData.panels.length; i++) {
        for (var j = 0; j < initialWidgetData.panels[i].widgets.length; j++) {
          if (initialWidgetData.panels[i].widgets[j].type === 'List' && initialWidgetData.panels[i].widgets[j].priority) {
            var api = initialWidgetData.panels[i].widgets[j].hook.api;

            if (initialWidgetData.panels[i].widgets[j].hook.params) {
              api = initialWidgetData.panels[i].widgets[j].hook.api + '?' + $.param(initialWidgetData.panels[i].widgets[j].hook.params);
            }

            cacheData.push({
              "api": api,
              "response": _self.getServerDataGen(initialWidgetData.panels[i].widgets[j].hook.api, initialWidgetData.panels[i].widgets[j].hook.method, initialWidgetData.panels[i].widgets[j].hook.body, initialWidgetData.panels[i].widgets[j].hook.params).done(function (res) {
                _self.modifyJSON(count++);
              })
            });
          } else if (initialWidgetData.panels[i].widgets[j].type === 'FilteredList' && initialWidgetData.panels[i].widgets[j].priority) {
            for (var k = 0; k < initialWidgetData.panels[i].widgets[j].filters.length; k++) {
              var api = initialWidgetData.panels[i].widgets[j].filters[k].hook.api;

              if (initialWidgetData.panels[i].widgets[j].filters[k].hook.params) {
                api = initialWidgetData.panels[i].widgets[j].filters[k].hook.api + '?' + $.param(initialWidgetData.panels[i].widgets[j].filters[k].hook.params);
              }

              cacheData.push({
                "api": api,
                "response": _self.getServerDataGen(initialWidgetData.panels[i].widgets[j].filters[k].hook.api, initialWidgetData.panels[i].widgets[j].filters[k].hook.method, initialWidgetData.panels[i].widgets[j].filters[k].hook.body, initialWidgetData.panels[i].widgets[j].filters[k].hook.params).done(function (res) {
                  _self.modifyJSON(count++);
                })
              });
            }
          }
        }
      }
    };
    function xssAttack(txtStr) {
      //   if (compObj && compObj[0] && compObj[0].componentType === "text") {

      var textHasXSS;
      if (txtStr) {
        textHasXSS = txtStr.isNotAllowedHTMLTags();
      }
      if (textHasXSS && !textHasXSS.isValid) {
        txtStr = txtStr.escapeHTML();
      }
      return txtStr;
      //return compObj[0].componentBody;

    }
    KoreWidgetSDK.prototype.checkMarkdowns = function (val, hyperLinksMap) {
      if (val === '') {
        return val;
      }
      var txtArr = val.split(/\r?\n/);
      for (var i = 0; i < txtArr.length; i++) {
        var _lineBreakAdded = false;
        if (txtArr[i].indexOf('#h6') === 0 || txtArr[i].indexOf('#H6') === 0) {
          txtArr[i] = '<h6>' + txtArr[i].substring(3) + '</h6>';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('#h5') === 0 || txtArr[i].indexOf('#H5') === 0) {
          txtArr[i] = '<h5>' + txtArr[i].substring(3) + '</h5>';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('#h4') === 0 || txtArr[i].indexOf('#H4') === 0) {
          txtArr[i] = '<h4>' + txtArr[i].substring(3) + '</h4>';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('#h3') === 0 || txtArr[i].indexOf('#H3') === 0) {
          txtArr[i] = '<h3>' + txtArr[i].substring(3) + '</h3>';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('#h2') === 0 || txtArr[i].indexOf('#H2') === 0) {
          txtArr[i] = '<h2>' + txtArr[i].substring(3) + '</h2>';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('#h1') === 0 || txtArr[i].indexOf('#H1') === 0) {
          txtArr[i] = '<h1>' + txtArr[i].substring(3) + '</h1>';
          _lineBreakAdded = true;
        } else if (txtArr[i].length === 0) {
          txtArr[i] = '\r\n';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('*') === 0) {
          if (!isEven(txtArr[i].split('*').length - 1)) {
            txtArr[i] = '\r\n&#9679; ' + txtArr[i].substring(1);
            _lineBreakAdded = true;
          }
        } else if (txtArr[i].indexOf('>>') === 0) {
          txtArr[i] = '<p class="indent">' + txtArr[i].substring(2) + '</p>';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('&gt;&gt;') === 0) {
          txtArr[i] = '<p class="indent">' + txtArr[i].substring(8) + '</p>';
          _lineBreakAdded = true;
        } else if (txtArr[i].indexOf('---') === 0 || txtArr[i].indexOf('___') === 0) {
          txtArr[i] = '<hr/>' + txtArr[i].substring(3);
          _lineBreakAdded = true;
        }
        var j;
        // Matches Image markup ![test](http://google.com/image.png)
        if (txtArr[i].indexOf(' ![') === -1) {// replace method trimming last'$' character, to handle this adding ' ![' extra space
          txtArr[i] = txtArr[i].replace('![', ' ![');
        }
        var _matchImage = txtArr[i].match(/\!\[([^\]]+)\](|\s)+\(([^\)])+\)/g);
        if (_matchImage && _matchImage.length > 0) {
          for (j = 0; j < _matchImage.length; j++) {
            var _imgTxt = _matchImage[j].substring(2, _matchImage[j].indexOf(']'));
            var remainingString = _matchImage[j].substring(_matchImage[j].indexOf(']') + 1).trim();
            var _imgLink = remainingString.substring(1, remainingString.indexOf(')'));
            if (hyperLinksMap) {
              var _randomKey = "korerandom://" + Object.keys(hyperLinksMap).length;
              hyperLinksMap[_randomKey] = _imgLink;
              _imgLink = _randomKey;
            }
            _imgLink = '<img src="' + _imgLink + '" alt="' + _imgTxt + '">';
            var _tempImg = txtArr[i].split(' ');
            for (var k = 0; k < _tempImg.length; k++) {
              if (_tempImg[k] === _matchImage[j]) {
                _tempImg[k] = _imgLink;
              }
            }
            txtArr[i] = _tempImg.join(' ');
            txtArr[i] = txtArr[i].replace(_matchImage[j], _imgLink);
          }
        }
        // Matches link markup [test](http://google.com/)
        //var _matchLink = txtArr[i].match(/\[([^\]]+)\](|\s)+\(([^\)])+\)/g);
        var _matchLink = txtArr[i].match(/\[([^\]]+)\](|\s)\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g);
        if (_matchLink && _matchLink.length > 0) {
          for (j = 0; j < _matchLink.length; j++) {
            var _linkTxt = _matchLink[j].substring(1, _matchLink[j].indexOf(']'));
            var remainingString = _matchLink[j].substring(_matchLink[j].indexOf(']') + 1).trim();
            var _linkLink = remainingString.substring(1, remainingString.lastIndexOf(')'));
            _linkLink = _linkLink.replace(/\\n/g, "%0A");
            if (hyperLinksMap) {
              var _randomKey = "korerandom://" + Object.keys(hyperLinksMap).length;
              hyperLinksMap[_randomKey] = _linkLink;
              _linkLink = _randomKey;
            }
            _linkLink = '<span class="isLink"><a href="' + _linkLink + '" target="_blank">' + this.checkMarkdowns(_linkTxt) + '</a></span>';
            txtArr[i] = txtArr[i].replace(_matchLink[j], _linkLink);
          }
        }
        // Matches bold markup *test*,* test *, * test*.
        var _matchAstrik = txtArr[i].match(/(\*+)(\s*\b)([^\*]*)(\b\s*)(\*+)/g);
        if (_matchAstrik && _matchAstrik.length > 0) {
          for (j = 0; j < _matchAstrik.length; j++) {
            var _boldTxt = _matchAstrik[j];
            _boldTxt = _boldTxt.substring(1, _boldTxt.length - 1);
            _boldTxt = '<b>' + _boldTxt.trim() + '</b>';
            txtArr[i] = txtArr[i].replace(_matchAstrik[j], _boldTxt);
          }
        }
        //For backward compatability who used ~ for Italics
        //Matches italic markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
        var _matchItalic = txtArr[i].match(/\~\S([^*]*?)\S\~/g);
        if (_matchItalic && _matchItalic.length > 0) {
          for (j = 0; j < _matchItalic.length; j++) {
            var _italicTxt = _matchItalic[j];
            if (txtArr[i].indexOf(_italicTxt) === 0 || txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === ' ' || txtArr[i].indexOf(_italicTxt) !== -1) {
              _italicTxt = _italicTxt.substring(1, _italicTxt.length - 1);
              _italicTxt = '<i class="markdownItalic">' + _italicTxt + '</i>';
              txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
            }
          }
        }
        // Matches italic markup _test_ doesnot match _ test _, _test _, _ test_. If all these are required then replace \S with \s
        var _matchItalic = txtArr[i].match(/\_\S([^*]*?)\S\_/g);
        if (_matchItalic && _matchItalic.length > 0) {
          for (j = 0; j < _matchItalic.length; j++) {
            var _italicTxt = _matchItalic[j];
            if (txtArr[i].indexOf(_italicTxt) === 0 || txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === ' ' || txtArr[i].indexOf(_italicTxt) !== -1) {
              _italicTxt = _italicTxt.substring(1, _italicTxt.length - 1);
              _italicTxt = '<i class="markdownItalic">' + _italicTxt + '</i>';
              txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
            }
          }
        }
        // Matches bold markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
        var _matchItalic = txtArr[i].match(/\~\S([^*]*?)\S\~/g);
        if (_matchItalic && _matchItalic.length > 0) {
          for (j = 0; j < _matchItalic.length; j++) {
            var _italicTxt = _matchItalic[j];
            if (txtArr[i].indexOf(_italicTxt) === 0 || txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === ' ' || txtArr[i].indexOf(_italicTxt) !== -1) {
              _italicTxt = _italicTxt.substring(1, _italicTxt.length - 1);
              _italicTxt = '<i class="markdownItalic">' + _italicTxt + '</i>';
              txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
            }
          }
        }
        // Matches bold markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
        var _matchPre = txtArr[i].match(/\`\`\`\S([^*]*?)\S\`\`\`/g);
        var _matchPre1 = txtArr[i].match(/\'\'\'\S([^*]*?)\S\'\'\'/g);
        if (_matchPre && _matchPre.length > 0) {
          for (j = 0; j < _matchPre.length; j++) {
            var _preTxt = _matchPre[j];
            _preTxt = _preTxt.substring(3, _preTxt.length - 3);
            _preTxt = '<pre>' + _preTxt + '</pre>';
            txtArr[i] = txtArr[i].replace(_matchPre[j], _preTxt);
          }
          _lineBreakAdded = true;
        }
        if (_matchPre1 && _matchPre1.length > 0) {
          for (j = 0; j < _matchPre1.length; j++) {
            var _preTxt = _matchPre1[j];
            _preTxt = _preTxt.substring(3, _preTxt.length - 3);
            _preTxt = '<pre>' + _preTxt + '</pre>';
            txtArr[i] = txtArr[i].replace(_matchPre1[j], _preTxt);
          }
          _lineBreakAdded = true;
        }
        if (!_lineBreakAdded && i > 0) {
          txtArr[i] = '\r\n' + txtArr[i];
        }
      }
      val = txtArr.join('');
      return val;
    }
    KoreWidgetSDK.prototype.convertMDtoHTML = function (val, responseType, msgItem) {
      var hyperLinksMap = {};
      if (msgItem && msgItem.cInfo && msgItem.cInfo.ignoreCheckMark) {
        var ignoreCheckMark = msgItem.cInfo.ignoreCheckMark;
      }
      var mdre = {};
      //mdre.date = new RegExp(/\\d\(\s*(.{10})\s*\)/g);
      mdre.date = new RegExp(/\\d\(\s*(.{10})\s*(?:,\s*["'](.+?)["']\s*)?\)/g);
      mdre.time = new RegExp(/\\t\(\s*(.{8}\.\d{0,3})\s*\)/g);
      //mdre.datetime = new RegExp(/\\dt\(\s*(.{10})[T](.{12})([z]|[Z]|[+-]\d{4})\s*\)/g);
      mdre.datetime = new RegExp(/\\(d|dt|t)\(\s*([-0-9]{10}[T][0-9:.]{12})([z]|[Z]|[+-]\d{4})[\s]*,[\s]*["']([a-zA-Z\W]+)["']\s*\)/g);
      mdre.num = new RegExp(/\\#\(\s*(\d*.\d*)\s*\)/g);
      mdre.curr = new RegExp(/\\\$\((\d*.\d*)[,](\s*[\"\']\s*\w{3}\s*[\"\']\s*)\)|\\\$\((\d*.\d*)[,](\s*\w{3}\s*)\)/g);

      var regEx = {};
      regEx.SPECIAL_CHARS = /[\=\`\~\!@#\$\%\^&\*\(\)_\-\+\{\}\:"\[\];\',\.\/<>\?\|\\]+/;
      regEx.EMAIL = /^[-a-z0-9~!$%^&*_=+}{\']+(\.[-a-z0-9~!$%^&*_=+}{\']+)*@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,255})+$/i;
      regEx.MENTION = /(^|\s|\\n|")@([^\s]*)(?:[\s]\[([^\]]*)\])?["]?/gi;
      regEx.HASHTAG = /(^|\s|\\n)#(\S+)/g;
      regEx.NEWLINE = /\n/g;
      var _regExForLink = /((?:http\:\/\/|https\:\/\/|www\.)+\S*\.(?:(?:\.\S)*[^\,\s\.])*\/?)/gi;
      // var _regExForMarkdownLink = /\[([^\]]+)\](|\s)+\(([^\)])+\)/g;
      var _regExForMarkdownLink = /\[([^\]]+)\](|\s)\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)?/g;
      var str = val || '';
      var mmntns = {};
      mmntns.sd = new RegExp(/^(d{1})[^d]|[^d](d{1})[^d]/g);
      mmntns.dd = new RegExp(/^(d{2})[^d]|[^d](d{2})[^d]/g);
      mmntns.fy = new RegExp(/(y{4})|y{2}/g);
      var regexkeys = Object.keys(mdre);
      function matchmap(regexval, stringval) {
        var da;
        var matches = [];
        while ((da = regexval.exec(stringval)) !== null) {
          var keypair = {};
          keypair.index = da.index;
          keypair.matchexp = da[0];
          if (da.length > 1) {
            for (var n = 1; n < da.length; n++) {
              var mstr = "matchval" + n.toString();
              keypair[mstr] = da[n];
            }
          }
          matches.push(keypair);
        }
        return matches;
      }
      function ucreplacer(match) {
        return match.toUpperCase();
      }
      for (var j = 0; j < regexkeys.length; j++) {
        var k;
        switch (regexkeys[j]) {
          case 'date':
            var strvald = str;
            var datematcharray = matchmap(mdre.date, strvald);
            if (datematcharray.length) {
              for (k = 0; k < datematcharray.length; k++) {
                //var fdate = moment(datematcharray[k].matchval).format('DD,dd,MM,YYY');
                var fdate = new Date(datematcharray[k].matchval1).toLocaleDateString();
                fdate = ' ' + fdate.toString() + ' ';
                str = str.replace(datematcharray[k].matchexp.toString(), fdate);
              }
            }
            break;
          case 'time':
            var strvalt = str;
            var timematcharray = matchmap(mdre.time, strvalt);
            if (timematcharray.length) {
              for (k = 0; k < timematcharray.length; k++) {
                var ftime = new Date(timematcharray[k].matchval1).toLocaleTimeString();
                ftime = ' ' + ftime.toString() + ' ';
                str = str.replace(timematcharray[k].matchexp.toString(), ftime);
              }
            }
            break;
          case 'datetime':
            var strvaldt = str;
            var dtimematcharray = matchmap(mdre.datetime, strvaldt);
            if (dtimematcharray.length) {
              for (k = 0; k < dtimematcharray.length; k++) {
                var ms = '';
                var mergekeylength = Object.keys(dtimematcharray[k]).length - 2;
                for (var l = 2; l < mergekeylength; l++) {
                  var keystr = "matchval" + l.toString();
                  ms += dtimematcharray[k][keystr];
                }
                var foptionstring = "matchval" + mergekeylength.toString();
                var fmtstr = dtimematcharray[k][foptionstring];
                fmtstr = fmtstr.replace(mmntns.fy, ucreplacer);
                fmtstr = fmtstr.replace(mmntns.dd, ucreplacer);
                fmtstr = fmtstr.replace(mmntns.sd, ucreplacer);
                //var fdtime = new Date(dtimematcharray[k].matchval).toLocaleString();
                var fdtime = moment(ms).format(fmtstr);
                fdtime = ' ' + fdtime.toString() + ' ';
                str = str.replace(dtimematcharray[k].matchexp.toString(), fdtime);
              }
            }
            break;
          case 'num':
            var strnumval = str;
            var nummatcharray = matchmap(mdre.num, strnumval);
            if (nummatcharray.length) {
              for (k = 0; k < nummatcharray.length; k++) {
                var fnum = Number(nummatcharray[k].matchval1).toLocaleString();
                fnum = ' ' + fnum.toString() + ' ';
                str = str.replace(nummatcharray[k].matchexp.toString(), fnum);
              }
            }
            break;
          case 'curr':
            var strcurval = str;
            var currmatcharray = matchmap(mdre.curr, strcurval);
            var browserLang = window.navigator.language || window.navigator.browserLanguage;
            var curcode = new RegExp(/\w{3}/);
            if (currmatcharray.length) {
              for (k = 0; k < currmatcharray.length; k++) {
                var currops = {}, fcode;
                currops.style = 'currency';
                if (currmatcharray[k].matchval2) {
                  fcode = curcode.exec(currmatcharray[k].matchval2);
                }
                currops.currency = fcode[0].toString();
                var fcurr = Number(currmatcharray[k].matchval1).toLocaleString(browserLang, currops);
                //check for browser support if browser doesnot suppor we get the same value back and we append the currency Code
                if (currmatcharray[k].matchval1.toString() === fcurr.toString()) {
                  fcurr = ' ' + fcurr.toString() + ' ' + currops.currency;
                } else {
                  fcurr = ' ' + fcurr.toString() + ' ';
                }
                str = str.replace(currmatcharray[k].matchexp.toString(), fcurr);
              }
            }
            break;
        }
      }
      function nextLnReplacer(match, p1, offset, string) {
        return "<br/>";
      }
      function ignoreWords(str) {
        var _words = ['onclick', 'onmouse', 'onblur', 'onscroll', 'onStart'];
        _words.forEach(function (word) {
          var regEx = new RegExp(word, "ig");
          str = str.replace(regEx, "");
        });
        return str;
      }
      var nextln = regEx.NEWLINE;
      KoreWidgetSDK.prototype.nl2br = function (str, runEmojiCheck) {
        if (runEmojiCheck) {
          str = window.emojione.shortnameToImage(str);
        }
        str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return str;
      };
      function linkreplacer(match, p1, offset, string) {
        var dummyString = string.replace(_regExForMarkdownLink, '[]');
        dummyString = ignoreWords(dummyString);
        if (dummyString.indexOf(match) !== -1) {
          var _link = p1.indexOf('http') < 0 ? 'http://' + match : match, _target;
          //_link = encodeURIComponent(_link);
          target = "target='underscoreblank'";
          if (hyperLinksMap) {
            var _randomKey = "korerandom://" + Object.keys(hyperLinksMap).length;
            hyperLinksMap[_randomKey] = _link;
            _link = _randomKey;
          }
          return "<span class='isLink'><a " + _target + " href=\"" + _link + "\">" + match + "</a></span>";
        } else {
          return match;
        }
      }
      //check for whether to linkify or not
      try {
        str = decodeURIComponent(str);
      } catch (e) {
        str = str || '';
      }
      var newStr = '', wrapper1;
      if (responseType === 'user') {
        str = str.replace(/onerror=/gi, 'abc-error=');
        wrapper1 = document.createElement('div');
        newStr = str.replace(/“/g, '\"').replace(/”/g, '\"');
        newStr = newStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        wrapper1.innerHTML = xssAttack(newStr);
        if ($(wrapper1).find('a').attr('href')) {
          str = newStr;
        } else {
          str = newStr.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(_regExForLink, linkreplacer);
        }
      } else {
        wrapper1 = document.createElement('div');
        //str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        wrapper1.innerHTML = xssAttack(str);
        if ($(wrapper1).find('a').attr('href')) {
          var linkArray = str.match(/<a[^>]*>([^<]+)<\/a>/g);
          for (var x = 0; x < linkArray.length; x++) {
            var _newLA = document.createElement('div');
            var _detectedLink = linkArray[x];
            _newLA.innerHTML = linkArray[x];
            //for mailto: links, new line character need to be repaced with %0A 
            if (_detectedLink.indexOf("href='mailto:") > -1 || _detectedLink.indexOf('href="mailto:') > -1) {
              _detectedLink = _detectedLink.split('\n').join("%0A")

            }
            var _randomKey = "korerandom://" + Object.keys(hyperLinksMap).length;
            _newLA.innerHTML = _detectedLink;

            var _aEle = _newLA.getElementsByTagName('a');
            if (_aEle && _aEle[0] && _aEle[0].href) {
              hyperLinksMap[_randomKey] = _aEle[0].href;
              _aEle[0].href = _randomKey;
            }
            $(_newLA).find('a').attr('target', 'underscoreblank');
            str = str.replace(linkArray[x], _newLA.innerHTML);
          }
        } else {
          str = wrapper1.innerHTML.replace(_regExForLink, linkreplacer);
        }
      }
      if (ignoreCheckMark) {
        str = val;
      } else {
        str = this.checkMarkdowns(str, hyperLinksMap);
      }
      var hrefRefs = Object.keys(hyperLinksMap);
      if (hrefRefs && hrefRefs.length) {
        hrefRefs.forEach(function (hrefRef) {
          function customStrReplacer() { //custom replacer is used as by default replace() replaces with '$' in place of '$$'
            return hyperLinksMap[hrefRef];
          }
          str = str.replace(hrefRef, customStrReplacer);
        });
      }
      str = str.replaceAll('target="underscoreblank"', 'target="_blank"');
      str = str.replaceAll("target='underscoreblank'", 'target="_blank"');
      if (responseType === 'user') {
        str = str.replace(/abc-error=/gi, 'onerror=');
      }
      return this.nl2br(str, true);
    };
    KoreWidgetSDK.prototype.modifyJSON = function (count) {
      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;
      var cacheData = _self.vars.cacheData;
      if (count < initialWidgetData.panels.length) return; else {
        for (var i = 0; i < cacheData.length; i++) {
          if (cacheData[i].response && cacheData[i].response.responseJSON) {
            cacheData[i].response = cacheData[i].response.responseJSON;
          } else {
            cacheData[i].response = cacheData[i].response;
          }
        }
      }
    }; //********************original widget.js end */
    //********************original widgetTemplate.js start */

    KoreWidgetSDK.prototype.getSearchTemplate = function (type) {
      var searchContainer = '<script type="text/x-jqury-tmpl">\
        <div class="search-container conversation">\
          <div id="searchBox" >\
            <div class="heading">\
              <div class="logo-sec-title">\
            <img class="show-in-findly" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAW0SURBVHgBrVY7bxxVFD73MbOzu36skzgRDVoLISUFitPQQkoqNl3KICQKGuAXJP4FpESisJEQosNUlCy/gICQCAXyFkgkIDvr7HrncV9858zaROSBkJjR1c7MnTnf+b7znXtX0b8cBx8+GmgXb0VqrpJS22RoYIymGOIkEU1Dnb42ROOtT16avCiOet7Ezzd/HxpFu42fvxlcRREnpUhJedLaku11qeivkjEZ+QVmXdqLgXaufPlswGcC3R89+MAFd7epKgqxIc9A/Bs9qZQoUcBQZHRO1ha0fmmTut0uuYWjPLN3tr7Y3Hkh0MHoYBBpdfdkVo6cc9RglG5GIdSQqkZ4MGJmpHEqKGlJKw3Agnpgd+Glc6SjBnPa18G8s7W/MT2NbZ8EMn6wW5XlqJo1VNYlNdFRHUqw8eRTQyHFNjsFkAQwpGl0B79Iqn5MzczRhQvnqNfrjpROA7x6/SlGv7z+8Ha2Zu8cHR3TvCmpChXVkKuJbX1YQmaTkqIkwikAWMoUAylGx3VOPdOh86sDWl3pU57buy9/s/HRGdD3lw+GxVr3IKRAhydTKhG8Dg1VqUbgBDYQDYNP3AoQCRTAYEOrNUDs8l7RuXydNjrrtLayQtqa61vjjbFIZ6zdtdHQ4WIKJg6jJpc82LTBA+L6xBYgAEaplBdTtMw6KaOeSlTAHE1yNId5MpyFKqhj9W18NlbMJs86Bx5h/qyPqEQtHrNsAHIylozYawLCVgCgZA8xMZ/B7myPFZ2JYdZ1ly5ma3TerlMBKXOdX7PaZCOmP/czSBXomBmBQRMTsiP50KVWrIDgHmD61ElsCrgOpm8lZbMkfk4Si991UAXtPbIdnb/dgMUMDpvi4RwvLiLWAbzEUnHx+VW/dJzHPcvn5Wlr88IouXIxSu005h8j1iUkwiqkFN6wVunhoWeQREcYFV4QIPySvAg20N/jmV5+6ERC5tdWqQqoE+asMq2VIxfV0TBPhByY5NAih+EfCPooMAuFGhmqkO8iJXGaGDO1NYkxSmCWkpRuq4Rrh0Qa9FpHG5FVpTYhLgFDd0kNrcPDYwSYYaLERzw5B3BFrd7sNa5Da2sGYatzVyQwlIfiymbpSGYVpTYksbipV7meRtnpSUyDCh/XCBQQFK+L4+Kpt1KShgtLi6fTrCX/tOyoJPVywp5kaSo5CdwMjJraQptJrrPt2pcinZcAFuIZsTSJoxK13QP5lsFp2bIkdeElqTUPioOaGupilZhhmbL4di3Gexbl/G5gettJleI0z82ILmdmtWisBCBRuyIwHCun0pIJKyDXWlLQkmCO5x0wklQ4zg+68rSfIYMCKzB2GsjX9gUho4CPGMxh3glLK2zF7qq9r5OW7yQ5BlEZ9qsCbuvA4knkc1Ht6ys/rY7XTGesEZhfCFg6OChnFakjQaRRkXkAIEvqBRR9w614ep94Hous7sMQBVhndAiToSyTt+5vjqXJN222s6KZbg4mWEbOBkvITDMxCCeRZJlBYIA23ENSFdQOSeZ6RQbHmQHEyeaoZRMUoNfudceX8/7YChAkw2iWMjmuFT5okDlL6NFnYSklJxORTAKIxvqmVA/PDS0Qs+RtQxd7792/uHcGxMelrH/jWmdj0jfdVj7FIJmwaXDNmZ/ALHOYYQHdK7aygPUwupCqkPouMF8DLFe9SRHynac2Pj6+ulwOHxJ9+2MzH07CHEVsELSW36XRKZ7uRKrdfTTYWcWbAvyG6x5M0Edd8pSu703+/qPy1J+TOwDTSX38m29GD7CNzwUI2wVOn/xZeypZgqjd+hQzyGAfTX1lxvDajf3J1vTJuM/9u/X+q/Nbx0HdnpIfltyMGA3AgmyG0k2yEvAKwADndT65qMPOp7+2Nfnn8Vyg0+PdV05GD2IawRBXsZFvu+WqAP+BRZp0yYxXYvrs88nqmP7P49awHN7EoP94/AUUr0KuNdomKAAAAABJRU5ErkJggg==">\
              <img class="search-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAARCAYAAABq+XSZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANmSURBVHgB3VddUuJAEO6J2XduYFzZZ/UExBOIJzCcADiBegL1BngC8QTGE8g+q+V4AtlnIr1fz0zCJEuALaG07CqG+e3p7vn6J0QrUhT92qdvRiqKmmf1y6y1fh5EP5sXxNTDRKpfng7pgxRFu21cLcYca/10GYGIwsSuZgNcqmmDFO0070jRKERzWruLVYp2QFNukFIY05jWQ23cewIDaPQvoXhUyMFhilbTJompQcwq9KZSTN5Xdmlp8fodIOQarzKib0BA24H8z5SH4pg8m7cZ/p5QQC2ahgJVwLQZU6BOzOJ00qcg7KKHNTXG+LwKW7jNqV2X/VmfllCVP9iNnRz7kKPr5s/r3KM4zyyIgkwKex9HJXmm/BrSSjSN4QIiTEoGpioC48SubYnhXJ+xFCYQ8iC/DBfdYLpdsFJhjHYJgjIN+CeOv6Bx4OToQo7ExiLdmXfSKMZ0BuWGGN47AzzAIId43NSJCeMEeqa84hMEglaJE6u+b7G5pBC4mI+NQRRdOCETND0T2HLFma+wRwSKF8YZElhqDVlSszcIWoXyCmPzH6S1h6f0B21fAmk+BV7bIg/ZxyvIe3kIj31lTgh0y4hVBxeN3CWCDoH/nluN3T+i+nPP9VNn5HgxX7o1yjKL8To2IxgZoSBf1x3zlTYyyTmBvgS5Cnk+LwzVoLy8PMAplb15w2o2aDhFynyYf+NgTAspG0A8QVLD1Rj7xq1s+k3rTrm02QWSJZ02jAw2S/2ji//yuvCJdZNSUWVie9kRCXIF9InFVY7MgiBi4V1bdySPwME50SQ1fQoFda3q1oA2SspZmyMTgSmHIa9WLeaKWsVjO/l+WbfdIkRF1hUfTbHkMsXevP0bVl6g61xB0Y2J/Cp8cHD8n/Oxmxj56U0MKdUaDOviycSuBXw027MrBVV7HveNKm+sztxxxVLDRH7xf+bblc/7vmoyhk8/xIgxfkez+6gvqQ5GeZOfyUCqGssshcTZjusvKF3feyZ3FjQZYpxK70Xr15lw2TFROaoiOEl6G1rYq7GkTrxXw+cnsUbecK4cedS3cqRl3obXjn/GfSsMTcls7nuy9/lyiZxSktAXJffx04KECVnUpFDkwx9VPq1Y4X0GoaIsfFXc5r1Da6YvrDxdIWrfOsVHeX2/TvoL5IWKplAqwt0AAAAASUVORK5CYII=">\
                <span class="head">Kore Search Assistant</span>\
              </div>\
              <div class="right-side-icons">\
                <img class="help-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE1SURBVHgBhVI7TsNAEH27cY8VOMA6OBJlcgLMCeAGNhUl4STACZLcAEoq3NG6RQTFXCCYjsJ4eJs48ieOMtJIo5k3b74KLTFmOAIkoOlSM0DFafqR1DGqAhsD5UxpjiAyZ4gJQh/OaaeQ/DqlNNiNd7o0xp+gQ6x/E7ddkGJTofcKUWRaxLUWr6jk/pyViQGUTCF/457rnkTQ+jddLh6rNvUbE97Z2o3bPzbZ9+oly1ap6/bHQO9MMxCisDNsxYk40x0rTCwrBFFtBTPiL2E8X7BHbEt2loaPeGdvwsC/X1cRfdGOaWqyHrItBX64Zq9+oxKXaLI9Q6uwqxpXlzU9EhI/Z6X8AVIEndXQnI9LICZ/Kh0HjjsY3jaOWzFt38i+jo55hi+6j4jgMsC5qjdSu20cfth/n92EMGjOb2IAAAAASUVORK5CYII=">\
                <img class="elipse-overflow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAADCAYAAABI4YUMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABUSURBVHgBhcrBDYAgEETRiW4BSCzAo11YgpZgCZZgJ1qClmBDQgEkMFzgBPxkD/sy/cSUHi816Nma/wNrWQfIBo94J1KyV+wQwD2Elc+bB+6mLSULWI0gebajC9UAAAAASUVORK5CYII=">\
                <img class="close-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgBhZDBDYAgDEV/xAXcoKs4iW7gCqzgRLiGJ7160hH8ak1IAW3yGiiPUOoADGQjB/IhpKuYGhK0kJOCOnd4shhZtObt7VguSlb+lN7ndkXigxpp46Pur3VLVvw07mE+mJMS2TH1ZC6IE54ZyglkyhuCR14v1QAAAABJRU5ErkJggg==">\
              </div>\
              </div>\
            <div id="searchChatContainer"></div>\
              <div class="search-body">\
            </div>\
          </div>\
          <div class="search-modal-body hide">\
          </div>\
          <div class="confirmationModal hide">\
          </div>\
          <div class="search-body-full hide">\
          </div>\
          <div class="greetingMsg">\
          </div>\
          <div class="search-bar">\
            <div class="widget-icon"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAW0SURBVHgBrVY7bxxVFD73MbOzu36skzgRDVoLISUFitPQQkoqNl3KICQKGuAXJP4FpESisJEQosNUlCy/gICQCAXyFkgkIDvr7HrncV9858zaROSBkJjR1c7MnTnf+b7znXtX0b8cBx8+GmgXb0VqrpJS22RoYIymGOIkEU1Dnb42ROOtT16avCiOet7Ezzd/HxpFu42fvxlcRREnpUhJedLaku11qeivkjEZ+QVmXdqLgXaufPlswGcC3R89+MAFd7epKgqxIc9A/Bs9qZQoUcBQZHRO1ha0fmmTut0uuYWjPLN3tr7Y3Hkh0MHoYBBpdfdkVo6cc9RglG5GIdSQqkZ4MGJmpHEqKGlJKw3Agnpgd+Glc6SjBnPa18G8s7W/MT2NbZ8EMn6wW5XlqJo1VNYlNdFRHUqw8eRTQyHFNjsFkAQwpGl0B79Iqn5MzczRhQvnqNfrjpROA7x6/SlGv7z+8Ha2Zu8cHR3TvCmpChXVkKuJbX1YQmaTkqIkwikAWMoUAylGx3VOPdOh86sDWl3pU57buy9/s/HRGdD3lw+GxVr3IKRAhydTKhG8Dg1VqUbgBDYQDYNP3AoQCRTAYEOrNUDs8l7RuXydNjrrtLayQtqa61vjjbFIZ6zdtdHQ4WIKJg6jJpc82LTBA+L6xBYgAEaplBdTtMw6KaOeSlTAHE1yNId5MpyFKqhj9W18NlbMJs86Bx5h/qyPqEQtHrNsAHIylozYawLCVgCgZA8xMZ/B7myPFZ2JYdZ1ly5ma3TerlMBKXOdX7PaZCOmP/czSBXomBmBQRMTsiP50KVWrIDgHmD61ElsCrgOpm8lZbMkfk4Si991UAXtPbIdnb/dgMUMDpvi4RwvLiLWAbzEUnHx+VW/dJzHPcvn5Wlr88IouXIxSu005h8j1iUkwiqkFN6wVunhoWeQREcYFV4QIPySvAg20N/jmV5+6ERC5tdWqQqoE+asMq2VIxfV0TBPhByY5NAih+EfCPooMAuFGhmqkO8iJXGaGDO1NYkxSmCWkpRuq4Rrh0Qa9FpHG5FVpTYhLgFDd0kNrcPDYwSYYaLERzw5B3BFrd7sNa5Da2sGYatzVyQwlIfiymbpSGYVpTYksbipV7meRtnpSUyDCh/XCBQQFK+L4+Kpt1KShgtLi6fTrCX/tOyoJPVywp5kaSo5CdwMjJraQptJrrPt2pcinZcAFuIZsTSJoxK13QP5lsFp2bIkdeElqTUPioOaGupilZhhmbL4di3Gexbl/G5gettJleI0z82ILmdmtWisBCBRuyIwHCun0pIJKyDXWlLQkmCO5x0wklQ4zg+68rSfIYMCKzB2GsjX9gUho4CPGMxh3glLK2zF7qq9r5OW7yQ5BlEZ9qsCbuvA4knkc1Ht6ys/rY7XTGesEZhfCFg6OChnFakjQaRRkXkAIEvqBRR9w614ep94Hous7sMQBVhndAiToSyTt+5vjqXJN222s6KZbg4mWEbOBkvITDMxCCeRZJlBYIA23ENSFdQOSeZ6RQbHmQHEyeaoZRMUoNfudceX8/7YChAkw2iWMjmuFT5okDlL6NFnYSklJxORTAKIxvqmVA/PDS0Qs+RtQxd7792/uHcGxMelrH/jWmdj0jfdVj7FIJmwaXDNmZ/ALHOYYQHdK7aygPUwupCqkPouMF8DLFe9SRHynac2Pj6+ulwOHxJ9+2MzH07CHEVsELSW36XRKZ7uRKrdfTTYWcWbAvyG6x5M0Edd8pSu703+/qPy1J+TOwDTSX38m29GD7CNzwUI2wVOn/xZeypZgqjd+hQzyGAfTX1lxvDajf3J1vTJuM/9u/X+q/Nbx0HdnpIfltyMGA3AgmyG0k2yEvAKwADndT65qMPOp7+2Nfnn8Vyg0+PdV05GD2IawRBXsZFvu+WqAP+BRZp0yYxXYvrs88nqmP7P49awHN7EoP94/AUUr0KuNdomKAAAAABJRU5ErkJggg=="> </div>\
            <input id="suggestion"style="position: absolute; bottom: 0px;" name="search" class="search" disabled="disabled">\
            <input autocomplete="off" style="position: absolute; bottom: 0px;" id="search" name="search" class="search" placeholder="Ask anything">\
            <div class="ksa-SpeakIcon"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgBxVPbSsNAEN2d3XRVSvqQBwNNQwmpgn3xC/x7/0ETEpG2oGAeTKVJ3HXH3Qch1KQiKfTAsJc5c/YyM4QMBO1zhGEYAYwWdg6gn/I8T7p4rGtzPr/xOWcLKat7rdUzIXw5Hl+W2+1btc+FLgGA2kWUa4PKGmO4FuLT6+SSgTi9AG8voii6OkT+8bczctwnNA3stGYXTTMqzOVmQRCcW1OKzBDx3VBcANj1Cvj+5BWAepR+GBKsOD+7s0apk0spSzO6dV0X7ZhflTidxoEQcG2q79Gc/mL30jSdMCZuHYcmWZatDgpYxHHsSkmWjFFPa5SIpFSKJ5vNQ0H+A/vrf2WG9gWaNtkL/Er6GmoQvgHqBWZkE0i8BAAAAABJRU5ErkJggg=="></div>\
            <div class="sdkFooterIcon microphoneBtn"> \
                <button class="notRecordingMicrophone" title="Microphone On"> \
                    <i class="microphone"></i> \
                </button> \
                <button class="recordingMicrophone" title="Microphone Off" > \
                    <i class="microphone"></i> \
                    <span class="recordingGif"></span> \
                </button> \
                <div id="textFromServer"></div> \
            </div> \
            <button class="search-button">Go</button>\
          </div>\
        </div>\
        </script>';
      // <p>{{html getHTMLForSearch(faq.answer)}}</p>\  
      var greetingMsg = '<script type="text/x-jqury-tmpl">\
        <div class="search-greeting-box">\
          <span class="greeting-img"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJmSURBVHgBtVJLS5RhFH7O+10cZ2jmM5sgUfg0BAkq3VqhRrhx0biQ2ql7w7atnF2rsD8Q02XZQluGhhVBdIHGS4Q7JSOi0hk/57t/7+l1umCouzqr9+Wc5znP83CA/10rKyvmzcfexcFbbttBfdr78V7adiqFs+r5DHpjCazfm88sLTx4sd2ba9TFBaTnRvLt6VrgT2uJX2wcqqyLvQSGoXWzSM/CtCYhMjbM/MyluK/QdST7+sqZ9POeEVCU0Qp6Sh9L0FDYxYi925UeizTzNoy2IvT8GkR2DfqJuzdOD02c7yKnkyjQTbqspXTWGrTuvwh2twsjVQI0C5BPYeQLysYayNwCZYu8OjhV96wJW+gCrInufRnw8qkijJYpkFGGblnQsrYiK3Pw2SYEOSTeIyTfCzIMOHCiarr/Y9MfAn57chSGfh3G0UXox0chjAq0TC5xqyRMDYh3QOyoQY9l4FNY3Wa4sr1ugZlFJJPFenAk+iCrs+DISpwNEoYaSDzI0FV61T49T2Q0MyeC/DDsEfMfuPn+E6dpYvXNF8T+ACQssCxId2NLaDFIOpDepiKpMWSkWgTJJslEpcXIiaXlDXduHeeqntn68Nj71ST8Oo54Uw37yl9NAatKlKfk7yj8jhLmIXbVW+WQEK3XM7h6p9bS20HiWn/jJyJiftc5xoJKP0/NrEvn0EfkBsqvjsjxkYR+2Rre7CEcUtGrjqIimyLzKJga1PYAcVW5dF2WsVxUEgeahiuVQwl2y11onSQ2pmHmiJXn2PmGJHLL+AXedwcH1daMZZNmlCDJrt8Ex+O/wf+kfgAhFxenJ2BlUQAAAABJRU5ErkJggg=="></span>\
          <span class="search-greeting-text">Good morning! How can I help you today?</span>\
        </div>\
        <div class="search-greeting-close-container pointer" >\
          <span class="search-greeting-close-body">\
          <img src="./libs/images/close.svg" class="search-greeting-close-icon ">\
          </span>\
        </div>\
      </script> ';
      var searchResultModal = '<script type="text/x-jqury-tmpl">\
        <div id="search-modal" class="search-modal">\
          <div class="search-modal-content">\
            <div class="search-modal-header">\
              <span class="search-modal-close">&times;</span>\
              <h2>Modal Header</h2>\
            </div>\
            <div class="search-modal-body">\
              <p>Some text in the Modal Body</p>\
              <p>Some other text...</p>\
            </div>\
            <div class="search-modal-footer">\
              <h3>Modal Footer</h3>\
            </div>\
          </div>\
        </div>\
      </script>';
      var liveSearchData = '<script type="text/x-jqury-tmpl">\
      <div class="finalResults">\
          <div class="resultsOfSearch">\
          {{if faqs && faqs.length}}\
              <div class="matched-faq-containers">\
                <div class="search-heads">MATCHED FAQS</div>\
                <div class="tasks-wrp">\
                {{each(key, faq) faqs}}\
                <div class="faqs-shadow ">\
                <div class="faqs-wrp-content">\
                  <div class="title" boost="${faq.config.boost}" pinIndex="${faq.config.pinIndex}" visible="${faq.config.visible}" contentId="${faq.contentId}" contentType="${faq.contentType}">\
                      <span class="accordion" id="${key}">${faq.question}</span>\
                      <div class="panel">\
                        <div class="content-inner">{{html getHTMLForSearch(faq.answer)}}</div>\
                        <div class="divfeedback">\
                        <span class="yesLike"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIfSURBVHgB7ZTLaxNBHMe/sw/FxNaibXNQMY09iK/uQUVUcA5BJBUaSlokYMG/QMWTp7anIj5vghcpeCvSCoJCkEQQtSfTVqVYk66Pg5s9mEMjQrMZZxZRaXbbWWiglH5g2eE3P+Y7v/k9gPUCkXGiZ5NRTdUe8GULq7Hh508fTSAAioyTrqrZ3p5ueiHdbxCFjFOabEEApEQYSLS3J4GBdB8ikXYoISWJAEiJEMbMQvGzu97bsQcqiIEASInUGF5Mzbx3112HDoAR0oUAyEWikHyhaLrrM3EqfjR+LkUhieq3IZLbue/g8Vjn/igD+2XZ9nmDR7F7104sVCqYnZ2LFuc+jEICz0jiidSgFtZ+8CtkxScqStgXKj/d/YF0Py+ANhrvTt2BBHV9QhN9hkbY25sjQ+77+2GVbFy9NgjLsu/CweO/BzqknMmM5bFcJDpgRNrblhUQCJ9bI8PYGg5dDjWFsq2RHVnxxyaML/XVlhoWa4s5cUvxNPwArCQUi3Xg2NEjOHXyBM/TR1y/cbvOry6S3LMJkwHlkmVjtfBMPE+U+ak4j4aK8CE4VZg30VCR/5uvYSKMiFllQhZVVbFZ16DrqryIU3XyoqutUgkyNIe3oHV7M7Y1eVej5mUUFca7OXfv/igVI96Pw3966Tu/zDQfoH7Ra34HVJ3qxZdvJodevZ487bXPJ3E582Tsytcv3y7NTL8zHv6zm9hgzfMbPQCy+bppPcUAAAAASUVORK5CYII=" class="thumbs-up"></span>\
                        <span class="noDislike"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAYAAAB2pebxAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGQSURBVHgBnZRdTsJAEMdnP/C5RygnsN6gGkhINbEEeJcTEE9QbuARiM9CLAlEHyDWG9QT2CP00YR2x9m1TQyWgv0nzbazs7/O/veDQSG359tSyBlDtKFCyFi6Wc8vuteDGSC4v+KJLD8I8KwDyPCeAUv3IZn6iSEwGwGXjLOQPhzKnRiI6/sW7MDJs10/eg0TOCKCxNvVIur0hgACgJsqvqRDTXoKoEoGQjQNiaGheFHeORn6AQ1lIGSOrRAiaKiiEnJZ/F2RkyGuN6JlAmuzmkfQUFIqtKiK5JRkvSEZoM0Zf+h6g8DMgcyQGWepBLR0Qt0S6/6WEG80bkkmhLQxTTxTkJq3zs1wSp3B/kBU2N++LMISQAMfadrT/TxjrO7I8qxNlV3qR6Eam86MJ7oVQgSKUqsAYCZUoStvdEfVBtv1U7s4mJ/6J4emyyvJHG45qqVJ4C2XmqjOr2oIXQfl5tNA8usdasQPxJ3SDw1ExNpzJQ/EY3UGk443TDQwxzz+dyVkYl9vKrLdV1yNj10R3zHZqLxWCFHLAAAAAElFTkSuQmCC" class="thumbs-down"></span>\
                        </div>\
                    </div>\
                  </div>\
                  <div class="desc-info">Change of base location is not possible. A new Account will need to</div>\
                </div>\
                <div class="faqs-bottom-actions">\
                    <span class="appearences">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                    <span class="appearences-count">155 Appearances - 138 Clicks</span>\
                    </span>\
                    <span class="actions">\
                    <span class="img-action active rank-bar-item dont-show">\
                    <img src="">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADISURBVHgBrZCxEcIwDEUFNJQZIXSULtkGb2JvkIyQDTxCjgnCBklJZ5gA5Dsb5I9JCqK7d2fZ1pe+iP6MnTiPTMVcYq6YE3Nk9sxtScwyT8bEvIt5IjTQcwKhuwcRy/TiPjAwdal4gI5GvNfwnuy+o4HitiBSwSSNVJfFfbz3BREHf9WWvv08ILdCZIK3ezq0QtXHcXX0ipN0wmbmb6Tfm8adWCpETfmmQ+ewD0f58gwthIZppKBDkc2MkKKPjYm5ivHPzIHWiBftN1TqKHNJjAAAAABJRU5ErkJggg==">\
                    </span>\
                    <span class="img-action rank-bar-item pin">\
                    <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB8SURBVHgBldABEYAgDAXQRbCBRDCCEWgAEWhgBG1iFCMQgQg67ubdjtvc3N2/U+AxAMCuiJngRy2YG3N5YV9UCbnhzoAK+09QuvDEF2RMo8FKE2GA/XvlXYKwc2LjByj3kaDrubcBNQskWliGjrMFsnBUFwAGi4ZOAXzWA9ixNEz1wRORAAAAAElFTkSuQmCC">\
                    </span>\
                    <span class="img-action rank-bar-item boostup">\
                    <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACWSURBVHgBfY6xDYMwFERPIgNkgzhVypANGCEjZIOMkBVIR8cojAAbAB0dNRWc0RkZMJz09GX/r7sDwvqR28EOhow4UUkK97hsll/SkDZ0YMib/MkVAeUkJqnmyiHRrMhTUZDbrEIRkH2ssvOffXy8GDdtH0Skk3VC7uRBBpL5HZxTI7cXArI9aq/LTr3XZVGkaZSbbg8mYAgYxTIE26kAAAAASUVORK5CYII=">\
                    </span>\
                    <span class="img-action rank-bar-item boostdown">\
                    <img src="">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgBhZDBDYAgDEV/xAXcoKs4iW7gCqzgRLiGJ7160hH8ak1IAW3yGiiPUOoADGQjB/IhpKuYGhK0kJOCOnd4shhZtObt7VguSlb+lN7ndkXigxpp46Pur3VLVvw07mE+mJMS2TH1ZC6IE54ZyglkyhuCR14v1QAAAABJRU5ErkJggg==">\
                    </span>\
                    </span>\
                </div>\
              </div>\
                    {{/each}}\
                    </div>\
              </div>\
              {{/if}}\
              {{if pages && pages.length}}\
              <div class="matched-faq-containers matched-pages-container">\
              <div class="search-heads">MATCHED PAGES</div>\
              <div class="faqs-shadow tasks-wrp">\
              {{each(key, page) pages}}\
              <div class="faqs-shadow task-wrp" boost="${page.config.boost}" pinIndex="${page.config.pinIndex}" visible="${page.config.visible}" contentId="${page.contentId}" contentType="${page.contentType}">\
                 <a class="faqs-wrp-content" href="${page.url}" target="_blank">\
                 <div class="image-url-sec">\
                     <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABCCAYAAACsCQM4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABQrSURBVHgB7V1LkyPHcc4GGs95ADuvndkXl2tyQytTQUo62AdGOHzj0b747n9g/w9H+OIIHx2++OKDJDvCDl8cOkgHRUixokRS4orLWXL2MU/MYDB4A13Kr6qru7q6ugHM7moukxIW6O6qrKzMrHxV9dAjhvsMnuf9G38+4ssmXcOfCn4cBME/PmPwPvnkk/tPnjx5TNcCuCo4Y2F831v/h3/6URBM/4au4cogWFn7qUf/fS7oGq4azvwfPv+KHte3KbgWx1VC029TnYKXJ3QNVwv+9PCU6GRA13C14O99+Yxoem2Xrhr8v/uoQddw9eCNp+ymeUEUCnwlBHFSR5PJRD4s8E1cT6dT+QGUSiUaDAZUrVaJ418aj8dULpdpNBpRpVKR9wBoU6/XZX/BePEBDrTFvWtIgv/LpydUKRVpOA7o4WaZxHREx8fHtLe3R41GQwoDDIVwWq0WbW9vU7/fl0wF89vtNj148IAuLi7kBwJaXV2l3d1dWl5eJt/3IwF0Oh368MMPaWNjg64hCd7T1lBUfI/GvDCWygUqMeP6vT71B30WgkfBNKBarcZMH3NrQbVqnRneoRIzdjqZsqYHtLS0RBfdrtT6UsmXK2PCz8bcB8o/gSBKZV49IxZSg3xuc2Ug9JdIXC+MIAIv5xk52grjO+7v/f+huDJPnRhZiIjENz5ONJZQHxEKAv8XYiFZyPZsfs0+kaldAJfH/9Ot8dufBPRWQQhbA1zP6bX9hsYugnknFI4X+jBNi5hHL72C9IUJ4S4MCS2kt2YjkhPKJvQyAlDzF5nXi4KmQX8rJodCMbTd7oNHkDvMs77nFCQahoFQYh7GvUsLIh5QI3+7Fs6coBCvN5ZwMMWEggwhwWQhmZw3HvyoEGqFBHp1pwdU+GxhGvcWFkS8HKM79KZAZAz4uhpvw7yrUDNZDR+EghE2efhXCg/PAst/5IHZLiUI8QYnvAjMbZ/fMg1Z4LFfKBRiX6LNl93XFMgi4Me4/jRMEG/Qti88bnbMkNGHEh1M2rX5cglFP3fdzwL/jZoWRvVt60JivLFUpjrnC2MOywpFjzhHZ3vIv9ksDDnHOL4YynbvrC1Rbziho+6QNpcrVPRUWFcsFKnV5ey87FPVL9KTo3NaqZSoP55QjfHeadbp+VlPjrteLyOQoRL36Y+n9LzdozKblVvcZsTj75126eHWCk2kaVFVhMPzAe00avTZqzO6ze2WyyUqFT35XIeVoB1W7KAzpJurVZ5PMWX/YeZin5J08gnnTw7fYZjINxo1wfF8+vKU3ttYod2TDi0z40ATmHfBzL6/viSZ+cV+m5NHTvz8AjVrZfrFsyMpoMNOSX6POIlcrZb4ekh/vtOgV+d92l6t0WlvSPvnQ7pRDyRjOoMxPeCxfrV3LPdTJsy4esWXgi0yUzeWq/Q10/Hu2jJ9dXxBR50Bj1eiMRc5p0xYkwV40h1RdzSldn8kaeuNJnLsSaCUpsHtT1hpnrW69FfvbSpFMUJue5VoQZirIXN1GNevLQg7TH24tSpj+R1mHDQQE7tRr0htuLlSpS4zCQLABMvFAmf0AZX5GlpeY+FMJoIaVZ9a/QEzkrN3XkVb3G+XGYnVcXO1Ip0m81nieXXeoy1m+CTUuh4ztcEMRlvQc3OlRt/yisCk/VA4LV59IBtMvb9Wl4IBPihFZ1CQ7ZhsWmO6J6gcsHBZNwhlOQjYPXeKhAMoFosJB2+uDhd4//cqe2/OTHTeNJg4XVHMoiWIvMRxUfpjt5mRhIZZeTYd6Xv2SrGjKz8a2A7LHPfeJGSFkIswzWS++r1AX7KqRHOOO290Z+L3DH8BgBBgrlAM1Zj8y4SN/e6FXHqlSlX5GzmqYS9dtS0DRsMhlbkwqJfslCu7aOZjOXOnyXjIxcYpFf0yf/wIiW7fOWtx0bGinF2goqEyV33hsYe9Ln9xqMm/We+4XVX2H3OlWPbRePDtGbqmaeXPdDqR14VCaF6m6kGB6cP4mH+1vhRP06VU4Kt53/AXcs4sjGIoFHz8y5idF1//gZk5kERu3r5Hh3vfMPNGNOKKLa4BmEzvvC0n7aMEftqiKldp1d5Hgbbu3GM8X1GZK7vd9pmc2N33v0Nf/OLnVFteoSLveyytNllgVTo92mdG12jATP7gLz6m1uG+xIcKcKW2xH3r1Dp4JZlydnTANNyV7Wt1dtK/+RWt37pNSytNFmqRTrnvKbfZufeA6iur1D49ZrqHdHLwghprm8wUte9yY3OHx7ugfuecKkw3xlvfvkVr27dp78vPaYPn2T4+5Kr0kJrrW3Tv4XdDYYoU86NL414Rjj2MuFCp9v73xWRhSYxZoyfQGkZa4Qn3ux2eJEcjo6Fk3KDXo95Fm5Yba1JAxWKJhVFizUI048swFpoKrR/0L5Tj5P5VxjWZjJViQmNYA6F95VpdVTz5A+ZdtE+5lF6OQschKwC0HSsLjITmlhn/oN9V2sZth0zTUqOpxuNVBCERMmf+DQXS5g10TJkGrCD8Bn4okmBaQVttaYV6nbacl1+qkK4zra5thLzP8Cs596XpuowgAJjg088eywkNeTduNBpw5FGQGhIwQ5aaN1g79+nOe99hws/lZIf9HhXY1NSXV3myI+67Qi+fPWWNXmbhdaTg7j/6gM5ZS9u8OdVlYVZ5/6MIpjPTILzu+ZkkXDG3K1fSYNCTCrDSXJdMOnq5J7U0EFP6s+/9gPa/2aWz432Cyq401yQdFe6HOfR5bwWA1ba2tSOFjNV07+EjesW0gVFQtOrSMre9oI2dW3T88rm8bh3s04cf/7VUriwIU4rEtctuLyQIU6rQiNPDAzYfDakp0PYh79yBMWB8iW026uzQ4Alvp+pJQ8MwCWgr7D+EBs2DZsEmy0QoHANCBcMF4y74akXhus+bUENm/piFu7q+Kf1BH77B8yI/AMEBV4nbn7dOpLBhmuDXIKwaK8OIFQg4dUiJ3UTMMOD5VLg98GH1wjyhH55V+LvdOmaluSFN6tbdd3JrV/OukExBLB69XK5vqp9Vdu60W/TiqyfUYIafHLykKvuE1fV1Xm1HtMyrDsyE+arztiyiEL9Uknjuvf/IoCMZI+WFp8kSjEh2F3PQP+d9Oyr1E4MuwL8ox7AQLgJOwq17FTZNy2xOEAlB+0tsl6u1ZdbwntRmaONSY5W1ucKRRyCFtbZ5UwYTWD0G4tyxZ9aiRHbfLLwugQsZF3qptt7/PB+LJCIb8eW28OJQ1osN5QyBmcpgZqMpnM6+USP3/fBZcoyYxDT9Tgzxqp3BcHXfUG5DyMlmKkjwL1sNTS52ShMbEuKJJJGR5pmIKHZimvmzaMl6bjMqv7StEzRy46Gc+wuYYz2GZ7cLkzAZmV3WnkcJi61WiTgaSZNIMdte/gml0QU1YxJZqynhUzRNuJfJRHO0DFymYtr+IvIVhu+wcZjXRO6VQyqXwqcYJomZcVdK45yMTv+O61MhlnnkbPqbjOci8dtgxAxNnHXfxEuu1WT7DeHAMWPlxqUOMF4xX12ragQis7lXRMpXzNCGdH+Rublu3onmnbH07UUQNxVunDNMSOIATCjYRA3Lrok6FDJr7phvMdJ8X8nY6AsB6OH9TKLim+mY12KoKXXTSdtMFS7Ntx1ofFujMa41nqSaRmPM8A2uyDDTKZNIrVQ5qi5jpxy2wq2zfWi91nw9iay6XuSszUn3OOmqccIFQMkA2WudSwOewQwkWthBQzaKuhDa6U2Rgh7cMCe2huetDv08zaj4mQoBjXu6oUv7Q5mZWp7okwNOm08h062VIpnPCSOSQs9mvPZ7OVFgwjS1T05k+r79zn3OiBuckR7TN1zgQpLU5ewSdRb5m8sM7z76Hu09/VIWytqtIy6+qXrQg+9+JItkM01CSnPTQXyW9pDVMstsKSYYv5N17xSeecyhqbQyk2d+FIrYCC5EpkdkrMq8FeH9ZLeXeDLgOkwVTOWHKE2goDbicoLPJWmUFVAqwKppbmxJv4EVA/3EMsTzFa4XoUjmGiwxsJe90zXPSjGvoxPn5AgRXwOvC2SoyVqvNX9upz1DEb0ff90ViYZWSApmy3OaiWUeN80bLIU3vukOF20bbpxdc62clMkjx7oSIu2QKY0vj4lQMs18PRdhONrkcCZectKa8pseXt3CLlFYg3dBbFpdhFpOM2qsSRCReXDskVDaQZJjcrEPU/iNpM/dIWFSKD1CNI7pa6InYR/FfC7f+8V4v5lLKin/5Zk/YkwmfbaJk98FT4az8j77Gx+Odjzsh09JIUzZTxCoM14dxpo5OyXDRSfTHZBhSxNNEs2Fs7/dzhSe/m2tI+dABThbDjMR68v9PS7VjyZZY4e4o8l7Fn6RUBS7O0r7evcQj3yUoov+CuXBZe3g6+DKey5mCDDvvv1Mmxxt812RzSK+ZbG2cW4WHx5QT+XLJKWwahmHih6ZVUPVJ2SGjKu9TOera/2onlJoWiizSpXunxhPzLF67FVi+SBdWpDML/lyLyMPl9vvRS0SNOfRPattfHiAGYk9Wuw6be7clhsh2K3CJswU78lV1Wa/Li+XuTyNDRYcwkIUhQ0ihLCT8UTikW8KsdlDlHXBm/0ra+s0wMYQlj4zYZ33fnXOIZIzTE0iyxfE7chppqAknooz5cEEMN9MtIRjTBejQvZEz1xjv44QAHEeIYRMw3G6wpOnKUR4KuKCty5P1BYjdsV4L3dt6xY9/8PvZE6BPQIcCjjk7ck65xkT2FXerGnwVuWId+yQ8JUY5znnKNgOrfMm/vi8zeHvTbVKXMSrH85Jz3MERoTHVUAfXiXDvArWWJl9Hc+yNuByTdECQpDh/H9+eRa5HelwtBYZjVJDGFpqxgrqCIwf2j4vnITxRo42cyI7j5jLbziqsTKrD0sLSLLMwlqqfxbejOeuFRnETMjEZeMwyyZm27EQdtEvTUwW4Z6OsPQ1UXgGSVUZXf08SzjzOHcnDca1tvcywy0U5sdhPcunJcmPLJOmn9uQd0T/8VGX/uW3B+TjRMMgPMmQHFojTFV1HAPbMXR8bUbF0Wq1hW9mqJn8UKYSCoA6FzQePgYvkyDCHOi+DjMySwgpE6L/Td2P8yI7cxSUsZJEkpM6gYM/PZyW6N9/z+Wh6RhHc6rSMcunjlpMjMIaMvawlB0F6TOflP3cnpNIChOMhi8phY5Wab2XwuOmwYzlbRMVhN9Zmm33E6E5oox5ZPkEYzqGE8CDz79t0w83avQ+K5ZvIktK2KQoR6NCP2HvN5vszdyHiHxHDLKGX/RlRmtWMu1R57mXZ3bnMVWeF80s923VdI7g8AfCasDgs079bL9LjZ0qFYAkMF7Y67bb4fLjoh9HSPJ4I4exKP7h4NZYHrWMTzdjAJwpQpqOI4g4BTgeDaQJwRnXaGLWJKNiF5sb2He8VI8X5/HXCmq1qryXdV5onnfgbLtsjpsvhOQYmhfZ7ZP+IxBhopaheGb7H9xcIVTyHp8OyfuPz48itcT5oJNXL2jj1h1pwzoctqIWtfvFp3T3vUe0/+3XEWE4lojjjatcBsdBq7XtW/K0XZ/DXZx5lYfNmLGIpNAHoeSUc4wP/vJj2c6M573wLaE40cyeeCZD4tmm7mcV6Jx4zFU6U2h6dakec7VFUsnKB8WDsn160KZ/fbzHgvjsSJgNcX5Vn5aDVvV47wFUYY8Bp/KQpIG5cJRYHTjRhz44+CVP9E3VyT2cBMQGE86MjriWhdI6zskuN5oGk2xztjhERtAhgFmMTLQXUa/ZkZFtxkV+aSOuSnjS5OKML+pZ6nlAg8k0vWedOLrOjnGpcUM9wFLljLriaSdaiLYF7W/9O3/i4tLMj3AoRClln2XTk3REmOaiy864Z60EAIQAnuBvlJStvRp0rSDrdzlSsFAxU9lw9b6BFxbFCmEJ10tUgBNVqGCa7U5FsjLqItvQc8oCVwyhHaRw4nbtAMbBhrrOy5QT/6i+MxVJ4UPwUamU5SqQ714QqRqXUefy61xDQi6RTpriL3yCGDUtBHMRHLclb3YbFw2LvNfsMjuJAII8MnfchSssNWhIbJxFA6hCZ6Vclu/djTigMQEnzlXaoIB3QCvka3MUj5QYdJ4ohWKyQ+arq/n65PPfRVfi2ZxmLosm10pw5QVZbV2AQAQOWb3U6BozDCJC8G3tUC9glE2K1Gm9QO0qxY4nTbDt8Ozjk9HR+wwwBSJMHAsKwFaePKXQ49j9nW1n+Q+S777IwmmFlTuKBp3KnMTjm5O84DC0dfCStu68o95z4NLHs9/9RiK6sbUt2ww4xEUpOw5Jx/LPySEaQqVVvUhSkK866QhpIt++8anKzxESIyBQxJF89ap1tE/Lq00ZcU3Zv0DueCMJuHGaBIe0tu7en5sh+UVLSuFJKk1e9JMPyP6xChI1L+HOe2y6EgfMJOO4AYSgobm5TWecqPU6nTBDDpjhdbly5B98gvS5PfINvKACASCHwP5FBe/HhS+tIHdASR3hLwRRqdflPgVCXoS2EAJK7Ni6Rdm8WODSdaUohXF6ekybLAixiB9YQKsTjBKz29uA/jovuCxt3n99MzjlJ03pa7x8OzqPr4gz5vn8yqxJymw1EJSHLj8KSzrnLFPmxpkfRRXkG0olaYZclV9nJTZMiG0o8JNfizAW1N8xGGVuzYkZDHbt+7oInMfeanMwW6Y23e6xnAzPct6UTx92/PBHJ2vVmlsItAAI8RPvR7v9+932yeOiV2imBs5wlJeB1ErLeTsk0x7bSYsQRjibdoZRBEfkPqJJNsNEFG7bgUNMtkdVNp2yFpY1j3AOrjxH8xgBUUW5gLPxNPi+xAJhcJD1z9zkrf7nC7JCwkSbOWyy2fayeC7TF1kxsuO8Dag8/CJpHhHV/Ho8mf79375be/ZHrNr4QVdgl88AAAAASUVORK5CYII="></img>\
                 </div>\
                 <div class="pages-content">\
                   <div class="title" title="${page.title}">${page.title}</div>\
                   <div class="desc-info">Change of base location is not possible. A new Account will need to</div>\
                 </div>\
                 </a>\
                 <div class="faqs-bottom-actions">\
                 <span class="appearences">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                 <span class="appearences-count">155 Appearances - 138 Clicks</span>\
                 </span>\
                 <span class="actions">\
                 <span class="img-action active rank-bar-item dont-show">\
                 <img src="">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADISURBVHgBrZCxEcIwDEUFNJQZIXSULtkGb2JvkIyQDTxCjgnCBklJZ5gA5Dsb5I9JCqK7d2fZ1pe+iP6MnTiPTMVcYq6YE3Nk9sxtScwyT8bEvIt5IjTQcwKhuwcRy/TiPjAwdal4gI5GvNfwnuy+o4HitiBSwSSNVJfFfbz3BREHf9WWvv08ILdCZIK3ezq0QtXHcXX0ipN0wmbmb6Tfm8adWCpETfmmQ+ewD0f58gwthIZppKBDkc2MkKKPjYm5ivHPzIHWiBftN1TqKHNJjAAAAABJRU5ErkJggg==">\
                 </span>\
                 <span class="img-action rank-bar-item pin">\
                 <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB8SURBVHgBldABEYAgDAXQRbCBRDCCEWgAEWhgBG1iFCMQgQg67ubdjtvc3N2/U+AxAMCuiJngRy2YG3N5YV9UCbnhzoAK+09QuvDEF2RMo8FKE2GA/XvlXYKwc2LjByj3kaDrubcBNQskWliGjrMFsnBUFwAGi4ZOAXzWA9ixNEz1wRORAAAAAElFTkSuQmCC">\
                 </span>\
                 <span class="img-action rank-bar-item boostup">\
                 <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACWSURBVHgBfY6xDYMwFERPIgNkgzhVypANGCEjZIOMkBVIR8cojAAbAB0dNRWc0RkZMJz09GX/r7sDwvqR28EOhow4UUkK97hsll/SkDZ0YMib/MkVAeUkJqnmyiHRrMhTUZDbrEIRkH2ssvOffXy8GDdtH0Skk3VC7uRBBpL5HZxTI7cXArI9aq/LTr3XZVGkaZSbbg8mYAgYxTIE26kAAAAASUVORK5CYII=">\
                 </span>\
                 <span class="img-action rank-bar-item boostdown">\
                 <img src="">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgBhZDBDYAgDEV/xAXcoKs4iW7gCqzgRLiGJ7160hH8ak1IAW3yGiiPUOoADGQjB/IhpKuYGhK0kJOCOnd4shhZtObt7VguSlb+lN7ndkXigxpp46Pur3VLVvw07mE+mJMS2TH1ZC6IE54ZyglkyhuCR14v1QAAAABJRU5ErkJggg==">\
                 </span>\
                 </span>\
             </div>\
              </div>\
              {{/each}}\
              </div>\
              </div>\
              {{/if}}\
              {{if tasks && tasks.length}}\
                <div class="resultsButtons asstTask" >\
                    <span class="search-heads">SUGGESTED ACTIONS</span>\
                    <div class="faqBtnContainer">\
                        <div class="tasks-wrp action-wrp">\
                          {{each(key, task) tasks}}\
                            <div class="task-wrp action-wrp" boost="${task.config.boost}" pinIndex="${task.config.pinIndex}" visible="${task.config.visible}" contentId="${task.contentId}" contentType="${task.contentType}">\
                              <button id="${key}" class="faq search-task" title="${task.taskName}" >\
                                  <img src="./libs/images/credit-card.svg" class="credit-card">\
                                  ${task.taskName}\
                              </button>\
                              <div class="ranking-action-bar">\
                                  <div class="rank-bar-item dont-show">Dont Show</div>\
                                  <div class="rank-bar-item pin">Pin</div>\
                                  <div class="rank-bar-item boostup">Boostup</div>\
                                  <div class="rank-bar-item boostdown">Boostdown</div>\
                                  <div class="rank-bar-item cross">Close</div>\
                              </div>\
                            </div>\
                          {{/each}}\
                        </div>\
                    </div>\
                </div>\
              {{/if}}\
              {{if showAllResults}}\
                <div style="order:4;">\
                  <span class="pointer show-all-results" >See all results<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACHSURBVHgBlZDBDYUwDEOdin/+sEGkMhBMACOwCSuwASMwAwMglQ3YICTAAQ6lwpdUkV9lB4iImXPmsrd537sYEELYAClA2XiHosAJLS1EVrhfjy9i9gN739ibNGenM09SJA3E1RqJNqT1t7+1U0Up51GYskm7zNaJvpht595zP83JKNdBHtoBNXcrtgi1OOQAAAAASUVORK5CYII="></span>\
                </div>\
              {{/if}}\
              {{if noResults}} <span class="text-center">No results found</span> {{/if}}\
          </div>\
      </div>\
      </script>';
      var searchFullData = '<script type="text/x-jqury-tmpl">\
      <div class="ksa-results-tabesHeader">\
      <div class="title-backbutton">\
      <div class="title">Search results</div>\
      <div class=""><button class="full-search-close">Close</button>\
      </div>\
      </div>\
        <ul class="nav nav-tabs">\
          <li class="tabTitle">\
            {{each(key, facet) facets}}\
                <a class="capital facet" id="${facet.key}" href="#home" data-toggle="tab">${facet.key}\
                    <span class="resultCount">(${facet.value})</span>\
                </a>\
            {{/each}}\
          </li>\
        </ul>\
      </div>\
      <div class="ksa-resultsContainer">\
        <div class="resultsLeft">\
          <div class="tab-content">\
            <div id="home" class="tab-pane fade in active show fullSearch">\
                <p class="resultsText">Showing ${totalResultsCount} results for "${search}"</p>\
                {{if tasks.length && (selectedFacet === "task" || selectedFacet === "all results") }}\
                    <div class="quickAction fullAsstTask">\
                        <p class="quickTitle">SUGGESTED ACTIONS</p>\
                        {{each(key, task) selectedFacet === "all results" ? tasks.slice(0,4) : tasks }}\
                        <div class="creditCard ">\
                            <div class="creditCardIconDiv">\
                                <img src="./libs/images/credit-card.svg" class="credit-card">\
                            </div>\
                            <div class="creditCardDetails search-task" title="${task.taskName}">\
                                <p class="title">${task.taskName}</p>\
                                <p class="desc">${task.text}</p>\
                            </div>\
                        </div>\
                        {{/each}}\
                    </div>\
                {{/if}}\
                {{if pages.length && (selectedFacet === "page" || selectedFacet === "all results")}}\
              <div class="matched-faq-containers matched-pages-container ksa-relatedPages fullAsstPage">\
              <div class="relatedPagesTitle">MATCHED PAGES</div>\
              {{each(key, page) selectedFacet === "all results" ? pages.slice(0,5) : pages }}\
              <div class="faqs-shadow">\
                 <a class="faqs-wrp-content" href="${page.url}" target="_blank">\
                 <div class="image-url-sec">\
                     <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABCCAYAAACsCQM4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABQrSURBVHgB7V1LkyPHcc4GGs95ADuvndkXl2tyQytTQUo62AdGOHzj0b747n9g/w9H+OIIHx2++OKDJDvCDl8cOkgHRUixokRS4orLWXL2MU/MYDB4A13Kr6qru7q6ugHM7moukxIW6O6qrKzMrHxV9dAjhvsMnuf9G38+4ssmXcOfCn4cBME/PmPwPvnkk/tPnjx5TNcCuCo4Y2F831v/h3/6URBM/4au4cogWFn7qUf/fS7oGq4azvwfPv+KHte3KbgWx1VC029TnYKXJ3QNVwv+9PCU6GRA13C14O99+Yxoem2Xrhr8v/uoQddw9eCNp+ymeUEUCnwlBHFSR5PJRD4s8E1cT6dT+QGUSiUaDAZUrVaJ418aj8dULpdpNBpRpVKR9wBoU6/XZX/BePEBDrTFvWtIgv/LpydUKRVpOA7o4WaZxHREx8fHtLe3R41GQwoDDIVwWq0WbW9vU7/fl0wF89vtNj148IAuLi7kBwJaXV2l3d1dWl5eJt/3IwF0Oh368MMPaWNjg64hCd7T1lBUfI/GvDCWygUqMeP6vT71B30WgkfBNKBarcZMH3NrQbVqnRneoRIzdjqZsqYHtLS0RBfdrtT6UsmXK2PCz8bcB8o/gSBKZV49IxZSg3xuc2Ug9JdIXC+MIAIv5xk52grjO+7v/f+huDJPnRhZiIjENz5ONJZQHxEKAv8XYiFZyPZsfs0+kaldAJfH/9Ot8dufBPRWQQhbA1zP6bX9hsYugnknFI4X+jBNi5hHL72C9IUJ4S4MCS2kt2YjkhPKJvQyAlDzF5nXi4KmQX8rJodCMbTd7oNHkDvMs77nFCQahoFQYh7GvUsLIh5QI3+7Fs6coBCvN5ZwMMWEggwhwWQhmZw3HvyoEGqFBHp1pwdU+GxhGvcWFkS8HKM79KZAZAz4uhpvw7yrUDNZDR+EghE2efhXCg/PAst/5IHZLiUI8QYnvAjMbZ/fMg1Z4LFfKBRiX6LNl93XFMgi4Me4/jRMEG/Qti88bnbMkNGHEh1M2rX5cglFP3fdzwL/jZoWRvVt60JivLFUpjrnC2MOywpFjzhHZ3vIv9ksDDnHOL4YynbvrC1Rbziho+6QNpcrVPRUWFcsFKnV5ey87FPVL9KTo3NaqZSoP55QjfHeadbp+VlPjrteLyOQoRL36Y+n9LzdozKblVvcZsTj75126eHWCk2kaVFVhMPzAe00avTZqzO6ze2WyyUqFT35XIeVoB1W7KAzpJurVZ5PMWX/YeZin5J08gnnTw7fYZjINxo1wfF8+vKU3ttYod2TDi0z40ATmHfBzL6/viSZ+cV+m5NHTvz8AjVrZfrFsyMpoMNOSX6POIlcrZb4ekh/vtOgV+d92l6t0WlvSPvnQ7pRDyRjOoMxPeCxfrV3LPdTJsy4esWXgi0yUzeWq/Q10/Hu2jJ9dXxBR50Bj1eiMRc5p0xYkwV40h1RdzSldn8kaeuNJnLsSaCUpsHtT1hpnrW69FfvbSpFMUJue5VoQZirIXN1GNevLQg7TH24tSpj+R1mHDQQE7tRr0htuLlSpS4zCQLABMvFAmf0AZX5GlpeY+FMJoIaVZ9a/QEzkrN3XkVb3G+XGYnVcXO1Ip0m81nieXXeoy1m+CTUuh4ztcEMRlvQc3OlRt/yisCk/VA4LV59IBtMvb9Wl4IBPihFZ1CQ7ZhsWmO6J6gcsHBZNwhlOQjYPXeKhAMoFosJB2+uDhd4//cqe2/OTHTeNJg4XVHMoiWIvMRxUfpjt5mRhIZZeTYd6Xv2SrGjKz8a2A7LHPfeJGSFkIswzWS++r1AX7KqRHOOO290Z+L3DH8BgBBgrlAM1Zj8y4SN/e6FXHqlSlX5GzmqYS9dtS0DRsMhlbkwqJfslCu7aOZjOXOnyXjIxcYpFf0yf/wIiW7fOWtx0bGinF2goqEyV33hsYe9Ln9xqMm/We+4XVX2H3OlWPbRePDtGbqmaeXPdDqR14VCaF6m6kGB6cP4mH+1vhRP06VU4Kt53/AXcs4sjGIoFHz8y5idF1//gZk5kERu3r5Hh3vfMPNGNOKKLa4BmEzvvC0n7aMEftqiKldp1d5Hgbbu3GM8X1GZK7vd9pmc2N33v0Nf/OLnVFteoSLveyytNllgVTo92mdG12jATP7gLz6m1uG+xIcKcKW2xH3r1Dp4JZlydnTANNyV7Wt1dtK/+RWt37pNSytNFmqRTrnvKbfZufeA6iur1D49ZrqHdHLwghprm8wUte9yY3OHx7ugfuecKkw3xlvfvkVr27dp78vPaYPn2T4+5Kr0kJrrW3Tv4XdDYYoU86NL414Rjj2MuFCp9v73xWRhSYxZoyfQGkZa4Qn3ux2eJEcjo6Fk3KDXo95Fm5Yba1JAxWKJhVFizUI048swFpoKrR/0L5Tj5P5VxjWZjJViQmNYA6F95VpdVTz5A+ZdtE+5lF6OQschKwC0HSsLjITmlhn/oN9V2sZth0zTUqOpxuNVBCERMmf+DQXS5g10TJkGrCD8Bn4okmBaQVttaYV6nbacl1+qkK4zra5thLzP8Cs596XpuowgAJjg088eywkNeTduNBpw5FGQGhIwQ5aaN1g79+nOe99hws/lZIf9HhXY1NSXV3myI+67Qi+fPWWNXmbhdaTg7j/6gM5ZS9u8OdVlYVZ5/6MIpjPTILzu+ZkkXDG3K1fSYNCTCrDSXJdMOnq5J7U0EFP6s+/9gPa/2aWz432Cyq401yQdFe6HOfR5bwWA1ba2tSOFjNV07+EjesW0gVFQtOrSMre9oI2dW3T88rm8bh3s04cf/7VUriwIU4rEtctuLyQIU6rQiNPDAzYfDakp0PYh79yBMWB8iW026uzQ4Alvp+pJQ8MwCWgr7D+EBs2DZsEmy0QoHANCBcMF4y74akXhus+bUENm/piFu7q+Kf1BH77B8yI/AMEBV4nbn7dOpLBhmuDXIKwaK8OIFQg4dUiJ3UTMMOD5VLg98GH1wjyhH55V+LvdOmaluSFN6tbdd3JrV/OukExBLB69XK5vqp9Vdu60W/TiqyfUYIafHLykKvuE1fV1Xm1HtMyrDsyE+arztiyiEL9Uknjuvf/IoCMZI+WFp8kSjEh2F3PQP+d9Oyr1E4MuwL8ox7AQLgJOwq17FTZNy2xOEAlB+0tsl6u1ZdbwntRmaONSY5W1ucKRRyCFtbZ5UwYTWD0G4tyxZ9aiRHbfLLwugQsZF3qptt7/PB+LJCIb8eW28OJQ1osN5QyBmcpgZqMpnM6+USP3/fBZcoyYxDT9Tgzxqp3BcHXfUG5DyMlmKkjwL1sNTS52ShMbEuKJJJGR5pmIKHZimvmzaMl6bjMqv7StEzRy46Gc+wuYYz2GZ7cLkzAZmV3WnkcJi61WiTgaSZNIMdte/gml0QU1YxJZqynhUzRNuJfJRHO0DFymYtr+IvIVhu+wcZjXRO6VQyqXwqcYJomZcVdK45yMTv+O61MhlnnkbPqbjOci8dtgxAxNnHXfxEuu1WT7DeHAMWPlxqUOMF4xX12ragQis7lXRMpXzNCGdH+Rublu3onmnbH07UUQNxVunDNMSOIATCjYRA3Lrok6FDJr7phvMdJ8X8nY6AsB6OH9TKLim+mY12KoKXXTSdtMFS7Ntx1ofFujMa41nqSaRmPM8A2uyDDTKZNIrVQ5qi5jpxy2wq2zfWi91nw9iay6XuSszUn3OOmqccIFQMkA2WudSwOewQwkWthBQzaKuhDa6U2Rgh7cMCe2huetDv08zaj4mQoBjXu6oUv7Q5mZWp7okwNOm08h062VIpnPCSOSQs9mvPZ7OVFgwjS1T05k+r79zn3OiBuckR7TN1zgQpLU5ewSdRb5m8sM7z76Hu09/VIWytqtIy6+qXrQg+9+JItkM01CSnPTQXyW9pDVMstsKSYYv5N17xSeecyhqbQyk2d+FIrYCC5EpkdkrMq8FeH9ZLeXeDLgOkwVTOWHKE2goDbicoLPJWmUFVAqwKppbmxJv4EVA/3EMsTzFa4XoUjmGiwxsJe90zXPSjGvoxPn5AgRXwOvC2SoyVqvNX9upz1DEb0ff90ViYZWSApmy3OaiWUeN80bLIU3vukOF20bbpxdc62clMkjx7oSIu2QKY0vj4lQMs18PRdhONrkcCZectKa8pseXt3CLlFYg3dBbFpdhFpOM2qsSRCReXDskVDaQZJjcrEPU/iNpM/dIWFSKD1CNI7pa6InYR/FfC7f+8V4v5lLKin/5Zk/YkwmfbaJk98FT4az8j77Gx+Odjzsh09JIUzZTxCoM14dxpo5OyXDRSfTHZBhSxNNEs2Fs7/dzhSe/m2tI+dABThbDjMR68v9PS7VjyZZY4e4o8l7Fn6RUBS7O0r7evcQj3yUoov+CuXBZe3g6+DKey5mCDDvvv1Mmxxt812RzSK+ZbG2cW4WHx5QT+XLJKWwahmHih6ZVUPVJ2SGjKu9TOera/2onlJoWiizSpXunxhPzLF67FVi+SBdWpDML/lyLyMPl9vvRS0SNOfRPattfHiAGYk9Wuw6be7clhsh2K3CJswU78lV1Wa/Li+XuTyNDRYcwkIUhQ0ihLCT8UTikW8KsdlDlHXBm/0ra+s0wMYQlj4zYZ33fnXOIZIzTE0iyxfE7chppqAknooz5cEEMN9MtIRjTBejQvZEz1xjv44QAHEeIYRMw3G6wpOnKUR4KuKCty5P1BYjdsV4L3dt6xY9/8PvZE6BPQIcCjjk7ck65xkT2FXerGnwVuWId+yQ8JUY5znnKNgOrfMm/vi8zeHvTbVKXMSrH85Jz3MERoTHVUAfXiXDvArWWJl9Hc+yNuByTdECQpDh/H9+eRa5HelwtBYZjVJDGFpqxgrqCIwf2j4vnITxRo42cyI7j5jLbziqsTKrD0sLSLLMwlqqfxbejOeuFRnETMjEZeMwyyZm27EQdtEvTUwW4Z6OsPQ1UXgGSVUZXf08SzjzOHcnDca1tvcywy0U5sdhPcunJcmPLJOmn9uQd0T/8VGX/uW3B+TjRMMgPMmQHFojTFV1HAPbMXR8bUbF0Wq1hW9mqJn8UKYSCoA6FzQePgYvkyDCHOi+DjMySwgpE6L/Td2P8yI7cxSUsZJEkpM6gYM/PZyW6N9/z+Wh6RhHc6rSMcunjlpMjMIaMvawlB0F6TOflP3cnpNIChOMhi8phY5Wab2XwuOmwYzlbRMVhN9Zmm33E6E5oox5ZPkEYzqGE8CDz79t0w83avQ+K5ZvIktK2KQoR6NCP2HvN5vszdyHiHxHDLKGX/RlRmtWMu1R57mXZ3bnMVWeF80s923VdI7g8AfCasDgs079bL9LjZ0qFYAkMF7Y67bb4fLjoh9HSPJ4I4exKP7h4NZYHrWMTzdjAJwpQpqOI4g4BTgeDaQJwRnXaGLWJKNiF5sb2He8VI8X5/HXCmq1qryXdV5onnfgbLtsjpsvhOQYmhfZ7ZP+IxBhopaheGb7H9xcIVTyHp8OyfuPz48itcT5oJNXL2jj1h1pwzoctqIWtfvFp3T3vUe0/+3XEWE4lojjjatcBsdBq7XtW/K0XZ/DXZx5lYfNmLGIpNAHoeSUc4wP/vJj2c6M573wLaE40cyeeCZD4tmm7mcV6Jx4zFU6U2h6dakec7VFUsnKB8WDsn160KZ/fbzHgvjsSJgNcX5Vn5aDVvV47wFUYY8Bp/KQpIG5cJRYHTjRhz44+CVP9E3VyT2cBMQGE86MjriWhdI6zskuN5oGk2xztjhERtAhgFmMTLQXUa/ZkZFtxkV+aSOuSnjS5OKML+pZ6nlAg8k0vWedOLrOjnGpcUM9wFLljLriaSdaiLYF7W/9O3/i4tLMj3AoRClln2XTk3REmOaiy864Z60EAIQAnuBvlJStvRp0rSDrdzlSsFAxU9lw9b6BFxbFCmEJ10tUgBNVqGCa7U5FsjLqItvQc8oCVwyhHaRw4nbtAMbBhrrOy5QT/6i+MxVJ4UPwUamU5SqQ714QqRqXUefy61xDQi6RTpriL3yCGDUtBHMRHLclb3YbFw2LvNfsMjuJAII8MnfchSssNWhIbJxFA6hCZ6Vclu/djTigMQEnzlXaoIB3QCvka3MUj5QYdJ4ohWKyQ+arq/n65PPfRVfi2ZxmLosm10pw5QVZbV2AQAQOWb3U6BozDCJC8G3tUC9glE2K1Gm9QO0qxY4nTbDt8Ozjk9HR+wwwBSJMHAsKwFaePKXQ49j9nW1n+Q+S777IwmmFlTuKBp3KnMTjm5O84DC0dfCStu68o95z4NLHs9/9RiK6sbUt2ww4xEUpOw5Jx/LPySEaQqVVvUhSkK866QhpIt++8anKzxESIyBQxJF89ap1tE/Lq00ZcU3Zv0DueCMJuHGaBIe0tu7en5sh+UVLSuFJKk1e9JMPyP6xChI1L+HOe2y6EgfMJOO4AYSgobm5TWecqPU6nTBDDpjhdbly5B98gvS5PfINvKACASCHwP5FBe/HhS+tIHdASR3hLwRRqdflPgVCXoS2EAJK7Ni6Rdm8WODSdaUohXF6ekybLAixiB9YQKsTjBKz29uA/jovuCxt3n99MzjlJ03pa7x8OzqPr4gz5vn8yqxJymw1EJSHLj8KSzrnLFPmxpkfRRXkG0olaYZclV9nJTZMiG0o8JNfizAW1N8xGGVuzYkZDHbt+7oInMfeanMwW6Y23e6xnAzPct6UTx92/PBHJ2vVmlsItAAI8RPvR7v9+932yeOiV2imBs5wlJeB1ErLeTsk0x7bSYsQRjibdoZRBEfkPqJJNsNEFG7bgUNMtkdVNp2yFpY1j3AOrjxH8xgBUUW5gLPxNPi+xAJhcJD1z9zkrf7nC7JCwkSbOWyy2fayeC7TF1kxsuO8Dag8/CJpHhHV/Ho8mf79375be/ZHrNr4QVdgl88AAAAASUVORK5CYII="></img>\
                 </div>\
                 <div class="pages-content">\
                   <div class="title" title="${page.title}">${page.title}</div>\
                   <div class="desc-info">Change of base location is not possible. A new Account will need to</div>\
                 </div>\
                 </a>\
                 <div class="faqs-bottom-actions">\
                 <span class="appearences">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                 <span class="appearences-count">155 Appearances - 138 Clicks</span>\
                 </span>\
                 <span class="actions">\
                 <span class="img-action active rank-bar-item dont-show">\
                 <img src="">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADISURBVHgBrZCxEcIwDEUFNJQZIXSULtkGb2JvkIyQDTxCjgnCBklJZ5gA5Dsb5I9JCqK7d2fZ1pe+iP6MnTiPTMVcYq6YE3Nk9sxtScwyT8bEvIt5IjTQcwKhuwcRy/TiPjAwdal4gI5GvNfwnuy+o4HitiBSwSSNVJfFfbz3BREHf9WWvv08ILdCZIK3ezq0QtXHcXX0ipN0wmbmb6Tfm8adWCpETfmmQ+ewD0f58gwthIZppKBDkc2MkKKPjYm5ivHPzIHWiBftN1TqKHNJjAAAAABJRU5ErkJggg==">\
                 </span>\
                 <span class="img-action rank-bar-item pin">\
                 <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB8SURBVHgBldABEYAgDAXQRbCBRDCCEWgAEWhgBG1iFCMQgQg67ubdjtvc3N2/U+AxAMCuiJngRy2YG3N5YV9UCbnhzoAK+09QuvDEF2RMo8FKE2GA/XvlXYKwc2LjByj3kaDrubcBNQskWliGjrMFsnBUFwAGi4ZOAXzWA9ixNEz1wRORAAAAAElFTkSuQmCC">\
                 </span>\
                 <span class="img-action rank-bar-item boostup">\
                 <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACWSURBVHgBfY6xDYMwFERPIgNkgzhVypANGCEjZIOMkBVIR8cojAAbAB0dNRWc0RkZMJz09GX/r7sDwvqR28EOhow4UUkK97hsll/SkDZ0YMib/MkVAeUkJqnmyiHRrMhTUZDbrEIRkH2ssvOffXy8GDdtH0Skk3VC7uRBBpL5HZxTI7cXArI9aq/LTr3XZVGkaZSbbg8mYAgYxTIE26kAAAAASUVORK5CYII=">\
                 </span>\
                 <span class="img-action rank-bar-item boostdown">\
                 <img src="">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgBhZDBDYAgDEV/xAXcoKs4iW7gCqzgRLiGJ7160hH8ak1IAW3yGiiPUOoADGQjB/IhpKuYGhK0kJOCOnd4shhZtObt7VguSlb+lN7ndkXigxpp46Pur3VLVvw07mE+mJMS2TH1ZC6IE54ZyglkyhuCR14v1QAAAABJRU5ErkJggg==">\
                 </span>\
                 </span>\
             </div>\
              </div>\
              {{/each}}\
              {{if selectedFacet !== "page" && pages.length>5}}\
                <div class="ksa-showMore">Show More</div>\
              {{/if}}\
              </div>\
              {{/if}}\
                {{if faqs.length && (selectedFacet === "faq" || selectedFacet === "all results") }}\
                  <div class="ksa-mostlyAsked fullAsstFaq">\
                    <p class="mostlyAskedTitle">MATCHED FAQS</p>\
                    <div class="asstFaq" id="accordionExample">\
                      {{each(key, faq) selectedFacet === "all results" ? faqs.slice(0,5) : faqs  }}\
                        <button class="accordion" id="${key}">${faq.question} </button>\
                        <div class="panel">\
                          <div class="content-inner">{{html getHTMLForSearch(faq.answer)}}</div>\
                          <div class="divfeedback">\
                            <span class="yesLike"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIfSURBVHgB7ZTLaxNBHMe/sw/FxNaibXNQMY09iK/uQUVUcA5BJBUaSlokYMG/QMWTp7anIj5vghcpeCvSCoJCkEQQtSfTVqVYk66Pg5s9mEMjQrMZZxZRaXbbWWiglH5g2eE3P+Y7v/k9gPUCkXGiZ5NRTdUe8GULq7Hh508fTSAAioyTrqrZ3p5ueiHdbxCFjFOabEEApEQYSLS3J4GBdB8ikXYoISWJAEiJEMbMQvGzu97bsQcqiIEASInUGF5Mzbx3112HDoAR0oUAyEWikHyhaLrrM3EqfjR+LkUhieq3IZLbue/g8Vjn/igD+2XZ9nmDR7F7104sVCqYnZ2LFuc+jEICz0jiidSgFtZ+8CtkxScqStgXKj/d/YF0Py+ANhrvTt2BBHV9QhN9hkbY25sjQ+77+2GVbFy9NgjLsu/CweO/BzqknMmM5bFcJDpgRNrblhUQCJ9bI8PYGg5dDjWFsq2RHVnxxyaML/XVlhoWa4s5cUvxNPwArCQUi3Xg2NEjOHXyBM/TR1y/cbvOry6S3LMJkwHlkmVjtfBMPE+U+ak4j4aK8CE4VZg30VCR/5uvYSKMiFllQhZVVbFZ16DrqryIU3XyoqutUgkyNIe3oHV7M7Y1eVej5mUUFca7OXfv/igVI96Pw3966Tu/zDQfoH7Ra34HVJ3qxZdvJodevZ487bXPJ3E582Tsytcv3y7NTL8zHv6zm9hgzfMbPQCy+bppPcUAAAAASUVORK5CYII=" class="thumbs-up"></span>\
                            <span class="noDislike"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAYAAAB2pebxAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGQSURBVHgBnZRdTsJAEMdnP/C5RygnsN6gGkhINbEEeJcTEE9QbuARiM9CLAlEHyDWG9QT2CP00YR2x9m1TQyWgv0nzbazs7/O/veDQSG359tSyBlDtKFCyFi6Wc8vuteDGSC4v+KJLD8I8KwDyPCeAUv3IZn6iSEwGwGXjLOQPhzKnRiI6/sW7MDJs10/eg0TOCKCxNvVIur0hgACgJsqvqRDTXoKoEoGQjQNiaGheFHeORn6AQ1lIGSOrRAiaKiiEnJZ/F2RkyGuN6JlAmuzmkfQUFIqtKiK5JRkvSEZoM0Zf+h6g8DMgcyQGWepBLR0Qt0S6/6WEG80bkkmhLQxTTxTkJq3zs1wSp3B/kBU2N++LMISQAMfadrT/TxjrO7I8qxNlV3qR6Eam86MJ7oVQgSKUqsAYCZUoStvdEfVBtv1U7s4mJ/6J4emyyvJHG45qqVJ4C2XmqjOr2oIXQfl5tNA8usdasQPxJ3SDw1ExNpzJQ/EY3UGk443TDQwxzz+dyVkYl9vKrLdV1yNj10R3zHZqLxWCFHLAAAAAElFTkSuQmCC" class="thumbs-down"></span>\
                          </div>\
                        </div>\
                      {{/each}}\
                    </div>\
                    {{if selectedFacet !== "faq" && faqs.length>5}}\
                      <div class="moreFaqs">Show All</div>\
                    {{/if}}\
                  </div>\
                {{/if}}\
            </div>\
          </div>\
        </div>\
        <div class="ksa-resultsRight">\
            <div class="rightContainer">\
                <div class="rightContentSubTitle">Near by Branch/ATM</div>\
                <div class="img-block"><img src="./libs/images/newtheme/card-image.png" class="rightContainerImages"></div>\
                <div class="desc">Get more than just a bank account. Get a package of benefits and services plus convenient access and smart technology.</div>\
                <a href="#">Learn More</a>\
            </div>\
        </div>\
      </div>\
    </script>';
      var searchBar = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl">\
        <div class="ksa-searchContainer" style="position: relative; width: 100%; height: 100%;">\
          <div class="ksa-searchdiv">\
            <img class="searchIcon" src="./libs/images/search.svg" />\
            <input id="search" name="search" class="Search" placeholder="How can we help you?">\
            <button class="search-button">Go</button>\
          </div>\
        </div>\
      </script>';
      var payBillContainer = '<script type="text/x-jqury-tmpl">\
        <div class="pay-bill-container">\
          <div class="card-pay-legend"><img class="card-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMEwxNiAwIDE2IDE2IDAgMTZ6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzA1NkRBRSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuMzMzIDIuNjY3SDIuNjY3Yy0uNzQgMC0xLjMyNy41OTMtMS4zMjcgMS4zMzNsLS4wMDcgOGMwIC43NC41OTQgMS4zMzMgMS4zMzQgMS4zMzNoMTAuNjY2Yy43NCAwIDEuMzM0LS41OTMgMS4zMzQtMS4zMzNWNGMwLS43NC0uNTk0LTEuMzMzLTEuMzM0LTEuMzMzem0wIDkuMzMzSDIuNjY3VjhoMTAuNjY2djR6bTAtNi42NjdIMi42NjdWNGgxMC42NjZ2MS4zMzN6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=" alt=""><span class="selectedBiller">${selectedBiller}</span> <img class="closeAction" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjlweCIgdmlld0JveD0iMCAwIDkgOSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNTMuMiAoNzI2NDMpIC0gaHR0cHM6Ly9za2V0Y2hhcHAuY29tIC0tPgogICAgPHRpdGxlPmNsb3NlLWJsdWUtaWNvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtb3BhY2l0eT0iMC41Ij4KICAgICAgICA8ZyBpZD0iY2xvc2UtYmx1ZS1pY29uIiBmaWxsPSIjMDQ2Q0FEIj4KICAgICAgICAgICAgPHBhdGggZD0iTTguMzY2Mzk3NjIsMC4wODgwMjkyMTgzIEM4LjUxODc0OTMyLC0wLjAzNzMyMzQ0NzcgOC43NDM3NDEyOSwtMC4wMjg5NjY2MDMzIDguODg2NDUwNDcsMC4xMTM3NDI1ODYgQzkuMDM3NTE2NTEsMC4yNjQ4MDg2MTkgOS4wMzc1MTY1MSwwLjUwOTcyODQ0MyA4Ljg4NjQ1MDQ3LDAuNjYwMTUxNjQyIEw1LjA0NjE1OTA2LDQuNDk5ODAwMjMgTDguODg1ODA3NjQsOC4zMzg4MDU5OCBDOS4wMzY4NzM2Nyw4LjQ4OTg3MjAxIDkuMDM2ODczNjcsOC43MzQ3OTE4MyA4Ljg4NTgwNzY0LDguODg2NTAwNyBDOC43NDMwOTg0NSw5LjAyODU2NzA2IDguNTE4MTA2NDksOS4wMzY5MjM5IDguMzY1NzU0NzksOC45MTE1NzEyMyBMOC4zMzgxMTI5Miw4Ljg4NTg1Nzg3IEw0LjQ5OTc1LDUuMDQ3NDk0OTUgTDAuNjYwNzQ0MjUsOC44ODcxNDM1NCBMMC42MzMxMDIzOCw4LjkxMjIxNDA3IEMwLjQ4MDc1MDY3OSw5LjAzNzU2NjczIDAuMjU1NzU4NzE0LDkuMDI5MjA5ODkgMC4xMTMwNDk1MjUsOC44ODY1MDA3IEMtMC4wMzgwMTY1MDgzLDguNzM1NDM0NjcgLTAuMDM4MDE2NTA4Myw4LjQ5MDUxNDg0IDAuMTEzMDQ5NTI1LDguMzQwMDkxNjQgTDMuOTUzMzQwOTQsNC40OTk4MDAyMyBMMC4xMTMwNDk1MjUsMC42NjA3OTQ0NzcgQy0wLjAzODAxNjUwODMsMC41MDk3Mjg0NDMgLTAuMDM4MDE2NTA4MywwLjI2NDgwODYxOSAwLjExMzA0OTUyNSwwLjExMzA5OTc1MSBDMC4yNTU3NTg3MTQsLTAuMDI4OTY2NjAzMyAwLjQ4MDc1MDY3OSwtMC4wMzczMjM0NDc3IDAuNjMzMTAyMzgsMC4wODgwMjkyMTgzIEwwLjY2MDc0NDI1LDAuMTEzNzQyNTg2IEw0LjQ5OTc1LDMuOTUyMTA1NSBMOC4zMzg3NTU3NSwwLjExMzA5OTc1MSBMOC4zNjYzOTc2MiwwLjA4ODAyOTIxODMgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==" alt=""></div>\
          <div class="card-pay-title">Choose the credit card to pay bill</div>\
          <div class="card-container">\
            {{each(key, cardValue) data}}\
              <div class="card-details-container">\
                <div class="card-bold-text card-name btm-margin">${cardValue.biller_name}</div>\
                <div class="card-number btm-margin">\
                  <div>\
                  {{if cardValue.card_type == "master_card"}}\
                   <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDMwIDE5Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGNUUwMCIgZD0iTTIwLjkwMiAwQzI1LjkyNyAwIDMwIDQuMTEgMzAgOS4xOGMwIDUuMDY5LTQuMDczIDkuMTc4LTkuMDk4IDkuMTc4LTIuMjUyIDAtNC4zMTMtLjgyNS01LjkwMi0yLjE5My0xLjU4OCAxLjM2Ny0zLjY1IDIuMTkzLTUuOTAyIDIuMTkzQzQuMDczIDE4LjM1OCAwIDE0LjI0OCAwIDkuMTggMCA0LjExIDQuMDczIDAgOS4wOTggMGMyLjI1MyAwIDQuMzE0LjgyNiA1LjkwMyAyLjE5NEMxNi41ODkuODI1IDE4LjY1IDAgMjAuOTAxIDB6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0VEMDAwNiIgZD0iTTkuMDk4IDBjMi4yNTMgMCA0LjMxNC44MjYgNS45MDMgMi4xOTQtMS45NTcgMS42ODItMy4xOTggNC4xODgtMy4xOTggNi45ODUgMCAyLjc5OCAxLjI0IDUuMzAzIDMuMTk3IDYuOTg2LTEuNTg4IDEuMzY3LTMuNjUgMi4xOTMtNS45MDIgMi4xOTNDNC4wNzMgMTguMzU4IDAgMTQuMjQ4IDAgOS4xOCAwIDQuMTEgNC4wNzMgMCA5LjA5OCAweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGOUEwMDAiIGQ9Ik0yMC45MDIgMEMyNS45MjcgMCAzMCA0LjExIDMwIDkuMThjMCA1LjA2OS00LjA3MyA5LjE3OC05LjA5OCA5LjE3OC0yLjI1MyAwLTQuMzE0LS44MjUtNS45MDMtMi4xOTMgMS45NTctMS42ODQgMy4xOTgtNC4xODkgMy4xOTgtNi45ODYgMC0yLjc5Ny0xLjI0LTUuMzAyLTMuMTk2LTYuOTg2QzE2LjU4OC44MjYgMTguNjQ5IDAgMjAuOSAweiIvPgogICAgPC9nPgo8L3N2Zz4K" alt="">\
                  {{/if}}\
                  </div>\
                  <div>&bull;&bull;&bull;&bull; <span>${cardValue.card_number}</span></div>\
                </div>\
                <div class="due-amount btm-margin">\
                  <div class="card-sm-text">Due amount</div>\
                  <div class="card-bold-text card-amount"><span>$</span> ${cardValue.bill_amount}</div>\
                </div>\
                <div class="due-date btm-margin">\
                  <div class="card-sm-text">Due date</div>\
                  <div class="card-bold-text card-date">${cardValue.due_date}</div>\
                </div>\
                <div>\
                  <button msgData="${JSON.stringify(cardValue)}" class="pay-button">Pay Now</button>\
                </div>\
              </div>\
            {{/each}}\
          </div>\
        </div>\
      </script>';

      var freqData = '<script type="text/x-jqury-tmpl" >\
        <div class="searchBox Search-BG-Copy">\
          <div class="recentContainer">\
            <div class="recent-conversations hide">\
              <div class="mb-30">\
                  <span class="search-heads mb-0">RECENT CONVERSATIONS</span>\
                  <div class="conversations-list">\
                    <div class="conversation-logo">\<img src="./libs/images/newtheme/recentcovicon.svg">\
                    </div>\
                    <div class="conversation-content">\
                      <div class="c-name">\Findly.ai</div>\
                      <div class="c-data">\Good morning! How can I help you today?</div>\
                      <div class="c-date">\Today</div>\
                    </div>\
                  </div>\
                  <div class="conversations-list">\
                    <div class="conversation-logo">\<img src="./libs/images/newtheme/recentcovicon.svg">\
                    </div>\
                    <div class="conversation-content">\
                      <div class="c-name">\ Ranak</div>\
                      <div class="c-data">\ Ranak here. what brings you to future bank?</div>\
                      <div class="c-date">\ 2w ago</div>\
                    </div>\
                  </div>\
                  <div class="conversations-list">\
                    <div class="conversation-logo">\<img src="./libs/images/newtheme/recentcovicon.svg">\
                    </div>\
                    <div class="conversation-content">\
                      <div class="c-name">\Findly.ai</div>\
                      <div class="c-data">\Good morning! How can I help you today?</div>\
                      <div class="c-date">\Today</div>\
                    </div>\
                  </div>\
                </div>\
            </div>\
            {{if recents && recents.length}}\
              <div class="search-heads">RECENTLY ASKED</div>\
                <div class="search-recent-column" >\
                  {{each(key, recent) recents }}\
                  {{if recent}}\
                    <div class="recentSearch">\
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACmSURBVHgBdY+9DcIwEIXvHYJQZgVGYAPYgDoUkSUEJWyA2ABKJCSTJjVMAKuwAa358WEXSIZcvso+f767h72tJxRYmOJECtba/MX9JffIXQFaH6q61KQnsot4f0NaYNB2VhZVWiOR3dxMj/j/HeWOd+dUiu/QRoVjHqTNV4owtcAM+bk3uoVxXXFDL7RKA0JbXAsITdIC8oOykSZFjDH3sMb47WXwASvra91JumNaAAAAAElFTkSuQmCC" id="${key}" class="recentCloseIcon">\
                      <span id="${recent}" action-type="textTask" class="pointer recentText">${recent}</span>\
                    </div>\
                    {{/if}}\
                  {{/each}}\
                </div>\
              </div>\
            {{/if}}\
            {{if recentTasks && recentTasks.length}}\
              <div class="resultsButtons finalResults asstTask" >\
                  <span class="search-heads">RECENT ACTIONS</span>\
                  <div class="faqBtnContainer">\
                      {{each(key, task) recentTasks }}\
                        <button id="${task}" action-type="actionTask" class="recentTasks search-task" title="${task}" >\
                            <img src="./libs/images/credit-card.svg" class="credit-card">\
                            ${task}\
                        </button>\
                      {{/each}}\
                  </div>\
              </div>\
            {{/if}}\
          </div>\
        </div>\
      </script>';
      var userLogin = '<script type="text/x-jqury-tmpl" >\
         <div class="LoginWhiteBG">\
          <div class="loginTitle">Please login to continue</div>\
          <div class="form-group">\
              <div class="userBlock">\
                <label for="testFutureUserId">User ID</label>\
                <input id="testFutureUserId" name="userId" type="text">\
              </div>\
              <div class="passwordBlock">\
                <label for="testFuturePassword">Password</label>\
                <input id="testFuturePassword" name="password" type="password">\
              </div>\
              <span  class="errorMsg hide">incorrect user Id/password</span>\
              <div style="margin-top:5px;">\
                  <button class="testFutureLoginBtn" id="login" name="login" type="submit" disabled="">Login</button></div>\
              <div class="registerDiv">\
                  <p class="divreg">New user?<a>Register here <img class="caretRight" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNnB4IiBoZWlnaHQ9IjlweCIgdmlld0JveD0iMCAwIDYgOSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNTMuMiAoNzI2NDMpIC0gaHR0cHM6Ly9za2V0Y2hhcHAuY29tIC0tPgogICAgPHRpdGxlPmNhcmV0UmlnaHQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iY2FyZXRSaWdodCIgZmlsbD0iIzA1NkRBRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTYuODUxNTYyNSwyLjE0ODQzNzUgQzYuOTUwNTIxMzMsMi4yNDczOTYzMyA3LDIuMzY0NTgyNjYgNywyLjUgQzcsMi42MzU0MTczNCA2Ljk1MDUyMTMzLDIuNzUyNjAzNjcgNi44NTE1NjI1LDIuODUxNTYyNSBMMy4zNTE1NjI1LDYuMzUxNTYyNSBDMy4yNTI2MDM2Nyw2LjQ1MDUyMTMzIDMuMTM1NDE3MzQsNi41IDMsNi41IEMyLjg2NDU4MjY2LDYuNSAyLjc0NzM5NjMzLDYuNDUwNTIxMzMgMi42NDg0Mzc1LDYuMzUxNTYyNSBMLTAuODUxNTYyNSwyLjg1MTU2MjUgQy0wLjk1MDUyMTMyOCwyLjc1MjYwMzY3IC0xLDIuNjM1NDE3MzQgLTEsMi41IEMtMSwyLjM2NDU4MjY2IC0wLjk1MDUyMTMyOCwyLjI0NzM5NjMzIC0wLjg1MTU2MjUsMi4xNDg0Mzc1IEMtMC43NTI2MDM2NzIsMi4wNDk0Nzg2NyAtMC42MzU0MTczNDQsMiAtMC41LDIgTDYuNSwyIEM2LjYzNTQxNzM0LDIgNi43NTI2MDM2NywyLjA0OTQ3ODY3IDYuODUxNTYyNSwyLjE0ODQzNzUgWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4wMDAwMDAsIDQuMjUwMDAwKSByb3RhdGUoLTkwLjAwMDAwMCkgdHJhbnNsYXRlKC0zLjAwMDAwMCwgLTQuMjUwMDAwKSAiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="></a>\
                  </p>\
                  <p class="divreg textRight"><a>Forgot password? <img class="caretRight"\
                              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNnB4IiBoZWlnaHQ9IjlweCIgdmlld0JveD0iMCAwIDYgOSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNTMuMiAoNzI2NDMpIC0gaHR0cHM6Ly9za2V0Y2hhcHAuY29tIC0tPgogICAgPHRpdGxlPmNhcmV0UmlnaHQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iY2FyZXRSaWdodCIgZmlsbD0iIzA1NkRBRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTYuODUxNTYyNSwyLjE0ODQzNzUgQzYuOTUwNTIxMzMsMi4yNDczOTYzMyA3LDIuMzY0NTgyNjYgNywyLjUgQzcsMi42MzU0MTczNCA2Ljk1MDUyMTMzLDIuNzUyNjAzNjcgNi44NTE1NjI1LDIuODUxNTYyNSBMMy4zNTE1NjI1LDYuMzUxNTYyNSBDMy4yNTI2MDM2Nyw2LjQ1MDUyMTMzIDMuMTM1NDE3MzQsNi41IDMsNi41IEMyLjg2NDU4MjY2LDYuNSAyLjc0NzM5NjMzLDYuNDUwNTIxMzMgMi42NDg0Mzc1LDYuMzUxNTYyNSBMLTAuODUxNTYyNSwyLjg1MTU2MjUgQy0wLjk1MDUyMTMyOCwyLjc1MjYwMzY3IC0xLDIuNjM1NDE3MzQgLTEsMi41IEMtMSwyLjM2NDU4MjY2IC0wLjk1MDUyMTMyOCwyLjI0NzM5NjMzIC0wLjg1MTU2MjUsMi4xNDg0Mzc1IEMtMC43NTI2MDM2NzIsMi4wNDk0Nzg2NyAtMC42MzU0MTczNDQsMiAtMC41LDIgTDYuNSwyIEM2LjYzNTQxNzM0LDIgNi43NTI2MDM2NywyLjA0OTQ3ODY3IDYuODUxNTYyNSwyLjE0ODQzNzUgWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4wMDAwMDAsIDQuMjUwMDAwKSByb3RhdGUoLTkwLjAwMDAwMCkgdHJhbnNsYXRlKC0zLjAwMDAwMCwgLTQuMjUwMDAwKSAiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="></a></p>\
              </div>\
          </div>\
         </div>\
      </script>';
      var paymentGateWayDemo = '<script type="text/x-jqury-tmpl" >\
                <div class="payBillMain">\
              <div class=" payBillCell">\
                  <div class="Rectangle-Copy-3 Mask">\
                      <span class="bankName">${paymentDetails.biller_name}</span>\
                      <span class="cardNumb">\
                          <span class="cardLogo">\
                              <img class="wireLessIcon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDMwIDE5Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGNUUwMCIgZD0iTTIwLjkwMiAwQzI1LjkyNyAwIDMwIDQuMTEgMzAgOS4xOGMwIDUuMDY5LTQuMDczIDkuMTc4LTkuMDk4IDkuMTc4LTIuMjUyIDAtNC4zMTMtLjgyNS01LjkwMi0yLjE5My0xLjU4OCAxLjM2Ny0zLjY1IDIuMTkzLTUuOTAyIDIuMTkzQzQuMDczIDE4LjM1OCAwIDE0LjI0OCAwIDkuMTggMCA0LjExIDQuMDczIDAgOS4wOTggMGMyLjI1MyAwIDQuMzE0LjgyNiA1LjkwMyAyLjE5NEMxNi41ODkuODI1IDE4LjY1IDAgMjAuOTAxIDB6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0VEMDAwNiIgZD0iTTkuMDk4IDBjMi4yNTMgMCA0LjMxNC44MjYgNS45MDMgMi4xOTQtMS45NTcgMS42ODItMy4xOTggNC4xODgtMy4xOTggNi45ODUgMCAyLjc5OCAxLjI0IDUuMzAzIDMuMTk3IDYuOTg2LTEuNTg4IDEuMzY3LTMuNjUgMi4xOTMtNS45MDIgMi4xOTNDNC4wNzMgMTguMzU4IDAgMTQuMjQ4IDAgOS4xOCAwIDQuMTEgNC4wNzMgMCA5LjA5OCAweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGOUEwMDAiIGQ9Ik0yMC45MDIgMEMyNS45MjcgMCAzMCA0LjExIDMwIDkuMThjMCA1LjA2OS00LjA3MyA5LjE3OC05LjA5OCA5LjE3OC0yLjI1MyAwLTQuMzE0LS44MjUtNS45MDMtMi4xOTMgMS45NTctMS42ODQgMy4xOTgtNC4xODkgMy4xOTgtNi45ODYgMC0yLjc5Ny0xLjI0LTUuMzAyLTMuMTk2LTYuOTg2QzE2LjU4OC44MjYgMTguNjQ5IDAgMjAuOSAweiIvPgogICAgPC9nPgo8L3N2Zz4K">\
                          </span>\
                          <span class="num">****<span>${paymentDetails.card_number}</span></span>\
                      </span>\
                      <span class="cardDueAmount">Due amount</span>\
                      <span class="cardAmount">${paymentDetails.bill_amount}</span>\
                      <span class="cardDueDate">Due date</span>\
                      <span class="cardDate">${paymentDetails.due_date}</span>\
                  </div>\
              </div>\
              <div class="row col-md-8 payNowContainer">\
                  <span class="search-heads-title">Choose the payment method to proceed</span>\
                  <div class="payNowDiv">\
                      <div class="radioCheck">\
                          <input checked="" id="test1" name="radio-group" type="radio">\
                          <label for="test1"></label>\
                      </div>\
                      <div class="cardDetails">\
                          <div class="cardTitle">Checking</div>\
                          <div>\
                              <span class="cardLogo"><img class="master-logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDMwIDE5Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGNUUwMCIgZD0iTTIwLjkwMiAwQzI1LjkyNyAwIDMwIDQuMTEgMzAgOS4xOGMwIDUuMDY5LTQuMDczIDkuMTc4LTkuMDk4IDkuMTc4LTIuMjUyIDAtNC4zMTMtLjgyNS01LjkwMi0yLjE5My0xLjU4OCAxLjM2Ny0zLjY1IDIuMTkzLTUuOTAyIDIuMTkzQzQuMDczIDE4LjM1OCAwIDE0LjI0OCAwIDkuMTggMCA0LjExIDQuMDczIDAgOS4wOTggMGMyLjI1MyAwIDQuMzE0LjgyNiA1LjkwMyAyLjE5NEMxNi41ODkuODI1IDE4LjY1IDAgMjAuOTAxIDB6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0VEMDAwNiIgZD0iTTkuMDk4IDBjMi4yNTMgMCA0LjMxNC44MjYgNS45MDMgMi4xOTQtMS45NTcgMS42ODItMy4xOTggNC4xODgtMy4xOTggNi45ODUgMCAyLjc5OCAxLjI0IDUuMzAzIDMuMTk3IDYuOTg2LTEuNTg4IDEuMzY3LTMuNjUgMi4xOTMtNS45MDIgMi4xOTNDNC4wNzMgMTguMzU4IDAgMTQuMjQ4IDAgOS4xOCAwIDQuMTEgNC4wNzMgMCA5LjA5OCAweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGOUEwMDAiIGQ9Ik0yMC45MDIgMEMyNS45MjcgMCAzMCA0LjExIDMwIDkuMThjMCA1LjA2OS00LjA3MyA5LjE3OC05LjA5OCA5LjE3OC0yLjI1MyAwLTQuMzE0LS44MjUtNS45MDMtMi4xOTMgMS45NTctMS42ODQgMy4xOTgtNC4xODkgMy4xOTgtNi45ODYgMC0yLjc5Ny0xLjI0LTUuMzAyLTMuMTk2LTYuOTg2QzE2LjU4OC44MjYgMTguNjQ5IDAgMjAuOSAweiIvPgogICAgPC9nPgo8L3N2Zz4K"></span>\
                              <span class="num"><span class="numdots">....</span>2313</span>\
                          </div>\
                      </div>\
                      <div class="creditBalance">\
                          <span class="search-heads">Credit balance</span>\
                          <span class="balAmount">$23,845.20</span>\
                      </div>\
                  </div>\
                  <div class="payNowDiv">\
                      <div class="radioCheck">\
                          <input checked="" id="test2" name="radio-group" type="radio">\
                          <label for="test2"></label>\
                      </div>\
                      <div class="cardDetails">\
                          <div class="cardTitle">Checking</div>\
                          <div>\
                              <span class="cardLogo"><img class="master-logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDMwIDE5Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGNUUwMCIgZD0iTTIwLjkwMiAwQzI1LjkyNyAwIDMwIDQuMTEgMzAgOS4xOGMwIDUuMDY5LTQuMDczIDkuMTc4LTkuMDk4IDkuMTc4LTIuMjUyIDAtNC4zMTMtLjgyNS01LjkwMi0yLjE5My0xLjU4OCAxLjM2Ny0zLjY1IDIuMTkzLTUuOTAyIDIuMTkzQzQuMDczIDE4LjM1OCAwIDE0LjI0OCAwIDkuMTggMCA0LjExIDQuMDczIDAgOS4wOTggMGMyLjI1MyAwIDQuMzE0LjgyNiA1LjkwMyAyLjE5NEMxNi41ODkuODI1IDE4LjY1IDAgMjAuOTAxIDB6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0VEMDAwNiIgZD0iTTkuMDk4IDBjMi4yNTMgMCA0LjMxNC44MjYgNS45MDMgMi4xOTQtMS45NTcgMS42ODItMy4xOTggNC4xODgtMy4xOTggNi45ODUgMCAyLjc5OCAxLjI0IDUuMzAzIDMuMTk3IDYuOTg2LTEuNTg4IDEuMzY3LTMuNjUgMi4xOTMtNS45MDIgMi4xOTNDNC4wNzMgMTguMzU4IDAgMTQuMjQ4IDAgOS4xOCAwIDQuMTEgNC4wNzMgMCA5LjA5OCAweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGOUEwMDAiIGQ9Ik0yMC45MDIgMEMyNS45MjcgMCAzMCA0LjExIDMwIDkuMThjMCA1LjA2OS00LjA3MyA5LjE3OC05LjA5OCA5LjE3OC0yLjI1MyAwLTQuMzE0LS44MjUtNS45MDMtMi4xOTMgMS45NTctMS42ODQgMy4xOTgtNC4xODkgMy4xOTgtNi45ODYgMC0yLjc5Ny0xLjI0LTUuMzAyLTMuMTk2LTYuOTg2QzE2LjU4OC44MjYgMTguNjQ5IDAgMjAuOSAweiIvPgogICAgPC9nPgo8L3N2Zz4K"></span>\
                              <span class="num"><span class="numdots">....</span>3652</span>\
                          </div>\
                      </div>\
                      <div class="creditBalance">\
                          <span class="search-heads">Credit balance</span>\
                          <span class="balAmount">$85,845.40</span>\
                      </div>\
                  </div>\
                  <div class="date-heads"> Payment date <span class="error">*</span></div>\
                  <div class="datePicker">\
                          <div class="mydp" style="width: 100%;">\
                              <div class="selectiongroup">\
                                  <input autocomplete="off" autocorrect="off" class="selection" id="demoDatePicker" placeholder="MM/DD/YYYY" style="height: 34px; font-size: 14px;">\
                                  <div class="selbtngroup" style="height: 34px; width:1px">\
                                          <span class="mydpicon icon-mydpcalendar"></span>\
                                  </div>\
                              </div>\
                          </div>\
                  </div>\
                  <button class="btn btn-primary payBalNext" id="gatewayNextDemo" disabled disa data-target="#exampleModalCenter" data-toggle="modal">Next</button>\
              </div>\
          </div>\
      </script>';
      var gatwaySuccess = '<script type="text/x-jqury-tmpl">\
          <div class="container successContainer">\
                  <div class="msg">\
                      <img class="success-img" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTRweCIgaGVpZ2h0PSI1NHB4IiB2aWV3Qm94PSIwIDAgNTQgNTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5zdWNlc3NUaWNrR3JlZW48L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0ic3VjZXNzVGlja0dyZWVuIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjMzZCQTVBIiBjeD0iMjciIGN5PSIyNyIgcj0iMjciPjwvY2lyY2xlPgogICAgICAgIDxwYXRoIGQ9Ik0zNS4zMzcwNTM2LDIyLjQxNTE3ODYgQzM1LjU0NTM4NzksMjIuNjIzNTEyOSAzNS42NDk1NTM2LDIyLjg3NjQ4NjYgMzUuNjQ5NTUzNiwyMy4xNzQxMDcxIEMzNS42NDk1NTM2LDIzLjQ3MTcyNzcgMzUuNTQ1Mzg3OSwyMy43MjQ3MDEzIDM1LjMzNzA1MzYsMjMuOTMzMDM1NyBMMjUuNzM4ODM5MywzMy41MzEyNSBDMjUuNTMwNTA0OSwzMy43Mzk1ODQ0IDI1LjI3NzUzMTIsMzMuODQzNzUgMjQuOTc5OTEwNywzMy44NDM3NSBDMjQuNjgyMjkwMiwzMy44NDM3NSAyNC40MjkzMTY1LDMzLjczOTU4NDQgMjQuMjIwOTgyMSwzMy41MzEyNSBMMTguNjYyOTQ2NCwyNy45NzMyMTQzIEMxOC40NTQ2MTIxLDI3Ljc2NDg3OTkgMTguMzUwNDQ2NCwyNy41MTE5MDYzIDE4LjM1MDQ0NjQsMjcuMjE0Mjg1NyBDMTguMzUwNDQ2NCwyNi45MTY2NjUyIDE4LjQ1NDYxMjEsMjYuNjYzNjkxNSAxOC42NjI5NDY0LDI2LjQ1NTM1NzEgTDIwLjE4MDgwMzYsMjQuOTM3NSBDMjAuMzg5MTM3OSwyNC43MjkxNjU2IDIwLjY0MjExMTYsMjQuNjI1IDIwLjkzOTczMjEsMjQuNjI1IEMyMS4yMzczNTI3LDI0LjYyNSAyMS40OTAzMjYzLDI0LjcyOTE2NTYgMjEuNjk4NjYwNywyNC45Mzc1IEwyNC45Nzk5MTA3LDI4LjIyOTkxMDcgTDMyLjMwMTMzOTMsMjAuODk3MzIxNCBDMzIuNTA5NjczNywyMC42ODg5ODcxIDMyLjc2MjY0NzMsMjAuNTg0ODIxNCAzMy4wNjAyNjc5LDIwLjU4NDgyMTQgQzMzLjM1Nzg4ODQsMjAuNTg0ODIxNCAzMy42MTA4NjIxLDIwLjY4ODk4NzEgMzMuODE5MTk2NCwyMC44OTczMjE0IEwzNS4zMzcwNTM2LDIyLjQxNTE3ODYgWiIgaWQ9Iu+AjCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgPC9nPgo8L3N2Zz4=">\
                      <div>\
                          <span class="success-head">Success</span>\
                          <br><span class="success-msg">You have successfully scheduled your bill payment on <b>${selectedDate}</b></span>\
                      </div>\
                  </div>\
                  <div class="resultsButtons asstTask">\
                      <div class="faqBtnContainer">\
                          <button class="faq otherBtn" id="makeAnotherPayDemo"> Make another payment </button>\
                          <button class="faq" id="closePayment"> close </button>\
                      </div>\
                  </div>\
          </div>\
      </script>';
      var messageBubbles = '<script>\
        <div class="messageBubble">\
          {{if msgData && msgData.from==="user"}}\
            <div class="userMessage"><span>${msgData.text}</span></div>\
          {{/if}}\
          {{if msgData && msgData.from==="bot"}}\
          <div class="messageBubble-content">\
            <div class="botImg">\
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgBXVK7bhNBFD1zd7z2moisCQQlQsgWRUiBZP6AdLRp0zj8Dj8AHbGQaJOSLj1NLChSgRaKJBJ5rB/Zxzy5syIoYeSrO96559xzZq7Af+t459cuyIycsMMoFqlst3OyclLPMd78tLZ3u1bcbI5en/Ylmf2yKoZKzaB0CecMiCJ0uvex3HuIThxnqnJbmwdr2T/w8avTvmiJw8uraX/BLUozg3UKFg5StBCJDiS18ai3ggfLaUZWbQ0+r2UygKmiw/xq1p8ycGEKKG9hvYfjEExBokYsLKozBT3T/cfpyj7DXoqvL4JH8eGk/I2pWeCaOypvoJlAe9dY8hxdijlaSOU9DJJ1dGXyRpKXo4t6hnNTY2odKgbU3NF6Ac2wCMQRQTNPwWdWGKwbjZZrj6QXNDzjP2fOYsZhGGgasINB2OtGeoe7xoKguMGAz7pwQ5k7l57YACRcWMMA23gNS3EOrsOtls4jIbACj9x69CJ2oH2UzzzSwhPKII9ZAzR0DtLR/BjFRJoPNOecv1855JRQPDEiRgEJzfk6dPERE0lUQqIOmUkrJlgEMFqsMmKbfkIQ0Time1zY4stIuDhGGbxxkWKyinP1d+/4vVu0jHPuXNho3AzJ+43Loy/V5TC3BeZuwZ5d45NfmqVbBPVt0UYapc1zrUZJ9vbHkwEF8EaSbD+Ne5mmLkvvomC5c4bPWW7BIE1LsJTynlWIdqZctHVntt89L/vftDr8acv+1F1DNePpeX6i5q1jlp0KOSGhtg+yQXYHfLN2ni12+SZHFeyw9i4VwuVLoMkqYfzxe2/vdu0fKeFQ9OdIXHoAAAAASUVORK5CYII=">\
            </div>\
            <div class="botMessage"><span class="bot_Img"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgBXVK7bhNBFD1zd7z2moisCQQlQsgWRUiBZP6AdLRp0zj8Dj8AHbGQaJOSLj1NLChSgRaKJBJ5rB/Zxzy5syIoYeSrO96559xzZq7Af+t459cuyIycsMMoFqlst3OyclLPMd78tLZ3u1bcbI5en/Ylmf2yKoZKzaB0CecMiCJ0uvex3HuIThxnqnJbmwdr2T/w8avTvmiJw8uraX/BLUozg3UKFg5StBCJDiS18ai3ggfLaUZWbQ0+r2UygKmiw/xq1p8ycGEKKG9hvYfjEExBokYsLKozBT3T/cfpyj7DXoqvL4JH8eGk/I2pWeCaOypvoJlAe9dY8hxdijlaSOU9DJJ1dGXyRpKXo4t6hnNTY2odKgbU3NF6Ac2wCMQRQTNPwWdWGKwbjZZrj6QXNDzjP2fOYsZhGGgasINB2OtGeoe7xoKguMGAz7pwQ5k7l57YACRcWMMA23gNS3EOrsOtls4jIbACj9x69CJ2oH2UzzzSwhPKII9ZAzR0DtLR/BjFRJoPNOecv1855JRQPDEiRgEJzfk6dPERE0lUQqIOmUkrJlgEMFqsMmKbfkIQ0Time1zY4stIuDhGGbxxkWKyinP1d+/4vVu0jHPuXNho3AzJ+43Loy/V5TC3BeZuwZ5d45NfmqVbBPVt0UYapc1zrUZJ9vbHkwEF8EaSbD+Ne5mmLkvvomC5c4bPWW7BIE1LsJTynlWIdqZctHVntt89L/vftDr8acv+1F1DNePpeX6i5q1jlp0KOSGhtg+yQXYHfLN2ni12+SZHFeyw9i4VwuVLoMkqYfzxe2/vdu0fKeFQ9OdIXHoAAAAASUVORK5CYII="></span>\
            <span>${msgData.text}</span></div>\
          </div>\
          {{/if}}\
          {{if msgData && msgData.from==="searchResult"}}\
            <div class="serachContent"><span>${msgData.text}</span></div>\
          {{/if}}\
        </div>\
       </script>';
      var confirmationModal = '<script>\
        <div  class="modal-content">\
              <div  class="modal-header">\
                <h5  class="modal-title" id="exampleModalLongTitle">Bill Payment</h5>\
              </div>\
              <div  class="modal-body"> Do you want to proceed? </div>\
              <div  class="modal-footer">\
                        <button  class="btn btn-danger confirm " id="confirmGatwayPayment" data-dismiss="modal" type="button">Confirm</button>\
                        <button  class="btn btn-secondary cancel" id="cancelGatwayPayment"  data-dismiss="modal" type="button"> Cancel </button>\
              </div>\
        </div>\
       </script>';
      // <div class="row mostrcentOther">\
      //     <div class="mostAsked">\
      //       {{if searchResults && searchResults.results && searchResults.results.length}}\
      //         <span class="search-heads">MOSTLY ASKED</span>\
      //         <div class="asstFaq" id="accordionExample">\
      //           {{each(key, searchResult) searchResults.results}}\
      //               <button class="accordion">${searchResult.titleText} </button>\
      //               <div class="panel">\
      //                 <p> ${searchResult.answer} </p>\
      //               </div>\
      //           {{/each}}\
      //         </div>\
      //       {{/if}}\
      //     </div>\
      //   </div>\
      switch (type) {
        case 'searchContainer':
          return searchContainer;
        case 'liveSearchData':
          return liveSearchData;
        case 'searchResultModal':
          return searchResultModal;
        case 'searchFullData':
          return searchFullData;
        case 'searchBar':
          return searchBar;
        case 'greetingMsg':
          return greetingMsg;
        case 'freqData':
          return freqData;
        case 'payBillContainer':
          return payBillContainer;
        case 'userLogin':
          return userLogin;
        case 'paymentGateWayDemo':
          return paymentGateWayDemo
        case 'gatwaySuccess':
          return gatwaySuccess
        case 'messageBubbles':
          return messageBubbles
        case 'confirmationModal':
          return confirmationModal
      }

    }
    KoreWidgetSDK.prototype.getSuggestion = function (suggestions) {
      var $suggest = $('#suggestion');
      // some other key was pressed
      var needle = $('#search').val();

      // is the field empty?
      if (!$.trim(needle).length) {
        $suggest.val("");
        return false;
      }
      // compare input with suggestion array
      $.each(suggestions, function (i, term) {
        let wrdArray = needle.split(' ');
        // for(let i=needle.length-1; i>0; i--) {
        // 	let regex = new RegExp('^' + needle[i], 'i');

        // }
        let regex = new RegExp('^' + needle, 'i');
        if (regex.test(term)) {
          $suggest.val(needle + term.slice(needle.length));
          // use first result
          return false;
        }
        else if ($suggest.val() == "") {
          wrdArray = needle.trim().split(' ');
          let lastWords = wrdArray[wrdArray.length - 2] + ' ' + wrdArray[wrdArray.length - 1]
          //wrdArray[wrdArray.length - 1] == '' ? wrdArray[wrdArray.length - 2] : wrdArray[wrdArray.length - 1];
          regex = new RegExp('^' + lastWords, 'i');
          if (regex.test(term)) {

            $suggest.val(needle.trim() + term.slice(lastWords.length));
            // use first result
            return false;
          }

        }
        if ($suggest.val() == "") {
          wrdArray = needle.trim().split(' ');
          let lastWords = wrdArray[wrdArray.length - 1];
          //wrdArray[wrdArray.length - 1] == '' ? wrdArray[wrdArray.length - 2] : wrdArray[wrdArray.length - 1];
          regex = new RegExp('^' + lastWords, 'i');
          if (regex.test(term)) {

            $suggest.val(needle.trim() + term.slice(lastWords.length));
            // use first result
            return false;
          }

        }

        $suggest.val("");
      });

      if(!suggestions.length){
        $suggest.val("");
      }

    }
    KoreWidgetSDK.prototype.bindSearchAccordion = function () {
      $(document).off('click', '.accordion').on('click', '.accordion', function (evet) {
        $(evet.target).toggleClass('acc-active');
        var panel = $(evet.target).next();
        if (panel[0].style.maxHeight) {
          panel[0].style.maxHeight = null;
        } else {
          panel[0].style.maxHeight = panel[0].scrollHeight + "px";
        }
      });
      // var acc = document.getElementsByClassName("accordion");
      // var i;

      // for (i = 0; i < acc.length; i++) {
      //   acc[i].addEventListener("click", function() {
      //     this.classList.toggle("acc-active");
      //     var panel = this.nextElementSibling;
      //     if (panel.style.maxHeight) {
      //       panel.style.maxHeight = null;
      //     } else {
      //       panel.style.maxHeight = panel.scrollHeight + "px";
      //     } 
      //   });
      // }
    }
    KoreWidgetSDK.prototype.prepAllSearchData = function (selectedFacet) {
      var _self = this, facets = [], totalResultsCount = null;
      if (!facets.length) {
        if (_self.vars.searchObject.liveData.facets) {

          Object.keys(_self.vars.searchObject.liveData.facets).forEach(facet => {
            facets.push({ key: facet, value: _self.vars.searchObject.liveData.facets[facet] })
          })
        }
      }
      totalResultsCount = selectedFacet ? _self.vars.searchObject.liveData.facets[selectedFacet] : _self.vars.searchObject.liveData.facets["all results"];
      var searchFullData = $(_self.getSearchTemplate('searchFullData')).tmplProxy({
        facets : facets,
        dataLoaded : false,
        search : _self.vars.searchObject.liveData.originalQuery,
        totalResultsCount : totalResultsCount,
        tasks : _self.vars.searchObject.liveData.tasks,
        pages : _self.vars.searchObject.liveData.pages,
        selectedFacet : selectedFacet ? selectedFacet : "all results",
        faqs : _self.vars.searchObject.liveData.faqs,
        
      });
      $('.search-container').addClass('full-page');
      $('.search-body-full').removeClass('hide');
      $('.search-body-full').html(searchFullData);
      $('.search-container').removeClass('active');
      if (!selectedFacet || selectedFacet === "all results") {
        $('.facet:first').addClass('facetActive');
      } else {
        $('#' + selectedFacet).addClass('facetActive').siblings().removeClass('active');
      }
      _self.bindFacetsToggle();
      _self.bindAllResultsView();
      // if(_self.vars.searchObject.liveData.faqs.length) {
      //   _self.bindSearchAccordion();
      // }

    }
    KoreWidgetSDK.prototype.bindAllResultsView = function () {
      var _self = this;
      $('.show-all-results').off('click').on('click', function (e) {
        var data = $(e.currentTarget).closest('.finalResults').data() || {};
        _self.vars.searchObject.liveData = data
        console.log(data);
        _self.prepAllSearchData();
        _self.bindAllResultsView();
        _self.bindSearchActionEvents();
      })
      $('.full-search-close').off('click').on('click', function (e) {
        $('.search-container').removeClass('full-page');
        $('.search-body-full').html('');
        $('.search-body-full').addClass('hide');
        e.keyCode = 13;
        _self.searchEventBinding(_self.vars.searchObject.liveData, "livesearch", e, true);
      })
      $('.moreFaqs').off('click').on('click', function (e) {
        var selectedFacet = "faq"
        _self.prepAllSearchData(selectedFacet);
      })
      $('.ksa-showMore').off('click').on('click', function (e) {
        var selectedFacet = "page"
        _self.prepAllSearchData(selectedFacet);
      })

    }
    KoreWidgetSDK.prototype.bindFacetsToggle = function () {
      var _self = this;
      $('.facet').off('click').on('click', function (e) {
        var facetThis = this;
        var selectedFacet = $(this).attr('id');

        _self.prepAllSearchData(selectedFacet);
      })
    }
    KoreWidgetSDK.prototype.recentClick = function () {
      var _self = this;
      $('.search-container').off('click', '.recentText').on('click', '.recentText', function (e) {
        var recentSearch = $(this).attr('id');
        e.target.value = recentSearch;
        $('#search').val(recentSearch).focus();
        $('#search').trigger("keyup");

      })
    }
    KoreWidgetSDK.prototype.deleteRecents = function () {
      var _self = this;
      $('.recentCloseIcon').off('click').on('click', function (e) {
        var recentIndex = $(this).attr('id');
        _self.vars.searchObject.recents.splice(recentIndex, 1);
        window.localStorage.setItem('recents', JSON.stringify(_self.vars.searchObject.recents));
        var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
          searchResults: _self.vars.searchObject.recentAPIResponse,
          recents: _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0, 6),
          recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0, 2)
        });
        $('.search-body').html(freqData);
        setTimeout(function () {
          $('.search-body').scrollTop(2);
        }, 100);
        _self.deleteRecents();
        _self.recentClick();
        e.stopPropagation();
      })
    }
    KoreWidgetSDK.prototype.saveOrGetDataInStorage = function (type, dataArray, storageType, action) {
      if (storageType === "localStorage") {
        if (action === "get") {
          return window.localStorage.getItem(type) ? JSON.parse(window.localStorage.getItem(type)) : [];
        } else {
          window.localStorage.setItem(type, JSON.stringify(dataArray));
          return;
        }
      }

    }
    KoreWidgetSDK.prototype.getLiveSearchResulta = function () {

    }
    KoreWidgetSDK.prototype.closeGreetingMsg = function () {
      if ($(".search-container").find(".greetingMsg").length) {
        $('.greetingMsg').html('');
        $('.greetingMsg').addClass('hide');
        $('.search-container').css("box-shadow", "0 8px 16px 0 rgba(12, 51, 91, 0.2)")
      }

    }
    KoreWidgetSDK.prototype.bindSearchActionEvents = function () {
      var _self = this;
      $('.search-container').off('click', '.search-task').on('click', '.search-task', function (e) {
        //console.log("faq", e.target.title);
        e.stopPropagation();
        var taskName = e.target.title.toLowerCase();
        if (!_self.vars.searchObject.recentTasks.length || (_self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.indexOf(taskName.toLowerCase()) == -1)) {
          _self.vars.searchObject.recentTasks.unshift(taskName.toLowerCase());
        }
        var recentItem = []
        recentItem.push(taskName);
        _self.vars.searchObject.recentTasks = _.uniq(recentItem.concat(_self.vars.searchObject.recentTasks));
        if (_self.vars.searchObject.recentTasks && _self.vars.searchObject.recentTasks.length) {
          _self.vars.searchObject.recentTasks = _.filter(_self.vars.searchObject.recentTasks, function (task) {
            return task;
          })
        }
        window.localStorage.setItem("recentTasks", JSON.stringify(_self.vars.searchObject.recentTasks));
        _self.bindFrequentData();
        //_self.saveOrGetDataInStorage(); 

        // if (_self.vars.loggedInUser) {
        //   _self.searchEventBinding('pay bill', e.target.title.toLowerCase(), e);
        // } else if ((e.target.title.toLowerCase() === 'pay bill') || (e.target.title.toLowerCase() === 'pay credit card bill')) {
        //   _self.userLogin(e.target.title.toLowerCase());
        // }
        _self.vars.searchObject.searchText = e.target.title.toLowerCase();
        _self.sendMessageToSearch('botAction');
      })
      $('.search-container').off('click', '.dont-show').on('click', '.dont-show', function (e) {
        _self.performRankActions(e,{visible:false});
      });
      $('.search-container').off('click', '.pin').on('click', '.pin', function (e) {
        
        debugger;
        var _selctedEle=$(e.target).closest('.task-wrp');
        var _parentEle=$(e.target).closest('.tasks-wrp');
        var nodes = Array.prototype.slice.call( _parentEle[0].children );
        var pinIndex=nodes.indexOf( _selctedEle[0]);
        _self.performRankActions(e,{pinIndex:pinIndex});

      });
      $('.search-container').off('click', '.boostup').on('click', '.boostup', function (e) {
        _self.performRankActions(e,{boost:0.25});
      });
      $('.search-container').off('click', '.boostdown').on('click', '.boostdown', function (e) {
        _self.performRankActions(e,{boost:-0.25});
      })
    };

    KoreWidgetSDK.prototype.performRankActions = function (e, conf) {
      var _self = this;
      e.preventDefault();
      e.stopPropagation();
      var _taskWrapDiv = $(e.target).closest('.task-wrp');

      var contentId = _taskWrapDiv.attr('contentid');
      var contentType = _taskWrapDiv.attr('contentType');
      var queryString = $(e.target).closest('.finalResults').attr('queryString');

      var boost = _taskWrapDiv.attr('boost');
      var pinIndex = _taskWrapDiv.attr('pinIndex');
      var visible = _taskWrapDiv.attr('visible');

      boost = parseFloat(boost);
      pinIndex = parseInt(pinIndex);
      visible = visible.toLowerCase() == 'true' ? true : false;



      var payload = {
        "searchIndexId": _self.API.SearchIndexID,
        "queryString": queryString,
        "contentId": contentId,
        "contentType": contentType,
        "config": Object.assign({
          "pinIndex": pinIndex,
          "boost": boost,
          "visible": visible
        }, conf)
      }

      var url = _self.API.queryConfig;
      debugger;
      _self.makeAPItoFindly(url, 'POST', JSON.stringify(payload)).then(function (res) {
      }, function (eRes) {
      });
    };

    KoreWidgetSDK.prototype.searchEventBinding = function(dataHTML, templateType, e, ignorAppend) {
      var _self = this;
      _self.vars.searchObject.recents =[]; _self.vars.searchObject.recentTasks = [];
      var searchResults;
      
      try {
        
        _self.vars.searchObject.recents = JSON.parse(window.localStorage.getItem('recents')) ? JSON.parse(window.localStorage.getItem('recents')) : [];
        _self.vars.searchObject.recentTasks = JSON.parse(window.localStorage.getItem('recentTasks')) ? JSON.parse(window.localStorage.getItem('recentTasks')) : [];
      } catch (err) {
  
      }
      
      
      $('.close-icon').off('click').on('click', function(e) {
        $('.search-body').html('');
        $('.search-body').removeClass('h-100');
        $('#search').val('');
        $('#suggestion').val('');
        $('.search-container').removeClass('active');
      })
      //_self.bindSearchActionEvents();
     
  
      // $('.pay-button').off('click').on('click')
      if(templateType === "search-container" ) {
        
        $(dataHTML).off('keydown', '#search').on('keydown', '#search', function(e) {
          $('.search-body').removeClass('hide');
          $('#searchChatContainer').addClass('bgfocus');
          var code = e.keyCode || e.which;
          if (code == '9' || code == '39') {
            $('#search').val(JSON.parse(JSON.stringify($('#suggestion').val())));
            $('#search').focus();
  
          }
          if (code == '9') {
            e.preventDefault();
          }
          if (code == '13') {
            e.preventDefault();
            prevStr="";
            if($('.search-container').hasClass('conversation')){
              $('.search-body').addClass('hide');
              $('#searchChatContainer').removeClass('bgfocus');
            };
            _self.vars.searchObject.searchText =  $('#search').val();
            var searchText = $('#search').val() || _self.vars.searchObject.liveData.originalQuery;
            _self.closeGreetingMsg();
            _self.sendMessageToSearch('user');
            _self.bindLiveDataToChat();
            if(!_self.vars.searchObject.recents.length || ( _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.indexOf(searchText.toLowerCase()) == -1)) {
              _self.vars.searchObject.recents.unshift(searchText.toLowerCase());
            }
            window.localStorage.setItem("recents", JSON.stringify(_self.vars.searchObject.recents));
          }
        })
        $(dataHTML).off('click', '.search-button').on('click', '.search-button', function(e) {
          e.stopPropagation();
          // if($('#search').val()) {
          //   e.preventDefault();
          //   if($('.search-container').hasClass('conversation')){
          //     $('.search-body').addClass('hide');
          //     $('#searchChatContainer').removeClass('bgfocus');
          //   };
          //   _self.sendMessageToSearch('user');
          //   _self.bindLiveDataToChat();
          // }
          
          //$('#search').trigger(jQuery.Event('keydown', { keycode: 13 }));
          $('#search').focus().trigger({ type : 'keydown', which : 13 });
        })
        $(dataHTML).off('click', '#search').on('click', '#search', function (e) {
          if(!$('#search').val()) {
            _self.bindFrequentData();
          }
        })
        $(dataHTML).off('keyup', '#search').on('keyup', '#search', function (e) {
          if(!$('#search').val()) {
            if((!_self.vars.searchObject.recentTasks.length || !_self.vars.searchObject.recents.length) && $('.search-container').hasClass('active')) {
              // $('.search-container').removeClass('active');
            }
            _self.bindFrequentData();
          } else {
            var code = e.keyCode || e.which;
            if (code == '9' || code == '39') {
              $('#search').val(JSON.parse(JSON.stringify($('#suggestion').val())));
              $('#search').focus();
            }
            if (code == '9') {
              e.preventDefault();
            }
            if(e.target.value) {
              var payload={
                "query": e.target.value.toString(),
                "maxNumOfResults": 16,
                "userId": _self.API.uuid,
                "streamId": _self.API.streamId,
                "lang": "en"
              }
              var url = _self.API.livesearchUrl;//'https://qa-bots.kore.ai/searchAssistant/liveSearch';
              var searchData;
              if(code== '13') {
                $('#search').val('');
              } else {
                _self.getFrequentlySearched(url, 'POST', JSON.stringify(payload)).then(function (res) {
                  if (res.templateType === 'liveSearch') {
                    $('.search-body').show();
                    res = res.template;
                    var faqs = [], pages = [], tasks = [], facets;
                    if (!$('.search-container').hasClass('active')) {
                      $('.search-container').addClass('active');
                    }
                    if (res && res.results && res.results.length) {
                      _self.closeGreetingMsg();
                      var liveResult = res.results;
  
                      liveResult.forEach(function (result) {
                        if (result.contentType === "faq") {
                          faqs.push(result);
                        } else if (result.contentType === "page") {
                          pages.push(result);
                        } else if (result.contentType === "task") {
                          tasks.push(result);
                        }
                      })
                      facets = res.facets;
                      var dataObj = {
                        faqs: faqs,
                        pages: pages,
                        tasks: tasks,
                        facets: facets,
                        originalQuery: res.originalQuery,
                      }
                      searchData = $(_self.getSearchTemplate('liveSearchData')).tmplProxy({
                        faqs: faqs.slice(0,2),
                        pages: pages.slice(0,2),
                        tasks: tasks.slice(0,2),
                        showAllResults: true,
                        noResults: false
                      });
                      $(searchData).data(dataObj);
                      $('.search-body').html(searchData);
                      setTimeout(function () {
                        $('.search-body').scrollTop(2);
                      }, 100);
                      _self.bindAllResultsView();
                      _self.getSuggestion(res.autoComplete.keywords);
                      //to sort rendering results based on score
                      var scoreArray = [
                        {
                          name: 'asstPage',
                          score: pages.length && pages[0].score
                        },
                        {
                          name: 'asstTask',
                          score: tasks.length && tasks[0].score
                        },
                        {
                          name: 'asstFaq',
                          score: faqs.length && faqs[0].score
                        }
                      ];
                      scoreArray.sort((a, b) => { return b.score - a.score });
                      //console.log("scoreArray", scoreArray);
                      scoreArray.forEach((obj, index) => {
                        $('.' + obj.name).css("order", index + 1);
                      })
                    } else {
                      if ($('#search').val()) {
                        var dataObj = {
                          faqs: faqs,
                          pages: pages,
                          tasks: tasks,
                          facets: facets
                        }
                        searchData = $(_self.getSearchTemplate('liveSearchData')).tmplProxy({
                          faqs: faqs,
                          pages: pages,
                          tasks: tasks,
                          showAllResults: false,
                          noResults: true
                        });
                        $(searchData).data(dataObj);
                        console.log("no results found");
                        $('.search-body').html(searchData);
                        setTimeout(function () {
                          $('.search-body').scrollTop(2);
                        }, 100);
                      }
                    }
                    _self.vars.searchObject.liveData = {
                      faqs: faqs,
                      pages: pages,
                      tasks: tasks,
                      facets: facets,
                      originalQuery: res.originalQuery || '',
                    }
                    // if (res.searchResults.smallTalk && res.searchResults.smallTalk.isSmallTalk && res.searchResults.smallTalk.text) {
                    //   _self.vars.searchObject.liveData.smallTalk = res.searchResults.smallTalk.text;
                    // }
                    _self.searchEventBinding(searchData, "livesearch", e);
                  }else if(res.templateType === 'liveSearchEmpty'){
                    $('.search-body').hide();
                  }
                })
              }
            } else {
              $('.search-body').html('');
              $('.search-body').removeClass('h-100');
            }
          }
        })
        
        $(dataHTML).off('focus', '#search').on('focus', '#search', function (e) {
          $('.search-body').removeClass('hide');
          $('#searchChatContainer').addClass('bgfocus');
          // _self.closeGreetingMsg();
          //clear showing greeting if search bar focused before the greeting msg shown
          clearTimeout(_self.vars.searchObject.clearGreetingTimeOut);
          
          if($('.search-container').hasClass('full-page')) {
            $('.search-container').removeClass('full-page');
            $('.search-body-full').html('');
            if(!$('.search-container').hasClass('active')) {
              $('.search-container').addClass('active');
              //e.stopPropagation();
            }
            e.stopPropagation();
          }
          if( (_self.vars.searchObject.recentTasks.length || _self.vars.searchObject.recents.length) && !$('#search').val()) {
            $('.search-container').addClass('active');
            if(_self.showGreetingMsg){
              _self.showGreetingMsg = false;
              _self.sendMessageToSearch('bot','&#128075; Good morning! How can I help you today?');
            }
            _self.closeGreetingMsg();
            var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
              searchResults: searchResults,
              recents : _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0,6),
              recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0,2)
            });
            $('.search-body').html(freqData);
            setTimeout(function(){
              $('.search-body').scrollTop(2);
            },100);
            _self.deleteRecents();
            _self.bindSearchActionEvents();
            _self.recentClick();
          } else if((_self.vars.searchObject.recentTasks.length || _self.vars.searchObject.recents.length) && $('#search').val()){
            _self.closeGreetingMsg();
            if(!$('.search-container').hasClass('active')) {
              $('.search-container').addClass('active');
              e.stopPropagation();
            }
          } else if($('#search').val()){
            $('#search').trigger("keyup");
          }
          
          // if(!_self.vars.searchObject.recentAPIResponse ) {  
          //   _self.getFrequentlySearched('https://qa-bots.kore.ai/searchAssistant/frequentSearch', 'GET', {}).then(function (res) {
  
          //     if (res && res.status == "200") {
          //       var searchResults = res.searchResults;
          //       _self.vars.searchObject.recentAPIResponse = searchResults;
          //       var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
          //         searchResults: searchResults,
          //         recents : _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0,6)
          //       });
          //       if(!$('#search').val()) {
          //         $('.search-body').html(freqData);
          //         _self.bindSearchAccordion();
          //       }
                
                
          //       // $('.search-body').append(searchBox);
          //       // $('.searchBox').append(freqData)
  
  
          //     } else {
  
          //     }
          //   }, function (errResponse) {
  
          //   });
          // }
  
        });
  
      }
      if(templateType === "livesearch") {
        if(!$('.search-container').hasClass('active')) {
          $('.search-container').addClass('active');
          e.stopPropagation();
        }
        var searchText = $('#search').val() || _self.vars.searchObject.liveData.originalQuery;
        if(e.keyCode == 13) {
          if($('.search-container').hasClass('conversation')){
            $('.search-body').addClass('hide');
            $('#searchChatContainer').removeClass('bgfocus');
            var searchText = $('#search').val() || _self.vars.searchObject.searchText;
            $('#search').val('');
            $('#suggestion').val('');
          }
          if(!_self.vars.searchObject.recents.length || ( _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.indexOf(searchText.toLowerCase()) == -1)) {
            _self.vars.searchObject.recents.unshift(searchText.toLowerCase());
          } 
          window.localStorage.setItem("recents", JSON.stringify(_self.vars.searchObject.recents));
          if(!ignorAppend){
            _self.bindLiveDataToChat();
          }
          e.preventDefault();
        }
        
        
        // _self.bindSearchAccordion();
        _self.bindSearchActionEvents();
        
        
      }
      if(templateType === "pay bill" || templateType === "pay credit card bill") {
  
        var creditCard = $(_self.getSearchTemplate('payBillContainer')).tmplProxy({
          selectedBiller:templateType,
          data: [
            {
              "biller_name": "AT&T",
              "card_type": "master_card",
              "card_number": "2313",
              "bill_amount": "95.20",
              "due_date" : "03/07/2020"
            },
            {
              "biller_name": "Verizon Wireless",
              "card_type": "master_card",
              "card_number": "2313",
              "bill_amount": "64.45",
              "due_date" : "13/07/2020"
            },
            {
              "biller_name": "Pico Energy",
              "card_type": "master_card",
              "card_number": "6724",
              "bill_amount": "235.20",
              "due_date" : "05/07/2020"
            }
          ]
        });
        $(creditCard).off('click','.closeAction').on('click','.closeAction',function(e){
          e.stopPropagation();
          $('.search-body .finalResults').removeClass('hide');
          $('.searchBox').removeClass('hide');
          $('.pay-bill-container').remove();
          $('.search-body').removeClass('h-100');
        })
        $(creditCard).off('click','.pay-button').on('click','.pay-button',function(e){
          var payData = $(this).attr('msgData');
          $('.pay-bill-container .card-container').addClass('hide');
            var gateway = $(_self.getSearchTemplate('paymentGateWayDemo')).tmplProxy({
               paymentDetails:JSON.parse(payData)
            });
            var defaultlibConfig = {
              format: 'MM-DD-YYYY',
              alwaysOpen: false,
              singleMonth: true,
              showShortcuts: false,
              singleDate: true,
              showTopbar: false,
              inline: true,
              startDate:moment().format('MM-DD-YYYY'),
              container:$(gateway).find('.datePicker'),
           };
           $(gateway).off('click','#gatewayNextDemo').on('click','#gatewayNextDemo',function(event1){
            event1.stopPropagation();
            var confirmationModal = $(_self.getSearchTemplate('confirmationModal')).tmplProxy({
            });
            $('.confirmationModal').html(confirmationModal);
            $('.confirmationModal').removeClass('hide');
            $(confirmationModal).off('click','#confirmGatwayPayment').on('click','#confirmGatwayPayment',function(ev){
              ev.stopPropagation();
              var gatwaySuccess = $(_self.getSearchTemplate('gatwaySuccess')).tmplProxy({
                selectedDate:$('#demoDatePicker').val()
              });
              $('.payBillMain').remove();
              $('.LoginWhiteBG ').remove();
              $('.card-pay-title').addClass('hide');
              $('.card-pay-legend').addClass('hide');
              $(gatwaySuccess).off('click','#makeAnotherPayDemo').on('click','#makeAnotherPayDemo',function(e2){
                e2.stopPropagation();
                $('.card-pay-title').removeClass('hide');
                $('.card-pay-legend').removeClass('hide');
                $('.card-container').removeClass('hide');
                $('.search-body').addClass('h-100');
                $('.successContainer').remove();
                
              })
              $(gatwaySuccess).off('click','#closePayment').on('click','#closePayment',function(e2){
                e2.stopPropagation();
                $('.pay-bill-container').remove();
                $('.search-body .finalResults').removeClass('hide');
                $('.searchBox').removeClass('hide');
                $('.search-body').removeClass('h-100'); 
              })
              $('.pay-bill-container').append(gatwaySuccess);
              $('.confirmationModal').html('');
              $('.confirmationModal').addClass('hide');
              $('.search-body').scrollTop(0);
            });
            $(confirmationModal).off('click','#cancelGatwayPayment').on('click','#cancelGatwayPayment',function(ev){
              ev.stopPropagation();
              $('.confirmationModal').html('');
              $('.confirmationModal').addClass('hide');
            });
           });
           $(gateway).off('blur','#demoDatePicker').on('blur','#demoDatePicker',function(eventBlur){
            if($('#demoDatePicker').val()){
              $('#gatewayNextDemo').removeAttr('disabled');
              $('#gatewayNextDemo').css('cursor','pointer');
              $('#gatewayNextDemo').css('opacity',1);
            }else{
              $('#gatewayNextDemo').attr('disabled');
              $('#gatewayNextDemo').css('cursor','auto');
              $('#gatewayNextDemo').css('opacity',0.7);
            }
             
           });
            $(gateway).find('#demoDatePicker').dateRangePicker(defaultlibConfig).bind('datepicker-open',function(){
              setTimeout(function(){
               var scrollBottom = $('.search-body').scrollTop() + $('.search-body').height();
               $('.search-body').animate({scrollTop: scrollBottom});
              },150)
            }).bind('datepicker-closed',function(){
              setTimeout(function(){
                if($('#demoDatePicker').val()){
                  $('#gatewayNextDemo').removeAttr('disabled');
                  $('#gatewayNextDemo').css('cursor','pointer');
                  $('#gatewayNextDemo').css('opacity',1);
                }else{
                  $('#gatewayNextDemo').attr('disabled');
                  $('#gatewayNextDemo').css('cursor','auto');
                  $('#gatewayNextDemo').css('opacity',0.7);
                }
               },150)
            });
            
            $('.pay-bill-container').append(gateway);
            $('.search-body').scrollTop(0);
        });
        $('.LoginWhiteBG').remove();
        $('search-body .finalResults').addClass('hide');
        $('.searchBox').addClass('hide');
        $('.search-body').addClass('h-100');
        $('.search-body').append(creditCard);
        $('.search-body').removeClass('hide');
        $('#searchChatContainer').addClass('bgfocus');
        $('.search-body').scrollTop(0);
        _self.bindPerfectScroll(creditCard,'.card-container', null, 'x','creditcard');
        
      }
    }
    KoreWidgetSDK.prototype.bindPerfectScroll = function (dataHtml, scrollContainer, update, scrollAxis, contentPSObj) {
      contentPSObj = contentPSObj || 'contentPSObj'
      var _self = this;
      if (KRPerfectScrollbar) {
        if (!update) {
          if (scrollAxis && scrollAxis === 'x') {
            _self.vars[contentPSObj] = new KRPerfectScrollbar($(dataHtml).find(scrollContainer).get(0), {
              suppressScrollY: true
            });
          } else {
            _self.vars.contentPSObj = new KRPerfectScrollbar($(dataHtml).find(scrollContainer).get(0), {
              suppressScrollX: true
            });
          }

        } else {
          _self.vars.contentPSObj.update();
        }
      }
    }
    KoreWidgetSDK.prototype.bindLiveDataToChat = function(botAction){
      $('#search').val('');
      $('#suggestion').val('');
      var _self = this;
      var payload = {
        "query": _self.vars.searchObject.searchText,
        "maxNumOfResults": 9,
        "userId": _self.API.uuid,
        "streamId": _self.API.streamId,
        "lang": "en"
      }
      if(botAction){
        _self.vars.searchObject.searchText="";
        payload.isBotAction=true;
      }
      payload.smallTalk= true;
      var url = _self.API.searchUrl;//'https://qa-bots.kore.ai/searchAssistant/liveSearch';
      var searchData;
      _self.getFrequentlySearched(url, 'POST', JSON.stringify(payload)).then(function (res) {
        var faqs = [], pages = [], tasks = [], facets; 
        if (res.templateType === 'search') {
          res = res.template;
          var liveResult = res.results;
                      // liveResult.forEach(function (result) {
                      //   if (result.contentType === "faq") {
                      //     faqs.push(result);
                      //   } else if (result.contentType === "page") {
                      //     pages.push(result);
                      //   } else if (result.contentType === "task") {
                      //     tasks.push(result);
                      //   }
                      // });
                      faqs=res.results.faq;
                      pages=res.results.page;
                      tasks=res.results.task;
                      facets = res.facets;
                      var dataObj = {
                        faqs: faqs,
                        pages: pages,
                        tasks: tasks,
                        facets: facets,
                        originalQuery: res.originalQuery || '',
                      }
                      _self.vars.searchObject.liveData = {
                        faqs: faqs,
                        pages: pages,
                        tasks: tasks,
                        facets: facets,
                        originalQuery: res.originalQuery || '',
                      }
                      if(!_self.vars.searchObject.recents.length || ( _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.indexOf(res.originalQuery.toLowerCase()) == -1)) {
                        _self.vars.searchObject.recents.unshift(res.originalQuery.toLowerCase());
                      } 
                      window.localStorage.setItem("recents", JSON.stringify(_self.vars.searchObject.recents));
                      if(dataObj.faqs.length ||
                        dataObj.pages.length ||
                        dataObj.tasks.length || dataObj.smallTalk) {
                           if(dataObj.smallTalk) {
                            _self.sendMessageToSearch('bot',dataObj.smallTalk);
                          } else {
                            var _botMessage = 'Sure, please find the below matched results';
                            searchData = $(_self.getSearchTemplate('liveSearchData')).tmplProxy({
                              faqs:dataObj.faqs,
                              pages:dataObj.pages,
                              tasks:dataObj.tasks,
                              showAllResults: true,
                              noResults:false
                            });
                            $(searchData).data(dataObj);
                            _self.sendMessageToSearch('bot',_botMessage);
                            $(searchData).find(".tasks-wrp").sortable();
                            $(searchData).attr('queryString',dataObj.originalQuery)
                            $('#searchChatContainer').append(searchData);
                          }
                          setTimeout(function(){
                            var scrollBottom = $('#searchChatContainer').scrollTop() + $('#searchChatContainer').height();
                           $('#searchChatContainer').animate({scrollTop: scrollBottom});
                          },200);
                          if($('.search-container').hasClass('conversation')){
                            $('.search-body').addClass('hide');
                            $('#searchChatContainer').removeClass('bgfocus');
                            $('.search-body').html('');
                          }
                          _self.bindAllResultsView();
                          _self.bindSearchActionEvents();
                
                        } else{
                          if($('.search-container').hasClass('conversation')){
                          $('.search-body').addClass('hide');
                          $('#searchChatContainer').removeClass('bgfocus');
                          }
                        }
        } else if(res.templateType === 'botAction'){
            debugger;
            res = res.template;
            var botResponse=res.webhookPayload.text;
            _self.sendMessageToSearch('bot',botResponse);
        } else if(res.templateType === 'botActionError') {
          var errorMessage =  (res.template && res.template.Error)? res.template.Error : 'Failed to connect to the bot'
          _self.sendMessageToSearch('bot',errorMessage);
        } else if(res.templateType === 'liveSearchEmpty') {
          _self.sendMessageToSearch('bot','No results found');
        }
      });
    }
    KoreWidgetSDK.prototype.bindFrequentData = function () {
      var _self = this;
      $('#suggestion').val('');
      var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
        // searchResults: _self.vars.searchObject.recentAPIResponse,
        recents: _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0, 6),
        recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0, 2)
      });
      $('.search-body').html(freqData);
      setTimeout(function () {
        $('.search-body').scrollTop(2);
      }, 100);
      _self.deleteRecents();
      _self.recentClick();
      _self.bindSearchActionEvents();
    }
    KoreWidgetSDK.prototype.clickOutsideSearch = function () {

      $(document).on('click', function (event) {
        if (!$(event.target).closest('.search-container').length) {
          if($('.search-body').find('.pay-bill-container').length){
           return;
          }else {
            // $('.search-container').removeClass('active');
          }
        } else {
          event.stopPropagation();
          $('.search-body').removeClass('hide');
          $('#searchChatContainer').addClass('bgfocus');
        }
        if ($(event.target).closest('#searchChatContainer').length) {
          event.stopPropagation();
          if ($('.search-container').hasClass('conversation')) {
            $('.search-body').addClass('hide');
            $('#searchChatContainer').removeClass('bgfocus');
            $('.search-body').removeClass('h-100');
          };
        } else {
          $('.search-body').removeClass('hide');
          $('#searchChatContainer').addClass('bgfocus');
        }
      });
    }();
    KoreWidgetSDK.prototype.sendMessageToSearch = function (type, mesageData, data) {
      var _self = this;
      var messageData = {
        'text': '',
        'from': type,
      }
      if (type === 'user' && ($('#search').val() !== null) && ($('#search').val() !== undefined)) {
        messageData.text = $('#search').val();
        if(messageData.text && messageData.text.trim()){
          var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
            msgData: messageData
          });
          $('#searchChatContainer').append(template);
        }
      }
      if (type === 'bot') {
        messageData.text = mesageData;
        var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
          msgData: messageData
        });
        $('#searchChatContainer').append(template);
      }
      if (type === 'botAction') {
        messageData.text = _self.vars.searchObject.searchText;
        messageData.from='user';
        var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
          msgData: messageData
        });
        $('#searchChatContainer').append(template);
        $('.search-body').hide();
        _self.bindLiveDataToChat(true);
        
      }
      setTimeout(function () {
        var scrollBottom = $('#searchChatContainer').scrollTop() + $('#searchChatContainer').height();
        $('#searchChatContainer').animate({ scrollTop: scrollBottom });
      }, 200);
    }
    KoreWidgetSDK.prototype.userLogin = function (clickedAction) {
      _self = this
      var action = clickedAction;
      var userLogin = $(_self.getSearchTemplate('userLogin')).tmplProxy({});
      $(userLogin).off('keyup', '#testFutureUserId').on('keyup', '#testFutureUserId', function (event) {
        $('.errorMsg').addClass('hide');
        if ($('#testFuturePassword').val() && $('#testFutureUserId').val()) {
          $('.testFutureLoginBtn').removeAttr('disabled');
          $('.testFutureLoginBtn').css('cursor', 'pointer');
          $('.testFutureLoginBtn').css('opacity', '1');
        } else {
          $('.testFutureLoginBtn').attr('disabled');
          $('.testFutureLoginBtn').css('cursor', 'auto')
          $('.testFutureLoginBtn').css('opacity', '0.7');
        }
      })
      $(userLogin).off('keyup', '#testFuturePassword').on('keyup', '#testFuturePassword', function (event) {
        $('.errorMsg').addClass('hide');
        if ($('#testFuturePassword').val() && $('#testFutureUserId').val()) {
          $('.testFutureLoginBtn').removeAttr('disabled');
          $('.testFutureLoginBtn').css('cursor', 'pointer');
          $('.testFutureLoginBtn').css('opacity', '1');
        } else {
          $('.testFutureLoginBtn').attr('disabled');
          $('.testFutureLoginBtn').css('cursor', 'auto')
          $('.testFutureLoginBtn').css('opacity', '0.7');
        }
      })
      $(userLogin).off('click', '.testFutureLoginBtn').on('click', '.testFutureLoginBtn', function (event) {
        event.stopPropagation();
        if (($('#testFutureUserId').val() === 'John') && ($('#testFuturePassword').val() === '1111')) {
          _self.vars.loggedInUser = 'John';
          $('.menu-link.login').addClass('hide');
          $('.menu-link.loggedIn').removeClass('hide');
          $('.errorMsg').addClass('hide');
          _self.searchEventBinding('pay bill', action, event);
        } else {
          $('.errorMsg').removeClass('hide');
        }
      });
      $('.search-body .finalResults').addClass('hide');
      $('.searchBox').addClass('hide');
      $('.search-body').append(userLogin);
      $('.search-body').removeClass('hide');
      $('#searchChatContainer').addClass('bgfocus');
    };
    KoreWidgetSDK.prototype.getFrequentlySearched = function (url, type, payload) {
      var bearer = this.API.jstBarrer || "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.wrUCyDpNEwAaf4aU5Jf2-0ajbiwmTU3Yf7ST8yFJdqM";
      return $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        headers: {
          "Authorization": bearer,
          "Content-Type": "application/json"
        },
        data: payload,
        success: function (data) {
          // console.log(data);
        },
        error: function (err) {
          console.log(err)
        }
      })
    };

    KoreWidgetSDK.prototype.makeAPItoFindly = function (url, type, payload) {
      return $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        headers: {
          "Authorization": 'bearer '+window.findlyAccessToken,
          "AccountId":window.findlyAccountId,
          "Content-Type": "application/json"
        },
        data: payload,
        success: function (data) {
          // console.log(data);
        },
        error: function (err) {
          console.log(err)
        }
      })
    };
    KoreWidgetSDK.prototype.bindCloseGreeting = function () {
      var _self = this;
      $('.search-greeting-close-container').off('click').on('click', function (e) {
        _self.closeGreetingMsg();
      })
    };

    var final_transcript = '';
            var recognizing = false;
            var recognition = null;
            var prevStr = "";
    function getSIDToken() {
     // if (allowGoogleSpeech) {
        if (recognition) { // using webkit speech recognition
          startGoogleWebKitRecognization();
        }
        else { // using google cloud speech API
          micEnable();
        }
      // }
      // else {
      //   if (!speechPrefixURL) {
      //     console.warn("Please provide speech socket url");
      //     return false;
      //   }
      //   $.ajax({
      //     url: speechPrefixURL + "asr/wss/start?email=" + userIdentity,
      //     type: 'post',
      //     headers: { "Authorization": (bearerToken) ? bearerToken : assertionToken },
      //     dataType: 'json',
      //     success: function (data) {
      //       sidToken = data.link;
      //       micEnable();
      //     },
      //     error: function (err) {
      //       console.log(err);
      //     }
      //   });
      // }
    }
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    function capitalize(s) {
        return s.replace(s.substr(0, 1), function (m) { return m.toUpperCase(); });
    }
    function startGoogleWebKitRecognization() {
        if (recognizing) {
            recognition.stop();
            return;
        }
        final_transcript = '';
        recognition.lang = 'en-US';
        recognition.start();
    }
    function startGoogleSpeech() {
        if (rec) {
            rec.record();
            $('.recordingMicrophone').css('display', 'block');
            $('.notRecordingMicrophone').css('display', 'none');
            console.log('recording...');
            intervalKey = setInterval(function () {
                rec.export16kMono(function (blob) {
                    console.log(new Date());
                    if (allowGoogleSpeech) {
                        sendBlobToSpeech(blob, 'LINEAR16', 16000);
                    }
                    else {
                        socketSend(blob);
                    }
                    rec.clear();
                }, 'audio/x-raw');
            }, 1000);
        }
    }

    function startGoogleWebKitRecognization() {
      if (recognizing) {
          recognition.stop();
          return;
      }
      final_transcript = '';
      recognition.lang = 'en-US';
      recognition.start();
  }
  function startGoogleSpeech() {
      if (rec) {
          rec.record();
          $('.recordingMicrophone').css('display', 'block');
          $('.notRecordingMicrophone').css('display', 'none');
          console.log('recording...');
          intervalKey = setInterval(function () {
              rec.export16kMono(function (blob) {
                  console.log(new Date());
                  if (allowGoogleSpeech) {
                      sendBlobToSpeech(blob, 'LINEAR16', 16000);
                  }
                  else {
                      socketSend(blob);
                  }
                  rec.clear();
              }, 'audio/x-raw');
          }, 1000);
      }
  }

    function micEnable() {
      if (isRecordingStarted) {
        return;
      }
      if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      }
      if (navigator.getUserMedia) {
        isRecordingStarted = true;
        navigator.getUserMedia({
          audio: true
        }, success, function (e) {
          isRecordingStarted = false;
          alert('Please enable the microphone permission for this page');
          return;
        });
      } else {
        isRecordingStarted = false;
        alert('getUserMedia is not supported in this browser.');
      }
    }

    function afterMicEnable() {
      if (navigator.getUserMedia) {
        if (!rec) {
          isRecordingStarted = false;
          console.error("Recorder undefined");
          return;
        }
        if (_connection) {
          cancel();
        }
        try {
          _connection = createSocket();
        } catch (e) {
          isRecordingStarted = false;
          console.log(e);
          console.error('Web socket not supported in the browser');
        }
      }
    }
    function stop() {
      // if ($('.chatInputBox').text() !== '' && autoEnableSpeechAndTTS) {
      //     var me = window.chatContainerConfig;
      //     me.sendMessage($('.chatInputBox'));
      // }
      // clearInterval(intervalKey);
      $('.recordingMicrophone').css('display', 'none');
      $('.notRecordingMicrophone').css('display', 'block');
      // if (rec) {
      //     rec.stop();
      //     isListening = false;
      //     console.log('stopped recording..');
      //     setTimeout(function () {
      //         if (_connection) {
      //             _connection.close();
      //             _connection = null;
      //         }
      //     }, 1000); // waiting to send and receive last message

      //     rec.export16kMono(function (blob) {
      //         socketSend(blob);
      //         rec.clear();
      //         if (_connection) {
      //             _connection.close();
      //         }
      //         var track = mediaStream.getTracks()[0];
      //         track.stop();
      //         rec.destroy();
      //         isRecordingStarted = false;
      //     }, 'audio/x-raw');
      // } else {
      //     console.error('Recorder undefined');
      // }
      if (recognizing) {
          recognition.stop();
          recognizing = false;
      }
  };
    KoreWidgetSDK.prototype.initWebKitSpeech = function () {
      var _self = this;
      if ('webkitSpeechRecognition' in window && isChrome()) {
        recognition = new window.webkitSpeechRecognition;
        final_transcript = '';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
          prevStr = "";
          recognizing = true;
          $('.recordingMicrophone').css('display', 'block');
          $('.notRecordingMicrophone').css('display', 'none');
        };

        recognition.onerror = function (event) {
          console.log(event.error);
          $('.recordingMicrophone').trigger('click');
          $('.recordingMicrophone').css('display', 'none');
          $('.notRecordingMicrophone').css('display', 'block');
        };

        recognition.onend = function () {
          recognizing = false;
          $('.recordingMicrophone').trigger('click');
          $('.recordingMicrophone').css('display', 'none');
          $('.notRecordingMicrophone').css('display', 'block');
        };

        recognition.onresult = function (event) {
          final_transcript = '';
          var interim_transcript = '';
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
          final_transcript = capitalize(final_transcript);
          final_transcript = linebreak(final_transcript);
          interim_transcript = linebreak(interim_transcript);
          if (final_transcript !== "") {
            prevStr += final_transcript;
          }
          //console.log('Interm: ',interim_transcript);
          //console.log('final: ',final_transcript);
          if (recognizing) {
            //$('.chatInputBox').html(prevStr + "" + interim_transcript);

            $("#search").val((prevStr + "" + interim_transcript));
            $('#search').focus().trigger({ type : 'keyup', which : 32 });
            //8
            //$('.sendButton').removeClass('disabled');
          }

          // setTimeout(function () {
          //   setCaretEnd(document.getElementsByClassName("chatInputBox"));
          //   document.getElementsByClassName('chatInputBox')[0].scrollTop = document.getElementsByClassName('chatInputBox')[0].scrollHeight;
          // }, 350);
        };
      }
    };
    function isChrome() {
      var isChromium = window.chrome,
          winNav = window.navigator,
          vendorName = winNav.vendor,
          isOpera = winNav.userAgent.indexOf("OPR") > -1,
          isIEedge = winNav.userAgent.indexOf("Edge") > -1,
          isIOSChrome = winNav.userAgent.match("CriOS");

      if (isIOSChrome) {
          return true;
      } else if (
          isChromium !== null &&
          typeof isChromium !== "undefined" &&
          vendorName === "Google Inc." &&
          isOpera === false &&
          isIEedge === false
      ) {
          return true;
      } else {
          return false;
      }
  }

    KoreWidgetSDK.prototype.showSearch = function () {
      var _self = this;
      _self.initWebKitSpeech();
      _self.setAPIDetails();
      window.koreWidgetSDKInstance = _self;
      var windowWidth = window.innerWidth;
      var left = ((windowWidth / 2) - 250) + 'px';
      var dataHTML = $(_self.getSearchTemplate('searchContainer')).tmplProxy({
      });
      // $(dataHTML).off('click', '.search-logo').on('click', '.search-logo', function (event) {
      //   $('.search-container').toggleClass('conversation');
      // });


      $(dataHTML).off('click', '.notRecordingMicrophone').on('click', '.notRecordingMicrophone', function (event) {
        // if (ttsAudioSource) {
        //     ttsAudioSource.stop();
        // }
        // if (isSpeechEnabled) {
            getSIDToken();
        //}
    });
    $(dataHTML).off('click', '.recordingMicrophone').on('click', '.recordingMicrophone', function (event) {
        stop();
        // setTimeout(function () {
        //     setCaretEnd(document.getElementsByClassName("chatInputBox"));
        // }, 350);
    });

      _self.bindSearchAccordion();
      $(dataHTML).css('left', left);
      var container=$('.search-background-div');
      if(!container.length){
        container=$('body')
      }
      $(container).append(dataHTML);
      _self.bindPerfectScroll(dataHTML, '.search-body', null, 'searchBody');
      _self.bindPerfectScroll(dataHTML, '#searchChatContainer', null, 'searchChatContainer');
      $(window).off('resize').on('resize', function () {
        windowWidth = window.innerWidth;
        left = ((windowWidth / 2) - 250) + 'px';
        $(dataHTML).css('left', left);
      });
      _self.showGreetingMsg = true;
      _self.vars.searchObject.clearGreetingTimeOut = setTimeout(function () {
        var greetingMsg = $(_self.getSearchTemplate('greetingMsg')).tmplProxy({
        });
        $('.greetingMsg').removeClass('hide');
        $('.greetingMsg').html(greetingMsg);
        if ($(".search-container").find(".greetingMsg").length) {
          $('.greetingMsg').parent().css("box-shadow", "none");
        }
        _self.bindCloseGreeting();
      }, 1000);

      // var searchModal = $(_self.getSearchTemplate('searchResultModal')).tmplProxy({
      // });
      // $('.search-modal-body').html(searchModal);
      // $('#search-modal').css('display', 'block');
      _self.searchEventBinding(dataHTML, 'search-container');

    };
    KoreWidgetSDK.prototype.getTemplate = function (type) {
      var menuTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl">\
        <div class="menuItemCntr">\
        <div class="sdkBotIcon" {{if botDetails && botDetails.name}}title="${botDetails.name}"{{/if}}>\
        <img class="menuIconMobile" onClick="openPanel(\'closePanel\',\'' + " " + '\',\'' + "true" + '\')"  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDcwcHgiIGhlaWdodD0iNDcwcHgiIHZpZXdCb3g9IjAgMCA0NzAgNDcwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1My4yICg3MjY0MykgLSBodHRwczovL3NrZXRjaGFwcC5jb20gLS0+CiAgICA8dGl0bGU+bWVudS1pY29uPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Im1lbnUtaWNvbiIgZmlsbD0iIzc2NzY4OCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTUzLjMzMywxMDYuNjY3IEw0MTYsMTA2LjY2NyBDNDQ1LjQxNywxMDYuNjY3IDQ2OS4zMzMsODIuNzQgNDY5LjMzMyw1My4zMzQgQzQ2OS4zMzMsMjMuOTI4IDQ0NS40MTcsMCA0MTYsMCBMNTMuMzMzLDAgQzIzLjkxNywwIDAsMjMuOTI3IDAsNTMuMzMzIEMwLDgyLjczOSAyMy45MTcsMTA2LjY2NyA1My4zMzMsMTA2LjY2NyBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNNDE2LDE4MS4zMzMgTDUzLjMzMywxODEuMzMzIEMyMy45MTcsMTgxLjMzMyAwLDIwNS4yNiAwLDIzNC42NjcgQzAsMjY0LjA3NCAyMy45MTcsMjg4IDUzLjMzMywyODggTDQxNiwyODggQzQ0NS40MTcsMjg4IDQ2OS4zMzMsMjY0LjA3MyA0NjkuMzMzLDIzNC42NjcgQzQ2OS4zMzMsMjA1LjI2MSA0NDUuNDE3LDE4MS4zMzMgNDE2LDE4MS4zMzMgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTQxNiwzNjIuNjY3IEw1My4zMzMsMzYyLjY2NyBDMjMuOTE3LDM2Mi42NjcgMCwzODYuNTk0IDAsNDE2IEMwLDQ0NS40MDYgMjMuOTE3LDQ2OS4zMzMgNTMuMzMzLDQ2OS4zMzMgTDQxNiw0NjkuMzMzIEM0NDUuNDE3LDQ2OS4zMzMgNDY5LjMzMyw0NDUuNDA2IDQ2OS4zMzMsNDE2IEM0NjkuMzMzLDM4Ni41OTQgNDQ1LjQxNywzNjIuNjY3IDQxNiwzNjIuNjY3IFoiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" >\
        <img onClick="openPanel(\'closePanel\',\'' + " " + '\',\'' + "true" + '\')" src="https://dlnwzkim0wron.cloudfront.net/f-c1af9314-6121-5e4d-86d6-4c98d3f17a8e.png" class="iconBot" onerror="this.onerror=null;this.src="">\
        <span class="botName">${botDetails.name}</span>\
        </div>\
          <div class="menuItemBox" >\
              {{each(key, msgItem) panelData}}\
              <div onClick="openPanel(\'${msgItem._id}\')" class="menuItemContainer {{if msgItem && msgItem._id}}${msgItem._id}{{/if}}" {{if msgItem && msgItem.name}}title="${msgItem.name}"{{/if}}>\
                  <img src="${msgItem.icon}" class="menuItem" panels-menu-id="${msgItem._id}" id="${msgItem.name}"  onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';">\
                 <span class="panelNameTooltip">${msgItem.name}</span>\
              </div>\
              {{/each}}\
          </div>\
          <div class="sdkThemeContainer" title="Themes">\
          <i  class="icon-More dropbtnWidgt sdkThemeIcon"  onclick="showDropdown(this)"></i>\
          <ul class="dropdown-contentWidgt  rmpmW themeContent" style="list-style:none;">\
                  <li class="themeTitle">Theme</li>\
                  <li class="dropdown-item action themeName" id="defaultTheme-kore">Theme One<span></span></li>\
                  <li class="dropdown-item action themeName" id="darkTheme-kore">Theme Two<span></span></li>\
                  <li class="dropdown-item action themeName" id="defaultTheme-kora">Theme Three<span></span></li>\
                  <li class="dropdown-item action themeName" id="darkTheme-kora">Theme Four<span></span></li>\
          </ul>\
          </div>\
        </div>\
      </script>';
      var widgetHeader = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="headerLeft">\
            <p class="headerWidgetTitle newHeader">${widgetData.title}</p>\
            {{if tempData && tempData.description}}\
            <p class="headerWidgetDesc" id="widgetDisc">${tempData.description}</p>\
            {{/if}}\
          </div>\
          {{if tempData && ((tempData.sortOptions && tempData.sortOptions.length)|| (tempData && tempData.headerOptions && (tempData.headerOptions.type==="text") && tempData.headerOptions.text) || (tempData.headerOptions && tempData.headerOptions.type==="menu" && tempData.headerOptions.menu && tempData.headerOptions.menu.length) || (tempData.headerOptions && tempData.headerOptions.type==="image" && tempData.headerOptions && tempData.headerOptions.image && tempData.headerOptions.image.image_src) || (tempData.filterOptions && tempData.filterOptions.length) || (tempData.headerOptions && tempData.headerOptions.type==="button" && tempData.headerOptions.button && tempData.headerOptions.button.title) || (tempData.headerOptions && tempData.headerOptions.type==="url" && tempData.headerOptions.url && tempData.headerOptions.url.title))}}\
            <div class="headerRight">\
                {{if tempData && tempData.sortOptions && tempData.sortOptions.length}}\
                  <div class="headerTitleSorting">\
                    <i class="icon-More dropbtnWidgt sortingIcon"  onclick="showDropdown(this)"></i>\
                    <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                    {{each(key1, sort) tempData.sortOptions}} \
                            <li class="dropdown-item action {{if sort.isSelect}}selected{{/if}}" sort-obj ="${JSON.stringify(sort)}" action-type="sortOptions">${sort.title}<span class="selectedFilterTick"></span></li>\
                    {{/each}} \
                    </ul>\
                  </div>\
                {{/if}}\
                {{if tempData && tempData.filterOptions && tempData.filterOptions.length}}\
                  <div class="headerTitleFilters action" action-type="filter" filterObj= "${JSON.stringify(tempData)}"></div>\
                {{/if}}\
                {{if tempData && tempData.headerOptions && tempData.headerOptions.type==="button" && tempData.headerOptions.button && tempData.headerOptions.button.title}}\
                  <div class="headerTitleBTN action" action-type="default" actionObj="${JSON.stringify(tempData.headerOptions.button)}">${tempData.headerOptions.button.title}</div>\
                {{/if}}\
                {{if tempData && tempData.headerOptions && tempData.headerOptions.type==="text" && tempData.headerOptions.text}}\
                  <div class="headerTitleTEXT" action-type="default">${tempData.headerOptions.text}</div>\
                {{/if}}\
                {{if tempData && tempData.headerOptions && tempData.headerOptions.type==="url" && tempData.headerOptions.url && tempData.headerOptions.url.title}}\
                  <div class="headerTitleURL action" action-type="url" actionObj="${JSON.stringify(tempData.headerOptions.url)}">${tempData.headerOptions.url.title}</div>\
                {{/if}}\
                {{if tempData && tempData.headerOptions && tempData.headerOptions.type==="image" && tempData.headerOptions.image && tempData.headerOptions.image.image_src}}\
                <div class="headerTitleIMG action" action-type="default" actionObj="${JSON.stringify(tempData.headerOptions.image)}"><img src="${tempData.headerOptions.image.image_src}" class="headerIcon"></div>\
                {{/if}}\
                {{if tempData && tempData.headerOptions && tempData.headerOptions.type==="menu" && tempData.headerOptions.menu && tempData.headerOptions.menu.length}}\
                <div class="headerTitleMenu">\
                <i class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)"></i>\
                <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                {{each(key1, menuBtn) tempData.headerOptions.menu}} \
                        <li class="dropdown-item action" actionObj="${JSON.stringify(menuBtn)}" action-type="default">${menuBtn.title}</li>\
                 {{/each}} \
                </ul>\
                </div>\
                {{/if}}\
            </div>\
          {{/if}}\
      </script>';
      var mainTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="mainTemplateCntr" id="${widgetData._id}" {{if panelDetail}}panelDetail="${JSON.stringify(panelDetail)}{{/if}}">\
              <div class="widgetTitle">\
              <img class="menuIconMobile" onClick="openPanel(\'closePanel\',\'' + " " + '\',\'' + "true" + '\')"  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDcwcHgiIGhlaWdodD0iNDcwcHgiIHZpZXdCb3g9IjAgMCA0NzAgNDcwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1My4yICg3MjY0MykgLSBodHRwczovL3NrZXRjaGFwcC5jb20gLS0+CiAgICA8dGl0bGU+bWVudS1pY29uPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Im1lbnUtaWNvbiIgZmlsbD0iIzc2NzY4OCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTUzLjMzMywxMDYuNjY3IEw0MTYsMTA2LjY2NyBDNDQ1LjQxNywxMDYuNjY3IDQ2OS4zMzMsODIuNzQgNDY5LjMzMyw1My4zMzQgQzQ2OS4zMzMsMjMuOTI4IDQ0NS40MTcsMCA0MTYsMCBMNTMuMzMzLDAgQzIzLjkxNywwIDAsMjMuOTI3IDAsNTMuMzMzIEMwLDgyLjczOSAyMy45MTcsMTA2LjY2NyA1My4zMzMsMTA2LjY2NyBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNNDE2LDE4MS4zMzMgTDUzLjMzMywxODEuMzMzIEMyMy45MTcsMTgxLjMzMyAwLDIwNS4yNiAwLDIzNC42NjcgQzAsMjY0LjA3NCAyMy45MTcsMjg4IDUzLjMzMywyODggTDQxNiwyODggQzQ0NS40MTcsMjg4IDQ2OS4zMzMsMjY0LjA3MyA0NjkuMzMzLDIzNC42NjcgQzQ2OS4zMzMsMjA1LjI2MSA0NDUuNDE3LDE4MS4zMzMgNDE2LDE4MS4zMzMgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTQxNiwzNjIuNjY3IEw1My4zMzMsMzYyLjY2NyBDMjMuOTE3LDM2Mi42NjcgMCwzODYuNTk0IDAsNDE2IEMwLDQ0NS40MDYgMjMuOTE3LDQ2OS4zMzMgNTMuMzMzLDQ2OS4zMzMgTDQxNiw0NjkuMzMzIEM0NDUuNDE3LDQ2OS4zMzMgNDY5LjMzMyw0NDUuNDA2IDQ2OS4zMzMsNDE2IEM0NjkuMzMzLDM4Ni41OTQgNDQ1LjQxNywzNjIuNjY3IDQxNiwzNjIuNjY3IFoiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=">\
              <img class="widgetMobileIcon"src="${widgetData.icon}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';">\
              <span class="panelWidgetName">${widgetData.name}</span>\
              <span class="panelHeaderActions">\
                <span onClick="refreshElement(\'${JSON.stringify(panelDetail)}\',\'refreshPanel\')" class="panelRefresh"></span>\
                <span class="panelSetting"></span>\
                <span class="panelMin"></span>\
                <span onClick="openPanel(\'${widgetData._id}\')" class="panelClose"></span>\
              </span>\
              </div>\
              <div class="mainTemplateBdr {{if widgetData.widgets && widgetData.widgets.length > 1}}scroll{{else}}scroll{{/if}}">\
                  {{each(key1, widget) widgetData.widgets}} \
                      <div class="widgetPanel" id="${widget.id}">\
                      {{if widget && widget.title}}\
                      <div class="panelHeader" >\
                        <div class="headerLeft fullWidthTitle">\
                          <p class="headerWidgetTitle">${widget.title}</p>\
                        </div>\
                      </div>\
                      {{/if}}\
                          {{if widget && widget.filterOptions}}\
                              <div id="${widget.id}" class="widgetContParent">\
                                  <div class="filter">\
                                      <ul class="filterCntr">\
                                          {{each(key, widgetFilter) widget.filterOptions}} \
                                              <li class="{{if key === 0}}active{{else}}unActive{{/if}}" style="background: ${widgetData.theme};" id="${widgetFilter.id}" onclick="filterTabs(\'.mainTemplateCntr\',\'${widget.id}\',\'${widgetFilter.id}\')">${widgetFilter.title}</li>\
                                          {{/each}}\
                                      </ul>\
                                      <div class="progress"><div  class="slider"> <div class="line"></div><div class="subline inc"></div> <div class="subline dec"></div></div></div>\
                                      {{each(key, widgetFilter) widget.filterOptions}} \
                                          <div {{if widgetData.widgets && widgetData.widgets.length === 1}} onscroll="scrollData(\'${JSON.stringify(panelDetail)}\',\'${JSON.stringify(widgetFilter)}\',\'maintemplate\',this)" {{/if}}  class="widgetContentPanel ${widget.id}_content  {{if widgetData.widgets && widgetData.widgets.length === 1}}scroll{{/if}}" id="${widgetFilter.id}_content" {{if key > 0}}style="display: none;"{{/if}}><div class="loaderRing"><div></div><div></div><div></div><div></div></div></div>\
                                      {{/each}}\
                                  </div>\
                              </div>\
                          {{else}}\
                              <div id="${widget.id}" class="widgetContParent">\
                                  <div class="progress"><div  class="slider"> <div class="line"></div><div class="subline inc"></div> <div class="subline dec"></div></div></div>\
                                  <div {{if widgetData.widgets && widgetData.widgets.length === 1}} onscroll="scrollData(\'${JSON.stringify(panelDetail)}\',\'${JSON.stringify(widget)}\',\'maintemplate\', this)" {{/if}}    id="${widget.id}_content" class="widgetContentPanel {{if widgetData.widgets && widgetData.widgets.length === 1}}scroll{{/if}}"><div class="loaderRing"><div></div><div></div><div></div><div></div></div>\</div>\
                              </div>\
                          {{/if}}\
                      </div>\
                  {{/each}} \
                  <div class="bottomOverlayContainer" id="widgetSdkBottomOverlayContainer">\
                  </div>\
              </div>\
          </div>\
      </script>';
      var viewMoreTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="viewMoreCntr" id="${widgetData._id}">\
              <div class="widgetTitle"><i class="icon-Arrow-Material viewMoreBack" onclick="removeViewMore()"></i> ${widgetData.name}</div>\
              <div class="taskSelectCntr"><i class="icon-Close1" onclick="removeTaskSelection()"></i> <span class="taskCount">1 task selected</span></div>\
              <div class="mainTemplateBdr">\
                  {{each(key, widget) widgetData.widgets}} \
                      <div class="widgetPanel">\
                      {{if widget && widget.title}}\
                          <div class="panelHeader padd10">${widget.title}</div>\
                      {{/if}}\
                          {{if widget && widget.filterOptions}}\
                              <div id="${widget.id}" class="panelCntr" style="border-bottom: 5px solid var(--sdk-primary-border-color);">\
                                  <div class="filter">\
                                      <ul class="filterCntr">\
                                          {{each(key, widgetFilter) widget.filterOptions}} \
                                              <li class="{{if (widgetData._id === panelDetail.panel && widget.id === panelDetail.subpanel && widgetFilter.id === panelDetail.filter)}}active{{else}}unActive{{/if}}" style="background: ${widgetData.theme};" id="${widgetFilter.id}" onclick="filterTabs(\'.viewMoreCntr\',\'${widget.id}\',\'${widgetFilter.id}\')">${widgetFilter.title}</li>\
                                          {{/each}}\
                                      </ul>\
                                      {{each(key, widgetFilter) widget.filterOptions}} \
                                          <div onscroll="scrollData(\'${JSON.stringify(panelDetail)}\', \'${JSON.stringify(widgetFilter)}\',\'viewmore\', this)" class="scroll widgetContentPanel ${widget.id}_content" id="${widgetFilter.id}_content" style="display:{{if (widgetData._id === panelDetail.panel && widget.id === panelDetail.subpanel && widgetFilter.id === panelDetail.filter)}}block{{else}}none{{/if}};"><div class="loaderRing"><div></div><div></div><div></div><div></div></div></div>\
                                      {{/each}}\
                                  </div>\
                              </div>\
                          {{else}}\
                              <div id="${widget.id}" class="scroll" style="border-bottom: 5px solid var(--sdk-primary-border-color);"><div class="loaderRing"><div></div><div></div><div></div><div></div></div></div>\
                          {{/if}}\
                      </div>\
                  {{/each}} \
              </div>\
              <div class="taskSelectFootCntr">\
                  <button class="btn complete" onclick="taskSend(\'complete\')">Complete</button>\
                  <button class="btn changeduedate" onclick="taskSend(\'changeduedate\')">Change due date</button>\
              </div>\
          </div>\
      </script>';
      var meetingTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="meetingWidget_Root" > \
              <div class="meetingWidget_Box">\
                  {{each(key, myMsgItem) tempdata.elements}} \
                      {{if helpers.checkMeetingHeaderTimeline(tempdata.elements, key)}}\
                          <div class="timeline">{{html helpers.getTimeline(myMsgItem.data.duration.start, "fulldate", "meetings")}}</div> \
                      {{/if}}\
                      <div class="carosalItem eleCntr {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) <= 5}}timeactive{{/if}}" template-type="${myMsgItem.template_type}">\
                      <div class="carosalCntr">\
                          <div class="meetingCntr">\
                              <div class="smeetingLft" style="display:none;">\
                                  {{if myMsgItem.day}}\
                                      <div class="timeCntr">{{if myMsgItem.localDay.intial}}<div>${myMsgItem.localDay.intial}</div>{{/if}}{{if myMsgItem.localDay.time}}<div>${myMsgItem.localDay.time}</div>{{/if}}<div>${myMsgItem.localDay.last}</div></div>\
                                  {{else}}\
                                      <div class="timeCntr">{{html helpers.getTimeline(new Date(parseInt(myMsgItem.data.duration.start)), "time")}}<br>{{html helpers.getTimeline(new Date(parseInt(myMsgItem.data.duration.end)), "time")}}</div>\
                                  {{/if}}\
                              </div>\
                              {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) <= 5}}\
                              <div class="meetingRft" style="border: 1px solid ${myMsgItem.data.color}">\
                              <div class="meetingTitle" {{if myMsgItem.data.color}}style="background:${myMsgItem.data.color};color:#ffffff!important"{{/if}}><div class="titleAlign">${myMsgItem.title}\
                              {{else}}\
                              <div class="meetingRft" {{if myMsgItem.data.color}}style="border: 1px solid ${hexToRGBMeeting(myMsgItem.data.color)}"{{/if}}>\
                                  <div class="meetingTitle" {{if myMsgItem.data.color}}style="background:${hexToRGBMeeting(myMsgItem.data.color)};"{{/if}}{{if $("body").hasClass("darkTheme")}}style="color:#ffffff"{{else}}style="color:#000000"{{/if}}><div class="titleAlign">${myMsgItem.title}\
                              {{/if}}\
                                  <i  class="icon-More dropbtnWidgt hide"  onclick="showDropdown(this)"></i>\
                                          <ul  class="dropdown-contentWidgt  rmpmW" style="list-style:none;">\
                                          {{each(key1, actionbtnli) myMsgItem.actions}} \
                                              {{if actionbtnli.type !== "dial"}}\
                                              {{if actionbtnli.type === "postback"}}\
                                                      <li class="dropdown-item" actionObj="${JSON.stringify(actionbtnli)}" mainObj="${JSON.stringify(myMsgItem)}" onclick="passMeetingUtterances(this)">"${actionbtnli.title}"</li>\
                                                  {{else}}\
                                                      <li class="dropdown-item" actionObj="${JSON.stringify(actionbtnli)}" mainObj="${JSON.stringify(myMsgItem)}"  onclick="passMeetingUtterances(this)">${actionbtnli.title}</li>\
                                                  {{/if}}\
                                              {{/if}}\
                                          {{/each}}\
                                      </ul>\
                                  </div>\
                              </div>\
                              <div class="timeCountrCntr hide">\
                              {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) <= 0}}\
                                      <i class="redDot"></i>\
                               {{/if}}\
                                    <span  id="m_${key}"> {{html meetingTimer( tempdata.elements,myMsgItem, key)}}</span>   \
                               </div>\
                              {{if myMsgItem.day}}\
                              <div class="timeCntr"> <i class="icon-Time1 icon16Gray"></i>{{if myMsgItem.localDay.intial}}<span>${myMsgItem.localDay.intial}</span>{{/if}}{{if myMsgItem.localDay.time}}<span> ${myMsgItem.localDay.time}</span>{{/if}}<span>${myMsgItem.localDay.last}</span></div>\
                          {{else}}\
                              <div class="timeCntr"><i class="icon-Time1 icon16Gray"></i><span>{{html helpers.getTimeline(new Date(parseInt(myMsgItem.data.duration.start)), "time")}} - {{html helpers.getTimeline(new Date(parseInt(myMsgItem.data.duration.end)), "time")}}</span>\
                              {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) > 5}}\
                              <span class="timeCountrCntr" id="m_${key}">\
                                     {{html meetingTimer( tempdata.elements,myMsgItem, key)}}\
                               {{/if}}\
                               </span>\
                              </div>\
                          {{/if}}\
                              {{if myMsgItem.location}}<div class="meetingPlaceCntr"><i class="meetingPlace icon-Material---Location1"></i> {{if isURL(myMsgItem.location).status}}<a class="meetingUrlText" href="${isURL(myMsgItem.location).location}"  target="_blank">${myMsgItem.location}</a>{{else}}${myMsgItem.location}{{/if}}</div>{{/if}}\
                              {{if myMsgItem.data.attendees && myMsgItem.data.attendees.length}}\
                                  <div class="meetingMemberCntr">\
                                      <span><i class="meetingUser icon-Material-Person"></i></span><span class="meetingMemberCntrText">{{if myMsgItem.data.attendees[0].name}}${myMsgItem.data.attendees[0].name}{{else}}${myMsgItem.data.attendees[0].email}{{/if}}\
                                      {{if myMsgItem.data.attendees.length > 1}} and ${myMsgItem.data.attendees.length -1} {{if myMsgItem.data.attendees.length > 2}}others{{else}}other{{/if}}{{/if}}\
                                      </span>\
                                      {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) <= 5}}\
                                      <div {{if myMsgItem.data.color}}style="background: ${hexToRGBMeeting(myMsgItem.data.color,0.1)}"{{/if}} class="meetingIconToggle" onclick="toggelMeetingActionBtn(\'meetingbtns${key}\', this)"><i class="{{if helpers.getTimeline(myMsgItem.data.duration.start, "fulldate", "meetings") === "Happening Now"}}icon-Arrow_Drop_Down_Up{{else}}icon-Arrow_Drop_Down{{/if}}" {{if myMsgItem.data.color}}style="color: ${myMsgItem.data.color}"{{/if}} ></i></div>\
                                      {{else}}\
                                      <div {{if myMsgItem.data.color}}style="background: ${hexToRGBMeeting(myMsgItem.data.color,0.1)}"{{/if}} class="meetingIconToggle" onclick="toggelMeetingActionBtn(\'meetingbtns${key}\', this)"><i class="{{if helpers.getTimeline(myMsgItem.data.duration.start, "fulldate", "meetings") === "Happening Now"}}icon-Arrow_Drop_Down_Up{{else}}icon-Arrow_Drop_Down{{/if}}" {{if myMsgItem.data.color}}style="color: ${myMsgItem.data.color}"{{/if}} ></i></div>\
                                      {{/if}}\
                                      </div>\
                              {{/if}}\
                              {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) <= 5}}\
                              <div class="meetingActionButtons hide" style="font-size: 23px;margin-top:10px;">\
                                  {{each(key, actionbtn) myMsgItem.actions}} \
                                      {{if actionbtn.type === "open_form" || actionbtn.custom_type === "url"}}\
                                       <div class="actionBtns"  {{if myMsgItem.data.color}}style="color:${myMsgItem.data.color};border: 2px solid ${myMsgItem.data.color}"{{/if}}  actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(myMsgItem)}" onclick="passMeetingUtterances(this)"> \
                                       <i class="${helpers.actionIcon(actionbtn)}"  ></i>&nbsp; ${actionbtn.title} </div> \
                                     {{/if}}  \
                                  {{/each}}\
                            </div>\
                          {{/if}}\
                        </div>\
                        <div class="meetingActionButtons"  id="meetingbtns${key}"  {{if helpers.getTimeline(myMsgItem.data.duration.start, "fulldate", "meetings") !== "Happening Now"}} style="display:none;{{/if}}">\
                            {{each(key, actionbtn) myMsgItem.actions}} \
                                {{if key < 2 }}\
                                {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) <= 5}}\
                                 <div class="actionBtns" {{if myMsgItem.data.color}}style="text-transform: uppercase;color:${myMsgItem.data.color};border: 2px solid ${myMsgItem.data.color}"{{/if}} actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(myMsgItem)}" onclick="passMeetingUtterances(this)"> \
                                 {{else}}\
                                 <div class="actionBtns" {{if myMsgItem.data.color}}style="text-transform: uppercase;color:${myMsgItem.data.color};border: 2px solid ${hexToRGBMeeting(myMsgItem.data.color)}"{{/if}} actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(myMsgItem)}" onclick="passMeetingUtterances(this)"> \
                                 {{/if}}\
                                 <i class="${helpers.actionIcon(actionbtn)}"></i> ${actionbtn.title} </div> \
                               {{/if}}  \
                            {{/each}}\
                            {{if myMsgItem.actions.length > 2}}\
                            {{if helpers.compareCurntTimeAndTimln_minutes(myMsgItem.data.duration.start,myMsgItem.data.duration.end, null) <= 5}}\
                            <div class="actionBtns dropdown" {{if myMsgItem.data.color}}style="color:${myMsgItem.data.color};text-transform: uppercase;border: 2px solid ${myMsgItem.data.color}"{{/if}}  style="vertical-align:middle;" >\
                            {{else}}\
                            <div class="actionBtns dropdown" {{if myMsgItem.data.color}}style="color:${myMsgItem.data.color};text-transform: uppercase;border: 2px solid ${hexToRGBMeeting(myMsgItem.data.color)}"{{/if}}  style="vertical-align:middle;" >\
                            {{/if}}\
                            <i class="dropbtnWidgt" style="margin:0;margin-top: 0px;top: unset;" onclick="showDropdown(this)">More</i>\
                            <ul  class="dropdown-contentWidgt  rmpmW" style="list-style:none;">\
                            {{each(key, actionbtn) myMsgItem.actions}} \
                            {{if key >= 2}}\
                            {{if actionbtn.type === "postback"}}\
                                    <li {{if myMsgItem.data.color}}style="color: ${myMsgItem.data.color};text-transform: uppercase;"{{/if}}  class="dropdown-item" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(myMsgItem)}" onclick="passMeetingUtterances(this)">"${actionbtn.title}"</li>\
                                    {{else}}\
                                    <li {{if myMsgItem.data.color}}style="color: ${myMsgItem.data.color};text-transform: uppercase;"{{/if}}  class="dropdown-item" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(myMsgItem)}" onclick="passMeetingUtterances(this)">${actionbtn.title}</li>\
                                {{/if}}\
                            {{/if}}\
                          {{/each}}\
                        </ul>\
                            </div> \
                            {{/if}}\
                      </div>\
                      </div>\
                    </div>\
                  </div>\
              {{/each}}\
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.elements.length > 3 && panelDetail.viewmore}} \
                  <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
              {{/if}}\
              {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
            </div>\
          </div>  \
      </scipt>';

      var tasksTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="allTaskCntr"   payload="{{if tempdata && tempdata.buttons && tempdata.buttons.length && tempdata.buttons[0].api}}${tempdata.buttons[0].api}{{/if}}">\
              {{each(key, msgItem) tempdata.elements}} \
                  {{if panelDetail.viewmore}}\
                      {{if key<= 2}}\
                          <div class="viewTask{{if msgItem.data.status === "Close"}} closeTask{{/if}}" id="${msgItem.id}">\
                              {{if panelDetail.showAll}}\
                                  <div class="viewTaskLft">\
                                      <div class="roundCheckbox">\
                                          <input {{if msgItem.data.status === "Close"}}disabled="disabled"{{/if}} class="taskSel" type="checkbox" id="task_${msgItem.id}" onclick="taskkAction(\'${msgItem.id}\',\'${msgItem.title}\',this)" {{if taskCheckbox(msgItem.id)}}checked{{/if}} />\
                                          <label for="task_${msgItem.id}"></label>\
                                      </div>\
                                  </div>\
                              {{/if}}\
                              <div class="viewTaskRgtt{{if msgItem.data.status === "Close"}} closeTask{{/if}}"   {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                                  <div class="title">${msgItem.title}\
                                      <i  class="icon-More dropbtnWidgt" onclick="showDropdown(this)"></i>\
                                      <ul  class="dropdown-contentWidgt  rmpmW" style="list-style:none;">\
                                          {{each(key, actionbtnli) msgItem.actions}} \
                                              {{if actionbtnli.type === "postback"}}\
                                                  <li class="dropdown-item" payload="${JSON.stringify(msgItem)}"   onclick="passTaskUtterances(this, ${key})">"${actionbtnli.title}"</li>\
                                              {{/if}}\
                                          {{/each}}\
                                      </ul>\
                                  </div> \
                                  {{if checkOverDue(msgItem.data.status, msgItem.data.dueDate)}}\
                                      <div class="taskDateCntr" style="color: #fc4a61"> \
                                          <i class="icon-Time icon16Gray"></i> <span>{{html helpers.getTimeline(msgItem.data.dueDate, "fulldate")}}, {{html helpers.getTimeline(msgItem.data.dueDate, "time")}}</span>\
                                      </div> \
                                  {{else}} \
                                      <div class="taskDateCntr"> \
                                          <i class="icon16Gray icon-Time"></i> <span>{{html helpers.getTimeline(msgItem.data.dueDate, "fulldate")}}, {{html helpers.getTimeline(msgItem.data.dueDate, "time")}}</span>\
                                      </div> \
                                  {{/if}}\
                                  <div class="userCntr"> \
                                      <i class="icon16Gray icon-Material-Person"></i>\
                                      {{if checkCurrentUser(msgItem.data.owner._id, msgItem.data.assignee._id)}}\
                                          <div style="display: inline-block">You</div>\
                                      {{else}}\
                                          {{html helpers.checkTaskUser(msgItem.data.owner.fN, msgItem.data.owner.lN, msgItem.data.owner._id)}}\
                                          <i style="margin: 0px 5px;" class="fa fa-caret-right" aria-hidden="true"></i>\
                                          {{html helpers.checkTaskUser(msgItem.data.assignee.fN, msgItem.data.assignee.lN, msgItem.data.assignee._id)}}\
                                      {{/if}}\
                                  </div>\
                              </div>\
                          </div>\
                      {{/if}}\
                  {{else}}\
                      <div class="viewTask{{if msgItem.data.status === "Close"}} closeTask{{/if}}" id="${msgItem.id}">\
                          {{if panelDetail.showAll}}\
                              <div class="viewTaskLft">\
                                  <div class="roundCheckbox">\
                                      <input {{if msgItem.data.status === "Close"}}disabled="disabled"{{/if}} class="taskSel" type="checkbox" id="task_${msgItem.id}" onclick="taskkAction(\'${msgItem.id}\',\'${msgItem.title}\',this)" {{if taskCheckbox(msgItem.id)}}checked{{/if}}/>\
                                      <label for="task_${msgItem.id}"></label>\
                                  </div>\
                              </div>\
                          {{/if}}\
                          <div class="viewTaskRgtt{{if msgItem.data.status === "Close"}} closeTask{{/if}}" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                              <div class="title">${msgItem.title}\
                                  <i  class="icon-More dropbtnWidgt" onclick="showDropdown(this)"></i>\
                                  <ul  class="dropdown-contentWidgt  rmpmW" style="list-style:none;">\
                                      {{each(key, actionbtnli) msgItem.actions}} \
                                          {{if actionbtnli.type === "postback"}}\
                                              <li class="dropdown-item" payload="${JSON.stringify(msgItem)}"   onclick="passTaskUtterances(this, ${key})">"${actionbtnli.title}"</li>\
                                          {{/if}}\
                                      {{/each}}\
                                  </ul>\
                              </div> \
                              {{if checkOverDue(msgItem.data.status, msgItem.data.dueDate)}}\
                                  <div class="taskDateCntr" style="color: #fc4a61"> \
                                      <i class="icon-Time icon16Gray"></i> <span>{{html helpers.getTimeline(msgItem.data.dueDate, "fulldate")}}, {{html helpers.getTimeline(msgItem.data.dueDate, "time")}}</span>\
                                  </div> \
                              {{else}} \
                                  <div class="taskDateCntr"> \
                                      <i class="icon16Gray icon-Time"></i> <span>{{html helpers.getTimeline(msgItem.data.dueDate, "fulldate")}}, {{html helpers.getTimeline(msgItem.data.dueDate, "time")}}</span>\
                                  </div> \
                              {{/if}}\
                              <div class="userCntr"> \
                                  <i class="icon16Gray icon-Material-Person"></i>\
                                  {{if checkCurrentUser(msgItem.data.owner._id, msgItem.data.assignee._id)}}\
                                      <div style="display: inline-block">You</div>\
                                  {{else}}\
                                      {{html helpers.checkTaskUser(msgItem.data.owner.fN, msgItem.data.owner.lN, msgItem.data.owner._id)}}\
                                      <i style="margin: 0px 5px;" class="fa fa-caret-right" aria-hidden="true"></i>\
                                      {{html helpers.checkTaskUser(msgItem.data.assignee.fN, msgItem.data.assignee.lN, msgItem.data.assignee._id)}}\
                                  {{/if}}\
                              </div>\
                          </div>\
                      </div>\
                  {{/if}}\
              {{/each}} \
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.elements.length > 3 && panelDetail.viewmore}} \
                  <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
              {{/if}}\
              {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
          </div>\
      </script>';
      var filesTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="filesCntr" >\
              {{each(key, msgItem) tempdata.elements}} \
                  {{if panelDetail.viewmore}}\
                      {{if key<= 2}}\
                          <div class="carosalItem" onclick="openLink(\'${msgItem.default_action.url}\')">\
                              <div class="carpadding">\
                                  <div class="lftCntr">\
                                      <div class="fileCntr">{{html helpers.getFileIcon(msgItem.data.ext)}}</div>\
                                  </div>\
                                  <div class="rgtCntr" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                                      <div class="fileName">${msgItem.title}</div>\
                                      {{if msgItem.sharedBy}}<div class="sharedBy">Shared by  ${msgItem.owners[0].displayName }</div>{{/if}}\
                                      <div class="lastModified">Last Edited ${helpers.getTimeline(msgItem.data.modifiedTime, "fulldate")}, ${helpers.getTimeline(msgItem.data.modifiedTime, "fullyear")}</div>\
                                  </div>\
                              </div>\
                          </div>\
                      {{/if}}\
                  {{else}}\
                      <div class="carosalItem" onclick="openLink(\'${msgItem.default_action.url}\')">\
                          <div class="carpadding">\
                              <div class="lftCntr">\
                                  <div class="fileCntr">{{html helpers.getFileIcon(msgItem.data.ext)}}</div>\
                              </div>\
                              <div class="rgtCntr" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                                  <div class="fileName">${msgItem.title}</div>\
                                  {{if msgItem.sharedBy}}<div class="sharedBy">Shared by  ${msgItem.owners[0].displayName }</div>{{/if}}\
                                  <div class="lastModified">Last Edited ${helpers.getTimeline(msgItem.data.modifiedTime, "fulldate")}, ${helpers.getTimeline(msgItem.data.modifiedTime, "fullyear")}</div>\
                              </div>\
                          </div>\
                      </div>\
                  {{/if}}\
              {{/each}} \
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.elements.length > 3 && panelDetail.viewmore}} \
                  <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
              {{/if}}\
              {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
          </div>\
      </script>';
      var defaultFilesTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="filesCntr" >\
              {{each(key, msgItem) tempdata.elements}} \
                  {{if panelDetail.viewmore}}\
                      {{if key<= 2}}\
                          <div class="carosalItem" style="margin: 0px 5px 0px 5px;width: 97%;border-bottom: 1px solid var(--sdk-primary-border-color);" {{if msgItem.default_action}}onclick="openLink(\'${msgItem.default_action.url}\')" {{/if}}>\
                              <div class="carpadding">\
                                  <div class="lftCntr" style="padding-top: 5px;">\
                                      {{if msgItem.icon}}<div class="fileCntr"><img class="common" style="height: 60px; width: 60px;border-radius: 30px;" src="${msgItem.icon}"></img></div>{{/if}}\
                                  </div>\
                                  <div class="rgtCntr" style="min-height: 50px;border-bottom: 0px;padding-top: 10px; padding-bottom: 0px;width: calc(100% - 75px);" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                                      <div class="fileName" style="font-weight: 600;padding-right: 23px;">${msgItem.title}\
                                      {{if msgItem.actions}}<i  class="icon-More dropbtnWidgt"  style="margin:0;margin-top: 0px; top: unset;" onclick="showDropdown(this)"></i>\
                                      <ul  class="dropdown-contentWidgt  rmpmW" style="list-style:none;">\
                                          {{each(key1, actionbtnli) msgItem.actions}} \
                                              {{if actionbtnli.type === "postback"}}\
                                                  <li class="dropdown-item" actionObj="${JSON.stringify(actionbtnli)}" mainObj="${JSON.stringify(msgItem)}" onclick="passUtterances(\'\',\'${actionbtnli.payload}\',event)">"${actionbtnli.title}"</li>\
                                              {{else}}\
                                                  <li class="dropdown-item" actionObj="${JSON.stringify(actionbtnli)}" mainObj="${JSON.stringify(msgItem)}"  onclick="passUtterances(\'url\',\'${actionbtnli.url}\',event)">${actionbtnli.title}</li>\
                                              {{/if}}\
                                          {{/each}}\
                                      </ul>{{/if}}</div>\
                                      {{if msgItem.sub_title}}<div class="lastModified" style="font-size: 13px;">${msgItem.sub_title}</div>{{/if}}\
                                      {{if msgItem.text}}<div class="lastModified">${msgItem.text}</div>{{/if}}\
                                      {{if msgItem.modifiedTime}}<div class="lastModified">${msgItem.modifiedTime}</div>{{/if}}\
                                      {{if msgItem.button}}\
                                      {{each(key, actionbtn) msgItem.button}} \
                                          {{if actionbtn.type === "url"}}\
                                          <button class="btn actionBtns" style="background: none;border: 2px solid ${actionbtn.theme}; color: ${actionbtn.theme};" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(msgItem)}" onclick="passUtterances(\'url\',\'${actionbtn.title}\',event)">\
                                              ${actionbtn.title}\
                                          </button>\
                                      {{/if}}\
                                      {{if actionbtn.type === "postback"}}\
                                          <button class="btn actionBtns" style="background: none;border: 2px solid ${actionbtn.theme}; color: ${actionbtn.theme};" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(msgItem)}" onclick="passUtterances(\'\',\'${actionbtn.payload}\',event)">\
                                              ${actionbtn.title}\
                                          </button>\
                                      {{/if}}\
                                      {{/each}}\
                                      {{/if}}\
                                  </div>\
                              </div>\
                          </div>\
                      {{/if}}\
                  {{else}}\
                      <div class="carosalItem" style="margin: 0px 5px 0px 5px;width: 97%;border-bottom: 1px solid var(--sdk-primary-border-color);" {{if msgItem.default_action}} onclick="openLink(\'${msgItem.default_action.url}\')" {{/if}}>\
                          <div class="carpadding">\
                              <div class="lftCntr" style="padding-top: 5px;">\
                              {{if msgItem.icon}}<div class="fileCntr"><img class="common" style="height: 60px; width: 60px;border-radius: 30px;" src="${msgItem.icon}"></img></div>{{/if}}\
                              </div>\
                              <div class="rgtCntr" style="min-height: 50px;border-bottom: 0px;padding-top: 10px; padding-bottom: 0px;width: calc(100% - 75px);" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                                  <div class="fileName" style="font-weight: 600;padding-right: 23px;">${msgItem.title}\
                                  {{if msgItem.actions}}<i  class="icon-More dropbtnWidgt" style="margin:0;margin-top: 0px; top: unset;" onclick="showDropdown(this)"></i>\
                                  <ul  class="dropdown-contentWidgt  rmpmW" style="list-style:none;">\
                                      {{each(key1, actionbtnli) msgItem.actions}} \
                                          {{if actionbtnli.type === "postback"}}\
                                              <li class="dropdown-item" actionObj="${JSON.stringify(actionbtnli)}" mainObj="${JSON.stringify(msgItem)}" onclick="passUtterances(\'\',\'${actionbtnli.payload}\',event)">"${actionbtnli.title}"</li>\
                                          {{else}}\
                                              <li class="dropdown-item" actionObj="${JSON.stringify(actionbtnli)}" mainObj="${JSON.stringify(msgItem)}"  onclick="passUtterances(\'url\',\'${actionbtnli.url}\',event)">${actionbtnli.title}</li>\
                                          {{/if}}\
                                      {{/each}}\
                                  </ul>{{/if}}</div>\
                                  {{if msgItem.sub_title}}<div class="lastModified" style="font-size: 13px;">${msgItem.sub_title}</div>{{/if}}\
                                  {{if msgItem.text}}<div class="lastModified">${msgItem.text}</div>{{/if}}\
                                  {{if msgItem.modifiedTime}}<div class="lastModified">${msgItem.modifiedTime}</div>{{/if}}\
                                  {{if msgItem.button}}\
                                  {{each(key, actionbtn) msgItem.button}} \
                                      {{if actionbtn.type === "url"}}\
                                      <button class="btn actionBtns" style="background: none;border: 2px solid ${actionbtn.theme}; color: ${actionbtn.theme};" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(msgItem)}"  onclick="passUtterances(\'url\',\'${actionbtn.url}\',event)">\
                                          ${actionbtn.title}\
                                      </button>\
                                     {{/if}}\
                                     {{if actionbtn.type === "postback"}}\
                                      <button class="btn actionBtns" style="background: none;border: 2px solid ${actionbtn.theme}; color: ${actionbtn.theme};" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(msgItem)}"  onclick="passUtterances(\'\',\'${actionbtn.payload}\',event)">\
                                          ${actionbtn.title}\
                                      </button>\
                                     {{/if}}\
                                  {{/each}}\
                                  {{/if}}\
                              </div>\
                          </div>\
                      </div>\
                  {{/if}}\
              {{/each}} \
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.elements.length > 3 && panelDetail.viewmore}} \
                  <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
              {{/if}}\
              {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
          </div>\
      </script>';
      var knowledgeTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
      <div class="knowledgeCntr"  >\
          {{each(key, msgItem) tempdata.elements}} \
              {{if panelDetail.viewmore}}\
                  {{if key<= 2 }}\
                      <div class="carosalItem" id="${msgItem.id}" onclick="openArticle(\'${msgItem.id}\')">\
                          <div class="carosalCntr">\
                              <div class="lftCntr" style="width:{{if msgItem.imageUrl && msgItem.imageUrl != null}} calc(100% - 90px) {{else}} 100%{{/if}};">\
                                  <div class="title">${msgItem.title}</div>\
                                  <div class="lastModified">Modified ${helpers.getTimeline(new Date(msgItem.lastMod), "fulldate")} at ${helpers.getTimeline(new Date(parseInt(msgItem.lastMod)), "time")}</div>\
                                  <div class="subtitle" style="-webkit-box-orient: vertical;">${msgItem.desc}</div>\
                              </div>\
                              {{if msgItem.imageUrl && msgItem.imageUrl != null}}\
                                  <div class="rgtCntr">\
                                      <img src="${msgItem.imageUrl}" class="knwImg">\
                                  </div>\
                              {{/if}}\
                              <div class="actionCntr">\
                                  <div class="viewsCntr">\
                                      <i class="iconConfig icon-Material-Eye"></i>\
                                      <span class="actionItemCount">${msgItem.nViews}</span>\
                                  </div>\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="commentCntr">\
                                          <i class="iconConfig icon-iOS---Comment"></i>\
                                          <span class="actionItemCount">${msgItem.nComments}</span>\
                                      </div>\
                                  {{/if}}\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="votesupCntr">\
                                          <i class="iconConfig icon-Like-Yes-Material-Filled"></i>\
                                          <span class="actionItemCount">{{if msgItem.nUpVotes}}${msgItem.nUpVotes}{{else}}0{{/if}}</span>\
                                      </div>\
                                  {{/if}}\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="votesdownCntr">\
                                          <i class="iconConfig icon-Dislike-Material"></i>\
                                          <span class="actionItemCount">{{if msgItem.nDownVotes}}${msgItem.nDownVotes}{{else}}0{{/if}}</span>\
                                      </div>\
                                  {{/if}}\
                              </div>\
                          </div>\
                      </div>\
                  {{/if}}\
                  {{else}}\
                      <div class="carosalItem" id="${msgItem.id}" onclick="openArticle(\'${msgItem.id}\')">\
                          <div class="carosalCntr" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                              <div class="lftCntr" style="width:{{if msgItem.imageUrl && msgItem.imageUrl != null}} calc(100% - 90px) {{else}} 100%{{/if}};">\
                                  <div class="title">${msgItem.title}</div>\
                                  <div class="lastModified">Modified ${helpers.getTimeline(new Date(msgItem.lastMod), "fulldate")} at ${helpers.getTimeline(new Date(parseInt(msgItem.lastMod)), "time")}</div>\
                                  <div class="subtitle" style="-webkit-box-orient: vertical;">${msgItem.desc}</div>\
                              </div>\
                              {{if msgItem.imageUrl && msgItem.imageUrl != null}}\
                                  <div class="rgtCntr">\
                                      <img src="${msgItem.imageUrl}" class="knwImg">\
                                  </div>\
                              {{/if}}\
                              <div class="actionCntr">\
                                  <div class="viewsCntr">\
                                      <i class="iconConfig icon-Material-Eye"></i>\
                                      <span class="actionItemCount">${msgItem.nViews}</span>\
                                  </div>\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="commentCntr">\
                                          <i class="iconConfig icon-iOS---Comment"></i>\
                                          <span class="actionItemCount">${msgItem.nComments}</span>\
                                      </div>\
                                  {{/if}}\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="votesupCntr">\
                                          <i class="iconConfig icon-Like-Yes-Material-Filled"></i>\
                                          <span class="actionItemCount">{{if msgItem.nUpVotes}}${msgItem.nUpVotes}{{else}}0{{/if}}</span>\
                                      </div>\
                                  {{/if}}\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="votesdownCntr">\
                                          <i class="iconConfig icon-Dislike-Material"></i>\
                                          <span class="actionItemCount">{{if msgItem.nDownVotes}}${msgItem.nDownVotes}{{else}}0{{/if}}</span>\
                                      </div>\
                                  {{/if}}\
                              </div>\
                          </div>\
                      </div>\
                  {{/if}}\
          {{/each}}\
          <div style="clear:both"></div>\
          {{if tempdata && tempdata.elements && tempdata.elements.length > 3 && panelDetail.viewmore}} \
              <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
          {{/if}}\
          {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
              <div class="noContent">\
                  <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                  <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
              </div>\
          {{/if}}\
          </div>\
      </scipt>';
      var announcementTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="announcementCntr" >\
              {{each(key, msgItem) tempdata.elements}} \
                  {{if panelDetail.viewmore}}\
                      {{if key<= 2 }}\
                          <div class="carosalItemAnnc" id="${msgItem.id}" onclick="openAnnouncement(\'${msgItem.id}\')">\
                              <div class="carosalCntr" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                                  <div class="lftIconCntr"><div class="icon" style="background: ${msgItem.owner.color}">\
                                      <div class="icon" style="background: ${msgItem.owner.color}">\
                                          {{if msgItem && msgItem.owner.fN}}${msgItem.owner.fN[0]}{{/if}}{{if msgItem && msgItem.owner.lN}}${msgItem.owner.lN[0]}{{/if}}\
                                      </div>\
                                  </div>\
                              </div>\
                              <div class="lftCntr lftCntrAnnnc" style="width:{{if msgItem.imageUrl && msgItem.imageUrl != null}} calc(100% - 50px) {{else}} calc(100% - 36px) {{/if}};">\
                                  <div class="title titleAnnc">${msgItem.owner.fN} ${msgItem.owner.lN} <span class="lastModifiedAnnc pull-right">${helpers.getTimeLineNotification(msgItem.sharedOn)}</span></div>\
                                  <div class="col-12 rmpm sharedList" style="-webkit-box-orient: vertical;"> \
                                      {{each(index, list) msgItem.sharedList}}\
                                          {{if index == 0}}\
                                              <span>${list.name} </span> \
                                          {{/if}}\
                                          {{if index > 0}}\
                                              <span> , ${list.name} </span>\
                                          {{/if}}\
                                      {{/each}}\
                                  </div>\
                                  <div class="col-12 rmpm infoTitleA_NL" style="-webkit-box-orient: vertical;padding-bottom:3px;"> ${msgItem.title} </div>\
                                  <div class="subtitle" style="-webkit-box-orient: vertical;">${msgItem.subtitle}</div>\
                              </div>\
                              {{if msgItem.imageUrl && msgItem.imageUrl != null}}\
                                  <div class="rgtCntr">\
                                      <img src="${msgItem.imageUrl}" class="knwImg">\
                                  </div>\
                              {{/if}}\
                              <div class="actionCntr actionCntrAnnc">\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="commentCntr">\
                                          <i class="commentIcon icon-iOS---Comment"></i>\
                                          <span class="commentCount">${msgItem.nComments}</span>\
                                      </div>\
                                  {{/if}}\
                                  {{if msgItem.nShares && msgItem.nShares > 0}}\
                                      <div class="votesupCntr1">\
                                          <i class="votesupIcon icon-Like-Yes-Material-Filled"></i>\
                                          <span class="commentCount">{{if msgItem.nUpVotes}}${msgItem.nUpVotes}{{else}}0{{/if}}</span>\
                                      </div>\
                                  {{/if}}\
                              </div>\
                          </div>\
                      {{/if}}\
                      {{else}}\
                          <div class="carosalItem" id="${msgItem.id}"  onclick="openAnnouncement(\'${msgItem.id}\')">\
                              <div class="carosalCntr" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                                  <div class="lftIconCntr">\
                                      <div class="icon" style="background: ${msgItem.owner.color}">\
                                          {{if msgItem && msgItem.owner.fN}}${msgItem.owner.fN[0]}{{/if}}{{if msgItem && msgItem.owner.lN}}${msgItem.owner.lN[0]}{{/if}}\
                                      </div>\
                                  </div>\
                                  <div class="lftCntr" style="width:{{if msgItem.imageUrl && msgItem.imageUrl != null}} calc(100% - 50px) {{else}} calc(100% - 36px) {{/if}};">\
                                      <div class="title titleAnnc">${msgItem.owner.fN} ${msgItem.owner.lN} <span class="lastModifiedAnnc pull-right">${helpers.getTimeLineNotification(msgItem.sharedOn)}</span></div>\
                                      <div class="col-12 rmpm sharedList" style="-webkit-box-orient: vertical;"> \
                                          {{each(index, list) msgItem.sharedList}}\
                                              {{if index == 0}}\
                                                  <span>${list.name} </span> \
                                              {{/if}}\
                                              {{if index > 0}}\
                                                  <span> , ${list.name} </span>\
                                              {{/if}}\
                                          {{/each}}\
                                      </div>\
                                      <div class="col-12 rmpm infoTitleA_NL" style="-webkit-box-orient: vertical;padding-bottom:3px;"> ${msgItem.title} </div>\
                                      <div class="subtitle" style="-webkit-box-orient: vertical;">${msgItem.desc}</div>\
                                  </div>\
                                  <div class="actionCntr">\
                                      {{if msgItem.nShares && msgItem.nShares > 0}}\
                                          <div class="commentCntr">\
                                              <i class="iconConfig icon-iOS---Comment"></i>\
                                              <span class="actionItemCount">${msgItem.nComments}</span>\
                                          </div>\
                                      {{/if}}\
                                      {{if msgItem.nShares && msgItem.nShares > 0}}\
                                          <div class="votesupCntr">\
                                              <i class="iconConfig icon-Like-Yes-Material-Filled"></i>\
                                              <span class="actionItemCount">{{if msgItem.nUpVotes}}${msgItem.nUpVotes}{{else}}0{{/if}}</span>\
                                          </div>\
                                      {{/if}}\
                                  </div>\
                              </div>\
                          </div>\
                      {{/if}}\
              {{/each}}\
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.elements.length > 3 && panelDetail.viewmore}} \
                  <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
              {{/if}}\
              {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
          </div>\
      </scipt>';
      var hashtagTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="trendingHashtagCntr"  >\
              {{each(key, msgItem) tempdata.elements}} \
                  {{if panelDetail.viewmore}}\
                      {{if key<= 2 }}\
                          <div class="carosalItemHash" onclick="passHashTag(\'${msgItem.title}\')" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                              <span>${msgItem.title}</span>\
                              <span class="hashCount">${msgItem.title_right}</span>\
                          </div>\
                      {{/if}}\
                  {{else}}\
                      <div class="carosalItemHash" onclick="passHashTag(\'${msgItem.title}\')" {{if key === tempdata.elements.length - 1}}style="border-bottom:0"{{/if}}>\
                          <span>${msgItem.title}</span>\
                          <span class="hashCount">${msgItem.title_right}</span>\
                      </div>\
                  {{/if}}\
              {{/each}}\
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.elements.length > 2 && panelDetail.viewmore}} \
                  <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
              {{/if}}\
              {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
          </div>\
      </scipt>';
      var skillsTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="skillsCntr"  >\
              {{each(key, msgItem) tempdata.actions}} \
                  {{if panelDetail.viewmore}}\
                      {{if key<= 2 }}\
                          <div class="carosalItemHash" onclick="passUtterances(\'${msgItem.id}\',\'${payload}\')">\
                              <span title="${msgItem.title}">${msgItem.title}</span>\
                          </div>\
                      {{/if}}\
                  {{else}}\
                      <div class="carosalItemHash" onclick="passUtterances(\'${msgItem.id}\',\'${payload}\')">\
                          <span title="${msgItem.title}">${msgItem.title}</span>\
                      </div>\
                  {{/if}}\
              {{/each}}\
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.actions.length > 3 && panelDetail.viewmore}} \
                  <div class="viewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">View more <i class="moreArrow icon-Disclose1"></i></div>\
              {{/if}}\
              {{if tempdata && tempdata.elements && tempdata.actions.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
          </div>\
      </scipt>';
      var chartListTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="" style="margin-top: 11px;">\
              {{each(key, msgItem) tempdata.elements}} \
              <div style="position: relative; max-width: 25%; max-height: 25%; width: calc(100%/${tempdata.elements.length} - 5px);height: calc(100%/${tempdata.elements.length} - 5px);\
                  float : left; margin: 2px;">\
                  <div class="" style="border-radius: 100%; border: 1px solid #ddd; \
                      width: 100%;height: 100%;\
                      padding-bottom: 100%; background: ${msgItem.theme} ">\
                  </div>\
                  <div class="" style="text-align: center;font-weight: 600; word-break: break-word;">${msgItem.title}</div>\
                  <div class="" style="position: absolute;top:16%; color: #fff; margin-left: calc(125px/${tempdata.elements.length}); left: calc(key *100%/${tempdata.elements.length} + 5%)">${msgItem.text}</div>\
              </div>\
              {{/each}}\
              <div style="clear:both"></div>\
              {{if tempdata && tempdata.elements && tempdata.elements.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="/assets/images/widget/nodata.svg" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">${tempdata.placeholder}</div>\
                  </div>\
              {{/if}}\
          </div>\
      </scipt>';
      var popUpTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="popupPreview" id="preview_${tempdata[0].id}"></div>\
          <div class="defaultPopupCntr" id="popup_${tempdata[0].id}">\
              <div class="popupContentCntr">\
                  {{if tempdata[0] && tempdata[0].title}} <div class="title">${tempdata[0].title}</div>{{/if}}\
                  {{if tempdata[0] && tempdata[0].desc}} <div class="desc">${tempdata[0].desc}</div>{{/if}}\
                  {{if tempdata[0] && tempdata[0].buttons && tempdata[0].buttons.length}}\
                      <div class="btnCntr">\
                          {{each(key, msgItem) tempdata[0].buttons}} \
                              <button class="btn" actionObj="${actionObj}" mainObj="${mainObj}" onclick="popupAction(\'${JSON.stringify(tempdata)}\',\'${msgItem.title}\', this)">\
                                  ${msgItem.title}\
                              </button>\
                          {{/each}}\
                      </div>\
                  {{/if}}\
              </div>\
          </div>\
      </scipt>';
      var defaultTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="defaultTemplateCntr">\
              Panel need to define\
          </div>\
      </scipt>';
      var errorTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
          <div class="errorTemplateCntr">\
              <div class="imgCntr"> <img class="img img-fluid" src="assets/images/widget/widgetError.png"></div>\
              <div class="oopsErrorText">Oops!! Something went wrong!</div>\
          </div>\
      </scipt>';
      var ErrorTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                            <div class="errorTemplateCntr {{if tempdata && !tempdata.templateType}}notFound{{/if}} {{if tempdata && tempdata.templateType}}${tempdata.templateType}{{/if}}">\
                                <div class="imgCntr"></div>\
                                {{if tempdata && tempdata.templateType && !tempdata.elements}}\
                                    {{if tempdata.errMsg}}\
                                      <div class="oopsErrorTitle">${tempdata.errMsg}</div>\
                                    {{else}}\
                                      <div class="oopsErrorTitle">No Data Available</div>\
                                    {{/if}}\
                                    {{if false && tempdata.errMsgDiscription}}\
                                      <div class="oopsErrorDesc">Looks like there is no data availble to show it to you.</div>\
                                    {{/if}}\
                                {{else}}\
                                     <div class="oopsErrorTitle">Page not found</div>\
                                {{/if}}\
                                <div class="oopsErrorBtns">\
                                    <button class="buttonSolid" onclick="refreshElement(\'${JSON.stringify(panelDetail)}\')" id="refreshData" {{if panelDetail}}panelDetail="${JSON.stringify(panelDetail)}"{{/if}}>Refresh</button>\
                                </div>\
                            </div>\
                          </scipt>';
      var AuthRequired = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                            <div class="errorTemplateCntr authRequired">\
                                <div class="imgCntr"></div>\
                                <div class="oopsErrorTitle">Authorization Needed!</div>\
                                <div class="oopsErrorBtns">\
                                    <button class="buttonSolid action" {{if tempdata && tempdata.elements && tempdata.elements.length && tempdata.elements[0].defaultAction}}actionObj="${JSON.stringify(tempdata.elements[0].defaultAction)}"{{/if}} {{if panelDetail}}panelDetail="${JSON.stringify(panelDetail)}"{{/if}}>Login</button>\
                                </div>\
                            </div>\
                          </scipt>';
      var filterTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
        <div class="filterTemplateCntr">\
            <div class="wiz-filters">\
            <div class="wix-filter-header">Filters<span class="wid-filter-close"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAANlJREFUKBWdkkEKwjAQRWdSqBfwHDmEPYTgBVwXvIWCO8GlG6GHaA/hObxAC3Xan5AmrUkFZ1OY+S//Txo+3x6a6HPlbLM/HQ9vWqnL/bmVvq2IVKkAidBO+q7GIMVZqKuhBaPgxMwvEdEp2EOioTUMHL4HeeFip2bsosUEmCEF0lgnf+AEQrSEDRiB0J+BaISwEZidvBN6qPFW/6uZY+iGnXBkbD/0J3AJcZYXBly7nBj083esQXBExTQKby+1h8WI4I7o/oW11XirqmSmBgMXzwHh18PUgBkAXhfn47Oroz4AAAAASUVORK5CYII=" class="closeCross"></span></div>\
              {{each(index,filter) filterOptions}} \
                  {{if filter && filter.type==="enum"}}\
                      <div class="wiz-filter">\
                            <div class="title">${filter.title}</div>\
                            <div class="open-filters" id="${filter.field}">\
                                  <div class="filterInputTags">\
                                          {{if filter && filter.selected}} \
                                                {{each(index,selectItem) filter.data}} \
                                                        {{if selectItem && selectItem.isSelect}} \
                                                        <span field="${selectItem.title}" value="${selectItem.fieldValue}" >${selectItem.title}</span>\
                                                        {{/if}}\
                                                {{/each}}\
                                          {{/if}}\
                                          {{if filter && !filter.isSelect}} \
                                                <span>${"Select "+filter.title}</span>\
                                          {{/if}}\
                                  </div>\
                            </div>\
                      </div>\
                  {{/if}}\
                  {{if (filter && filter.type==="radio")}}\
                    <div class="wiz-filter {{if filter.view==="horizontal"}}horizontalView{{/if}}">\
                        <div class="title">${filter.title}</div>\
                        <div class="open-radiofilters">\
                            <div class="radiodivsdk" filter-type="radioFilter" filter-index="${index}">\
                                {{each(index,filterItem) filter.data}} \
                                    <label for="filterRadioHoriz_${filterItem.title}" class="radioItemContainer" field="${filterItem.field}">\
                                        <span>${filterItem.title}<span>\
                                          <input field="${filterItem.field}" {{if filterItem.isSelect}}checked{{/if}} name="radioFilterVertical" value-index="${index}" class="taskSelRadio" type="radio" value="${filterItem.isSelect}" id="filterRadioHoriz_${filterItem.title}"/>\
                                        <span class="checkmark"><span>\
                                    </label>\
                                {{/each}}\
                            </div>\
                        </div>\
                    </div>\
                 {{/if}}\
                 {{if  (filter && filter.type==="checkbox")}}\
                 <div class="wiz-filter {{if filter.view==="horizontal"}}horizontalView{{/if}}">\
                    <div class="title">${filter.title}</div>\
                    <div class="radiodivsdk" filter-type="checkBoxFilter" filter-index="${index}">\
                        {{each(index,filterItem) filter.data}} \
                            <label for="filterCheckHorixontal_${filterItem.value}" class="container checkContainer">\
                                <span>${filterItem.title}<span>\
                                <input filed="${filterItem.title}" {{if filterItem.isSelect}}checked{{/if}} name="${filterItem.title}" element="filterCheckbox" value-index="${index}"  class="taskSelRadio" type="checkbox" value="${filterItem.value}" id="filterCheckHorixontal_${filterItem.value}"/>\
                                <span class="checkmark"><span>\
                            </label>\
                        {{/each}}\
                    </div>\
                 </div>\
              {{/if}}\
              {{/each}}\
            </div>\
            <div class="action-bar">\
              <button class="btn apply-btn">Apply</button>\
            </div>\
        </div>\
     </scipt>';
      var filterOptionsTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  <div class="filterOptionsTemplateCtrl">\
                      <div class="sortBy">\
                            <div class="wix-filter-header">${"Select  "+ filterSelectedItems.title}<span class="wid-filter-close"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAANlJREFUKBWdkkEKwjAQRWdSqBfwHDmEPYTgBVwXvIWCO8GlG6GHaA/hObxAC3Xan5AmrUkFZ1OY+S//Txo+3x6a6HPlbLM/HQ9vWqnL/bmVvq2IVKkAidBO+q7GIMVZqKuhBaPgxMwvEdEp2EOioTUMHL4HeeFip2bsosUEmCEF0lgnf+AEQrSEDRiB0J+BaISwEZidvBN6qPFW/6uZY+iGnXBkbD/0J3AJcZYXBly7nBj083esQXBExTQKby+1h8WI4I7o/oW11XirqmSmBgMXzwHh18PUgBkAXhfn47Oroz4AAAAASUVORK5CYII=" class="closeCross"></span></div>\
                            {{if filterSelectedItems.isMulti === "Yes"}}\
                            <div class="radiodivsdk">\
                                {{each(index,filterItem) filterSelectedItems.data}} \
                                    <label for="filter_${filterItem.value}" class="container checkContainer">\
                                        <span>${filterItem.title}<span>\
                                        <input filed="${filterItem.title}" {{if filterItem.isSelect}}checked{{/if}} name="${filterItem.title}" class="taskSelRadio" type="checkbox" value="${filterItem.value}" id="filter_${filterItem.value}"/>\
                                        <span class="checkmark"><span>\
                                    </label>\
                                {{/each}}\
                            </div>\
                            {{else}}\
                            <div class="radiodivsdk" >\
                              {{each(index,filterItem) filterSelectedItems.data}} \
                              <div class="tickMarkContainer {{if filterItem.isSelect}}selected{{/if}}" field="${filterItem.title}">\
                                <span class="selectDropValue" valueObj="${JSON.stringify(filterItem)}">${filterItem.title}</span>\
                                <span class="selectedFilterTick "></span>\
                              </div>\
                              {{/each}}\
                            </div>\
                            {{/if}}\
                      </div>\
                      <div class="action-bar">\
                        <button class="btn apply-btn">Done</button>\
                      </div>\
                  </div>\
                </scipt>';
      var List = '<script id="chat-window-listTemplate" type="text/x-jqury-tmpl">\
                <div class="tab-list-template" mainObj="${JSON.stringify(tempdata)}" panelDetail="${JSON.stringify(panelDetail)}">\
                   {{if tempdata}} \
                    <div class="sheetHeader hide">\
                        <div class="headerLeft">\
                        {{if panelDetail && panelDetail.widgetTitle}}\
                           <span class="choose">${panelDetail.widgetTitle}</span>\
                           {{else}}\
                             <span class="choose">${tempdata.widgetName}</span>\
                        {{/if}}\
                        {{if tempdata.description}}\
                        <p class="listViewItemSubtitle">${tempdata.description}</p>\
                        {{/if}}\
                        </div>\
                        {{if tempdata && tempdata.headerOptions && tempdata.headerOptions.type==="button" && tempdata.headerOptions.button && tempdata.headerOptions.button.title}}\
                        <div class="headerRight">\
                            <div actionObj="${JSON.stringify(tempdata.headerOptions.button)}" class="headerActionBTN action">${tempdata.headerOptions.button.title}</div>\
                        </div>\
                        {{/if}}\
                        {{if (tempdata.headerOptions && tempdata.headerOptions.type === "url" && tempdata.headerOptions.url && tempdata.headerOptions.url.title)}}\
                          <div class="headerRight">\
                             <div actionObj="${JSON.stringify(tempdata.headerOptions.url)}" class="headerActionLink action">${tempdata.headerOptions.url.title}</div>\
                         </div>\
                        {{/if}}\
                        <div class="headerRight" style="display:none;">\
                          <div class="headerActionEllipsis">\
                          <i class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)"></i>\
                          <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                  <li class="dropdown-item action"> one</li>\
                                  <li class="dropdown-item action"> two</li>\
                          </ul>\
                          </div>\
                        </div>\
                     </div>\
                    <div class="listTemplateContainer">\
                    {{if tempdata.tabs && tabs.length}} \
                      <div class="tabsContainer">\
                         {{each(key, tab) tabs}} \
                         <span class="tabs" data-tabid="${tab}" ><span class="btnBG">${tab}</span></span>\
                         {{/each}}\
                      </div>\
                    {{/if}} \
                      <ul class="displayListValues">\
                       {{each(key, msgItem) dataItems}} \
                       {{if ((viewmore && (key<=2)) || (!viewmore))}}\
                         <li class="listViewTmplContentChild"> \
                          <div class="listViewTmplContentChildRow">\
                          {{if msgItem.image && msgItem.image.image_type === "image" && msgItem.image.image_src}} \
                                  <div class="listViewRightContent {{if msgItem.image.size}}${msgItem.image.size}{{/if}}" {{if msgItem.image.radius}}style="border-radius:$(msgItem.image.radius)"{{/if}}>\
                                      <img alt="image" src="${msgItem.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                  </div> \
                          {{/if}} \
                              <div class="listViewLeftContent {{if (!msgItem.value) || (msgItem.value && msgItem.value.type==="text" && !msgItem.value.text) || (msgItem.value && msgItem.value.type==="button" && !msgItem.value.button)}}fullWidthTitle{{/if}} {{if msgItem.default_action}}handCursor{{/if}}" {{if msgItem && msgItem.default_action}}actionObj="${JSON.stringify(msgItem.default_action)}"{{/if}} {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize && ((msgItem.value && msgItem.value.type === "text" && msgItem.value.text) || (msgItem.value && msgItem.value.type === "url" && msgItem.value.url && msgItem.value.url.title) || (msgItem.value && msgItem.value.type=="button" && msgItem.value.button && (msgItem.value.button.title || (msgItem.value.button.image && msgItem.value.button.image.image_src))) || (msgItem.value && msgItem.value.type=="menu" && msgItem.value.menu && msgItem.value.menu.length))}} col-size="${msgItem.value.layout.colSize}"{{/if}}> \
                                    <span class="titleDesc ">\
                                      <div class="listViewItemTitle">${msgItem.title}</div> \
                                      {{if msgItem.subtitle}}\
                                        <div class="listViewItemSubtitle">${msgItem.subtitle}</div>\
                                      {{/if}} \
                                    </span>\
                              </div>\
                              {{if (msgItem.value && msgItem.value.type === "text" && msgItem.value.text)}}\
                                <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                    <div class="listViewItemValue {{if !msgItem.subtitle}}top10{{/if}}">${msgItem.value.text}</div>\
                                </div>\
                              {{/if}}\
                              {{if (msgItem.value && msgItem.value.type === "image" && msgItem.value.image && msgItem.value.image.image_src)}}\
                                <div actionObj="${JSON.stringify(msgItem.value.image)}" class="titleActions imageValue action {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                    {{if msgItem.value.image && msgItem.value.image.image_type === "image" && msgItem.value.image.image_src}}\
                                        <span class="wid-temp-btnImage"> \
                                            <img alt="image" src="${msgItem.value.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                        </span> \
                                    {{/if}}\
                                </div>\
                              {{/if}}\
                              {{if (msgItem.value && msgItem.value.type === "url" && msgItem.value.url && msgItem.value.url.title)}}\
                                <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                    <div actionObj="${JSON.stringify(msgItem.value.url)}" class="listViewItemValue actionLink action {{if !msgItem.subtitle}}top10{{/if}}">${msgItem.value.url.title}</div>\
                                </div>\
                              {{/if}}\
                              {{if msgItem.value && msgItem.value.type=="button" && msgItem.value.button && (msgItem.value.button.title || (msgItem.value.button.image && msgItem.value.button.image.image_src))}}\
                                <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}}style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                    <div class="actionBtns action singleBTN {{if !msgItem.value.button.title && (msgItem.value.button.image && msgItem.value.button.image.image_src)}}padding5{{/if}}" actionObj="${JSON.stringify(msgItem.value.button)}">\
                                        {{if msgItem.value.button.image && msgItem.value.button.image.image_type === "image" && msgItem.value.button.image.image_src}}\
                                                <span class="wid-temp-btnImage"> \
                                                    <img alt="image" src="${msgItem.value.button.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                </span> \
                                        {{/if}}\
                                        {{if msgItem.value.button.title}}\
                                        ${msgItem.value.button.title}\
                                        {{/if}}\
                                    </div>\
                                </div>\
                              {{/if}}\
                              {{if msgItem.value && msgItem.value.type=="menu" && msgItem.value.menu && msgItem.value.menu.length}}\
                              <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}}style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                  <i class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)"></i>\
                                      <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                        {{each(key, actionbtnli) msgItem.value.menu}} \
                                              <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                            <i>\
                                            {{if actionbtnli.image && actionbtnli.image.image_type === "image" && msgItem.image.image_src}}\
                                            <span class="wid-temp-btnImage"> \
                                                <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                            </span> \
                                            {{/if}} \
                                            </i>${actionbtnli.title}</li>\
                                        {{/each}}\
                                      </ul>\
                              </div>\
                              {{/if}}\
                            </div>\
                          {{if msgItem.details && msgItem.details.length}} \
                          <div class="tabListViewDiscription">\
                            {{each(key, content) msgItem.details}} \
                              {{if key < 3 }}\
                                 <div class="wid-temp-contentDiv">\
                                   {{if content.image && content.image.image_type === "image" && content.image.image_src}} \
                                      <span class="wid-temp-discImage"> \
                                          <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                      </span> \
                                   {{/if}} \
                                   {{if content.description}} \
                                     <span class="wid-temp-discription">${content.description}</span>\
                                   {{/if}} \
                                   {{if ((key===2) || ((msgItem.details.length < 3) && (key===msgItem.details.length-1))) && (msgItem.buttons && msgItem.buttons.length)}} \
                                   <span class="wid-temp-showActions">\
                                    </span>\
                                   {{/if}} \
                                 </div>\
                              {{/if}}\
                            {{/each}}\
                            {{if msgItem.details.length > 3}}\
                            <span class="wid-temp-showMore" id="showMoreContents">Show more <span class="show-more"></span></span>\
                            {{/if}}\
                          </div>\
                          <div class="wid-temp-showMoreBottom hide">\
                            <div class="showMoreContainer">\
                              <div class="headerTitleMore">MORE<span class="wid-temp-showMoreClose"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAANlJREFUKBWdkkEKwjAQRWdSqBfwHDmEPYTgBVwXvIWCO8GlG6GHaA/hObxAC3Xan5AmrUkFZ1OY+S//Txo+3x6a6HPlbLM/HQ9vWqnL/bmVvq2IVKkAidBO+q7GIMVZqKuhBaPgxMwvEdEp2EOioTUMHL4HeeFip2bsosUEmCEF0lgnf+AEQrSEDRiB0J+BaISwEZidvBN6qPFW/6uZY+iGnXBkbD/0J3AJcZYXBly7nBj083esQXBExTQKby+1h8WI4I7o/oW11XirqmSmBgMXzwHh18PUgBkAXhfn47Oroz4AAAAASUVORK5CYII=" class="closeCross"></span></div>\
                              <div class="moreItemsScroll">\
                                {{each(key, content) msgItem.details}} \
                                    <div class="wid-temp-contentDiv">\
                                      {{if content.image && content.image.image_type === "image" && content.image.image_src}}\
                                            <span class="wid-temp-discImage"> \
                                                <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                            </span> \
                                      {{/if}} \
                                      {{if content.description}} \
                                          <span class="wid-temp-discription">${content.description}</span>\
                                      {{/if}} \
                                    </div>\
                                  {{/each}}\
                                </div>\
                            </div>\
                          </div>\
                          {{/if}}\
                          {{if (msgItem.buttons && msgItem.buttons.length)}} \
                          <div class="meetingActionButtons {{if ((msgItem.buttonsLayout && msgItem.buttonsLayout.style==="float"))}}float{{else}}fix{{/if}} {{if ((msgItem.details && msgItem.details.length))}}hide{{/if}}">\
                              {{each(key, actionbtn) msgItem.buttons}}\
                                      {{if (msgItem.buttonsLayout && msgItem.buttonsLayout.displayLimit && msgItem.buttonsLayout.displayLimit.count && (key < msgItem.buttonsLayout.displayLimit.count)) || (!msgItem.buttonsLayout && key < 2) || (msgItem.buttonsLayout && !msgItem.buttonsLayout.displayLimit && key < 2) || (msgItem.buttonsLayout && msgItem.buttonsLayout.displayLimit && !msgItem.buttonsLayout.displayLimit.count && key < 2)}}\
                                        {{if actionbtn.title}}\
                                          <div class="actionBtns action" actionObj="${JSON.stringify(actionbtn)}">\
                                          <i>\
                                          {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                          <span class="wid-temp-btnImage"> \
                                              <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                          </span> \
                                          {{/if}} \
                                          </i>${actionbtn.title}</div>\
                                        {{/if}}\
                                      {{/if}}\
                              {{/each}}\
                              {{if (msgItem.buttonsLayout && msgItem.buttonsLayout.displayLimit && msgItem.buttonsLayout.displayLimit.count && (msgItem.buttons.length > msgItem.buttonsLayout.displayLimit.count)) || (!msgItem.buttonsLayout && msgItem.buttons.length > 2) || (msgItem.buttonsLayout && !msgItem.buttonsLayout.displayLimit && msgItem.buttons.length > 2) || (msgItem.buttonsLayout && msgItem.buttonsLayout.displayLimit && !msgItem.buttonsLayout.displayLimit.count && msgItem.buttons.length > 2)}}\
                              {{if (msgItem.buttonsLayout && msgItem.buttonsLayout.displayLimit && msgItem.buttonsLayout.displayLimit.count && (msgItem.buttons.length > msgItem.buttonsLayout.displayLimit.count)) || (!msgItem.buttonsLayout && msgItem.buttons.length > 3) || (msgItem.buttonsLayout && !msgItem.buttonsLayout.displayLimit && msgItem.buttons.length > 3) || (msgItem.buttonsLayout && msgItem.buttonsLayout.displayLimit && !msgItem.buttonsLayout.displayLimit.count && msgItem.buttons.length > 3)}}\
                                <div class="dropbtnWidgt actionBtns" style="margin:0;margin-top: 0px;top: unset;" onclick="showDropdown(this)">... More</div>\
                                <ul  class="dropdown-contentWidgt" style="list-style:none;">\
                                  {{each(key, actionbtn) msgItem.buttons}} \
                                   {{if key >= 2}}\
                                          <li class="dropdown-item action" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}">\
                                          <i>\
                                          {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                          <span class="wid-temp-btnImage"> \
                                              <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                          </span> \
                                          {{/if}} \
                                          </i>${actionbtn.title}</li>\
                                   {{/if}}\
                                  {{/each}}\
                                </ul>\
                              {{/if}}\
                              {{if ((msgItem.buttonsLayout && msgItem.buttonsLayout.displayLimit && !msgItem.buttonsLayout.displayLimit.count) || (!msgItem.buttonsLayout) ) && msgItem.buttons.length === 3}}\
                              {{each(key, actionbtn) msgItem.buttons}}\
                               {{if key === 2 }}\
                                {{if actionbtn.title}}\
                                  <div class="actionBtns action" actionObj="${JSON.stringify(actionbtn)}">\
                                  <i>\
                                  {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                  <span class="wid-temp-btnImage"> \
                                      <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                  </span> \
                                  {{/if}} \
                                  </i>${actionbtn.title}</div>\
                                {{/if}}\
                                 {{/if}}\
                               {{/each}}\
                              {{/if}}\
                            {{/if}}\
                          </div>\
                          {{/if}}\
                        </li> \
                        {{/if}}\
                       {{/each}} \
                      </ul> \
              <div style="clear:both"></div>\
              {{if dataItems && dataItems.length > 3 && viewmore}} \
                  <div class="listViewMore" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')"><span class="seeMoreText">See more <span class="see-more"></span></span></div>\
              {{/if}}\
              {{if dataItems && dataItems.length === 0}}\
                  <div class="noContent">\
                      <img class="img img-fluid" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzEiIGhlaWdodD0iNjMiIHZpZXdCb3g9IjAgMCAxNzEgNjMiPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBmaWxsPSIjRTVFOEVDIj4KICAgICAgICAgICAgPHJlY3Qgd2lkdGg9IjEzMSIgaGVpZ2h0PSIxMiIgeD0iMzkiIHk9IjUiIHJ4PSIyIi8+CiAgICAgICAgICAgIDxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjIiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGcgZmlsbD0iI0U1RThFQyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA0MSkiPgogICAgICAgICAgICA8cmVjdCB3aWR0aD0iMTMxIiBoZWlnaHQ9IjEyIiB4PSIzOSIgeT0iNSIgcng9IjIiLz4KICAgICAgICAgICAgPHJlY3Qgd2lkdGg9IjIyIiBoZWlnaHQ9IjIyIiByeD0iMiIvPgogICAgICAgIDwvZz4KICAgICAgICA8cGF0aCBzdHJva2U9IiNFNUU4RUMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS13aWR0aD0iLjciIGQ9Ik0uNSAzMS41aDE3MCIvPgogICAgPC9nPgo8L3N2Zz4K" width="118px" height="118px" style="margin-top:15px;">\
                      <div class="col-12 rmpmW nodataTxt">No Data</div>\
                  </div>\
              {{/if}}\
                    </div>\
                 {{/if}}\
                </div>\
             </script>';
      var barChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
             <div class="bar-chart-template">\
               <div class="tab-list-template" mainObj="${JSON.stringify(tempdata)}">\
                 {{if tempdata}} \
                   <div class="listTemplateContainer">\
                   {{if tempdata.tabs && tabs.length}} \
                     <div class="tabsContainer">\
                       {{each(key, tab) tabs}} \
                       <span class="tabs" data-tabid="${tab}" ><span class="btnBG">${tab}</span></span>\
                       {{/each}}\
                     </div>\
                   {{/if}} \
                     <ul class="displayListValues">\
                       <li class="listViewTmplContentChild"> \
                         <div class="listViewTmplContentChildRow">\
                         {{if tempdata.image && tempdata.image.image_type === "image"}} \
                                 <div class="listViewRightContent"> \
                                     <img alt="image" src="${tempdata.image.namespace}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                 </div> \
                         {{/if}} \
                         <div class="listViewLeftContent"> \
                               <div class="barchartDiv">\
                                       <div class="wiz-header-buttons hide">\
                                         {{if tempdata.buttons && tempdata.buttons.length > 1}} \
                                           <i  class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)">... More</i>\
                                           <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                             {{each(key, actionbtnli) tempdata.buttons}} \
                                                   <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                                 <i>\
                                                 {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                                 <span class="wid-temp-btnImage"> \
                                                 <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                 </span> \
                                                 {{/if}} \
                                                 </i>${actionbtnli.title}</li>\
                                             {{/each}}\
                                           </ul>\
                                         {{/if}}\
                                         {{if tempdata.buttons && tempdata.buttons.length === 1}} \
                                             {{each(key, actionbtnli) tempdata.buttons}} \
                                                 <a class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                                     {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                                       <i>\
                                                         <span class="wid-temp-btnImage"> \
                                                             <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                         </span> \
                                                       </i>\
                                                     {{/if}} \
                                                     {{if actionbtnli.title}}\
                                                       ${actionbtnli.title}\
                                                     {{/if}}\
                                                 </a>\
                                             {{/each}}\
                                         {{/if}}\
                                       </div>\
                               </div>\
                               <div class="" id="barchart"></div>\
                               {{if tempdata.value && tempdata.value.type=="text"}}<div class="listViewItemValue">${tempdata.value.text}</div>{{/if}} \
                               {{if tempdata.value && tempdata.value.type=="button"}}\
                                   {{if tempdata.value && tempdata.value.buttons && tempdata.value.buttons.length > 1}} \
                                     <i  class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)">... More</i>\
                                     <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                       {{each(key, actionbtnli) tempdata.value.buttons}} \
                                             <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                           <i>\
                                           {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                           <span class="wid-temp-btnImage"> \
                                               <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                           </span> \
                                           {{/if}} \
                                           </i>${actionbtnli.title}</li>\
                                       {{/each}}\
                                     </ul>\
                                   {{/if}}\
                                   {{if tempdata.value && tempdata.value.buttons && tempdata.value.buttons.length === 1}} \
                                     <div class="viewMore action" actionObj="${JSON.stringify(tempdata.value.buttons[0])}" >${tempdata.value.buttons[0].title}</div>\
                                   {{/if}}\
                               {{/if}} \
                         </div>\
                         </div>\
                         {{if tempdata.content && tempdata.content.length}} \
                         <div class="tabListViewDiscription">\
                           {{each(key, content) tempdata.content}} \
                             {{if key < 3 }}\
                               <div class="wid-temp-contentDiv">\
                                 {{if content.image && content.image.image_type === "image"}} \
                                     <span class="wid-temp-discImage"> \
                                         <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                     </span> \
                                 {{/if}} \
                                 {{if content.description}} \
                                   <span class="wid-temp-discription">${content.description}</span>\
                                 {{/if}} \
                                 {{if ((key===2) || ((tempdata.content.length < 3) && (key===tempdata.content.length-1))) && (tempdata.buttons && tempdata.buttons.length)}} \
                                 <span class="wid-temp-showActions">\
                                 </span>\
                                 {{/if}} \
                               </div>\
                             {{/if}}\
                           {{/each}}\
                           {{if tempdata.content.length > 3}}\
                           <span class="wid-temp-showMore" id="showMoreContents">Show more <img src="libs/images/show-more.svg" class="show-more"></span>\
                           {{/if}}\
                         </div>\
                         <div class="wid-temp-showMoreBottom hide">\
                         <div class="headerTitleMore">MORE<span class="wid-temp-showMoreClose"><img src="libs/images/closeCross.png" class="closeCross"></span></div>\
                           {{each(key, content) tempdata.content}} \
                             <div class="wid-temp-contentDiv">\
                               {{if content.image && content.image.image_type === "image"}}\
                                     <span class="wid-temp-discImage"> \
                                         <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                     </span> \
                               {{/if}} \
                               {{if content.description}} \
                                   <span class="wid-temp-discription">${content.description}</span>\
                               {{/if}} \
                             </div>\
                           {{/each}}\
                         </div>\
                         {{/if}}\
                         {{if (tempdata.buttons && tempdata.buttons.length)}} \
                         <div class="meetingActionButtons {{if ((tempdata.content && tempdata.content.length))}}hide{{/if}}">\
                             {{each(key, actionbtn) tempdata.buttons}}\
                                     {{if key < 2 }}\
                                       {{if actionbtn.title}}\
                                         <div class="actionBtns action" actionObj="${JSON.stringify(actionbtn)}">\
                                         <i>\
                                         {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                         <span class="wid-temp-btnImage"> \
                                             <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                         </span> \
                                         {{/if}} \
                                         </i>${actionbtn.title}</div>\
                                       {{/if}}\
                                     {{/if}}\
                             {{/each}}\
                             {{if tempdata.buttons && (tempdata.buttons.length > 2)}}\
                             {{if tempdata.buttons && tempdata.buttons.length > 2}}\
                               <div class="dropbtnWidgt actionBtns" style="margin:0;margin-top: 0px;top: unset;" onclick="showDropdown(this)">... More</div>\
                               <ul  class="dropdown-contentWidgt" style="list-style:none;">\
                                 {{each(key, actionbtn) tempdata.buttons}} \
                                 {{if key >= 2}}\
                                         <li class="dropdown-item action" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}">\
                                         <i>\
                                         {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                         <span class="wid-temp-btnImage"> \
                                             <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                         </span> \
                                         {{/if}} \
                                         </i>${actionbtn.title}</li>\
                                 {{/if}}\
                                 {{/each}}\
                               </ul>\
                             {{/if}}\
                             {{if tempdata.buttons && tempdata.buttons.length === 7}}\
                             {{if key === 7}}\
                                 <div  class="actionBtns action" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(msgItem)}">\
                                 <i>\
                                   {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                         <span class="wid-temp-btnImage"> \
                                             <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                         </span> \
                                   {{/if}} \
                                   </i>${actionbtn.title}</div>\
                             {{/if}}\
                             {{/if}}\
                           {{/if}}\
                         </div>\
                         {{/if}}\
                       </li> \
                     </ul> \
                   </div>\
               {{/if}}\
               </div>\
             </div>\
           </scipt>';
      var lineChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
            <div class="line-chart-template">\
              <div class="tab-list-template" mainObj="${JSON.stringify(tempdata)}">\
                {{if tempdata}} \
                  <div class="listTemplateContainer">\
                  {{if tempdata.tabs && tabs.length}} \
                    <div class="tabsContainer">\
                      {{each(key, tab) tabs}} \
                      <span class="tabs" data-tabid="${tab}" ><span class="btnBG">${tab}</span></span>\
                      {{/each}}\
                    </div>\
                  {{/if}} \
                    <ul class="displayListValues">\
                      <li class="listViewTmplContentChild"> \
                        <div class="listViewTmplContentChildRow">\
                        {{if tempdata.image && tempdata.image.image_type === "image"}} \
                                <div class="listViewRightContent"> \
                                    <img alt="image" src="${tempdata.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                </div> \
                        {{/if}} \
                        <div class="listViewLeftContent"> \
                              <div class="linechartDiv">\
                                      <div class="wiz-header-buttons hide">\
                                        {{if tempdata.buttons && tempdata.buttons.length > 1}} \
                                          <i  class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)">... More</i>\
                                          <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                            {{each(key, actionbtnli) tempdata.buttons}} \
                                                  <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                                <i>\
                                                {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                                <span class="wid-temp-btnImage"> \
                                                <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                </span> \
                                                {{/if}} \
                                                </i>${actionbtnli.title}</li>\
                                            {{/each}}\
                                          </ul>\
                                        {{/if}}\
                                        {{if tempdata.buttons && tempdata.buttons.length === 1}} \
                                            {{each(key, actionbtnli) tempdata.buttons}} \
                                                <a class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                                    {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                                      <i>\
                                                        <span class="wid-temp-btnImage"> \
                                                            <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                        </span> \
                                                      </i>\
                                                    {{/if}} \
                                                    {{if actionbtnli.title}}\
                                                      ${actionbtnli.title}\
                                                    {{/if}}\
                                                </a>\
                                            {{/each}}\
                                        {{/if}}\
                                      </div>\
                              </div>\
                              <div class="" id="linechart"></div>\
                              {{if tempdata.value && tempdata.value.type=="text"}}<div class="listViewItemValue">${tempdata.value.text}</div>{{/if}} \
                              {{if tempdata.value && tempdata.value.type=="button"}}\
                                  {{if tempdata.value && tempdata.value.buttons && tempdata.value.buttons.length > 1}} \
                                    <i  class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)">... More</i>\
                                    <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                      {{each(key, actionbtnli) tempdata.value.buttons}} \
                                            <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                          <i>\
                                          {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                          <span class="wid-temp-btnImage"> \
                                              <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                          </span> \
                                          {{/if}} \
                                          </i>${actionbtnli.title}</li>\
                                      {{/each}}\
                                    </ul>\
                                  {{/if}}\
                                  {{if tempdata.value && tempdata.value.buttons && tempdata.value.buttons.length === 1}} \
                                    <div class="viewMore action" actionObj="${JSON.stringify(tempdata.value.buttons[0])}" >${tempdata.value.buttons[0].title}</div>\
                                  {{/if}}\
                              {{/if}} \
                        </div>\
                        </div>\
                        {{if tempdata.details && tempdata.details.length}} \
                        <div class="tabListViewDiscription">\
                          {{each(key, content) tempdata.details}} \
                            {{if key < 3 }}\
                              <div class="wid-temp-contentDiv">\
                                {{if content.image && content.image.image_type === "image"}} \
                                    <span class="wid-temp-discImage"> \
                                        <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                    </span> \
                                {{/if}} \
                                {{if content.description}} \
                                  <span class="wid-temp-discription">${content.description}</span>\
                                {{/if}} \
                                {{if ((key===2) || ((tempdata.details.length < 3) && (key===tempdata.details.length-1))) && (tempdata.buttons && tempdata.buttons.length)}} \
                                <span class="wid-temp-showActions">\
                                </span>\
                                {{/if}} \
                              </div>\
                            {{/if}}\
                          {{/each}}\
                          {{if tempdata.details.length > 3}}\
                          <span class="wid-temp-showMore" id="showMoreContents">Show more <img src="libs/images/show-more.svg" class="show-more"></span>\
                          {{/if}}\
                        </div>\
                        <div class="wid-temp-showMoreBottom hide">\
                        <div class="headerTitleMore">MORE<span class="wid-temp-showMoreClose"><img src="libs/images/closeCross.png" class="closeCross"></span></div>\
                          {{each(key, content) tempdata.details}} \
                            <div class="wid-temp-contentDiv">\
                              {{if content.image && content.image.image_type === "image"}}\
                                    <span class="wid-temp-discImage"> \
                                        <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                    </span> \
                              {{/if}} \
                              {{if content.description}} \
                                  <span class="wid-temp-discription">${content.description}</span>\
                              {{/if}} \
                            </div>\
                          {{/each}}\
                        </div>\
                        {{/if}}\
                        {{if (tempdata.buttons && tempdata.buttons.length)}} \
                        <div class="meetingActionButtons {{if ((tempdata.details && tempdata.details.length))}}hide{{/if}}">\
                            {{each(key, actionbtn) tempdata.buttons}}\
                                    {{if key < 2 }}\
                                      {{if actionbtn.title}}\
                                        <div class="actionBtns action" actionObj="${JSON.stringify(actionbtn)}">\
                                        <i>\
                                        {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                        <span class="wid-temp-btnImage"> \
                                            <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                        </span> \
                                        {{/if}} \
                                        </i>${actionbtn.title}</div>\
                                      {{/if}}\
                                    {{/if}}\
                            {{/each}}\
                            {{if tempdata.buttons && (tempdata.buttons.length > 2)}}\
                            {{if tempdata.buttons && tempdata.buttons.length > 2}}\
                              <div class="dropbtnWidgt actionBtns" style="margin:0;margin-top: 0px;top: unset;" onclick="showDropdown(this)">... More</div>\
                              <ul  class="dropdown-contentWidgt" style="list-style:none;">\
                                {{each(key, actionbtn) tempdata.buttons}} \
                                {{if key >= 2}}\
                                        <li class="dropdown-item action" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}">\
                                        <i>\
                                        {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                        <span class="wid-temp-btnImage"> \
                                            <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                        </span> \
                                        {{/if}} \
                                        </i>${actionbtn.title}</li>\
                                {{/if}}\
                                {{/each}}\
                              </ul>\
                            {{/if}}\
                            {{if tempdata.buttons && tempdata.buttons.length === 7}}\
                            {{if key === 7}}\
                                <div  class="actionBtns action" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(msgItem)}">\
                                <i>\
                                  {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                        <span class="wid-temp-btnImage"> \
                                            <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                        </span> \
                                  {{/if}} \
                                  </i>${actionbtn.title}</div>\
                            {{/if}}\
                            {{/if}}\
                          {{/if}}\
                        </div>\
                        {{/if}}\
                      </li> \
                    </ul> \
                  </div>\
              {{/if}}\
              </div>\
            </div>\
         </scipt>';
      var pieChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                <div class="pie-chart-template">\
                  <div class="tab-list-template" mainObj="${JSON.stringify(tempdata)}">\
                    {{if tempdata}} \
                      <div class="listTemplateContainer">\
                      {{if tempdata.tabs && tabs.length}} \
                        <div class="tabsContainer">\
                          {{each(key, tab) tabs}} \
                          <span class="tabs" data-tabid="${tab}" ><span class="btnBG">${tab}</span></span>\
                          {{/each}}\
                        </div>\
                      {{/if}} \
                        <ul class="displayListValues">\
                          <li class="listViewTmplContentChild"> \
                            <div class="listViewTmplContentChildRow">\
                            {{if tempdata.image && tempdata.image.image_type === "image"}} \
                                    <div class="listViewRightContent"> \
                                        <img alt="image" src="${tempdata.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                    </div> \
                            {{/if}} \
                            <div class="listViewLeftContent"> \
                                  <div class="piechartDiv">\
                                          <div class="wiz-header-buttons hide">\
                                            {{if tempdata.buttons && tempdata.buttons.length > 1}} \
                                              <i  class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)">... More</i>\
                                              <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                                {{each(key, actionbtnli) tempdata.buttons}} \
                                                      <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                                    <i>\
                                                    {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                                    <span class="wid-temp-btnImage"> \
                                                    <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                    </span> \
                                                    {{/if}} \
                                                    </i>${actionbtnli.title}</li>\
                                                {{/each}}\
                                              </ul>\
                                            {{/if}}\
                                            {{if tempdata.buttons && tempdata.buttons.length === 1}} \
                                                {{each(key, actionbtnli) tempdata.buttons}} \
                                                    <a class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                                        {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                                          <i>\
                                                            <span class="wid-temp-btnImage"> \
                                                                <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                            </span> \
                                                          </i>\
                                                        {{/if}} \
                                                        {{if actionbtnli.title}}\
                                                          ${actionbtnli.title}\
                                                        {{/if}}\
                                                    </a>\
                                                {{/each}}\
                                            {{/if}}\
                                          </div>\
                                  </div>\
                                  <div class="" id="piechart"></div>\
                                  {{if tempdata.value && tempdata.value.type=="text"}}<div class="listViewItemValue">${tempdata.value.text}</div>{{/if}} \
                                  {{if tempdata.value && tempdata.value.type=="button"}}\
                                      {{if tempdata.value && tempdata.value.buttons && tempdata.value.buttons.length > 1}} \
                                        <i  class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)">... More</i>\
                                        <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                          {{each(key, actionbtnli) tempdata.value.buttons}} \
                                                <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                              <i>\
                                              {{if actionbtnli.image && actionbtnli.image.image_type === "image" && actionbtnli.image.image_src}}\
                                              <span class="wid-temp-btnImage"> \
                                                  <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                              </span> \
                                              {{/if}} \
                                              </i>${actionbtnli.title}</li>\
                                          {{/each}}\
                                        </ul>\
                                      {{/if}}\
                                      {{if tempdata.value && tempdata.value.buttons && tempdata.value.buttons.length === 1}} \
                                        <div class="viewMore action" actionObj="${JSON.stringify(tempdata.value.buttons[0])}" >${tempdata.value.buttons[0].title}</div>\
                                      {{/if}}\
                                  {{/if}} \
                            </div>\
                            </div>\
                            {{if tempdata.details && tempdata.details.length}} \
                            <div class="tabListViewDiscription">\
                              {{each(key, content) tempdata.details}} \
                                {{if key < 3 }}\
                                  <div class="wid-temp-contentDiv">\
                                    {{if content.image && content.image.image_type === "image"}} \
                                        <span class="wid-temp-discImage"> \
                                            <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                        </span> \
                                    {{/if}} \
                                    {{if content.description}} \
                                      <span class="wid-temp-discription">${content.description}</span>\
                                    {{/if}} \
                                    {{if ((key===2) || ((tempdata.details.length < 3) && (key===tempdata.details.length-1))) && (tempdata.buttons && tempdata.buttons.length)}} \
                                    <span class="wid-temp-showActions">\
                                    </span>\
                                    {{/if}} \
                                  </div>\
                                {{/if}}\
                              {{/each}}\
                              {{if tempdata.details.length > 3}}\
                              <span class="wid-temp-showMore" id="showMoreContents">Show more <img src="libs/images/show-more.svg" class="show-more"></span>\
                              {{/if}}\
                            </div>\
                            <div class="wid-temp-showMoreBottom hide">\
                            <div class="headerTitleMore">MORE<span class="wid-temp-showMoreClose"><img src="libs/images/closeCross.png" class="closeCross"></span></div>\
                            <div class="moreItemsScroll">\
                            {{each(key, content) tempdata.details}} \
                                <div class="wid-temp-contentDiv">\
                                  {{if content.image && content.image.image_type === "image"}}\
                                        <span class="wid-temp-discImage"> \
                                            <img alt="image" src="${content.image.image_src}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                        </span> \
                                  {{/if}} \
                                  {{if content.description}} \
                                      <span class="wid-temp-discription">${content.description}</span>\
                                  {{/if}} \
                                </div>\
                              {{/each}}\
                            </div>\
                            </div>\
                            {{/if}}\
                            {{if (tempdata.buttons && tempdata.buttons.length)}} \
                            <div class="meetingActionButtons {{if ((tempdata.details && tempdata.details.length))}}hide{{/if}}">\
                                {{each(key, actionbtn) tempdata.buttons}}\
                                        {{if key < 2 }}\
                                          {{if actionbtn.title}}\
                                            <div class="actionBtns action" actionObj="${JSON.stringify(actionbtn)}">\
                                            <i>\
                                            {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                            <span class="wid-temp-btnImage"> \
                                                <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                            </span> \
                                            {{/if}} \
                                            </i>${actionbtn.title}</div>\
                                          {{/if}}\
                                        {{/if}}\
                                {{/each}}\
                                {{if tempdata.buttons && (tempdata.buttons.length > 2)}}\
                                {{if tempdata.buttons && tempdata.buttons.length > 2}}\
                                  <div class="dropbtnWidgt actionBtns" style="margin:0;margin-top: 0px;top: unset;" onclick="showDropdown(this)">... More</div>\
                                  <ul  class="dropdown-contentWidgt" style="list-style:none;">\
                                    {{each(key, actionbtn) tempdata.buttons}} \
                                    {{if key >= 2}}\
                                            <li class="dropdown-item action" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}">\
                                            <i>\
                                            {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                            <span class="wid-temp-btnImage"> \
                                                <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                            </span> \
                                            {{/if}} \
                                            </i>${actionbtn.title}</li>\
                                    {{/if}}\
                                    {{/each}}\
                                  </ul>\
                                {{/if}}\
                                {{if tempdata.buttons && tempdata.buttons.length === 7}}\
                                {{if key === 7}}\
                                    <div  class="actionBtns action" href="javascript:void(0)" actionObj="${JSON.stringify(actionbtn)}" mainObj="${JSON.stringify(msgItem)}">\
                                    <i>\
                                      {{if actionbtn.image && actionbtn.image.image_type === "image" && actionbtn.image.image_src}}\
                                            <span class="wid-temp-btnImage"> \
                                                <img alt="image" src="${actionbtn.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                            </span> \
                                      {{/if}} \
                                      </i>${actionbtn.title}</div>\
                                {{/if}}\
                                {{/if}}\
                              {{/if}}\
                            </div>\
                            {{/if}}\
                          </li> \
                        </ul> \
                      </div>\
                  {{/if}}\
                  </div>\
                </div>\
             </scipt>';
      var ActionItems = '<script> \
              {{if tempdata && tempdata.displayLimit && tempdata.displayLimit.displayAs === "inline" }} \
                <div class="actionItemsParentDiv" mainObj="${JSON.stringify(tempdata)}"> \
                  <div class="actionItemsHeader"> \
                    <div class="actionItemHeading">${tempdata.heading}</div> \
                    {{if tempdata && tempdata.text}} \
                      <span class="actionItemText">${tempdata.text}</span> \
                    {{/if}} \
                  </div> \
                  {{if tempdata && tempdata.buttons && tempdata.buttons.length}} \
                    <div class="actionItemBody"> \
                      {{each(key, actionbtn) tempdata.actionItems}} \
                        <span class = "actionBtnTitle {{if key<tempdata.displayLimit.count}} show {{else}} hide {{/if}}" actionObj="${JSON.stringify(actionbtn)}">${actionbtn.title}</span> \
                      {{/each}} \
                      <span class="hasMoreActionItems"> + ${tempdata.actionItems.length - tempdata.displayLimit.count} More</span> \
                    </div> \
                  {{/if}} \
                </div> \
              {{/if}} \
            </script>';

      var TableList = '<script> \
                        <div class="listTableContainerDiv">\
                        <div class="listTableContainerDivRepet">\
                        <div class="listTableContainer">\
                        {{each(index,record) tempdata.records}}\
                                <div class="listTableDetailsBorderDiv">\
                                        <div class="listTableDetails">\
                                            <p class="listTableDetailsTitle">${record.sectionHeader}</p>\
                                {{each(index,msgItem) record.elements}}\
                                            <div class="listTableDetailsDesc {{if msgItem.image && msgItem.image.size==="medium"}}mediumImg{{/if}}" {{if msgItem.image && msgItem.image.size==="large"}}mediumImg{{/if}}" {{if msgItem.image && msgItem.image.size==="small"}}smallImg{{/if}}">\
                                              {{if msgItem && msgItem.image && msgItem.image.image_type && msgItem.image.image_src}}\
                                                <div class="listTableBigImgConytainer">\
                                                  {{if msgItem.image.image_type === "image"}}\
                                                      <img src="${msgItem.image.image_src}">\
                                                  {{/if}}\
                                                  {{if msgItem.image.image_type === "fontawesome"}}\
                                                      <i class="fa {{msgItem.image.image_src}}" ></i>\
                                                  {{/if}}\
                                                </div>\
                                              {{/if}}\
                                                <div class="listTableDetailsDescSub ">\
                                                    <p class="listTableDetailsDescName">${msgItem.title}</p>\
                                                    <p class="listTableDetailsDescValue">${msgItem.subtitle}</p>\
                                                </div>\
                                                  {{if (msgItem.value && msgItem.value.type === "text" && msgItem.value.text)}}\
                                                    <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}} {{if msgItem.value && msgItem.value.layout && msgItem.value.color}} style="color:${msgItem.value.layout.color};"{{/if}}>\
                                                        <div class="listViewItemValue {{if !msgItem.subtitle}}top10{{/if}}">${msgItem.value.text}</div>\
                                                    </div>\
                                                  {{/if}}\
                                                  {{if (msgItem.value && msgItem.value.type === "image" && msgItem.value.image && msgItem.value.image.image_src)}}\
                                                    <div actionObj="${JSON.stringify(msgItem.value.image)}" class="titleActions imageValue action {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                                        {{if msgItem.value.image && msgItem.value.image.image_type === "image" && msgItem.value.image.image_src}}\
                                                            <span class="wid-temp-btnImage"> \
                                                                <img alt="image" src="${msgItem.value.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                            </span> \
                                                        {{/if}}\
                                                    </div>\
                                                  {{/if}}\
                                                  {{if (msgItem.value && msgItem.value.type === "url" && msgItem.value.url && msgItem.value.url.title)}}\
                                                    <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                                        <div actionObj="${JSON.stringify(msgItem.value.url)}" class="listViewItemValue actionLink action {{if !msgItem.subtitle}}top10{{/if}}">${msgItem.value.url.title}</div>\
                                                    </div>\
                                                  {{/if}}\
                                                  {{if msgItem.value && msgItem.value.type=="button" && msgItem.value.button && (msgItem.value.button.title || (msgItem.value.button.image && msgItem.value.button.image.image_src))}}\
                                                    <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}}style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                                        <div class="actionBtns action singleBTN {{if !msgItem.value.button.title && (msgItem.value.button.image && msgItem.value.button.image.image_src)}}padding5{{/if}}" actionObj="${JSON.stringify(msgItem.value.button)}">\
                                                            {{if msgItem.value.button.image && msgItem.value.button.image.image_type === "image" && msgItem.value.button.image.image_src}}\
                                                                    <span class="wid-temp-btnImage"> \
                                                                        <img alt="image" src="${msgItem.value.button.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                                    </span> \
                                                            {{/if}}\
                                                            {{if msgItem.value.button.title}}\
                                                            ${msgItem.value.button.title}\
                                                            {{/if}}\
                                                        </div>\
                                                    </div>\
                                                  {{/if}}\
                                                  {{if msgItem.value && msgItem.value.type=="menu" && msgItem.value.menu && msgItem.value.menu.length}}\
                                                  <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}}style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                                      <i class="icon-More dropbtnWidgt moreValue"  onclick="showDropdown(this)"></i>\
                                                          <ul  class="dropdown-contentWidgt  rmpmW moreValueContent" style="list-style:none;">\
                                                            {{each(key, actionbtnli) msgItem.value.menu}} \
                                                                  <li class="dropdown-item action" actionObj="${JSON.stringify(actionbtnli)}">\
                                                                <i>\
                                                                {{if actionbtnli.image && actionbtnli.image.image_type === "image" && msgItem.image.image_src}}\
                                                                <span class="wid-temp-btnImage"> \
                                                                    <img alt="image" src="${actionbtnli.image.image_src}" onerror="this.onerror=null;this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA/FJREFUWAnNmItK60AQQLdN05eIIoog+v+/pQiKIlhab9M2SXv3TDthk25evenFgTbJPmZOdndmM9ubL/7szC+WwalsvZ4xg2BggqBvevah3+/JFX273c5stzu5punWJGli70+z1BowDAcmHAQWaA/mM7sH3teEIcChBd6aOElNHCe+LqVljQEHFmo0DAWsVFtJBcBBEMhvaF9wvYlNYmGbSC0gyifjoShvorCuDSM/GY9MmqYmWm1kGVT16VdVBlbZdDLuDM61xYiKbmujSkprmdLJZCSLv0rBv9ThWNjAVpl4p5iRG4+GmVcyHT8/P7XTUTQyHA4twCTTU6znmSWErWi7Nql1pKIcAUoHu0a4qry+vpr1eq2Pra5APjw8mNFoVNpPbS6j1dEgHAHiEAy9K8Bh6Pb21i0uvV8sFobfdDo1y+XS8IJPT0+VkDLd1vYyyg9EDpC1wOL1CeWXl5e+qqOyzWYjgDc3N9Ln4+OjESQ2YHBDUM5JiHNdy/X1tbm/v5ew0mSpFBkyQHYIYtQ5pA0kDLCoZERsX+cUF/Lt7e3IGVzbLoug4rDnGL3VauXatSMTZo4TRZHc5xocHmCBiQ8MAeSrxA0rvk5tyvB45Ovrq7QbjoSX+wQWmOIk2QPyydRWCD388Oziy1FG7AOiKPQhBNUJTHz4HKY4H/fqOr+/v5v5fC7NPj8/zePjoxmPx7luZSFJY2SusedBX1qGrhiYPe2zojiOMzgK2Qa/v7+z+q5ulEkAlbaJct+0Ad21KFPrxXdxcSHe6AIRQlwBuC6UuO2r7mUNkkMocVVjrWNfnc1m4iRXV1e5LRA4dgyuifVC2rbRrTZgQgSQBKfNJkI8u7u7U13Z1YWjkFgH7CmQMCEyxUorJS3+GCGVIpyWK2RbG9peAEkN2wpfKM/PzzLNZXCqE0jWZBtRJpnifd4aNl4rwLEGEaaQrQnIKvF5f1l7Rg8m5DDFRvLWsg5uOQFa4SgnDtbBuf2b3JNDH3xkD0gnkuomQudzi8uSxUEy/v9hvO7l5ATCOX2QNaidyPhJqquEoFwMzFXt29bB4EoOkFyANeXLS3iz4vedq6jpfZWzYNvNR9CZA6SA4wgyft2sKSMw85n08vLCYyeCTlcIzNguSs93PkjiTsavWxRweK8Gz6KSts/kyGyRKuiNbLrpS9y9gHQc2BzFPV1QZV1fgVutN0dTq3YyL9YCvbIWeCvdE7W8y6tMq7VRXHeujVJAGjHkHEeweLsWdIrumrh65CRFEKaA4wim/NQDTFcn0aDTA0xVzjTwa3IErH30yktKALb9z3YErMYwwI+89VceoiuoHRTJW51dSas6vf4FP88rnfrjdTEAAAAASUVORK5CYII=\';"/> \
                                                                </span> \
                                                                {{/if}} \
                                                                </i>${actionbtnli.title}</li>\
                                                            {{/each}}\
                                                          </ul>\
                                                  </div>\
                                                  {{/if}}\
                                            </div>\
                                {{/each}}\
                                        </div>\
                                </div>\
                        {{/each}}\
                        </div>\
                        {{if tempdata.records && tempdata.records.length > 3 && viewmore}} \
                            <div class="seeMoreFooter">\
                                <span class="seeMoreLink" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">Show more</span>\
                            </div>\
                        {{/if}}\
                        </div>\
                    </div>\
          </sript>';
      switch (type) {
        case 'menu':
          return menuTemplate;

        case 'meetingTemplate':
          return meetingTemplate;

        case 'tasksTemplate':
          return tasksTemplate;

        case 'filesTemplate':
          return filesTemplate;

        case 'defaultFilesTemplate':
          return defaultFilesTemplate;

        case 'mainTemplate':
          return mainTemplate;

        case 'viewMoreTemplate':
          return viewMoreTemplate;

        case 'knowledgeTemplate':
          return knowledgeTemplate;

        case 'announcementTemplate':
          return announcementTemplate;

        case 'hashtagTemplate':
          return hashtagTemplate;

        case 'skillsTemplate':
          return skillsTemplate;

        case 'defaultTemplate':
          return defaultTemplate;

        case 'popUpTemplate':
          return popUpTemplate;

        case 'chartListTemplate':
          return chartListTemplate;

        case 'errorTemplate':
          return errorTemplate;

        case 'filterTemplate':
          return filterTemplate;

        case 'filterOptionsTemplate':
          return filterOptionsTemplate;

        case 'List':
          return List;

        case 'pieChartTemplate':
          return pieChartTemplate;

        case 'TabbedList':
          return List;

        case 'ActionItems':
          return ActionItems;

        case 'barChartTemplate':
          return barChartTemplate;

        case 'lineChartTemplate':
          return lineChartTemplate;

        case 'ErrorTemplate':
          return ErrorTemplate;

        case 'AuthRequired':
          return AuthRequired;

        case 'widgetHeader':
          return widgetHeader;

        case 'TableList':
          return TableList;
      }
    }; //********************original widgetTemplate.js ends */
    //********************original widgetEvents.js end */


    window.menuActiveTab = '';
    var panel = ["meetings", "tasks", "files", 'knowledge', 'announcement'];
    var oldPanelName;
    var editComponent = {
      editComponentList: ['AnnouncementformComponent', 'InfoshowformComponent', 'CreateNotesComponent'],
      editComponentSelector: {
        AnnouncementformComponent: 'app-announcementform',
        InfoshowformComponent: 'app-infoshowform',
        CreateNotesComponent: 'app-createnotes'
      },
      selector: ['app-announcementform', 'app-infoshowform', 'app-createnotes']
    };
    var intializeOffset = 0,
      pollingTimer = '',
      viewMoreCntrScroll = '',
      meetingTimeRef = [];
    var meetingArray = [];
    var mainTemplateBdr,
      localPanelDetail = {},
      makeAPICall = true;
    var helpers = {
      'actionIcon': function actionIcon(actionbtndata) {
        if (actionbtndata.type === "open_form") {
          return "icon-Take-notes";
        } else if (actionbtndata.type === "url") {
          return "icon-Go-out";
        }
      },
      'updateMeetingTimer': function updateMeetingTimer(strTime, endDate, index, id) {
        return true;
      },
      'compareCurntTimeAndTimln_minutes': function compareCurntTimeAndTimln_minutes(strTime, endDate, type) {
        if (strTime) {
          var startDate = strTime;
          var sysDate = new Date().getTime();
          var stTimeline = startDate - sysDate;
          var minStartTime = Math.ceil(stTimeline / 60000);
          var entTimeline;

          if (endDate) {
            entTimeline = endDate - sysDate;
          }

          if (type === 'textFormat') {
            var dayType = helpers.getTimeline(strTime, "fulldate", "meetings"); // today

            if (dayType === "Happening Now" || dayType === "Later Today" || dayType === "Today") {
              if (minStartTime > 0) {
                //meeting is yet to start
                var hoursTime = Math.floor(minStartTime / 60);
                var minutePartsTime = minStartTime % 60;

                if (minStartTime > 60) {
                  return 'In ' + hoursTime + 'h  ' + minutePartsTime + 'm';
                } else if (minStartTime < 60) {
                  return 'In ' + minutePartsTime + 'm';
                }
              } else if (minStartTime <= 0) {
                //meeting is in progress
                return 'Now';
              }
            } else if (dayType === "Tomorrow") {
              return 'Tomorrow';
            } else if (dayType === 'Yesterday') {
              if (minStartTime < 0 && entTimeline > 0) {
                //meeting is in progress
                return 'Now';
              }

              return 'xcac';
            } else {
              var givenDate = new Date(strTime);
              var timLnDateFormt = givenDate.getMonth() + '/' + (givenDate.getDate() + 1) + '/' + givenDate.getFullYear();
              var currentDate = new Date();
              var currentDateFormt = currentDate.getMonth() + '/' + (currentDate.getDate() + 1) + '/' + currentDate.getFullYear();
              var date1 = new Date(timLnDateFormt);
              var date2 = new Date(currentDateFormt);
              var diffTime = Math.abs(date2 - date1);
              var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return 'In ' + diffDays + ' days';
            }
          }

          return minStartTime;
        }
      },
      'callMeetingTimer': function callMeetingTimer(strTime, endDate, type) {
        helpers.compareCurntTimeAndTimln_minutes(strTime, endDate, type);
      },
      'getWidgetIcon': function getWidgetIcon(iconId) {
        // menu icon for menu panel
        iconId = iconId ? iconId.toLowerCase() : '';

        if (iconId == "meetings" || iconId === 'meeting') {
          return 'icon-MeetingCalendar';
        }

        if (iconId == "task" || iconId === 'tasks') {
          return 'icon-Tasks';
        }

        if (iconId == "file" || iconId === 'files') {
          return 'icon-iOS---Folder';
        }

        if (iconId == "knowledge" || iconId === 'knowledges') {
          return 'icon-Knowledge-Cap';
        }

        if (iconId == "announcement" || iconId === 'announcements') {
          return 'icon-Announcements';
        }

        return '';
      },
      'checkMeetingHeaderTimeline': function checkMeetingHeaderTimeline(data, key) {
        // meeting header checks for ('Happening Now' and 'Later Today') for the same day and 'Tomorrow' then day/month/year
        if (key === 0) {
          return true;
        } else {
          var preDate = new Date(parseInt(data[key - 1].data['duration']['start']));
          var currDate = new Date(parseInt(data[key].data['duration']['start'])); // meetings of same date

          if (preDate.toDateString() === currDate.toDateString() || new Date().toDateString() === currDate.toDateString()) {
            // difference between current system time and meeting start time
            var cmpareTimelinIn_MinutsStart = helpers.compareCurntTimeAndTimln_minutes(data[key].data.duration.start, null, null);
            var previousTmStamp = helpers.compareCurntTimeAndTimln_minutes(data[key - 1].data.duration.start, null, null);
            var currentTmStamp = helpers.compareCurntTimeAndTimln_minutes(data[key].data.duration.start, null, null);

            if (previousTmStamp <= 5 && currentTmStamp <= 5 || previousTmStamp <= 5 && currentTmStamp <= 0 || previousTmStamp < 0 && currentTmStamp < 0 || previousTmStamp <= 5 && currentTmStamp < 0 || previousTmStamp < 0 && currentTmStamp <= 5) {
              return false;
            } else if ((previousTmStamp <= 5 || previousTmStamp < 0) && currentTmStamp > 5) {
              return true;
            }

            return false;
          } else {
            return true;
          }
        }
      },
      'checkForlineWidget': function checkForlineWidget(arr, key) {
        var dayTypeTracker = [];

        for (var k = 0; k < arr.length; k++) {
          dayTypeTracker[k] = helpers.getTimeline(arr[k].data.duration.start, "fulldate", "meetings");
        }

        var curredayType = helpers.getTimeline(arr[key].data.duration.start, "fulldate", "meetings");

        if (dayTypeTracker[key] === curredayType && dayTypeTracker[key + 1] === curredayType) {
          return false;
        } else {
          return true;
        }
      },
      'getTimeline': function getTimeline(timeline, type, widgetType) {
        // For all normal timeline

        /* day - Sun, Mon, etc,
        numberdate - 12/4/2019
        date - 25 MAR
        fulldate Mon, 25 MAR
        year - 19
        fullyear - 2019
        time - 12 AM*/
        type = type ? type.toLowerCase() : '';
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var givenDate = new Date(timeline);
        var day = days[givenDate.getDay()];
        var month = months[givenDate.getMonth()];
        var date = givenDate.getDate();
        var currentDate = new Date();
        var todayDay = days[currentDate.getDay()];
        var todayMonth = months[currentDate.getMonth()];
        var todayDate = currentDate.getDate();
        var yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
        var yesterdayDay = days[yesterday.getDay()];
        var yesterdayMonth = months[yesterday.getMonth()];
        var yesterdayDate = yesterday.getDate();
        var tomorrow = new Date(new Date().valueOf() + 1000 * 60 * 60 * 24);
        var tomorrowDay = days[tomorrow.getDay()];
        var tomorrowMonth = months[tomorrow.getMonth()];
        var tomorrowDate = tomorrow.getDate();

        if (type === 'day') {
          return day;
        } else if (type === 'numberdate') {
          if (day + month + date === todayDay + todayMonth + todayDate) {
            return 'Today';
          } else if (day + month + date === yesterdayDay + yesterdayMonth + yesterdayDate) {
            return 'Yesterday';
          } else if (day + month + date === tomorrowDay + tomorrowMonth + tomorrowDate) {
            return 'Tomorrow';
          } else {
            month = givenDate.getMonth() + 1;
            return givenDate.getDate() + '/' + month + '/' + givenDate.getFullYear();
          }
        } else if (type === 'date') {
          if (day + month + date === todayDay + todayMonth + todayDate) {
            return 'Today';
          } else if (day + month + date === yesterdayDay + yesterdayMonth + yesterdayDate) {
            return 'Yesterday';
          } else if (day + month + date === tomorrowDay + tomorrowMonth + tomorrowDate) {
            return 'Tomorrow';
          } else {
            return month + ' ' + date;
          }
        } else if (type === 'fulldate') {
          if (day + month + date === todayDay + todayMonth + todayDate) {
            if (widgetType === 'meetings') {
              // var comparedMinutes = helpers.compareCurntTimeAndTimln_minutes(timeline, null, null);
              var startDate = timeline;
              var sysDate = new Date().getTime();
              var stTimeline = startDate - sysDate;
              var comparedMinutes = Math.ceil(stTimeline / 60000);

              if (comparedMinutes <= 5 && comparedMinutes > 0 || comparedMinutes < 0) {
                return 'Happening Now';
              }

              return 'Later Today';
            } else {
              return 'Today';
            }
          } else if (day + month + date === yesterdayDay + yesterdayMonth + yesterdayDate) {
            return 'Yesterday';
          } else if (day + month + date === tomorrowDay + tomorrowMonth + tomorrowDate) {
            return 'Tomorrow';
          } else {
            return day + ', ' + month + ' ' + date;
          }
        } else if (type === 'year') {
          return givenDate.getYear().toString().substring(1, 3);
        } else if (type === 'fullyear') {
          return givenDate.getFullYear();
        } else if (type === 'time') {
          var hours = givenDate.getHours();
          var minutes = givenDate.getMinutes();
          var ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;
          minutes = minutes < 10 ? '0' + minutes : minutes;
          hours = hours < 10 ? '0' + hours : hours;
          var strTime = hours + ':' + minutes + ' ' + ampm;
          return strTime;
        }
      },
      'getFileIcon': function getFileIcon(fileType) {
        // File panel icon
        if (docType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeDoc"></i>';
        } else if (slideType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeSlide"></i>';
        } else if (audioType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeAudio"></i>';
        } else if (videoType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeVideo"></i>';
        } else if (imageType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeImage"></i>';
        } else if (vectorType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeVector"></i>';
        } else if (pdfType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypePDF"></i>';
        } else if (sheetType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeSheet"></i>';
        } else if (databaseType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeDatabase"></i>';
        } else if (execType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeExec"></i>';
        } else if (fontType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeFont"></i>';
        } else if (systemType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeSystem"></i>';
        } else if (zipType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeZip"></i>';
        } else if (devpType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeDevp"></i>';
        } else if (dobjType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeDObject"></i>';
        } else if (sketchType.indexOf(fileType.toUpperCase()) !== -1) {
          return '<i class="common fileTypeSketch"></i>';
        } else {
          return '<i class="common fileTypeNone"></i>';
        }
      },
      'checkTaskUser': function checkTaskUser(fN, lN, id) {
        // Check current user in task
        //#TODO :needs to remove koreWidgetSDKInstance refs
        var uId = koreWidgetSDKInstance.userInfo.id; //$.jStorage.get('currentAccount').userInfo.id;

        if (uId == id) {
          return 'You';
        } else {
          return fN + ' ' + lN.charAt(0);
        }
      },
      'getTimeLineNotification': function getTimeLineNotification(timeline) {
        // For announcement time line
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var inputDate = new Date(timeline);
        var currDate = new Date();

        if (currDate.getFullYear() - inputDate.getFullYear() >= 1) {
          return days[inputDate.getDay()] + ', ' + months[inputDate.getMonth()] + ' ' + inputDate.getDate() + ', ' + inputDate.getFullYear();
        } else {
          if (currDate.getMonth() - inputDate.getMonth() >= 1) {
            return days[inputDate.getDay()] + ', ' + months[inputDate.getMonth()] + ' ' + inputDate.getDate() + ', ' + inputDate.getFullYear();
          } else {
            if (currDate.getDate() - inputDate.getDate() === 0) {
              var minutes = '';
              var myDatedate = parseInt(timeline);
              var d = new Date(myDatedate);
              var hours = d.getHours();
              minutes = d.getMinutes().toString();
              var ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              hours = hours ? hours : 12;
              minutes = parseInt(minutes) < 10 ? '0' + minutes : minutes;
              var strTime = hours + ':' + minutes + ' ' + ampm;
              return strTime;
            } else if (currDate.getDate() - inputDate.getDate() === 1) {
              return 'Yesterday';
            } else {
              return days[inputDate.getDay()] + ', ' + months[inputDate.getMonth()] + ' ' + inputDate.getDate() + ', ' + inputDate.getFullYear();
            }
          }
        }
      }
    };

    KoreWidgetSDK.prototype.bindWidgetEvent = function () { };

    KoreWidgetSDK.prototype.openDropdown = function (data) {
      console.log(data);
    };
    KoreWidgetSDK.prototype.openPanel = function (panelName, resPopUp, heightToggle) {
      if (panelName && (panelName !== 'closePanel')) {
        $(".kore-chat-window").removeClass("selectedHeight");
      }
      if (heightToggle) {
        $(".kore-chat-window").toggleClass("selectedHeight");
      }
      var _self = this;

      var popUpStatus;

      if ((panelName === oldPanelName) || (panelName === 'closePanel')) {
        //todo:deviation:toggle fuctionality on panel click
        oldPanelName = "";
        if ($('.menuItemContainer') && $('.menuItemContainer').removeClass('selected')) {
          $('.menuItemContainer').removeClass('selected');
        }
        $('.sdkBotIcon').addClass('selected');
        localPanelDetail[panelName] = "";
        _self.clearWidgetPolling();
        $(_self.config.container.content).hide("slide", {
          direction: _self.config.direction === 'left' ? 'left' : 'right'
        }, 500);
        return false;
      }

      if (resPopUp) {
        if (!resPopUp.btnresponse) {
          return;
        }
      } else {
        popUpStatus = _self.checkWidgetSwitchEditor(panelName, oldPanelName);
      }

      if (popUpStatus) {
        return;
      }

      makeAPICall = true;

      if (localPanelDetail[panelName] !== undefined) {
        var currTime = new Date().getTime();
        var deffTime = currTime - localPanelDetail[panelName];
        var seconds = Math.floor(deffTime / 1000);

        if (seconds < 10) {
          makeAPICall = false;
        }
      }

      localPanelDetail[panelName] = new Date().getTime();
      oldPanelName = panelName;
      panelName = panelName ? panelName.toLowerCase() : '';
      clearInterval(pollingTimer);

      if (meetingTimeRef.length > 0) {
        for (var k = 0; k < meetingTimeRef.length; k++) {
          clearInterval(meetingTimeRef[k]);
        }
      }

      if (panelName === 'kora') {
        console.log('<<<<Width350>>>>');
        menuActiveTab = '';

        _self.setChatFocus();

        $('.menuItem').removeClass('active');
        $('.menuItemCntr #' + panelName).addClass('active'); // $('.menuItemCntr #' + oldPanelName).addClass('active');

        $('.centerWindow').children().not('.kore-chat-window').not('.koraPanelHeader').not('.centralLoader').remove();
      } else if (panelName === 'profile') {
        window.angularComponentReference.zone.run(function () {
          window.angularComponentShowProfile.componentFn();
        });
      } else if (panelName === 'notification') {
        window.angularComponentReference.zone.run(function () {
          window.angularCmptRefNotification.componentFn();
        });
      } else {
        _self.resetTask();

        console.log('<<<<Width350>>>>');
        menuActiveTab = panelName;
        $('.menuItem').removeClass('selected');
        $('.menuItemContainer').removeClass('selected');
        $('.sdkBotIcon').removeClass('selected');
        $('.menuItemContainer.' + panelName).addClass('selected'); // $('.menuItemCntr #' + oldPanelName).addClass('active');

        $('.centerWindow').children().not('.kore-chat-window').not('.koraPanelHeader').not('.centralLoader').remove();
        mainTemplateBdr = '';

        if ($(_self.config.container.content).is(':visible')) {
          $(_self.config.container.content).hide();
        }

        $(_self.config.container.content).show("slide", {
          direction: _self.config.direction //$.jStorage.get('menuPosition')

        }, 250);
        $(_self.config.container.content).html('<div class="loaderRing"><div></div><div></div><div></div><div></div></div>');

        _self.prepareRenderData(panelName, true);
      }
    };

    KoreWidgetSDK.prototype.checkWidgetSwitchEditor = function (newPanel, oldPanel) {
      var _self = this;

      if (newPanel !== oldPanel) {
        var componentSelectorsArray = Array.from(document.querySelectorAll('.centerWindow *')).map(function (el) {
          return el.tagName.toLowerCase();
        }).filter(function (selector) {
          return selector.startsWith('app-');
        });
        var commonKeys = editComponent.selector.filter(function (obj) {
          return componentSelectorsArray.indexOf(obj) !== -1;
        });

        if (componentSelectorsArray.length && commonKeys.length > 0) {
          var content = [{
            'id': 'skillSwitche',
            'title': 'Are you sure?',
            'desc': 'All changes made will be lost.',
            'buttons': [{
              'title': 'YES'
            }, {
              'title': 'NO'
            }]
          }];
          var actionObj = {
            "newPanel": newPanel,
            "oldPanel": oldPanel
          };

          _self.createPopup(content, JSON.stringify(actionObj), '');

          return true;
        }
      }

      return false;
    };

    KoreWidgetSDK.prototype.prepareRenderData = function (panelName) {
      var mainPanel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;
      var config = _self.config;

      clearInterval(pollingTimer); // if (meetingTimeRef.length > 0) {
      //     for (var k = 0; k < meetingTimeRef.length; k++) {
      //         clearInterval(meetingTimeRef[k]);
      //     }
      //     meetingTimeRef = [];
      // }

      for (var i = 0; i < initialWidgetData.panels.length; i++) {
        if (initialWidgetData.panels[i]._id.toLowerCase() === panelName.toLowerCase()) {
          if (mainPanel) {
            if (initialWidgetData.panels[i].widgets.length === 1) {
              initialWidgetData.panels[i].widgets[0].templateType = initialWidgetData.panels[i].widgets[0].templateType == undefined ? "Sushanth" : initialWidgetData.panels[i].widgets[0].templateType;
              var panelDetailLocal = {
                'panel': initialWidgetData.panels[i]._id,
                'subpanel': initialWidgetData.panels[i].widgets[0].id,
                'widgetTitle': initialWidgetData.panels[i].widgets[0].title || initialWidgetData.panels[i].widgets[0].name,
                'widgetTemplate': initialWidgetData.panels[i].widgets[0].templateType,
                'viewmore': false
              };
              var dataHTML = $(_self.getTemplate("mainTemplate")).tmplProxy({
                'widgetData': initialWidgetData.panels[i],
                'helpers': helpers,
                'panelDetail': panelDetailLocal
              });
              _self.bindTemplateEvents(dataHTML, 'mainTemplate');
            } else {
              var panelDetailLocal = {
                'panel': initialWidgetData.panels[i]._id,
                'viewmore': false
              };
              var dataHTML = $(_self.getTemplate("mainTemplate")).tmplProxy({
                'widgetData': initialWidgetData.panels[i],
                'helpers': helpers,
                'panelDetail': panelDetailLocal
              });
              _self.bindTemplateEvents(dataHTML, 'mainTemplate');
            }

            $(_self.config.container.content).addClass('kr-wiz-content-css');
            if ($(_self.config.container.menu).hasClass('darkTheme-kore')) {
              $(_self.config.container.content).addClass('darkTheme-kore');
              $(_self.config.container.content).removeClass('defaultTheme-kore');
              $(_self.config.container.content).removeClass('defaultTheme-kora');
              $(_self.config.container.content).removeClass('darkTheme-kora');
            } else if ($(_self.config.container.menu).hasClass('defaultTheme-kore')) {
              $(_self.config.container.content).addClass('defaultTheme-kore');
              $(_self.config.container.content).removeClass('darkTheme-kore');
              $(_self.config.container.content).removeClass('darkTheme-kora');
              $(_self.config.container.content).removeClass('defaultTheme-kora');
            } else if ($(_self.config.container.menu).hasClass('darkTheme-kora')) {
              $(_self.config.container.content).addClass('darkTheme-kora');
              $(_self.config.container.content).removeClass('darkTheme-kore');
              $(_self.config.container.content).removeClass('defaultTheme-kore');
              $(_self.config.container.content).removeClass('defaultTheme-kora');
            } else if ($(_self.config.container.menu).hasClass('defaultTheme-kora')) {
              $(_self.config.container.content).addClass('defaultTheme-kora');
              $(_self.config.container.content).removeClass('darkTheme-kora');
              $(_self.config.container.content).removeClass('defaultTheme-kore');
              $(_self.config.container.content).removeClass('darkTheme-kore');
            }
            $(_self.config.container.content).html(dataHTML);
          }
          // var refreshInterval = initialWidgetData.panels[i].widgets[0].autoRefresh.interval * 60;
          // _self.refreshData(panelName, refreshInterval);

          for (var j = 0; j < initialWidgetData.panels[i].widgets.length; j++) {
            initialWidgetData.panels[i].widgets[j].templateType = initialWidgetData.panels[i].widgets[j].templateType == undefined ? "Sushanth" : initialWidgetData.panels[i].widgets[j].templateType;
            clearInterval(initialWidgetData.panels[i].widgets[j].pollingTimer);
            if (initialWidgetData.panels[i].widgets[j].type === 'List') {
              var panelDetail = {
                'panel': initialWidgetData.panels[i]._id,
                'subpanel': initialWidgetData.panels[i].widgets[j].id,
                'widgetTitle': initialWidgetData.panels[i].widgets[j].title || initialWidgetData.panels[i].widgets[j].name,
                'widgetTemplate': initialWidgetData.panels[i].widgets[j].templateType,
                'viewmore': initialWidgetData.panels[i].widgets.length === 1 ? false : true
              };

              _self.getServerData(initialWidgetData.panels[i].widgets[j].hook.api, initialWidgetData.panels[i].widgets[j].hook.method, initialWidgetData.panels[i].widgets[j].hook.body, initialWidgetData.panels[i].widgets[j].hook.params, panelDetail);
            } else if (initialWidgetData.panels[i].widgets[j].type === 'FilteredList') {
              for (var k = 0; k < initialWidgetData.panels[i].widgets[j].filters.length; k++) {
                var panelDetail = {
                  'panel': initialWidgetData.panels[i]._id,
                  'subpanel': initialWidgetData.panels[i].widgets[j].id,
                  'widgetTitle': initialWidgetData.panels[i].widgets[j].title || initialWidgetData.panels[i].widgets[j].name,
                  'widgetTemplate': initialWidgetData.panels[i].widgets[j].templateType,
                  'viewmore': initialWidgetData.panels[i].widgets.length === 1 ? false : true,
                  'filter': initialWidgetData.panels[i].widgets[j].filters[k].id
                };

                _self.getServerData(initialWidgetData.panels[i].widgets[j].filters[k].hook.api, initialWidgetData.panels[i].widgets[j].filters[k].hook.method, initialWidgetData.panels[i].widgets[j].filters[k].hook.body, initialWidgetData.panels[i].widgets[j].filters[k].hook.params, panelDetail);
              }
            } else if (initialWidgetData.panels[i].widgets[j].type === 'UtterancesList') {
              if (initialWidgetData.panels[i].widgets[j].actions) {
                var panelDetail = {
                  'panel': initialWidgetData.panels[i]._id,
                  'subpanel': initialWidgetData.panels[i].widgets[j].id,
                  'widgetTitle': initialWidgetData.panels[i].widgets[j].title || initialWidgetData.panels[i].widgets[j].name,
                  'widgetTemplate': initialWidgetData.panels[i].widgets[j].templateType,
                  'viewmore': initialWidgetData.panels[i].widgets.length === 1 ? false : true
                };
                var dataHTML = $(_self.getTemplate("skillsTemplate")).tmplProxy({
                  'tempdata': initialWidgetData.panels[i].widgets[j],
                  'helpers': helpers,
                  'panelDetail': panelDetail
                });
                $(_self.config.container.content).find('.mainTemplateCntr#' + panelDetail.panel + ' #' + panelDetail.subpanel).html(dataHTML);
              }
            } else {
              var panelDetail = {
                'panel': initialWidgetData.panels[i]._id,
                'subpanel': initialWidgetData.panels[i].widgets[j].id,
                'widgetTitle': initialWidgetData.panels[i].widgets[j].title || initialWidgetData.panels[i].widgets[j].name,
                'widgetTemplate': initialWidgetData.panels[i].widgets[j].templateType,
                'viewmore': initialWidgetData.panels[i].widgets.length === 1 ? false : true
              }; //todo:#deviation :commented below as widget data is not avaiable yet
              //todo:deviation:mainTemplate became default template now for widget SDK
              //var dataHTML = $(_self.getTemplate("defaultTemplate")).tmplProxy({
              // var dataHTML = $(_self.getTemplate("defaultTemplate")).tmplProxy({
              //   'tempdata': initialWidgetData.panels[i].widgets[j],
              //   'helpers': helpers,
              //   'panelDetail': panelDetail,
              //   'widgetData': initialWidgetData.panels[i],
              // });
              //$(_self.config.container.content).find('.mainTemplateCntr#' + panelDetail.panel + ' #' + panelDetail.subpanel).html(dataHTML);
              //todo:#deviation :added below api call for widget SDK default case

              _self.getServerData('widgetsdk/' + config.botOptions.botInfo._id + '/widgets/' + initialWidgetData.panels[i].widgets[j]._id, 'post', {
                "from": config.botOptions.userIdentity || "user-name",
              }, {}, panelDetail);
            }
          }
        }
      }
    };

    KoreWidgetSDK.prototype.getServerDataGen = function (url, method, payload, _params) {
      var _self = this;
      var config = _self.config;
      url = _self.resolveUrl(url, {
        userId: config.botOptions.botInfo.customData.kmUId
      }, false);
      if (_params) url = url + '?' + $.param(_params);
      var apiConfigs = {
        url: _self.config.botOptions.koreAPIUrl + url,
        type: method,
        data: payload,
        async: true,
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader("Authorization", "bearer " + config.botOptions.botInfo.customData.kmToken);
        },
        success: function success(data) { },
        error: function error(err) {// errorPopup(err);
        }
      }
      if (_self.config.botOptions.botInfo && _self.config.botOptions.botInfo.botState) {
        apiConfigs.headers = { "state": _self.config.botOptions.botInfo.botState };
      }
      return $.ajax(apiConfigs);
    };

    KoreWidgetSDK.prototype.getServerData = function (url, method, payload, _params, passedJson) {
      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;
      var cacheData = _self.vars.cacheData;
      var config = _self.config;
      var userInputs = {}
      if (passedJson && passedJson.subpanel) {
        var widgetInfo = _self.getWidgetDataByWidgetId(passedJson.subpanel);
        if (widgetInfo && widgetInfo.fields && widgetInfo.fields.length) {
          for (var i = 0; i < widgetInfo.fields.length; i++) {
            if (widgetInfo.fields[i].label) {
              if (!userInputs[widgetInfo.fields[i].label]) {
                userInputs[widgetInfo.fields[i].label] = widgetInfo.fields[i].defaultValue;
              }
            }
          }
        }
      }
      payload.inputs = $.extend(payload.inputs, userInputs);
      if (_params) url = url + '?' + $.param(_params);

      for (var i = 0; i < cacheData.length; i++) {
        if (cacheData[i].api === url) {
          var xhrObject = {};
          xhrObject.passedkey = {};
          xhrObject.passedkey = passedJson;

          _self.renderTemplate(cacheData[i].response, xhrObject); // need to implement this later //

          $('.mainTemplateCntr .progress').show(); // progress meter show
        }
      }

      url = _self.resolveUrl(url, {
        userId: config.botOptions.botInfo.customData.kmUId
      }, false);

      if (makeAPICall === false) {
        $('.mainTemplateCntr .progress').hide();
        return;
      }

      return $.ajax({
        url: baseUrl + '/' + url,
        type: method,
        data: JSON.stringify(payload),
        myData: passedJson,
        contentType: "application/json",
        async: true,
        beforeSend: function beforeSend(xhr, passedkey) {
          xhr.setRequestHeader("Authorization", "bearer " + config.botOptions.botInfo.customData.kmToken);
          xhr.passedkey = passedkey.myData;
        },
        success: function success(responseData, status, xhrObject) {
          //todo:#deviation :need to correct from server
          if (responseData && responseData.data && responseData.data.length) {
            responseData = responseData.data[0];
          }

          if (responseData && responseData.responseJSON) {
            responseData = responseData.responseJSON;
          } //todo:#deviation:reading widgetTemplate from execure api

          if (responseData && _typeof(responseData) === 'object') {
            if (responseData.isAuthElement && responseData.elements && responseData.elements.length === 1) {
              responseData.templateType = 'AuthRequired';
              xhrObject.passedkey.widgetTemplate = responseData.templateType;
            } else {
              if (responseData && responseData.templateType) {
                xhrObject.passedkey.widgetTemplate = responseData.templateType;
              } else {
                xhrObject.passedkey.widgetTemplate = 'standard'; // fallback for default templates
              }

            }
          }

          for (var i = 0; i < initialWidgetData.panels.length; i++) {
            // to update widgetType//
            if (initialWidgetData.panels[i].widgets && initialWidgetData.panels[i].widgets.length && initialWidgetData.panels[i]._id === passedJson.panel) {
              initialWidgetData.panels[i].widgets.forEach(function (widget) {
                if (widget.id === passedJson.subpanel) {
                  if (responseData && responseData.templateType) {
                    widget.templateType = responseData.templateType;
                  }
                  widget.hook = {};
                  widget.hook.api = url;
                  widget.hook.method = method;
                  widget.hook.body = payload;
                  widget.hook.params = _params;
                  var refreshInterval = widget.autoRefresh.interval * 60;
                  if (widget.pollingTimer) {
                    clearInterval(widget.pollingTimer);
                  }
                  if (widget.autoRefresh && widget.autoRefresh.enabled) {
                    _self.refreshWidgetData(widget, refreshInterval, passedJson);
                  }
                }
              });
            }
          }

          $('.mainTemplateCntr .progress').hide(); // progress meter hide

          if (!responseData || responseData && _typeof(responseData) !== 'object' || _typeof(responseData) === 'object' && responseData.data && !responseData.data.length) {
            // if response is not an object //
            responseData.templateType = 'somthingWentWrong';
            responseData.errMsg = 'Oops! Something went wrong.';

            if (typeof responseData === 'string') {
              var responseCopy = responseData;
              responseData = {};
              responseData.templateType = 'somthingWentWrong';
              responseData.errMsg = 'Oops! Something went wrong.'; // responseData.errMsgDiscription = responseCopy;
            } // console.log(xhrObject);


            var dataHTML = $(_self.getTemplate("ErrorTemplate")).tmplProxy({
              'tempdata': responseData,
              'panelDetail': xhrObject.passedkey
            });

            if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel && xhrObject.passedkey.filter) {
              $(_self.config.container.content).find('.mainTemplateCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel + ' #' + xhrObject.passedkey.filter + '_content').html(dataHTML);
            } else if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel) {
              $(_self.config.container.content).find('.mainTemplateCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel + ' #' + xhrObject.passedkey.subpanel + '_content').html(dataHTML);
            }
            if (KRPerfectScrollbar) {
              _self.vars.contentPSObj = null;
              if (!_self.vars.contentPSObj) {
                _self.vars.contentPSObj = new KRPerfectScrollbar($(_self.config.container.content).find(".mainTemplateBdr").get(0), {
                  suppressScrollX: true
                });
              } else {
                _self.vars.contentPSObj.update();
              }
            }
            return;
          }

          _self.renderTemplate(responseData, xhrObject);

          var localCount = 0;

          for (var i = 0; i < cacheData.length; i++) {
            if (cacheData[i].api === url) {
              localCount = localCount + 1;
              cacheData[i].response = responseData;
            }
          }

          if (localCount === 0) {
            cacheData.push({
              'api': url,
              'response': responseData
            });
          }
        },
        error: function error(err) {
          $('.mainTemplateCntr .progress').hide();

          if (false && (err.status === 410 || err.status === 401)) {
            var content = [{
              'id': 'tokenExpired',
              'title': 'Session Expired',
              'desc': 'To continue, please sign in again.',
              'buttons': [{
                'title': 'OK'
              }]
            }];

            _self.createPopup(content, '', '');
          } else {
            var xhrObject = {};
            xhrObject.passedkey = {};
            xhrObject.passedkey = err.passedkey;
            var dataHTML = $(_self.getTemplate("ErrorTemplate")).tmplProxy({
              'tempdata': xhrObject,
              'panelDetail': xhrObject.passedkey
            });

            if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel && xhrObject.passedkey.filter) {
              $(_self.config.container.content).find('.mainTemplateCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel + ' #' + xhrObject.passedkey.filter + '_content').html(dataHTML);
            } else if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel) {
              $(_self.config.container.content).find('.mainTemplateCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel + ' #' + xhrObject.passedkey.subpanel + '_content').html(dataHTML);
            } // if (!mainTemplateBdr) {
            //   mainTemplateBdr = new PerfectScrollbar('.scroll', { suppressScrollX: true });
            // } else {
            //   mainTemplateBdr.update();
            // }


            $('.mainTemplateCntr .progress').hide(); // progress meter hide
          }
        }
      });
    };

    KoreWidgetSDK.prototype.getCacheDataByWidgetId = function (widgetId) {
      var _self = this; //var cacheData=cacheData;
      var cacheData = _self.vars.cacheData;

      var key = 'widgetsdk/' + _self.config.botOptions.botInfo._id + '/widgets/' + widgetId + '?';
      var resIndex = cacheData.findIndex(function (item) {
        return item.api === key;
      });

      if (resIndex > -1) {
        return cacheData[resIndex].response;
      } else {
        return false;
      }
    };
    KoreWidgetSDK.prototype.getPanelDataByPanelId = function (panelId) {
      var _self = this;
      var panelIndex = -1;
      var initialWidgetData = _self.vars.initialWidgetData;
      for (var i = 0; i < initialWidgetData.panels.length; i++) {
        if (initialWidgetData.panels && initialWidgetData.panels.length) {
          panelIndex = initialWidgetData.panels.findIndex(function (item) {
            return item._id === panelId
          });
        }
      }
      if (panelIndex > -1) {
        return initialWidgetData.panels[panelIndex];
      }
    };
    KoreWidgetSDK.prototype.getWidgetDataByWidgetId = function (widgetId) {
      var _self = this;
      var widgetInfo = null;
      var initialWidgetData = _self.vars.initialWidgetData;
      for (var i = 0; i < initialWidgetData.panels.length; i++) {
        if (initialWidgetData.panels[i].widgets && initialWidgetData.panels[i].widgets.length) {
          initialWidgetData.panels[i].widgets.forEach(function (item) {
            if (item.id === widgetId) {
              widgetInfo = item;
            }
          });
        }
      }
      if (widgetInfo) {
        return widgetInfo;
      }
    };
    KoreWidgetSDK.prototype.openCloseBottomOverlayContainer = function (open, htmlData) {
      var _self = this;
      if (open && htmlData) {
        $('#widgetSdkBottomOverlayContainer').html(htmlData)
        $('#widgetSdkBottomOverlayContainer').show();
      } else {
        $('#widgetSdkBottomOverlayContainer').hide();
      }
      setTimeout(function () {
        if (KRPerfectScrollbar) {
          _self.vars.contentPSObj = null;
          if (!_self.vars.contentPSObj) {
            _self.vars.contentPSObj = new KRPerfectScrollbar($('#widgetSdkBottomOverlayContainer').find(".filterTemplateCntr").get(0), {
              suppressScrollX: true
            });
          } else {
            _self.vars.contentPSObj.update();
          }
        }
      }, 100);
    }
    KoreWidgetSDK.prototype.applySortingAndFilter = function (e, bindingData, sortInputs) {
      _self = this;
      if (!bindingData.inputsPayload) {
        bindingData.inputsPayload = {};
      }
      if (bindingData && bindingData.filterOptions && bindingData.filterOptions.length) {
        // applying filters for filter payload //
        bindingData.filterOptions.forEach(function (item) {
          if (item.data && item.field && item.data.length && (((item.type == 'enum') && (item.isMulti === 'Yes')) || (item.type == 'checkbox'))) {
            item.data.forEach(function (filterValue) {
              if (filterValue && filterValue.isSelect && filterValue.value && filterValue.value.trim() !== '') {
                if (!bindingData.inputsPayload[item.field]) {
                  bindingData.inputsPayload[item.field] = [];
                }

                bindingData.inputsPayload[item.field].push(filterValue.value);
              }
            });
          }
          if (item.data && item.field && item.data.length && (((item.type == 'enum') && (item.isMulti === 'No')) || (item.type == 'radio'))) {
            item.data.forEach(function (filterValue) {
              if (filterValue && filterValue.isSelect && filterValue.value && filterValue.value.trim() !== '') {
                if (!bindingData.inputsPayload[item.field]) {
                  bindingData.inputsPayload[item.field] = {};
                }
                bindingData.inputsPayload[item.field] = filterValue.value;
              }
            });
          }
        });
      }
      if (sortInputs && typeof sortInputs === 'object') {
        bindingData.inputsPayload = $.extend(bindingData.inputsPayload, sortInputs)
      }
      _self.openCloseBottomOverlayContainer();

      var panelDetail = $(e.target).closest('[paneldetail]').attr('paneldetail');
      panelDetail = JSON.parse(panelDetail);
      var widgetId = panelDetail.subpanel;
      _self.getServerData('widgetsdk/' + _self.config.botOptions.botInfo._id + '/widgets/' + widgetId, 'post', {
        "from": _self.config.botOptions.userIdentity || "user-name",
        "inputs": bindingData.inputsPayload
      }, {}, panelDetail);
      _self.openCloseBottomOverlayContainer();
    }
    KoreWidgetSDK.prototype.applySorting = function (e, $ele, templateType, bindingData) {
      var _self = this;
      var allSorts = $(e.currentTarget).closest('dropdown-contentWidgt').find('dropdown-item');
      if (allSorts && allSorts.length) {
        allSorts.removeClass('selected');
      }
      $(e.currentTarget).addClass('selected');
      var selectedSort = $(e.currentTarget).attr('sort-obj');
      var selectedSortObj = JSON.parse(selectedSort);
      var sortInputs = {}
      sortInputs[selectedSortObj.field] = selectedSortObj.fieldValue;
      _self.applySortingAndFilter(e, bindingData, sortInputs);
    };
    KoreWidgetSDK.prototype.openWidgetFilters = function (e, ele, templateType, bindingData) {
      var _self = this;
      var widgetId = $(e.target).closest('.widgetContParent').attr('id');
      var res = bindingData || _self.getCacheDataByWidgetId(widgetId);
      if (res.filterOptions && res.filterOptions.length) {
        for (var i = 0; i < res.filterOptions.length; i++) {
          res.filterOptions[i].selected = false;
          if (res.filterOptions[i] && res.filterOptions[i].data && res.filterOptions[i].data.length) {
            for (var j = 0; j < res.filterOptions[i].data.length; j++) {
              if (res.filterOptions[i].data[j].isSelect) {
                res.filterOptions[i].selected = true;
              }
            }
          }
        }
        var templateData = {
          filterOptions: res.filterOptions,
          sortOptions: res.sortOptions,
          inputsPayload: {}
        };
        var filterHTML = $(_self.getTemplate("filterTemplate")).tmplProxy(templateData);

        _self.bindTemplateEvents(filterHTML, 'filterTemplate', templateData);
        _self.openCloseBottomOverlayContainer(true, filterHTML);
      }
    }
    KoreWidgetSDK.prototype.bindTemplateEvents = function (ele, templateType, bindingData) {
      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;

      var initialWidgetData = initialWidgetData;
      var $ele = $(ele);
      if (templateType === 'mainTemplate') {
        $ele.off('click').on('click', function (e) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        })
      } else if (templateType === 'widgetHeader') {
        $ele.off('click', '.action').on('click', '.action', function (e) {
          e.stopPropagation();
          var actionObjString = $(e.currentTarget).attr('actionObj');
          var actionObj = {};

          if (actionObjString) {
            actionObj = JSON.parse(actionObjString);
          }
          var actionType = $(e.currentTarget).attr('action-type');
          if (typeof actionObj == 'object' && actionObj.link) {
            window.open(actionObj.link);
          } else if (actionObj && (actionType === 'filter')) {
            _self.openWidgetFilters(e, $ele, templateType, bindingData);
          } else if (actionObj && (actionType === 'sortOptions')) {
            _self.applySorting(e, $ele, templateType, bindingData);
          } else {
            _self.triggerAction(actionObj);
          }
        });
      } else if (templateType === 'defaultFilesTemplate') {
        $ele.on('click', '.filter-btn', function (e) {
          var widgetId = $(e.target).closest('.widgetContParent').attr('id');
          var res = _self.getCacheDataByWidgetId(widgetId); // var templateData={
          var templateData = {
            filterOptions: res.filterOptions,
            sortOptions: res.sortOptions,
            inputsPayload: {}
          };
          var appliedFilters = res.appliedFilters;
          var appliedSortBy = res.appliedSort; //for applying  appliedFilters

          appliedFilters.forEach(function (appliedFilter) {
            var filterIndex = templateData.filters.findIndex(function (item) {
              return item.field = appliedFilter.field;
            });

            if (filterIndex > -1) {
              var targetFilter = templateData.filters[filterIndex];

              if (appliedFilter && appliedFilter.fieldValue && appliedFilter.fieldValue.length) {
                appliedFilter.fieldValue.forEach(function (apliedFilterValue) {
                  var targetFilterItemIndex = -1;
                  targetFilterItemIndex = targetFilter.data.findIndex(function (item) {
                    return item.value === apliedFilterValue;
                  });

                  if (targetFilterItemIndex > -1) {
                    templateData.filters[filterIndex].data[targetFilterItemIndex].selected = true;
                    templateData.filters[filterIndex].selected = true;
                  }
                });
              }
            }
          }); //for applying appliedSortBy

          if (appliedSortBy && appliedSortBy.fieldValue) {
            var sortByItemIndex = templateData.sortOptions.findIndex(function (item) {
              return item.field === appliedSortBy.field;
            });

            if (sortByItemIndex > -1) {
              var targetSortByItem = templateData.sortOptions[sortByItemIndex];
              templateData.sortOptions[sortByItemIndex].selected = true;
            }
          }

          var filterHTML = $(_self.getTemplate("filterTemplate")).tmplProxy(templateData);

          _self.bindTemplateEvents(filterHTML, 'filterTemplate', templateData);

          var listContainer = $(e.target).closest('.filesCntr');
          filterHTML.insertAfter(listContainer);
          setTimeout(function () {
            if (KRPerfectScrollbar) {
              _self.vars.contentPSObj = null;
              if (!_self.vars.contentPSObj) {
                _self.vars.contentPSObj = new KRPerfectScrollbar($('#widgetSdkBottomOverlayContainer').find(".filterTemplateCntr").get(0), {
                  suppressScrollX: true
                });
              } else {
                _self.vars.contentPSObj.update();
              }
            }
          }, 100);
          listContainer.hide();
        });
      } else if (templateType === 'filterTemplate') {
        $ele.on('click', '.open-filters', function (e) {
          selectedFilter = $(e.currentTarget).attr('id');
          if (selectedFilter) {
            var selectedFilterIndex = bindingData.filterOptions.findIndex(function (item) {
              return item.field === selectedFilter;
            });
            if (selectedFilterIndex > -1) {
              bindingData.filterSelectedItems = bindingData.filterOptions[selectedFilterIndex];
            }
          }
          var filterOptionsHTML = $(_self.getTemplate("filterOptionsTemplate")).tmplProxy(bindingData);
          _self.bindTemplateEvents(filterOptionsHTML, 'filterOptionsTemplate', bindingData);
          var filterContainer = $(e.target).closest('.filterTemplateCntr');
          filterOptionsHTML.insertAfter(filterContainer);
          filterContainer.remove();
          // setTimeout(function(){
          if (KRPerfectScrollbar) {
            _self.vars.contentPSObj = null;
            if (!_self.vars.contentPSObj) {
              _self.vars.contentPSObj = new KRPerfectScrollbar($('#widgetSdkBottomOverlayContainer').find(".filterOptionsTemplateCtrl").get(0), {
                suppressScrollX: true
              });
            } else {
              _self.vars.contentPSObj.update();
            }
          }
          // },100);
        });
        $ele.on('click', '.radiodivsdk', function (e) {
          var filterType = $(e.currentTarget).attr('filter-type');
          var filterIndex = $(e.currentTarget).attr('filter-index');
          if (filterIndex) {
            filterIndex = parseInt(filterIndex);
          }
          bindingData.filterOptions[filterIndex].data.forEach(function (item) {
            item.isSelect = false;
          });
          if ($(e.currentTarget).find('.taskSelRadio').length && filterType === 'radioFilter') {
            var selectedBy = $(e.currentTarget).find("input[name='radioFilterVertical']:checked");
            if (selectedBy && selectedBy.length) {
              for (var i = 0; i < selectedBy.length; i++) {
                var selectedValueIndex = $($(selectedBy)[i]).attr('value-index');
                if (selectedValueIndex) {
                  selectedValueIndex = parseInt(selectedValueIndex);
                  bindingData.filterOptions[filterIndex].data[selectedValueIndex].isSelect = true;
                }
              }
            }
          }
          if ($(e.currentTarget).find('.taskSelRadio').length && filterType === 'checkBoxFilter') {
            var checkedElements = $(e.currentTarget).find("input[element='filterCheckbox']:checked");
            if (checkedElements && checkedElements.length) {
              for (var i = 0; i < checkedElements.length; i++) {
                var selectedValueIndex = $($(checkedElements)[i]).attr('value-index');
                if (selectedValueIndex) {
                  selectedValueIndex = parseInt(selectedValueIndex);
                  bindingData.filterOptions[filterIndex].data[selectedValueIndex].isSelect = true;
                }
              }
            }
          }
        });
        $ele.on('click', '.wid-filter-close', function (e) {
          $(e.target).closest(".widgetContParent").find(".filesCntr").show();
          $(e.target).closest(".widgetContParent").find(".filterTemplateCntr").remove();
          e.stopPropagation();
          _self.openCloseBottomOverlayContainer();
        });
        $ele.on('click', '.apply-btn', function (e) {
          _self.applySortingAndFilter(e, bindingData);
        });
      } else if (templateType === 'filterOptionsTemplate') {
        $ele.on('click', '.tickMarkContainer', function (e) {
          var filterValue = $(e.currentTarget).attr('field');
          $(e.currentTarget).closest('.filterOptionsTemplateCtrl').find('.tickMarkContainer').removeClass('selected');
          $(e.currentTarget).addClass('selected');
        });
        $ele.on('click', '.selectDropValue', function (e) {
          var filterValue = $(e.target).attr('valueObj');
          var filterValueObj = JSON.parse(filterValue);
        });
        $ele.on('click', '.wid-filter-close', function (e) {
          var filterHTML = $(_self.getTemplate("filterTemplate")).tmplProxy(bindingData);

          _self.bindTemplateEvents(filterHTML, 'filterTemplate', bindingData);

          var listContainer = $(e.target).closest('.filterOptionsTemplateCtrl');
          filterHTML.insertBefore(listContainer);
          $(e.target).closest(".widgetContParent").find(".filterTemplateCntr").show();
          $('#widgetSdkBottomOverlayContainer').find(".filterOptionsTemplateCtrl").remove();
          e.stopPropagation();
        });
        $ele.on('click', '.apply-btn', function (e) {
          var _filterEle = $(e.target).closest(".filterOptionsTemplateCtrl");
          if (bindingData.filterSelectedItems && bindingData.filterSelectedItems.isMulti === 'No') {
            var selectedFilterEle = $(e.currentTarget).closest('.filterOptionsTemplateCtrl').find('.tickMarkContainer.selected');
            if (selectedFilterEle && selectedFilterEle.length) {
              bindingData.filterSelectedItems.data.forEach(function (filter) {
                if (filter.title === $(selectedFilterEle[0]).attr('field')) {
                  filter.isSelect = true;
                } else {
                  filter.isSelect = false;
                }
              });
            }
          } else {
            var selectedFilters = _filterEle.find("input[class='taskSelRadio']:checked");

            var selectedFiltersCount = 0;

            if (selectedFilters.length) {
              // partial of all buttons selected //
              bindingData.filterSelectedItems.data.forEach(function (filter) {
                filter.isSelect = false;
                selectedFilters.each(function (i, filterEle) {
                  var $filterEle = $(filterEle);

                  var _value = $filterEle.val();

                  var _key = bindingData.filterSelectedItems.field;

                  if (_value !== "" && filter.value === _value) {
                    filter.isSelect = true;
                    selectedFiltersCount = selectedFiltersCount + 1;
                  }
                });
              });
            } else {
              // No buttons selected //
              bindingData.filterSelectedItems.data.forEach(function (filter) {
                filter.isSelect = false;
              });
            }

            if (selectedFiltersCount) {
              bindingData.filterSelectedItems.selected = true; //if filterButtons are selected //
            } else {
              bindingData.filterSelectedItems.selected = false; //if filterButtons are not selected //
            }
          }
          if (bindingData.filterSelectedItems.field && bindingData.filterSelectedItems) {
            var selectedFilterIndex = bindingData.filterOptions.findIndex(function (item) {
              return item.field === bindingData.filterSelectedItems.field;
            });

            if (selectedFilterIndex > -1) {
              bindingData.filterOptions[selectedFilterIndex] = bindingData.filterSelectedItems;
            }
          }
          var filterHTML = $(_self.getTemplate("filterTemplate")).tmplProxy(bindingData);
          _self.bindTemplateEvents(filterHTML, 'filterTemplate', bindingData);

          var listContainer = $(e.target).closest('.filterOptionsTemplateCtrl');
          filterHTML.insertBefore(listContainer);
          $(e.target).closest(".widgetContParent").find(".filterTemplateCntr").show();
          $('#widgetSdkBottomOverlayContainer').find(".filterOptionsTemplateCtrl").remove();
          // setTimeout(function(){
          if (KRPerfectScrollbar) {
            _self.vars.contentPSObj = null;
            if (!_self.vars.contentPSObj) {
              _self.vars.contentPSObj = new KRPerfectScrollbar($('#widgetSdkBottomOverlayContainer').find(".filterTemplateCntr").get(0), {
                suppressScrollX: true
              });
            } else {
              _self.vars.contentPSObj.update();
            }
          }
          // },100);
          e.stopPropagation();
        });
      } else if (templateType === 'TabbedList' || templateType === 'List') {
        $($ele.find(".tabs")[0]).addClass("active");
        var titleEle = $ele.find('.listViewLeftContent');
        if (titleEle && titleEle.length) {
          for (i = 0; i < titleEle.length; i++) {
            var ele = titleEle[i];
            if ($(ele).attr('col-size')) {
              var width = _self.getColumnWidth($(ele).attr('col-size'));
              $(ele).css("width", width + '%');
            }
          }
        }
        console.log(bindingData);
        $ele.off('click', '.listViewLeftContent').on('click', '.listViewLeftContent', function (e) {
          e.stopPropagation();
          var actionObjString = $(e.currentTarget).attr('actionObj');
          var actionObj = {};

          if (actionObjString) {
            actionObj = JSON.parse(actionObjString);
          }

          _self.triggerAction(actionObj);
        });
        $ele.off('click', '.moreValue').on('click', '.moreValue', function (e) {
          e.stopPropagation();
        });
        $ele.off('click', '.tabs').on('click', '.tabs', function (e) {
          e.stopPropagation();

          var _selectedTab = $(e.target).text();

          var msgData = $(e.target).closest(".tab-list-template").data();
          var panelDetail = $(e.target).closest(".tab-list-template").attr('panelDetail');

          if (panelDetail) {
            panelDetail = JSON.parse(panelDetail);
          }

          delete msgData.tmplItem;
          var tempObj = {
            'tempdata': msgData,
            'dataItems': msgData.elements,
            'helpers': helpers,
            'viewmore': panelDetail.viewmore,
            'panelDetail': panelDetail
          };

          if (msgData && msgData.tabs && Object.keys(msgData.tabs) && Object.keys(msgData.tabs).length) {
            tempObj = {
              'tempdata': msgData,
              'dataItems': msgData.tabs[_selectedTab],
              'tabs': Object.keys(msgData.tabs),
              'helpers': helpers,
              'viewmore': panelDetail.viewmore,
              'panelDetail': panelDetail
            };
          }

          var viewTabValues = $(_self.getTemplate("TabbedList")).tmplProxy(tempObj);
          $(viewTabValues).find(".tabs[data-tabid='" + _selectedTab + "']").addClass("active");
          $(e.target).closest(".tab-list-template").html($(viewTabValues).html());
        });
        $ele.off('click', '#showMoreContents').on('click', '#showMoreContents', function (e) {
          e.stopPropagation();
          $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showMoreBottom").removeClass('hide');
        });
        $ele.off('click', '.wid-temp-showMoreClose').on('click', '.wid-temp-showMoreClose', function (e) {
          e.stopPropagation();
          $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showMoreBottom").addClass('hide');
        });
        $ele.off('click', '.wid-temp-showActions').on('click', '.wid-temp-showActions', function (e) {
          e.stopPropagation();

          if ($(e.currentTarget) && $(e.currentTarget).closest(".listViewTmplContentChild") && $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions") && $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions").hasClass('active')) {
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions").removeClass('active');
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".meetingActionButtons").addClass('hide'); // $(e.currentTarget).closest(".listViewTmplContentChild").find("#showMoreContents").removeClass('hide');
          } else {
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions").addClass('active');
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".meetingActionButtons").removeClass('hide'); // $(e.currentTarget).closest(".listViewTmplContentChild").find("#showMoreContents").addClass('hide');
          }
        });
        $ele.off('click', '.action').on('click', '.action', function (e) {
          e.stopPropagation();
          var actionObjString = $(e.currentTarget).attr('actionObj');
          var actionObj = {};

          if (actionObjString) {
            actionObj = JSON.parse(actionObjString);
          } // var eData={
          //   postbackValue: actionObj.payload,
          //   payload:actionObj,
          //   type:'widget'
          // }
          // if(eData && eData.postbackValue && eData.payload){
          //   _self.triggerEvent('postback',eData);
          // }

          if (typeof actionObj == 'object' && actionObj.link) {
            window.open(actionObj.link);
          } else {
            _self.triggerAction(actionObj);
          }
        });
        // $('.widgetContentPanel').css({
        //   'padding': '10px 20px'
        // });
      } else if (templateType === 'TableList') {
        $($ele.find(".tabs")[0]).addClass("active");
        var titleEle = $ele.find('.listViewLeftContent');
        if (titleEle && titleEle.length) {
          for (i = 0; i < titleEle.length; i++) {
            var ele = titleEle[i];
            if ($(ele).attr('col-size')) {
              var width = _self.getColumnWidth($(ele).attr('col-size'));
              $(ele).css("width", width + '%');
            }
          }
        }
        $ele.off('click', '.listViewLeftContent').on('click', '.listViewLeftContent', function (e) {
          e.stopPropagation();
          var actionObjString = $(e.currentTarget).attr('actionObj');
          var actionObj = {};

          if (actionObjString) {
            actionObj = JSON.parse(actionObjString);
          }

          _self.triggerAction(actionObj);
        });
        $ele.off('click', '.moreValue').on('click', '.moreValue', function (e) {
          e.stopPropagation();
        });
        $ele.off('click', '#showMoreContents').on('click', '#showMoreContents', function (e) {
          e.stopPropagation();
          $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showMoreBottom").removeClass('hide');
        });
        $ele.off('click', '.wid-temp-showMoreClose').on('click', '.wid-temp-showMoreClose', function (e) {
          e.stopPropagation();
          $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showMoreBottom").addClass('hide');
        });
        $ele.off('click', '.action').on('click', '.action', function (e) {
          e.stopPropagation();
          var actionObjString = $(e.currentTarget).attr('actionObj');
          var actionObj = {};

          if (actionObjString) {
            actionObj = JSON.parse(actionObjString);
          } // var eData={
          //   postbackValue: actionObj.payload,
          //   payload:actionObj,
          //   type:'widget'
          // }
          // if(eData && eData.postbackValue && eData.payload){
          //   _self.triggerEvent('postback',eData);
          // }

          if (typeof actionObj == 'object' && actionObj.link) {
            window.open(actionObj.link);
          } else {
            _self.triggerAction(actionObj);
          }
        });
        // $('.widgetContentPanel').css({
        //   'padding': '10px 20px'
        // });
      }
      else if (templateType === 'pieChartTemplate' || templateType === 'barChartTemplate' || templateType === 'lineChartTemplate') {
        $ele.off('click', '#showMoreContents').on('click', '#showMoreContents', function (e) {
          $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showMoreBottom").removeClass('hide');
        });
        $ele.off('click', '.wid-temp-showMoreClose').on('click', '.wid-temp-showMoreClose', function (e) {
          $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showMoreBottom").addClass('hide');
        });
        $ele.off('click', '.wid-temp-showActions').on('click', '.wid-temp-showActions', function (e) {
          if ($(e.currentTarget) && $(e.currentTarget).closest(".listViewTmplContentChild") && $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions") && $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions").hasClass('active')) {
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions").removeClass('active');
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".meetingActionButtons").addClass('hide'); // $(e.currentTarget).closest(".listViewTmplContentChild").find("#showMoreContents").removeClass('hide');
          } else {
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".wid-temp-showActions").addClass('active');
            $(e.currentTarget).closest(".listViewTmplContentChild").find(".meetingActionButtons").removeClass('hide'); // $(e.currentTarget).closest(".listViewTmplContentChild").find("#showMoreContents").addClass('hide');
          }
        });
        $ele.off('click', '.action').on('click', '.action', function (e) {
          var actionObjString = $(e.currentTarget).attr('actionObj');
          var actionObj = {};

          if (actionObjString) {
            actionObj = JSON.parse(actionObjString);
          }

          _self.triggerAction(actionObj);
        });
        // $('.widgetContentPanel').css({
        //   'padding': '10px 20px'
        // });
      } else if (templateType === 'ActionItems') {
        $ele.on('click', '.hasMoreActionItems', function (e) {
          $(e.target).closest('.actionItemBody').find('.actionBtnTitle').each(function (index, ele) {
            if ($(ele).hasClass('hide')) {
              $(ele).removeClass('hide');
              $(ele).addClass('show');
            }
          });
          $(e.target).addClass('hide');
        });
        $ele.on('click', '.actionBtnTitle', function (e) {
          console.log('abc....');
        });
      } else if (templateType === 'AuthRequired') {
        $ele.off('click', '.action').on('click', '.action', function (e) {
          e.stopPropagation();
          var actionObjString = $(e.currentTarget).attr('actionObj');
          var panelDetails = $(e.currentTarget).attr('panelDetail');
          var actionObj = {}
          if (actionObjString) {
            // try {
            actionObj = JSON.parse(actionObjString);
            var child;
            function checkChild() {
              if (child && (typeof child === 'object') && child.closed) {
                _self.refreshElement(panelDetails);
                clearInterval(timer);
              }
            }
            if (actionObj.url) {
              child = window.open(actionObj.url);
              var timer = setInterval(checkChild, 500);
            }
            // } catch(e){
            //   console.log('invalid JSON')
            // }
          }
        });
      } else if (templateType === 'menu') {
        $ele.off('click').on('click', function (e) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        })
        $ele.off('click', '.menuIconMobile').on('click', '.menuIconMobile', function (e) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        })
        $ele.find('#defaultTheme-kore span').addClass('checkMarkIcon');
        $ele.find('.sdkBotIcon').addClass('selected');
        $ele.off('click', '.action').on('click', '.action', function (e) {
          if (e && e.currentTarget && $(e.currentTarget)[0]) {
            var addtheme = $(e.currentTarget)[0].id;
            $($('.themeName').find('span')).removeClass('checkMarkIcon');
            if ($('#' + addtheme) && $('#' + addtheme).find('span')) {
              $($('#' + addtheme).find('span')).addClass('checkMarkIcon');
            }
            if (addtheme !== 'darkTheme-kore') {
              $(_self.config.container.menu).removeClass('darkTheme-kore');
              if ($(_self.config.container.content)) {
                $(_self.config.container.content).removeClass('darkTheme-kore');
              }
            }
            if (addtheme !== 'defaultTheme-kore') {
              $(_self.config.container.menu).removeClass('defaultTheme-kore');
              if ($(_self.config.container.content)) {
                $(_self.config.container.content).removeClass('defaultTheme-kore');
              }
            }
            if (addtheme !== 'defaultTheme-kora') {
              $(_self.config.container.menu).removeClass('defaultTheme-kora');
              if ($(_self.config.container.content)) {
                $(_self.config.container.content).removeClass('defaultTheme-kora');
              }
            }
            if (addtheme !== 'darkTheme-kora') {
              $(_self.config.container.menu).removeClass('darkTheme-kora');
              if ($(_self.config.container.content)) {
                $(_self.config.container.content).removeClass('darkTheme-kora');
              }
            }
            $(_self.config.container.menu).addClass(addtheme);
            $(_self.config.container.content).addClass(addtheme);
          }
        });
      }
    };

    KoreWidgetSDK.prototype.getHTMLTemplate = function (responseData, xhrObject) {
      var _self = this;

      var dataHTML;

      if (xhrObject && xhrObject.passedkey) {
        if (xhrObject.passedkey.widgetTemplate === 'calendar_events') {
          var ele = $.extend(true, {}, responseData);
          var ele1 = $.extend(true, {}, responseData);

          var elements = _self.getResolveMeeting(ele);

          ele1.elements = elements;
          dataHTML = $(_self.getTemplate("meetingTemplate")).tmplProxy({
            'tempdata': ele1,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'task_list') {
          dataHTML = $(_self.getTemplate("tasksTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'file_list') {
          dataHTML = $(_self.getTemplate("filesTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'Sushanth' || xhrObject.passedkey.widgetTemplate === 'custom_style') {
          dataHTML = $(_self.getTemplate("defaultFilesTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'chartList') {
          dataHTML = $(_self.getTemplate("chartListTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'knowledge_list') {
          dataHTML = $(_self.getTemplate("knowledgeTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'TrendingHashTag') {
          dataHTML = $(_self.getTemplate("hashtagTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'announcement_list') {
          dataHTML = $(_self.getTemplate("announcementTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
        } else if (xhrObject.passedkey.widgetTemplate === 'List') {
          dataHTML = $(_self.getTemplate("List")).tmplProxy({
            'tempdata': responseData,
            'dataItems': responseData.elements,
            'helpers': helpers,
            'viewmore': xhrObject.passedkey.viewmore,
            'panelDetail': xhrObject.passedkey
          });

          _self.bindTemplateEvents(dataHTML, 'List');
        } else if (xhrObject.passedkey.widgetTemplate === 'TabbedList') {
          var tempObj = {
            'tempdata': responseData,
            'dataItems': responseData.elements,
            'helpers': helpers,
            'viewmore': xhrObject.passedkey.viewmore,
            'panelDetail': xhrObject.passedkey
          };

          if (responseData && responseData.tabs && Object.keys(responseData.tabs) && Object.keys(responseData.tabs).length) {
            tempObj = {
              'tempdata': responseData,
              'dataItems': responseData.tabs.Tab1,
              'tabs': Object.keys(responseData.tabs),
              'helpers': helpers,
              'viewmore': xhrObject.passedkey.viewmore,
              'panelDetail': xhrObject.passedkey
            };
          }

          dataHTML = $(_self.getTemplate("TabbedList")).tmplProxy(tempObj);
          dataHTML.data(responseData);

          _self.bindTemplateEvents(dataHTML, 'TabbedList');
        } else if (xhrObject.passedkey.widgetTemplate === 'piechart') {
          var dataHTML = $(_self.getTemplate("pieChartTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
          setTimeout(function () {
            var dimens = {};
            dimens.width = 350;
            dimens.height = 175;
            dimens.legendRectSize = 10;
            dimens.legendSpacing = 2.4;

            _self.bindTemplateEvents(dataHTML, 'pieChartTemplate');

            if (responseData.pie_type === "donut") {
              KoreGraphAdapter.drawD3PieDonut(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #piechart', 12, 'donut_legend');
            } else {
              KoreGraphAdapter.drawD3Pie(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #piechart', 12);
            }
          }, 100);
        } else if (xhrObject.passedkey.widgetTemplate === 'linechart') {
          var dataHTML = $(_self.getTemplate("lineChartTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
          setTimeout(function () {
            var dimens = {};
            dimens.width = 350;
            dimens.height = 175;
            dimens.outerWidth = 450;
            dimens.outerHeight = 360;
            dimens.innerWidth = 210;
            dimens.innerHeight = 250;
            dimens.legendRectSize = 10;
            dimens.legendSpacing = 2.4;

            _self.bindTemplateEvents(dataHTML, 'lineChartTemplate');

            KoreGraphAdapter.drawD3lineChartV2(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #linechart', 12);
          }, 100);
        } else if (xhrObject.passedkey.widgetTemplate === 'barchart') {
          var dataHTML = $(_self.getTemplate("barChartTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });
          setTimeout(function () {
            var dimens = {};
            dimens.width = 350;
            dimens.height = 175;
            dimens.legendRectSize = 10;
            dimens.legendSpacing = 2.4;
            dimens.outerWidth = 450;
            dimens.outerHeight = 360;
            dimens.innerWidth = 230;
            dimens.innerHeight = 250;
            dimens.legendRectSize = 15;
            dimens.legendSpacing = 4;


            _self.bindTemplateEvents(dataHTML, 'barChartTemplate');

            if (responseData.stacked == false && responseData.direction == 'vertical') {
              KoreGraphAdapter.drawD3barChart(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #barchart', 12);
            } else if (responseData.stacked == false && responseData.direction == 'horizontal') {
              dimens.outerWidth = 420;
              dimens.outerHeight = 360;
              dimens.innerWidth = 240;
              dimens.innerHeight = 250;
              KoreGraphAdapter.drawD3barHorizontalbarChart(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #barchart', 12);
            } else if (responseData.stacked == true && responseData.direction == 'vertical') {
              KoreGraphAdapter.drawD3barVerticalStackedChart(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #barchart', 12);
            } else if (responseData.stacked == true && responseData.direction == 'horizontal') {
              dimens.outerWidth = 370;
              dimens.outerHeight = 310;
              dimens.innerWidth = 170;
              dimens.innerHeight = 200;
              KoreGraphAdapter.drawD3barStackedChart(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #barchart', 12);
            } // if(responseData.pie_type==="donut"){
            //   KoreGraphAdapter.drawD3barChart(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #piechart', 12,'donut_legend');
            // }else{
            //   KoreGraphAdapter.drawD3Pie(responseData, dimens, '.widgetContParent#' + xhrObject.passedkey.subpanel + ' #piechart', 12);
            // }

          }, 100);
        } else if (xhrObject.passedkey.widgetTemplate === 'ActionItems') {
          dataHTML = $(_self.getTemplate("ActionItems")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });

          _self.bindTemplateEvents(dataHTML, 'ActionItems');
        } else if (xhrObject.passedkey.widgetTemplate === 'AuthRequired') {
          dataHTML = $(_self.getTemplate("AuthRequired")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });

          _self.bindTemplateEvents(dataHTML, 'AuthRequired');
        } else if (xhrObject.passedkey.widgetTemplate === 'TableList') {
          dataHTML = $(_self.getTemplate("TableList")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey,
            'viewmore': true,
          });
          _self.bindTemplateEvents(dataHTML, 'TableList');
        } else {
          //#todo:deviation : making "defaultFilesTemplate" as default template, naming should correct though
          //var dataHTML = $(_self.getTemplate("defaultTemplate")).tmplProxy({
          dataHTML = $(_self.getTemplate("defaultFilesTemplate")).tmplProxy({
            'tempdata': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey
          });

          _self.bindTemplateEvents(dataHTML, 'defaultFilesTemplate');
        }
      }

      if (dataHTML) {
        return dataHTML;
      }
    };
    KoreWidgetSDK.prototype.prepereWidgetHeader = function (responseData, xhrObject) {
      var _self = this;
      var widgetData = _self.getWidgetDataByWidgetId(xhrObject.passedkey.subpanel);
      if (typeof widgetData === 'object') {
        if (responseData && (
          (responseData.sortOptions && responseData.sortOptions.length) ||
          (responseData.filterOptions && responseData.filterOptions.length) ||
          (responseData.headerOptions && responseData.headerOptions.type === "menu" && responseData.headerOptions.menu && responseData.headerOptions.menu.length) ||
          (responseData.headerOptions && responseData.headerOptions.type === "text" && responseData.headerOptions.text) ||
          (responseData.headerOptions && responseData.headerOptions.type === "image" && responseData.headerOptions.image && responseData.headerOptions.image.image_src) ||
          (responseData.headerOptions && responseData.headerOptions.type === "button" && responseData.headerOptions.button && responseData.headerOptions.button.title) ||
          (responseData.headerOptions && responseData.headerOptions.type === "url" && responseData.headerOptions.url && responseData.headerOptions.url.title))) {
          var headerHtml = $(_self.getTemplate("widgetHeader")).tmplProxy({
            'tempData': responseData,
            'helpers': helpers,
            'panelDetail': xhrObject.passedkey,
            'widgetData': widgetData
          });
          _self.bindTemplateEvents(headerHtml, 'widgetHeader', responseData);
          $('#' + xhrObject.passedkey.subpanel + '.widgetPanel').find('.panelHeader').html(headerHtml);
        }
      }
    }
    KoreWidgetSDK.prototype.renderTemplate = function (responseData, xhrObject) {
      var _self = this;
      if (xhrObject && xhrObject.passedkey) {
        _self.prepereWidgetHeader(responseData, xhrObject);
        var dataHTML = _self.getHTMLTemplate(responseData, xhrObject);
        if (!xhrObject.passedkey.showAll) {
          if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel && xhrObject.passedkey.filter) {
            $(_self.config.container.content).find('.mainTemplateCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel + ' #' + xhrObject.passedkey.filter + '_content').html(dataHTML);
          } else if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel) {
            $(_self.config.container.content).find('.mainTemplateCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel + ' #' + xhrObject.passedkey.subpanel + '_content').html(dataHTML);
          }
          if (KRPerfectScrollbar) {
            _self.vars.contentPSObj = null;
            if (!_self.vars.contentPSObj) {
              _self.vars.contentPSObj = new KRPerfectScrollbar($(_self.config.container.content).find(".mainTemplateBdr").get(0), {
                suppressScrollX: true
              });
            } else {
              _self.vars.contentPSObj.update();
            }
          }

        } else {
          if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel && xhrObject.passedkey.filter) {
            $(_self.config.container.content).find('.viewMoreCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel + ' #' + xhrObject.passedkey.filter + '_content').html(dataHTML);
          } else if (xhrObject.passedkey.panel && xhrObject.passedkey.subpanel) {
            $(_self.config.container.content).find('.viewMoreCntr#' + xhrObject.passedkey.panel + ' #' + xhrObject.passedkey.subpanel).html(dataHTML);
          } // if (!viewMoreCntrScroll) {
          //   viewMoreCntrScroll = new PerfectScrollbar('.viewMoreCntr .scroll', { suppressScrollX: true });
          // } else {
          //   viewMoreCntrScroll.update();
          // }
          if (KRPerfectScrollbar) {
            _self.vars.contentPSObj = null;
            if (!_self.vars.contentPSObj) {
              _self.vars.contentPSObj = new KRPerfectScrollbar($(_self.config.container.content).find(".mainTemplateBdr").get(0), {
                suppressScrollX: true
              });
            } else {
              _self.vars.contentPSObj.update();
            }
          }
        }
      } //#todo //applyWidgetOverlay();
    };

    KoreWidgetSDK.prototype.resolveUrl = function (toResolveUrl, values, deleteProp) {
      var _regExToParamName = /\:([a-zA-Z]+)/g;
      return toResolveUrl.replace(_regExToParamName, function (matchStr, valName) {
        var r = values[valName];

        if (typeof r !== 'undefined' && typeof r !== null) {
          if (deleteProp) {
            delete values[valName];
          }

          return r;
        }

        return matchStr;
      });
    };

    KoreWidgetSDK.prototype.getResolveMeeting = function (obj) {
      var _self = this;

      var items = [];

      if (obj && obj.elements && obj.elements.length) {
        for (i = 0; i < obj.elements.length; i++) {
          var temp = [];
          var actionsArr = obj.elements[i].actions;

          for (var k = 0; k < actionsArr.length; k++) {
            var actionObj = actionsArr[k];

            if (actionObj.type !== "dial") {
              temp.push(actionObj);
            }
          }

          obj.elements[i].actions = temp;
          var ele = Object.assign({}, obj.elements[i]);

          var slots = _self.getMeetingSlot(ele.data.duration);

          for (j = 0; j < slots.length; j++) {
            var today = new Date();
            var localStarttime = new Date(slots[j].start);

            if ((today.getFullYear() <= localStarttime.getFullYear() && today.getMonth() <= localStarttime.getMonth() && today.getDate() <= localStarttime.getDate() || today.getTime() <= slots[j].start) && slots[j].end <= obj.cursor.end) {
              ele.data.duration = slots[j];
              var startTime = new Date(slots[j].start);
              var endTime = new Date(slots[j].end);

              if (slots.length === 1) {
                if (ele.data.isAllDay) {
                  ele.day = 'All Day';
                  ele.break = true;
                  ele.localDay = {
                    'intial': 'All Day'
                  };
                  items.push(_self.cloneMessage1(ele));
                } else if (startTime.getHours() === 0 && startTime.getMinutes() === 0 && endTime.getHours() === 23 && endTime.getMinutes() === 59) {
                  ele.day = 'All Day';
                  ele.break = true;
                  ele.localDay = {
                    'intial': 'All Day'
                  };
                  items.push(_self.cloneMessage1(ele));
                } else {
                  items.push(_self.cloneMessage1(ele));
                }
              } else {
                var off = j + 1;

                if (startTime.getHours() === 0 && startTime.getMinutes() === 0 && endTime.getHours() === 23 && endTime.getMinutes() === 59) {
                  ele.day = 'All Day';
                  ele.break = true;

                  if (off === slots.length) {
                    ele.localDay = {
                      'intial': 'All Day',
                      'last': ' (Day ' + off + '/' + slots.length + ')'
                    };
                  } else {
                    ele.localDay = {
                      'intial': 'All Day',
                      'last': ' (Day ' + off + '/' + slots.length + ')'
                    };
                  }
                } else if (off !== slots.length) {
                  ele.day = 'From' + getTime(startTime) + ' Day (' + off + '/' + slots.length + ')';
                  ele.break = true;
                  ele.localDay = {
                    'intial': 'From',
                    'time': getTime(startTime),
                    'last': ' (Day ' + off + '/' + slots.length + ')'
                  };
                } else if (off === slots.length) {
                  ele.day = 'Till' + getTime(endTime) + ' Day (' + off + '/' + slots.length + ')';
                  ele.break = true;
                  ele.localDay = {
                    'intial': 'Till',
                    'time': getTime(endTime),
                    'last': ' (Day ' + off + '/' + slots.length + ')'
                  };
                }

                items.push(_self.cloneMessage1(ele));
              }
            }
          }
        }

        items.sort(_self.compare);
        return items;
      } else {
        return items;
      }
    };

    KoreWidgetSDK.prototype.filterTabs = function (parentId, subpanelId, filterId) {
      var _self = this;

      $(parentId + ' #' + subpanelId + ' .' + subpanelId + '_content').hide(); // hiding the content panel

      $(parentId + ' #' + subpanelId + ' #' + filterId + '_content').show(); // showing the content panel

      $(parentId + ' #' + subpanelId + ' .filterCntr li').addClass('unActive').removeClass('active'); // removing active class from all and adding unactive class to all

      $(parentId + ' #' + subpanelId + ' #' + filterId).addClass('active').removeClass('unActive'); // add active in current tab and remove unactive

      _self.resetTask();
    };

    KoreWidgetSDK.prototype.viewMorePanel = function (obj) {
      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;

      var viewMoreObj;
      intializeOffset = 0;

      try {
        viewMoreObj = JSON.parse(obj);

        for (var i = 0; i < initialWidgetData.panels.length; i++) {
          if (initialWidgetData.panels[i]._id.toLowerCase() === viewMoreObj.panel.toLowerCase()) {
            for (var j = 0; j < initialWidgetData.panels[i].widgets.length; j++) {
              initialWidgetData.panels[i].widgets[j].templateType = initialWidgetData.panels[i].widgets[j].templateType == undefined ? "Sushanth" : initialWidgetData.panels[i].widgets[j].templateType;

              if (initialWidgetData.panels[i].widgets[j]._id === viewMoreObj.subpanel) {
                var ele = $.extend(true, {}, initialWidgetData.panels[i]);
                ele.widgets = [];
                ele.widgets.push(initialWidgetData.panels[i].widgets[j]);
                if (ele.widgets.length === 1) {
                  var dataHTML = $(_self.getTemplate("viewMoreTemplate")).tmplProxy({
                    'widgetData': ele,
                    'helpers': helpers,
                    'panelDetail': viewMoreObj
                  });
                } else {
                  for (var k = 0; k < ele.widgets.length; k++) {
                    if (ele.widgets[k].id !== viewMoreObj.subpanel) {
                      ele.widgets.splice(k, 1);
                    }
                  }

                  var dataHTML = $(_self.getTemplate("viewMoreTemplate")).tmplProxy({
                    'widgetData': ele,
                    'helpers': helpers,
                    'panelDetail': viewMoreObj
                  });
                }

                $(_self.config.container.content).append(dataHTML);

                if (initialWidgetData.panels[i].widgets[j].hook && initialWidgetData.panels[i].widgets[j].hook.api) {
                  var panelDetail = {
                    'panel': initialWidgetData.panels[i]._id,
                    'subpanel': initialWidgetData.panels[i].widgets[j].id,
                    'widgetTemplate': initialWidgetData.panels[i].widgets[j].templateType,
                    'viewmore': false,
                    'showAll': true
                  };

                  _self.getServerData(initialWidgetData.panels[i].widgets[j].hook.api, initialWidgetData.panels[i].widgets[j].hook.method, initialWidgetData.panels[i].widgets[j].hook.body, initialWidgetData.panels[i].widgets[j].hook.params, panelDetail);
                } else {
                  if (initialWidgetData.panels[i].widgets[j].filters) {
                    for (var l = 0; l < initialWidgetData.panels[i].widgets[j].filters.length; l++) {
                      var panelDetail = {
                        'panel': initialWidgetData.panels[i]._id,
                        'subpanel': initialWidgetData.panels[i].widgets[j].id,
                        'widgetTemplate': initialWidgetData.panels[i].widgets[j].templateType,
                        'viewmore': false,
                        'filter': initialWidgetData.panels[i].widgets[j].filters[l].id,
                        'showAll': true
                      };

                      _self.getServerData(initialWidgetData.panels[i].widgets[j].filters[l].hook.api, initialWidgetData.panels[i].widgets[j].filters[l].hook.method, initialWidgetData.panels[i].widgets[j].filters[l].hook.body, initialWidgetData.panels[i].widgets[j].filters[l].hook.params, panelDetail);
                    }
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.log('Not getting JSON:' + e);
      }
    };

    KoreWidgetSDK.prototype.scrollData = function (paneldata, filterdata, panelType, e) {
      var _self = this;

      var paneldata = JSON.parse(paneldata);
      var filterdata = JSON.parse(filterdata);
      var pos = e.scrollTop + e.offsetHeight;
      var max = e.scrollHeight;

      if (pos === max) {
        if (filterdata && filterdata.hook && filterdata.hook.api) {
          var apiAjax = filterdata.hook.api; //cacheData Api

          if (filterdata.hook.params) {
            apiAjax = apiAjax + '?' + $.param(filterdata.hook.params);
          }

          var resultApiCache = cacheData.filter(function (obj) {
            return obj.api === apiAjax;
          });
          var viewMoredata = resultApiCache[0].response;

          if (viewMoredata && viewMoredata.hasMore) {
            paneldata.viewmore = panelType === "maintemplate" ? false : false;

            _self.scrollServerData(viewMoredata.hook.api, viewMoredata.hook.method, viewMoredata.hook.body, paneldata, e, viewMoredata, panelType);
          }
        }
      }
    };
    KoreWidgetSDK.prototype.scrollServerData = function (url, method, payload, passedJson, e, viewMoredata, panelType) {
      var _self = this;

      url = _self.resolveUrl(url, {
        userId: config.botOptions.botInfo.customData.kmUId
      }, false);
      if (viewMoredata.hook.params) url = viewMoredata.hook.api + '?' + $.param(viewMoredata.hook.params);
      return $.ajax({
        url: baseUrl + '/' + url,
        type: method,
        data: payload,
        myData: passedJson,
        async: true,
        beforeSend: function beforeSend(xhr, passedkey) {
          xhr.setRequestHeader("Authorization", "bearer " + config.botOptions.botInfo.customData.kmToken);
          xhr.passedkey = passedkey.myData;
        },
        success: function success(responsedata, status, xhrObject) {
          var responseData = _self.mergedata(viewMoredata, responsedata);

          xhrObject.passedkey['showAll'] = panelType === "maintemplate" ? false : true;

          if (xhrObject && xhrObject.passedkey) {
            if (xhrObject.passedkey.widgetTemplate === 'calendar_events') {
              var ele = $.extend(true, {}, responseData);
              var ele1 = $.extend(true, {}, responseData);

              var elements = _self.getResolveMeeting(ele);

              ele1.elements = elements;
              var dataHTML = $(_self.getTemplate("meetingTemplate")).tmplProxy({
                'tempdata': ele1,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey,
                'showAll': panelType === "maintemplate" ? false : true
              });
            } else if (xhrObject.passedkey.widgetTemplate === 'task_list') {
              var dataHTML = $(_self.getTemplate("tasksTemplate")).tmplProxy({
                'tempdata': responseData,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey,
                'showAll': panelType === "maintemplate" ? false : true
              });
            } else if (xhrObject.passedkey.widgetTemplate === 'cloudFiles') {
              var dataHTML = $(_self.getTemplate("filesTemplate")).tmplProxy({
                'tempdata': responseData,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey,
                'showAll': panelType === "maintemplate" ? false : true
              });
            } else if (xhrObject.passedkey.widgetTemplate === 'Sushanth' || xhrObject.passedkey.widgetTemplate === 'custom_style') {
              var dataHTML = $(_self.getTemplate("defaultFilesTemplate")).tmplProxy({
                'tempdata': responseData,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey
              });
            } else if (xhrObject.passedkey.widgetTemplate === 'knowledge_list') {
              var dataHTML = $(_self.getTemplate("knowledgeTemplate")).tmplProxy({
                'tempdata': responseData,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey,
                'showAll': panelType === "maintemplate" ? false : true
              });
            } else if (xhrObject.passedkey.widgetTemplate === 'TrendingHashTag') {
              var dataHTML = $(_self.getTemplate("hashtagTemplate")).tmplProxy({
                'tempdata': responseData,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey,
                'showAll': panelType === "maintemplate" ? false : true
              });
            } else if (xhrObject.passedkey.widgetTemplate === 'announcement_list') {
              var dataHTML = $(_self.getTemplate("announcementTemplate")).tmplProxy({
                'tempdata': responseData,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey,
                'showAll': panelType === "maintemplate" ? false : true
              });
            } else {
              var dataHTML = $(_self.getTemplate("defaultTemplate")).tmplProxy({
                'tempdata': responseData,
                'helpers': helpers,
                'panelDetail': xhrObject.passedkey
              });
            }

            $(e).html(dataHTML);

            if (panelType === "viewmore" && !viewMoreCntrScroll) {
              viewMoreCntrScroll = new PerfectScrollbar('.viewMoreCntr .scroll', {
                suppressScrollX: true
              });
            } else {
              if (panelType === "viewmore") {
                viewMoreCntrScroll.update();
              }
            }
          }
        },
        error: function error(err) {
          var xhrObject = {};
          xhrObject.passedkey = {};
          xhrObject.passedkey = err.passedkey;
          var dataHTML = $(_self.getTemplate("ErrorTemplate")).tmplProxy({
            'tempdata': xhrObject,
            'panelDetail': xhrObject.passedkey
          });
          $(e).html(dataHTML);
          if (KRPerfectScrollbar) {
            _self.vars.contentPSObj = null;
            if (!_self.vars.contentPSObj) {
              _self.vars.contentPSObj = new KRPerfectScrollbar($(_self.config.container.content).find(".mainTemplateBdr").get(0), {
                suppressScrollX: true
              });
            } else {
              _self.vars.contentPSObj.update();
            }
          }
        }
      });
    };

    KoreWidgetSDK.prototype.mergedata = function (oldJson, newJson) {
      var oldkeys = Object.keys(oldJson);
      var newkeys = Object.keys(newJson);
      var commonKeys = oldkeys.filter(function (obj) {
        return newkeys.indexOf(obj) !== -1;
      }); //updating oldJson based on newJson

      for (var k = 0; k < commonKeys.length; k++) {
        if (commonKeys[k] === 'elements') {
          oldJson.elements = oldJson.elements.concat(newJson.elements);
        } else {
          delete oldJson[commonKeys[k]];
          oldJson[commonKeys[k]] = newJson[commonKeys[k]];
        }
      }

      return oldJson;
    };

    KoreWidgetSDK.prototype.setChatFocus = function () {
      var _self = this;

      $('.menuItemCntr .menuItem').removeClass('active');
      $('.menuItemCntr #kora').addClass('active');
      menuActiveTab = '';

      _self.resetTask();

      clearInterval(pollingTimer);

      if (meetingTimeRef.length > 0) {
        for (var k = 0; k < meetingTimeRef.length; k++) {
          clearInterval(meetingTimeRef[k]);
        }
      }

      if ($(_self.config.container.content).is(':visible')) {
        $(_self.config.container.content).hide("slide", {
          direction: _self.config.direction //$.jStorage.get('menuPosition')

        }, 500);
      }

      $('.chatInputBox').focus();
      $('.centerWindow').children().not('.kore-chat-window').not('.koraPanelHeader').not('.centralLoader').remove();
    };

    KoreWidgetSDK.prototype.removeViewMore = function () {
      var _self = this;

      $(_self.config.container.content).find('.viewMoreCntr').remove();
    };
    KoreWidgetSDK.prototype.getColumnWidth = function (width) {
      var _self = this;
      var newWidth;
      var widthToApply = '100%';
      if (width) {
        newWidth = width.replace(/[^\d.-]/g, '');
        console.log(width)
        try {
          widthToApply = 100 - parseInt(newWidth, 10);
        } catch (e) {
          console.log(width);
        }
        return widthToApply;
      }
    };

    KoreWidgetSDK.prototype.refreshElement = function (panelDetails, refreshFullpanel, widgetData) {
      // need to correct with filter implementation form and imputs mainlt//
      var _self = this;
      var _config = this.config;


      if (panelDetails) {
        try {
          var panelDetails = JSON.parse(panelDetails);
          if (refreshFullpanel) {
            _self.prepareRenderData(panelDetails.panel);
          } else {
            if (widgetData) {
              clearInterval(widgetData.pollingTimer);
            }
            $('.widgetContParent#' + panelDetails.subpanel).find('.progress').show();
            _self.getServerData('widgetsdk/' + _config.botOptions.botInfo._id + '/widgets/' + panelDetails.subpanel, 'post', {}, {
              "from": _config.botOptions.userIdentity || "user-name"
            }, panelDetails);
          }
        } catch (e) {
          console.log('invalidjson');
        }
      }
    };
    KoreWidgetSDK.prototype.refreshWidgetData = function (widgetData, time, panelDetail) {
      var _self = this;
      var currTime = new Date().getTime();
      var givenTime = new Date().getTime() + 1000 * time;
      givenTime = parseInt(givenTime);
      if ($(_self.config.container.content).find('.mainTemplateCntr#' + panelDetail.panel).is(':visible') && currTime < givenTime) {
        _self.startWidgetPolling(widgetData, currTime, givenTime, panelDetail);
      } else {
        clearInterval(widgetData.pollingTimer);
      }
    };
    KoreWidgetSDK.prototype.clearWidgetPolling = function (widgetData) {
      var _self = this;
      if (widgetData) {
        clearInterval(widgetData.pollingTimer);
      } else {
        if (_self.vars.initialWidgetData && _self.vars.initialWidgetData.panels && _self.vars.initialWidgetData.panels.length) {
          for (var i = 0; i < _self.vars.initialWidgetData.panels.length; i++) {
            //todo: deviation :adding "id" from "_id"
            if (_self.vars.initialWidgetData.panels[i].widgets && _self.vars.initialWidgetData.panels[i].widgets.length) {
              _self.vars.initialWidgetData.panels[i].widgets.forEach(function (widget) {
                if (widget.pollingTimer) {
                  clearInterval(widget.pollingTimer);
                }
              });
            } //todo: deviation :added fallback icon for panels
          }
        }
      }
    }
    KoreWidgetSDK.prototype.startWidgetPolling = function (widgetData, currTime, givenTime, panelDetail) {
      var _self = this;
      widgetData.pollingTimer = setInterval(function () {
        currTime = currTime + 5000;
        if (givenTime < currTime) {
          clearInterval(widgetData);
          var panelDetailsString = JSON.stringify(panelDetail);
          _self.refreshElement(panelDetailsString, false, widgetData);
        }
      }, 5000);
      console.log(widgetData);
    };
    KoreWidgetSDK.prototype.refreshData = function (panelName, time) {
      var _self = this;

      var currTime = new Date().getTime();
      var givenTime = new Date().getTime() + 1000 * time;
      givenTime = parseInt(givenTime);

      if ($(_self.config.container.content).find('.mainTemplateCntr#' + panelName).is(':visible') && currTime < givenTime) {
        _self.startPolling(panelName, currTime, givenTime);
      } else {
        clearInterval(pollingTimer);

        if (meetingTimeRef.length > 0) {
          for (var k = 0; k < meetingTimeRef.length; k++) {
            clearInterval(meetingTimeRef[k]);
          }
        }
      }
    };

    KoreWidgetSDK.prototype.startPolling = function (panelName, currTime, givenTime) {
      var _self = this;

      pollingTimer = setInterval(function () {
        currTime = currTime + 5000;

        if (givenTime < currTime) {
          clearInterval(pollingTimer);

          if (meetingTimeRef.length > 0) {
            for (var k = 0; k < meetingTimeRef.length; k++) {
              clearInterval(meetingTimeRef[k]);
            }
          }

          meetingTimeRef = [];

          _self.prepareRenderData(panelName, false);
        }
      }, 5000);
    };

    KoreWidgetSDK.prototype.resetTask = function () {
      taskList = [];
      taskTitle = {};
      $('.viewMoreCntr .viewTask').find('[type="checkbox"]').prop('checked', false);
      $('.viewMoreCntr .taskSelectCntr,.viewMoreCntr .taskSelectFootCntr').hide();
      $('.allTaskCntr .viewTask').removeClass('selected');
    };

    KoreWidgetSDK.prototype.meetingTimer = function (tdata, m_Data, index) {
      var _self = this; //#TODO
      // if (this.constructor !== KoreWidgetSDK) {
      //   _self = koreWidgetSDKInstance;
      // }


      if (index === 0) {
        meetingArray = [];

        if (meetingTimeRef.length > 0) {
          for (var k = 0; k < meetingTimeRef.length; k++) {
            clearInterval(meetingTimeRef[k]);
          }
        }

        meetingTimeRef = [];
      }

      m_Data.data.duration.objId = "m_" + index;
      meetingArray.push(m_Data.data.duration);
      var m_startTime = m_Data.data.duration.start; // meeting start timeStamp

      var m_endTime = m_Data.data.duration.end; // meeting end timeStamp

      var dayType = helpers.getTimeline(m_startTime, "fulldate", "meetings");
      var timeStatus = helpers.compareCurntTimeAndTimln_minutes(m_startTime, m_endTime, "textFormat");
      meetingTimeRef[index] = null;
      m_Data.data.duration.dayType = dayType;
      m_Data.data.duration.index = index;
      m_Data.data.duration.timeStatus = timeStatus;

      _self.startTimer(meetingArray[index]);

      return timeStatus;
    };

    KoreWidgetSDK.prototype.startTimer = function (mObj) {
      var _self = this; //#TODO
      // if(this.constructor!==KoreWidgetSDK){
      //   _self=koreWidgetSDKInstance;
      // }


      if (meetingTimeRef[mObj.index] === null) {
        var meetingTimerv = setInterval(function () {
          // console.log(meetingTimeRef);
          var timeStatus = helpers.compareCurntTimeAndTimln_minutes(mObj.start, mObj.end, "textFormat");
          var dayType = helpers.getTimeline(mObj.start, "fulldate", "meetings");

          if (mObj.dayType && dayType !== mObj.dayType || mObj.timeStatus && timeStatus === "Now" && mObj.timeStatus !== timeStatus) {
            // console.log(mObj.index);
            // console.log(mObj.dayType);
            // console.log(dayType);
            // console.log(mObj.timeStatus);
            // console.log(timeStatus);
            _self.prepareRenderData("meetings", true);
          } else {
            $("#" + mObj.objId).html(timeStatus);
          }
        }, 30 * 1000);
        meetingTimeRef[mObj.index] = meetingTimerv;
      }
    }; //********************original widgetEvents.js end */
    //********************original widgetTemplateEvent.js start */


    var taskList = [],
      taskTitle = {},
      viewMoreScrollBox = null;

    KoreWidgetSDK.prototype.passHashTag = function (uttarence) {
      var message = 'find the articles with ' + uttarence;
      window['chatWinRef'].sendMessage($('.chatInputBox'), message, {}, 'onlyMessage');
    };

    KoreWidgetSDK.prototype.openArticle = function (kId) {
      window.angularComponentReference.zone.run(function () {
        window.angularComponentReference.componentFn({
          'id': kId
        });
      });
    };

    KoreWidgetSDK.prototype.openAnnouncement = function (kId) {
      window.angularComponentReference.zone.run(function () {
        window.viewMoreKnowledgeAnncCmp.componentFn({
          'id': kId,
          'viewType': 'announceWidgetView'
        });
      });
    };

    KoreWidgetSDK.prototype.openLink = function (url) {
      if (url) {
        window.open(url, '_blank');
      }
    };

    KoreWidgetSDK.prototype.passTaskUtterances = function (e, actionIndex) {
      var _self = this;

      var taskData = JSON.parse($(e).attr('payload'));
      message = taskData.actions[actionIndex].utterance.replace(/qwertyuiopasdfghjklzxcvbnmdouble/g, "\"");
      message = taskData.actions[actionIndex].utterance.replace(/qwertyuiopasdfghjklzxcvbnm/g, "'");

      if ($('.switchKoraDD .switchHeader .skillNameTxt').text().trim().toLowerCase() !== "kora") {
        var desc = $('.switchKoraDD .switchHeader .skillNameTxt').text().trim();
        var content = [{
          'id': 'taskBotInfo',
          'title': 'Switch Skill',
          'desc': 'This action will end your conversation with ' + desc + ' skill and move to Kora. Do you want to continue? ',
          'buttons': [{
            'title': 'YES'
          }, {
            'title': 'NO'
          }]
        }];

        _self.createPopup(content, taskData.id, 'Ask Kora ' + message);
      } else {
        _self.passUtterances(taskData.id, message);
      }
    };

    KoreWidgetSDK.prototype.passUtterances = function (idss, message, evt) {
      var _self = this;

      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }

      if (idss == 'url') {
        window.open(message, '_blank');
        return;
      }

      var parmaMessage = {
        ids: []
      };
      parmaMessage.ids = [];
      parmaMessage.ids.push(idss);
      var actionObj = $(evt.currentTarget).attr('actionobj');
      actionObj = JSON.parse(actionObj);
      var eData = {
        payload: parmaMessage,
        type: 'widget'
      };

      _self.triggerAction(actionObj, eData); // if(actionObj.payload){
      //   eData.payload=actionObj.payload;
      // }
      // if(actionObj.nlmeta){
      //   eData.nlmeta=actionObj.nlmeta;
      // }
      // if(actionObj.customdata){
      //   eData.customdata=actionObj.customdata;
      // }
      // _self.triggerEvent('postback',eData);
      // //$(_self).triggerHandler('postback',{"some":"obj","message":message});
      // //window['chatWinRef'].sendMessage($('.chatInputBox'), message, parmaMessage, 'widget');
      // _self.setChatFocus();

    };

    KoreWidgetSDK.prototype.triggerEvent = function (eventName, data) {
      var _self = this;

      if (_self.events && _self.events[eventName]) {
        _self.events[eventName](data);

        _self.setChatFocus();
      }
    };

    KoreWidgetSDK.prototype.triggerAction = function (actionObj, postData) {
      var _self = this;

      if (actionObj.type === "url") {
        window.open(actionObj.url, "_blank");
        return;
      }

      var eData = postData || {};

      if (actionObj.utterance) {
        eData.utterance = actionObj.utterance;
      }

      if (actionObj.payload) {
        eData.payload = actionObj.payload;
      }

      if (actionObj.nlMeta) {
        eData.nlMeta = actionObj.nlMeta;
      }

      if (actionObj.customdata) {
        eData.customData = actionObj.customData;
      }

      _self.triggerEvent('onPostback', eData);
      _self.openPanel('closePanel');
      _self.setChatFocus();
    };

    KoreWidgetSDK.prototype.checkCurrentUser = function (oId, aId) {
      var _self = this;

      var uId = _self.config.userInfo.id; //$.jStorage.get('currentAccount').userInfo.id;

      if (oId == uId && aId == uId) {
        return true;
      } else {
        return false;
      }
    };

    KoreWidgetSDK.prototype.categoriseMeetingDayWise = function (mData) {
      var ele = object.assign({}, mData);

      for (var k = 0; k < ele.length; k++) {
        var dayType = helpers.getTimeline(ele.data.duration.start, "fulldate", "meetings");

        if (dayType === "Next Inline") { } else if (dayType === 'Later Today') { } else { }
      }
    };

    KoreWidgetSDK.prototype.showDropdown = function (obj) {
      if ($(obj).next().hasClass('dropdown-contentWidgt')) {
        $(obj).next().toggleClass('show');
      }

      $('.dropdown-contentWidgt.show').not($(obj).next()).removeClass('show');
    } // Close the dropdown if the user clicks outside of it
      ;

    (function () {
      window.onclick = function (event) {
        if (!event.target.matches('.dropbtnWidgt')) {
          var dropdowns = document.getElementsByClassName("dropdown-contentWidgt");
          var i;

          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];

            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }
        }
      };
    })();

    KoreWidgetSDK.prototype.addArticleAnnouncement = function (type) {
      if (type === 'Article') {
        window.angularComponentReference.zone.run(function () {
          window.addKnowledge.componentFn();
        });
      } else if (type === 'Announcement') {
        window.angularComponentReference.zone.run(function () {
          window.addAnnouncement.componentFn();
        });
      }
    };

    KoreWidgetSDK.prototype.passMeetingUtterances = function (_this) {
      var _self = this;

      mainObj = $(_this).attr('mainObj');
      actionObj = $(_this).attr('actionObj');
      var actionObjJson = JSON.parse(actionObj);
      var eData = {
        utterance: actionObjJson.utterance,
        payload: actionObjJson.payload,
        type: 'widget'
      };

      if (actionObjJson.payload) {
        eData.payload = actionObjJson.payload;
      }

      if (actionObjJson.nlmeta) {
        eData.nlmeta = actionObjJson.nlmeta;
      }

      if (actionObjJson.customdata) {
        eData.customdata = actionObjJson.customdata;
      }

      _self.triggerEvent('onPostback', eData); // if ($('.switchKoraDD .switchHeader .skillNameTxt').text().trim().toLowerCase() !== "kora") {
      //   var desc = $('.switchKoraDD .switchHeader .skillNameTxt').text().trim();
      //   var content = [{
      //     'id': 'meetingInfo',
      //     'title': 'Switch Skill',
      //     'desc': 'This action will end your conversation with ' + desc + ' skill and move to Kora. Do you want to continue?',
      //     'buttons': [
      //       { 'title': 'YES' },
      //       { 'title': 'NO' }
      //     ]
      //   }]
      //   _self.createPopup(content, actionObj, mainObj);
      // } else {
      //   _self.meetingAction(actionObj, mainObj);
      // }

    };

    KoreWidgetSDK.prototype.meetingAction = function (actionObj, mainObj) {
      try {
        actionObj = JSON.parse(actionObj);
        mainObj = JSON.parse(mainObj);
        var temp = new Object();
        temp['title'] = mainObj.title;
        temp['duration'] = mainObj.data.duration;
        temp['where'] = mainObj.location;
        temp['color'] = mainObj.data.color;
        temp['htmlLink'] = mainObj.data.htmlLink;
        temp['eventId'] = mainObj.data.eventId;
        temp['attendees'] = mainObj.data.attendees;
        temp['isAllDay'] = mainObj.data.isAllDay;
        temp['meetJoin'] = mainObj.data.meetJoin;
        temp['isOrganizer'] = mainObj.data.isOrganizer;
        temp['description'] = mainObj.data.description;
        temp['mId'] = mainObj.meetingId;

        if (actionObj.type === 'postback') {
          var parmaMessage = {
            ids: [mainObj.data.eventId]
          };
          window['chatWinRef'].sendMessage($('.chatInputBox'), actionObj.utterance, parmaMessage, 'widget');
          setChatFocus();
        } else if (actionObj.type === 'view_details') {
          window.angularComponentReference.zone.run(function () {
            window.openMeetingDetail.componentFn(temp);
          });
        } else if (actionObj.type === 'open_form') {
          window.angularComponentReference.zone.run(function () {
            window.openCreateNotes.componentFn(temp);
          });
        } else if (actionObj.type === 'url') {
          window.open(actionObj.url, '_blank');
        }
      } catch (e) {
        console.log('Exception occur:' + e);
      }
    };

    KoreWidgetSDK.prototype.taskkAction = function (tId, taskName, e) {
      if (taskList.indexOf(tId) >= 0) {
        taskList.splice(taskList.indexOf(tId), 1);
        $(e).parents('.viewTask').removeClass('selected');
      } else {
        taskTitle[tId] = taskName;
        taskList.push(tId);
        $(e).parents('.viewTask').addClass('selected');
      }

      if (taskList.length === 1) {
        $(".viewMoreCntr .mainTemplateBdr .widgetContentPanel").css({
          'height': 'calc(100% - 135px - ' + $(".taskSelectFootCntr").height() + 'px)'
        });
      }

      if (taskList.length === 0) {
        $(".viewMoreCntr .mainTemplateBdr .widgetContentPanel").css({
          'height': 'calc(100% - 135px)'
        });
      }

      if (taskList.length) {
        $('.viewMoreCntr .taskSelectCntr,.viewMoreCntr .taskSelectFootCntr').show();
        var task = taskList.length === 1 ? 'task' : 'tasks';
        $('.viewMoreCntr .taskSelectCntr .taskCount').text(taskList.length + ' ' + task + ' selected');
      } else {
        $('.viewMoreCntr .taskSelectCntr,.viewMoreCntr .taskSelectFootCntr').hide();
      } // $(e)[0].scrollIntoView(false);
      // $(e)[0].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    };

    KoreWidgetSDK.prototype.removeTaskSelection = function () {
      resetTask();

      if (taskList.length === 0) {
        $(".viewMoreCntr .mainTemplateBdr .widgetContentPanel").css({
          'height': 'calc(100% - 135px)'
        });
      }
    };

    KoreWidgetSDK.prototype.taskSend = function (type) {
      var _self = this;

      if ($('.switchKoraDD .switchHeader .skillNameTxt').text().trim().toLowerCase() !== "kora") {
        var desc = $('.switchKoraDD .switchHeader .skillNameTxt').text().trim();
        var content = [{
          'id': 'taskInfo',
          'title': 'Switch Skill',
          'desc': 'This action will end your conversation with ' + desc + ' skill and move to Kora. Do you want to continue? ',
          'buttons': [{
            'title': 'YES'
          }, {
            'title': 'NO'
          }]
        }];

        _self.createPopup(content, type, '');
      } else {
        _self.sendTaskAction(type, 'normal');
      }
    };

    KoreWidgetSDK.prototype.taskCheckbox = function (taskId) {
      if (taskList.indexOf(taskId) >= 0) {
        return true;
      } else {
        return false;
      }
    };

    KoreWidgetSDK.prototype.sendTaskAction = function (type, actionPlace) {
      var msg = '';
      var parmaMessage = {
        ids: taskList
      };

      if (type === 'complete') {
        if (taskList.length === 1) {
          msg = 'Complete task - ' + taskTitle[taskList[0]];
        } else {
          msg = 'Complete selected tasks';
        }
      } else if (type === 'changeduedate') {
        if (taskList.length === 1) {
          msg = 'Change due date of task - ' + taskTitle[taskList[0]];
        } else {
          msg = 'Change due date of the selected tasks';
        }
      }

      if (actionPlace === 'switchbot') {
        msg = 'Ask Kora ' + msg;
      }

      window['chatWinRef'].sendMessage($('.chatInputBox'), msg, parmaMessage, 'meeting_action');
      taskList = [];
      taskTitle = {};
      $(_self.config.container.content).find('.viewMoreCntr').remove();
    };

    KoreWidgetSDK.prototype.popupAction = function (data, title, _this) {
      var _self = this;

      var actionObj = $(_this).attr('actionObj');
      var mainObj = $(_this).attr('mainObj');

      try {
        var loData = JSON.parse(data);
        var loTitle = title.toLowerCase();

        if (loTitle === 'no') {
          if (loData[0].id === 'skillSwitche') {
            $('.mgrCntr').find('#preview_' + loData[0]['id']).fadeOut('fast', function () {
              $('.mgrCntr').find('#preview_' + loData[0]['id']).remove();
            });
            $('.mgrCntr').find('#popup_' + loData[0]['id']).fadeOut('fast', function () {
              $('.mgrCntr').find('#popup_' + loData[0]['id']).remove();
            });
            actionObj.btnresponse = false;
            openPanel(actionObj.oldPanel, actionObj);
            return;
          }

          $('.mgrCntr').find('#preview_' + loData[0]['id']).fadeOut('slow', function () {
            $('.mgrCntr').find('#preview_' + loData[0]['id']).remove();
          });
          $('.mgrCntr').find('#popup_' + loData[0]['id']).fadeOut('slow', function () {
            $('.mgrCntr').find('#popup_' + loData[0]['id']).remove();
          });
        } else if (loTitle === 'yes') {
          if (loData[0].id === 'meetingInfo') {
            var lactionObj = JSON.parse(actionObj);
            lactionObj.utterance = 'Ask Kora ' + lactionObj.utterance;

            _self.meetingAction(JSON.stringify(lactionObj), mainObj);
          } else if (loData[0].id === 'taskInfo') {
            _self.sendTaskAction(actionObj, 'switchbot');
          } else if (loData[0].id === 'taskBotInfo') {
            _self.passUtterances(actionObj, mainObj);
          } else if (loData[0].id === 'skillSwitche') {
            $('.mgrCntr').find('#preview_' + loData[0]['id']).fadeOut('fast', function () {
              $('.mgrCntr').find('#preview_' + loData[0]['id']).remove();
            });
            $('.mgrCntr').find('#popup_' + loData[0]['id']).fadeOut('fast', function () {
              $('.mgrCntr').find('#popup_' + loData[0]['id']).remove();
            });
            var actionObj = JSON.parse(actionObj);
            actionObj.btnresponse = true;
            openPanel(actionObj.newPanel, actionObj);
            return;
          }

          $('.mgrCntr').find('#preview_' + loData[0]['id']).fadeOut('slow', function () {
            $('.mgrCntr').find('#preview_' + loData[0]['id']).remove();
          });
          $('.mgrCntr').find('#popup_' + loData[0]['id']).fadeOut('slow', function () {
            $('.mgrCntr').find('#popup_' + loData[0]['id']).remove();
          });
        } else if (loTitle.toLowerCase() === 'ok') {
          if (loData[0].id === 'tokenExpired') {
            window.angularComponentReference.zone.run(function () {
              window.componentRefsessionTmout.componentFn();
            });
          }
        }
      } catch (e) {
        console.log('Exception occur: ' + e);
      }
    };

    KoreWidgetSDK.prototype.createPopup = function (content, actionObj, mainObj) {
      var _self = this;

      var dataHTML = $(_self.getTemplate("popUpTemplate")).tmplProxy({
        'tempdata': content,
        'actionObj': actionObj,
        'mainObj': mainObj
      });
      $('.mgrCntr').append(dataHTML);
    };

    KoreWidgetSDK.prototype.toggelMeetingActionBtn = function (id, e) {
      if ($(e).children().hasClass("icon-Arrow_Drop_Down_Up")) {
        $(e).children().removeClass("icon-Arrow_Drop_Down_Up");
        $(e).children().addClass("icon-Arrow_Drop_Down");
      } else {
        $(e).children().addClass("icon-Arrow_Drop_Down_Up");
        $(e).children().removeClass("icon-Arrow_Drop_Down");
      }

      $("#" + id).slideToggle("slow");
    };

    KoreWidgetSDK.prototype.hexToRGBMeeting = function (hex, alpha) {
      if (!alpha) {
        if ($("body").hasClass("darkTheme")) {
          alpha = 0.7;
        } else {
          alpha = 0.3;
        }
      }

      var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

      if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
    };

    KoreWidgetSDK.prototype.isURL = function (str) {
      function hasWhiteSpace(text) {
        return /\s/g.test(text);
      }

      var statusWhiteSpace = hasWhiteSpace(str);

      if (statusWhiteSpace) {
        str = str.split(/[ ]+/);
        str = str[0];
      } // var pattern = new RegExp('^((https|http)?:\\/\\/)?' + // protocol
      //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      //     '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      //     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      //     '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      //     '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      //     console.log(pattern.test(str));


      var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

      if (res) {
        return {
          status: true,
          location: str
        };
      } else {
        return {
          status: false,
          location: str
        };
      }
    }; //********************original widgetTemplateEvent.js end */


    KoreWidgetSDK.prototype.getTemplateMethods = function () {
      var _self = this;

      var methodMap = {};
      var templateMethodsArr = ["openPanel", "filterTabs", "viewMorePanel", "scrollData", "removeViewMore", "meetingTimer", "passHashTag", "openArticle", "openAnnouncement", "openLink", "passTaskUtterances", "passUtterances", "checkCurrentUser", "showDropdown", "addArticleAnnouncement", "passMeetingUtterances", "taskkAction", "removeTaskSelection", "taskSend", "taskCheckbox", "popupAction", "toggelMeetingActionBtn", "hexToRGBMeeting", "isURL"];
      templateMethodsArr.forEach(function (methodName) {
        methodMap[methodName] = _self[methodName].bind(_self);
      });
      return methodMap;
    };

    KoreWidgetSDK.prototype.openPanelForWindow = function (panelName, resPopUp, heightToggle) {
      KoreWidgetSDK.prototype.openPanel.call(koreWidgetSDKInstance, panelName, resPopUp, heightToggle);
    };
    KoreWidgetSDK.prototype.getHTMLForSearch = function (val) {
      return KoreWidgetSDK.prototype.convertMDtoHTML.call(koreWidgetSDKInstance, val);
    };

    KoreWidgetSDK.prototype.filterTabsForWindow = function (parentId, subpanelId, filterId) {
      KoreWidgetSDK.prototype.filterTabs.call(koreWidgetSDKInstance, parentId, subpanelId, filterId);
    };

    KoreWidgetSDK.prototype.viewMorePanelForWindow = function (obj) {
      KoreWidgetSDK.prototype.viewMorePanel.call(koreWidgetSDKInstance, obj);
    };

    KoreWidgetSDK.prototype.scrollDataForWindow = function (paneldata, filterdata, panelType, e) {
      KoreWidgetSDK.prototype.scrollData.call(koreWidgetSDKInstance, paneldata, filterdata, panelType, e);
    };

    KoreWidgetSDK.prototype.removeViewMoreForWindow = function () {
      KoreWidgetSDK.prototype.removeViewMore.call(koreWidgetSDKInstance);
    };

    KoreWidgetSDK.prototype.meetingTimerForWindow = function (tdata, m_Data, index) {
      KoreWidgetSDK.prototype.meetingTimer.call(koreWidgetSDKInstance, tdata, m_Data, index);
    };

    KoreWidgetSDK.prototype.passHashTagForWindow = function (uttarence) {
      KoreWidgetSDK.prototype.passHashTag.call(koreWidgetSDKInstance, uttarence);
    };

    KoreWidgetSDK.prototype.openArticleForWindow = function (kId) {
      KoreWidgetSDK.prototype.openArticle.call(koreWidgetSDKInstance, kId);
    };

    KoreWidgetSDK.prototype.openAnnouncementForWindow = function (kId) {
      KoreWidgetSDK.prototype.openAnnouncement.call(koreWidgetSDKInstance, kId);
    };

    KoreWidgetSDK.prototype.openLinkForWindow = function (url) {
      KoreWidgetSDK.prototype.openLink.call(koreWidgetSDKInstance, url);
    };

    KoreWidgetSDK.prototype.passTaskUtterancesForWindow = function (e, actionIndex) {
      KoreWidgetSDK.prototype.passTaskUtterances.call(koreWidgetSDKInstance, e, actionIndex);
    };

    KoreWidgetSDK.prototype.passUtterancesForWindow = function (idss, message, evt) {
      KoreWidgetSDK.prototype.passUtterances.call(koreWidgetSDKInstance, idss, message, evt);
    };

    KoreWidgetSDK.prototype.checkCurrentUserForWindow = function (oId, aId) {
      KoreWidgetSDK.prototype.checkCurrentUser.call(koreWidgetSDKInstance, oId, aId);
    };

    KoreWidgetSDK.prototype.showDropdownForWindow = function (obj) {
      KoreWidgetSDK.prototype.showDropdown.call(koreWidgetSDKInstance, obj);
    };

    KoreWidgetSDK.prototype.addArticleAnnouncementForWindow = function (type) {
      KoreWidgetSDK.prototype.addArticleAnnouncement.call(koreWidgetSDKInstance, type);
    };

    KoreWidgetSDK.prototype.refreshElementForWindow = function (type, refreshType) {
      KoreWidgetSDK.prototype.refreshElement.call(koreWidgetSDKInstance, type, refreshType);
    };

    KoreWidgetSDK.prototype.passMeetingUtterancesForWindow = function (_this) {
      KoreWidgetSDK.prototype.passMeetingUtterances.call(koreWidgetSDKInstance, _this);
    };

    KoreWidgetSDK.prototype.taskkActionForWindow = function (tId, taskName, e) {
      KoreWidgetSDK.prototype.taskkAction.call(koreWidgetSDKInstance, tId, taskName, e);
    };

    KoreWidgetSDK.prototype.removeTaskSelectionForWindow = function () {
      KoreWidgetSDK.prototype.removeTaskSelection.call(koreWidgetSDKInstance);
    };

    KoreWidgetSDK.prototype.taskSendForWindow = function (type) {
      KoreWidgetSDK.prototype.taskSend.call(koreWidgetSDKInstance, type);
    };

    KoreWidgetSDK.prototype.taskCheckboxForWindow = function (taskId) {
      KoreWidgetSDK.prototype.taskCheckbox.call(koreWidgetSDKInstance, taskId);
    };

    KoreWidgetSDK.prototype.popupActionForWindow = function (data, title, _this) {
      KoreWidgetSDK.prototype.popupAction.call(koreWidgetSDKInstance, data, title, _this);
    };

    KoreWidgetSDK.prototype.toggelMeetingActionBtnForWindow = function (id, e) {
      KoreWidgetSDK.prototype.toggelMeetingActionBtn.call(koreWidgetSDKInstance, id, e);
    };

    KoreWidgetSDK.prototype.hexToRGBMeetingForWindow = function (hex, alpha) {
      KoreWidgetSDK.prototype.hexToRGBMeeting.call(koreWidgetSDKInstance, hex, alpha);
    };

    KoreWidgetSDK.prototype.isURLForWindow = function (str) {
      KoreWidgetSDK.prototype.isURL.call(koreWidgetSDKInstance, str);
    };

    window.openPanel = KoreWidgetSDK.prototype.openPanelForWindow;
    window.getHTMLForSearch = KoreWidgetSDK.prototype.getHTMLForSearch;
    window.filterTabs = KoreWidgetSDK.prototype.filterTabsForWindow;
    window.viewMorePanel = KoreWidgetSDK.prototype.viewMorePanelForWindow;
    window.scrollData = KoreWidgetSDK.prototype.scrollDataForWindow;
    window.removeViewMore = KoreWidgetSDK.prototype.removeViewMoreForWindow;
    window.meetingTimer = KoreWidgetSDK.prototype.meetingTimerForWindow;
    window.passHashTag = KoreWidgetSDK.prototype.passHashTagForWindow;
    window.openArticle = KoreWidgetSDK.prototype.openArticleForWindow;
    window.openAnnouncement = KoreWidgetSDK.prototype.openAnnouncementForWindow;
    window.openLink = KoreWidgetSDK.prototype.openLinkForWindow;
    window.passTaskUtterances = KoreWidgetSDK.prototype.passTaskUtterancesForWindow;
    window.passUtterances = KoreWidgetSDK.prototype.passUtterancesForWindow;
    window.checkCurrentUser = KoreWidgetSDK.prototype.checkCurrentUserForWindow;
    window.showDropdown = KoreWidgetSDK.prototype.showDropdownForWindow;
    window.addArticleAnnouncement = KoreWidgetSDK.prototype.addArticleAnnouncementForWindow;
    window.refreshElement = KoreWidgetSDK.prototype.refreshElementForWindow;
    window.passMeetingUtterances = KoreWidgetSDK.prototype.passMeetingUtterancesForWindow;
    window.taskkAction = KoreWidgetSDK.prototype.taskkActionForWindow;
    window.removeTaskSelection = KoreWidgetSDK.prototype.removeTaskSelectionForWindow;
    window.taskSend = KoreWidgetSDK.prototype.taskSendForWindow;
    window.taskCheckbox = KoreWidgetSDK.prototype.taskCheckboxForWindow;
    window.popupAction = KoreWidgetSDK.prototype.popupActionForWindow;
    window.toggelMeetingActionBtn = KoreWidgetSDK.prototype.toggelMeetingActionBtnForWindow;
    window.hexToRGBMeeting = KoreWidgetSDK.prototype.hexToRGBMeetingForWindow;
    window.isURL = KoreWidgetSDK.prototype.isURLForWindow;

    KoreWidgetSDK.prototype.getMeetingSlot = function (duration) {
      var _self = this;

      var slots = [];
      var myStart = new Date(duration.start);
      var myEnd = new Date(duration.end);
      days = _self.getDateArray(myStart, myEnd);
      day = days.length - 1;

      if (day < 1) {
        return slots = [{
          'start': duration.start,
          'end': duration.end
        }];
      } else {
        var start = duration.start;
        var end = duration.end;

        for (var _i = 0; _i <= day; _i++) {
          var startDate = new Date(start);
          var endDate = new Date(end);

          if (_i > 0) {
            startDate.setDate(startDate.getDate() + _i);
            var tempStartDate = startDate;
            startDate = new Date(tempStartDate.getFullYear(), tempStartDate.getMonth(), tempStartDate.getDate(), 0, 0, 0); // 2013-07-30 23:59:59
          }

          var endOfDay = '';

          if (_i === day) {
            endOfDay = endDate;
          } else {
            endOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 0); // 2013-07-30 23:59:59
          }

          var today = new Date();
          var localStarttime = new Date(startDate); // if (today.getFullYear() <= localStarttime.getFullYear() && today.getMonth() <= localStarttime.getMonth() && today.getDate() <= localStarttime.getDate())

          slots.push({
            'start': new Date(startDate).getTime(),
            'end': new Date(endOfDay).getTime()
          });
        }

        return slots;
      }
    };

    KoreWidgetSDK.prototype.getDateArray = function (start, end) {
      var arr = new Array(),
        dt = new Date(start);

      while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }

      return arr;
    };

    KoreWidgetSDK.prototype.cloneMessage1 = function (obj) {
      var _self = this;

      var rv;

      switch (_typeof(obj)) {
        case "object":
          if (obj === null) {
            rv = null;
          } else {
            switch (toString.call(obj)) {
              case "[object Array]":
                rv = obj.map(_self.cloneMessage1.bind(_self));
                break;

              case "[object Date]":
                rv = new Date(obj);
                break;

              case "[object RegExp]":
                rv = new RegExp(obj);
                break;

              default:
                rv = Object.keys(obj).reduce(function (prev, key) {
                  prev[key] = _self.cloneMessage1(obj[key]);
                  return prev;
                }, {});
                break;
            }
          }

          break;

        default:
          rv = obj;
          break;
      }

      return rv;
    };

    KoreWidgetSDK.prototype.compare = function (a, b) {
      var startFirst = a.data.duration.start;
      var startSecond = b.data.duration.start;
      var comparison = 0;

      if (startFirst > startSecond) {
        comparison = 1;
      } else if (startFirst < startSecond) {
        comparison = -1;
      }

      return comparison;
    };

    KoreWidgetSDK.prototype.init = function (config) {
      this.events = {};
      this.config = config || {}; //this.bot.init(this.config.botOptions);
      //todo:need to remove

      window.baseUrl = config.botOptions.koreAPIUrl;
      config.direction = "left"; //$.jStorage.get('menuPosition');

      config.userInfo = {
        id: ""
      }; //$.jStorage.get('currentAccount').userInfo;

      console.log($);
      $('body').off('click').on('click', function () {
        if ($('.kore-chat-window')) {
          $('.kore-chat-window').removeClass('selectedHeight')
        }
      })
    };

    KoreWidgetSDK.prototype.setJWT = function (jwtToken) {
      var _self = this;

      if (_self.config.botOptions && _self.config.botOptions.botInfo) {
        if (_self.config.botOptions && _self.config.botOptions.botInfo && _self.config.botOptions.botInfo.customData) {
          _self.config.botOptions.botInfo.customData.kmToken = jwtToken;
        } else {
          _self.config.botOptions.botInfo.customData = {
            kmToken: jwtToken
          };
        }
      } else {
        _self.config.botOptions.botInfo = {
          customData: {
            kmToken: jwtToken
          }
        };
      }
    };

    return KoreWidgetSDK;
  }(koreJquery, korejstz, KRPerfectScrollbar);
});