//"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  //if (typeof define === 'function' && define.amd) { // AMD
  //    define(factory);
  //} else if (typeof module !== 'undefined') {      // CommonJS
  //    module.exports = factory();
  //} else {                                         // browser globals
  window.FindlySDK = factory(); //}
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
  // if (window.jstz) {
  //   korejstz = window.jstz;
  // } else {
  //   korejstz = requireKr(2).jstz;
  // }

  var KRPerfectScrollbar;
  if (window.PerfectScrollbar && typeof PerfectScrollbar === 'function') {
    KRPerfectScrollbar = window.PerfectScrollbar;
  }

  return function ($, jstz, KRPerfectScrollbar) {
    //get dependencies as arguments here 

    /**
    * @param  {Object} FindlySDK Config
    */
    function FindlySDK(config) {
      this.config = config;
      // this.config.container=this.config.container || "body";
      // if(typeof this.config.container==="string"){
      //     this.config.container=$(this.config.container);
      // }
      // this.bot = requireKr('/KoreBot.js').instance();
      // //this.config.botOptions.
      // this.init(config);
      this.initVariables();
      this.jqueryManupulations(); //this.on=$(this).on;
      this.addPolyFils();

      // this.parentEvent({ 'type': 'sdkLoaded', data: {} });
      // this.assignCallbacksToParent();
    }

    FindlySDK.prototype = Object.create($.prototype);

    FindlySDK.prototype.parentEvent = function (event) {
      if (this.config && this.config.findlyBusinessConfig && this.config.findlyBusinessConfig.sdkBridge) {
        this.config.findlyBusinessConfig.sdkBridge(event);
      }
    }
    /*FindlySDK.prototype.assignCallbacksToParent = function () {
      this.config.findlyBusinessConfig.initVariables = this.initVariables();
    }*/

    FindlySDK.prototype.addPolyFils = function () {
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
      String.prototype.isNotAllowedHTMLTags = function () {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = this;

        var setFlags = {
          isValid: true,
          key: ''
        };
        try {
          if ($(wrapper).find('script').length || $(wrapper).find('video').length || $(wrapper).find('audio').length) {
            setFlags.isValid = false;
          }
          if ($(wrapper).find('link').length && $(wrapper).find('link').attr('href').indexOf('script') !== -1) {
            if (detectScriptTag.test($(wrapper).find('link').attr('href'))) {
              setFlags.isValid = false;
            } else {
              setFlags.isValid = true;
            }
          }
          if ($(wrapper).find('a').length && $(wrapper).find('a').attr('href').indexOf('script') !== -1) {
            if (detectScriptTag.test($(wrapper).find('a').attr('href'))) {
              setFlags.isValid = false;
            } else {
              setFlags.isValid = true;
            }
          }
          if ($(wrapper).find('img').length && $(wrapper).find('img').attr('src').indexOf('script') !== -1) {
            if (detectScriptTag.test($(wrapper).find('img').attr('href'))) {
              setFlags.isValid = false;
            } else {
              setFlags.isValid = true;
            }
          }
          if ($(wrapper).find('object').length) {
            setFlags.isValid = false;
          }

          return setFlags;
        }
        catch (e) {
          return setFlags;
        }
      };


      String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
      };
    };
    FindlySDK.prototype.jqueryManupulations = function () {
      var _self = this; // $.fn.extend({
      //   tmplProxy: function(a,b,c){
      //     return this.tmpl(a,b,c);
      //   }
      // });     


      $.prototype.tmplProxy = function (a, b, c) {
        return this.tmpl($.extend(_self.getTemplateMethods(), a), b, c);
      };
    };

    FindlySDK.prototype.initVariables = function () {
      this.vars = {}; //use this vars to store any local data variable for sdk developers. Will be avaiable as "koreWidgetSDKInstance.vars"

      var vars = this.vars;
      vars.timezone //= jstz.determine();
      vars.latitude = '';
      vars.longitude = '';
      //config = {};
      vars.initialWidgetData = {};
      vars.cacheData = [];
      vars.searchObject = {
        //recents:[]
      };
      vars.selectedFiltersArr = [];
      vars.filterObject = [];
      vars.searchFacetFilters = [];

      vars.customizeView = false;
      vars.showingMatchedResults = false;
    }; //********************original widget.js start */


    FindlySDK.prototype.show = function (dataConfig, sel) {
      var _self = this;
      var initialWidgetData = _self.vars.initialWidgetData;
      _self.config.container = sel || {}; //#TODO :need to remove below line on prod

      window.koreWidgetSDKInstance = _self;

      //var currentTimezone = _self.vars.timezone.name();

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

    FindlySDK.prototype.setAPIDetails = function () {

      var _self = this;
      var SearchIndexID = 'sidx-f3a43e5f-74b6-5632-a488-8af83c480b88';
      var pipelineId = '';
      if (window.selectedFindlyApp && window.selectedFindlyApp._id) {
        // SearchIndexID = window.selectedFindlyApp._id
        SearchIndexID = window.selectedFindlyApp._id;
        pipelineId = window.selectedFindlyApp.pipelineId;
      }
      /*var baseUrl = "https://app.findly.ai/searchAssistant";
      var businessTooBaseURL = "https://app.findly.ai/api/1.1/findly/"*/
      debugger;
      var baseAPIServer = 'https://app.findly.ai';
      // var baseAPIServer = 'https://dev.findly.ai';
      if (_self.isDev) {
        baseAPIServer = window.appConfig.API_SERVER_URL;
      }
      var baseUrl = baseAPIServer + "/searchAssistant";
      console.log(baseUrl);
      var businessTooBaseURL = baseAPIServer + "/api/1.1/findly/";
      console.log(businessTooBaseURL);
      _self.API = {
        baseUrl: baseUrl,
        livesearchUrl: baseUrl + "/liveSearch/" + SearchIndexID,
        searchUrl: baseUrl + "/search/" + SearchIndexID,
        // popularSearchesUrl: "https://app.findly.ai/api/1.1/searchAssist/" + SearchIndexID + "/popularSearches",
        popularSearchesUrl: baseAPIServer + "/api/1.1/searchAssist/" + SearchIndexID + "/popularSearches",
        newSearchFeedbackUrl: businessTooBaseURL + SearchIndexID + "/search/feedback",
        // queryConfig: businessTooBaseURL + SearchIndexID +"/search/queryConfig",
        queryConfig: businessTooBaseURL + SearchIndexID + '/queryPipeline/' + pipelineId + '/rankingAndPinning',
        SearchIndexID: SearchIndexID,
        streamId: 'st-a4a4fabe-11d3-56cc-801d-894ddcd26c51',
        jstBarrer: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.wrUCyDpNEwAaf4aU5Jf2-0ajbiwmTU3Yf7ST8yFJdqM"
      };
      _self.API.uuid = uuid.v4();
      var botIntigrationUrl = businessTooBaseURL + SearchIndexID + '/linkedbotdetails';
      if (window.selectedFindlyApp && window.selectedFindlyApp._id) {
        $.ajax({
          url: botIntigrationUrl,
          type: 'GET',
          dataType: 'json',
          headers: {
            "Authorization": 'bearer ' + window.findlyAccessToken,
            "AccountId": window.findlyAccountId,
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

    FindlySDK.prototype.maintainCache = function () {
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
    FindlySDK.prototype.checkMarkdowns = function (val, hyperLinksMap) {
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
          // if (!isEven(txtArr[i].split('*').length - 1)) {
          //   txtArr[i] = '\r\n&#9679; ' + txtArr[i].substring(1);
          //   _lineBreakAdded = true;
          // }
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

    FindlySDK.prototype.convertMDtoHTML = function (val, responseType, msgItem) {
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
      FindlySDK.prototype.nl2br = function (str, runEmojiCheck) {
        if (runEmojiCheck && window.emojione && window.emojione.shortnameToImage) {
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
    FindlySDK.prototype.modifyJSON = function (count) {
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

    FindlySDK.prototype.getSearchTemplate = function (type) {
      var searchContainer = '<script type="text/x-jqury-tmpl">\
        <div class="search-container conversation">\
          <div class="custom-insights-control-container">\
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADKSURBVHgBzZHNEcIgEIWfPwXYgZRAB1KCJdCB6SCWYAcpwRKkA8cK5OopdqC742YGHBJQPPhmvklgdx8Lu0C9dsQNlWqJB9GUJK8yJnsUmpyJK9ER5hsTBCaN/HNxP2bCp6qESSdFOthTYpp8k4OccCS2iFvX+EDckSVOiFu3qJCSDovGGWpWkGPk66biS+Rl8bqqm4iv55nid42+HRu1QZBHrpCXltzIyBCboBOFvIZJR0Y/0f8Z8fgvhJe1I+6Ckz0v6yHuE/H+Cfn+M6AXJD0vAAAAAElFTkSuQmCC">\
          </div>\
          <div id="searchBox" >\
            <div class="heading display-none">\
              <div class="logo-sec-title">\
                <img class="show-in-findly logo-img" src="data:image/png;base64,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">\
                <img class="search-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAARCAYAAABq+XSZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANmSURBVHgB3VddUuJAEO6J2XduYFzZZ/UExBOIJzCcADiBegL1BngC8QTGE8g+q+V4AtlnIr1fz0zCJEuALaG07CqG+e3p7vn6J0QrUhT92qdvRiqKmmf1y6y1fh5EP5sXxNTDRKpfng7pgxRFu21cLcYca/10GYGIwsSuZgNcqmmDFO0070jRKERzWruLVYp2QFNukFIY05jWQ23cewIDaPQvoXhUyMFhilbTJompQcwq9KZSTN5Xdmlp8fodIOQarzKib0BA24H8z5SH4pg8m7cZ/p5QQC2ahgJVwLQZU6BOzOJ00qcg7KKHNTXG+LwKW7jNqV2X/VmfllCVP9iNnRz7kKPr5s/r3KM4zyyIgkwKex9HJXmm/BrSSjSN4QIiTEoGpioC48SubYnhXJ+xFCYQ8iC/DBfdYLpdsFJhjHYJgjIN+CeOv6Bx4OToQo7ExiLdmXfSKMZ0BuWGGN47AzzAIId43NSJCeMEeqa84hMEglaJE6u+b7G5pBC4mI+NQRRdOCETND0T2HLFma+wRwSKF8YZElhqDVlSszcIWoXyCmPzH6S1h6f0B21fAmk+BV7bIg/ZxyvIe3kIj31lTgh0y4hVBxeN3CWCDoH/nluN3T+i+nPP9VNn5HgxX7o1yjKL8To2IxgZoSBf1x3zlTYyyTmBvgS5Cnk+LwzVoLy8PMAplb15w2o2aDhFynyYf+NgTAspG0A8QVLD1Rj7xq1s+k3rTrm02QWSJZ02jAw2S/2ji//yuvCJdZNSUWVie9kRCXIF9InFVY7MgiBi4V1bdySPwME50SQ1fQoFda3q1oA2SspZmyMTgSmHIa9WLeaKWsVjO/l+WbfdIkRF1hUfTbHkMsXevP0bVl6g61xB0Y2J/Cp8cHD8n/Oxmxj56U0MKdUaDOviycSuBXw027MrBVV7HveNKm+sztxxxVLDRH7xf+bblc/7vmoyhk8/xIgxfkez+6gvqQ5GeZOfyUCqGssshcTZjusvKF3feyZ3FjQZYpxK70Xr15lw2TFROaoiOEl6G1rYq7GkTrxXw+cnsUbecK4cedS3cqRl3obXjn/GfSsMTcls7nuy9/lyiZxSktAXJffx04KECVnUpFDkwx9VPq1Y4X0GoaIsfFXc5r1Da6YvrDxdIWrfOsVHeX2/TvoL5IWKplAqwt0AAAAASUVORK5CYII=">\
                <span class="head">Kore Search Assistant</span>\
              </div>\
              <div class="right-side-icons">\
                <img class="show-in-findly" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEYSURBVHgBlVLLUcMwEN1VKEBAA3I+Z1wClEAFuAQ6yFBBoIKYCmiBEsQZMt4KwLkTK7tSNI4tJTPZGVuzv/f2h5ARYxYlP2XQHBH9fI5jcJRQAXZLcKwotCHPBQAHL0SbOmWZzpemmDXGzO8zFVTexzF5BwucEPGFmFnVG0cGYTXTxZrf1TGYt3Os79GXhm5NzaaIyIBXzYDOwUMcEBOwTz0qyQWHX33U5DmpU+FTr8jQulJBKjqxdN02weLPAuLdEWKdJMLutXfLepAU0bdQQ1yD78X9F7y/NwasQ39EoT/ec4yJhkvXMZFf2/5arW+vmWGl9c22bf/sMEkmjx88xHe+Hl92/uS85/zJYb4s6RfNQbVhDkPZA7YFdnerG1SJAAAAAElFTkSuQmCC">\
                <img class="show-in-findly" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgBzVLBEYJADNxD/FtCdPg7doAlWIKVCJVYgiWoHeCf0etACwDOvRyMfphRfGBmCJlNdi+XCzC2Ge9kkezgkH1DJDOz1zLXWOaJE5HZp1xf6zk+jl+K8Z0gBlmnNoQT4UcbX0CHaG+l4WSFg9zDVRtgyrg5wNUrYvxXW0vr7SCQJ0fuwpl1D6AROHPRmJjPaU2fgJ4Mw/oya/GU30m7U8zYUNMnwBbpRDdSBc2SvtDuFHMSaoK9L10UTuH9XL1Gg7RNpkBVaEzM57oZ6Ptz6Xi1HH9hT/FGV798NRUBAAAAAElFTkSuQmCC">\
                <img class="show-in-findly" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADgSURBVHgBzZJBEsFAEEX/jNhzg0bs3UCcgBvgJOImnMAROII9KX2E7IPRnYhKqVkkZRFvM9M183/1TH+gbUy5IRpPgIyFlCiM5WTjlziGRcxJsv8Y0DDcwCGW7RnuPpO1B3Qjv8EzgjFzvl37WgUVsTKBCY5qwnzZ+eTSqXaxLGsL51Zfd+QpnQg1CfiWDHLnQejEbM2c7NAAix9p3yCoe5FotJDxHWQCRa1/Jplo0MHjBM1JFWf21Q5SWDst5uwjO+Uh05zoqB22zNe4EuXRqoivIa/+LSAiTSlJ0M74C16gMU0xa7sy7wAAAABJRU5ErkJggg==">\
                <img class="help-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE1SURBVHgBhVI7TsNAEH27cY8VOMA6OBJlcgLMCeAGNhUl4STACZLcAEoq3NG6RQTFXCCYjsJ4eJs48ieOMtJIo5k3b74KLTFmOAIkoOlSM0DFafqR1DGqAhsD5UxpjiAyZ4gJQh/OaaeQ/DqlNNiNd7o0xp+gQ6x/E7ddkGJTofcKUWRaxLUWr6jk/pyViQGUTCF/457rnkTQ+jddLh6rNvUbE97Z2o3bPzbZ9+oly1ap6/bHQO9MMxCisDNsxYk40x0rTCwrBFFtBTPiL2E8X7BHbEt2loaPeGdvwsC/X1cRfdGOaWqyHrItBX64Zq9+oxKXaLI9Q6uwqxpXlzU9EhI/Z6X8AVIEndXQnI9LICZ/Kh0HjjsY3jaOWzFt38i+jo55hi+6j4jgMsC5qjdSu20cfth/n92EMGjOb2IAAAAASUVORK5CYII=">\
                <img class="elipse-overflow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAADCAYAAABI4YUMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABUSURBVHgBhcrBDYAgEETRiW4BSCzAo11YgpZgCZZgJ1qClmBDQgEkMFzgBPxkD/sy/cSUHi816Nma/wNrWQfIBo94J1KyV+wQwD2Elc+bB+6mLSULWI0gebajC9UAAAAASUVORK5CYII=">\
                <img class="close-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgBhZDBDYAgDEV/xAXcoKs4iW7gCqzgRLiGJ7160hH8ak1IAW3yGiiPUOoADGQjB/IhpKuYGhK0kJOCOnd4shhZtObt7VguSlb+lN7ndkXigxpp46Pur3VLVvw07mE+mJMS2TH1ZC6IE54ZyglkyhuCR14v1QAAAABJRU5ErkJggg==">\
              </div>\
            </div>\
            <div class="custom-header">\
              <div class="custom-header-container-left">\
                <img class="custom-chevron-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABgSURBVHgBvY5JDYBAEASLQwASkIAEUAIScABOwAkaUAAOsEBvwv525sFjO6nHpCuZroBNNOLESCceMeIkSkseqRVXlOqEcItBHOEo8VNg7AgvVpyR/8s5VfZfOWFk98oXwWkULEZAstIAAAAASUVORK5CYII=">\
                &nbsp;<span class="custom-header-text">HIDE INSIGHTS</span>\
              </div>\
              <div class="custom-header-container-center">\
                <ul class="custom-header-nav">\
                  <li class="custom-header-nav-link-item nav-link-item-active" onclick="openTab(event, \'preview\')"><a class="custom-header-nav-link">Preview</a></li>\
                  <li class="custom-header-nav-link-item" onclick="openTab(event, \'customize\')"><a class="custom-header-nav-link">Customize</a></li>\
                </ul>\
              </div>\
              <div class="custom-header-container-right">\
                <img class="custom-refresh-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgBxZLBDYAgDEW/TsIobgabOIJxAnQC3ahWJbFok/YkL3kXKJ8GCjwENrNkuJXai14ETOzKdoYzO0KB4Ie0Dn4hoX6PJDcH+Eja4VgWoy+jviy+2vKGfGjzCzJgga/9s2bXNgLuMbVGOUOM8gGN7ylbkPg3iwAAAABJRU5ErkJggg==">\
                <img class="custom-expand-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABVSURBVHgBvZLLDQAhCEQfHdHZ2vGWwm6MGiVq1IOTcOAzZPgIYLQQ5/t8DLy/KWNoqrFM0AmpzhUCA5KPWa9bqPzAXOoFeEkPHUnbQx+tdflwwuZrfGu+IKjlYgIIAAAAAElFTkSuQmCC">\
              </div>\
            </div>\
              <div class="contest_variables_dropdown hide">\
              <div class="actions-link">Context</div>\
              </div>\
            <div id="searchChatContainer"></div>\
              <div class="search-body ps">\
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
          <span class="search-greeting-text">Hello! How can I help you today?</span>\
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
          {{if showAllResults}}\
                <div class="display-none">\
                  <span class="pointer show-all-results" >See all results<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACHSURBVHgBlZDBDYUwDEOdin/+sEGkMhBMACOwCSuwASMwAwMglQ3YICTAAQ6lwpdUkV9lB4iImXPmsrd537sYEELYAClA2XiHosAJLS1EVrhfjy9i9gN739ibNGenM09SJA3E1RqJNqT1t7+1U0Up51GYskm7zNaJvpht595zP83JKNdBHtoBNXcrtgi1OOQAAAAASUVORK5CYII="></span>\
                </div>\
          {{/if}}\
          {{if faqs && faqs.length}}\
              <div class="matched-faq-containers">\
                <div class="search-heads">${taskPrefix} FAQS</div>\
                <div class="tasks-wrp">\
                {{each(key, faq) faqs}}\
                <div class="faqs-shadow task-wrp matched_pages {{if viewType=="Preview"&&faq.config.visible==false}}display-none{{/if}} {{if faq.config.visible==false}}hide-actions{{/if}} {{if faq.config.pinIndex>-1}}hide-visibility-control{{/if}}" boost="${faq.config.boost}" pinIndex="${faq.config.pinIndex}" visible="${faq.config.visible}" contentId="${faq.contentId}" contentType="${faq.contentType}">\
                <div class="notification-div"></div>\
                <div class="indicator-div"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA3SURBVHgB7cqhDQAgDATAp0EwRmfAIpmbNBgYg7AIxeKwFT19ofWhiIlryRsPkcmHdBE+PNgJF+92Cl8YZVCcAAAAAElFTkSuQmCC"></div>\
                <div class="faqs-wrp-content">\
                  <div class="title" boost="${faq.config.boost}" pinIndex="${faq.config.pinIndex}" visible="${faq.config.visible}" contentId="${faq.contentId}" contentType="${faq.contentType}">\
                      <span class="accordion" id="${key}">${faq.question}<span class="desc-info">{{html getHTMLForSearch(faq.answer)}}</span>\</span>\
                      <div class="panel">\
                        <div class="content-inner">{{html getHTMLForSearch(faq.answer)}}</div>\
                        <div class="divfeedback">\
                        <span class="yesLike"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtdXAtZ3JheTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ0aHVtYnMtdXAtZ3JheSIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="thumbs-up"></span>\
                        <span class="noDislike"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtZG93bi1ncmF5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InRodW1icy1kb3duLWdyYXkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA3LjAwMDAwMCkgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTcuMDAwMDAwLCAtNy4wMDAwMDApICIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="thumbs-down"></span>\
                        </div>\
                    </div>\
                  </div>\
                </div>\
                <div class="custom-live-search-matched-results-actions">\
                  <span class="custom-actions">\
                    <span class="img-action  dont-show visibility" data-viewMode="chat">\
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">&nbsp;\
                      {{if faq.config.visible==true}}\
                        <span class="custom-actions-content">HIDE</span>\
                      {{/if}}\
                      {{if faq.config.visible==false}}\
                        <span class="custom-actions-content">UNHIDE</span>\
                      {{/if}}\
                    </span>\
                    <span class="img-action pin pinning" data-viewMode="chat">\
                      <img class="display-none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                      {{if faq.config.pinIndex==-1}}\
                        <span class="custom-actions-content">PIN</span>\
                      {{/if}}\
                      {{if faq.config.pinIndex>-1}}\
                        <span class="custom-actions-content">UNPIN</span>\
                      {{/if}}\
                    </span>\
                    <span class="img-action boostup boosting" data-viewMode="chat">\
                      <img class="display-none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABySURBVHgBhY1RDYAwDAWbYGAS+ORzEpCCE3AADjYH04CCScAKhbTJy2jZSy6w5S4jsrcKnw2OPDOBmZiTfrYzGc6ZnJeeJZBHQaNkyQfIl6DRhlGRC5QXwYyCIevaSL/vT21kjCrKUS4i+YsYlY6MUbkBGj8attkkmHEAAAAASUVORK5CYII=">\
                      <span class="custom-actions-content">BOOST</span>\
                    </span>\
                    <span class="img-action boostdown burying" data-viewMode="chat">\
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABzSURBVHgBhY8BDYAgEEW/DYxAA2lEFGigDaCBGUxgBKsI8/52smP87cOA98YOAM5aj3m8sHC190TyPUMpGHCQN6dh7k8nBbkjs7Yl10ZD6uHIGVqKIWl4F+aXIr9RIpwtmElKInxoYBlIG74BLzlPk0bgC7ouGvZUI7q8AAAAAElFTkSuQmCC">\
                      <span class="custom-actions-content">BURY</span>\
                    </span>\
                  </span>\
                </div>\
                <div class="faqs-bottom-actions background-white">\
                    <span class="appearences">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgBPU/LDYJAFHQXuHDREiwBOtASrEA9wgWsYKECJYQQTmoFliBWYAtbAtxI+DmTsJI88ubNvJl9YrV8eZ7vbNtW8zx7QogNRjXqGQTBg7zkr6oqZVnWC+0HIn+aJp8ilCrLUlEjiqI4SSkJ9sMwbB3HOaLf9H2fIUEj4TuO40HCiURKEV1BtHBsIXpzhgQuKBtDD+QFTldsZmEYJoxCpIYgRsuKkCpr13U1QIPS5jgsE6+7rmvgWgtD4KAY7hHizsRwu/NJ5uq/cIlL4BQtMMUzbob7AcvvZ8ELJe2ZAAAAAElFTkSuQmCC">\
                    <span class="custom-appearences-content">${faq.feedback.appearance} VIEWS</span>&nbsp;\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgBnZHRDYJADIZ7hwk8OoJuoBvgBjqB4ZEnRgA28I3AC2ECdQNGcAMZwQXg/KuHQTxOY5Om0OvXa/8TNLI8z+Ou6xJ8JmEYpmQwOU5oYMkQTZg0JXFDQxaT9IfNbIdZlimEGu7TYEcrRM/drn1Ek4RhyWpxR3g8JvrdBjs+BBIMQLG14zilUuqkxxBkGZmFSDWwE0Js6QeT6JoAOAM4avDyFdIzv4FTxUVRrBCa1zsNwbIs5yaobdsI+1cfC2tZ93B+k5qVQ26BZhH+fdd1N0aVUORzEbpy5FsbeOV53iEIgtsdmbJxSEqhuZgAAAAASUVORK5CYII=">\
                    <span class="custom-appearences-content">${faq.feedback.click} CLICKS</span>\
                    <img class="display-none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                    <span class="appearences-count display-none">${faq.feedback.appearance} Appearances - ${faq.feedback.click} Clicks</span>\
                    </span>\
                    <span class="actions display-none">\
                    <span class="img-action  dont-show">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">\
                    </span>\
                    <span class="img-action pin">\
                    <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                    </span>\
                    <span class="img-action boostup">\
                    <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAOCAYAAADjXQYbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBddC9EYJAEIbh9UwMLYESLOE6UDvACizBEiwBrEA7UCuwBDEzNDWCd2c+GH6OnXmA+ZbljjOb1g65zdQbMdU4ocZ63MjwwjU15eEGtzZY6p7jjy9WeHi40Pd9aq+XtqjwDFyOuOCHEgcNWNCDh2ctEfFR1tW9t+NB+S4LNbI2DL1m1NqVJf6xsJkqLXFkDWdFGmqp7HU+AAAAAElFTkSuQmCC">\
                    </span>\
                    <span class="img-action boostdown">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABjSURBVHgBpc6BDYAwCATA10k6QkfRSV3FDToKSoSGKEqon1DSpAcFrmxnVSTDoEnXSsFmBriZHKjhL6/mvuPH5sIHBbCaAYv0jr4wBJC+uyMPF9kQotfNM+LQCHrgDOp4BOEARLAffv7ZxAUAAAAASUVORK5CYII=">\
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
              <div class="search-heads">${taskPrefix} PAGES</div>\
              <div class="faqs-shadow tasks-wrp">\
              {{each(key, page) pages}}\
              <div class="faqs-shadow task-wrp matched_pages {{if viewType=="Preview"&&page.config.visible==false}}display-none{{/if}} {{if page.config.visible==false}}hide-actions{{/if}} {{if page.config.pinIndex>-1}}hide-visibility-control{{/if}}" boost="${page.config.boost}" pinIndex="${page.config.pinIndex}" visible="${page.config.visible}" contentId="${page.contentId}" contentType="${page.contentType}">\
              <div class="notification-div"></div>\
              <div class="indicator-div"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA3SURBVHgB7cqhDQAgDATAp0EwRmfAIpmbNBgYg7AIxeKwFT19ofWhiIlryRsPkcmHdBE+PNgJF+92Cl8YZVCcAAAAAElFTkSuQmCC"></div>\
                <a class="faqs-wrp-content" href="${page.url}" target="_blank">\
                 <div class="image-url-sec">\
                     <img src="${page.imageUrl}"></img>\
                 </div>\
                 <div class="pages-content">\
                   <div class="title" title="${page.title}">${page.title}</div>\
                   <div class="desc-info">${page.searchResultPreview}</div>\
                 </div>\
                 <img class="external-link-show" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACwSURBVHgBjZHRDcIgGIR/CAO5gTqJfWlf6wbWCUwfCw8yCm7gCE4C3k9ogtgSLmn+tnyXO0AYYx5EdKVCfd+LZVmslPKS/1cMCyGs9/5VmgDbEILD+ojPw2oghodhsBspDg1uCX7zlFRRgic8dyTNMbUFRtKEWh+urlrgtR6GUy0wS2vdIeEpC/i0Bef6MaTY8x78Z8hMu4p7wAUd0bHGRQZHSwobmfEyYnY1A8PMfgGDQ1B/OCu3QAAAAABJRU5ErkJggg==">\
                 </a>\
                 <div class="custom-live-search-matched-results-actions">\
                    <span class="custom-actions">\
                      <span class="img-action  dont-show visibility" data-viewMode="chat">\
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">&nbsp;\
                        {{if page.config.visible==true}}\
                          <span class="custom-actions-content">HIDE</span>\
                        {{/if}}\
                        {{if page.config.visible==false}}\
                          <span class="custom-actions-content">UNHIDE</span>\
                        {{/if}}\
                      </span>\
                      <span class="img-action pin pinning" data-viewMode="chat">\
                        <img class="display-none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                        {{if page.config.pinIndex==-1}}\
                          <span class="custom-actions-content">PIN</span>\
                        {{/if}}\
                        {{if page.config.pinIndex>-1}}\
                          <span class="custom-actions-content">UNPIN</span>\
                        {{/if}}\
                      </span>\
                      <span class="img-action boostup boosting" data-viewMode="chat">\
                        <img class="display-none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABySURBVHgBhY1RDYAwDAWbYGAS+ORzEpCCE3AADjYH04CCScAKhbTJy2jZSy6w5S4jsrcKnw2OPDOBmZiTfrYzGc6ZnJeeJZBHQaNkyQfIl6DRhlGRC5QXwYyCIevaSL/vT21kjCrKUS4i+YsYlY6MUbkBGj8attkkmHEAAAAASUVORK5CYII=">\
                        <span class="custom-actions-content">BOOST</span>\
                      </span>\
                      <span class="img-action boostdown burying" data-viewMode="chat">\
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABzSURBVHgBhY8BDYAgEEW/DYxAA2lEFGigDaCBGUxgBKsI8/52smP87cOA98YOAM5aj3m8sHC190TyPUMpGHCQN6dh7k8nBbkjs7Yl10ZD6uHIGVqKIWl4F+aXIr9RIpwtmElKInxoYBlIG74BLzlPk0bgC7ouGvZUI7q8AAAAAElFTkSuQmCC">\
                        <span class="custom-actions-content">BURY</span>\
                      </span>\
                    </span>\
                  </div>\
                 <div class="faqs-bottom-actions background-white">\
                 <span class="appearences">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgBPU/LDYJAFHQXuHDREiwBOtASrEA9wgWsYKECJYQQTmoFliBWYAtbAtxI+DmTsJI88ubNvJl9YrV8eZ7vbNtW8zx7QogNRjXqGQTBg7zkr6oqZVnWC+0HIn+aJp8ilCrLUlEjiqI4SSkJ9sMwbB3HOaLf9H2fIUEj4TuO40HCiURKEV1BtHBsIXpzhgQuKBtDD+QFTldsZmEYJoxCpIYgRsuKkCpr13U1QIPS5jgsE6+7rmvgWgtD4KAY7hHizsRwu/NJ5uq/cIlL4BQtMMUzbob7AcvvZ8ELJe2ZAAAAAElFTkSuQmCC">\
                 <span class="custom-appearences-content">${page.feedback.appearance} VIEWS</span>\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgBnZHRDYJADIZ7hwk8OoJuoBvgBjqB4ZEnRgA28I3AC2ECdQNGcAMZwQXg/KuHQTxOY5Om0OvXa/8TNLI8z+Ou6xJ8JmEYpmQwOU5oYMkQTZg0JXFDQxaT9IfNbIdZlimEGu7TYEcrRM/drn1Ek4RhyWpxR3g8JvrdBjs+BBIMQLG14zilUuqkxxBkGZmFSDWwE0Js6QeT6JoAOAM4avDyFdIzv4FTxUVRrBCa1zsNwbIs5yaobdsI+1cfC2tZ93B+k5qVQ26BZhH+fdd1N0aVUORzEbpy5FsbeOV53iEIgtsdmbJxSEqhuZgAAAAASUVORK5CYII=">\
                 <span class="custom-appearences-content">${page.feedback.click} CLICKS</span>\
                 <img class="display-none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                 <span class="appearences-count display-none">${page.feedback.appearance} Appearances - ${page.feedback.click} Clicks</span>\
                 </span>\
                 <span class="actions display-none">\
                 <span class="img-action  dont-show">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">\
                 </span>\
                 <span class="img-action pin">\
                 <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                 </span>\
                 <span class="img-action boostup">\
                 <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAOCAYAAADjXQYbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBddC9EYJAEIbh9UwMLYESLOE6UDvACizBEiwBrEA7UCuwBDEzNDWCd2c+GH6OnXmA+ZbljjOb1g65zdQbMdU4ocZ63MjwwjU15eEGtzZY6p7jjy9WeHi40Pd9aq+XtqjwDFyOuOCHEgcNWNCDh2ctEfFR1tW9t+NB+S4LNbI2DL1m1NqVJf6xsJkqLXFkDWdFGmqp7HU+AAAAAElFTkSuQmCC">\
                 </span>\
                 <span class="img-action boostdown">\
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABjSURBVHgBpc6BDYAwCATA10k6QkfRSV3FDToKSoSGKEqon1DSpAcFrmxnVSTDoEnXSsFmBriZHKjhL6/mvuPH5sIHBbCaAYv0jr4wBJC+uyMPF9kQotfNM+LQCHrgDOp4BOEARLAffv7ZxAUAAAAASUVORK5CYII=">\
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
                  <span class="search-heads">${taskPrefix} ACTIONS</span>\
                  <div class="faqBtnContainer suggestion_actions_container">\
                      <div class="tasks-wrp action-wrp btn_block_actions">\
                        {{each(key, task) tasks}}\
                          <div class="task-wrp action-wrp" boost="${task.config.boost}" pinIndex="${task.config.pinIndex}" visible="${task.config.visible}" contentId="${task.contentId}" contentType="${task.contentType}">\
                            <button id="${key}" class="faq search-task" title="${task.taskName}" >\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJ1BMVEUAAAAAVaoEbq4DbK8GbK4Gbq8Gba0Fba8Fba4Fbq4Eba4Fba7////SVqJwAAAAC3RSTlMAA0hJVYKDqKmq4875bAAAAAABYktHRAyBs1FjAAAAP0lEQVQI12NgwACMJi5A4CzAwLobDBIYOCaAxDknMLCvnAkEsyYwcECkkBicMDV4GGwQxQEMjCogK5wEMC0HALyTIMofpWLWAAAAAElFTkSuQmCC" class="credit-card">\
                                ${task.taskName}\
                            </button>\
                            <div class="faqs-bottom-actions background-white">\
                              <span class="appearences">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgBPU/LDYJAFHQXuHDREiwBOtASrEA9wgWsYKECJYQQTmoFliBWYAtbAtxI+DmTsJI88ubNvJl9YrV8eZ7vbNtW8zx7QogNRjXqGQTBg7zkr6oqZVnWC+0HIn+aJp8ilCrLUlEjiqI4SSkJ9sMwbB3HOaLf9H2fIUEj4TuO40HCiURKEV1BtHBsIXpzhgQuKBtDD+QFTldsZmEYJoxCpIYgRsuKkCpr13U1QIPS5jgsE6+7rmvgWgtD4KAY7hHizsRwu/NJ5uq/cIlL4BQtMMUzbob7AcvvZ8ELJe2ZAAAAAElFTkSuQmCC">\
                              <span class="custom-appearences-content">${task.feedback.appearance} VIEWS</span>&nbsp;\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgBnZHRDYJADIZ7hwk8OoJuoBvgBjqB4ZEnRgA28I3AC2ECdQNGcAMZwQXg/KuHQTxOY5Om0OvXa/8TNLI8z+Ou6xJ8JmEYpmQwOU5oYMkQTZg0JXFDQxaT9IfNbIdZlimEGu7TYEcrRM/drn1Ek4RhyWpxR3g8JvrdBjs+BBIMQLG14zilUuqkxxBkGZmFSDWwE0Js6QeT6JoAOAM4avDyFdIzv4FTxUVRrBCa1zsNwbIs5yaobdsI+1cfC2tZ93B+k5qVQ26BZhH+fdd1N0aVUORzEbpy5FsbeOV53iEIgtsdmbJxSEqhuZgAAAAASUVORK5CYII=">\
                              <span class="custom-appearences-content>${task.feedback.click} CLICKS</span>\
                              <img class="display-none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                              <span class="appearences-count display-none">${task.feedback.appearance} Appearances - ${task.feedback.click} Clicks</span>\
                              </span>\
                              <span class="actions display-none">\
                              <span class="img-action  dont-show">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">\
                              </span>\
                              <span class="img-action pin">\
                              <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                              </span>\
                              <span class="img-action boostup">\
                              <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAOCAYAAADjXQYbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBddC9EYJAEIbh9UwMLYESLOE6UDvACizBEiwBrEA7UCuwBDEzNDWCd2c+GH6OnXmA+ZbljjOb1g65zdQbMdU4ocZ63MjwwjU15eEGtzZY6p7jjy9WeHi40Pd9aq+XtqjwDFyOuOCHEgcNWNCDh2ctEfFR1tW9t+NB+S4LNbI2DL1m1NqVJf6xsJkqLXFkDWdFGmqp7HU+AAAAAElFTkSuQmCC">\
                              </span>\
                              <span class="img-action boostdown">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABjSURBVHgBpc6BDYAwCATA10k6QkfRSV3FDToKSoSGKEqon1DSpAcFrmxnVSTDoEnXSsFmBriZHKjhL6/mvuPH5sIHBbCaAYv0jr4wBJC+uyMPF9kQotfNM+LQCHrgDOp4BOEARLAffv7ZxAUAAAAASUVORK5CYII=">\
                              </span>\
                              </span>\
                          </div>\
                          </div>\
                        {{/each}}\
                      </div>\
                  </div>\
              </div>\
              {{/if}}\
              {{if noResults}} <span class="text-center">No results found</span> {{/if}}\
              {{if showAllResults}}\
                <div>\
                  <span class="pointer show-all-results" >See all results<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACHSURBVHgBlZDBDYUwDEOdin/+sEGkMhBMACOwCSuwASMwAwMglQ3YICTAAQ6lwpdUkV9lB4iImXPmsrd537sYEELYAClA2XiHosAJLS1EVrhfjy9i9gN739ibNGenM09SJA3E1RqJNqT1t7+1U0Up51GYskm7zNaJvpht595zP83JKNdBHtoBNXcrtgi1OOQAAAAASUVORK5CYII="></span>\
                </div>\
              {{/if}}\
          </div>\
      </div>\
      </script>';
      var searchFullData = '<script type="text/x-jqury-tmpl">\
      <div id="loaderDIV" class="loader-container">Loading...</div>\
      <div class="ksa-results-tabesHeader">\
        <div class="title-backbutton display-none">\
          <div class="title">Search results</div>\
          <div class=""><button class="full-search-close">Close</button>\
          </div>\
        </div>\
        <div class="custom-full-page-view-header-container hide">\
          <div class="custom-full-page-view-header-container-left">\
            <img class="custom-chevron-right-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAANCAYAAACUwi84AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABISURBVHgBpZDdCQAgCIRtE0doo9zMURqlEVohA3vzB+ng8OE7DrwGvrqYIrj0mnBnkCyIWluHV1PMEAi1YXyH3hdpyB2pHOIDPWEQQp4izIEAAAAASUVORK5CYII=">\
          </div>\
          <div class="custom-full-page-view-header-container-center-primary">\
            <div class="custom-search-input>\
              <input id="customSuggestionInput" class="custom-search" name="search" disabled="disabled">\
              <input id="customSearchInput" class="custom-search" name="search" value="${search}" autocomplete="off">\
              <button class="search-button">Go</button>\
            </div>\
          </div>\
          <div class="custom-full-page-view-header-container-center-secondary">\
            <label class="custom-switch">\
            <input id="viewTypeCheckbox" type="checkbox">\
            <span class="custom-slider custom-slider-round"></span>\
            </label>\
            <span class="custom-view-type-content">${viewType}</span>\
          </div>\
        </div>\
        <div class="custom-nav-panel-container">\
        <div class="custom-full-page-view-header-container-left">\
          <img class="custom-chevron-right-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAANCAYAAACUwi84AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABISURBVHgBpZDdCQAgCIRtE0doo9zMURqlEVohA3vzB+ng8OE7DrwGvrqYIrj0mnBnkCyIWluHV1PMEAi1YXyH3hdpyB2pHOIDPWEQQp4izIEAAAAASUVORK5CYII=">\
        </div>\
          <ul class="nav nav-tabs custom-nav-panel">\
            <li class="tabTitle">\
              {{each(key, facet) facets}}\
                <a class="capital facet" id="${facet.key}" href="#home" data-toggle="tab">{{html getFacetDisplayName(facet.key)}}\
                    <span class="resultCount">(${facet.value})</span>\
                </a>\
              {{/each}}\
            </li>\
          </ul>\
          <div class="custom-full-page-view-header-container-center-secondary">\
            <label class="kr-sg-toggle custom_toggle">\
              <input id="viewTypeCheckboxControl" type="checkbox">\
              <div class="slider"><span class="enabled">Customize</span><span class="disabled">Preview</span></div>\
            </label>\
            <div class="show_insights" data-displayInsights="true"><span class="show_insights_text">SHOW INSIGHTS </span><img class="show_insights_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBdY7NCcJAEIVnx58IZmVLSAe2oJ149OAmKSGWEC1AO0gJlmAJYg0Kgsm+0REEDcmDObz3fYch61FN1o+EeuJySawPB0ZotuMo6pRVAqRCCOVniDf1Ypbi/AbuR3I2Cxdl2s0XWN+sjOGM2Sy1Q+QkQHnbD49/ombqnznTYE5MJILrfTcq+n6nOK0Lvfb+ArpOOQuJ5trnAAAAAElFTkSuQmCC"></div>\
          </div>\
          {{if searchFacets.length}}\
            <button id="closeFacetFilterControl" class="display-none custom-button-filter-results custom-mt-3">\
              <img class="custom-icon-filter" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABGSURBVHgBlZBRCgAgCEMlUK/T/S/REbpK+BEUzZj7EvZwbOLuQ1W7JAovmH1MBD8egtMHp/FLuWAENamKiqbK0POYGTX4AopSGErWPoL3AAAAAElFTkSuQmCC">\
            </button>\
            <button id="openFacetFilterControl" class="custom-button-filter-results">\
              <img class="custom-icon-filter" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACYSURBVHgBvY+7EcIwDIalHIXdZQNWYAUmYAa3bggbJBOYxq/KMzBBVmEESlc2EkdBERJX+e9s6f779ELvfYUWtYDMdBSfzrnhHxRCuDJzoO+MiDPBRynlpJR6MZBS6nPOhtLTh2HTGNMLIUZKL2x+m830HuxzMf6OiTEOpRTuArXWm9b6DmuLLx3YQaN2AumgCbZkrR2X/DcSfTcxPB10vwAAAABJRU5ErkJggg==">\
              &nbsp;Filter\
            </button>\
          {{/if}}\
        </div>\
      </div>\
      <div class="ksa-resultsContainer">\
        <div class="resultsLeft">\
          <div class="tab-content">\
            <div id="home" class="tab-pane fade in active show fullSearch">\
                <p class="resultsText">Showing ${totalResultsCount} results for "${search}"</p>\
                <div class="show_insights display-none" data-displayInsights="true"><span>SHOW INSIGHTS <span><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBdY7NCcJAEIVnx58IZmVLSAe2oJ149OAmKSGWEC1AO0gJlmAJYg0Kgsm+0REEDcmDObz3fYch61FN1o+EeuJySawPB0ZotuMo6pRVAqRCCOVniDf1Ypbi/AbuR3I2Cxdl2s0XWN+sjOGM2Sy1Q+QkQHnbD49/ombqnznTYE5MJILrfTcq+n6nOK0Lvfb+ArpOOQuJ5trnAAAAAElFTkSuQmCC"></div>\
                {{if tasks.length && (selectedFacet === "task" || selectedFacet === "all results") }}\
                    <div class="quickAction fullAsstTask">\
                        <p class="quickTitle">MATCHED ACTIONS</p>\
                        {{each(key, task) selectedFacet === "all results" ? tasks.slice(0,4) : tasks }}\
                        <div class="creditCard ">\
                            <div class="creditCardIconDiv">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJ1BMVEUAAAAAVaoEbq4DbK8GbK4Gbq8Gba0Fba8Fba4Fbq4Eba4Fba7////SVqJwAAAAC3RSTlMAA0hJVYKDqKmq4875bAAAAAABYktHRAyBs1FjAAAAP0lEQVQI12NgwACMJi5A4CzAwLobDBIYOCaAxDknMLCvnAkEsyYwcECkkBicMDV4GGwQxQEMjCogK5wEMC0HALyTIMofpWLWAAAAAElFTkSuQmCC" class="credit-card">\
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
                  <div class="pages-wrp">\
                    {{each(key, page) selectedFacet === "all results" ? pages.slice(0,5) : pages }}\
                    <div class="faqs-shadow {{if viewType=="Preview"&&page.config.visible==false}}display-none{{/if}} {{if page.config.visible==false}}hide-actions{{/if}} {{if page.config.pinIndex>-1}}hide-visibility-control{{/if}}" boost="${page.config.boost}" pinIndex="${page.config.pinIndex}" visible="${page.config.visible}" contentId="${page.contentId}" contentType="${page.contentType}">\
                    <div class="indicator-div fullscreen"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAECAYAAAC6Jt6KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhSURBVHgBzc4xAQAACMMw5l9A6wZraOBbFCTqTpUAr9IBX2UFDghGZ8AAAAAASUVORK5CYII="></div>\
                      <div class="notification-div"></div>\
                      <a class="faqs-wrp-content" href="${page.url}" target="_blank">\
                        <div class="image-url-sec">\
                          <img src="${page.imageUrl}"></img>\
                        </div>\
                        <div class="pages-content">\
                          <div class="title" title="${page.title}">${page.title}\
                          <span class="custom-external-link-show-container display-none">\
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABnSURBVHgBnZHdDYAgDIRPJ3GEbqSb6EaOpBvgBgimSNPwf8k9FO67EDqhLItBkfMVClZnw4P0ocIUAD8slWaST7SN4SKgwzs01dKcA04VrgIp/ZkZnfLAg/y3gu9uebAhbjFlw5lPL9CZJwJeTcCIAAAAAElFTkSuQmCC">\
                          </span>\
                          </div>\
                          <div class="desc-info">${page.searchResultPreview}</div>\
                          <div class="custom-matched-results-container">\
                            <div class="custom-matched-results-page-icon">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACeSURBVHgBjZDNDQIhEIXZyR44agfagS1YgiVwJBShWwQhnCjBEixBO5AO3CMndJ4JyYb9Ce8yMPPNe4HOe3/NOd/EXCP3z8aYFy6dc+4rpdwrpcYphT6XyPAFMKFZQ0WAiOhurT31Yl2RoScOXB8lYlNgSDSqrzbfXA4lWmt9XASng1bHWC81O/4fE0LYrQFlBschpfTh2EWQZ/j44QdAT0c3vu2rHAAAAABJRU5ErkJggg==">\
                            </div>\
                            <div class="custom-matched-results-page-summary">\
                              <span class="custom-matched-results-page-summary-content">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgBPU/LDYJAFHQXuHDREiwBOtASrEA9wgWsYKECJYQQTmoFliBWYAtbAtxI+DmTsJI88ubNvJl9YrV8eZ7vbNtW8zx7QogNRjXqGQTBg7zkr6oqZVnWC+0HIn+aJp8ilCrLUlEjiqI4SSkJ9sMwbB3HOaLf9H2fIUEj4TuO40HCiURKEV1BtHBsIXpzhgQuKBtDD+QFTldsZmEYJoxCpIYgRsuKkCpr13U1QIPS5jgsE6+7rmvgWgtD4KAY7hHizsRwu/NJ5uq/cIlL4BQtMMUzbob7AcvvZ8ELJe2ZAAAAAElFTkSuQmCC">\
                                <span>VIEWS</span>\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgBnZHRDYJADIZ7hwk8OoJuoBvgBjqB4ZEnRgA28I3AC2ECdQNGcAMZwQXg/KuHQTxOY5Om0OvXa/8TNLI8z+Ou6xJ8JmEYpmQwOU5oYMkQTZg0JXFDQxaT9IfNbIdZlimEGu7TYEcrRM/drn1Ek4RhyWpxR3g8JvrdBjs+BBIMQLG14zilUuqkxxBkGZmFSDWwE0Js6QeT6JoAOAM4avDyFdIzv4FTxUVRrBCa1zsNwbIs5yaobdsI+1cfC2tZ93B+k5qVQ26BZhH+fdd1N0aVUORzEbpy5FsbeOV53iEIgtsdmbJxSEqhuZgAAAAASUVORK5CYII=">\
                                <span>CLICKS</span>\
                              </span>\
                            </div>\
                          </div>\
                          <div class="custom-full-search-matched-results-actions custom-live-search-matched-results-actions">\
                            <span class="custom-actions">\
                              <span class="img-action dont-show visibility" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">\
                                {{if page.config.visible==true}}\
                                  <span class="custom-actions-content">HIDE</span>\
                                {{/if}}\
                                {{if page.config.visible==false}}\
                                  <span class="custom-actions-content">UNHIDE</span>\
                                {{/if}}\
                              </span>\
                              <span class="img-action pin pinning" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                                {{if page.config.pinIndex==-1}}\
                                  <span class="custom-actions-content">PIN</span>\
                                {{/if}}\
                                {{if page.config.pinIndex>-1}}\
                                  <span class="custom-actions-content">UNPIN</span>\
                                {{/if}}\
                              </span>\
                              <span class="img-action boostup boosting" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABySURBVHgBhY1RDYAwDAWbYGAS+ORzEpCCE3AADjYH04CCScAKhbTJy2jZSy6w5S4jsrcKnw2OPDOBmZiTfrYzGc6ZnJeeJZBHQaNkyQfIl6DRhlGRC5QXwYyCIevaSL/vT21kjCrKUS4i+YsYlY6MUbkBGj8attkkmHEAAAAASUVORK5CYII=">\
                                <span class="custom-actions-content">BOOST</span>\
                              </span>\
                              <span class="img-action boostdown burying" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABzSURBVHgBhY8BDYAgEEW/DYxAA2lEFGigDaCBGUxgBKsI8/52smP87cOA98YOAM5aj3m8sHC190TyPUMpGHCQN6dh7k8nBbkjs7Yl10ZD6uHIGVqKIWl4F+aXIr9RIpwtmElKInxoYBlIG74BLzlPk0bgC7ouGvZUI7q8AAAAAElFTkSuQmCC">\
                                <span class="custom-actions-content">BURY</span>\
                            </span>\
                          </div>\
                        </div>\
                        <img class="external-link-show" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACwSURBVHgBjZHRDcIgGIR/CAO5gTqJfWlf6wbWCUwfCw8yCm7gCE4C3k9ogtgSLmn+tnyXO0AYYx5EdKVCfd+LZVmslPKS/1cMCyGs9/5VmgDbEILD+ojPw2oghodhsBspDg1uCX7zlFRRgic8dyTNMbUFRtKEWh+urlrgtR6GUy0wS2vdIeEpC/i0Bef6MaTY8x78Z8hMu4p7wAUd0bHGRQZHSwobmfEyYnY1A8PMfgGDQ1B/OCu3QAAAAABJRU5ErkJggg==">\<img class="external-link-show" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACwSURBVHgBjZHRDcIgGIR/CAO5gTqJfWlf6wbWCUwfCw8yCm7gCE4C3k9ogtgSLmn+tnyXO0AYYx5EdKVCfd+LZVmslPKS/1cMCyGs9/5VmgDbEILD+ojPw2oghodhsBspDg1uCX7zlFRRgic8dyTNMbUFRtKEWh+urlrgtR6GUy0wS2vdIeEpC/i0Bef6MaTY8x78Z8hMu4p7wAUd0bHGRQZHSwobmfEyYnY1A8PMfgGDQ1B/OCu3QAAAAABJRU5ErkJggg==">\
                      </a>\
                      <div class="faqs-bottom-actions display-none">\
                        <span class="appearences">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                          <span class="appearences-count">155 Appearances - 138 Clicks</span>\
                        </span>\
                        <span class="actions">\
                          <span class="img-action  dont-show">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">\
                        </span>\
                        <span class="img-action pin">\
                          <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                        </span>\
                        <span class="img-action boostup">\
                          <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAOCAYAAADjXQYbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBddC9EYJAEIbh9UwMLYESLOE6UDvACizBEiwBrEA7UCuwBDEzNDWCd2c+GH6OnXmA+ZbljjOb1g65zdQbMdU4ocZ63MjwwjU15eEGtzZY6p7jjy9WeHi40Pd9aq+XtqjwDFyOuOCHEgcNWNCDh2ctEfFR1tW9t+NB+S4LNbI2DL1m1NqVJf6xsJkqLXFkDWdFGmqp7HU+AAAAAElFTkSuQmCC">\
                        </span>\
                        <span class="img-action boostdown">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABjSURBVHgBpc6BDYAwCATA10k6QkfRSV3FDToKSoSGKEqon1DSpAcFrmxnVSTDoEnXSsFmBriZHKjhL6/mvuPH5sIHBbCaAYv0jr4wBJC+uyMPF9kQotfNM+LQCHrgDOp4BOEARLAffv7ZxAUAAAAASUVORK5CYII=">\
                        </span>\
                      </span>\
                    </div>\
                  </div>\
                {{/each}}\
                </div>\
                {{if selectedFacet !== "page" && pages.length>5}}\
                  <div class="ksa-showMore custom-show-more-container">Show More</div>\
                {{/if}}\
              </div>\
              {{/if}}\
              {{if faqs.length && (selectedFacet === "faq" || selectedFacet === "all results") }}\
              <div class="ksa-mostlyAsked fullAsstFaq matched-faq-containers">\
                <div class="mostlyAskedTitle">MATCHED FAQS</div>\
                <div class="tasks-wrp">\
                  {{each(key, faq) selectedFacet === "all results" ? faqs.slice(0,5) : faqs  }}\
                  <div class="faqs-shadow custom-position-relative {{if viewType=="Preview"&&faq.config.visible==false}}display-none{{/if}} {{if faq.config.visible==false}}hide-actions{{/if}} {{if faq.config.pinIndex>-1}}hide-visibility-control{{/if}}"" boost="${faq.config.boost}" pinIndex="${faq.config.pinIndex}" visible="${faq.config.visible}" contentId="${faq.contentId}" contentType="${faq.contentType}">\
                  <div class="indicator-div fullscreen"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAECAYAAAC6Jt6KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhSURBVHgBzc4xAQAACMMw5l9A6wZraOBbFCTqTpUAr9IBX2UFDghGZ8AAAAAASUVORK5CYII="></div>\
                    <div class="notification-div"></div>\
                    <div class="faqs-wrp-content">\
                      <div class="title">\
                        <span class="accordion" id="${key}">${faq.question}</span>\
                        <div class="panel">\
                          <div class="content-inner">{{html getHTMLForSearch(faq.answer)}}</div>\
                          <div class="divfeedback">\
                            <span class="yesLike"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtdXAtZ3JheTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ0aHVtYnMtdXAtZ3JheSIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="thumbs-up"></span>\
                            <span class="noDislike"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtZG93bi1ncmF5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InRodW1icy1kb3duLWdyYXkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA3LjAwMDAwMCkgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTcuMDAwMDAwLCAtNy4wMDAwMDApICIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="thumbs-down"></span>\
                          </div>\
                        </div>\
                      </div>\
                      <div class="desc-info">{{html getHTMLForSearch(faq.answer)}}</div>\
                      <div class="custom-matched-results-container">\
                        <div class="custom-matched-results-faq-icon">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFuSURBVHgBjVPNbYMwGAUnOeTWDZoR0g2aCUomIJG4IITSDZKMECEESEilE5RM0GzQbtCyQY5wAPoeAuq6KY2lDxt/730/z7amDYwgCGa0IYyubniedz+ZTMyqqgxd12+4V9f1GesUy71t258yXsg/URRtR6PRCwgZCHcA6zSu4c5gr6hoe7ECkpF1heVCzSK3xCCwBJh9H0By9OQwDDeo5LHl9gRisf9WluXSdd1T1wKzP3fkFkTygoYWDGpDHzH4P4zHY7PXAGBDCJF0pUIHitcEpCHbEXtzqRtijaaFtvwPinWpb9/35yA/IclS1ga8Gqc1E9rAYHCSUcH6L2EFHTznOI5vVSdbY/mO47yrgTGdLcvKugqORVGs1QDT6TSRtemzCkEB02bND1QlcKNe2zzPKdRKzd7el+970Dp2mBj534vEI0dbux8BlCCJ1h6jRDR5N2CHjvwrQAcGiIAH+TGhxRQzg560a8c1z/kLZhPUDza2l/UAAAAASUVORK5CYII=">\
                        </div>\
                        <div class="custom-matched-results-faq-summary">\
                          <span class="custom-matched-results-faq-summary-content">\
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgBPU/LDYJAFHQXuHDREiwBOtASrEA9wgWsYKECJYQQTmoFliBWYAtbAtxI+DmTsJI88ubNvJl9YrV8eZ7vbNtW8zx7QogNRjXqGQTBg7zkr6oqZVnWC+0HIn+aJp8ilCrLUlEjiqI4SSkJ9sMwbB3HOaLf9H2fIUEj4TuO40HCiURKEV1BtHBsIXpzhgQuKBtDD+QFTldsZmEYJoxCpIYgRsuKkCpr13U1QIPS5jgsE6+7rmvgWgtD4KAY7hHizsRwu/NJ5uq/cIlL4BQtMMUzbob7AcvvZ8ELJe2ZAAAAAElFTkSuQmCC">\
                            <span>VIEWS</span>\
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgBnZHRDYJADIZ7hwk8OoJuoBvgBjqB4ZEnRgA28I3AC2ECdQNGcAMZwQXg/KuHQTxOY5Om0OvXa/8TNLI8z+Ou6xJ8JmEYpmQwOU5oYMkQTZg0JXFDQxaT9IfNbIdZlimEGu7TYEcrRM/drn1Ek4RhyWpxR3g8JvrdBjs+BBIMQLG14zilUuqkxxBkGZmFSDWwE0Js6QeT6JoAOAM4avDyFdIzv4FTxUVRrBCa1zsNwbIs5yaobdsI+1cfC2tZ93B+k5qVQ26BZhH+fdd1N0aVUORzEbpy5FsbeOV53iEIgtsdmbJxSEqhuZgAAAAASUVORK5CYII=">\
                            <span>CLICKS</span>\
                          </span>\
                        </div>\
                      </div>\
                      <div class="custom-full-search-matched-results-actions custom-live-search-matched-results-actions">\
                          <span class="custom-actions">\
                            <span class="img-action dont-show visibility" data-viewMode="full">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">&nbsp;\
                              {{if faq.config.visible==true}}\
                                <span class="custom-actions-content">HIDE</span>\
                              {{/if}}\
                              {{if faq.config.visible==false}}\
                                <span class="custom-actions-content">UNHIDE</span>\
                              {{/if}}\
                            </span>\
                            <span class="img-action pin pinning" data-viewMode="full">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                              {{if faq.config.pinIndex==-1}}\
                                <span class="custom-actions-content">PIN</span>\
                              {{/if}}\
                              {{if faq.config.pinIndex>-1}}\
                                <span class="custom-actions-content">UNPIN</span>\
                              {{/if}}\
                            </span>\
                            <span class="img-action boostup boosting" data-viewMode="full">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABySURBVHgBhY1RDYAwDAWbYGAS+ORzEpCCE3AADjYH04CCScAKhbTJy2jZSy6w5S4jsrcKnw2OPDOBmZiTfrYzGc6ZnJeeJZBHQaNkyQfIl6DRhlGRC5QXwYyCIevaSL/vT21kjCrKUS4i+YsYlY6MUbkBGj8attkkmHEAAAAASUVORK5CYII=">\
                              <span class="custom-actions-content">BOOST</span>\
                            </span>\
                            <span class="img-action boostdown burying" data-viewMode="full">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABzSURBVHgBhY8BDYAgEEW/DYxAA2lEFGigDaCBGUxgBKsI8/52smP87cOA98YOAM5aj3m8sHC190TyPUMpGHCQN6dh7k8nBbkjs7Yl10ZD6uHIGVqKIWl4F+aXIr9RIpwtmElKInxoYBlIG74BLzlPk0bgC7ouGvZUI7q8AAAAAElFTkSuQmCC">\
                              <span class="custom-actions-content">BURY</span>\
                            </span>\
                          </div>\
                    </div>\
                  <div class="faqs-bottom-actions">\
                    <span class="appearences">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                    <span class="appearences-count">155 Appearances - 138 Clicks</span>\
                    </span>\
                    <span class="actions">\
                    <span class="img-action  dont-show">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">\
                    </span>\
                    <span class="img-action pin">\
                    <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                    </span>\
                    <span class="img-action boostup">\
                    <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAOCAYAAADjXQYbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBddC9EYJAEIbh9UwMLYESLOE6UDvACizBEiwBrEA7UCuwBDEzNDWCd2c+GH6OnXmA+ZbljjOb1g65zdQbMdU4ocZ63MjwwjU15eEGtzZY6p7jjy9WeHi40Pd9aq+XtqjwDFyOuOCHEgcNWNCDh2ctEfFR1tW9t+NB+S4LNbI2DL1m1NqVJf6xsJkqLXFkDWdFGmqp7HU+AAAAAElFTkSuQmCC">\
                    </span>\
                    <span class="img-action boostdown">\
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABjSURBVHgBpc6BDYAwCATA10k6QkfRSV3FDToKSoSGKEqon1DSpAcFrmxnVSTDoEnXSsFmBriZHKjhL6/mvuPH5sIHBbCaAYv0jr4wBJC+uyMPF9kQotfNM+LQCHrgDOp4BOEARLAffv7ZxAUAAAAASUVORK5CYII=">\
                    </span>\
                    </span>\
                  </div>\
                </div>\
                {{/each}}\
              </div>\
                    {{if selectedFacet !== "faq" && faqs.length>5}}\
                  <div class="moreFaqs custom-show-more-container">Show All</div>\
                {{/if}}\
              </div>\
              {{/if}}\
              {{if documents.length && (selectedFacet === "document" || selectedFacet === "all results")}}\
                <div class="matched-faq-containers matched-pages-container ksa-relatedPages fullAsstPage">\
                  <div class="relatedPagesTitle">MATCHED DOCUMENTS</div>\
                  <div class="pages-wrp">\
                    {{each(key, document) selectedFacet === "all results" ? documents.slice(0,5) : documents }}\
                    <div class="faqs-shadow {{if viewType=="Preview"&&document.config.visible==false}}display-none{{/if}} {{if document.config.visible==false}}hide-actions{{/if}} {{if document.config.pinIndex>-1}}hide-visibility-control{{/if}}" boost="${document.config.boost}" pinIndex="${document.config.pinIndex}" visible="${document.config.visible}" contentId="${document.contentId}" contentType="${document.contentType}">\
                    <div class="indicator-div fullscreen"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAECAYAAAC6Jt6KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhSURBVHgBzc4xAQAACMMw5l9A6wZraOBbFCTqTpUAr9IBX2UFDghGZ8AAAAAASUVORK5CYII="></div>\
                      <div class="notification-div"></div>\
                      <a class="faqs-wrp-content" href="${document.externalFileUrl}" target="_blank" id=${key}>\
                        <div class="image-url-sec">\
                          <img src="${document.imageUrl}"></img>\
                        </div>\
                        <div class="pages-content">\
                          <div class="title" title="${document.title}">${document.title}\
                          <span class="custom-external-link-show-container display-none">\
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABnSURBVHgBnZHdDYAgDIRPJ3GEbqSb6EaOpBvgBgimSNPwf8k9FO67EDqhLItBkfMVClZnw4P0ocIUAD8slWaST7SN4SKgwzs01dKcA04VrgIp/ZkZnfLAg/y3gu9uebAhbjFlw5lPL9CZJwJeTcCIAAAAAElFTkSuQmCC">\
                          </span>\
                          </div>\
                          <div class="desc-info">${document.searchResultPreview}</div>\
                          <div class="custom-matched-results-container">\
                            <div class="custom-matched-results-page-icon">\
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACeSURBVHgBjZDNDQIhEIXZyR44agfagS1YgiVwJBShWwQhnCjBEixBO5AO3CMndJ4JyYb9Ce8yMPPNe4HOe3/NOd/EXCP3z8aYFy6dc+4rpdwrpcYphT6XyPAFMKFZQ0WAiOhurT31Yl2RoScOXB8lYlNgSDSqrzbfXA4lWmt9XASng1bHWC81O/4fE0LYrQFlBschpfTh2EWQZ/j44QdAT0c3vu2rHAAAAABJRU5ErkJggg==">\
                            </div>\
                            <div class="custom-matched-results-page-summary">\
                              <span class="custom-matched-results-page-summary-content">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgBPU/LDYJAFHQXuHDREiwBOtASrEA9wgWsYKECJYQQTmoFliBWYAtbAtxI+DmTsJI88ubNvJl9YrV8eZ7vbNtW8zx7QogNRjXqGQTBg7zkr6oqZVnWC+0HIn+aJp8ilCrLUlEjiqI4SSkJ9sMwbB3HOaLf9H2fIUEj4TuO40HCiURKEV1BtHBsIXpzhgQuKBtDD+QFTldsZmEYJoxCpIYgRsuKkCpr13U1QIPS5jgsE6+7rmvgWgtD4KAY7hHizsRwu/NJ5uq/cIlL4BQtMMUzbob7AcvvZ8ELJe2ZAAAAAElFTkSuQmCC">\
                                <span>VIEWS</span>\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgBnZHRDYJADIZ7hwk8OoJuoBvgBjqB4ZEnRgA28I3AC2ECdQNGcAMZwQXg/KuHQTxOY5Om0OvXa/8TNLI8z+Ou6xJ8JmEYpmQwOU5oYMkQTZg0JXFDQxaT9IfNbIdZlimEGu7TYEcrRM/drn1Ek4RhyWpxR3g8JvrdBjs+BBIMQLG14zilUuqkxxBkGZmFSDWwE0Js6QeT6JoAOAM4avDyFdIzv4FTxUVRrBCa1zsNwbIs5yaobdsI+1cfC2tZ93B+k5qVQ26BZhH+fdd1N0aVUORzEbpy5FsbeOV53iEIgtsdmbJxSEqhuZgAAAAASUVORK5CYII=">\
                                <span>CLICKS</span>\
                              </span>\
                            </div>\
                          </div>\
                          <div class="custom-full-search-matched-results-actions custom-live-search-matched-results-actions">\
                            <span class="custom-actions">\
                              <span class="img-action dont-show visibility" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">&nbsp;\
                                {{if document.config.visible==true}}\
                                  <span class="custom-actions-content">HIDE</span>\
                                {{/if}}\
                                {{if document.config.visible==false}}\
                                  <span class="custom-actions-content">UNHIDE</span>\
                                {{/if}}\
                              </span>\
                              <span class="img-action pin pinning" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                                {{if document.config.pinIndex==-1}}\
                                  <span class="custom-actions-content">PIN</span>\
                                {{/if}}\
                                {{if document.config.pinIndex>-1}}\
                                  <span class="custom-actions-content">UNPIN</span>\
                                {{/if}}\
                              </span>\
                              <span class="img-action boostup boosting" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABySURBVHgBhY1RDYAwDAWbYGAS+ORzEpCCE3AADjYH04CCScAKhbTJy2jZSy6w5S4jsrcKnw2OPDOBmZiTfrYzGc6ZnJeeJZBHQaNkyQfIl6DRhlGRC5QXwYyCIevaSL/vT21kjCrKUS4i+YsYlY6MUbkBGj8attkkmHEAAAAASUVORK5CYII=">\
                                <span class="custom-actions-content">BOOST</span>\
                              </span>\
                              <span class="img-action boostdown burying" data-viewMode="full">\
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABzSURBVHgBhY8BDYAgEEW/DYxAA2lEFGigDaCBGUxgBKsI8/52smP87cOA98YOAM5aj3m8sHC190TyPUMpGHCQN6dh7k8nBbkjs7Yl10ZD6uHIGVqKIWl4F+aXIr9RIpwtmElKInxoYBlIG74BLzlPk0bgC7ouGvZUI7q8AAAAAElFTkSuQmCC">\
                                <span class="custom-actions-content">BURY</span>\
                            </span>\
                          </div>\
                        </div>\
                        <img class="external-link-show" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACwSURBVHgBjZHRDcIgGIR/CAO5gTqJfWlf6wbWCUwfCw8yCm7gCE4C3k9ogtgSLmn+tnyXO0AYYx5EdKVCfd+LZVmslPKS/1cMCyGs9/5VmgDbEILD+ojPw2oghodhsBspDg1uCX7zlFRRgic8dyTNMbUFRtKEWh+urlrgtR6GUy0wS2vdIeEpC/i0Bef6MaTY8x78Z8hMu4p7wAUd0bHGRQZHSwobmfEyYnY1A8PMfgGDQ1B/OCu3QAAAAABJRU5ErkJggg==">\<img class="external-link-show" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACwSURBVHgBjZHRDcIgGIR/CAO5gTqJfWlf6wbWCUwfCw8yCm7gCE4C3k9ogtgSLmn+tnyXO0AYYx5EdKVCfd+LZVmslPKS/1cMCyGs9/5VmgDbEILD+ojPw2oghodhsBspDg1uCX7zlFRRgic8dyTNMbUFRtKEWh+urlrgtR6GUy0wS2vdIeEpC/i0Bef6MaTY8x78Z8hMu4p7wAUd0bHGRQZHSwobmfEyYnY1A8PMfgGDQ1B/OCu3QAAAAABJRU5ErkJggg==">\
                      </a>\
                      <div class="faqs-bottom-actions display-none">\
                        <span class="appearences">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBrVLbbYNAEDye4pMSkg7iChJXEFKBgwRC/KUD4wr8iXhIZ1eQpII4FZgS6CD8gyCzDqA7ZBRZ9kir4253b+dmYOxKKOxCpGn6qqrqY13XmzAMS32uMEkSp23bgoqkiYrCu65jhmHQ1lVnmiNMeUfRl3gex/EdlqqPT+kJNLFpmtI0zWds3xB2P3FHdHHhA763iL3v+9HISJi47s8OiA0KbTyhxOqA8gorTWdolnTTJ+8rPc9bMhkFBlBuTflJjp00CIIgQvJF07QFO4P/8heBc26TXhKDcyC/8zznvfIjIOiRHCLdaD9qMPhuWVaFImfq91A3iCkxGHzXdf0IK39QtMLxnv35/QQmJ8pZlpFTBWJJukgM+tsrCHXvum41nFEzmG3RzGmPAQvx71TEQjQfxGbheTswJFbz/wH8/2AzAIMIl3dYv9mt8Qs1FJbJYYs8PAAAAABJRU5ErkJggg==">\
                          <span class="appearences-count">155 Appearances - 138 Clicks</span>\
                        </span>\
                        <span class="actions">\
                          <span class="img-action  dont-show">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC1SURBVHgBrZIBDYNADEUr4SScBCQgpQ42B8zBcAAONgdIQMIkIIH14F3SNMu2EJr8BHrt6y+HyB4PU5aDoabXWYBkmkyraeFZ5Qv8QnF00Mi+Vj27xsa7aWbCxLQm1JR8D6CryY7GRFPGYgS0ADKA8r41ti4pgNYA8Odqego7+MmJgp73CkjkKkSrpRHAwP4+1K1Tony8W6jZEgt2B1fcMunnf5CxNgPx9zzK51v4O/QMQHEnbzn9OwsfLWhBAAAAAElFTkSuQmCC">\
                        </span>\
                        <span class="img-action pin">\
                          <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUSURBVHgBhZDdTcNADIB9d21UqUTKBmSEMgFkgzIB8IaAljIBjFBEeaYblA2aDWCDhA0iAQJVORs7JeBG/fHT6ezP9meAHRFelf1oRJH+s9uA7sWiB9bMEGmuQbMJkCJP+AIE8bLQvFprkmJsio2TkOC2BiQIqFdPtLpz5/wrrt8E2G82EtCX/qiCwkF56hGzdhBk4dBnknDGJrxTrpicEJP3Seu5gpxzKRcUv8lY5D3CYQ3y1Htn7cHHpJ0u/f7Xi1l8rj1Y7Ni1XCryes0/J07kRDBdkbDmqQmsQOGQTnjsHZK/US5R55L210IC8C5TIDr7fAjG+gjfj+atCVUAX4zkgvpfHLuDxQjWxd51OWsCu+IHsnKAm7OWvF8AAAAASUVORK5CYII=">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB+SURBVHgBjU8BDYAwDFsIApBwHCABCUjAySWABBwg4RKQgIRLgC0pyfI9H02abX+3bkQ+NubDjFL0jngBR+bpaGli3oiCAKdf4q/eSXUnTBDminjWExPoOZF2kI9YvOeauNVkjuxUPiCuZJ0M9K4Budx0eWK9XkI0OKhxWIkXQpkdq3Ea0+4AAAAASUVORK5CYII=">\
                        </span>\
                        <span class="img-action boostup">\
                          <img class="hide" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgBbVDdUcMwDJbi5A4OzJUJyAhlgzIBYQLaV2haOkEYgdIX3jICI8AIbEDZgLv2oYktqXbu3J+kerAtf9L36RPAibiaSHH2LDenMOi9SKonJCGP2gXM8iki3yGPW9RTBy4B5a9T4KmJJAPhOQL2OhIkXDDZmUQyYMU/4R/9cTk2A8TocbVQI53zF4CT8fMQzRsJRFUYU438Wyl8MLVNVRKXZOgfLp7qvs7t0IM6p7K5p1Tqsc12EkHGTZRFEP8y2Ov1e/J65EJQ+iDgLQ4deNux6TrvHZjWdXUHB7FfVMMgs83H+fKwQIUlsVC1XiRv0IotPHprsTWUw1EAAAAASUVORK5CYII=">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAOCAYAAADjXQYbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACUSURBVHgBddC9EYJAEIbh9UwMLYESLOE6UDvACizBEiwBrEA7UCuwBDEzNDWCd2c+GH6OnXmA+ZbljjOb1g65zdQbMdU4ocZ63MjwwjU15eEGtzZY6p7jjy9WeHi40Pd9aq+XtqjwDFyOuOCHEgcNWNCDh2ctEfFR1tW9t+NB+S4LNbI2DL1m1NqVJf6xsJkqLXFkDWdFGmqp7HU+AAAAAElFTkSuQmCC">\
                        </span>\
                        <span class="img-action boostdown">\
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABjSURBVHgBpc6BDYAwCATA10k6QkfRSV3FDToKSoSGKEqon1DSpAcFrmxnVSTDoEnXSsFmBriZHKjhL6/mvuPH5sIHBbCaAYv0jr4wBJC+uyMPF9kQotfNM+LQCHrgDOp4BOEARLAffv7ZxAUAAAAASUVORK5CYII=">\
                        </span>\
                      </span>\
                    </div>\
                  </div>\
                {{/each}}\
                </div>\
                {{if selectedFacet !== "document" && documents.length>5}}\
                  <div class="ksa-showMore custom-show-more-container">Show More</div>\
                {{/if}}\
              </div>\
              {{/if}}\
              <div class="custom-add-new-result-container">\
                <div class="custom-add-new-result-icon-container">\
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADOSURBVHgBpVLRFYIwDDx4DsAIdQM2sJuAEwgTyCbgKE6AG4ATMAImj6vUVvDDe+8ebXrphSbAJzLhVTgIZ7IXtkLjC1NvXTBBBWfhkayFCS+oAiNcmGSxjZyawgWMcOLBL1hqs4T1g+X5KPntgrjuxwOdasQw+A5NbNVxpujpOen+xP1dHbA669mQ4g9svWZDhlBtr443eE/sYSRDqPahC52WCfs9dMipNS5QYil5r5eWmmh6Kt7WUmRIy9iEtbcRVNhhmUs35OrSYPmlN14wTi/zFOG6gwAAAABJRU5ErkJggg==">\
                </div>\
                <div class="custom-add-new-result-content">\
                  <span><strong>Not finding the result</strong></span>\
                  <span>Add new result from repository</span>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
        {{if searchFacets.length}}\
        <div class="filters-container">\
          <div class="filters-header">\
            <div class="filters-heading">Filter by</div>\
            <div class="filters-reset">\
              <div class="filters-reset-anchor">Clear all</div>\
            </div>\
          </div>\
          <div class="filters-body">\
            {{each(i, searchFacet) searchFacets}}\
              <div class="filters-content" data-facetType="${searchFacet.facetType}" data-fieldName="${searchFacet.fieldName}">\
                <div class="filters-content-heading">${searchFacet.facetName}</div>\
                {{each(j, bucket) searchFacet.buckets}}\
                  {{if searchFacet.facetType == "value"}}\
                    <div class="kr-sg-checkbox d-block custom_checkbox">\
                      <input id="checkbox-${i}${j}" class="checkbox-custom" type="checkbox" name=${bucket.key} value="true">\
                      <label for="checkbox-${i}${j}" class="checkbox-custom-label">${bucket.key} <span class="associated-filter-count">(${bucket.doc_count})</span></label>\
                    </div>\
                  {{/if}}\
                  {{if searchFacet.facetType == "range"}}\
                    <div class="kr-sg-checkbox d-block custom_checkbox">\
                      <input id="checkbox-${i}${j}" class="checkbox-custom" type="checkbox" name=${bucket.key} value="true">\
                      <label for="checkbox-${i}${j}" class="checkbox-custom-label">${bucket.key} <span class="associated-filter-count">(${bucket.doc_count})</span></label>\
                    </div>\
                  {{/if}}\
                {{/each}}\
              </div>\
            {{/each}}\
          </div>\
        </div>\
        {{/if}}\
        <div class="ksa-resultsRight">\
            <div class="rightContainer">\
                <div class="rightContentSubTitle">Near by Branch/ATM</div>\
                <div class="img-block"><img src="data:image/png;base64,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" class="rightContainerImages"></div>\
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
                  <div><span>${cardValue.card_number}</span></div>\
                </div>\
                <div class="due-wrap">\
                    <div class="due-amount btm-margin">\
                      <div class="card-sm-text">Due amount</div>\
                      <div class="card-bold-text card-amount"><span></span> ${cardValue.bill_amount}</div>\
                    </div>\
                    <div class="due-date btm-margin">\
                      <div class="card-sm-text">Due date</div>\
                      <div class="card-bold-text card-date">${cardValue.due_date}</div>\
                    </div>\
                </div>\
                <div class="pay-button-wrp">\
                  <button msgData="${JSON.stringify(cardValue)}" class="pay-button">Pay now</button>\
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
                  <div class="c-data">\Hello! How can I help you today?</div>\
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
                  <div class="c-data">\Hello! How can I help you today?</div>\
                  <div class="c-date">\Today</div>\
                </div>\
              </div>\
            </div>\
        </div>\
      {{if popularSearches && popularSearches.length}}\
          <div class="search-heads">POPULAR SEARCHES</div>\
            <div class="search-recent-column" >\
              {{each(key, term) popularSearches }}\
                {{if term}}\
                  <div class="recentSearch pl-0">\
                    <span id="${term.query || term._id}" action-type="textTask" class="pointer recentText">${term.query || term._id}</span>\
                  </div>\
                  {{/if}}\
              {{/each}}\
            </div>\
          </div>\
      {{/if}}\
        {{if recents && recents.length}}\
        <div class="recentContainer">\
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
        </div>\
            {{if recentTasks && recentTasks.length}}\
              <div class="resultsButtons finalResults asstTask hide" >\
                  <span class="search-heads">RECENT ACTIONS</span>\
                  <div class="faqBtnContainer">\
                      {{each(key, task) recentTasks }}\
                        <button id="${task}" action-type="actionTask" class="recentTasks search-task" title="${task}" >\
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJ1BMVEUAAAAAVaoEbq4DbK8GbK4Gbq8Gba0Fba8Fba4Fbq4Eba4Fba7////SVqJwAAAAC3RSTlMAA0hJVYKDqKmq4875bAAAAAABYktHRAyBs1FjAAAAP0lEQVQI12NgwACMJi5A4CzAwLobDBIYOCaAxDknMLCvnAkEsyYwcECkkBicMDV4GGwQxQEMjCogK5wEMC0HALyTIMofpWLWAAAAAElFTkSuQmCC" class="credit-card">\
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
    FindlySDK.prototype.getListTemplate = function (type) {
      var listT =
        '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
            {{if msgData.message}} \
                <li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="kore-list-template-div {{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon listView"> \
                    <div class="listViewTmplContent {{if msgData.message[0].component.payload.boxShadow}}noShadow{{/if}}"> \
                        {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                        {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
                        <ul class="listViewTmplContentBox"> \
                            {{if msgData.message[0].component.payload.text || msgData.message[0].component.payload.heading}} \
                                <li class="listViewTmplContentHeading"> \
                                    {{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html msgData.message[0].component.payload.text}} {{else}} {{html msgData.message[0].component.payload.text}} {{/if}} \
                                    {{if msgData.message[0].component.payload.sliderView}} <button class="close-button" title="Close"><img src="data:image/svg+xml;base64,           PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>{{/if}}\
                                    {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                        <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                    {{/if}} \
                                </li> \
                            {{/if}} \
                            <div class="listItems">\
                            {{each(key, msgItem) msgData.message[0].component.payload.elements}} \
                            {{if (msgData.message[0].component.payload.seeMore && key < msgData.message[0].component.payload.moreCount) || (!msgData.message[0].component.payload.seeMore)}}\
                                        <li class="listViewTmplContentChild"> \
                                            {{if msgItem.image_url}} \
                                                <div class="listViewRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                                    <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                                </div> \
                                            {{/if}} \
                                            <div class="listViewLeftContent" data-url="${msgItem.default_action.url}" data-title="${msgItem.default_action.title}" data-value="${msgItem.default_action.title}"> \
                                                <span class="titleDesc">\
                                                <div class="listViewItemTitle" title="${msgItem.title}">{{if msgData.type === "bot_response"}} {{html msgItem.title}} {{else}} {{html msgItem.title}} {{/if}}</div> \
                                                {{if msgItem.subtitle}}<div class="listViewItemSubtitle" title="${msgItem.subtitle}">{{if msgData.type === "bot_response"}} {{html msgItem.subtitle}} {{else}} {{html msgItem.subtitle}} {{/if}}</div>{{/if}} \
                                                </span>\
                                            {{if msgItem.value}}<div class="listViewItemValue" title="${msgItem.value}">{{if msgData.type === "bot_response"}} {{html msgItem.value}} {{else}} {{html msgItem.value}} {{/if}}</div>{{/if}} \
                                            </div>\
                                        </li> \
                                        {{/if}}\
                            {{/each}} \
                            </div>\
                            {{if msgData.message[0].component.payload.seeMore}}\
                            <li class="seeMore"> \
                                <span class="seeMoreList">${msgData.message[0].component.payload.buttons[0].title}</span> \
                            </li> \
                            {{/if}}\
                        </ul> \
                    </div> \
                </li> \
            {{/if}} \
          </script>';
      return listT;
    }
    FindlySDK.prototype.getSuggestion = function (suggestions) {
      var _self = this;
      var $suggest = $('#suggestion');
      // some other key was pressed
      var needle = $('#search').val();

      // is the field empty?
      if (!$.trim(needle).length) {
        $suggest.val("");
        return false;
      }

      _self.vars.showingMatchedResults = false;

      // compare input with suggestion array
      $.each(suggestions, function (i, term) {
        // _self.vars.customizeView = false;
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

      if (!suggestions.length) {
        $suggest.val("");
      }

    }
    $(document).mouseup(function (e) {
      var contextVarAreaContainer = $(".context_variables_textarea"); // Text area dialog
      var contestVarContainer = $(".contest_variables_dropdown"); // Context menu
      if ((!contextVarAreaContainer.is(e.target) && contextVarAreaContainer.has(e.target).length === 0) && (!contestVarContainer.is(e.target) && contestVarContainer.has(e.target).length === 0)) {
        contextVarAreaContainer.hide();
        contestVarContainer.hide();
      }
    });
    FindlySDK.prototype.bindContextVariable = function () {
      $(document).off('click', '.elipse-overflow').on('click', '.elipse-overflow', function (event) {
        $(event.target).toggleClass('context-active');
        if ($(event.target).hasClass('context-active')) {
          // $('.contest_variables_dropdown').removeClass('hide');
          // $('.contest_variables_dropdown').show();
          $('.context_variables_textarea').removeClass('hide');
          $('.context_variables_textarea').show();
          $('#contextjsonfield').focus();
        } else {
          $('.contest_variables_dropdown').hide();
          $('.context_variables_textarea').hide();
        }
      });
      // $(document).off('mouseover', '.contest_variables_dropdown').on('mouseover', '.contest_variables_dropdown', function (event) {
      //   $(event.target).toggleClass('contest-active');
      //   if($(event.target).hasClass('contest-active')) {
      //     $('.context_variables_textarea').removeClass('hide');
      //     $('.context_variables_textarea').show();
      //   }
      // });
      $(document).off('click', '.button_secondary').on('click', '.button_secondary', function (event) {
        $('#contextjsonfield').val('');
      });
      $(document).off('click', '.button_blue').on('click', '.button_blue', function (event) {
        // $('#contextjsonfield').val('');
        $('.contest_variables_dropdown').hide();
        $('.context_variables_textarea').hide();
      });
    }

    FindlySDK.prototype.bindSearchAccordion = function () {
      $(document).off('click', '.accordion').on('click', '.accordion', function (evet) {
        $(evet.target).toggleClass('acc-active');
        var panel = $(evet.target).next();
        if (panel[0].style.maxHeight) {
          panel[0].style.maxHeight = null;
        } else {
          panel[0].style.maxHeight = panel[0].scrollHeight + "px";
        }
        if ($(evet.target).hasClass('acc-active')) {
          $(evet.target).next().parent().next().hide();
        } else {
          $(evet.target).next().parent().next().show();
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
    FindlySDK.prototype.bindFeedbackEvent = function () {
      var _self = this;
      var payload = {
        requestId: null,
        query: null,
        contentId: null,
        contentType: null,
        feedbackType: null,
        userId: _self.API.uuid
      };
      $(document).off('click', '.faqs-shadow').on('click', '.faqs-shadow', function (event) {
        console.log($(event.target));
        var currentActiveEle = $('.accordion.acc-active').parent();
        payload.contentId = $(currentActiveEle).attr('contentid');
        payload.contentType = $(currentActiveEle).attr('contenttype');
        payload.requestId = _self.vars.previousSearchObj.requestId;
        payload.query = _self.vars.previousSearchObj.searchText;
      });
      $(document).off('click', '.yesLike').on('click', '.yesLike', function (event) {
        $(event.target).toggleClass('icon-active');
        if ($(event.target).hasClass('icon-active')) {
          $(event.target).attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtdXAtYmx1ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ0aHVtYnMtdXAtYmx1ZSIgZmlsbD0iIzAwNkJCMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
          $(event.target).parent().next().children().attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtZG93bi1ncmF5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InRodW1icy1kb3duLWdyYXkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA3LjAwMDAwMCkgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTcuMDAwMDAwLCAtNy4wMDAwMDApICIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
          payload.feedbackType = "thumbsup";
          _self.newSearchFeedbackPost(_self.API.newSearchFeedbackUrl, 'POST', payload).then(function (res) {
            console.log(res);
          });
        } else {
          $(event.target).attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtdXAtZ3JheTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ0aHVtYnMtdXAtZ3JheSIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
        }
      });
      $(document).off('click', '.noDislike').on('click', '.noDislike', function (event) {
        $(event.target).toggleClass('icon-active');
        if ($(event.target).hasClass('icon-active')) {
          $(event.target).attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtZG93bi1ibHVlPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InRodW1icy1kb3duLWJsdWUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA3LjAwMDAwMCkgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTcuMDAwMDAwLCAtNy4wMDAwMDApICIgZmlsbD0iIzAwNkJCMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
          $(event.target).parent().prev().children().attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtdXAtZ3JheTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ0aHVtYnMtdXAtZ3JheSIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
          payload.feedbackType = "thumbsdown";
          _self.newSearchFeedbackPost(_self.API.newSearchFeedbackUrl, 'POST', payload).then(function (res) {
            console.log(res);
          });
        } else {
          $(event.target).attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtZG93bi1ncmF5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InRodW1icy1kb3duLWdyYXkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA3LjAwMDAwMCkgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTcuMDAwMDAwLCAtNy4wMDAwMDApICIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
        }
      });
    }



    FindlySDK.prototype.prepAllSearchData = function (selectedFacet) {
      var _self = this, facets = [], totalResultsCount = null, viewType = '';
      if (!facets.length) {
        if (_self.vars.searchObject.liveData.facets) {

          Object.keys(_self.vars.searchObject.liveData.facets).forEach(facet => {
            facets.push({ key: facet, value: _self.vars.searchObject.liveData.facets[facet] })
          })
        }
        console.log(facets);
      }

      totalResultsCount = selectedFacet ? _self.vars.searchObject.liveData.facets[selectedFacet] : _self.vars.searchObject.liveData.facets["all results"];

      viewType = _self.vars.customizeView ? 'Customize' : 'Preview';
      console.log("View Type", viewType, _self.vars.customizeView);
      // debugger;
      var searchFullData = $(_self.getSearchTemplate('searchFullData')).tmplProxy({
        facets: facets,
        dataLoaded: false,
        search: _self.vars.searchObject.liveData.originalQuery,
        totalResultsCount: totalResultsCount,
        tasks: _self.vars.searchObject.liveData.tasks,
        pages: _self.vars.searchObject.liveData.pages,
        selectedFacet: selectedFacet ? selectedFacet : "all results",
        faqs: _self.vars.searchObject.liveData.faqs,

        documents: _self.vars.searchObject.liveData.documents,
        searchFacets: _self.vars.searchFacetFilters,
        viewType: viewType,

        getFacetDisplayName: function (key) {
          if (key.toLowerCase() === 'faq') {
            return "FAQ's"
          } else if (key.toLowerCase() === 'page') {
            return "Pages"
          } else if (key.toLowerCase() === 'task') {
            return "Actions"
          } else if (key.toLowerCase() === 'document') {
            return "Documents"
          } else {
            return key;
          }
        }
      });

      $('.search-container').addClass('full-page');
      $('.start-search-icon-div').addClass('hide');
      console.log('---- fill search close shows preview ball icon ----------')
      $('.search-body-full').removeClass('hide');
      $('.search-body-full').html(searchFullData);
      $('.search-container').removeClass('active');
      if (!selectedFacet || selectedFacet === "all results") {
        $('.facet:first').addClass('facetActive');

        if (_self.vars.customizeView == true && _self.vars.showingMatchedResults == true) {
          $('#viewTypeCheckboxControl').prop('checked', true);
          $(".pages-wrp, .tasks-wrp").sortable();
          $(".pages-wrp, .tasks-wrp").sortable("option", "disabled", false);
          $(".pages-wrp, .tasks-wrp").disableSelection();

          $(".faqs-shadow").addClass('custom-faqs-shadow');
          $(".faqs-wrp-content").addClass('custom-faqs-wrp-content-border');

          $(".custom-matched-results-container").css('display', 'block');

          if (($('.custom-external-link-show-container').hasClass('display-none')) == true) {
            $('.image-url-sec').css('display', 'none');
            $('.desc-info').css('max-width', '65%');
            $('.custom-external-link-show-container').removeClass('display-none');
            $('.external-link-show').css('display', 'none');
          }
          // $('.faqs-bottom-actions').css('display', 'table');
        }
        else {
          $('#viewTypeCheckboxControl').prop('checked', false);
          if ($(".pages-wrp, .tasks-wrp").hasClass('ui-sortable, ui-sortable-disabled')) {
            $(".pages-wrp, .tasks-wrp").sortable("disable");
          }
          if (($('.custom-external-link-show-container').hasClass('display-none')) == false) {
            $('.image-url-sec').css('display', 'table-cell');
            $('.desc-info').css('max-width', '100%');
            $('.custom-external-link-show-container').addClass('display-none');
            $('.external-link-show').css('display', 'none');
          }

          $(".faqs-shadow").removeClass('custom-faqs-shadow');
          $(".faqs-wrp-content").removeClass('custom-faqs-wrp-content-border');

          $(".custom-matched-results-container").css('display', 'none');

          $('.faqs-bottom-actions').css('display', 'none');
        }

        if (_self.vars.selectedFiltersArr.length > 0) {
          _self.vars.selectedFiltersArr.forEach(function (filter) {
            $("#" + filter).prop('checked', true)
            console.log(filter);
          })
        }

      }
      else {
        $('#' + selectedFacet).addClass('facetActive').siblings().removeClass('active');

        if (selectedFacet === 'page') {
          if (_self.vars.customizeView == true && _self.vars.showingMatchedResults == true) {
            $('#viewTypeCheckboxControl').prop('checked', true);
            $(".pages-wrp").sortable();
            $(".pages-wrp").sortable("option", "disabled", false);
            $(".pages-wrp").disableSelection();

            $(".faqs-shadow").addClass('custom-faqs-shadow');
            $(".faqs-wrp-content").addClass('custom-faqs-wrp-content-border');
            $(".custom-matched-results-container").css('display', 'block');

            if (($('.custom-external-link-show-container').hasClass('display-none')) == true) {
              $('.image-url-sec').css('display', 'none');
              $('.desc-info').css('max-width', '65%');
              $('.custom-external-link-show-container').removeClass('display-none');
              $('.external-link-show').css('display', 'none');
            }
            // $('.faqs-bottom-actions').css('display', 'table');
          }
          else {
            $('#viewTypeCheckboxControl').prop('checked', false);
            if ($(".pages-wrp").hasClass('ui-sortable, ui-sortable-disabled')) {
              $(".pages-wrp").sortable("disable");
            }
            $(".custom-matched-results-container").css('display', 'none');
            if (($('.custom-external-link-show-container').hasClass('display-none')) == false) {
              $('.image-url-sec').css('display', 'table-cell');
              $('.desc-info').css('max-width', '100%');
              $('.custom-external-link-show-container').addClass('display-none');
              $('.external-link-show').css('display', 'none');
            }
            $('.faqs-bottom-actions').css('display', 'none');
          }

          if (_self.vars.selectedFiltersArr.length > 0) {
            _self.vars.selectedFiltersArr.forEach(function (filter) {
              $("#" + filter).prop('checked', true)
              console.log(filter);
            })
          }

        }

        if (selectedFacet === 'faq') {
          if (_self.vars.customizeView == true && _self.vars.showingMatchedResults == true) {
            $('#viewTypeCheckboxControl').prop('checked', true);
            $(".tasks-wrp").sortable();
            $(".tasks-wrp").sortable("option", "disabled", false);
            $(".tasks-wrp").disableSelection();


            $(".faqs-shadow").addClass('custom-faqs-shadow');
            $(".faqs-wrp-content").addClass('custom-faqs-wrp-content-border');
            $(".custom-matched-results-container").css('display', 'block');

            $('.desc-info').css('max-width', '65%');

            // $('.faqs-bottom-actions').css('display', 'table');
          }
          else {
            $('#viewTypeCheckboxControl').prop('checked', false);
            if ($(".tasks-wrp").hasClass('ui-sortable, ui-sortable-disabled')) {
              $(".tasks-wrp").sortable("disable");
            }

            $(".custom-matched-results-container").css('display', 'none');
            $('.desc-info').css('max-width', '100%');

            $('.faqs-bottom-actions').css('display', 'none');
          }

          if (_self.vars.selectedFiltersArr.length > 0) {
            _self.vars.selectedFiltersArr.forEach(function (filter) {
              $("#" + filter).prop('checked', true)
              console.log(filter);
            })
          }
        }

        if (_self.vars.selectedFiltersArr.length > 0) {
          _self.vars.selectedFiltersArr.forEach(function (filter) {
            $("#" + filter).prop('checked', true)
            console.log(filter);
          })
        }

      }
      _self.bindFacetsToggle();
      _self.bindAllResultsView();
      // if(_self.vars.searchObject.liveData.faqs.length) {
      //   _self.bindSearchAccordion();
      // }

      var topMatchFAQ;
      if (_self.vars.searchObject && _self.vars.searchObject.liveData && _self.vars.searchObject.liveData.faqs) {
        var faqs = _self.vars.searchObject.liveData.faqs;
        topMatchFAQ = faqs.filter(function (faq) {
          return faq.bestMatch
        });
        if (topMatchFAQ.length) {
          //highlight faq;
          topMatchFAQ = topMatchFAQ[0];
        } else {
          topMatchFAQ = false;
        }
      }
      setTimeout(function () {
        // debugger;
        if (topMatchFAQ) {
          var bestFAQTitleDiv = $(".search-body-full .faqs-wrp-content .title[contentid='" + topMatchFAQ.contentId + "']:last");

          var bestFAQDiv = $(bestFAQTitleDiv).closest('.faqs-wrp-content');
          bestFAQDiv.addClass('faq-highlight');
          bestFAQTitleDiv.find(".accordion").trigger('click');
        }
      }, 500);
    }
    FindlySDK.prototype.bindAllResultsView = function () {
      var _self = this;

      $('.show-all-results').off('click').on('click', function (e) {
        var data = $(e.currentTarget).closest('.finalResults').data() || {};
        _self.vars.searchObject.liveData = data
        console.log(data);

        if (_self.vars.searchObject && _self.vars.searchObject.searchText) {
          var responseObject = { 'type': 'fullResult', data: true, query: _self.vars.searchObject.searchText }
          console.log(responseObject);
          _self.parentEvent(responseObject);
        }

        $(".custom-insights-control-container").hide();

        _self.prepAllSearchData();
        _self.bindAllResultsView();
        _self.bindSearchActionEvents();
        // var topMatchFAQ;
        // if(data && data.faqs){
        //   var faqs=data.faqs;
        //   topMatchFAQ=faqs.filter(function(faq){
        //     return faq.bestMatch
        //   });
        //   if(topMatchFAQ.length){
        //     //highlight faq;
        //     topMatchFAQ=topMatchFAQ[0];
        //   }else{
        //     topMatchFAQ=false;
        //   }
        // }
        // setTimeout(function(){
        //   debugger;
        //   if (topMatchFAQ) {
        //     var bestFAQTitleDiv=$(".search-body-full .faqs-wrp-content .title[contentid='" + topMatchFAQ.contentId + "']:last");

        //     var bestFAQDiv=$(bestFAQTitleDiv).closest('.faqs-wrp-content');
        //     bestFAQDiv.addClass('faq-highlight');
        //     bestFAQTitleDiv.find(".accordion").trigger('click');
        //   }
        // },500);

      })
      // $('.full-search-close').off('click').on('click', function (e)
      $('.custom-chevron-right-icon').off('click').on('click', function (e) {
        if (($('.external-link-show').css('display') == 'none')) {
          $('.external-link-show').css('display', 'block');
          $('.desc-info').css('max-width', '100%');

        }

        var responseObject = { 'type': 'fullResult', data: false, query: _self.vars.searchObject.searchText }
        console.log(responseObject);
        _self.parentEvent(responseObject);

        $(".faqs-wrp-content").removeClass('custom-faqs-wrp-content-border');
        $('.search-container').removeClass('full-page');
        $('.start-search-icon-div').removeClass('hide');
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

      $('.custom-add-new-result-container').off('click').on('click', function (event) {
        console.log(event);
        if (_self.vars.searchObject && _self.vars.searchObject.searchText) {
          var responseObject = { 'type': 'addNew', data: true, query: _self.vars.searchObject.searchText }
          console.log(responseObject);
          _self.parentEvent(responseObject);
        }
      });

      $('#viewTypeCheckboxControl').off('change').on('change', function (event) {
        var facetActive = $('.facetActive').attr('id');
        var responseObject = { type: 'showInsightFull', data: false, query: _self.vars.searchObject.searchText }
        if ($(this).is(':checked')) {
          console.log(false);
          // debugger;
          _self.vars.customizeView = true;
          _self.prepAllSearchData(facetActive);
        }
        else {
          console.log(true);
          // debugger;
          _self.vars.customizeView = false;
          _self.prepAllSearchData(facetActive);
        }
        _self.parentEvent(responseObject);
      });

      $('#openFacetFilterControl').off('click').on('click', function (event) {
        if ($('.filters-container').css('display') == 'block') {
          $('.filters-container').hide();
        }
        else {
          $('.filters-container').show();
        }
      });

      /*$('#closeFacetFilterControl').off('click').on('click', function (event) {
        if($('.filters-container').css('display') == 'block') {
          $('.filters-container').hide();
        }
      })*/

      // $('.filter-checkbox').off('change').on('change', function (event) {
      $('.checkbox-custom').off('change').on('change', function (event) {
        $('#loaderDIV').show();

        if ($(this).is(':checked')) {
          console.log($(this).attr("id"));
          _self.vars.selectedFiltersArr.push($(this).attr("id"));
          _self.filterResults(event, true);
        }
        else {
          var unselectedFilterID = $(this).attr("id");
          console.log($(this).attr("id"));
          _self.vars.selectedFiltersArr.slice(0).forEach(function (filter) {
            if (filter == unselectedFilterID) {
              _self.vars.selectedFiltersArr.splice(_self.vars.selectedFiltersArr.indexOf(filter), 1)
            }
          })
          _self.filterResults(event, false);
        }
      });

      $('.filters-reset-anchor').on('click', function (event) {
        // $('.filter-checkbox').prop('checked', false);
        $('.checkbox-custom').prop('checked', false);
        $('#loaderDIV').show();
        _self.vars.filterObject = [];
        _self.vars.selectedFiltersArr = [];
        _self.searchByFacetFilters([]);
      });

      $('.show_insights').off('click').on('click', function (event) {
        var responseObject = {};
        // debugger;
        if ($(this).attr('data-displayinsights') == "true") {
          responseObject = { 'type': 'showInsightFull', data: true, query: _self.vars.searchObject.searchText };
          $(this).attr('data-displayinsights', false);
          $(this).find('.show_insights_text').text("HIDE INSIGHTS ");
          $(this).find('.show_insights_icon').css('transform', 'rotate(180deg)')
          console.log(responseObject);
          _self.parentEvent(responseObject);
        }
        else {
          responseObject = { 'type': 'showInsightFull', data: false, query: _self.vars.searchObject.searchText };
          $(this).attr('data-displayinsights', true);
          $(this).find('.show_insights_text').text("SHOW INSIGHTS ");
          $(this).find('.show_insights_icon').css('transform', 'rotate(360deg)');
          console.log(responseObject);
          _self.parentEvent(responseObject);
        }

      })
    }
    FindlySDK.prototype.bindFacetsToggle = function () {
      var _self = this;
      $('.facet').off('click').on('click', function (e) {
        var facetThis = this;
        var selectedFacet = $(this).attr('id');

        _self.prepAllSearchData(selectedFacet);
      })
    }
    FindlySDK.prototype.recentClick = function () {
      var _self = this;
      $('.search-container').off('click', '.recentText').on('click', '.recentText', function (e) {
        var recentSearch = $(this).attr('id');
        e.target.value = recentSearch;
        $('#search').val(recentSearch).focus();
        $('#search').trigger("keyup");

      })
    }
    FindlySDK.prototype.deleteRecents = function () {
      var _self = this;
      $('.recentCloseIcon').off('click').on('click', function (e) {
        var recentIndex = $(this).attr('id');
        _self.vars.searchObject.recents.splice(recentIndex, 1);
        _self.vars.searchObject.popularSearches.splice(recentIndex, 1);
        window.localStorage.setItem('recents', JSON.stringify(_self.vars.searchObject.recents));
        var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
          searchResults: _self.vars.searchObject.recentAPIResponse,
          recents: _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0, 6),
          recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0, 2),
          popularSearches: _self.vars.searchObject.popularSearches.slice(0, 6)
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
    FindlySDK.prototype.saveOrGetDataInStorage = function (type, dataArray, storageType, action) {
      if (storageType === "localStorage") {
        if (action === "get") {
          return window.localStorage.getItem(type) ? JSON.parse(window.localStorage.getItem(type)) : [];
        } else {
          window.localStorage.setItem(type, JSON.stringify(dataArray));
          return;
        }
      }

    }
    FindlySDK.prototype.getLiveSearchResulta = function () {

    }
    FindlySDK.prototype.closeGreetingMsg = function () {
      if ($(".search-container").find(".greetingMsg").length) {
        $('.greetingMsg').html('');
        $('.greetingMsg').addClass('hide');
        $('.search-container').css("box-shadow", "0 8px 16px 0 rgba(12, 51, 91, 0.2)")
      }

    }
    FindlySDK.prototype.bindSearchActionEvents = function () {
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

        if (_self.isDev || _self.vars.loggedInUser) {
          _self.vars.searchObject.searchText = e.target.title.toLowerCase();
          _self.sendMessageToSearch('botAction');
        } else if ((e.target.title.toLowerCase() === 'pay bill') || (e.target.title.toLowerCase() === 'pay credit card bill')) {
          _self.userLogin(e.target.title.toLowerCase());
        } else {
          _self.userLogin(e.target.title.toLowerCase());

        }

      })
      /*$('.search-container').off('click', '.dont-show').on('click', '.dont-show', function (e) {
        _self.performRankActions(e, { visible: false });
      });*/
      $('.search-container').off('click', '.visibility').on('click', '.visibility', function (event) {
        console.log($(event.target).closest('.visibility').attr('data-viewmode'));
        if ($(event.target).closest('.visibility').attr('data-viewmode') == "full") {
          console.log($(event.target).closest('.faqs-shadow').attr('visible'), $(event.target).closest('.faqs-shadow').attr('contentid'));

          if (parseInt($(event.target).closest('.faqs-shadow').attr('pinindex')) == -1) {
            if ($(event.target).closest('.faqs-shadow').attr('visible') == "true") {
              _self.performRankActions(event, { visible: false }, _self.vars.searchObject.searchText, 'visibility');
            }
            else {
              _self.performRankActions(event, { visible: true }, _self.vars.searchObject.searchText, 'visibility');
            }
          }
        }
        else {
          console.log($(event.target).closest('.task-wrp').attr('visible'), $(event.target).closest('.task-wrp').attr('contentid'));

          if (parseInt($(event.target).closest('.task-wrp').attr('pinindex')) == -1) {
            if ($(event.target).closest('.task-wrp').attr('visible') == "true") {
              _self.performRankActions(event, { visible: false }, _self.vars.searchObject.searchText, 'visibility');
            }
            else {
              _self.performRankActions(event, { visible: true }, _self.vars.searchObject.searchText, 'visibility');
            }
          }
        }
      });
      /*$('.search-container').off('click', '.pin').on('click', '.pin', function (e) {

        // debugger;
        var _selctedEle = $(e.target).closest('.task-wrp');
        var _parentEle = $(e.target).closest('.tasks-wrp');
        var nodes = Array.prototype.slice.call(_parentEle[0].children);
        var pinIndex = nodes.indexOf(_selctedEle[0]);
        _self.performRankActions(e, { pinIndex: pinIndex });

      });*/
      $('.search-container').off('click', '.pinning').on('click', '.pinning', function (event) {
        console.log($(event.target).closest('.pinning').attr('data-viewmode'));
        if ($(event.target).closest('.pinning').attr('data-viewmode') == "full") {
          console.log($(event.target).closest('.faqs-shadow').attr('pinindex'), $(event.target).closest('.faqs-shadow').attr('contentid'));

          if ($(event.target).closest('.faqs-shadow').attr('visible') == "true") {
            var _selectedElement = $(event.target).closest('.faqs-shadow');
            var _parentElement = $(event.target).closest('.faqs-shadow');
            var childNodes = Array.prototype.slice.call(_parentElement[0].children);

            if ($(event.target).text() == "UNPIN") {
              var pinIndex = -1;
            }
            else {
              var pinIndex = childNodes.indexOf(_selectedElement[0]);
            }
            _self.performRankActions(event, { pinIndex: pinIndex }, _self.vars.searchObject.searchText, 'pinning');
          }
        }
        else {
          // console.log(event.target);
          console.log($(event.target).closest('.pinning').attr('data-viewmode'));
          console.log($(event.target).closest('.task-wrp').attr('pinindex'), $(event.target).closest('.task-wrp').attr('contentid'));
          if ($(event.target).closest('.task-wrp').attr('visible') == "true") {
            var _selectedElement = $(event.target).closest('.task-wrp');
            var _parentElement = $(event.target).closest('.tasks-wrp');
            var childNodes = Array.prototype.slice.call(_parentElement[0].children);

            if ($(event.target).text() == "UNPIN") {
              var pinIndex = -1
            }
            else {
              var pinIndex = childNodes.indexOf(_selectedElement[0]);
            }
            _self.performRankActions(event, { pinIndex: pinIndex }, _self.vars.searchObject.searchText, 'pinning');
          }
        }
      });
      /*$('.search-container').off('click', '.boostup').on('click', '.boostup', function (e) {
        _self.performRankActions(e, { boost: 0.25 });
      });*/
      $('.search-container').off('click', '.boosting').on('click', '.boosting', function (event) {
        console.log($(event.target).closest('.boosting').attr('data-viewMode'));
        if ($(event.target).closest('.boosting').attr('data-viewMode') == "full") {
          console.log($(event.target).closest('.faqs-shadow').attr('boost'), $(event.target).closest('.faqs-shadow').attr('contentid'));

          if ($(event.target).closest('.faqs-shadow').attr('visible') == "true") {
            var boostByValue = parseFloat($(event.target).closest('.faqs-shadow').attr('boost'));
            boostByValue = boostByValue + 0.25;
            console.log(boostByValue);
            _self.performRankActions(event, { boost: boostByValue }, _self.vars.searchObject.searchText, 'boosting');
          }
        }
        else {
          // console.log(event.target);
          console.log($(event.target).closest('.task-wrp').attr('boost'), $(event.target).closest('.task-wrp').attr('contentid'));
          if ($(event.target).closest('.task-wrp').attr('visible') == "true") {
            var boostByValue = parseFloat($(event.target).closest('.task-wrp').attr('boost'));
            boostByValue = boostByValue + 0.25;
            console.log(boostByValue);
            _self.performRankActions(event, { boost: boostByValue }, _self.vars.searchObject.searchText, 'boosting');
          }
        }
      });
      /*$('.search-container').off('click', '.boostdown').on('click', '.boostdown', function (e) {
        _self.performRankActions(e, { boost: -0.25 });
      })*/
      $('.search-container').off('click', '.burying').on('click', '.burying', function (event) {
        console.log($(event.target).closest('.burying').attr('data-viewMode'));
        if ($(event.target).closest('.burying').attr('data-viewMode') == 'full') {
          console.log($(event.target).closest('.faqs-shadow').attr('boost'), $(event.target).closest('.faqs-shadow').attr('contentid'));

          if ($(event.target).closest('.faqs-shadow').attr('visible') == "true") {
            var buryByValue = parseFloat($(event.target).closest('.faqs-shadow').attr('boost'));
            console.log(buryByValue);
            if (buryByValue > 0.25) {
              buryByValue = buryByValue - 0.25;
              console.log(buryByValue);
              _self.performRankActions(event, { boost: buryByValue }, _self.vars.searchObject.searchText, 'boosting');
            }
            else {
              buryByValue = 0.25 - buryByValue;
              console.log(buryByValue);
              _self.performRankActions(event, { boost: buryByValue }, _self.vars.searchObject.searchText, 'burying');
            }
          }
        }
        else {
          // console.log(event.target);
          console.log($(event.target).closest('.task-wrp').attr('boost'), $(event.target).closest('.task-wrp').attr('contentid'));

          if ($(event.target).closest('.task-wrp').attr('visible') == "true") {
            var buryByValue = parseFloat($(event.target).closest('.task-wrp').attr('boost'));
            console.log(buryByValue);
            if (buryByValue > 0.25) {
              buryByValue = buryByValue - 0.25;
              console.log(buryByValue);
              _self.performRankActions(event, { boost: buryByValue }, _self.vars.searchObject.searchText, 'burying');
            }
            else {
              buryByValue = 0.25 - buryByValue;
              console.log(buryByValue);
              _self.performRankActions(event, { boost: buryByValue }, _self.vars.searchObject.searchText, 'burying');
            }
          }
        }
      })
    };

    FindlySDK.prototype.performRankActions = function (event, conf, searchText, actionType) {
      var _self = this;
      event.preventDefault();
      event.stopPropagation();

      /*var _taskWrapDiv = $(e.target).closest('.task-wrp');

      var contentId = _taskWrapDiv.attr('contentid');
      var contentType = _taskWrapDiv.attr('contentType');
      var queryString = $(e.target).closest('.finalResults').attr('queryString');

      var boost = _taskWrapDiv.attr('boost');
      var pinIndex = _taskWrapDiv.attr('pinIndex');
      var visible = _taskWrapDiv.attr('visible');

      boost = parseFloat(boost);
      pinIndex = parseInt(pinIndex);
      visible = visible.toLowerCase() == 'true' ? true : false;*/

      if ($(event.target).closest(`.${actionType}`).attr('data-viewMode') == "full") {
        var selectedElement = $(event.target).closest('.faqs-shadow');
      }
      else {
        var selectedElement = $(event.target).closest('.task-wrp');
      }
      var contentID = selectedElement.attr('contentid');
      var contentType = selectedElement.attr('contentType');
      var queryString = _self.vars.searchObject.searchText;


      var payload = {
        "searchQuery": queryString,
        "result": {
          "contentType": contentType,
          "contentId": contentID,
          "config": conf,
        }
      }

      console.log(payload);

      var url = _self.API.queryConfig;

      if (actionType == 'visibility') {
        var elementHidden = selectedElement.find('.visibility > .custom-actions-content');
        var indicatorMessage = '';
        if (selectedElement.attr('visible') == "false") {
          indicatorMessage = "UNHIDING";
        }
        else {
          indicatorMessage = "HIDING";
        }
        _self.makeAPItoFindly(url, 'PUT', JSON.stringify(payload)).then(function (res) {
          console.log(res);
          selectedElement.find('.notification-div').text(indicatorMessage).show().delay(2000).fadeOut(1600, function () {
            $(this).hide();
          });
          selectedElement.attr('visible', conf.visible);
          if (selectedElement.attr('visible') == "false") {
            elementHidden.text("UNHIDE");
            selectedElement.addClass('hide-actions');
          }
          else {
            elementHidden.text("HIDE");
            selectedElement.removeClass('hide-actions');
          }
        }, function (eRes) {
          console.log(eRes);
        });
      } else if (actionType == 'pinning') {
        var elementPinned = selectedElement.find('.pinning > .custom-actions-content');
        var indicatorMessage = ''
        if (elementPinned.text() == "PIN") {
          indicatorMessage = "PINNING";
        }
        else {
          indicatorMessage = "UNPINNING";
        }
        _self.makeAPItoFindly(url, 'PUT', JSON.stringify(payload)).then(function (res) {
          console.log(res);
          selectedElement.find('.notification-div').text(indicatorMessage).show().delay(2000).fadeOut(1600, function () {
            $(this).hide();
          });
          selectedElement.attr('pinindex', conf.pinIndex);
          if (elementPinned.text() == "UNPIN") {
            elementPinned.text("PIN");
            selectedElement.removeClass('hide-visibility-control');
          }
          else {
            elementPinned.text("UNPIN");
            selectedElement.addClass('hide-visibility-control');
          }
        }, function (eRes) {
          console.log(eRes);
        });
      } else if (actionType == 'boosting') {
        var indicatorMessage = "BOOSTED";
        _self.makeAPItoFindly(url, 'PUT', JSON.stringify(payload)).then(function (res) {
          console.log(res);
          selectedElement.find('.notification-div').text(indicatorMessage).show().delay(2000).fadeOut(1600, function () {
            $(this).hide();
          });
          selectedElement.attr('boost', conf.boost);
        }, function (eRes) {
          console.log(eRes);
        });
      } else if (actionType == 'burying') {
        var indicatorMessage = "BURIED";
        _self.makeAPItoFindly(url, 'PUT', JSON.stringify(payload)).then(function (res) {
          console.log(res);
          selectedElement.find('.notification-div').text(indicatorMessage).show().delay(2000).fadeOut(1600, function () {
            $(this).hide();
          });
          selectedElement.attr('boost', conf.boost);
        }, function (eRes) {
          console.log(eRes);
        });
      } else {
        console.log("Invalid Action");
      }

    };

    FindlySDK.prototype.filterResults = function (event, isChecked) {
      event.preventDefault();
      event.stopPropagation();

      var _self = this;
      var fieldMatches = false;
      var _filterContainer = $(event.target).closest('.filters-content');

      var fieldName = _filterContainer.attr('data-fieldName');
      var facetType = _filterContainer.attr('data-facetType');
      var key = $(event.target).attr('name');

      console.log(`fieldName: ${fieldName}, facetType: ${facetType}, key: ${key}`)

      var responsePayload = {}

      if (facetType == 'value') {
        responsePayload.fieldName = fieldName,
          responsePayload.facetType = facetType,
          responsePayload.facetValue = [];

        responsePayload.facetValue[0] = key;
      }
      else {
        var from = $(event.target).attr('data-from');
        var to = $(event.target).attr('data-to');

        responsePayload.fieldName = fieldName,
          responsePayload.facetType = facetType,
          responsePayload.facetRange = [];

        // key = { 'from': 0, 'to': 100 };
        key = { 'from': parseInt(from), 'to': parseInt(to) };
        responsePayload.facetRange[0] = key;
      }

      console.log(responsePayload);

      if (isChecked == true) {
        if (_self.vars.filterObject.length == 0) {
          _self.vars.filterObject.push(responsePayload);
          fieldMatches = true;
        }
        if (_self.vars.filterObject.length > 0 && fieldMatches == false) {
          _self.vars.filterObject.forEach(function (element) {
            if (responsePayload.fieldName == element.fieldName && responsePayload.facetType == element.facetType) {
              if (element.facetType == 'value') {
                element.facetValue.push(key);
              }
              else {
                element.facetRange.push(key);
              }
              fieldMatches = true;
            }
          })

        }
        if (fieldMatches == false) {
          _self.vars.filterObject.push(responsePayload);
        }
      }
      else {
        if (_self.vars.filterObject.length > 0) {
          _self.vars.filterObject.slice(0).forEach(function (element) {
            if (responsePayload.fieldName == element.fieldName && responsePayload.facetType == element.facetType) {
              // var indexOfMatchedFilter = 0, elementsTraversed = 0;
              if (element.facetType == 'value') {
                if (element.facetValue.length > 1) {
                  element.facetValue.slice(0).forEach(function (item) {
                    if (item === key) {
                      element.facetValue.splice(element.facetValue.indexOf(item), 1);
                    }
                    console.log(item);
                  })
                }
                else {
                  element.facetValue = [];
                  _self.vars.filterObject.splice(_self.vars.filterObject.indexOf(element), 1);
                }
              }
              else {
                if (element.facetRange.length > 1) {
                  element.facetRange.slice(0).forEach(function (item) {
                    if (JSON.stringify(item) == JSON.stringify(key)) {
                      element.facetRange.splice(element.facetRange.indexOf(item), 1)
                    }
                    console.log(item);
                  })
                }
                else {
                  element.facetRange = [];
                  _self.vars.filterObject.splice(_self.vars.filterObject.indexOf(element), 1);
                }
              }
            }
          })
        }
      }
      console.log(_self.vars.filterObject, isChecked);
      _self.searchByFacetFilters(_self.vars.filterObject);
    };

    FindlySDK.prototype.searchByFacetFilters = function (filterObject) {
      var _self = this;
      // var activeFacet = '';
      var facetActive = '';
      var url = _self.API.searchUrl;
      var payload = {
        "query": _self.vars.searchObject.searchText,
        "maxNumOfResults": 9,
        "userId": _self.API.uuid,
        "streamId": _self.API.streamId,
        "lang": "en",
        // "isDev": true,
      }
      if (filterObject.length > 0) {
        payload.filters = filterObject;
      }

      console.log(payload);

      facetActive = $('.facetActive').attr('id');
      console.log("Active Facet Tab: ", facetActive);

      payload.isDev = _self.isDev;

      _self.getFrequentlySearched(url, 'POST', JSON.stringify(payload)).then(function (response) {
        faqs = [], pages = [], tasks = [], documents = [], facets = {};

        console.log(response.template);

        if (response.template) {
          faqs = response.template.results.faq;
          pages = response.template.results.page;
          tasks = response.template.results.task;
          documents = response.template.results.document;
          facets = response.template.facets;

          _self.vars.searchObject.liveData = {
            faqs: faqs,
            pages: pages,
            tasks: tasks,
            facets: facets,
            documents: documents,
            originalQuery: response.template.originalQuery || '',
            // searchFacets: searchFacets,
          }
          console.log(_self.vars.searchObject.liveData);
          _self.prepAllSearchData(facetActive);
          $('#loaderDIV').hide()
          // setTimeout(function() { alert(); _self.prepAllSearchData();}, 1000)

        }
      });
    }

    FindlySDK.prototype.searchEventBinding = function (dataHTML, templateType, e, ignorAppend) {
      var _self = this;
      _self.vars.searchObject.recents = []; _self.vars.searchObject.recentTasks = [];
      var searchResults;

      try {

        _self.vars.searchObject.recents = JSON.parse(window.localStorage.getItem('recents')) ? JSON.parse(window.localStorage.getItem('recents')) : [];
        _self.vars.searchObject.recentTasks = JSON.parse(window.localStorage.getItem('recentTasks')) ? JSON.parse(window.localStorage.getItem('recentTasks')) : [];
      } catch (err) {

      }

      if (_self.vars.customizeView == true && _self.vars.showingMatchedResults == true) {
        if ($('.custom-header-container-left').css('visibility') == 'hidden') {
          $('.custom-insights-control-container').show();
        }
      }


      $('.close-icon').off('click').on('click', function (e) {
        $('.search-body').html('');
        $('.search-body').removeClass('h-100');
        $('#search').val('');
        $('#suggestion').val('');
        $('.search-container').removeClass('active');
      })
      //_self.bindSearchActionEvents();


      $('.custom-insights-control-container').off('click').on('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (_self.vars.searchObject && _self.vars.searchObject.searchText) {
          var responseObject = { 'type': 'show', data: true, query: _self.vars.searchObject.searchText }
          console.log(responseObject);
          _self.parentEvent(responseObject);
        }
        $('.custom-header-container-left').css('visibility', 'visible');
        $('.custom-insights-control-container').hide();
      })

      $('.custom-header-container-left').off('click').on('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (_self.vars.customizeView == true && _self.vars.showingMatchedResults == true) {
          $('.custom-insights-control-container').show();
          var responseObject = { 'type': 'hide', data: true, query: _self.vars.searchObject.searchText }
          console.log(responseObject);
          _self.parentEvent(responseObject)
        }
        else {
          $('.custom-insights-control-container').hide();
        }

        $('.custom-header-container-left').css('visibility', 'hidden');
      })

      // $('.pay-button').off('click').on('click')
      if (templateType === "search-container") {

        $(dataHTML).off('keydown', '#search').on('keydown', '#search', function (e) {
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
            prevStr = "";
            if ($('.search-container').hasClass('conversation')) {
              $('.search-body').addClass('hide');
              $('#searchChatContainer').removeClass('bgfocus');
            };
            _self.vars.searchObject.searchText = $('#search').val();
            // debugger;
            var searchText = $('#search').val() || _self.vars.searchObject.liveData.originalQuery;
            _self.closeGreetingMsg();
            _self.sendMessageToSearch('user');
            if (_self.config.viaSocket) {
              _self.sendMessage(_self.vars.searchObject.searchText);
            } else {
              _self.bindLiveDataToChat();
            }
            if ($('.search-body:visible').length) {
              if (!_self.vars.searchObject.recents.length || (_self.vars.searchObject.recents.length && _self.vars.searchObject.recents.indexOf(searchText.toLowerCase()) == -1)) {
                _self.vars.searchObject.recents.unshift(searchText.toLowerCase());
              }
              window.localStorage.setItem("recents", JSON.stringify(_self.vars.searchObject.recents));
            }
          }
        })
        $(dataHTML).off('click', '.search-button').on('click', '.search-button', function (e) {
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
          $('#search').focus().trigger({ type: 'keydown', which: 13 });
        })
        $(dataHTML).off('click', '#search').on('click', '#search', function (e) {
          if (!$('#search').val()) {
            _self.bindFrequentData();
          }
        })
        initPopularSearchList();
        function initPopularSearchList() {
          _self.vars.searchObject.popularSearches = [];
          var popSearchUrl = _self.API.popularSearchesUrl;
          var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
            searchResults: _self.vars.searchObject.recentAPIResponse,
            recents: _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0, 6),
            recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0, 2),
            popularSearches: _self.vars.searchObject.popularSearches.slice(0, 6)
          });
          $('.search-body').html(freqData);
          _self.getPopularSearchList(popSearchUrl, 'GET').then(function (response) {
            _self.vars.searchObject.popularSearches = response;
            freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
              searchResults: _self.vars.searchObject.recentAPIResponse,
              recents: _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0, 6),
              recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0, 2),
              popularSearches: _self.vars.searchObject.popularSearches.slice(0, 6)
            });
            $('.search-body').html(freqData);
          })
        }
        $(dataHTML).off('keyup', '#search').on('keyup', '#search', function (e) {
          if (!$('#search').val()) {
            if ((!_self.vars.searchObject.recentTasks.length || !_self.vars.searchObject.recents.length) && $('.search-container').hasClass('active')) {
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
            if (e.target.value) {
              var payload = {
                "query": e.target.value.toString(),
                "maxNumOfResults": 16,
                "userId": _self.API.uuid,
                "streamId": _self.API.streamId,
                "lang": "en"
              }
              var contextObj = $("#contextjsonfield").val();
              if (contextObj) {
                contextObj.trim();
                if (contextObj) {
                  try {
                    contextObj = JSON.parse(contextObj);
                  } catch (error) {
                    contextObj = "";
                  }
                }
                if (contextObj) {
                  payload.context = contextObj;
                }

              }
              var url = _self.API.livesearchUrl;//'https://qa-bots.kore.ai/searchAssistant/liveSearch';
              var searchData;
              if (code == '13') {
                $('#search').val('');
              } else {
                _self.getFrequentlySearched(url, 'POST', JSON.stringify(payload)).then(function (res) {
                  if (res && res.requestId && res.template && res.template.originalQuery) {
                    _self.vars.previousSearchObj = {};
                    _self.vars.previousSearchObj.requestId = res.requestId; // previous search requestId from response
                    _self.vars.previousSearchObj.searchText = res.template.originalQuery; // previous text
                  } else {
                    console.log('Previous requestId or orinigal query is mising');
                  }
                  if (res.templateType === 'liveSearch') {
                    $('.search-body').show();
                    $('#searchChatContainer').removeClass('bgfocus-override');
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
                      //livesearch
                      searchData = $(_self.getSearchTemplate('liveSearchData')).tmplProxy({
                        faqs: faqs.slice(0, 2),
                        pages: pages.slice(0, 2),
                        tasks: tasks.slice(0, 2),
                        showAllResults: true,
                        noResults: false,
                        taskPrefix: 'SUGGESTED'
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
                          noResults: true,
                          taskPrefix: 'MATCHED'
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
                  } else if (res.templateType === 'liveSearchEmpty') {
                    $('.search-body').hide();
                    $('#searchChatContainer').addClass('bgfocus-override');
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

          if ($('.search-container').hasClass('full-page')) {
            $('.search-container').removeClass('full-page');
            $('.start-search-icon-div').removeClass('hide');
            console.log('---- fill search close shows preview ball icon ----------')
            $('.search-body-full').html('');
            if (!$('.search-container').hasClass('active')) {
              $('.search-container').addClass('active');
              //e.stopPropagation();
            }
            e.stopPropagation();
          }
          if ((_self.vars.searchObject.recentTasks.length || _self.vars.searchObject.recents.length || _self.vars.searchObject.popularSearches.length) && !$('#search').val()) {
            $('.search-container').addClass('active');
            if (_self.showGreetingMsg) {
              _self.showGreetingMsg = false;
              _self.sendMessageToSearch('bot', '&#128075; Hello! How can I help you today?');
            }
            _self.closeGreetingMsg();
            var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
              searchResults: searchResults,
              recents: _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0, 6),
              recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0, 2),
              popularSearches: _self.vars.searchObject.popularSearches.slice(0, 6)
            });
            $('.search-body').html(freqData);
            setTimeout(function () {
              $('.search-body').scrollTop(2);
            }, 100);
            _self.deleteRecents();
            _self.bindSearchActionEvents();
            _self.recentClick();
          } else if ((_self.vars.searchObject.recentTasks.length || _self.vars.searchObject.recents.length || _self.vars.searchObject.popularSearches.length) && $('#search').val()) {
            _self.closeGreetingMsg();
            if (!$('.search-container').hasClass('active')) {
              $('.search-container').addClass('active');
              e.stopPropagation();
            }
          } else if ($('#search').val()) {
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
      if (templateType === "livesearch") {
        if (!$('.search-container').hasClass('active')) {
          $('.search-container').addClass('active');
          e.stopPropagation();
        }
        var searchText = $('#search').val() || _self.vars.searchObject.liveData.originalQuery;
        if (e.keyCode == 13) {
          if ($('.search-container').hasClass('conversation')) {
            $('.search-body').addClass('hide');
            $('#searchChatContainer').removeClass('bgfocus');
            var searchText = $('#search').val() || _self.vars.searchObject.searchText;
            $('#search').val('');
            $('#suggestion').val('');
          }
          if (!_self.vars.searchObject.recents.length || (_self.vars.searchObject.recents.length && _self.vars.searchObject.recents.indexOf(searchText.toLowerCase()) == -1)) {
            _self.vars.searchObject.recents.unshift(searchText.toLowerCase());
          }
          window.localStorage.setItem("recents", JSON.stringify(_self.vars.searchObject.recents));
          if (!ignorAppend) {
            _self.bindLiveDataToChat();
          }
          e.preventDefault();
        }


        // _self.bindSearchAccordion();
        _self.bindSearchActionEvents();


      }
      if (templateType === "pay bill" || templateType === "pay credit card bill") {

        var creditCard = $(_self.getSearchTemplate('payBillContainer')).tmplProxy({
          selectedBiller: templateType,
          data: [
            {
              "biller_name": "AT&T",
              "card_type": "master_card",
              "card_number": "2313",
              "bill_amount": "95.20",
              "due_date": "03/07/2020"
            },
            {
              "biller_name": "Verizon Wireless",
              "card_type": "master_card",
              "card_number": "2313",
              "bill_amount": "64.45",
              "due_date": "13/07/2020"
            },
            {
              "biller_name": "Pico Energy",
              "card_type": "master_card",
              "card_number": "6724",
              "bill_amount": "235.20",
              "due_date": "05/07/2020"
            }
          ]
        });
        $(creditCard).off('click', '.closeAction').on('click', '.closeAction', function (e) {
          e.stopPropagation();
          $('.search-body .finalResults').removeClass('hide');
          $('.searchBox').removeClass('hide');
          $('.pay-bill-container').remove();
          $('.search-body').removeClass('h-100');
        })
        $(creditCard).off('click', '.pay-button').on('click', '.pay-button', function (e) {
          var payData = $(this).attr('msgData');
          $('.pay-bill-container .card-container').addClass('hide');
          var gateway = $(_self.getSearchTemplate('paymentGateWayDemo')).tmplProxy({
            paymentDetails: JSON.parse(payData)
          });
          var defaultlibConfig = {
            format: 'MM-DD-YYYY',
            alwaysOpen: false,
            singleMonth: true,
            showShortcuts: false,
            singleDate: true,
            showTopbar: false,
            inline: true,
            startDate: moment().format('MM-DD-YYYY'),
            container: $(gateway).find('.datePicker'),
          };
          $(gateway).off('click', '#gatewayNextDemo').on('click', '#gatewayNextDemo', function (event1) {
            event1.stopPropagation();
            var confirmationModal = $(_self.getSearchTemplate('confirmationModal')).tmplProxy({
            });
            $('.confirmationModal').html(confirmationModal);
            $('.confirmationModal').removeClass('hide');
            $(confirmationModal).off('click', '#confirmGatwayPayment').on('click', '#confirmGatwayPayment', function (ev) {
              ev.stopPropagation();
              var gatwaySuccess = $(_self.getSearchTemplate('gatwaySuccess')).tmplProxy({
                selectedDate: $('#demoDatePicker').val()
              });
              $('.payBillMain').remove();
              $('.LoginWhiteBG ').remove();
              $('.card-pay-title').addClass('hide');
              $('.card-pay-legend').addClass('hide');
              $(gatwaySuccess).off('click', '#makeAnotherPayDemo').on('click', '#makeAnotherPayDemo', function (e2) {
                e2.stopPropagation();
                $('.card-pay-title').removeClass('hide');
                $('.card-pay-legend').removeClass('hide');
                $('.card-container').removeClass('hide');
                $('.search-body').addClass('h-100');
                $('.successContainer').remove();

              })
              $(gatwaySuccess).off('click', '#closePayment').on('click', '#closePayment', function (e2) {
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
            $(confirmationModal).off('click', '#cancelGatwayPayment').on('click', '#cancelGatwayPayment', function (ev) {
              ev.stopPropagation();
              $('.confirmationModal').html('');
              $('.confirmationModal').addClass('hide');
            });
          });
          $(gateway).off('blur', '#demoDatePicker').on('blur', '#demoDatePicker', function (eventBlur) {
            if ($('#demoDatePicker').val()) {
              $('#gatewayNextDemo').removeAttr('disabled');
              $('#gatewayNextDemo').css('cursor', 'pointer');
              $('#gatewayNextDemo').css('opacity', 1);
            } else {
              $('#gatewayNextDemo').attr('disabled');
              $('#gatewayNextDemo').css('cursor', 'auto');
              $('#gatewayNextDemo').css('opacity', 0.7);
            }

          });
          $(gateway).find('#demoDatePicker').dateRangePicker(defaultlibConfig).bind('datepicker-open', function () {
            setTimeout(function () {
              var scrollBottom = $('.search-body').scrollTop() + $('.search-body').height();
              $('.search-body').animate({ scrollTop: scrollBottom });
            }, 150)
          }).bind('datepicker-closed', function () {
            setTimeout(function () {
              if ($('#demoDatePicker').val()) {
                $('#gatewayNextDemo').removeAttr('disabled');
                $('#gatewayNextDemo').css('cursor', 'pointer');
                $('#gatewayNextDemo').css('opacity', 1);
              } else {
                $('#gatewayNextDemo').attr('disabled');
                $('#gatewayNextDemo').css('cursor', 'auto');
                $('#gatewayNextDemo').css('opacity', 0.7);
              }
            }, 150)
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
        _self.bindPerfectScroll(creditCard, '.card-container', null, 'x', 'creditcard');

      }
    }
    FindlySDK.prototype.bindPerfectScroll = function (dataHtml, scrollContainer, update, scrollAxis, contentPSObj) {
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
    FindlySDK.prototype.bindLiveDataToChat = function (botAction) {
      $('#search').val('');
      $('#suggestion').val('');
      var _self = this;
      console.log("Appending Live Data to Chat");
      var payload = {
        "query": _self.vars.searchObject.searchText,
        "maxNumOfResults": 9,
        "userId": _self.API.uuid,
        "streamId": _self.API.streamId,
        "lang": "en"
      }
      if (botAction) {
        _self.vars.searchObject.searchText = "";
        payload.isBotAction = true;
      }
      payload.smallTalk = true;
      var contextObj = $("#contextjsonfield").val();
      if (contextObj) {
        contextObj.trim();
        if (contextObj) {
          try {
            contextObj = JSON.parse(contextObj);
          } catch (error) {
            contextObj = "";
          }
        }
        if (contextObj) {
          payload.context = contextObj;
        }

      }

      var url = _self.API.searchUrl;//'https://qa-bots.kore.ai/searchAssistant/liveSearch';
      var searchData;
      _self.getFrequentlySearched(url, 'POST', JSON.stringify(payload)).then(function (res) {
        _self.handleSearchRes(res);
      });
    }
    FindlySDK.prototype.handleSearchRes = function (res) {
      var _self = this;

      var faqs = [], pages = [], tasks = [], documents = [], facets, searchFacets = [];
      if (res && res.requestId && res.template && res.template.originalQuery) {
        _self.vars.previousSearchObj = {};
        _self.vars.previousSearchObj.requestId = res.requestId; // previous search requestId from response
        _self.vars.previousSearchObj.searchText = res.template.originalQuery; // previous text
      } else {
        console.log('Previous requestId or orinigal query is mising');
      }
      if (res.templateType === 'search') {
        res = res.template;
        var liveResult = res.results;
        var topMatchFAQ;
        var topMatchTask;

        res.searchFacets = [
          {
            "fieldName": "String",
            "facetName": "String",
            "facetType": "range",
            "buckets": [
              {
                "key": "djikstra",
                "from": 10.0,
                "to": 20.0,
                "doc_count": 1
              },
              {
                "key": "prims",
                "from": 20.0,
                "to": 40.0,
                "doc_count": 0
              }
            ]
          },
          {
            "fieldName": "benefits_field",
            "facetName": "benefits",
            "facetType": "value",
            "buckets": [
              {
                "key": "accelerating rewards",
                "doc_count": 55
              },
              {
                "key": "page",
                "doc_count": 3
              },
              {
                "key": "task",
                "doc_count": 1
              }
            ]
          }
        ]
        // liveResult.forEach(function (result) {
        //   if (result.contentType === "faq") {
        //     faqs.push(result);
        //   } else if (result.contentType === "page") {
        //     pages.push(result);
        //   } else if (result.contentType === "task") {
        //     tasks.push(result);
        //   }
        // });
        faqs = res.results.faq;
        pages = res.results.page;
        tasks = res.results.task;
        facets = res.facets;

        if (res.results.document !== undefined) {
          documents = res.results.document;
        }
        else {
          documents = [];
          res.facets.document = 0;
        }

        if (res.searchFacets !== undefined) {
          _self.vars.searchFacetFilters = res.searchFacets;
          // searchFacets = res.searchFacets;
          searchFacets = _self.vars.searchFacetFilters;
          console.log("Search Facets", searchFacets);
        }
        else {
          res.searchFacets = [];
          _self.vars.searchByFacetFilters = res.searchFacets;
          searchFacets = _self.vars.searchFacetFilters;
          console.log(searchFacets);
        }

        // debugger;

        if (tasks.length) {
          //trigger dialog;
          topMatchTask = tasks[0];
        }


        topMatchFAQ = faqs.filter(function (faq) {
          return faq.bestMatch
        });
        if (topMatchFAQ.length) {
          //highlight faq;
          topMatchFAQ = topMatchFAQ[0];
        } else {
          topMatchFAQ = false;
        }

        var dataObj = {
          faqs: faqs,
          pages: pages,
          tasks: tasks,
          facets: facets,

          documents: documents,

          searchFacets: searchFacets,

          originalQuery: res.originalQuery || '',
        }
        // if(!_self.isDev){
        //   dataObj = {
        //     faqs: faqs.slice(0,2),
        //     pages: pages.slice(0,2),
        //     tasks: tasks.slice(0,2),
        //     facets: facets,
        //     originalQuery: res.originalQuery || '',
        //   }
        // }
        _self.vars.searchObject.liveData = {
          faqs: faqs,
          pages: pages,
          tasks: tasks,
          facets: facets,

          documents: documents,

          searchFacets: searchFacets,

          originalQuery: res.originalQuery || '',
        }
        if (!_self.vars.searchObject.recents.length || (_self.vars.searchObject.recents.length && _self.vars.searchObject.recents.indexOf(res.originalQuery.toLowerCase()) == -1)) {
          _self.vars.searchObject.recents.unshift(res.originalQuery.toLowerCase());
        }
        window.localStorage.setItem("recents", JSON.stringify(_self.vars.searchObject.recents));
        if (dataObj.faqs.length ||
          dataObj.pages.length ||
          dataObj.tasks.length || dataObj.smallTalk) {
          if (dataObj.smallTalk) {
            _self.sendMessageToSearch('bot', dataObj.smallTalk);
          } else {
            var _botMessage = 'Sure, please find the matched results below';
            searchData = $(_self.getSearchTemplate('liveSearchData')).tmplProxy({
              faqs: dataObj.faqs,
              pages: dataObj.pages,
              tasks: dataObj.tasks,
              showAllResults: true,
              noResults: false,
              taskPrefix: 'MATCHED',
              viewType = _self.vars.customizeView ? 'Customize' : 'Preview',
            });
            $(searchData).data(dataObj);
            if (!topMatchTask) {
              _self.sendMessageToSearch('bot', _botMessage);
            }
            if (_self.vars.customizeView == true) {
              $(searchData).find(".tasks-wrp").sortable();
            }
            else {
              $(searchData).find(".tasks-wrp").sortable({ disabled: true });
            }

            $(searchData).attr('queryString', dataObj.originalQuery)
            if (topMatchTask) {
              searchData.addClass("hide");
            }
            $('#searchChatContainer').append(searchData);
            _self.vars.showingMatchedResults = true;

            if (_self.vars.customizeView == true) {
              /*$(searchData).find(".tasks-wrp").sortable();
              $(searchData).find(".tasks-wrp").sortable("option", "disabled", false);
              $(searchData).find(".tasks-wrp").disableSelection();*/
              $(".faqs-shadow").addClass('custom-faqs-shadow');
              $(".faqs-wrp-content").addClass('custom-faqs-wrp-content');
              $(".faqs-bottom-actions").addClass('custom-faqs-bottom-actions');
              $(".image-url-sec").css('display', 'none');
              $(".faqs-bottom-actions").css('display', 'table');

              if ($('.custom-header-container-left').css('visibility') == 'hidden') {
                // debugger;
                $('.custom-insights-control-container').show();
              }
            }
            else {
              // $(searchData).find(".tasks-wrp").sortable("disable");
              $(".faqs-shadow").removeClass('custom-faqs-shadow');
              $(".faqs-wrp-content").removeClass('custom-faqs-wrp-content');
              $(".faqs-bottom-actions").removeClass('custom-faqs-bottom-actions');

              $(".image-url-sec").css('display', 'table-cell');
              $(".faqs-bottom-actions").css('display', 'none');
            }
          }
          setTimeout(function () {
            var scrollBottom = $('#searchChatContainer').scrollTop() + $('#searchChatContainer').height();
            $('#searchChatContainer').animate({ scrollTop: scrollBottom });

            if (topMatchTask) {
              $(".resultsOfSearch .task-wrp[contentid='" + topMatchTask.contentId + "'] button:last").trigger('click');
            } else if (topMatchFAQ) {
              var bestFAQDiv = $(".resultsOfSearch .task-wrp[contentid='" + topMatchFAQ.contentId + "']:last");
              bestFAQDiv.addClass('faq-highlight');
              bestFAQDiv.find(".accordion").trigger('click');
            }
          }, 200);
          if ($('.search-container').hasClass('conversation')) {
            $('.search-body').addClass('hide');
            $('#searchChatContainer').removeClass('bgfocus');
            $('.search-body').html('');
          }
          _self.bindAllResultsView();
          _self.bindSearchActionEvents();

        } else {
          if ($('.search-container').hasClass('conversation')) {
            $('.search-body').addClass('hide');
            $('#searchChatContainer').removeClass('bgfocus');
          }
        }
      } else if (res.templateType === 'botAction') {
        // debugger;
        res = res.template;
        var botResponse = res.webhookPayload.text;
        _self.sendMessageToSearch('bot', botResponse);
      } else if (res.templateType === 'botActionError') {
        var errorMessage = (res.template && res.template.Error) ? res.template.Error : 'Failed to connect to the bot'
        _self.sendMessageToSearch('bot', errorMessage);
      } else if (res.templateType === 'liveSearchEmpty') {
        _self.sendMessageToSearch('bot', 'No results found');
      }

    }

    FindlySDK.prototype.bindFrequentData = function () {
      var _self = this;
      $('#suggestion').val('');
      var freqData = $(_self.getSearchTemplate('freqData')).tmplProxy({
        // searchResults: _self.vars.searchObject.recentAPIResponse,
        recents: _self.vars.searchObject.recents.length && _self.vars.searchObject.recents.slice(0, 6),
        recentTasks: _self.vars.searchObject.recentTasks.length && _self.vars.searchObject.recentTasks.slice(0, 2),
        popularSearches: _self.vars.searchObject.popularSearches.slice(0, 6)
      });
      $('.search-body').html(freqData);
      setTimeout(function () {
        $('.search-body').scrollTop(2);
      }, 100);
      _self.deleteRecents();
      _self.recentClick();
      _self.bindSearchActionEvents();
    }
    FindlySDK.prototype.clickOutsideSearch = function () {

      $(document).on('click', function (event) {
        if (!$(event.target).closest('.search-container').length) {
          if ($('.search-body').find('.pay-bill-container').length) {
            return;
          } else {
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
    FindlySDK.prototype.sendMessageToSearch = function (type, mesageData, data) {
      var _self = this;
      var messageData = {
        'text': '',
        'from': type,
      }
      if (type === 'user' && ($('#search').val() !== null) && ($('#search').val() !== undefined)) {
        messageData.text = $('#search').val();
        if (messageData.text && messageData.text.trim()) {
          var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
            msgData: messageData
          });
          $('#searchChatContainer').append(template);
        }
      }
      if (type === 'bot') {
        try {
          messageData = JSON.parse(mesageData);
        } catch (error) {
          messageData.text = mesageData;
        }
        if (messageData && messageData.type && messageData.type === "template") {

          if (messageData.payload && messageData.payload.template_type === "cardTemplate") {
            var y = { "type": "bot_response", "from": "bot", "message": [{ "type": "text", "component": { "type": "template", "payload": { "template_type": "cardTemplate", "elements": [{ "biller_name": "REWARD AND SIGNATURE CARD", "card_type": "master_card", "card_number": "2313", "bill_amount": "95.20", "due_date": "03/07/2020" }, { "biller_name": "DINERS CARD", "card_type": "master_card", "card_number": "2313", "bill_amount": "64.45", "due_date": "13/07/2020" }] } }, "cInfo": { "body": "Here are your details" } }], "messageId": "ms-72023d22-2270-514c-9054-8af4c3408460", "botInfo": { "chatBot": "MyBank Virtual Assistant", "taskBotId": "st-d77caa4b-083a-533c-90d9-733c80ef1cb1" }, "createdOn": "2020-09-08T18:39:24.689Z", "icon": "https://app.findly.ai:443/api/getMediaStream/market/f-6374e248-76ad-5fa9-bcc2-63cd116c4944.png?n=5797654043&s=IklOclpPZElVWWlEK2MzZFNKSTl2b1E5b3hiSWFuV3FtSGR4bElpT2dLaFU9Ig$$", "contextId": "dcx-5b5a373e-7e9b-5215-b074-671b616d4055", "usedtime": 395, "NLAnalysis": { "scoringModel": "original", "toneAnalysis": { "dialogTone": [{ "tone_name": "positive", "level": 2, "count": 1 }, { "tone_name": "joy", "level": 1, "count": 1 }] }, "nlProcessing": { "originalInput": "my balance", "canonical": "I balance", "wordAnalysis": [{ "word": "I", "ignored": true, "pos": "Pronoun_possessive ", "original": "my", "processedWord": "my" }, { "word": "balance", "ignored": false, "pos": "Noun_singular ", "role": "MAINSUBJECT ", "original": "balance", "processedWord": "balance" }] }, "noLabelMatch": ["st-d77caa4b-083a-533c-90d9-733c80ef1cb1"], "ml": { "possible": [{ "task": "CheckBalance", "state": "configured", "score": 0.9414263358151247, "scoringCriteria": "Probabilistic score", "matchType": "possible" }], "eliminated": [{ "task": "TransferMoney", "state": "configured", "score": 0.02181479727476244, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }, { "task": "MakePayment", "state": "configured", "score": 0.010900485239433579, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }, { "task": "ShowAccountDetails", "state": "configured", "score": 0.009582143296980096, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }, { "task": "Log In", "state": "configured", "score": 0.00538434196688181, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }], "namedEntityRecognition": [] }, "fm": { "definitive": [{ "count": 2, "score": 6450, "botid": "st-d77caa4b-083a-533c-90d9-733c80ef1cb1", "botname": "MyBank Virtual Assistant", "activity": "CheckBalance", "activityType": 1, "foundFmEngine": true, "labelsize": 2, "scoreBreakdown": { "coverage": 2000, "spreadBonus": 800, "orderBonus": 200, "wordMatch": 500, "exactWords": 60, "sentenceBonus": 4000, "positionBonus": 1800, "roleBonus": 100, "faqQuestionBonus": 0, "tasktypeBonus": 50, "matchBonus": 500, "phraseJoinPenalty": 0 }, "sentence": 0, "mask": "0 1 2", "allmask": "0 1 2 ", "pattern": "{ get what_is check } [ my account acct credit] [balance bal]", "exactcount": 2, "priority": 10, "mainRoles": 1, "matchType": "definite", "task": "CheckBalance", "state": "configured", "foundVia": "pattern" }] }, "faq": { "demystify": { "SpellCorrectedInput": "my balance", "lemmatizer_used": "PATTERN", "normalizedQuery": "my balance", "OntologyTraits": [], "failed_questions": { "path_coverage": { "total_failures": 62, "questions": ["What is a term loan", "How can I contact customer service?", "What is a credit score", "How do I request a replacement card?", "Where can I find my ABA routing number on my check?"] }, "mandatory_node": { "total_failures": 0, "paths": [] }, "precondition_node": { "total_failures": 2, "paths": ["*locate atms", "*wire transfer"] } }, "SelectedPathCount": 25, "ExtractedEntities": ["balance"], "ContextEntities": [], "PreConditionNodes": [], "filtered_questions": { "score": [["What is the collected balance?", 0.5773502691896258], ["What is a CD?", 0], ["What is a traveler's check?", 0], ["what is individual retirement account", 0], ["What is a canceled check?", 0]], "traits": [] } } }, "finalResolver": { "ranking": [{ "taskId": "dg-7dabfd36-6024-5de8-9866-bf32fa24765b", "intent": "CheckBalance", "activityType": "dialog", "state": "configured", "totalScore": 6450, "scoring": { "count": 2, "score": 6450, "botid": "st-d77caa4b-083a-533c-90d9-733c80ef1cb1", "botname": "MyBank Virtual Assistant", "activity": "CheckBalance", "activityType": 1, "foundFmEngine": true, "labelsize": 2, "scoreBreakdown": { "coverage": 2000, "spreadBonus": 800, "orderBonus": 200, "wordMatch": 500, "exactWords": 60, "sentenceBonus": 4000, "positionBonus": 1800, "roleBonus": 100, "faqQuestionBonus": 0, "tasktypeBonus": 50, "matchBonus": 500, "phraseJoinPenalty": 0 }, "sentence": 0, "mask": "0 1 2", "allmask": "0 1 2 ", "pattern": "{ get what_is check } [ my account acct credit] [balance bal]", "exactcount": 2, "priority": 10, "mainRoles": 1, "matchType": "definite", "csMatch": true }, "identifyingEngines": { "fm": true }, "csMatch": true, "intentMatchVia": "pattern" }], "userInput": "my balance", "winningIntent": [{ "intent": "CheckBalance", "taskId": "dg-7dabfd36-6024-5de8-9866-bf32fa24765b", "activityType": "dialog", "state": "configured", "score": 6450 }], "entities": [] } }, "traceId": "827bca70e1572629" };
            var cardData = messageData.payload.elements;//y.message[0].component.payload.elements;

            var template1 = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
              msgData: {
                from: "bot",
                text: "Choose the credit card to pay bill"
              }
            });
            $('#searchChatContainer').append(template1);

            var creditCard = $(_self.getSearchTemplate('payBillContainer')).tmplProxy({
              selectedBiller: "XYZ",
              data: cardData
            });
            $(creditCard).off('click', '.pay-button').on('click', '.pay-button', function (e) {
              var payData = $(e.currentTarget).attr('msgData');

              payData = JSON.parse(payData);
              _self.vars.searchObject.searchText = payData.postback_value
              messageData.text = payData.postback_value;//"Pay nowwww";
              messageData.from = 'user';
              var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
                msgData: messageData
              });
              $('#searchChatContainer').append(template);
              _self.bindLiveDataToChat();
              setTimeout(function () {
                var scrollBottom = $('#searchChatContainer').scrollTop() + $('#searchChatContainer').height();
                $('#searchChatContainer').animate({ scrollTop: scrollBottom });
              }, 200);

            });
            $('#searchChatContainer').append(creditCard);
          } else if (messageData.payload && messageData.payload.template_type === "listView") {

            var listDefaultMessage = { "type": "bot_response", "from": "bot", "message": [{ "type": "text", "component": { "type": "template", "payload": { "template_type": "listView", "seeMore": true, "moreCount": 4, "text": "Here are your details", "heading": "Speed Analysis", "buttons": [{ "title": "See more", "type": "postback", "payload": "payload" }], "elements": [{ "title": "Checking", "subtitle": "XXXX192", "value": "$7,496.13", "default_action": { "title": "Checking", "type": "payload", "payload": "Checking" } }, { "title": "Trading", "subtitle": "XXXX045", "value": " $22,053.47", "default_action": { "title": "Trading", "type": "payload", "payload": "Trading" } }, { "title": "Credit Card", "subtitle": "XXXX100", "value": "$3,596.00", "default_action": { "title": "Credit Card", "type": "payload", "payload": "Credit Card" } }, { "title": "Savings", "subtitle": "XXXX277", "value": "$17,290.00", "default_action": { "title": "Savings", "type": "payload", "payload": "Savings" } }] } }, "cInfo": { "body": "Here are your details" } }], "messageId": "ms-72023d22-2270-514c-9054-8af4c3408460", "botInfo": { "chatBot": "MyBank Virtual Assistant", "taskBotId": "st-d77caa4b-083a-533c-90d9-733c80ef1cb1" }, "createdOn": "2020-09-08T18:39:24.689Z", "icon": "https://app.findly.ai:443/api/getMediaStream/market/f-6374e248-76ad-5fa9-bcc2-63cd116c4944.png?n=5797654043&s=IklOclpPZElVWWlEK2MzZFNKSTl2b1E5b3hiSWFuV3FtSGR4bElpT2dLaFU9Ig$$", "contextId": "dcx-5b5a373e-7e9b-5215-b074-671b616d4055", "usedtime": 395, "NLAnalysis": { "scoringModel": "original", "toneAnalysis": { "dialogTone": [{ "tone_name": "positive", "level": 2, "count": 1 }, { "tone_name": "joy", "level": 1, "count": 1 }] }, "nlProcessing": { "originalInput": "my balance", "canonical": "I balance", "wordAnalysis": [{ "word": "I", "ignored": true, "pos": "Pronoun_possessive ", "original": "my", "processedWord": "my" }, { "word": "balance", "ignored": false, "pos": "Noun_singular ", "role": "MAINSUBJECT ", "original": "balance", "processedWord": "balance" }] }, "noLabelMatch": ["st-d77caa4b-083a-533c-90d9-733c80ef1cb1"], "ml": { "possible": [{ "task": "CheckBalance", "state": "configured", "score": 0.9414263358151247, "scoringCriteria": "Probabilistic score", "matchType": "possible" }], "eliminated": [{ "task": "TransferMoney", "state": "configured", "score": 0.02181479727476244, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }, { "task": "MakePayment", "state": "configured", "score": 0.010900485239433579, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }, { "task": "ShowAccountDetails", "state": "configured", "score": 0.009582143296980096, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }, { "task": "Log In", "state": "configured", "score": 0.00538434196688181, "scoringCriteria": "Probabilistic score", "matchType": "unlikely" }], "namedEntityRecognition": [] }, "fm": { "definitive": [{ "count": 2, "score": 6450, "botid": "st-d77caa4b-083a-533c-90d9-733c80ef1cb1", "botname": "MyBank Virtual Assistant", "activity": "CheckBalance", "activityType": 1, "foundFmEngine": true, "labelsize": 2, "scoreBreakdown": { "coverage": 2000, "spreadBonus": 800, "orderBonus": 200, "wordMatch": 500, "exactWords": 60, "sentenceBonus": 4000, "positionBonus": 1800, "roleBonus": 100, "faqQuestionBonus": 0, "tasktypeBonus": 50, "matchBonus": 500, "phraseJoinPenalty": 0 }, "sentence": 0, "mask": "0 1 2", "allmask": "0 1 2 ", "pattern": "{ get what_is check }   [ my account acct credit] [balance bal]", "exactcount": 2, "priority": 10, "mainRoles": 1, "matchType": "definite", "task": "CheckBalance", "state": "configured", "foundVia": "pattern" }] }, "faq": { "demystify": { "SpellCorrectedInput": "my balance", "lemmatizer_used": "PATTERN", "normalizedQuery": "my balance", "OntologyTraits": [], "failed_questions": { "path_coverage": { "total_failures": 62, "questions": ["What is a term loan", "How can I contact customer service?", "What is a credit score", "How do I request a replacement card?", "Where can I find my ABA routing number on my check?"] }, "mandatory_node": { "total_failures": 0, "paths": [] }, "precondition_node": { "total_failures": 2, "paths": ["*locate atms", "*wire transfer"] } }, "SelectedPathCount": 25, "ExtractedEntities": ["balance"], "ContextEntities": [], "PreConditionNodes": [], "filtered_questions": { "score": [["What is the collected balance?", 0.5773502691896258], ["What is a CD?", 0], ["What is a traveler's check?", 0], ["what is individual retirement account", 0], ["What is a canceled check?", 0]], "traits": [] } } }, "finalResolver": { "ranking": [{ "taskId": "dg-7dabfd36-6024-5de8-9866-bf32fa24765b", "intent": "CheckBalance", "activityType": "dialog", "state": "configured", "totalScore": 6450, "scoring": { "count": 2, "score": 6450, "botid": "st-d77caa4b-083a-533c-90d9-733c80ef1cb1", "botname": "MyBank Virtual Assistant", "activity": "CheckBalance", "activityType": 1, "foundFmEngine": true, "labelsize": 2, "scoreBreakdown": { "coverage": 2000, "spreadBonus": 800, "orderBonus": 200, "wordMatch": 500, "exactWords": 60, "sentenceBonus": 4000, "positionBonus": 1800, "roleBonus": 100, "faqQuestionBonus": 0, "tasktypeBonus": 50, "matchBonus": 500, "phraseJoinPenalty": 0 }, "sentence": 0, "mask": "0 1 2", "allmask": "0 1 2 ", "pattern": "{ get what_is check }   [ my account acct credit] [balance bal]", "exactcount": 2, "priority": 10, "mainRoles": 1, "matchType": "definite", "csMatch": true }, "identifyingEngines": { "fm": true }, "csMatch": true, "intentMatchVia": "pattern" }], "userInput": "my balance", "winningIntent": [{ "intent": "CheckBalance", "taskId": "dg-7dabfd36-6024-5de8-9866-bf32fa24765b", "activityType": "dialog", "state": "configured", "score": 6450 }], "entities": [] } }, "traceId": "827bca70e1572629" };
            listDefaultMessage.message[0].component = messageData;

            var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
              msgData: {
                from: "bot",
                text: messageData.payload.text
              }
            });
            $('#searchChatContainer').append(template);


            var template = $(_self.getListTemplate()).tmpl({
              'msgData': listDefaultMessage,
              'helpers': helpers,
              'extension': {}
            });
            $('#searchChatContainer').append(template);
          }
        } else {
          //simple text message
          var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
            msgData: messageData
          });
          $('#searchChatContainer').append(template);
        }
      }
      if (type === 'botAction') {
        messageData.text = _self.vars.searchObject.searchText;
        messageData.from = 'user';
        var template = $(_self.getSearchTemplate('messageBubbles')).tmplProxy({
          msgData: messageData
        });
        //$('#searchChatContainer').append(template);
        $('.search-body').hide();
        $('#searchChatContainer').addClass('bgfocus-override');
        _self.bindLiveDataToChat(true);

      }
      setTimeout(function () {
        var scrollBottom = $('#searchChatContainer').scrollTop() + $('#searchChatContainer').height();
        $('#searchChatContainer').animate({ scrollTop: scrollBottom });
      }, 200);
    }
    FindlySDK.prototype.userLogin = function (clickedAction) {
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
          //static pay bill removed
          if (false && action === 'pay bill') {
            _self.searchEventBinding('pay bill', action, event);
          } else {
            _self.vars.searchObject.searchText = action;
            _self.sendMessageToSearch('botAction');
          }

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
    FindlySDK.prototype.getFrequentlySearched = function (url, type, payload) {
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
    FindlySDK.prototype.getPopularSearchList = function (url, type) {
      var bearer = this.API.jstBarrer;
      return $.ajax({
        url: url,
        type: type,
        headers: {
          // "Authorization": bearer,
          "Content-Type": "application/json"
        },
        data: {},
        success: function (data) {
          // console.log(data);
        },
        error: function (err) {
          console.log(err);
        }
      })
    };
    FindlySDK.prototype.newSearchFeedbackPost = function (url, type, payload) {
      var bearer = this.API.jstBarrer || "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.wrUCyDpNEwAaf4aU5Jf2-0ajbiwmTU3Yf7ST8yFJdqM";
      return $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        headers: {
          "Authorization": bearer,
          "Content-Type": "application/json"
        },
        data: JSON.stringify(payload),
        success: function (data) {
          console.log(data);
        },
        error: function (err) {
          console.log(err);
        }
      })
    };
    FindlySDK.prototype.makeAPItoFindly = function (url, type, payload) {
      return $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        headers: {
          "Authorization": 'bearer ' + window.findlyAccessToken,
          "AccountId": window.findlyAccountId,
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
    FindlySDK.prototype.bindCloseGreeting = function () {
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
    FindlySDK.prototype.initWebKitSpeech = function () {
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
            $('#search').focus().trigger({ type: 'keyup', which: 32 });
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

    FindlySDK.prototype.showSearch = function () {
      var _self = this;
      _self.initWebKitSpeech();
      _self.setAPIDetails();
      _self.initKoreSDK();
      _self.isDev = false;
      if (!$('body').hasClass('demo')) {
        _self.isDev = true;
      }
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
      _self.bindContextVariable();
      _self.bindSearchAccordion();
      _self.bindFeedbackEvent();
      $(dataHTML).css('left', left);
      var container = $('.search-background-div');
      if (!container.length) {
        container = $('body')
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
    FindlySDK.prototype.initKoreSDK = function () {
      var _self = this;
      _self.bot = requireKr('/KoreBot.js').instance();
      _self.bot.init(_self.config.botOptions, _self.config.messageHistoryLimit);
      _self.bindSocketEvents();

    };
    FindlySDK.prototype.bindSocketEvents = function () {
      var _self = this;
      _self.bot.on("message", function (message) {
        // debugger;
        // if (me.popupOpened === true) {
        //     $('.kore-auth-popup .close-popup').trigger("click");
        // }
        var tempData = JSON.parse(message.data);

        if (tempData.from === "bot" && tempData.type === "bot_response") {
          // if (tempData.message[0]) {
          //     if (!tempData.message[0].cInfo) {
          //         tempData.message[0].cInfo = {};
          //     }
          //     if (tempData.message[0].component && !tempData.message[0].component.payload.text) {
          //         try {
          //             tempData.message[0].component = JSON.parse(tempData.message[0].component.payload);
          //         } catch (err) {
          //             tempData.message[0].component = tempData.message[0].component.payload;
          //         }
          //     }
          //     if (tempData.message[0].component && tempData.message[0].component.payload && tempData.message[0].component.payload.text) {
          //         tempData.message[0].cInfo.body = tempData.message[0].component.payload.text;
          //     }
          //     if(tempData.message[0].component && tempData.message[0].component.payload && (tempData.message[0].component.payload.videoUrl || tempData.message[0].component.payload.audioUrl)){
          //         tempData.message[0].cInfo.body = tempData.message[0].component.payload.text || "";
          //     }
          // }
          // if (loadHistory && historyLoading) {
          //     messagesQueue.push(tempData);
          // }
          // else {
          //     me.renderMessage(tempData);
          // }
          _self.handleSearchRes(tempData.message[0].component.payload);
        }
        else if (tempData.from === "self" && tempData.type === "user_message") {
          var tempmsg = tempData.message;
          var msgData = {};
          if (tempmsg && tempmsg.attachments && tempmsg.attachments[0] && tempmsg.attachments[0].fileId) {
            msgData = {
              'type': "currentUser",
              "message": [{
                'type': 'text',
                'cInfo': { 'body': tempmsg.body, attachments: tempmsg.attachments },
                'clientMessageId': tempData.id
              }],
              "createdOn": tempData.id
            };
          } else {
            msgData = {
              'type': "currentUser",
              "message": [{
                'type': 'text',
                'cInfo': { 'body': tempmsg.body },
                'clientMessageId': tempData.id
              }],
              "createdOn": tempData.id
            };
          }
          me.renderMessage(msgData);
        }
        if (tempData.type === "appInvalidNotification") {
          setTimeout(function () {
            $('.trainWarningDiv').addClass('showMsg');
          }, 2000);
        }
      });

    };

    FindlySDK.prototype.sendMessage = function (chatInput, renderMsg, msgObject) {
      var _self = this;
      // if(msgObject && msgObject.message[0]&& msgObject.message[0].component&& msgObject.message[0].component.payload && msgObject.message[0].component.payload.ignoreCheckMark){
      // var ignoreCheckMark=msgObject.message[0].component.payload.ignoreCheckMark;
      // }
      // if (chatInput.text().trim() === "" && $('.attachment').html().trim().length == 0) {
      //     return;
      // }
      // if (me.config.allowLocation) {
      //     bot.fetchUserLocation();
      // }
      // var _bodyContainer = $(me.config.chatContainer).find('.kore-chat-body');
      // var _footerContainer = $(me.config.chatContainer).find('.kore-chat-footer');
      var clientMessageId = new Date().getTime();
      var msgData = {};
      fileUploaderCounter = 0;
      //to send \n to server for new lines
      //chatInput.html(chatInput.html().replaceAll("<br>", "\n"));
      if (false && attachmentInfo && Object.keys(attachmentInfo).length) {
        msgData = {
          'type': "currentUser",
          "message": [{
            'type': 'text',
            'cInfo': {
              'body': chatInput.text(),
              'attachments': [attachmentInfo]
            },
            'clientMessageId': clientMessageId
          }],
          "createdOn": clientMessageId
        };
        $('.attachment').html('');
        $('.kore-chat-window').removeClass('kore-chat-attachment');
        document.getElementById("captureAttachmnts").value = "";
      } else {
        attachmentInfo = {};
        msgData = {
          'type': "currentUser",
          "message": [{
            'type': 'text',
            'cInfo': { 'body': chatInput },
            'clientMessageId': clientMessageId
          }],
          "createdOn": clientMessageId
        };
      }

      var messageToBot = {};
      messageToBot["clientMessageId"] = clientMessageId;
      if (Object.keys(attachmentInfo).length > 0 && chatInput.text().trim().length) {
        messageToBot["message"] = { body: chatInput.text().trim(), attachments: [attachmentInfo] };
      } else if (Object.keys(attachmentInfo).length > 0) {
        messageToBot["message"] = { attachments: [attachmentInfo] };
      }
      else {
        messageToBot["message"] = { body: chatInput };
      }
      messageToBot["resourceid"] = '/bot.message';

      if (renderMsg && typeof renderMsg === 'string') {
        messageToBot["message"].renderMsg = renderMsg;
      }
      if (msgObject && msgObject.customdata) {
        messageToBot["message"].customdata = msgObject.customdata;
      }
      if (msgObject && msgObject.nlmeta) {
        messageToBot["message"].nlmeta = msgObject.nlmeta;
      }
      attachmentInfo = {};
      _self.bot.sendMessage(messageToBot, function messageSent(err) {
        if (err && err.message) {
          setTimeout(function () {
            $('#msg_' + clientMessageId).find('.messageBubble').append('<div class="errorMsg">Send Failed. Please resend.</div>');
          }, 350);
        }
      });
    };

    FindlySDK.prototype.getTemplate = function (type) {
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

    FindlySDK.prototype.bindWidgetEvent = function () { };

    FindlySDK.prototype.openDropdown = function (data) {
      console.log(data);
    };

    // FindlySDK.prototype.showingMatchedResults = false;

    FindlySDK.prototype.openTab = function (event, tabName) {
      event.preventDefault();
      event.stopImmediatePropagation();

      var _self = this;
      console.log(event);

      var navLinks = document.getElementsByClassName("custom-header-nav-link-item");
      for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].className = navLinks[i].className.replace(" nav-link-item-active", "");
      }
      event.currentTarget.className += " nav-link-item-active";

      if (koreWidgetSDKInstance.vars.showingMatchedResults == true) {
        if (tabName == 'customize') {
          koreWidgetSDKInstance.vars.customizeView = true;
          // $(".faqs-bottom-actions").css('display', 'table');
          $(".custom-insights-control-container").show();
          $(".tasks-wrp").sortable();
          $(".tasks-wrp").sortable("option", "disabled", false);
          $(".tasks-wrp").disableSelection();

          $(".faqs-shadow").addClass('custom-faqs-shadow');
          $(".faqs-wrp-content").addClass('custom-faqs-wrp-content');
          $(".faqs-bottom-actions").addClass('custom-faqs-bottom-actions');

          $(".image-url-sec").css('display', 'none');
          $(".faqs-bottom-actions").css('display', 'table');

        }
        else {
          koreWidgetSDKInstance.vars.customizeView = false;
          $(".custom-insights-control-container").hide();
          $(".faqs-shadow").removeClass('custom-faqs-shadow');
          $(".faqs-wrp-content").removeClass('custom-faqs-wrp-content');
          $(".faqs-bottom-actions").removeClass('custom-faqs-bottom-actions');

          $(".tasks-wrp").sortable("disable");
          $(".image-url-sec").css('display', 'table-cell');
          $(".faqs-bottom-actions").css('display', 'none');

        }
      }
      else {
        if (tabName == 'customize') {
          koreWidgetSDKInstance.vars.customizeView = true;
        }
        else {
          koreWidgetSDKInstance.vars.customizeView = false;
        }

      }
      /*var actionsDivs = document.getElementsByClassName("faqs-bottom-actions");
      for(var i = 0; i < actionsDivs.length; i++) {
        if (tabName == 'customize') {
          actionsDivs[i].style.display = "table";
        }
        else {
          actionsDivs[i].style.display = "none";
        }
      }*/

    };

    FindlySDK.prototype.openPanel = function (panelName, resPopUp, heightToggle) {
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

    FindlySDK.prototype.checkWidgetSwitchEditor = function (newPanel, oldPanel) {
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

    FindlySDK.prototype.prepareRenderData = function (panelName) {
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

    FindlySDK.prototype.getServerDataGen = function (url, method, payload, _params) {
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

    FindlySDK.prototype.getServerData = function (url, method, payload, _params, passedJson) {
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

    FindlySDK.prototype.getCacheDataByWidgetId = function (widgetId) {
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
    FindlySDK.prototype.getPanelDataByPanelId = function (panelId) {
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
    FindlySDK.prototype.getWidgetDataByWidgetId = function (widgetId) {
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
    FindlySDK.prototype.openCloseBottomOverlayContainer = function (open, htmlData) {
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
    FindlySDK.prototype.applySortingAndFilter = function (e, bindingData, sortInputs) {
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
    FindlySDK.prototype.applySorting = function (e, $ele, templateType, bindingData) {
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
    FindlySDK.prototype.openWidgetFilters = function (e, ele, templateType, bindingData) {
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
    FindlySDK.prototype.bindTemplateEvents = function (ele, templateType, bindingData) {
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

    FindlySDK.prototype.getHTMLTemplate = function (responseData, xhrObject) {
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
    FindlySDK.prototype.prepereWidgetHeader = function (responseData, xhrObject) {
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
    FindlySDK.prototype.renderTemplate = function (responseData, xhrObject) {
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

    FindlySDK.prototype.resolveUrl = function (toResolveUrl, values, deleteProp) {
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

    FindlySDK.prototype.getResolveMeeting = function (obj) {
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

    FindlySDK.prototype.filterTabs = function (parentId, subpanelId, filterId) {
      var _self = this;

      $(parentId + ' #' + subpanelId + ' .' + subpanelId + '_content').hide(); // hiding the content panel

      $(parentId + ' #' + subpanelId + ' #' + filterId + '_content').show(); // showing the content panel

      $(parentId + ' #' + subpanelId + ' .filterCntr li').addClass('unActive').removeClass('active'); // removing active class from all and adding unactive class to all

      $(parentId + ' #' + subpanelId + ' #' + filterId).addClass('active').removeClass('unActive'); // add active in current tab and remove unactive

      _self.resetTask();
    };

    FindlySDK.prototype.viewMorePanel = function (obj) {
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

    FindlySDK.prototype.scrollData = function (paneldata, filterdata, panelType, e) {
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
    FindlySDK.prototype.scrollServerData = function (url, method, payload, passedJson, e, viewMoredata, panelType) {
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

    FindlySDK.prototype.mergedata = function (oldJson, newJson) {
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

    FindlySDK.prototype.setChatFocus = function () {
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

    FindlySDK.prototype.removeViewMore = function () {
      var _self = this;

      $(_self.config.container.content).find('.viewMoreCntr').remove();
    };
    FindlySDK.prototype.getColumnWidth = function (width) {
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

    FindlySDK.prototype.refreshElement = function (panelDetails, refreshFullpanel, widgetData) {
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
    FindlySDK.prototype.refreshWidgetData = function (widgetData, time, panelDetail) {
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
    FindlySDK.prototype.clearWidgetPolling = function (widgetData) {
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
    FindlySDK.prototype.startWidgetPolling = function (widgetData, currTime, givenTime, panelDetail) {
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
    FindlySDK.prototype.refreshData = function (panelName, time) {
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

    FindlySDK.prototype.startPolling = function (panelName, currTime, givenTime) {
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

    FindlySDK.prototype.resetTask = function () {
      taskList = [];
      taskTitle = {};
      $('.viewMoreCntr .viewTask').find('[type="checkbox"]').prop('checked', false);
      $('.viewMoreCntr .taskSelectCntr,.viewMoreCntr .taskSelectFootCntr').hide();
      $('.allTaskCntr .viewTask').removeClass('selected');
    };

    FindlySDK.prototype.meetingTimer = function (tdata, m_Data, index) {
      var _self = this; //#TODO
      // if (this.constructor !== FindlySDK) {
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

    FindlySDK.prototype.startTimer = function (mObj) {
      var _self = this; //#TODO
      // if(this.constructor!==FindlySDK){
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

    FindlySDK.prototype.passHashTag = function (uttarence) {
      var message = 'find the articles with ' + uttarence;
      window['chatWinRef'].sendMessage($('.chatInputBox'), message, {}, 'onlyMessage');
    };

    FindlySDK.prototype.openArticle = function (kId) {
      window.angularComponentReference.zone.run(function () {
        window.angularComponentReference.componentFn({
          'id': kId
        });
      });
    };

    FindlySDK.prototype.openAnnouncement = function (kId) {
      window.angularComponentReference.zone.run(function () {
        window.viewMoreKnowledgeAnncCmp.componentFn({
          'id': kId,
          'viewType': 'announceWidgetView'
        });
      });
    };

    FindlySDK.prototype.openLink = function (url) {
      if (url) {
        window.open(url, '_blank');
      }
    };

    FindlySDK.prototype.passTaskUtterances = function (e, actionIndex) {
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

    FindlySDK.prototype.passUtterances = function (idss, message, evt) {
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

    FindlySDK.prototype.triggerEvent = function (eventName, data) {
      var _self = this;

      if (_self.events && _self.events[eventName]) {
        _self.events[eventName](data);

        _self.setChatFocus();
      }
    };

    FindlySDK.prototype.triggerAction = function (actionObj, postData) {
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

    FindlySDK.prototype.checkCurrentUser = function (oId, aId) {
      var _self = this;

      var uId = _self.config.userInfo.id; //$.jStorage.get('currentAccount').userInfo.id;

      if (oId == uId && aId == uId) {
        return true;
      } else {
        return false;
      }
    };

    FindlySDK.prototype.categoriseMeetingDayWise = function (mData) {
      var ele = object.assign({}, mData);

      for (var k = 0; k < ele.length; k++) {
        var dayType = helpers.getTimeline(ele.data.duration.start, "fulldate", "meetings");

        if (dayType === "Next Inline") { } else if (dayType === 'Later Today') { } else { }
      }
    };

    FindlySDK.prototype.showDropdown = function (obj) {
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

    FindlySDK.prototype.addArticleAnnouncement = function (type) {
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

    FindlySDK.prototype.passMeetingUtterances = function (_this) {
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

    FindlySDK.prototype.meetingAction = function (actionObj, mainObj) {
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

    FindlySDK.prototype.taskkAction = function (tId, taskName, e) {
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

    FindlySDK.prototype.removeTaskSelection = function () {
      resetTask();

      if (taskList.length === 0) {
        $(".viewMoreCntr .mainTemplateBdr .widgetContentPanel").css({
          'height': 'calc(100% - 135px)'
        });
      }
    };

    FindlySDK.prototype.taskSend = function (type) {
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

    FindlySDK.prototype.taskCheckbox = function (taskId) {
      if (taskList.indexOf(taskId) >= 0) {
        return true;
      } else {
        return false;
      }
    };

    FindlySDK.prototype.sendTaskAction = function (type, actionPlace) {
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

    FindlySDK.prototype.popupAction = function (data, title, _this) {
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

    FindlySDK.prototype.createPopup = function (content, actionObj, mainObj) {
      var _self = this;

      var dataHTML = $(_self.getTemplate("popUpTemplate")).tmplProxy({
        'tempdata': content,
        'actionObj': actionObj,
        'mainObj': mainObj
      });
      $('.mgrCntr').append(dataHTML);
    };

    FindlySDK.prototype.toggelMeetingActionBtn = function (id, e) {
      if ($(e).children().hasClass("icon-Arrow_Drop_Down_Up")) {
        $(e).children().removeClass("icon-Arrow_Drop_Down_Up");
        $(e).children().addClass("icon-Arrow_Drop_Down");
      } else {
        $(e).children().addClass("icon-Arrow_Drop_Down_Up");
        $(e).children().removeClass("icon-Arrow_Drop_Down");
      }

      $("#" + id).slideToggle("slow");
    };

    FindlySDK.prototype.hexToRGBMeeting = function (hex, alpha) {
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

    FindlySDK.prototype.isURL = function (str) {
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


    FindlySDK.prototype.getTemplateMethods = function () {
      var _self = this;

      var methodMap = {};
      var templateMethodsArr = ["openPanel", "filterTabs", "viewMorePanel", "scrollData", "removeViewMore", "meetingTimer", "passHashTag", "openArticle", "openAnnouncement", "openLink", "passTaskUtterances", "passUtterances", "checkCurrentUser", "showDropdown", "addArticleAnnouncement", "passMeetingUtterances", "taskkAction", "removeTaskSelection", "taskSend", "taskCheckbox", "popupAction", "toggelMeetingActionBtn", "hexToRGBMeeting", "isURL"];
      templateMethodsArr.forEach(function (methodName) {
        methodMap[methodName] = _self[methodName].bind(_self);
      });
      return methodMap;
    };

    FindlySDK.prototype.openPanelForWindow = function (panelName, resPopUp, heightToggle) {
      FindlySDK.prototype.openPanel.call(koreWidgetSDKInstance, panelName, resPopUp, heightToggle);
    };
    FindlySDK.prototype.getHTMLForSearch = function (val) {
      return FindlySDK.prototype.convertMDtoHTML.call(koreWidgetSDKInstance, val);
    };

    FindlySDK.prototype.filterTabsForWindow = function (parentId, subpanelId, filterId) {
      FindlySDK.prototype.filterTabs.call(koreWidgetSDKInstance, parentId, subpanelId, filterId);
    };

    FindlySDK.prototype.viewMorePanelForWindow = function (obj) {
      FindlySDK.prototype.viewMorePanel.call(koreWidgetSDKInstance, obj);
    };

    FindlySDK.prototype.scrollDataForWindow = function (paneldata, filterdata, panelType, e) {
      FindlySDK.prototype.scrollData.call(koreWidgetSDKInstance, paneldata, filterdata, panelType, e);
    };

    FindlySDK.prototype.removeViewMoreForWindow = function () {
      FindlySDK.prototype.removeViewMore.call(koreWidgetSDKInstance);
    };

    FindlySDK.prototype.meetingTimerForWindow = function (tdata, m_Data, index) {
      FindlySDK.prototype.meetingTimer.call(koreWidgetSDKInstance, tdata, m_Data, index);
    };

    FindlySDK.prototype.passHashTagForWindow = function (uttarence) {
      FindlySDK.prototype.passHashTag.call(koreWidgetSDKInstance, uttarence);
    };

    FindlySDK.prototype.openArticleForWindow = function (kId) {
      FindlySDK.prototype.openArticle.call(koreWidgetSDKInstance, kId);
    };

    FindlySDK.prototype.openAnnouncementForWindow = function (kId) {
      FindlySDK.prototype.openAnnouncement.call(koreWidgetSDKInstance, kId);
    };

    FindlySDK.prototype.openLinkForWindow = function (url) {
      FindlySDK.prototype.openLink.call(koreWidgetSDKInstance, url);
    };

    FindlySDK.prototype.passTaskUtterancesForWindow = function (e, actionIndex) {
      FindlySDK.prototype.passTaskUtterances.call(koreWidgetSDKInstance, e, actionIndex);
    };

    FindlySDK.prototype.passUtterancesForWindow = function (idss, message, evt) {
      FindlySDK.prototype.passUtterances.call(koreWidgetSDKInstance, idss, message, evt);
    };

    FindlySDK.prototype.checkCurrentUserForWindow = function (oId, aId) {
      FindlySDK.prototype.checkCurrentUser.call(koreWidgetSDKInstance, oId, aId);
    };

    FindlySDK.prototype.showDropdownForWindow = function (obj) {
      FindlySDK.prototype.showDropdown.call(koreWidgetSDKInstance, obj);
    };

    FindlySDK.prototype.addArticleAnnouncementForWindow = function (type) {
      FindlySDK.prototype.addArticleAnnouncement.call(koreWidgetSDKInstance, type);
    };

    FindlySDK.prototype.refreshElementForWindow = function (type, refreshType) {
      FindlySDK.prototype.refreshElement.call(koreWidgetSDKInstance, type, refreshType);
    };

    FindlySDK.prototype.passMeetingUtterancesForWindow = function (_this) {
      FindlySDK.prototype.passMeetingUtterances.call(koreWidgetSDKInstance, _this);
    };

    FindlySDK.prototype.taskkActionForWindow = function (tId, taskName, e) {
      FindlySDK.prototype.taskkAction.call(koreWidgetSDKInstance, tId, taskName, e);
    };

    FindlySDK.prototype.removeTaskSelectionForWindow = function () {
      FindlySDK.prototype.removeTaskSelection.call(koreWidgetSDKInstance);
    };

    FindlySDK.prototype.taskSendForWindow = function (type) {
      FindlySDK.prototype.taskSend.call(koreWidgetSDKInstance, type);
    };

    FindlySDK.prototype.taskCheckboxForWindow = function (taskId) {
      FindlySDK.prototype.taskCheckbox.call(koreWidgetSDKInstance, taskId);
    };

    FindlySDK.prototype.popupActionForWindow = function (data, title, _this) {
      FindlySDK.prototype.popupAction.call(koreWidgetSDKInstance, data, title, _this);
    };

    FindlySDK.prototype.toggelMeetingActionBtnForWindow = function (id, e) {
      FindlySDK.prototype.toggelMeetingActionBtn.call(koreWidgetSDKInstance, id, e);
    };

    FindlySDK.prototype.hexToRGBMeetingForWindow = function (hex, alpha) {
      FindlySDK.prototype.hexToRGBMeeting.call(koreWidgetSDKInstance, hex, alpha);
    };

    FindlySDK.prototype.isURLForWindow = function (str) {
      FindlySDK.prototype.isURL.call(koreWidgetSDKInstance, str);
    };

    window.openPanel = FindlySDK.prototype.openPanelForWindow;
    window.getHTMLForSearch = FindlySDK.prototype.getHTMLForSearch;
    window.filterTabs = FindlySDK.prototype.filterTabsForWindow;
    window.viewMorePanel = FindlySDK.prototype.viewMorePanelForWindow;
    window.scrollData = FindlySDK.prototype.scrollDataForWindow;
    window.removeViewMore = FindlySDK.prototype.removeViewMoreForWindow;
    window.meetingTimer = FindlySDK.prototype.meetingTimerForWindow;
    window.passHashTag = FindlySDK.prototype.passHashTagForWindow;
    window.openArticle = FindlySDK.prototype.openArticleForWindow;
    window.openAnnouncement = FindlySDK.prototype.openAnnouncementForWindow;
    window.openLink = FindlySDK.prototype.openLinkForWindow;
    window.passTaskUtterances = FindlySDK.prototype.passTaskUtterancesForWindow;
    window.passUtterances = FindlySDK.prototype.passUtterancesForWindow;
    window.checkCurrentUser = FindlySDK.prototype.checkCurrentUserForWindow;
    window.showDropdown = FindlySDK.prototype.showDropdownForWindow;
    window.addArticleAnnouncement = FindlySDK.prototype.addArticleAnnouncementForWindow;
    window.refreshElement = FindlySDK.prototype.refreshElementForWindow;
    window.passMeetingUtterances = FindlySDK.prototype.passMeetingUtterancesForWindow;
    window.taskkAction = FindlySDK.prototype.taskkActionForWindow;
    window.removeTaskSelection = FindlySDK.prototype.removeTaskSelectionForWindow;
    window.taskSend = FindlySDK.prototype.taskSendForWindow;
    window.taskCheckbox = FindlySDK.prototype.taskCheckboxForWindow;
    window.popupAction = FindlySDK.prototype.popupActionForWindow;
    window.toggelMeetingActionBtn = FindlySDK.prototype.toggelMeetingActionBtnForWindow;
    window.hexToRGBMeeting = FindlySDK.prototype.hexToRGBMeetingForWindow;
    window.isURL = FindlySDK.prototype.isURLForWindow;
    window.openTab = FindlySDK.prototype.openTab;

    FindlySDK.prototype.getMeetingSlot = function (duration) {
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

    FindlySDK.prototype.getDateArray = function (start, end) {
      var arr = new Array(),
        dt = new Date(start);

      while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }

      return arr;
    };

    FindlySDK.prototype.cloneMessage1 = function (obj) {
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

    FindlySDK.prototype.compare = function (a, b) {
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

    FindlySDK.prototype.init = function (config) {
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

    FindlySDK.prototype.setJWT = function (jwtToken) {
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
    return FindlySDK;
  }(koreJquery, korejstz, KRPerfectScrollbar);
});