(function ($) {
  function searchTemplate(data) {
    this.cfg = data;
  }

  searchTemplate.prototype.resultTemplates = function (structuredData) {
    var searchTemplates = {
      'structuredData': [
        {
          "id": 1,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="tpt-1-tle-wt-txt {{if devMode== false || viewType != "Customize"}}display-none{{/if}}">\
                <div class="total-structured-data-wrap {{if viewType=="Customize"&&devMode==true}}{{if isFullResults == true}}customization{{/if}}{{/if}} {{if maxSearchResultsAllowed ==0}}display-none{{/if}}">\
                  {{if tour && isFullResults == true && viewType=="Customize"&&devMode==true}}\
                    <div class="tours-information sdk-tours-info-start">\
                      <div class="tourtitle sdk-i18n-lang" sdk-i18n-key="sa_sdk_customize">{{html langTranslator("sa_sdk_customize")}}</div>\
                      <div class="tour-info sdk-i18n-lang" sdk-i18n-key="sa_sdk_start_customizing_your_search_results_by_hovering">{{html langTranslator("sa_sdk_start_customizing_your_search_results_by_hovering")}}</div>\
                      <div class="tour-action-info"><b class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_hide_caps">{{html langTranslator("sa_sdk_hide_caps")}}</b> - <span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_hide_the_search_result">{{html langTranslator("sa_sdk_hide_the_search_result")}}</span></div>\
                      <div class="tour-action-info"><b class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_pin_caps">{{html langTranslator("sa_sdk_pin_caps")}}</b> - <span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_pin_results_in_a_specific_position">{{html langTranslator("sa_sdk_pin_results_in_a_specific_position")}}</span></div>\
                      <div class="tour-action-info"><b class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_boost_caps">{{html langTranslator("sa_sdk_boost_caps")}}</b> - <span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_boost_the_relevance_score">{{html langTranslator("sa_sdk_boost_the_relevance_score")}}</span></div>\
                      <div class="tour-action-info"><b class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_lower_caps">{{html langTranslator("sa_sdk_lower_caps")}}</b> - <span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_lower_the_relelavance_score">{{html langTranslator("sa_sdk_lower_the_relelavance_score")}}</span></div>\
                      <div class="footer-tour">\
                        <div class="tour-length">1 of 2</div>\
                        <div class="tour-btns">\
                            <button class="next-btn sdk-tours-info-nxt sdk-i18n-lang" sdk-i18n-key="sa_sdk_next">{{html langTranslator("sa_sdk_next")}}</button>\
                            <button class="close-btn sdk-tours-info-close sdk-i18n-lang" sdk-i18n-key="sa_sdk_close">{{html langTranslator("sa_sdk_close")}}</button>\
                        </div>\
                      </div>\
                    </div>\
                    <div class="tours-information tour-customization-info sdk-tours-info-end hide">\
                      <div class="tourtitle sdk-i18n-lang" sdk-i18n-key="sa_sdk_customize">{{html langTranslator("sa_sdk_customize")}}</div>\
                      <div class="tour-info mb-2 pb-1 sdk-i18n-lang" sdk-i18n-key="sa_sdk_you_can_order_the_results_by_clicking">{{html langTranslator("sa_sdk_you_can_order_the_results_by_clicking")}}</div>\
                      <div class="footer-tour">\
                        <div class="tour-length">2 of 2</div>\
                        <div class="tour-btns">\
                            <button class="next-btn sdk-tours-info-close sdk-i18n-lang" sdk-i18n-key="sa_sdk_got_it">{{html langTranslator("sa_sdk_got_it")}}</button>\
                            <button class="close-btn sdk-tours-info-pre sdk-i18n-lang" sdk-i18n-key="sa_sdk_previous">{{html langTranslator("sa_sdk_previous")}}</button>\
                        </div>\
                      </div>\
                    </div>\
                    {{/if}}\
                    {{if isFullResults == true || isSearch == true || isLiveSearch == true}}\
                      <ul class="tile-with-text-parent tasks-wrp structured-data-outer-wrap {{if isDropdownEnabled == true && isFullResults == false}}panel p-0{{/if}} {{if isClickable == false}}with-accordion{{/if}} {{if isFullResults == true}}results-wrap{{/if}}" style="{{if isDropdownEnabled == true && isFullResults == false}}max-height: 100% !important; overflow : initial !important;{{/if}}">\
                        {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
                          <li class="task-wrp faqs-shadow structure-data-wrp {{if viewType=="Customize" && isFullResults == true}}{{if data.config.visible == false || (data.config.visible == true && !data.addedResult && (data.config.pinIndex < 0))}}ui-state-disabled{{/if}}{{/if}} {{if viewType != "Customize" && config.visible == false}}display-none{{/if}}" boost="${data.config.boost}" pinIndex="${data.config.pinIndex}" visible="${data.config.visible}" contentId="${data.contentId}" contentType="${data.sys_content_type}" manuallyAdded="${data.addedResult}" id="${key}">\
                              {{if isClickable == true}}\
                                {{if viewType!="Customize" && (isFullResults == true ||  isSearch == true || isLiveSearch == true)}}\
                                  <div class="click-to-navigate-url tile-with-text structured-data-wrp-content" href="${data.url}" target="_blank">\
                                    <div class="tile-heading text-truncate one-line-height"  title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                                    <div class="tile-description text-truncate one-line-height">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                                  </div>\
                                {{/if}}\
                                {{if viewType=="Customize" && (isFullResults != true &&  (isSearch == true || isLiveSearch == true))}}\
                                  <div class="click-to-navigate-url tile-with-text structured-data-wrp-content"  href="${data.url}" target="_blank">\
                                    <div class="tile-heading text-truncate one-line-height"  title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                                    <div class="tile-description text-truncate one-line-height">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                                  </div>\
                                {{/if}}\
                                {{if viewType=="Customize" && isFullResults == true}}\
                                  <div class="data-wrap" index="${i}" contentType="${data.sys_content_type}" contentId="${data.contentId}" score="${data.score}" boost="${data.config.boost}" pinIndex="${data.config.pinIndex}" visible="${data.config.visible}">\
                                    <div class="customization-tile{{if data.config.visible == false}} disable_hidden{{/if}}{{if data.config.pinIndex >= 0}} disable_pinned{{/if}}">\
                                        <div class="drag-content {{if data.config.visible == false || (data.config.visible == true && !data.addedResult && (data.config.pinIndex < 0))}}display-none{{/if}}"></div>\
                                        {{if !data.addedResult || data.addedResult == false}}\
                                          <div class="actions-content">\
                                            <span class="action-item visibility" type="{{if data.config.visible == true}}Hide{{/if}}{{if data.config.visible == false}}UnHide{{/if}}">\
                                              <span class="tooltiptext">\
                                                <span class="_hide sdk-i18n-lang {{if data.config.visible == true}}display-block{{else}}display-none{{/if}}" sdk-i18n-key="sa_sdk_hide">\
                                                {{html langTranslator("sa_sdk_hide")}}\
                                                </span>\
                                                <span class="unhide sdk-i18n-lang {{if data.config.visible == false}}display-block{{else}}display-none{{/if}}" sdk-i18n-key="sa_sdk_unhide">\
                                                {{html langTranslator("sa_sdk_unhide")}}\
                                                </span>\
                                              </span>\
                                              <span class="img_hide {{if data.config.visible == true}}display-block{{else}}display-none{{/if}}">\
                                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEgSURBVHgB3VLRTcNADLUv4VREI90IYQPYACagnaDwh1ALHaGZAFQkxF9H6AjABGSEbEBQQaDcnc25JSgqCPWvVS1Z8vme37MtA6zbcDnR7tsjiNQJMnTCM12AMGfm3Noq+7zfLZp49YtSqWtgerVVdTwbRyjunTsD4KdY66kZsoHNM5l776I6WBUfxkiTvpMdLXYQlmSiOJ6sSuCZHkKR+SEgooIhsA7o3yXJX3LlJ8BgyFM+F5ekJ3om57sYYwdB9YA5E8D7nZ6DWucfqdatHgMNiX0GHh5VHE0jpQ6xZi5vsJRYFJg4BUSD33fAAEUgLQN5ObtV3WYNLrcYunkJN7AvB9O+tCPJv413RnWnolqL/WnSbh0nA3cq3hSA7bMvciOL7FwWG34AAAAASUVORK5CYII=">\
                                              </span>\
                                              <span class="img_unhide {{if data.config.visible == false}}display-block{{else}}display-none{{/if}}">\
                                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGDSURBVHgB1VLLUQJBEO2e2bW0SixDWCNQM8AIwAjg6EH5RCBEwM+DNzUDiECMAMxgQ6AUS4WZeXavLoUl5Vmnqg/T816/191D9O8Pb0ruN7DvnS8GDkkGAk+jKJrOujz7tYASQ6A6KDRAlDJoqnkQEmYuMpmWMdRbL2TWyIlHmAT44nKxOJ737bG1pqkxH0Qn1pgDkD/wIUy2z16Tbw4yy0IGwt28H7c0t1dHR+5VfWY23aceNzW/W1u2DNmSMXyiTjIHAXRJgac5uXDhqkIuq6oGAcXCuSvrm2IAmmUcbUHVBdwAfC+3BUYicxipgkQayD/A4Ch/D941laNcoyABt42xHU18ImgsA6uoqoa0UILDMG/XxtGNcpS72kKh5m6FdLhYvJ++Xe+kWRvMdbGvAqOXwVY32xJwL+qPz/2o+mONMqCuFCkJqW2tHebrUuLSL6visi7kkcyhsfEfrAZIVNG9yzX9SicAxlp4fhWP1/Ebf2Ku6pw7QsAs3orTTb/wb5wP48rkd2sW1IgAAAAASUVORK5CYII=">\
                                              </span>\
                                            </span>\
                                            <span class="action-item pinning" type="{{if data.config.pinIndex >= 0}}UnPin{{/if}}{{if data.config.pinIndex < 0}}Pin{{/if}}">\
                                              <span class="tooltiptext">\
                                                <span class="unpin sdk-i18n-lang {{if data.config.pinIndex >= 0}}display-block{{else}}display-none{{/if}}" sdk-i18n-key="sa_sdk_unpin">\
                                                {{html langTranslator("sa_sdk_unpin")}}\
                                                </span>\
                                                <span class="pin sdk-i18n-lang {{if data.config.pinIndex < 0}}display-block{{else}}display-none{{/if}}" sdk-i18n-key="sa_sdk_pin">\
                                                {{html langTranslator("sa_sdk_pin")}}\
                                                </span>\
                                              </span>\
                                              <span class="img_unpin {{if data.config.pinIndex >= 0}}display-block{{else}}display-none{{/if}}">\
                                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGFSURBVHgBxVK/S8NAFH53SaugKQHpntp/oBlcBAdxcmsXKS5aJxX7Y3Jw0U6OFaluIl1EBUk3x4KTuLTgKNouQrGINyjV9HJnHxiN/YW6+EFI7uW9777vuwP4gJZ2DoeXmwb8EtT9UAjN+nxDfyL5hJ6RhpYUJS9Ju6ZrKafaj5h6F2yH1BSFJFDJ9b20pJQ4pLcfw+f3l3qR0M4CklxtEFg/E9G7BpQmw7BACKmAlNl+JF3AnW8fZHV215EXN0JmTmQU61qSL3baUeF7BrojRDmQFmCMgb43T2D7XEI+TnL8iEPhkmxiGyp5BQj1yoBJEAVsqjZErP7MzXyc1taOhTE3Qa2pMBRatm0qlJoDLYymWluu1NOyHUEbaAdtte3p3l61ZwZcFokKaZS6dCASoaBkxRXKZnKS1Z/ekIC5vV2nMLJqR6iqWII702iHUGrVHoGNB8FkTRIbeNlwGKXju9MOfAXdddn6Dnv/eddeEuIWAylRdjhPvOz7K/ADIAl4svg/vANVesefO32vSgAAAABJRU5ErkJggg==">\
                                              </span>\
                                              <span class="img_pin {{if data.config.pinIndex < 0}}display-block{{else}}display-none{{/if}}">\
                                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD7SURBVHgBhZB/asJQDMeTZy0dW0eP0N1Aj9ATjJ1A9p8MVnYEvcFgMPxTT6A38Aj2BnqEgojSviYm/oAnvmLg8SD5fpNPgtASyQ8nDdGqrqrsMHnaXPMG2iORl3bDcBkN9+lDAxG8I2IBzGPXFPjEcc4DBhpR3WS7/7CIvy2oCYb7DF1eF4fsWfz8VfVM0JlfEMsTUvmLpXScaZKJPjvGvKlYGqWmK2LBkuX7ku+ji/KS1yMEM9DLRFFUNixTicfbv2DqXZotL3SK8lpre8AArvjGcGVVdsVDY+aee5yv5Ig/lF1SheCB4t05VBznzVp/X+3O8JrTyltoiSM5w31qLIEkiwAAAABJRU5ErkJggg==">\
                                              </span>\
                                            </span>\
                                            <span class="action-item boosting">\
                                              <span class="tooltiptext">{{html langTranslator("sa_sdk_boost")}}</span>\
                                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADCSURBVHgBfY/BCcJAEEVnNiKKrGgHKSElmA7swBxFJEkHYgfRg3jTTtKCHSQdKIIoMTtjNhgI65o5fh5//gMwbhxyJNfl3MyFAW0YKAaBJxnywgp+oeBdFD6VygegxIRrSIYqGyyfbpONVoVXZdcGxnbT6zjM2wUaFj0nrR7Hglh5Nkjf49C/1DOYZmCz1l/MHC3WgU6Rxfm+x22ntYPCZ6Tgp9lmPYnZlZHKGrjTWsOKKUWCnSAop/+sbwnmeoYCBR8N24MPhSbzYAAAAABJRU5ErkJggg==">\
                                            </span>\
                                            <span class="action-item burying {{if data.config.boost == 0}}disabled{{/if}} {{if data.score <= 0}}disabled{{/if}}">\
                                              <span class="tooltiptext">{{html langTranslator("sa_sdk_lower")}}</span>\
                                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADJSURBVHgBdZDRDYIwEIZbEFKDTRiBEVzBSfDRmBRxA11BX3xTJ3AE4ghOgE7ggyaalvbskZCUWP633n253neUC31USm6/h/GdeJKWkDXG5AFQ84jiuGKLT+aDNJiKEEPbwqRQG17o2oUR4itdYw/ftGtggZIgV1LOGGMEJwGY83sX9UEXxqoLeYNwImT51+DCXHwiXZKlnOJlrLW+DVkjFIxCaw3XQet2UqGfXDTzQeswCNN2EsD6tR+demDP2p7RhfzLW+PuOzc/5PRxOXt0QzUAAAAASUVORK5CYII=">\
                                            </span>\
                                          </div>\
                                        {{/if}}\
                                        {{if data.addedResult && data.addedResult == true}}\
                                          <div class="actions-content manually_added_pin">\
                                            <span class="action-item unpin_added_result">\
                                              <span class="tooltiptext sdk-i18n-lang"  sdk-i18n-key="sa_sdk_unpinning_will_remove_the_result">{{html langTranslator("sa_sdk_unpinning_will_remove_the_result")}}</span>\
                                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGFSURBVHgBxVK/S8NAFH53SaugKQHpntp/oBlcBAdxcmsXKS5aJxX7Y3Jw0U6OFaluIl1EBUk3x4KTuLTgKNouQrGINyjV9HJnHxiN/YW6+EFI7uW9777vuwP4gJZ2DoeXmwb8EtT9UAjN+nxDfyL5hJ6RhpYUJS9Ju6ZrKafaj5h6F2yH1BSFJFDJ9b20pJQ4pLcfw+f3l3qR0M4CklxtEFg/E9G7BpQmw7BACKmAlNl+JF3AnW8fZHV215EXN0JmTmQU61qSL3baUeF7BrojRDmQFmCMgb43T2D7XEI+TnL8iEPhkmxiGyp5BQj1yoBJEAVsqjZErP7MzXyc1taOhTE3Qa2pMBRatm0qlJoDLYymWluu1NOyHUEbaAdtte3p3l61ZwZcFokKaZS6dCASoaBkxRXKZnKS1Z/ekIC5vV2nMLJqR6iqWII702iHUGrVHoGNB8FkTRIbeNlwGKXju9MOfAXdddn6Dnv/eddeEuIWAylRdjhPvOz7K/ADIAl4svg/vANVesefO32vSgAAAABJRU5ErkJggg==">\
                                            </span>\
                                          </div>\
                                        {{/if}}\
                                        <div class="title text-truncate one-line-height">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                                        <div class="desc_text text-truncate one-line-height">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                                        <div class="appearences-count count">\
                                          <span class="tooltip-appearnces">\
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADqSURBVHgBTU/BTcNAEJzxnRDiAyVQAukASuALj+APPG0qcFIB+BVFPI4IIp4pAVMBLbgE54eSnIc9FKPs47Q7M7czS+xrFt4uPV0l6ALgGYFG0uI+v31NfJael8VH5ZiteukrajPaSqOdiUBWiUsazsLyzhkQxStgd24fxmljVKwB3zr231H9debJMaTpXrSCuJawdnSfCbO+tr7yKdMWeDyiezLr+iG/mSSreVi2hC97oHRQYRnZnGDTCujsgBb/pc5Rp8f46WxoOMDz8F6SWWHZ8jSbXUiRhquJgzK7CYnib584tRjPA/cLSnRp8KbGJuoAAAAASUVORK5CYII=">\
                                          <span class="tooltip_text sdk-i18n-lang"  sdk-i18n-key="sa_sdk_appearances">{{html langTranslator("sa_sdk_appearances")}}</span>\
                                          </span>\
                                          <span class="count">${data.feedback?.appearances}</span>\
                                        </div>\
                                        <div class="appearences-count count">\
                                        <span class="tooltip-appearnces-clicks">\
                                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEMSURBVHgBnZK/bcJQEMbvniFJmRGSDZINnA2SEijgioConA1iNkgqlKS4IASUwAaMABPgEWgBoeMOyQiZh0F8hU86v9/9+d5DyOivM/gUkRgR4/dqqQUeuWzCgI3go0U4IedLNqmUQI4cXKFC3s/f/74gwEQAwsMdcyHbLUCZ7yLIXIvsDHLmllW0mIXS3dKYGoQGrEWei4isVUaWrNfKmDeyU4+/DdAqbwq8wgVydap8iMBMZx8aqLnpWcg+DSrXtMv4APSPxvykIdnfU4MqcQoy872XwrtIz3SOFv7hntla1V1bG1hNmkRJm/mhgLeR3VdRli9el9rcDQMMIn2JoZa3rol1uIHVFxEttjVMjEnBcNKUAAAAAElFTkSuQmCC">\
                                          <span class="tooltip_text sdk-i18n-lang" sdk-i18n-key="sa_sdk_clicks">{{html langTranslator("sa_sdk_clicks")}}</span>\
                                        </span>\
                                        <span class="count">${data.feedback?.clicks}</span>\
                                        </div>\
                                        {{if !data.addedResult || data.addedResult == false}}\
                                          <div class="appearences-count customize-chips bg-data record-status-pinned" style="display : {{if data.config.pinIndex >= 0}}block{{else}}none{{/if}}">\
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD7SURBVHgBhZB/asJQDMeTZy0dW0eP0N1Aj9ATjJ1A9p8MVnYEvcFgMPxTT6A38Aj2BnqEgojSviYm/oAnvmLg8SD5fpNPgtASyQ8nDdGqrqrsMHnaXPMG2iORl3bDcBkN9+lDAxG8I2IBzGPXFPjEcc4DBhpR3WS7/7CIvy2oCYb7DF1eF4fsWfz8VfVM0JlfEMsTUvmLpXScaZKJPjvGvKlYGqWmK2LBkuX7ku+ji/KS1yMEM9DLRFFUNixTicfbv2DqXZotL3SK8lpre8AArvjGcGVVdsVDY+aee5yv5Ig/lF1SheCB4t05VBznzVp/X+3O8JrTyltoiSM5w31qLIEkiwAAAABJRU5ErkJggg==">\
                                            <span class="count sdk-i18n-lang" sdk-i18n-key="sa_sdk_pinned_caps">{{html langTranslator("sa_sdk_pinned_caps")}}</span>\
                                          </div>\
                                          <div class="appearences-count customize-chips bg-data record-status-hidden" style="display : {{if data.config.visible == false}}block{{else}}none{{/if}}">\
                                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEgSURBVHgB3VLRTcNADLUv4VREI90IYQPYACagnaDwh1ALHaGZAFQkxF9H6AjABGSEbEBQQaDcnc25JSgqCPWvVS1Z8vme37MtA6zbcDnR7tsjiNQJMnTCM12AMGfm3Noq+7zfLZp49YtSqWtgerVVdTwbRyjunTsD4KdY66kZsoHNM5l776I6WBUfxkiTvpMdLXYQlmSiOJ6sSuCZHkKR+SEgooIhsA7o3yXJX3LlJ8BgyFM+F5ekJ3om57sYYwdB9YA5E8D7nZ6DWucfqdatHgMNiX0GHh5VHE0jpQ6xZi5vsJRYFJg4BUSD33fAAEUgLQN5ObtV3WYNLrcYunkJN7AvB9O+tCPJv413RnWnolqL/WnSbh0nA3cq3hSA7bMvciOL7FwWG34AAAAASUVORK5CYII=">\
                                          <span class="count sdk-i18n-lang" sdk-i18n-key="sa_sdk_hidden_caps">{{html langTranslator("sa_sdk_hidden_caps")}}</span>\
                                          </div>\
                                          <div class="appearences-count customize-chips bg-data record-status-boosted {{if data.config.boost > 1}}display-block{{/if}}">\
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADCSURBVHgBfY/BCcJAEEVnNiKKrGgHKSElmA7swBxFJEkHYgfRg3jTTtKCHSQdKIIoMTtjNhgI65o5fh5//gMwbhxyJNfl3MyFAW0YKAaBJxnywgp+oeBdFD6VygegxIRrSIYqGyyfbpONVoVXZdcGxnbT6zjM2wUaFj0nrR7Hglh5Nkjf49C/1DOYZmCz1l/MHC3WgU6Rxfm+x22ntYPCZ6Tgp9lmPYnZlZHKGrjTWsOKKUWCnSAop/+sbwnmeoYCBR8N24MPhSbzYAAAAABJRU5ErkJggg==">\
                                            <span class="count boosted">${data.config.boost}X <span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_boosted_caps">{{html langTranslator("sa_sdk_boosted_caps")}}</span></span>\
                                          </div>\
                                          <div class="appearences-count customize-chips bg-data record-status-lowered {{if data.config.boost < 1}}display-block{{/if}}">\
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADJSURBVHgBdZDRDYIwEIZbEFKDTRiBEVzBSfDRmBRxA11BX3xTJ3AE4ghOgE7ggyaalvbskZCUWP633n253neUC31USm6/h/GdeJKWkDXG5AFQ84jiuGKLT+aDNJiKEEPbwqRQG17o2oUR4itdYw/ftGtggZIgV1LOGGMEJwGY83sX9UEXxqoLeYNwImT51+DCXHwiXZKlnOJlrLW+DVkjFIxCaw3XQet2UqGfXDTzQeswCNN2EsD6tR+demDP2p7RhfzLW+PuOzc/5PRxOXt0QzUAAAAASUVORK5CYII=">\
                                            <span class="count lowered">${data.config.boost}X <span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_lowered_caps">{{html langTranslator("sa_sdk_lowered_caps")}}</span></span>\
                                          </div>\
                                        {{/if}}\
                                        {{if data.addedResult && data.addedResult == true}}\
                                          <div class="appearences-count bg-data">\
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD5SURBVHgBhZAxTgMxEEX/rBeJcnuE2NwgdAhSTBR6lBOsuAl03AI4QaCjIlOt6JIbkCMkXaSs15mJtJKjeBVL1kie9+3nIfQsZi52cAsPP/4TWXXnWV9gCxQElA5ufsdcng3kcE9algHhNQ65FPzAk4oQ3lq001rmP9flYJMhe78qb74p9u0CChcKj2uR5T3zkOBmChYBWB+URGRNoE86ePvnHO3AYNMw2LQa+NsL3RSrjPjxRZuVTeZSb7NXDa7l9yP56RbNl+nYJxvkQ2vG8FGgczV30wPCDMnpRXCAn5q7jVP1tITqJGGwjvHfaqp3EhjxZJFs9Kw9ezRmCkd+ZkUAAAAASUVORK5CYII=">\
                                            <span class="count sdk-i18n-lang" sdk-i18n-key="sa_sdk_pinned_caps">{{html langTranslator("sa_sdk_pinned_caps")}}</span>\
                                          </div>\
                                          <div class="appearences-count bg-data">\
                                            <span class="count sdk-i18n-lang" sdk-i18n-key="sa_sdk_manually_added_caps">{{html langTranslator("sa_sdk_manually_added_caps")}}D</span>\
                                          </div>\
                                        {{/if}}\
                                        {{if data.sys_content_type === "faq"}}\
                                          <div class="tag-ref sdk-i18n-lang" sdk-i18n-key="sa_sdk_faq_response">{{html langTranslator("sa_sdk_faq_response")}}</div>\
                                        {{/if}}\
                                        {{if data.sys_content_type === "web"}}\
                                          <div class="tag-ref sdk-i18n-lang" sdk-i18n-key="sa_sdk_web_response">{{html langTranslator("sa_sdk_web_response")}}</div>\
                                        {{/if}}\
                                        {{if data.sys_content_type === "file"}}\
                                          <div class="tag-ref sdk-i18n-lang" sdk-i18n-key="sa_sdk_file_response">{{html langTranslator("sa_sdk_file_response")}}</div>\
                                        {{/if}}\
                                        {{if data.sys_content_type === "data"}}\
                                          <div class="tag-ref sdk-i18n-lang" sdk-i18n-key="sa_sdk_data_response">{{html langTranslator("sa_sdk_data_response")}}</div>\
                                        {{/if}}\
                                    </div>\
                                  </div>\
                                {{/if}}\
                              {{/if}}\
                              {{if isClickable == false}}\
                                <div class="tile-with-text faqs-wrp-content structured-data-wrp-content">\
                                <div class="tile-heading accordion p-0  {{if data.bestMatch && data.bestMatch == true}} acc-active best-match{{/if}}\" id="1">\
                                   <div title="${data.heading}" class="text-truncate one-line-height" >{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                                      <div class="tile-description defalut-show text-truncate one-line-height">{{html helpers.convertMDtoHTML(data.description, null,null,true)}}</div>\
                                  </div>\
                                  <div class="panel">\
                                      <div class="tile-description">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                                      <div class="divfeedback d-none">\
                                        <span class="yesLike"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtdXAtZ3JheTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ0aHVtYnMtdXAtZ3JheSIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="thumbs-up"></span>\
                                        <span class="noDislike"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT50aHVtYnMtZG93bi1ncmF5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InRodW1icy1kb3duLWdyYXkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA3LjAwMDAwMCkgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTcuMDAwMDAwLCAtNy4wMDAwMDApICIgZmlsbD0iIzRENTc1QyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTEuMTY0LDEzLjMzMyBDMC44ODksMTMuMzMzIDAuNjY3LDEzLjExNSAwLjY2NywxMi44NDYgTDAuNjY3LDcgQzAuNjY3LDYuNzMgMC44ODksNi41MTMgMS4xNjQsNi41MTMgTDMuNDk4LDYuNTEzIEw1LjAyNiwxLjAyNiBDNS4wODYsMC44MTQgNS4yODIsMC42NjYgNS41MDYsMC42NjYgQzYuNjgsMC42NjYgNy42MzIsMS41OTkgNy42MzIsMi43NDggTDcuNjMyLDUuNDUgTDExLjIwNyw1LjQ1IEMxMi41MSw1LjQ1IDEzLjUwNyw2LjU4NyAxMy4zMDgsNy44NDggTDEyLjcyNCwxMS41NjggQzEyLjU2NCwxMi41ODQgMTEuNjcyLDEzLjMzMyAxMC42MjMsMTMuMzMzIEwxLjE2NCwxMy4zMzMgWiBNMy4zOCwxMi4zNTkgTDMuMzgsNy40ODcgTDEuNjYyLDcuNDg3IEwxLjY2MiwxMi4zNTkgTDMuMzgsMTIuMzU5IEwzLjM4LDEyLjM1OSBaIE01Ljg3LDEuNjk5IEw0LjM3Niw3LjA2NiBMNC4zNzYsMTIuMzYgTDEwLjYyMywxMi4zNiBDMTEuMTgxLDEyLjM2IDExLjY1NSwxMS45NjEgMTEuNzQsMTEuNDIxIEwxMi4zMjUsNy43MDEgQzEyLjQzLDcuMDMgMTEuOSw2LjQyNSAxMS4yMDcsNi40MjUgTDcuMTM1LDYuNDI1IEM2Ljg2LDYuNDI1IDYuNjM3LDYuMjA3IDYuNjM3LDUuOTM4IEw2LjYzNywyLjc0OCBDNi42MzcsMi4yNjEgNi4zMTcsMS44NDggNS44NywxLjcgTDUuODcsMS42OTkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="thumbs-down"></span>\
                                      </div>\
                                  </div>\
                                </div>\
                              {{/if}}\
                          </li>\
                        {{/each}}\
                        <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
                            <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
                      </div>\
                      </ul>\
                      <!-- <div class="moreStructredData custom-show-more-container {{if isFullResults == true}} {{if selectedFacet != appearanceType}} display-block{{/if}}{{/if}}">Show All</div> -->\
                    {{/if}}\
                </div>\
              </div>\
              {{/if}}\
            </script>',
          "layoutType": "custom",
          "templateType": "custom"
        },
        {
          "id": 2,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-1-{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-result-group mb-15 {{if textAlignment=="center"}}text-center{{/if}}">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-result-item {{if textAlignment=="center"}}text-center{{/if}} click-to-navigate-url faqs-shadow isClickable dataheading" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
              {{/if}}\
              {{if isClickable == false}}\
              <div class="{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-result-item {{if textAlignment=="center"}}text-center{{/if}} click-to-navigate-url faqs-shadow dataheading" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
              {{/if}}\
               {{/each}}\
               <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
           </div>\
              </div>\
              {{/if}}\
            </script>',
          "layoutType": "l1",
          "templateType": "list"
        },
        {
          "id": 3,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-2-{{if listType=="classic"}}classic{{else}}plain{{/if}}-list{{if isClickable == false}}-collapse{{/if}}-result mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-item-result click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                  <span class="truncate-text-info">\
                    <span>{{html helpers.convertMDtoHTML(data.description)}}</span>\
                  </span>\
              </div>\
              {{/if}}\
              {{if isClickable == false}}\
              <div class="template-2-{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-collapse mb-15 click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
              <div class="collapse-item-list accordion" id="1">{{html helpers.convertMDtoHTML(data.description)}}</div>\
            </div>\
              {{/if}}\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
              <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
          </div>\
            {{/if}}\
              </script>',
          "layoutType": "l2",
          "templateType": "list"
        },
        {
          "id": 4,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-3-{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-result mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-item-result click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
              <div class="heading-text" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
              <div class="text-desc two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
              </div>\
              {{/if}}\
              {{if isClickable == false}}\
              <div class="template-3-{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-collapse mb-15 click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                <div class="collapse-item-list accordion" id="1">\
                <div class="text-truncate one-line-height dataheading">{{html helpers.convertMDtoHTML(data.heading)}}</div><div class="text-desc-">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                </div>\
              </div>\
              {{/if}}\
              {{/each}}\
            <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
            <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
           </div>\
            {{/if}}\
              </script>',
          "layoutType": "l3",
          "templateType": "list"
        },
        {
          "id": 5,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
               <div class="template-4-{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-result{{if isClickable==false}}-collapse{{/if}} {{if isClickable==false}}template-4-{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-collapse-result{{/if}} mb-15">\
               {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
               {{if isClickable == true}}\
                <div class="{{if listType=="classic"}}classic{{else}}plain{{/if}}-list-item-result click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                    <div class="img-block">\
                    <img src="${data.img}">\
                    </div>\
                    <div class="content_sec">\
                      <div class="heading text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                      <div class="text_desc single-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                    </div>\
                    </div>\
                    {{/if}}\
                    {{if isClickable == false}}\
                    <div class="collapse-item-list-parent click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                    <div class="collapse-item-list accordion" id="1">\
                    <div class="text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div><div class="text-description defalut-show text-truncate one-line-height">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                    </div>\
                    <div class="panel">\
                      <div class="content_sec">\
                      <div class="img-block">\
                      <img src="${data.img}">\
                      </div>\
                      <div class="text-desc four-line-description">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                  </div>\
                </div>\
                </div>\
                    {{/if}}\
                  {{/each}}\
                  <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
                  <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
              </div>\
            {{/if}}\
              </script>',
          "layoutType": "l4",
          "templateType": "list"
        },
        {
          "id": 6,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
               <div class="template-6-classic-list mb-15">\
               {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
               <div class="title-main text-trucate" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                <div class="img-with-text">\
               <div class="img-block">\
               <img src="${data.img}">\
             </div>\
               <div class="info-text two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                </div>\
                  {{/each}}\
                  <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
                  <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
              </div>\
              </div>\
            {{/if}}\
              </script>',
          "layoutType": "l6",
          "templateType": "list"
        },
        {
          "id": 7,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-2-grid-list mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="grid-data-item click-to-navigate-urlfaqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}"  href="${data.url}" target="_blank">\
                <div class="title-item-bold {{if textAlignment=="center"}}text-center{{/if}}" ><div class="text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div></div>\
              </div>\
              {{/if}}\
              {{if isClickable == false}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
              <div class="title-item-bold {{if textAlignment=="center"}}text-center{{/if}}"><div class="text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div></div>\
            </div>\
              {{/if}}\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
            </div>\
            {{/if}}\
              </script>',
          "layoutType": "l1",
          "templateType": "grid"
        },
        {
          "id": 8,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-2-grid-list mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}"  href="${data.url}" target="_blank">\
                <div class="title-item {{if textAlignment=="center"}}text-center{{/if}}" ><div class="two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div></div>\
              </div>\
              {{/if}}\
              {{if isClickable == false}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
              <div class="title-item {{if textAlignment=="center"}}text-center{{/if}}"><div class="two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div></div>\
            </div>\
              {{/if}}\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
            </div>\
            {{/if}}\
              </script>',
          "layoutType": "l2",
          "templateType": "grid"
        },
        {
          "id": 9,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-3-grid-list mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                  <div class="heading-text text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                  <div class="title-item two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                </div>\
              </div>\
              {{/if}}\
              {{if isClickable == false}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                  <div class="heading-text text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                  <div class="title-item two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                </div>\
              </div>\
              {{/if}}\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
            </div>\
            {{/if}}\
              </script>',
          "layoutType": "l3",
          "templateType": "grid"
        },
        {
          "id": 10,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-4-grid-list mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                <div class="inner-content-list">\
                  <div class="image-with-title">\
                    <div class="img-block">\
                     <img src="${data.img}">\
                    </div>\
                    <div class="info-title two-line-heading" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                    </div>\
                    <div class="title-item two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                  </div>\
                </div>\
                {{/if}}\
                {{if isClickable == false}}\
                <div class="grid-data-item click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                <div class="inner-content-list">\
                  <div class="image-with-title">\
                    <div class="img-block">\
                     <img src=${data.img}>\
                    </div>\
                    <div class="info-title two-line-heading" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                    </div>\
                    <div class="title-item two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                  </div>\
                </div>\
                {{/if}}\
                {{/each}}\
                <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
              </div>\
              {{/if}}\
              </script>',
          "layoutType": "l4",
          "templateType": "grid"
        },
        {
          "id": 11,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-5-grid-list mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                <div class="inner-content-list ">\
                  <img src="${data.img}">\
                </div>\
              </div>\
              {{/if}}\
              {{if isClickable == false}}\
              <div class="grid-data-item click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                <div class="inner-content-list">\
                   <img src="${data.img}">\
                </div>\
              </div>\
              {{/if}}\
                {{/each}}\
                <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
              </div>\
              {{/if}}\
              </script>',
          "layoutType": "l5",
          "templateType": "grid"
        },
        {
          "id": 12,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-6-grid-list">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              <div class="grid-data-item faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                  <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                      <div class="heading-main text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                      {{each(key, res) [0,1,2]}}\
                      <div class="image-with-text">\
                       <div class="img-block">\
                          <img src="${data.img}" />\
                       </div>\
                      <div class="image-info two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                      </div>\
                      {{/each}}\
                  <!--<div class="info-text-bottom">test</div>-->\
              </div>\
              </div>\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
                  </div>\
           </div>\
           {{/if}}\
              </script>',
          "layoutType": "l6",
          "templateType": "grid"
        },
        {
          "id": 13,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-7-grid-list mb-15 " >\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
                  <div class="grid-data-item  click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
              {{else}}\
                <div class="grid-data-item  click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
              {{/if}}\
                    <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                      <div class="main-img-block">\
                        <img src="${data.img}">\
                      </div>\
                      <div class="heading- text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                      <div class="desc-text-info two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                    </div>\
                  </div>\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
              </div>\
              {{/if}}\
              </script>',
          "layoutType": "l7",
          "templateType": "grid"
        },
        {
          "id": 14,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-9-grid-list mb-15 ">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
                <div class="grid-data-item  click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
              {{else}}\
                <div class="grid-data-item  click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
              {{/if}}\
                    <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                      <div class="main-img-block">\
                        <img src="${data.img}">\
                      </div>\
                      <!-- <div class="heading- text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>-->\
                      <div class="desc-text-info two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                    </div>\
                  </div>\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
              </div>\
              {{/if}}\
              </script>',
          "layoutType": "l8",
          "templateType": "grid"
        },
        {
          "id": 15,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-9-grid-list mb-15">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
                <div class="grid-data-item  click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
              {{else}}\
                <div class="grid-data-item click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
              {{/if}}\
                    <div class="inner-content-list ">\
                      <div class="main-img-block">\
                         <img src="${data.img}">\
                      </div>\
                      <div class="heading- text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                      <div class="desc-text-info  two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                      <div class="price-count" {{if data && !data.price}}display-none{{/if}}>${data.price}</div>\
                    </div>\
                  </div>\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
              </div>\
              {{/if}}\
              </script>',
          "layoutType": "l9",
          "templateType": "grid"
        },
        {
          "id": 16,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
                <div class="template-2-carousel-list mb-15 {{if textAlignment=="center"}}text-center{{/if}}">\
                <div class="carousel">\
                {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
                {{if isClickable == true}}\
                    <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                    {{else}}\
                    <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}"">\
                    {{/if}}\
                      <div class="text-template {{if textAlignment=="center"}}text-center{{/if}}" title="${data.heading}"><div class="text-truncate one-line-height">{{html helpers.convertMDtoHTML(data.heading)}}</div></div>\
                    </div>\
                  {{/each}}\
                  </div>\
                </div>\
                {{/if}}\
              </script>',
          "layoutType": "l1",
          "templateType": "carousel"
        },
        {
          "id": 17,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-2-carousel-list mb-15 {{if textAlignment=="center"}}text-center{{/if}}">\
              <div class="carousel">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
                  <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                  {{else}}\
                  <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                  {{/if}}\
                  <div class="text-template {{if textAlignment=="center"}}text-center{{/if}}" ><div class="two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div></div>\
                  </div>\
                {{/each}}\
                </div>\
              </div>\
              {{/if}}\
              </script>',
          "layoutType": "l2",
          "templateType": "carousel"
        },
        {
          "id": 18,
          "template": '<script type="text/x-jqury-tmpl">\
                {{if structuredData.length}}\
                <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
                <div class="template-3-carousel-list mb-15 {{if textAlignment=="center"}}text-center{{/if}}">\
                <div class="carousel">\
                {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
                {{if isClickable == true}}\
                <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                {{else}}\
                <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                {{/if}}\
                        <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                            <div class="heading-text text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                            <div class="title-item two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                        </div>\
                    </div>\
                    {{/each}}\
                </div>\
            </div>\
            {{/if}}\
                </script>',
          "layoutType": "l3",
          "templateType": "carousel"
        },
        {
          "id": 19,
          "template": '<script type="text/x-jqury-tmpl">\
                {{if structuredData.length}}\
                <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
                <div class="template-4-carousel-list mb-15">\
                <div class="carousel">\
                    {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
                    {{if isClickable == true}}\
                    <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                        {{else}}\
                        <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                            {{/if}}\
                            <div class="inner-content-list">\
                                <div class="image-with-title">\
                                    <div class="img-block">\
                                        <img src="${data.img}">\
                                    </div>\
                                    <div class="info-title two-line-heading" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                                </div>\
                                <div class="title-item two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                            </div>\
                        </div>\
                        {{/each}}\
                    </div>\
            </div>\
            </div>\
                  {{/if}}\
                </script>',
          "layoutType": "l4",
          "templateType": "carousel"
        },
        {
          "id": 20,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-5-carousel-list mb-15">\
              <div class="carousel">\
                  {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
                  {{if isClickable == true}}\
                  <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                      {{else}}\
                      <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                          {{/if}}\
                          <div class="inner-content-list">\
                              <img src="${data.img}">\
                          </div>\
                      </div>\
                      {{/each}}\
                  </div>\
              </div>\
          </div>\
              {{/if}}\
              </script>',
          "layoutType": "l5",
          "templateType": "carousel"
        },
        {
          "id": 21,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-6-carousel-list mb-15 {{if textAlignment=="center"}}text-center{{/if}}">\
              <div class="carousel">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                  {{else}}\
                  <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                      {{/if}}\
                  <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                    <div class="title-main text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                    {{each(key, res) [0,1,2]}}\
                    <div class="img-with-text">\
                      <div class="img-block">\
                      <img src="${data.img}">\
                      </div>\
                      <div class="info-text two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                    </div>\
                    {{/each}}\
                  </div>\
                </div>\
                {{/each}}\
              </div>\
            </div>\
              {{/if}}\
              </script>',
          "layoutType": "l6",
          "templateType": "carousel"
        },
        {
          "id": 22,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-7-carousel-list mb-15 {{if textAlignment=="center"}}text-center{{/if}}">\
              <div class="carousel">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                  {{else}}\
                  <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                      {{/if}}\
                  <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                    <div class="main-img-block">\
                    <img src="${data.img}">\
                    </div>\
                    <div class="heading- text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                    <div class="desc-text-info four-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                  </div>\
                </div>\
                {{/each}}\
              </div>\
            </div>\
              {{/if}}\
              </script>',
          "layoutType": "l7",
          "templateType": "carousel"
        },
        {
          "id": 23,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-7-carousel-list mb-15 {{if textAlignment=="center"}}text-center{{/if}}">\
              <div class="carousel">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                  {{else}}\
                  <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                      {{/if}}\
                  <div class="inner-content-list {{if textAlignment=="center"}}text-center{{/if}}">\
                    <div class="main-img-block">\
                    <img src="${data.img}">\
                    </div>\
                    {{each(key, res) [0,1]}}\
                    <div class="desc-text-info two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                    {{/each}}\
                  </div>\
                </div>\
                {{/each}}\
              </div>\
            </div>\
              {{/if}}\
              </script>',
          "layoutType": "l8",
          "templateType": "carousel"
        },
        {
          "id": 24,
          "template": '<script type="text/x-jqury-tmpl">\
              {{if structuredData.length}}\
              <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
              <div class="template-7-carousel-list mb-15">\
              <div class="carousel">\
              {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
              {{if isClickable == true}}\
              <div class="slide click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                  {{else}}\
                  <div class="slide click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                      {{/if}}\
                  <div class="inner-content-list">\
                    <div class="main-img-block">\
                    <img src="${data.img}">\
                    </div>\
                    <div class="heading- text-truncate one-line-height" title="${data.heading}">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                    <div class="desc-text-info two-line-description" title="${data.description}">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                  </div>\
                </div>\
                {{/each}}\
              </div>\
            </div>\
              {{/if}}\
              </script>',
          "layoutType": "l9",
          "templateType": "carousel"
        },
        {
          "id": 25,
          "template": '<script type="text/x-jqury-tmpl">\
          <div class="siemens-template">\
          <div class="title-text-heading {{if renderTitle}}display-block{{else}}display-none{{/if}}">${titleName}</div>\
          {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
            <div class="siemens-list-template">\
              <div class="icon-with-title">\
                <img src="${data.icon}" class="siemens-icon-blue">\
                <span class="name-title">{{html helpers.convertMDtoHTML(data.heading)}}</span>\
                {{if isClickable == true}}\
                <span class="redirecting-link click-to-navigate-url faqs-shadow isClickable" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}" href="${data.url}" target="_blank">\
                  <img class="siemens-link-icon" src="assets/web-kore-sdk/demo/images/externallink-gray.svg">\
                </span>\
                {{/if}}\
              </div>\
              <div class="info-test-content four-line-description">{{html helpers.convertMDtoHTML(data.description)}}</div>\
              <div class="author-updates-sec">\
                <div class="author-names">\
                  <span class="author-title">Author:</span>\
                  <span class="author_name">{{html helpers.convertMDtoHTML(data.scm_author)}}</span>\
                </div>\
                <div class="updates-on">\
                  <span class="title">Updated on:</span>\
                  <span class="time-updates">{{html helpers.convertMDtoHTML(data.scm_createdAt)}}</span>\
                </div>\
              </div>\
              <div class="button-chips">\
              {{each(key, chip) data.chips}}\
              <button class="btn-chip" style="color:${chip.color};background:${chip.background};border:1px solid ${chip.color}">{{html helpers.convertMDtoHTML(chip.name)}}</button>\
              {{/each}}\
              </div>\
              </div>\
              {{/each}}\
              <div class="show-more-list {{if doc_count==0 || doc_count<6 || isLiveSearch || isSearch}}display-none{{/if}}" groupName="${groupName}" templateName="${templateName}" pageNumber="${pageNumber}" fieldName="${fieldName}">\
               <div class="searchassist-show-more-button"><span class="sdk-i18n-lang" sdk-i18n-key="sa_sdk_show_more">{{html langTranslator("sa_sdk_show_more")}}</span> <img src="{{if devMode}}assets/web-kore-sdk/demo/{{/if}}images/show_more.png" height="6" width="10" /></div>\
            </div>\
              </div>\
          </script>',
          "layoutType": "l10",
          "templateType": "list"
        },
        {
          "id": 26,
          'template': '<script type="text/x-jqury-tmpl">\
          <div class="cosmetics-grid-template2">\
                <div class="arrivals-grids-template">\
                {{each(key, data) structuredData.slice(0, maxSearchResultsAllowed)}}\
                  <div class="slide-gride cosmetics-product-view" style="width:100%">\
                    <div class="inner-content-data click-to-navigate-url faqs-shadow" contentId="${data.contentId}" contentType="${data.sys_content_type}" id="${key}">\
                      <div class="img-block">\
                        <img class="banner-img" src="${data.ecommerce_image}">\
                      </div>\
                      <div class="content-block">\
                        <div class="type-tag {{if data.ecommerce_bestseller == true}} display-inline-block{{else}}display-none{{/if}}">Best Seller</div>\
                        <div class="type-tag offer">${data.ecommerce_percentage_offer}</div>\
                        <div class="title">{{html helpers.convertMDtoHTML(data.heading)}}</div>\
                        <div class="text-desc">{{html helpers.convertMDtoHTML(data.description)}}</div>\
                        <div class="price-and-rating">\
                        <div>\
                        <div class="amount-info">${data.ecommerce_price}</div>\
                        <div class="amount-info strike-text">${data.ecommerce_original_price}</div>\
                        </div>\
                        <div class="rating-flex">{{each(key, review) data.ecommerce_ratingArr}}\{{if review == "fill"}}\
                        <div class="rating-star-pd"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxMCAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuMzUwMjc4IDMuNTI0TDMuMzk1ODkgMy4xOTMwNkw0LjYzOTgyIDAuMjM5OTE0QzQuNzc0NTYgLTAuMDc5OTcxNCA1LjIyNzg1IC0wLjA3OTk3MTQgNS4zNjI1OSAwLjIzOTkxNEw2LjYwNjUyIDMuMTkzMDZMOS42NDk3NiAzLjUyNEM5Ljk4MjMgMy41NjAxNiAxMC4xMTk4IDMuOTY5MzMgOS44NzY1NyA0LjE5ODk3TDcuNTg2ODcgNi4zNjA4TDguMjMxNzkgOS41MzAyNkM4LjMwMDA0IDkuODY1NjkgNy45MzU4NSAxMC4xMjE0IDcuNjQzNTIgOS45NDMzNUw1LjAwMTIxIDguMzMzNzRMMi4zNTYzNiA5Ljk0MzQ0QzIuMDYzOSAxMC4xMjE0IDEuNjk5NzcgOS44NjU0NCAxLjc2ODI4IDkuNTNMMi40MTU1NSA2LjM2MDhMMC4xMjM1ODIgNC4xOTkxMUMtMC4xMTk4NDQgMy45Njk1MyAwLjAxNzYyMDkgMy41NjAxNCAwLjM1MDI3OCAzLjUyNFoiIGZpbGw9IiNGNUIyNEQiLz4KPC9zdmc+Cg==" /></div>\
                        {{else}}\
                        <div class="rating-star-pd"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMzYyNTkgMC4yMzk5MjNDNS4yMjc4MiAtMC4wNzk5NDAzIDQuNzc0NDggLTAuMDc5OTg3MiA0LjYzOTY3IDAuMjM5ODU5QzQuMTUzNjkgMS4zOTI5MyAzLjM5NTc2IDMuMTkyNzEgMy4zOTU3NiAzLjE5MjcxTDAuMzUwNjAxIDMuNTIzNTJDMC4wMTc2Mzc5IDMuNTU5NjkgLTAuMTE5OTU0IDMuOTY5MzUgMC4xMjM2OTYgNC4xOTkxTDIuNDE1MzMgNi4zNTk5N0wxLjc2ODE2IDkuNTI3OTZDMS42OTk1OSA5Ljg2MzYzIDIuMDY0MDUgMTAuMTE5OCAyLjM1Njc4IDkuOTQxNjhMNS4wMDEyIDguMzMyNjJMNy42NDMwOSA5Ljk0MTU5QzcuOTM1NyAxMC4xMTk4IDguMzAwMjIgOS44NjM4OCA4LjIzMTkgOS41MjgyMkw3LjU4NzA4IDYuMzU5OTdMOS44NzY0NSA0LjE5ODk2QzEwLjExOTkgMy45NjkxNiA5Ljk4MjI4IDMuNTU5NzEgOS42NDk0MyAzLjUyMzUyTDYuNjA2NjUgMy4xOTI3MUw1LjM2MjU5IDAuMjM5OTIzWk01LjAwMTIgMS40MDA3OEw2LjA2NDM1IDMuOTIxNzNMOC43MjM3NiA0LjIwOTY2TDYuNzMyMjcgNi4wOTA0Mkw3LjI4Mzc2IDguODA0MzRMNS4wMDEyIDcuNDEzNjhMMi43MTU1OSA4LjgwNDM0TDMuMjcwMTQgNi4wOTA0MkwxLjI4MTcxIDQuMjA5NjZMMy45MzgwNiAzLjkyMTczTDUuMDAxMiAxLjQwMDc4WiIgZmlsbD0iI0Y1QjI0RCIvPgo8L3N2Zz4K" /></div>\
                        {{/if}}\
                        {{/each}}\</div>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                {{/each}}\
                </div>\
                </div>\
          </script>',
          "layoutType": "l11",
          "templateType": "list"
        },
        {
          "id": 27,
          "template": '<script type="text/x-jqury-tmpl">\
          <div class="banking-demo-list">\
              <div class="banking-list-template">\
                <div class="title-heading-banking {{if data.subtitle}}display-block{{else}}display-none{{/if}}">${data.subtitle}</div>\
                <div class="banking-carousel-template-data">\
                  <div class="carousel bankCarouselId${key+1}">\
                      <div class="slide">\
                        <div class="inner-content-list">\
                          <div class="img-block-with-text">\
                              <div class="img-block">\
                                  <img src="">\
                              </div>\
                              <div class="text-content">\
                                  <div class="main-heading text-truncate">Luxor Hotel & Casino</div>\
                                  <div class="stars">\
                                    <span>4.5</span>\
                                    <img src="images/banking/star-fill.svg">\
                                    <img src="images/banking/star-fill.svg">\
                                    <img src="images/banking/star-fill.svg">\
                                    <img src="images/banking/star-fill.svg">\
                                    <img src="images/banking/star-unfil.svg">\
                                  </div>\
                                  <div class="info-content two-line-description">Significant reduce time and costs with the U.S Bank purchasing card, a fast, flexible purchasing tool, which offers you an.</div>\
                              </div>\
                          </div>\
                          <div class="chips-data">\
                            <div class="chip-name">25% off</div>\
                            <div class="chip-name">Complimentary meals</div>\
                            <div class="chip-name">No chargeable Reschedule</div>\
                            <div class="chip-name">3x Reward points</div>\
                          </div>\
                        </div>\
                    </div>\
                </div>\
              </div>\
              </div>\
            </div>\
          </script>',
          "layoutType": "l12",
          "templateType": "list"
        }
      ]
    }
    return searchTemplates;
  }
  /* proposeTimesTemplateBindEvents ends here */
  window.searchTemplate = searchTemplate;
})($);