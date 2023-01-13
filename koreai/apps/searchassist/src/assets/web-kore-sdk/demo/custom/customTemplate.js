(function($){
	function customTemplate(data,chatInitialize) {
		this.cfg = data;
		this.chatInitialize=chatInitialize;
		this.helpers = null;
		this.extension = null;
	}
	
	/**
	 * purpose: Function to render bot message for a given custom template
	 * input  : Bot Message
	 * output : Custom template HTML
	 */
	customTemplate.prototype.renderMessage = function (msgData) {
		var messageHtml = '';
		var extension = '';
		var _extractedFileName = '';
		function strSplit(str) {
			return (str.split('.'));
		}
		if (msgData.message && msgData.message[0] && msgData.message[0].cInfo && msgData.message[0].cInfo.attachments) {
			extension = strSplit(msgData.message[0].cInfo.attachments[0].fileName);
		}
		if (msgData.message && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.url) {
			extension = strSplit(msgData.message[0].component.payload.url);
			_extractedFileName = msgData.message[0].component.payload.url.replace(/^.*[\\\/]/, '');
		}
		if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "dropdown_template") {
			messageHtml = $(this.getChatTemplate("dropdown_template")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindEvents(messageHtml);
		} else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "multi_select") {
			messageHtml = $(this.getChatTemplate("checkBoxesTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
		} else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "like_dislike") {
			messageHtml = $(this.getChatTemplate("likeDislikeTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "form_template") {
			messageHtml = $(this.getChatTemplate("formTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindEvents(messageHtml);
		    if(msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.fromHistory){
		        $(messageHtml).find(".formMainComponent form").addClass("hide");
		    }
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "advanced_multi_select") {
			messageHtml = $(this.getChatTemplate("advancedMultiSelect")).tmpl({
				'msgData': msgData,
				 'helpers': this.helpers,
				'extension': this.extension
			});
			addBottomSlider();
			this.bindEvents(messageHtml);
		} else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "tableList") {
			messageHtml = $(this.getChatTemplate("tableListTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindEvents(messageHtml);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "listView") {
			messageHtml = $(this.getChatTemplate("templatelistView")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindEvents(messageHtml);
			$(messageHtml).data(msgData);
			if(msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.fromHistory){
				$(messageHtml).css({"pointer-events":"none"});
			}
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "piechart") {
			messageHtml = $(this.getChatBotTemplate("pieChartTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindPieChartEvents(messageHtml, msgData);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "table") {
			messageHtml = $(this.getChatBotTemplate("tableChartTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindTableChartEvents(messageHtml, msgData);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "mini_table") {
			if (msgData.message[0].component.payload.layout == "horizontal") {
				messageHtml = $(this.getChatBotTemplate("miniTableHorizontalTemplate")).tmpl({
					'msgData': msgData,
					'helpers': this.helpers,
					'extension': this.extension
				});
				this.bindMiniTableChartEvents(messageHtml, msgData);
			}
			else {
				messageHtml = $(this.getChatBotTemplate("miniTableChartTemplate")).tmpl({
					'msgData': msgData,
					'helpers': this.helpers,
					'extension': this.extension
				});
			}
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "barchart") {
			messageHtml = $(this.getChatBotTemplate("barchartTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindBarChartEvents(messageHtml, msgData);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "linechart") {
			messageHtml = $(this.getChatBotTemplate("linechartTemplate")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
			this.bindLineChartEvents(messageHtml, msgData);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && (msgData.message[0].component.type == "image" || msgData.message[0].component.type == "audio" || msgData.message[0].component.type == "video" || msgData.message[0].component.type == "link")) {
			messageHtml = $(this.getChatBotTemplate("templateAttachment")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension,
				'extractedFileName': _extractedFileName
			});
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && (msgData.message[0].component.type == "message")){
			messageHtml = $(this.getChatBotTemplate("message")).tmpl({
				'msgData': msgData,
				'helpers': this.helpers,
				'extension': this.extension
			});
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "button") {
			messageHtml = this.getButtonTemplate(msgData, this.helpers);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "quick_replies") {
			messageHtml = this.getQuickReplyTemplate(msgData, this.helpers);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "listView") {
			messageHtml = this.getListViewTemplate(msgData, this.helpers);
		}
		else if (msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "carousel") {
			messageHtml = this.getCarouselTemplate(msgData, this.helpers);
		}
		else if(msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "advancedListTemplate"){
			messageHtml = $(this.getChatTemplate("advancedListTemplate")).tmpl({
				'msgData': msgData,
				'tempdata':msgData.message[0].component.payload,
				'dataItems': msgData.message[0].component.payload.elements || {},
				'viewmore': null,
				 'helpers': this.helpers,
				'extension': this.extension
			});
			 this.advancedListTemplateEvents(messageHtml,msgData);
			 $(messageHtml).data(msgData);
		}
		else if(msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "cardTemplate"){
			messageHtml = $(this.getChatTemplate("cardTemplate")).tmpl({
				'msgData': msgData,
				'viewmore': null,
				 'helpers': this.helpers,
				'extension': this.extension
			});
			  this.cardTemplateEvents(messageHtml,msgData);
			 $(messageHtml).data(msgData);
		}
		else if(msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.template_type == "proposeTimes"){
			messageHtml = $(this.getChatTemplate("proposeTimes")).tmpl({
				'msgData': msgData,
				 'helpers': this.helpers,
				'extension': this.extension
			});
			  this.proposeTimesTemplateBindEvents(messageHtml,msgData);
			 $(messageHtml).data(msgData);
		}
		if(msgData &&  msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.sliderView && !msgData.message[0].component.payload.fromHistory){
			bottomSliderAction('show',messageHtml);
		}else {
			return messageHtml;
		}
		return messageHtml;
	
		return "";
	}; // end of renderMessage method

	customTemplate.prototype.getListViewTemplate = function (messageData, helpers) {
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
			var template = $(listT).tmpl({
			  'msgData': messageData,
			  'helpers': helpers || this.helpers,
			  'extension': {}
			});
		return template;
	  }
	customTemplate.prototype.getCarouselTemplate = function (messageData, helpers) {
		var carouselTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
					  {{if msgData.message}} \
						<div class="messageBubble">\
						  <li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
							  {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
							  {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
							  {{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
								  <span>{{html convertMDtoHTMLForCarousel(msgData.message[0].component.payload.text, "bot")}}</span>\
							  </div>{{/if}}\
							  <div class="carousel" id="carousel-one-by-one">\
								  {{each(key, msgItem) msgData.message[0].component.payload.elements}} \
									  <div class="slide">\
										  {{if msgItem.image_url}} \
											  <div class="carouselImageContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
												  <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
											  </div> \
										  {{/if}} \
										  <div class="carouselTitleBox"> \
											  <p class="carouselTitle">{{if msgData.type === "bot_response"}} {{html convertMDtoHTMLForCarousel(msgItem.title, "bot")}} {{else}} {{html convertMDtoHTMLForCarousel(msgItem.title, "user")}} {{/if}}</p> \
											  {{if msgItem.subtitle}}<p class="carouselDescription">{{if msgData.type === "bot_response"}} {{html convertMDtoHTMLForCarousel(msgItem.subtitle, "bot")}} {{else}} {{html convertMDtoHTMLForCarousel(msgItem.subtitle, "user")}} {{/if}}</p>{{/if}} \
											  {{if msgItem.default_action && msgItem.default_action.type === "web_url"}}<div class="listItemPath carouselDefaultAction" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
											  {{if msgItem.buttons}} \
												  {{each(key, msgBtn) msgItem.buttons}} \
													  <div {{if msgBtn.payload}}value="${msgBtn.payload}"{{/if}} {{if msgBtn.url}}url="${msgBtn.url}"{{/if}} class="listItemPath carouselButton" data-value="${msgBtn.value}" type="${msgBtn.type}">\
														  {{html convertMDtoHTMLForCarousel(msgBtn.title, "bot")}}\
													  </div> \
												  {{/each}} \
											  {{/if}} \
										  </div>\
									  </div>\
								  {{/each}} \
							  </div>\
						  </li> \
						</div>\
					  {{/if}}\
				  </script>';
		var template = $(carouselTemplate).tmpl({
			'msgData': messageData,
			'helpers': helpers || this.helpers,
			'extension': {}
		});
		var _self = this;
		setTimeout(function () {
			$('.carousel:last').addClass("carousel" + carouselTemplateCount);
			var count = $(".carousel" + carouselTemplateCount).children().length;
			if (count > 1) {
				var carouselOneByOne = new PureJSCarousel({
					carousel: '.carousel' + carouselTemplateCount,
					slide: '.slide',
					oneByOne: true,
					jq: $,
				});
				$('.carousel' + carouselTemplateCount).parent().show();
				// $('.carousel' + carouselTemplateCount).attr('style', 'height: inherit !important');
				carouselEles.push(carouselOneByOne);
			}
			//window.dispatchEvent(new Event('resize'));
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent('resize', true, false);
			window.dispatchEvent(evt);
			carouselTemplateCount += 1;

			$(template).off('click', '.carouselButton').on('click', '.carouselButton', function (event) {
				event.preventDefault();
				event.stopPropagation();
				var type = $(this).attr('type');
				if (type) {
					type = type.toLowerCase();
				}
				if (type == "postback" || type == "text") {
					var _innerText = $(this).attr('value').trim();
					var displayMessage = ($(this)[0] && $(this)[0].innerText) ? $(this)[0].innerText.trim() : "" || ($(this) && $(this).attr('data-value')) ? $(this).attr('data-value').trim() : "";
					var eData = {
						payload: _innerText,
						utterence: _innerText,
						title: displayMessage,
						msgData: displayMessage
					};
					var payloadData = $(this).attr('actionObj');
					if (payloadData) {
						eData.payloadData = payloadData;
					}
					_self.triggerEvent('onPostback', eData);
				} else if (type == "url" || type == "web_url") {
					var a_link = $(this).attr('url');
					if (a_link.indexOf("http:") < 0 && a_link.indexOf("https:") < 0) {
						a_link = "http:////" + a_link;
					}
					var _tempWin = window.open(a_link, "_blank");
				}
			})
		});
		return template;
	}
	customTemplate.prototype.getButtonTemplate = function (messageData, helpers) {
		var _self = this;
		var buttonTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
								{{if msgData.message}} \
								  <div class="messageBubble">\
									<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
									  <div class="buttonTmplContent"> \
										{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
										{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
										<ul class="buttonTmplContentBox">\
										  <li class="buttonTmplContentHeading"> \
											{{if msgData.type === "bot_response"}} {{html convertMDtoHTMLForCarousel(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html convertMDtoHTMLForCarousel(msgData.message[0].component.payload.text, "user")}} {{/if}} \
											  {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
											  <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
											{{/if}} \
										  </li>\
										  {{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
											<a href="" style="text-decoration: none;">\
											  <li {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}"{{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
												{{html convertMDtoHTMLForCarousel(msgItem.title, "bot")}}\
											  </li> \
											</a> \
										  {{/each}} \
										</ul>\
									  </div>\
									</li> \
								  </div>\
								{{/if}} \
							  </script>';  
		var template = $(buttonTemplate).tmpl({
		  'msgData': messageData,
		  'helpers': helpers || this.helpers,
		  'extension': {}
		});
		$(template).off('click', '.buttonTmplContentBox li,.buttonTmplContentBox a li').on('click', '.buttonTmplContentBox li,.buttonTmplContentBox a li', function (event) {
		  event.preventDefault();
		  event.stopPropagation();
		  var type = $(this).attr('type');
		  if (type) {
			type = type.toLowerCase();
		  }
		  if (type == "postback" || type == "text") {
			var _innerText = $(this).attr('value').trim();
			var displayMessage = ($(this)[0] && $(this)[0].innerText) ? $(this)[0].innerText.trim() : "" || ($(this) && $(this).attr('data-value')) ? $(this).attr('data-value').trim() : "";
			var eData = {
				payload : _innerText,
				utterence : _innerText,
				title : displayMessage,
				msgData: displayMessage
			};
			var payloadData = $(this).attr('actionObj');
			if(payloadData){
				eData.payloadData = payloadData;
			}
			_self.triggerEvent('onPostback', eData);
		  } else if (type == "url" || type == "web_url") {
			var a_link = $(this).attr('url');
			if (a_link.indexOf("http:") < 0 && a_link.indexOf("https:") < 0) {
			  a_link = "http:////" + a_link;
			}
			var _tempWin = window.open(a_link, "_blank");
		  }
		})
		return template;
	  }	

	customTemplate.prototype.getQuickReplyTemplate = function (messageData, helpers) {
	var _self = this;
	var quickReplyTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
					{{if msgData.message}} \
					<div class="messageBubble">\
						<li {{if msgData.type !== "bot_response"}} id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies" style="margin-top: -20px"> \
							<div class="buttonTmplContent">\
								{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
								{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
								{{if msgData.message[0].component.payload.text}} \
									<div class="buttonTmplContentHeading quickReply"> \
										{{if msgData.type === "bot_response"}} {{html convertMDtoHTMLForCarousel(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html convertMDtoHTMLForCarousel(msgData.message[0].component.payload.text, "user")}} {{/if}} \
										{{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
											<span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
										{{/if}} \
									</div>\
									{{/if}} \
									{{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
									<div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
										<div class="quick_replies_btn_parent"><div class="autoWidth">\
											{{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
												<div class="buttonTmplContentChild quickReplyDiv"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply {{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
													{{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">{{html convertMDtoHTMLForCarousel(msgItem.title, "bot")}}</span></span>\
												</div> \
											{{/each}} \
										</div>\
									</div>\
								{{/if}} \
							</div>\
						</li> \
					</div> \
					{{/if}} \
				</script>';
				var template = $(quickReplyTemplate).tmpl({
				'msgData': messageData,
				'helpers': helpers || this.helpers,
				'extension': {}
				});
				setTimeout(function () {
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent('resize', true, false);
				window.dispatchEvent(evt);
				}, 150);
	
				$(template).off('click', '.quickreplyRightIcon').on('click', '.quickreplyRightIcon', function (event) {
				var _quickReplesDivs = event.currentTarget.parentElement.getElementsByClassName('buttonTmplContentChild');
				if (_quickReplesDivs.length) {
					var _scrollParentDiv = event.target.parentElement.getElementsByClassName('quick_replies_btn_parent');
					var _totalWidth = event.target.parentElement.offsetWidth;
					var _currWidth = 0;
					// calculation for moving element scroll
					for (var i = 0; i < _quickReplesDivs.length; i++) {
					_currWidth += (_quickReplesDivs[i].offsetWidth + 10);
					if (_currWidth > _totalWidth) {
						$(_scrollParentDiv).animate({
						scrollLeft: (_scrollParentDiv[0].scrollLeft + _quickReplesDivs[i].offsetWidth + 20)
						}, 'slow', function () {
						// deciding to enable left and right scroll icons
						var leftIcon = _scrollParentDiv[0].parentElement.querySelectorAll('.quickreplyLeftIcon');
						leftIcon[0].classList.remove('hide');
						if ((_scrollParentDiv[0].scrollLeft + _totalWidth + 10) >= _scrollParentDiv[0].scrollWidth) {
							var rightIcon = _scrollParentDiv[0].parentElement.querySelectorAll('.quickreplyRightIcon');
							rightIcon[0].classList.add('hide');
						}
						});
						break;
					}
					}
				}
				});
				$(template).off('click', '.quickreplyLeftIcon').on('click', '.quickreplyLeftIcon', function (event) {
				var _quickReplesDivs = event.currentTarget.parentElement.getElementsByClassName('buttonTmplContentChild');
				if (_quickReplesDivs.length) {
					var _scrollParentDiv = event.target.parentElement.getElementsByClassName('quick_replies_btn_parent');
					var _totalWidth = _scrollParentDiv[0].scrollLeft;
					var _currWidth = 0;
					for (var i = 0; i < _quickReplesDivs.length; i++) {
					_currWidth += (_quickReplesDivs[i].offsetWidth + 10);
					if (_currWidth > _totalWidth) {
						//_scrollParentDiv[0].scrollLeft = (_totalWidth - _quickReplesDivs[i].offsetWidth+20);
						$(_scrollParentDiv).animate({
						scrollLeft: (_totalWidth - _quickReplesDivs[i].offsetWidth - 50)
						}, 'slow', function () {
						// deciding to enable left and right scroll icons
						var rightIcon = _scrollParentDiv[0].parentElement.querySelectorAll('.quickreplyRightIcon');
						rightIcon[0].classList.remove('hide');
						if (_scrollParentDiv[0].scrollLeft <= 0) {
							var leftIcon = _scrollParentDiv[0].parentElement.querySelectorAll('.quickreplyLeftIcon');
							leftIcon[0].classList.add('hide');
						}
						});
						break;
					}
					}
				}
				});
				$(template).off('click', '.quickReply').on('click', '.quickReply', function (event) {
					event.preventDefault();
					event.stopPropagation();
					var type = $(this).attr('type');
					if (type) {
						type = type.toLowerCase();
					}
					if (type == "postback" || type == "text") {
						var _innerText = $(this).attr('value').trim();
						var displayMessage = ($(this)[0] && $(this)[0].innerText) ? $(this)[0].innerText.trim() : "" || ($(this) && $(this).attr('data-value')) ? $(this).attr('data-value').trim() : "";
						var eData = {
							payload : _innerText,
							utterence : _innerText,
							title : displayMessage,
							msgData: displayMessage
						};
						var payloadData = $(this).attr('actionObj');
						if(payloadData){
							eData.payloadData = payloadData;
						}
						_self.triggerEvent('onPostback', eData);
					}
				})
	return template;
	}

	customTemplate.prototype.getChatBotTemplate = function (tempType) {
		var chatFooterTemplate =
			'<div class="footerContainer pos-relative"> \
				{{if userAgentIE}} \
				<div role="textbox" class="chatInputBox inputCursor" aria-label="Message" aria-label="Message" contenteditable="true" placeholder="${botMessages.message}"></div> \
				{{else}} \
				<div role="textbox" class="chatInputBox" contenteditable="true" placeholder="${botMessages.message}"></div> \
				{{/if}} \
			<div class="attachment"></div> \
			{{if isTTSEnabled}} \
				<div class="sdkFooterIcon ttspeakerDiv ttsOff"> \
					<button class="ttspeaker" title="Talk to speak"> \
						<span class="ttsSpeakerEnable"></span> \
						<span class="ttsSpeakerDisable"></span> \
						<span style="display:none;"><audio id="ttspeaker" controls="" autoplay="" name="media"><source src="" type="audio/wav"></audio></span>\
					</button> \
				</div> \
			{{/if}} \
			{{if isSpeechEnabled}}\
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
			{{/if}}\
			<div class="sdkFooterIcon"> \
				<button class="sdkAttachment attachmentBtn" title="Attachment"> \
					<i class="paperclip"></i> \
				</button> \
				<input type="file" name="Attachment" class="filety" id="captureAttachmnts"> \
			</div> \
			{{if !(isSendButton)}}<div class="chatSendMsg">Press enter to send</div>{{/if}} \
		</div>';

		var chatWindowTemplate = '<script id="chat_window_tmpl" type="text/x-jqury-tmpl"> \
			<div class="kore-chat-window droppable liteTheme-one"> \
			<div class="kr-wiz-menu-chat defaultTheme-kore">\
			</div>	\
				<div class="minimized-title"></div> \
				<div class="minimized"><span class="messages"></span></div> \
				<div class="kore-chat-header"> \
					<div id="botHeaderTitle" aria-labelledby="botHeaderTitle" class="header-title" title="${chatTitle}">${chatTitle}</div> \
					<div class="chat-box-controls"> \
						<button class="reload-btn" title="Reconnect"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTNweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTMgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5yZWxvYWQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNTcuMDAwMDAwLCAtMjQxLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIHN0cm9rZT0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJyZWxvYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1OC4wMDAwMDAsIDI0Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC44LDUuMjczNTc2NTggQzEwLjgsMi4zNjU3MTQyIDguMzc3NTg1NzEsMCA1LjQwMDAyMzg3LDAgQzIuNDIyNDYyMDMsMCAwLDIuMzY1NzE0MiAwLDUuMjczNTc2NTggQzAsNS40NDYzMTE0MiAwLjE0MzQwNjM1Myw1LjU4NjM1OTc2IDAuMzIwMjgyOTQyLDUuNTg2MzU5NzYgQzAuNDk3MTU5NTMsNS41ODYzNTk3NiAwLjY0MDU2NTg4Myw1LjQ0NjI4ODEgMC42NDA1NjU4ODMsNS4yNzM1NzY1OCBDMC42NDA1NjU4ODMsMi43MTA2NDc2NSAyLjc3NTY0MjI2LDAuNjI1NTg5NjY4IDUuNCwwLjYyNTU4OTY2OCBDOC4wMjQzNTc3NCwwLjYyNTU4OTY2OCAxMC4xNTk0MzQxLDIuNzEwNjcwOTYgMTAuMTU5NDM0MSw1LjI3MzU3NjU4IEMxMC4xNTk0MzQxLDcuODM2NDU4ODkgOC4wMjQzNTc3NCw5LjkyMTU0MDE4IDUuNCw5LjkyMTU0MDE4IEw0Ljg0NDMyNzI0LDkuOTIxNTQwMTggTDUuNjM4ODc1MzEsOS4wNTI5NzAwMyBDNS43NTY3MzczMyw4LjkyNDE1OTEyIDUuNzQ1MzAyMDYsOC43MjY0MDgxNiA1LjYxMzQwMjYsOC42MTEzMDYgQzUuNDgxNTAzMTMsOC40OTYyMDM4NSA1LjI3ODk4NjcyLDguNTA3Mzk0NjYgNS4xNjExNDg1Nyw4LjYzNjIwNTU2IEw0LjAyNTM1Njg4LDkuODc3ODAyNzYgQzMuODM5NDMyMzUsMTAuMDgxMDU1OSAzLjgzOTQzMjM1LDEwLjM4NzU5MDggNC4wMjUzNTY4OCwxMC41OTA4NDQgTDUuMTYxMTQ4NTcsMTEuODMyNDQxMiBDNS4yMjQ0MzY0NCwxMS45MDE2Mzc3IDUuMzEyMDc0OTgsMTEuOTM2ODQyMSA1LjQwMDExOTM3LDExLjkzNjg0MjEgQzUuNDc2MDYwMDQsMTEuOTM2ODQyMSA1LjU1MjMxMTA2LDExLjkxMDU5MDMgNS42MTM0MDI2LDExLjg1NzM0MDcgQzUuNzQ1MzI1OTQsMTEuNzQyMjM4NiA1Ljc1NjczNzMzLDExLjU0NDQ4NzYgNS42Mzg4NzUzMSwxMS40MTU2NzY3IEw0Ljg0NDMyNzI0LDEwLjU0NzEwNjUgTDUuNCwxMC41NDcxMDY1IEM4LjM3NzU4NTcxLDEwLjU0NzEwNjUgMTAuOCw4LjE4MTM5MjM0IDEwLjgsNS4yNzM1NzY1OCBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
						<button class="minimize-btn" title="Minimize"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIycHgiIHZpZXdCb3g9IjAgMCAxNCAyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4zICg2NzI5NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+bWluaW1pemU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjYuMDAwMDAwLCAtMjMzLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiPgogICAgICAgICAgICA8ZyBpZD0ibWluaW1pemUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyNi4wMDAwMDAsIDIzMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjAgMCAxMy45Mzk5OTk2IDAgMTMuOTM5OTk5NiAxLjk5OTk5OTk0IDAgMS45OTk5OTk5NCI+PC9wb2x5Z29uPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
						<button class="expand-btn" title="Expand"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5leHBhbmQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMDUuMDAwMDAwLCAtMjUyLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJleHBhbmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwNS4wMDAwMDAsIDI1Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjg2NjY2NjY3LDkuMzMzMzMzMzMgTDAsOS4zMzMzMzMzMyBMMCwxNCBMNC42NjY2NjY2NywxNCBMNC42NjY2NjY2NywxMi4xMzMzMzMzIEwxLjg2NjY2NjY3LDEyLjEzMzMzMzMgTDEuODY2NjY2NjcsOS4zMzMzMzMzMyBaIE0wLDQuNjY2NjY2NjcgTDEuODY2NjY2NjcsNC42NjY2NjY2NyBMMS44NjY2NjY2NywxLjg2NjY2NjY3IEw0LjY2NjY2NjY3LDEuODY2NjY2NjcgTDQuNjY2NjY2NjcsMCBMMCwwIEwwLDQuNjY2NjY2NjcgWiBNMTIuMTMzMzMzMywxMi4xMzMzMzMzIEw5LjMzMzMzMzMzLDEyLjEzMzMzMzMgTDkuMzMzMzMzMzMsMTQgTDE0LDE0IEwxNCw5LjMzMzMzMzMzIEwxMi4xMzMzMzMzLDkuMzMzMzMzMzMgTDEyLjEzMzMzMzMsMTIuMTMzMzMzMyBaIE05LjMzMzMzMzMzLDAgTDkuMzMzMzMzMzMsMS44NjY2NjY2NyBMMTIuMTMzMzMzMywxLjg2NjY2NjY3IEwxMi4xMzMzMzMzLDQuNjY2NjY2NjcgTDE0LDQuNjY2NjY2NjcgTDE0LDAgTDkuMzMzMzMzMzMsMCBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
						<button class="close-btn" title="Close"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button> \
					</div> \
				</div> \
				<div class="kore-chat-header historyLoadingDiv"> \
					<div class="historyWarningTextDiv displayTable"> \
						<span><img class = "loadingHistory" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAYZJREFUOBGtVLFKA0EQfbMiiERQEgjpRQt/wULB/opIFCuJvb1iKdprbbASDaa4L9DCX7BQ7CVwQcEggph13t7t3RlivMKBsDsz701mZ9+eYNjaNyX0e9saDmCxZJv1mrQ6zxDcayxEqXyOxmo/TzN5B2fXDbxFT7D2VH9rgK3FeV3pM848cTnLirQ6e0q60lw1lx+11bziHD5Oi1tcZVfAkyIYOYRM3GF69gHvr4uwX8sY2AMFVDwIkA3srLcFnAFb9B2I3GJqchNbQTcDJ7uLsIqPz0s91koS6WKmMm+SIfojRL8WIIuF+QdAlBSpks+ZBEkA7gijOkgBumGeR80sMLzG1OcMilgep3wDseWUxyEWsTnzmMKUr51ILw3wForYy2AhhSlfO3FKjGO8xiKWxymfgw1THnXAaxxnzMd68ajQuLcAeE1UnA5+K+R1kgmuS/4/KdY3xbdgB0fe/XMVs49m/Zi4uBPPiN/Qibrj5qJHl12+GU/7WYTRoe+J0xFlMOZ78g1n4achujvX7QAAAABJRU5ErkJggg=="></span> \
						<p class="headerTip warningTip">Loading chat history..</p> \
					</div> \
				</div> \
				<div class="kore-chat-header trainWarningDiv"> \
					<div class="trainWarningTextDiv displayTable"> \
						<span class="exclamation-circle"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span> \
						<p class="headerTip warningTip">Something went wrong.Please try again later.</p> \
					</div> \
				</div> \
				<div role="region" aria-live="assertive" class="kore-chat-body"> \
					<div class="errorMsgBlock"> \
					</div> \
					<ul class="chat-container"></ul> \
				</div> \
				<div class="typingIndicatorContent"><div class="typingIndicator"></div><div class="movingDots"></div></div> \
				<div class="kore-chat-footer disableFooter">' + chatFooterTemplate + '{{if isSendButton}}<div class="sendBtnCnt"><button class="sendButton disabled" type="button">Send</button></div>{{/if}}</div> \
				 <div id="myModal" class="modalImagePreview">\
					  <span class="closeImagePreview">&times;</span>\
					  <img class="modal-content-imagePreview" id="img01">\
					  <div id="caption"></div>\
				</div>\
				<div id="myPreviewModal" class="modalImagePreview">\
					  <span class="closeElePreview">&times;</span>\
					  <div class="largePreviewContent"></div>\
				</div>\
				<div class="kr-wiz-content-chat defaultTheme-kore">\
				</div>\
			</div> \
		</script>';

		var msgTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				{{each(key, msgItem) msgData.message}} \
					{{if msgItem.cInfo && msgItem.type === "text"}} \
						<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
							{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
							{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})" title="User Avatar"></div> </div> {{/if}} \
							<div aria-live="assertive"  class="messageBubble v-a-attch-message-bubble">\
								<div> \
									{{if msgData.type === "bot_response"}} \
										{{if msgItem.component  && msgItem.component.type =="error"}} \
											<span style="color:${msgItem.component.payload.color}">{{html helpers.convertMDtoHTML(msgItem.component.payload.text, "bot")}} </span>\
										 {{else}} \
											{{html helpers.convertMDtoHTML(msgItem.cInfo.body, "bot")}} \
											{{if msgItem.component && msgItem.component.payload && msgItem.component.payload.videoUrl}}\
												<div class="videoEle"><video width="300" controls><source src="${msgItem.component.payload.videoUrl}" type="video/mp4"></video></div>\
											{{/if}}\
											{{if msgItem.component && msgItem.component.payload && msgItem.component.payload.audioUrl}}\
												<div class="audioEle"><audio width="180" controls><source src="${msgItem.component.payload.audioUrl}"></audio></div>\
											{{/if}}\
										{{/if}} \
									{{else}} \
										{{if msgItem.cInfo.renderMsg && msgItem.cInfo.renderMsg !== ""}}\
											{{html helpers.convertMDtoHTML(msgItem.cInfo.renderMsg, "user",msgItem)}} \
										{{else}}\
											{{html helpers.convertMDtoHTML(msgItem.cInfo.body, "user",msgItem)}} \
										{{/if}}\
									{{/if}} \
								</div>\
								{{if msgItem.cInfo && msgItem.cInfo.emoji}} \
									<span class="emojione emojione-${msgItem.cInfo.emoji[0].code}">${msgItem.cInfo.emoji[0].title}</span> \
								{{/if}} \
								{{if msgItem.cInfo.attachments}} \
									<div class="msgCmpt attachments" fileid="${msgItem.cInfo.attachments[0].fileId}"> \
										<div class="uploadedFileIcon"> \
											{{if msgItem.cInfo.attachments[0].fileType == "image"}} \
												<span class="icon cf-icon icon-photos_active"></span> \
											{{else msgItem.cInfo.attachments[0].fileType == "audio"}}\
												<span class="icon cf-icon icon-files_audio"></span> \
											{{else msgItem.cInfo.attachments[0].fileType == "video"}} \
												<span class="icon cf-icon icon-video_active"></span> \
											{{else}} \
												{{if extension[1]=="xlsx" || extension[1]=="xls" || extension[1]=="docx" || extension[1]=="doc" || extension[1]=="pdf" || extension[1]=="ppsx" || extension[1]=="pptx" || extension[1]=="ppt" || extension[1]=="zip" || extension[1]=="rar"}}\
													<span class="icon cf-icon icon-files_${extension[1]}"></span> \
												{{else extension[1]}}\
													<span class="icon cf-icon icon-files_other_doc"></span> \
												{{/if}}\
											{{/if}}\
										</div> \
										<div class="curUseruploadedFileName">${msgItem.cInfo.attachments[0].fileName}</div> \
									</div> \
								{{/if}} \
								{{if msgData.isError}} \
									<div class="errorMsg">Send Failed. Please resend.</div> \
								{{/if}} \
							</div> \
						</li> \
					{{/if}} \
				{{/each}} \
			{{/if}} \
		</scipt>';
		var templateAttachment = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				{{each(key, msgItem) msgData.message}} \
					{{if msgItem.component && msgItem.component.payload.url}} \
						<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
							{{if msgData.createdOn}}<div class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
							{{if msgData.icon}}<div class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
							<div class="messageBubble attachment-message-bubble">\
								{{if msgItem.component.payload.url}} \
									<div class="msgCmpt botResponseAttachments" fileid="${msgItem.component.payload.url}"> \
										<div class="uploadedFileIcon"> \
											{{if msgItem.component.type == "image"}} \
												<span class="icon cf-icon icon-photos_active"></span> \
											{{else msgItem.component.type == "audio"}}\
												<span class="icon cf-icon icon-files_audio"></span> \
											{{else msgItem.component.type == "video"}} \
												<span class="icon cf-icon icon-video_active"></span> \
											{{else}} \
												{{if extension[1]=="xlsx" || extension[1]=="xls" || extension[1]=="docx" || extension[1]=="doc" || extension[1]=="pdf" || extension[1]=="ppsx" || extension[1]=="pptx" || extension[1]=="ppt" || extension[1]=="zip" || extension[1]=="rar"}}\
													<span class="icon cf-icon icon-files_${extension[1]}"></span> \
												{{else extension[1]}}\
													<span class="icon cf-icon icon-files_other_doc"></span> \
												{{/if}}\
											{{/if}}\
										</div> \
										<div class="botuploadedFileName">${extractedFileName}</div> \
									</div> \
								{{/if}} \
							</div> \
						</li> \
					{{/if}} \
				{{/each}} \
			{{/if}} \
		</scipt>';
		var popupTemplate = '<script id="kore_popup_tmpl" type="text/x-jquery-tmpl"> \
				<div class="kore-auth-layover">\
					<div class="kore-auth-popup"> \
						<div class="popup_controls"><span class="close-popup" title="Close">&times;</span></div> \
						<iframe id="authIframe" src="${link_url}"></iframe> \
					</div> \
				</div>\
		</script>';
		var buttonTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
					<div class="buttonTmplContent"> \
						{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
						{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
						<ul class="buttonTmplContentBox">\
							<li class="buttonTmplContentHeading"> \
								{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
								{{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
									<span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
								{{/if}} \
							</li>\
							{{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
								<a href=""#>\
									<li {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}"{{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
										{{html helpers.convertMDtoHTML(msgItem.title, "bot")}}\
									</li> \
								</a> \
							{{/each}} \
						</ul>\
					</div>\
				</li> \
			{{/if}} \
		</scipt>';

		var pieChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon piechart"> \
					{{if msgData.createdOn}}<div class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
					{{if msgData.icon}}<div class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
					{{if msgData.message[0].component.payload.text}}<div class="messageBubble pieChart">\
						<span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
					</div>{{/if}}\
					<div id="d3Pie">\
					</div>\
					<div class="piechartDiv">\
						<div class="lineChartChildDiv" id="piechart${msgData.messageId}"></div>\
					</div>\
				</li> \
			{{/if}} \
		</scipt>';

		var barchartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon barchart"> \
					{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
					{{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
					{{if msgData.message[0].component.payload.text}}<div class="messageBubble barchart">\
						<span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
					</div>{{/if}}\
					<div class="barchartDiv">\
						<div class="lineChartChildDiv" id="barchart${msgData.messageId}"></div>\
					</div>\
				</li> \
			{{/if}} \
		</scipt>';
		var linechartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon linechart"> \
					{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
					{{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
					{{if msgData.message[0].component.payload.text}}<div class="messageBubble linechart">\
						<span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
					</div>{{/if}}\
					<div class="linechartDiv">\
						<div class="lineChartChildDiv" id="linechart${msgData.messageId}"></div>\
					</div>\
				</li> \
			{{/if}} \
		</scipt>';
		var miniTableChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
					{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
					{{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
					{{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
						<span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
					</div>{{/if}}\
					{{each(key, table) msgData.message[0].component.payload.elements}}\
						<div class="minitableDiv">\
							<div style="overflow-x:auto; padding: 0 8px;">\
								<table cellspacing="0" cellpadding="0">\
									<tr class="headerTitle">\
										{{each(key, tableHeader) table.primary}} \
											<th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};" {{/if}}>${tableHeader[0]}</th>\
										{{/each}} \
									</tr>\
									{{each(key, additional) table.additional}} \
										<tr>\
											{{each(cellkey, cellValue) additional}} \
												<td  {{if cellkey === additional.length-1}}colspan="2"{{/if}}  {{if table.primary[cellkey][1]}}style="text-align:${table.primary[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
											{{/each}} \
										</tr>\
									{{/each}} \
								</table>\
							</div>\
						</div>\
					{{/each}}\
				</li> \
			{{/if}} \
		</scipt>';
		var miniTableHorizontalTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
			<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
				{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
				{{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
				{{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
					<span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
				</div>{{/if}}\
				<div class="carousel" id="carousel-one-by-one" style="height: 0px;">\
					{{each(key, table) msgData.message[0].component.payload.elements}}\
						<div class="slide">\
							<div class="minitableDiv">\
								<div style="overflow-x:auto; padding: 0 8px;">\
									<table cellspacing="0" cellpadding="0">\
										<tr class="headerTitle">\
											{{each(key, tableHeader) table.primary}} \
												<th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};" {{/if}}>${tableHeader[0]}</th>\
											{{/each}} \
										</tr>\
										{{each(key, additional) table.additional}} \
											<tr>\
												{{each(cellkey, cellValue) additional}} \
													<td  {{if cellkey === additional.length-1}}colspan="2"{{/if}}  {{if table.primary[cellkey][1]}}style="text-align:${table.primary[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
												{{/each}} \
											</tr>\
										{{/each}} \
									</table>\
								</div>\
							</div>\
						</div>\
					{{/each}}\
				</div>\
			</li> \
			{{/if}} \
		</scipt>';
		var tableChartTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
					{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
					{{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
					{{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
						<span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
					</div>{{/if}}\
					<div class="tablechartDiv {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
						<div style="overflow-x:auto; padding: 0 8px;">\
							<table cellspacing="0" cellpadding="0">\
								<tr class="headerTitle">\
									{{each(key, tableHeader) msgData.message[0].component.payload.columns}} \
										<th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};"{{/if}}>${tableHeader[0]}</th>\
									{{/each}} \
								</tr>\
								{{each(key, tableRow) msgData.message[0].component.payload.elements}} \
									{{if tableRow.Values.length>1}}\
										<tr {{if key > 4}}class="hide"{{/if}}>\
											{{each(cellkey, cellValue) tableRow.Values}} \
												<td  {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
											{{/each}} \
										</tr>\
									{{/if}}\
								{{/each}} \
							</table>\
						</div>\
						{{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showMore">Show more</div>{{/if}}\
					</div>\
					 <div class="accordionTable {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}hide{{else}}responsive{{/if}}">\
						{{each(key, tableRow) msgData.message[0].component.payload.elements}} \
							{{if key < 4}}\
								<div class="accordionRow">\
									{{each(cellkey, cellValue) tableRow.Values}} \
										{{if cellkey < 2}}\
											<div class="accordionCol">\
												<div class="colTitle hideSdkEle">${msgData.message[0].component.payload.columns[cellkey][0]}</div>\
												<div class="colVal">${cellValue}</div>\
											</div>\
										{{else}}\
											<div class="accordionCol hideSdkEle">\
												<div class="colTitle">${msgData.message[0].component.payload.columns[cellkey][0]}</div>\
												<div class="colVal">${cellValue}</div>\
											</div>\
										{{/if}}\
									{{/each}} \
									<span class="fa fa-caret-right tableBtn"></span>\
								</div>\
							{{/if}}\
						{{/each}} \
						<div class="showMore">Show more</div>\
					</div>\
				</li> \
			{{/if}} \
		</scipt>';


		var carouselTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
					{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
					{{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
					{{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
						<span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
					</div>{{/if}}\
					<div class="carousel" id="carousel-one-by-one">\
						{{each(key, msgItem) msgData.message[0].component.payload.elements}} \
							<div class="slide">\
								{{if msgItem.image_url}} \
									<div class="carouselImageContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
										<img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
									</div> \
								{{/if}} \
								<div class="carouselTitleBox"> \
									<p class="carouselTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</p> \
									{{if msgItem.subtitle}}<p class="carouselDescription">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</p>{{/if}} \
									{{if msgItem.default_action && msgItem.default_action.type === "web_url"}}<div class="listItemPath carouselDefaultAction" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
									{{if msgItem.buttons}} \
										{{each(key, msgBtn) msgItem.buttons}} \
											<div {{if msgBtn.payload}}value="${msgBtn.payload}"{{/if}} {{if msgBtn.url}}url="${msgBtn.url}"{{/if}} class="listItemPath carouselButton" data-value="${msgBtn.value}" type="${msgBtn.type}">\
												{{html helpers.convertMDtoHTML(msgBtn.title, "bot")}}\
											</div> \
										{{/each}} \
									{{/if}} \
								</div>\
							</div>\
						{{/each}} \
					</div>\
				</li> \
			{{/if}}\
		</scipt>';

		var quickReplyTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
					<div class="buttonTmplContent"> \
						{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
						{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
						{{if msgData.message[0].component.payload.text}} \
							<div class="buttonTmplContentHeading quickReply"> \
								{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
								{{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
									<span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
								{{/if}} \
							</div>\
							{{/if}} \
							{{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
							<div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
								<div class="quick_replies_btn_parent"><div class="autoWidth">\
									{{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
										<div class="buttonTmplContentChild quickReplyDiv"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply {{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
											{{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">{{html helpers.convertMDtoHTML(msgItem.title, "bot")}}</span></span>\
										</div> \
									{{/each}} \
								</div>\
							</div>\
						{{/if}} \
					</div>\
				</li> \
			{{/if}} \
		</scipt>';
		var listTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
					<div class="listTmplContent"> \
						{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
						{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
						<ul class="listTmplContentBox"> \
							{{if msgData.message[0].component.payload.text || msgData.message[0].component.payload.heading}} \
								<li class="listTmplContentHeading"> \
									{{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.heading, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
									{{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
										<span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
									{{/if}} \
								</li> \
							{{/if}} \
							{{each(key, msgItem) msgData.message[0].component.payload.elements}} \
								{{if msgData.message[0].component.payload.buttons}} \
									{{if key<= 2 }}\
										<li class="listTmplContentChild"> \
											{{if msgItem.image_url}} \
												<div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
													<img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
												</div> \
											{{/if}} \
											<div class="listLeftContent"> \
												<div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
												{{if msgItem.subtitle}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
												{{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
												{{if msgItem.buttons}}\
												<div> \
													<span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
												</div> \
												{{/if}}\
											</div>\
										</li> \
									{{/if}}\
								{{else}} \
									<li class="listTmplContentChild"> \
										{{if msgItem.image_url}} \
											<div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
												<img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';" /> \
											</div> \
										{{/if}} \
										<div class="listLeftContent"> \
											<div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
											{{if msgItem.subtitle}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
											{{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
											{{if msgItem.buttons}}\
											<div> \
												<span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
											</div> \
											{{/if}}\
										</div>\
									</li> \
								{{/if}} \
							{{/each}} \
							</li> \
							{{if msgData.message[0].component.AlwaysShowGlobalButtons || (msgData.message[0].component.payload.elements.length > 3 && msgData.message[0].component.payload.buttons)}}\
							<li class="viewMoreList"> \
								<span class="viewMore" url="{{if msgData.message[0].component.payload.buttons[0].url}}${msgData.message[0].component.payload.buttons[0].url}{{/if}}" type="${msgData.message[0].component.payload.buttons[0].type}" value="{{if msgData.message[0].component.payload.buttons[0].payload}}${msgData.message[0].component.payload.buttons[0].payload}{{else}}${msgData.message[0].component.payload.buttons[0].title}{{/if}}">${msgData.message[0].component.payload.buttons[0].title}</span> \
							</li> \
							{{/if}}\
						</ul> \
					</div> \
				</li> \
			{{/if}} \
		</scipt>';

		if (tempType === "message") {
			return msgTemplate;
		} else if (tempType === "popup") {
			return popupTemplate;
		} else if (tempType === "templatebutton") {
			return buttonTemplate;
		} else if (tempType === "templatelist") {
			return listTemplate;
		} else if (tempType === "templatequickreply") {
			return quickReplyTemplate;
		} else if (tempType === "templateAttachment") {
			return templateAttachment;
		}
		else if (tempType === "carouselTemplate") {
			return carouselTemplate;
		}
		else if (tempType === "pieChartTemplate") {
			return pieChartTemplate;
		}
		else if (tempType === "tableChartTemplate") {
			return tableChartTemplate;
		}
		else if (tempType === "miniTableChartTemplate") {
			return miniTableChartTemplate;
		}
		else if (tempType === "miniTableHorizontalTemplate") {
			return miniTableHorizontalTemplate;
		}
		else if (tempType === "barchartTemplate") {
			return barchartTemplate;
		}
		else if (tempType === "linechartTemplate") {
			return linechartTemplate;
		}
		else {
			return chatWindowTemplate;
		}
	};

	customTemplate.prototype.triggerEvent = function (eventName, data) {
		var _self = this;  
		if (_self.chatInitialize[eventName]) {
		  _self.chatInitialize[eventName](data);
		}
	  };

	var available_charts = [];
	customTemplate.prototype.bindPieChartEvents = function(template, msgData) {
		var me = this;
		graphLibGlob = me.config.graphLib || "d3";
		//storing the type of the graph to be displayed.
		if (me.config.graphLib === "google") {
			setTimeout(function () {
				google.charts.load('current', { 'packages': ['corechart'] });
				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					var data = new google.visualization.DataTable();
					data.addColumn('string', 'Task');
					data.addColumn('number', 'Hours per Day');
					if (msgData.message[0].component.payload.elements && msgData.message[0].component.payload.elements[0].displayValue) {
						data.addColumn({ type: 'string', role: 'tooltip' });
					}
					var pieChartData = [];
					var piechartElements = msgData.message[0].component.payload.elements;
					for (var i = 0; i < piechartElements.length; i++) {
						var arr = [piechartElements[i].title + " \n" + piechartElements[i].value];
						arr.push(parseFloat(piechartElements[i].value));
						if (piechartElements[i].displayValue) {
							arr.push(piechartElements[i].displayValue);
						}
						pieChartData.push(arr);
					}
					data.addRows(pieChartData);
					var options = {
						chartArea: {
							left: "3%",
							top: "3%",
							height: "94%",
							width: "94%"
						},
						pieSliceTextStyle: {},
						colors: window.chartColors,
						legend: {
							textStyle: {
								color: '#b3bac8'
							}
						}
					};

					if (piechartElements.length === 1) { // if only element, then deault donut chart
						options.pieHole = 0.5;
						options.pieSliceTextStyle.color = "black";
					}
					if (msgData.message[0].component.payload.pie_type) { //chart based on user requireent
						if (msgData.message[0].component.payload.pie_type === "donut") {
							options.pieHole = 0.6;
							options.pieSliceTextStyle.color = "black";
							options.legend.position = "none";
						}
						else if (msgData.message[0].component.payload.pie_type === "donut_legend") {
							options.pieHole = 0.6;
							options.pieSliceTextStyle.color = "black";
						}
					}
					var _piechartObj = { 'id': 'piechart' + msgData.messageId, 'data': data, 'options': options, 'type': 'piechart' };
					available_charts.push(_piechartObj);
					var container = document.getElementById('piechart' + msgData.messageId);
					var chart = new google.visualization.PieChart(container);
					chart.draw(data, options);
					//window.PieChartCount = window.PieChartCount + 1;
				}
			}, 150);
		}
		else if (graphLibGlob === "d3") {
			if (msgData.message[0].component.payload.pie_type === undefined) {
				msgData.message[0].component.payload.pie_type = 'regular';
			}
			if (msgData.message[0].component.payload.pie_type) {
				// define data
				dimens = {};
				dimens.width = 300;
				dimens.height = 200;
				dimens.legendRectSize = 10;
				dimens.legendSpacing = 2.4;
				if (msgData.message[0].component.payload.pie_type === "regular") {
					setTimeout(function () {
						var _piechartObj = { 'id': 'piechart' + msgData.messageId, 'data': msgData, 'type': 'regular' };
						available_charts.push(_piechartObj);
						KoreGraphAdapter.drawD3Pie(msgData, dimens, '#piechart' + msgData.messageId, 12);
						//window.PieChartCount = window.PieChartCount + 1;
					}, 150);
				}
				else if (msgData.message[0].component.payload.pie_type === "donut") {
					setTimeout(function () {
						var _piechartObj = { 'id': 'piechart' + msgData.messageId, 'data': msgData, 'type': 'donut' };
						available_charts.push(_piechartObj);
						KoreGraphAdapter.drawD3PieDonut(msgData, dimens, '#piechart' + msgData.messageId, 12, 'donut');
						//window.PieChartCount = window.PieChartCount + 1;
					}, 150);
				}
				else if (msgData.message[0].component.payload.pie_type === "donut_legend") {
					setTimeout(function () {
						var _piechartObj = { 'id': 'piechart' + msgData.messageId, 'data': msgData, 'type': 'donut_legend' };
						available_charts.push(_piechartObj);
						KoreGraphAdapter.drawD3PieDonut(msgData, dimens, '#piechart' + msgData.messageId, 12, 'donut_legend');
						//window.PieChartCount = window.PieChartCount + 1;
					}, 150);
				}
			}
		}
		// setTimeout(function () {
		// 	$('.chat-container').scrollTop($('.chat-container').prop('scrollHeight'));
		// 	handleChartOnClick();
		// }, 200);
	}

	customTemplate.prototype.bindTableChartEvents = function(template, msgData) {
		setTimeout(function () {
			var acc = document.getElementsByClassName("accordionRow");
			for (var i = 0; i < acc.length; i++) {
				acc[i].onclick = function () {
					this.classList.toggle("open");
				}
			}
			var showFullTableModal = document.getElementsByClassName("showMore");
			for (var i = 0; i < showFullTableModal.length; i++) {
				showFullTableModal[i].onclick = function () {
					var parentli = this.parentNode.parentElement;
					$("#dialog").empty();
					$("#dialog").html($(parentli).find('.tablechartDiv').html());
					$(".hello").clone().appendTo(".goodbye");
					var modal = document.getElementById('myPreviewModal');
					$(".largePreviewContent").empty();
					//$(".largePreviewContent").html($(parentli).find('.tablechartDiv').html());
					$(parentli).find('.tablechartDiv').clone().appendTo(".largePreviewContent");
					modal.style.display = "block";
					// Get the <span> element that closes the modal
					var span = document.getElementsByClassName("closeElePreview")[0];
					// When the user clicks on <span> (x), close the modal
					span.onclick = function () {
						modal.style.display = "none";
						$(".largePreviewContent").removeClass("addheight");
					}

				}
			}
		}, 350);
	}

	customTemplate.prototype.bindBarChartEvents = function(template, msgData) {
		var me = this;
		graphLibGlob = me.config.graphLib || "d3";
		if (graphLibGlob === "google") {
			setTimeout(function () {
				google.charts.load('current', { packages: ['corechart', 'bar'] });
				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					var customToolTips = false;
					var data = new google.visualization.DataTable();
					data.addColumn("string", 'y');
					//adding legend labels
					for (var i = 0; i < msgData.message[0].component.payload.elements.length; i++) {
						var currEle = msgData.message[0].component.payload.elements[i];
						data.addColumn('number', currEle.title);
						//checking for display values ( custom tooltips)
						if (currEle.displayValues && currEle.displayValues.length) {
							data.addColumn({ type: 'string', role: 'tooltip' });
							customToolTips = true;
						}
					}

					//filling rows
					var totalLines = msgData.message[0].component.payload.elements.length;
					for (var i = 0; i < msgData.message[0].component.payload.X_axis.length; i++) {
						var arr = [];
						arr.push(msgData.message[0].component.payload.X_axis[i]);
						for (var j = 0; j < totalLines; j++) {
							arr.push(parseFloat(msgData.message[0].component.payload.elements[j].values[i]));
							if (customToolTips) {
								arr.push(msgData.message[0].component.payload.elements[j].displayValues[i]);
							}
						}
						data.addRow(arr);
					}
					var options = {
						chartArea: {
							height: "70%",
							width: "80%"
						},
						legend: {
							position: 'top',
							alignment: 'end',
							maxLines: 3,
							textStyle: {
								color: '#b3bac8'
							}
						},
						hAxis: {
							gridlines: {
								color: 'transparent'
							},
							textStyle: {
								color: '#b3bac8'
							}
						},
						vAxis: {
							gridlines: {
								color: 'transparent'
							},
							textStyle: {
								color: '#b3bac8'
							},
							baselineColor: 'transparent'
						},
						animation: {
							duration: 500,
							easing: 'out',
							startup: true
						},
						bar: { groupWidth: "25%" },
						colors: window.chartColors
					};

					//horizontal chart, then increase size of bard
					if (msgData.message[0].component.payload.direction !== 'vertical') {
						options.bar.groupWidth = "45%";
						options.hAxis.baselineColor = '#b3bac8';
					}
					//stacked chart
					if (msgData.message[0].component.payload.stacked) {
						options.isStacked = true;
						options.bar.groupWidth = "25%";
					}
					var _barchartObj = { 'id': 'barchart' + msgData.messageId, 'direction': msgData.message[0].component.payload.direction, 'data': data, 'options': options, 'type': 'barchart' };
					available_charts.push(_barchartObj);
					var container = document.getElementById('barchart' + msgData.messageId);
					var chart = null;
					if (msgData.message[0].component.payload.direction === 'vertical') {
						chart = new google.visualization.ColumnChart(container);
					}
					else {
						chart = new google.visualization.BarChart(container);
					}
					chart.draw(data, options);
					//window.barchartCount = window.barchartCount + 1;
				}
			}, 150);
		}
		else if (graphLibGlob === "d3") {
			var dimens = {};
			dimens.outerWidth = 350;
			dimens.outerHeight = 300;
			dimens.innerHeight = 200;
			dimens.legendRectSize = 15;
			dimens.legendSpacing = 4;
			if (msgData.message[0].component.payload.direction === undefined) {
				msgData.message[0].component.payload.direction = 'horizontal';
			}
			if (msgData.message[0].component.payload.direction === 'horizontal' && !msgData.message[0].component.payload.stacked) {
				setTimeout(function () {
					dimens.innerWidth = 180;
					var _barchartObj = { 'id': 'Legend_barchart' + msgData.messageId, 'data': msgData, 'type': 'barchart' };
					available_charts.push(_barchartObj);
					KoreGraphAdapter.drawD3barHorizontalbarChart(msgData, dimens, '#barchart' + msgData.messageId, 12);
					// window.barchartCount = window.barchartCount + 1;
				}, 250);
			}
			else if (msgData.message[0].component.payload.direction === 'vertical' && msgData.message[0].component.payload.stacked) {
				setTimeout(function () {
					dimens.outerWidth = 350;
					dimens.innerWidth = 270;
					var _barchartObj = { 'id': 'barchart' + msgData.messageId, 'data': msgData, 'type': 'stackedBarchart' };
					available_charts.push(_barchartObj);
					KoreGraphAdapter.drawD3barVerticalStackedChart(msgData, dimens, '#barchart' + msgData.messageId, 12);
					// window.barchartCount = window.barchartCount + 1;
				}, 250);
			}

			else if (msgData.message[0].component.payload.direction === 'horizontal' && msgData.message[0].component.payload.stacked) {
				setTimeout(function () {
					dimens.innerWidth = 180;
					var _barchartObj = { 'id': 'barchart' + msgData.messageId, 'data': msgData, 'type': 'stackedBarchart' };
					available_charts.push(_barchartObj);
					KoreGraphAdapter.drawD3barStackedChart(msgData, dimens, '#barchart' + msgData.messageId, 12);
					// window.barchartCount = window.barchartCount + 1;
				}, 250);
			}
			else if (msgData.message[0].component.payload.direction === 'vertical' && !msgData.message[0].component.payload.stacked) {
				setTimeout(function () {
					dimens.innerWidth = 240;
					var _barchartObj = { 'id': 'barchart' + msgData.messageId, 'data': msgData, 'type': 'barchart' };
					available_charts.push(_barchartObj);
					KoreGraphAdapter.drawD3barChart(msgData, dimens, '#barchart' + msgData.messageId, 12);
					// window.barchartCount = window.barchartCount + 1;
				}, 250);
			}
		}
		// setTimeout(function () {
		// 	$('.chat-container').scrollTop($('.chat-container').prop('scrollHeight'));
		// 	handleChartOnClick();
		// }, 300);
	}

	customTemplate.prototype.bindLineChartEvents = function(template, msgData) {
		var me = this;
		graphLibGlob = me.config.graphLib || "d3";
		if (graphLibGlob === "google") {
			setTimeout(function () {
				google.charts.load('current', { packages: ['corechart', 'line'] });
				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					var customToolTips = false;
					var data = new google.visualization.DataTable();
					data.addColumn("string", 'y');
					//adding legend labels
					for (var i = 0; i < msgData.message[0].component.payload.elements.length; i++) {
						var currEle = msgData.message[0].component.payload.elements[i];
						data.addColumn('number', currEle.title);
						//checking for display values ( custom tooltips)
						if (currEle.displayValues && currEle.displayValues.length) {
							data.addColumn({ type: 'string', role: 'tooltip' });
							customToolTips = true;
						}
					}

					//filling rows
					var totalLines = msgData.message[0].component.payload.elements.length;
					for (var i = 0; i < msgData.message[0].component.payload.X_axis.length; i++) {
						var arr = [];
						arr.push(msgData.message[0].component.payload.X_axis[i]);
						for (var j = 0; j < totalLines; j++) {
							arr.push(parseFloat(msgData.message[0].component.payload.elements[j].values[i]));
							if (customToolTips) {
								arr.push(msgData.message[0].component.payload.elements[j].displayValues[i]);
							}
						}
						data.addRow(arr);
					}

					var options = {
						curveType: 'function',
						chartArea: {
							height: "70%",
							width: "80%"
						},
						legend: {
							position: 'top',
							alignment: 'end',
							maxLines: 3,
							textStyle: {
								color: "#b3bac8"
							}
						},
						hAxis: {
							gridlines: {
								color: 'transparent'
							},
							textStyle: {
								color: "#b3bac8"
							}
						},
						vAxis: {
							gridlines: {
								color: 'transparent'
							},
							textStyle: {
								color: '#b3bac8'
							},
							baselineColor: 'transparent'
						},
						lineWidth: 3,
						animation: {
							duration: 500,
							easing: 'out',
							startup: true
						},
						colors: window.chartColors
					};
					var lineChartObj = { 'id': 'linechart' + msgData.messageId, 'data': data, 'options': options, 'type': 'linechart' };
					available_charts.push(lineChartObj);
					var container = document.getElementById('linechart' + msgData.messageId);

					var chart = new google.visualization.LineChart(container);
					chart.draw(data, options);
					//window.linechartCount = window.linechartCount + 1;
				}
			}, 150);
		}
		else if (graphLibGlob === "d3") {
			setTimeout(function () {
				var dimens = {};
				dimens.outerWidth = 380;
				dimens.outerHeight = 350;
				dimens.innerWidth = 230;
				dimens.innerHeight = 250;
				dimens.legendRectSize = 15;
				dimens.legendSpacing = 4;
				var _linechartObj = { 'id': 'linechart' + msgData.messageId, 'data': msgData, 'type': 'linechart' };
				available_charts.push(_linechartObj);
				//  KoreGraphAdapter.drawD3lineChart(msgData, dimens, '#linechart'+window.linechartCount, 12);
				KoreGraphAdapter.drawD3lineChartV2(msgData, dimens, '#linechart' + msgData.messageId, 12);
				//window.linechartCount = window.linechartCount + 1;
			}, 250);
			/*                    setTimeout(function(){
									$('.chat-container').scrollTop($('.chat-container').prop('scrollHeight'));
									handleChartOnClick();
								},300);*/

		}
		// setTimeout(function () {
		// 	$('.chat-container').scrollTop($('.chat-container').prop('scrollHeight'));
		// 	handleChartOnClick();
		// }, 200);
	}
	carouselTemplateCount = 0;
	var carouselEles = [];
	customTemplate.prototype.bindMiniTableChartEvents = function(template, msgData) {
		setTimeout(function () {
			$('.carousel:last').addClass("carousel" + carouselTemplateCount);
			var count = $(".carousel" + carouselTemplateCount).children().length;
			if (count > 1) {
				var carouselOneByOne = new PureJSCarousel({
					carousel: '.carousel' + carouselTemplateCount,
					slide: '.slide',
					oneByOne: true,
					jq: $
				});
				$('.carousel' + carouselTemplateCount).parent().show();
				$('.carousel' + carouselTemplateCount).attr('style', 'height: auto !important');
				carouselEles.push(carouselOneByOne);
			}
			//window.dispatchEvent(new Event('resize'));
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent('resize', true, false);
			window.dispatchEvent(evt);
			carouselTemplateCount += 1;
			_chatContainer.animate({
				scrollTop: _chatContainer.prop("scrollHeight")
			}, 0);
		});
	}

	customTemplate.prototype.bindCarouselEvents = function(template, msgData) {
		var _self = this;
		setTimeout(function () {
			$('.carousel:last').addClass("carousel" + carouselTemplateCount);
			var count = $(".carousel" + carouselTemplateCount).children().length;
			if (count > 1) {
				var carouselOneByOne = new PureJSCarousel({
					carousel: '.carousel' + carouselTemplateCount,
					slide: '.slide',
					oneByOne: true,
					jq: $,
				});
				$('.carousel' + carouselTemplateCount).parent().show();
				// $('.carousel' + carouselTemplateCount).attr('style', 'height: inherit !important');
				carouselEles.push(carouselOneByOne);
			}
			//window.dispatchEvent(new Event('resize'));
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent('resize', true, false);
			window.dispatchEvent(evt);
			carouselTemplateCount += 1;

			$(template).off('click', '.carouselButton').on('click', '.carouselButton', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var type = $(this).attr('type');
                if (type) {
                  type = type.toLowerCase();
                }
                if (type == "postback" || type == "text") {
                  var _innerText = $(this).attr('value').trim();
                  var displayMessage = ($(this)[0] && $(this)[0].innerText) ? $(this)[0].innerText.trim() : "" || ($(this) && $(this).attr('data-value')) ? $(this).attr('data-value').trim() : "";
					var eData = {
						payload : _innerText,
						utterence : _innerText,
						title : displayMessage,
						msgData: displayMessage
					};
					var payloadData = $(this).attr('actionObj');
					if(payloadData){
						eData.payloadData = payloadData;
					}
					_self.triggerEvent('onPostback', eData);
                } else if (type == "url" || type == "web_url") {
                  var a_link = $(this).attr('url');
                  if (a_link.indexOf("http:") < 0 && a_link.indexOf("https:") < 0) {
                    a_link = "http:////" + a_link;
                  }
                  var _tempWin = window.open(a_link, "_blank");
                }
              })
		});
	}
	/**
	* purpose: Function to get custom template HTML
	* input  : Template type
	* output : Custom template HTML
	*
	*/
	
	
	customTemplate.prototype.getChatTemplate = function (tempType) {
	
		var dropdownTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}} id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
					<div class="buttonTmplContent"> \
						{{if msgData.createdOn}}<div class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
						{{if msgData.icon}}<div class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
						<div class="{{if msgData.message[0].component.payload.fromHistory}} dummy messageBubble {{else}}messageBubble{{/if}}"> \
							{{if msgData.message[0].component.payload.heading}}<div class="templateHeading">${msgData.message[0].component.payload.heading}</div>{{/if}} \
							<select class="selectTemplateDropdowm">\
							<option>select</option> \
								{{each(key, msgItem) msgData.message[0].component.payload.elements}} \
									<option xyz = ${msgData.message[0].component.selectedValue} {{if msgData.message[0].component.selectedValue === msgItem.value}}selected{{/if}} class = "dropdownTemplatesValues" type = "postback" value="${msgItem.value}"> \
										${msgItem.title}\
									</option> \
								{{/each}} \
							</select> \
						</div>\
					</div>\
				</li> \
			{{/if}} \
		</script>';
	
	
		var checkBoxesTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
			<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
					<div class = "listTmplContent"> \
						{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
						{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
						<ul class="{{if msgData.message[0].component.payload.fromHistory}} dummy listTmplContentBox  {{else}} listTmplContentBox{{/if}} "> \
							{{if msgData.message[0].component.payload.title || msgData.message[0].component.payload.heading}} \
								<li class="listTmplContentHeading"> \
									{{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.heading, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
									{{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
										<span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
									{{/if}} \
								</li> \
							{{/if}} \
							{{each(key, msgItem) msgData.message[0].component.payload.elements}} \
								{{if msgData.message[0].component.payload.buttons}} \
									<li class="listTmplContentChild"> \
										<div class="checkbox checkbox-primary styledCSS checkboxesDiv"> \
											<input  class = "checkInput" type="checkbox" text = "${msgItem.title}" value = "${msgItem.value}" id="${msgItem.value}${msgData.messageId}"> \
											<label for="${msgItem.value}${msgData.messageId}">{{html helpers.convertMDtoHTML(msgItem.title, "bot")}}</label> \
										</div> \
									</li> \
								{{/if}} \
							{{/each}} \
							<div class="{{if msgData.message[0].component.payload.fromHistory}} hide  {{else}} checkboxButtons {{/if}} "> \
								{{each(key, buttonData) msgData.message[0].component.payload.buttons}} \
									<div class="checkboxBtn" value=${buttonData.payload} title="${buttonData.title}"> \
										${buttonData.title} \
									</div> \
								{{/each}} \
							</div> \
						</ul> \
					</div> \
				</li> \
			{{/if}} \
		</script>';
	
		/* Sample template structure for Like_dislike template
			var message = {
			"type": "template",
			"payload": {
			"template_type": "like_dislike"
			}
			};
			print(JSON.stringify(message));
		*/
		var likeDislikeTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
			{{if msgData.message}} \
				<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
					<div class="buttonTmplContent"> \
						{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
						{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
						{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
						{{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
							<span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
						{{/if}} \
						<div type ="postback" value = "like" class="likeDislikeDiv likeDiv">\
							<img class = "likeImg" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5saWtlSWNvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJsaWtlSWNvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuMDAwMDAwLCAxMi41MDAwMDApIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTEyLjAwMDAwMCwgLTEyLjUwMDAwMCkgIiBmaWxsPSIjOUI5QjlCIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0iTGlrZS0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMi4wMDAwMDAsIDEyLjQyODU3MSkgc2NhbGUoLTEsIDEpIHJvdGF0ZSgtMTgwLjAwMDAwMCkgdHJhbnNsYXRlKC0xMi4wMDAwMDAsIC0xMi40Mjg1NzEpIHRyYW5zbGF0ZSgwLjAwMDAwMCwgMC40Mjg1NzEpIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMy44NCwxMC41MTQyODU3IEMyMy44NCw4LjkzNjMyOTI5IDIyLjU2MDgxMzYsNy42NTcxNDI4NiAyMC45ODI4NTcxLDcuNjU3MTQyODYgTDE2Ljk4Mjg1NzEsNy42NTcxNDI4NiBMMTYuOTgyODU3MSwzLjY1NzE0Mjg2IEMxNi45ODI4NTcxLDEuOTQyODU3MTQgMTYsMC4yMjg1NzE0MjkgMTQuMTI1NzE0MywwLjIyODU3MTQyOSBDMTIuMjUxNDI4NiwwLjIyODU3MTQyOSAxMS4yNjg1NzE0LDEuOTQyODU3MTQgMTEuMjY4NTcxNCwzLjY1NzE0Mjg2IEwxMS4yNjg1NzE0LDUuMjM0Mjg1NzEgTDkuMjA1NzE0MjksNy4yOTcxNDI4NiBMNi41NjU3MTQyOSw4LjE1NDI4NTcxIEM2LjMwMTk0MDQxLDcuNTEyMjExMjUgNS42NzcwMDA0Nyw3LjA5MjU3NjQ5IDQuOTgyODU3MTQsNy4wOTE0Mjg1NyBMMi4xMjU3MTQyOSw3LjA5MTQyODU3IEMxLjE3ODk0MDQzLDcuMDkxNDI4NTcgMC40MTE0Mjg1NzEsNy44NTg5NDA0MyAwLjQxMTQyODU3MSw4LjgwNTcxNDI5IEwwLjQxMTQyODU3MSwyMS4zNzcxNDI5IEMwLjQxMTQyODU3MSwyMi4zMjM5MTY3IDEuMTc4OTQwNDMsMjMuMDkxNDI4NiAyLjEyNTcxNDI5LDIzLjA5MTQyODYgTDQuOTgyODU3MTQsMjMuMDkxNDI4NiBDNS45Mjk2MzEsMjMuMDkxNDI4NiA2LjY5NzE0Mjg2LDIyLjMyMzkxNjcgNi42OTcxNDI4NiwyMS4zNzcxNDI5IEw2LjY5NzE0Mjg2LDIxLjE1NDI4NTcgTDkuMTc3MTQyODYsMjIuODA1NzE0MyBDOS40NTgzMjQ3NywyMi45OTIyMjk0IDkuNzg4Mjk1OTgsMjMuMDkxNjE4MyAxMC4xMjU3MTQzLDIzLjA5MTQyODYgTDIwLjk4Mjg1NzEsMjMuMDkxNDI4NiBDMjIuNTYwODEzNiwyMy4wOTE0Mjg2IDIzLjg0LDIxLjgxMjI0MjEgMjMuODQsMjAuMjM0Mjg1NyBMMjMuODQsMTkuNjYyODU3MSBDMjMuNTMzNzcyNCwxOS4xMzI0NTUzIDIzLjUzMzc3MjQsMTguNDc4OTczMyAyMy44NCwxNy45NDg1NzE0IEwyMy44NCwxNi4yMzQyODU3IEMyMy41MzM3NzI0LDE1LjcwMzg4MzkgMjMuNTMzNzcyNCwxNS4wNTA0MDE4IDIzLjg0LDE0LjUyIEwyMy44NCwxMi44MDU3MTQzIEMyMy41MzM3NzI0LDEyLjI3NTMxMjQgMjMuNTMzNzcyNCwxMS42MjE4MzA0IDIzLjg0LDExLjA5MTQyODYgTDIzLjg0LDEwLjUxNDI4NTcgWiBNNC45ODI4NTcxNCwyMS4zNzE0Mjg2IEwyLjEyNTcxNDI5LDIxLjM3MTQyODYgTDIuMTI1NzE0MjksOC44IEw0Ljk4Mjg1NzE0LDguOCBMNC45ODI4NTcxNCwyMS4zNzE0Mjg2IFogTTIyLjEyNTcxNDMsMTEuMDg1NzE0MyBMMjEuMjY4NTcxNCwxMS4wODU3MTQzIEMyMC43OTUxODQ1LDExLjA4NTcxNDMgMjAuNDExNDI4NiwxMS40Njk0NzAyIDIwLjQxMTQyODYsMTEuOTQyODU3MSBDMjAuNDExNDI4NiwxMi40MTYyNDQxIDIwLjc5NTE4NDUsMTIuOCAyMS4yNjg1NzE0LDEyLjggTDIyLjEyNTcxNDMsMTIuOCBMMjIuMTI1NzE0MywxNC41MTQyODU3IEwyMS4yNjg1NzE0LDE0LjUxNDI4NTcgQzIwLjc5NTE4NDUsMTQuNTE0Mjg1NyAyMC40MTE0Mjg2LDE0Ljg5ODA0MTYgMjAuNDExNDI4NiwxNS4zNzE0Mjg2IEMyMC40MTE0Mjg2LDE1Ljg0NDgxNTUgMjAuNzk1MTg0NSwxNi4yMjg1NzE0IDIxLjI2ODU3MTQsMTYuMjI4NTcxNCBMMjIuMTI1NzE0MywxNi4yMjg1NzE0IEwyMi4xMjU3MTQzLDE3Ljk0Mjg1NzEgTDIxLjI2ODU3MTQsMTcuOTQyODU3MSBDMjAuNzk1MTg0NSwxNy45NDI4NTcxIDIwLjQxMTQyODYsMTguMzI2NjEzMSAyMC40MTE0Mjg2LDE4LjggQzIwLjQxMTQyODYsMTkuMjczMzg2OSAyMC43OTUxODQ1LDE5LjY1NzE0MjkgMjEuMjY4NTcxNCwxOS42NTcxNDI5IEwyMi4xMjU3MTQzLDE5LjY1NzE0MjkgTDIyLjEyNTcxNDMsMjAuMjI4NTcxNCBDMjIuMTI1NzE0MywyMC44NTk3NTQgMjEuNjE0MDM5NywyMS4zNzE0Mjg2IDIwLjk4Mjg1NzEsMjEuMzcxNDI4NiBMMTAuMTI1NzE0MywyMS4zNzE0Mjg2IEw2LjY5NzE0Mjg2LDE5LjA4NTcxNDMgTDYuNjk3MTQyODYsOS45MDg1NzE0MyBMMTAuMTI1NzE0Myw4LjggTDEyLjk4Mjg1NzEsNS45NDI4NTcxNCBMMTIuOTgyODU3MSwzLjY1NzE0Mjg2IEMxMi45ODI4NTcxLDMuNjU3MTQyODYgMTIuOTgyODU3MSwxLjk0Mjg1NzE0IDE0LjEyNTcxNDMsMS45NDI4NTcxNCBDMTUuMjY4NTcxNCwxLjk0Mjg1NzE0IDE1LjI2ODU3MTQsMy42NTcxNDI4NiAxNS4yNjg1NzE0LDMuNjU3MTQyODYgTDE1LjI2ODU3MTQsOS4zNzE0Mjg1NyBMMjAuOTgyODU3MSw5LjM3MTQyODU3IEMyMS42MTQwMzk3LDkuMzcxNDI4NTcgMjIuMTI1NzE0Myw5Ljg4MzEwMzE0IDIyLjEyNTcxNDMsMTAuNTE0Mjg1NyIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="> \
							<img class = "hide likedImg" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5saWtlSWNvblNlbGVjdEJsdWU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ibGlrZUljb25TZWxlY3RCbHVlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMi4wMDAwMDAsIDEyLjUwMDAwMCkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMTIuMDAwMDAwLCAtMTIuNTAwMDAwKSAiIGZpbGw9IiM3RkE0REIiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJMaWtlLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTIuNDI4NTcxKSBzY2FsZSgtMSwgMSkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTEyLjAwMDAwMCwgLTEyLjQyODU3MSkgdHJhbnNsYXRlKDAuMDAwMDAwLCAwLjQyODU3MSkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTIzLjg0LDEwLjUxNDI4NTcgTDIzLjg0LDExLjA5MTQyODYgQzIzLjUzMzc3MjQsMTEuNjIxODMwNCAyMy41MzM3NzI0LDEyLjI3NTMxMjQgMjMuODQsMTIuODA1NzE0MyBMMjMuODQsMTQuNTIgQzIzLjUzMzc3MjQsMTUuMDUwNDAxOCAyMy41MzM3NzI0LDE1LjcwMzg4MzkgMjMuODQsMTYuMjM0Mjg1NyBMMjMuODQsMTcuOTQ4NTcxNCBDMjMuNTMzNzcyNCwxOC40Nzg5NzMzIDIzLjUzMzc3MjQsMTkuMTMyNDU1MyAyMy44NCwxOS42NjI4NTcxIEwyMy44NCwyMC4yMzQyODU3IEMyMy44NCwyMS44MTIyNDIxIDIyLjU2MDgxMzYsMjMuMDkxNDI4NiAyMC45ODI4NTcxLDIzLjA5MTQyODYgTDEwLjEyNTcxNDMsMjMuMDkxNDI4NiBDOS43ODgyOTU5OCwyMy4wOTE2MTgzIDkuNDU4MzI0NzcsMjIuOTkyMjI5NCA5LjE3NzE0Mjg2LDIyLjgwNTcxNDMgTDYuNjk3MTQyODYsMjEuMTU0Mjg1NyBMNi42OTcxNDI4NiwyMS4zNzcxNDI5IEM2LjY5NzE0Mjg2LDIyLjMyMzkxNjcgNS45Mjk2MzEsMjMuMDkxNDI4NiA0Ljk4Mjg1NzE0LDIzLjA5MTQyODYgTDIuMTI1NzE0MjksMjMuMDkxNDI4NiBDMS4xNzg5NDA0MywyMy4wOTE0Mjg2IDAuNDExNDI4NTcxLDIyLjMyMzkxNjcgMC40MTE0Mjg1NzEsMjEuMzc3MTQyOSBMMC40MTE0Mjg1NzEsOC44MDU3MTQyOSBDMC40MTE0Mjg1NzEsNy44NTg5NDA0MyAxLjE3ODk0MDQzLDcuMDkxNDI4NTcgMi4xMjU3MTQyOSw3LjA5MTQyODU3IEw0Ljk4Mjg1NzE0LDcuMDkxNDI4NTcgQzUuNjc3MDAwNDcsNy4wOTI1NzY0OSA2LjMwMTk0MDQxLDcuNTEyMjExMjUgNi41NjU3MTQyOSw4LjE1NDI4NTcxIEw5LjIwNTcxNDI5LDcuMjk3MTQyODYgTDExLjI2ODU3MTQsNS4yMzQyODU3MSBMMTEuMjY4NTcxNCwzLjY1NzE0Mjg2IEMxMS4yNjg1NzE0LDEuOTQyODU3MTQgMTIuMjUxNDI4NiwwLjIyODU3MTQyOSAxNC4xMjU3MTQzLDAuMjI4NTcxNDI5IEMxNiwwLjIyODU3MTQyOSAxNi45ODI4NTcxLDEuOTQyODU3MTQgMTYuOTgyODU3MSwzLjY1NzE0Mjg2IEwxNi45ODI4NTcxLDcuNjU3MTQyODYgTDIwLjk4Mjg1NzEsNy42NTcxNDI4NiBDMjIuNTYwODEzNiw3LjY1NzE0Mjg2IDIzLjg0LDguOTM2MzI5MjkgMjMuODQsMTAuNTE0Mjg1NyBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"> \
						</div> \
						<div type ="postback" value = "dislike" class="likeDislikeDiv disLikeDiv">\
							<img class = "disLikeImg" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5kaXNsaWtlSWNvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJkaXNsaWtlSWNvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIC0xLjAwMDAwMCkiIGZpbGw9IiM5QjlCOUIiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJMaWtlLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTIuNDI4NTcxKSBzY2FsZSgtMSwgMSkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTEyLjAwMDAwMCwgLTEyLjQyODU3MSkgdHJhbnNsYXRlKDAuMDAwMDAwLCAwLjQyODU3MSkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTIzLjg0LDEwLjUxNDI4NTcgQzIzLjg0LDguOTM2MzI5MjkgMjIuNTYwODEzNiw3LjY1NzE0Mjg2IDIwLjk4Mjg1NzEsNy42NTcxNDI4NiBMMTYuOTgyODU3MSw3LjY1NzE0Mjg2IEwxNi45ODI4NTcxLDMuNjU3MTQyODYgQzE2Ljk4Mjg1NzEsMS45NDI4NTcxNCAxNiwwLjIyODU3MTQyOSAxNC4xMjU3MTQzLDAuMjI4NTcxNDI5IEMxMi4yNTE0Mjg2LDAuMjI4NTcxNDI5IDExLjI2ODU3MTQsMS45NDI4NTcxNCAxMS4yNjg1NzE0LDMuNjU3MTQyODYgTDExLjI2ODU3MTQsNS4yMzQyODU3MSBMOS4yMDU3MTQyOSw3LjI5NzE0Mjg2IEw2LjU2NTcxNDI5LDguMTU0Mjg1NzEgQzYuMzAxOTQwNDEsNy41MTIyMTEyNSA1LjY3NzAwMDQ3LDcuMDkyNTc2NDkgNC45ODI4NTcxNCw3LjA5MTQyODU3IEwyLjEyNTcxNDI5LDcuMDkxNDI4NTcgQzEuMTc4OTQwNDMsNy4wOTE0Mjg1NyAwLjQxMTQyODU3MSw3Ljg1ODk0MDQzIDAuNDExNDI4NTcxLDguODA1NzE0MjkgTDAuNDExNDI4NTcxLDIxLjM3NzE0MjkgQzAuNDExNDI4NTcxLDIyLjMyMzkxNjcgMS4xNzg5NDA0MywyMy4wOTE0Mjg2IDIuMTI1NzE0MjksMjMuMDkxNDI4NiBMNC45ODI4NTcxNCwyMy4wOTE0Mjg2IEM1LjkyOTYzMSwyMy4wOTE0Mjg2IDYuNjk3MTQyODYsMjIuMzIzOTE2NyA2LjY5NzE0Mjg2LDIxLjM3NzE0MjkgTDYuNjk3MTQyODYsMjEuMTU0Mjg1NyBMOS4xNzcxNDI4NiwyMi44MDU3MTQzIEM5LjQ1ODMyNDc3LDIyLjk5MjIyOTQgOS43ODgyOTU5OCwyMy4wOTE2MTgzIDEwLjEyNTcxNDMsMjMuMDkxNDI4NiBMMjAuOTgyODU3MSwyMy4wOTE0Mjg2IEMyMi41NjA4MTM2LDIzLjA5MTQyODYgMjMuODQsMjEuODEyMjQyMSAyMy44NCwyMC4yMzQyODU3IEwyMy44NCwxOS42NjI4NTcxIEMyMy41MzM3NzI0LDE5LjEzMjQ1NTMgMjMuNTMzNzcyNCwxOC40Nzg5NzMzIDIzLjg0LDE3Ljk0ODU3MTQgTDIzLjg0LDE2LjIzNDI4NTcgQzIzLjUzMzc3MjQsMTUuNzAzODgzOSAyMy41MzM3NzI0LDE1LjA1MDQwMTggMjMuODQsMTQuNTIgTDIzLjg0LDEyLjgwNTcxNDMgQzIzLjUzMzc3MjQsMTIuMjc1MzEyNCAyMy41MzM3NzI0LDExLjYyMTgzMDQgMjMuODQsMTEuMDkxNDI4NiBMMjMuODQsMTAuNTE0Mjg1NyBaIE00Ljk4Mjg1NzE0LDIxLjM3MTQyODYgTDIuMTI1NzE0MjksMjEuMzcxNDI4NiBMMi4xMjU3MTQyOSw4LjggTDQuOTgyODU3MTQsOC44IEw0Ljk4Mjg1NzE0LDIxLjM3MTQyODYgWiBNMjIuMTI1NzE0MywxMS4wODU3MTQzIEwyMS4yNjg1NzE0LDExLjA4NTcxNDMgQzIwLjc5NTE4NDUsMTEuMDg1NzE0MyAyMC40MTE0Mjg2LDExLjQ2OTQ3MDIgMjAuNDExNDI4NiwxMS45NDI4NTcxIEMyMC40MTE0Mjg2LDEyLjQxNjI0NDEgMjAuNzk1MTg0NSwxMi44IDIxLjI2ODU3MTQsMTIuOCBMMjIuMTI1NzE0MywxMi44IEwyMi4xMjU3MTQzLDE0LjUxNDI4NTcgTDIxLjI2ODU3MTQsMTQuNTE0Mjg1NyBDMjAuNzk1MTg0NSwxNC41MTQyODU3IDIwLjQxMTQyODYsMTQuODk4MDQxNiAyMC40MTE0Mjg2LDE1LjM3MTQyODYgQzIwLjQxMTQyODYsMTUuODQ0ODE1NSAyMC43OTUxODQ1LDE2LjIyODU3MTQgMjEuMjY4NTcxNCwxNi4yMjg1NzE0IEwyMi4xMjU3MTQzLDE2LjIyODU3MTQgTDIyLjEyNTcxNDMsMTcuOTQyODU3MSBMMjEuMjY4NTcxNCwxNy45NDI4NTcxIEMyMC43OTUxODQ1LDE3Ljk0Mjg1NzEgMjAuNDExNDI4NiwxOC4zMjY2MTMxIDIwLjQxMTQyODYsMTguOCBDMjAuNDExNDI4NiwxOS4yNzMzODY5IDIwLjc5NTE4NDUsMTkuNjU3MTQyOSAyMS4yNjg1NzE0LDE5LjY1NzE0MjkgTDIyLjEyNTcxNDMsMTkuNjU3MTQyOSBMMjIuMTI1NzE0MywyMC4yMjg1NzE0IEMyMi4xMjU3MTQzLDIwLjg1OTc1NCAyMS42MTQwMzk3LDIxLjM3MTQyODYgMjAuOTgyODU3MSwyMS4zNzE0Mjg2IEwxMC4xMjU3MTQzLDIxLjM3MTQyODYgTDYuNjk3MTQyODYsMTkuMDg1NzE0MyBMNi42OTcxNDI4Niw5LjkwODU3MTQzIEwxMC4xMjU3MTQzLDguOCBMMTIuOTgyODU3MSw1Ljk0Mjg1NzE0IEwxMi45ODI4NTcxLDMuNjU3MTQyODYgQzEyLjk4Mjg1NzEsMy42NTcxNDI4NiAxMi45ODI4NTcxLDEuOTQyODU3MTQgMTQuMTI1NzE0MywxLjk0Mjg1NzE0IEMxNS4yNjg1NzE0LDEuOTQyODU3MTQgMTUuMjY4NTcxNCwzLjY1NzE0Mjg2IDE1LjI2ODU3MTQsMy42NTcxNDI4NiBMMTUuMjY4NTcxNCw5LjM3MTQyODU3IEwyMC45ODI4NTcxLDkuMzcxNDI4NTcgQzIxLjYxNDAzOTcsOS4zNzE0Mjg1NyAyMi4xMjU3MTQzLDkuODgzMTAzMTQgMjIuMTI1NzE0MywxMC41MTQyODU3IiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"> \
							<img class = "hide disLikedImg" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5kaXNsaWtlSWNvblNlbGVjdEJsdWU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iZGlzbGlrZUljb25TZWxlY3RCbHVlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgLTEuMDAwMDAwKSIgZmlsbD0iIzdGQTREQiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Ikxpa2UtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuMDAwMDAwLCAxMi40Mjg1NzEpIHNjYWxlKC0xLCAxKSByb3RhdGUoLTE4MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTIuMDAwMDAwLCAtMTIuNDI4NTcxKSB0cmFuc2xhdGUoMC4wMDAwMDAsIDAuNDI4NTcxKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjMuODQsMTAuNTE0Mjg1NyBMMjMuODQsMTEuMDkxNDI4NiBDMjMuNTMzNzcyNCwxMS42MjE4MzA0IDIzLjUzMzc3MjQsMTIuMjc1MzEyNCAyMy44NCwxMi44MDU3MTQzIEwyMy44NCwxNC41MiBDMjMuNTMzNzcyNCwxNS4wNTA0MDE4IDIzLjUzMzc3MjQsMTUuNzAzODgzOSAyMy44NCwxNi4yMzQyODU3IEwyMy44NCwxNy45NDg1NzE0IEMyMy41MzM3NzI0LDE4LjQ3ODk3MzMgMjMuNTMzNzcyNCwxOS4xMzI0NTUzIDIzLjg0LDE5LjY2Mjg1NzEgTDIzLjg0LDIwLjIzNDI4NTcgQzIzLjg0LDIxLjgxMjI0MjEgMjIuNTYwODEzNiwyMy4wOTE0Mjg2IDIwLjk4Mjg1NzEsMjMuMDkxNDI4NiBMMTAuMTI1NzE0MywyMy4wOTE0Mjg2IEM5Ljc4ODI5NTk4LDIzLjA5MTYxODMgOS40NTgzMjQ3NywyMi45OTIyMjk0IDkuMTc3MTQyODYsMjIuODA1NzE0MyBMNi42OTcxNDI4NiwyMS4xNTQyODU3IEw2LjY5NzE0Mjg2LDIxLjM3NzE0MjkgQzYuNjk3MTQyODYsMjIuMzIzOTE2NyA1LjkyOTYzMSwyMy4wOTE0Mjg2IDQuOTgyODU3MTQsMjMuMDkxNDI4NiBMMi4xMjU3MTQyOSwyMy4wOTE0Mjg2IEMxLjE3ODk0MDQzLDIzLjA5MTQyODYgMC40MTE0Mjg1NzEsMjIuMzIzOTE2NyAwLjQxMTQyODU3MSwyMS4zNzcxNDI5IEwwLjQxMTQyODU3MSw4LjgwNTcxNDI5IEMwLjQxMTQyODU3MSw3Ljg1ODk0MDQzIDEuMTc4OTQwNDMsNy4wOTE0Mjg1NyAyLjEyNTcxNDI5LDcuMDkxNDI4NTcgTDQuOTgyODU3MTQsNy4wOTE0Mjg1NyBDNS42NzcwMDA0Nyw3LjA5MjU3NjQ5IDYuMzAxOTQwNDEsNy41MTIyMTEyNSA2LjU2NTcxNDI5LDguMTU0Mjg1NzEgTDkuMjA1NzE0MjksNy4yOTcxNDI4NiBMMTEuMjY4NTcxNCw1LjIzNDI4NTcxIEwxMS4yNjg1NzE0LDMuNjU3MTQyODYgQzExLjI2ODU3MTQsMS45NDI4NTcxNCAxMi4yNTE0Mjg2LDAuMjI4NTcxNDI5IDE0LjEyNTcxNDMsMC4yMjg1NzE0MjkgQzE2LDAuMjI4NTcxNDI5IDE2Ljk4Mjg1NzEsMS45NDI4NTcxNCAxNi45ODI4NTcxLDMuNjU3MTQyODYgTDE2Ljk4Mjg1NzEsNy42NTcxNDI4NiBMMjAuOTgyODU3MSw3LjY1NzE0Mjg2IEMyMi41NjA4MTM2LDcuNjU3MTQyODYgMjMuODQsOC45MzYzMjkyOSAyMy44NCwxMC41MTQyODU3IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="> \
						</div> \
					</div>\
				</li> \
			{{/if}} \
		</script>';
	/* Sample template structure for Inline Form */
	
		
var formTemplate='<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
{{if msgData.message}} \
<li {{if msgData.type !== "bot_response"}} id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
	<div class="buttonTmplContent"> \
	{{if msgData.createdOn}}<div class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
		{{if msgData.icon}}<div class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
	   <div class="{{if msgData.message[0].component.payload.fromHistory}} dummy messageBubble {{else}}messageBubble{{/if}}"> \
			<div class="formMainComponent">\
			  {{if msgData.message[0].component.payload.heading}}<div class="templateHeading">${msgData.message[0].component.payload.heading}</div>{{else}}Submit Form{{/if}}\
				<form>\
				   <div class="formBody">\
					   {{each(key, msgItem) msgData.message[0].component.payload.formFields}} \
					   <div class="input_group">\
					{{if msgData.message[0].component.payload.formFields[0].label}}<div class="input_label">${msgData.message[0].component.payload.formFields[0].label} : </div>{{/if}}\
							<div class="inputMainComponent">\
							 <div class="input-btn-submit">\
								  <input type="${msgItem.type}" class="form-control" id="email" name="email" placeholder="${msgItem.placeholder}" value=""/>\
							 </div>\
							 <div id="submit" class="submit" value={{if msgData.message[0].component.payload.text}} "${msgData.message[0].component.payload.text}"{{/if}} >\
								 <div class="ok_btn" value="${msgData.message[0].component.payload.formFields[0].fieldButton.title}">${msgData.message[0].component.payload.formFields[0].fieldButton.title}</div>\
							 </div>\
							 </div>\
							</div>\
							{{/each}} \
					   </div>\
						 <div class="errorMessage hide"></div>\
			   </form>\
			</div>\
	   </div>\
	</div>\
</li> \
{{/if}} \
</script>';


	var advancedMultiSelect = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
	{{if msgData.message}} \
	<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
			<div class = "listTmplContent advancedMultiSelect"> \
				{{if msgData.createdOn && !msgData.message[0].component.payload.sliderView}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
				{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
				<ul class="{{if msgData.message[0].component.payload.fromHistory}} fromHistory listTmplContentBox  {{else}} listTmplContentBox{{/if}} "> \
					{{if msgData.message[0].component.payload.title || msgData.message[0].component.payload.heading}} \
					<div class="advMultiSelectHeader">\
						<h4 class="advMultiSelectHeaderTitle">${(msgData.message[0].component.payload.title) || (msgData.message[0].component.payload.heading)}<div class="closeIcon closeBottomSlider"></div></h4>\
						<p class="orderDate">${msgData.message[0].component.payload.description}</p>\
					</div>\
					{{/if}} \
					<div class="advancedMultiSelectScroll">\
					  {{each(index, element) msgData.message[0].component.payload.elements}} \
						<div class="collectionDiv {{if msgData.message[0].component.payload.showViewMore && index > 3}}hide{{/if}}">\
							{{if element.collection && element.collection.length}}\
								{{if element && element.collection && element.collection.length > 1}}\
									<div class="checkbox checkbox-primary styledCSS checkboxesDiv groupMultiSelect"> \
									<input  class = "checkInput " type="checkbox" text = "${element.collectionName}" value = "${element.collectionName}" id="${element.collectionName}${msgData.messageId}${index}"> \
										<label for="${element.collectionName}${msgData.messageId}${index}">\
												{{if element && element.collectionHeader}}\
												<div class="imgDescContainer">\
													<div class="checkImgContainer">\
														<img src="https://image12.coupangcdn.com/image/displayitem/displayitem_8ad9b5e0-fd76-407b-b820-6494f03ffc31.jpg">\
													</div>\
													<div class="multiSelectDescContainer">\
														<p class="multiTitle">{{html helpers.convertMDtoHTML(msgItem.title, "bot")}}\</p>\
														<p class="multiDesc">Consultation on weekends and holidays</p>\
													</div>\
												</div>\
												{{else}}\
												Select all\
												{{/if}}\
											</label> \
									</div> \
								{{/if}}\
								{{each(key, msgItem) element.collection}} \
									{{if msgData.message[0].component.payload.buttons}} \
										<li class="listTmplContentChild"> \
											<div class="checkbox checkbox-primary styledCSS checkboxesDiv singleSelect {{if !msgItem.description}}nodescription{{/if}} {{if !msgItem.description && !msgItem.image_url}}noImgdescription{{/if}}"> \
												<input  class = "checkInput" type="checkbox" text = "${msgItem.title}" value = "${msgItem.value}" id="${msgItem.value}${msgData.messageId}${index}${key}"> \
												<label for="${msgItem.value}${msgData.messageId}${index}${key}">\
													<div class="imgDescContainer">\
														{{if msgItem.image_url}}\
															<div class="checkImgContainer">\
																<img src="${msgItem.image_url}">\
															</div>\
														{{/if}}\
														<div class="multiSelectDescContainer">\
															<p class="multiTitle">{{html helpers.convertMDtoHTML(msgItem.title, "bot")}}\</p>\
															{{if msgItem.description}}\
															<p class="multiDesc">${msgItem.description}</p>\
															{{/if}}\
														</div>\
													</div>\
												</label> \
											</div> \
										</li> \
									{{/if}} \
								{{/each}} \
							{{/if}}\
						</div>\
					  {{/each}} \
					  {{if !(msgData.message[0].component.payload.fromHistory)}}\
					  <li class="viewMoreContainer {{if !(msgData.message[0].component.payload.showViewMore)}}hide{{/if}}"> \
						  <span class="viewMoreGroups">ViewMore</span> \
					  </li> \
					  {{/if}}\
					  </div>\
					{{if !(msgData.message[0].component.payload.fromHistory)}}\
					<li class="hide multiCheckboxBtn ">\
						<span title="Here are your selected items " class="{{if msgData.message[0].component.payload.fromHistory}} hide  {{else}} viewMore {{/if}}" type="postback" value="{{if msgData.message[0].component.payload.buttons[0].payload}}${msgData.message[0].component.payload.buttons[0].payload}{{else}}${msgData.message[0].component.payload.buttons[0].title}{{/if}}">${msgData.message[0].component.payload.buttons[0].title}</span> \
					</li> \
					{{/if}}\
				</ul> \
			</div> \
		</li> \
	{{/if}} \
   </scipt>';
  

	var listViewTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
	{{if msgData.message}} \
		<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon listView"> \
			<div class="listViewTmplContent {{if msgData.message[0].component.payload.boxShadow}}noShadow{{/if}}"> \
				{{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
				{{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
				<ul class="listViewTmplContentBox"> \
					{{if msgData.message[0].component.payload.text || msgData.message[0].component.payload.heading}} \
						<li class="listViewTmplContentHeading"> \
							{{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
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
										<div class="listViewItemTitle" title="${msgItem.title}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
										{{if msgItem.subtitle}}<div class="listViewItemSubtitle" title="${msgItem.subtitle}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
										</span>\
									{{if msgItem.value}}<div class="listViewItemValue" title="${msgItem.value}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.value, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.value, "user")}} {{/if}}</div>{{/if}} \
									</div>\
								</li> \
								{{/if}}\
					{{/each}} \
					</div>\
					{{if msgData.message[0].component.payload.seeMore}}\
					<li class="seeMore"> \
						<span class="seeMoreList">More</span> \
					</li> \
					{{/if}}\
				</ul> \
			</div> \
		</li> \
	{{/if}} \
 </script>';
 var listActionSheetTemplate = '<script id="chat-window-listTemplate" type="text/x-jqury-tmpl">\
 <div class="list-template-sheet hide">\
  {{if msgData.message}} \
	<div class="sheetHeader">\
	  <span class="choose">${msgData.message[0].component.payload.heading}</span>\
	  <button class="close-button" title="Close"><img src="data:image/svg+xml;base64,           PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
	</div>\
	<div class="listTemplateContainer" >\
		 <div class="displayMonth">\
			 {{each(key, tab) tabs}} \
				 <span class="tabs" data-tabid="${tab}"><span class="btnBG">${tab}</span></span>\
			 {{/each}}\
		 </div>\
		   <ul class="displayListValues">\
			   {{each(key, msgItem) dataItems}} \
					<li class="listViewTmplContentChild"> \
						  {{if msgItem.image_url}} \
							  <div class="listViewRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
								 <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
							 </div> \
						 {{/if}} \
							 <div class="listViewLeftContent" data-url="${msgItem.default_action.url}" data-title="${msgItem.default_action.title}" data-value="${msgItem.default_action.title}"> \
								<span class="titleDesc">\
									<div class="listViewItemTitle" title="${msgItem.title}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
									 {{if msgItem.subtitle}}<div class="listViewItemSubtitle" title="${msgItem.subtitle}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
								 </span>\
									 {{if msgItem.value}}<div class="listViewItemValue" title="${msgItem.value}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.value, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.value, "user")}} {{/if}}</div>{{/if}} \
							 </div>\
					 </li> \
				{{/each}} \
			</ul> \
	</div>\
{{/if}}\
</div>\
</script>';
var tableListTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                {{if msgData.message}} \
                    <li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
                        <div class="listTmplContent"> \
                            {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                            {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
							<div class="{{if msgData.message[0].component.payload.fromHistory}}dummy listTableContainerDiv {{else}}listTableContainerDiv{{/if}} ">\
                <div class="listTableContainerDivRepet">\
                <div class="listTableContainer">\
                {{each(index,element) msgData.message[0].component.elements}}\
                        <div class="listTableDetailsBorderDiv">\
                                <div class="listTableDetails">\
                                <div class="listTableHeader">\
                                    <div class="listTableDetailsTitle">${element.sectionHeader}</div>\
                                    <div class="listTableHeaderDesc{{if element.value && element.value.layout && element.value.layout.align}}${element.value.layout.align}{{/if}}" {{if element.value && element.value.layout && element.value.layout.colSize}} style="width:${element.value.layout.colSize};"{{/if}} {{if element.value && element.value.layout && element.value.layout.color}} style="color:${element.value.layout.color}"{{/if}}>${element.sectionHeaderDesc}</div>\
                                </div>\
                        {{each(index,msgItem) element.rowItems}}\
                                    <div class="listTableDetailsDesc {{if msgItem.title.image && msgItem.title.image.size==="medium"}}mediumImg{{/if}} {{if msgItem.title.type!=="url" && msgItem.default_action}}pointerStyle{{/if}}" {{if msgItem.title.image && msgItem.title.image.size==="large"}}mediumImg{{/if}}" {{if msgItem.title.image && msgItem.title.image.size==="small"}}smallImg{{/if}}" {{if msgItem && msgItem.bgcolor}} style="background-color:${msgItem.bgcolor};"{{/if}} {{if msgItem && msgItem.title && msgItem.title.rowColor}}style="color:${msgItem.title.rowColor}"{{/if}} {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}} data-title="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} data-value="${msgItem.default_action.payload}"{{/if}}>\
                                      {{if msgItem && msgItem.title.image && msgItem.title.image.image_type && msgItem.title.image.image_src}}\
                                        <div class="listTableBigImgConytainer">\
                                          {{if msgItem.title.image.image_type === "image"}}\
                                              <img src="${msgItem.title.image.image_src}">\
                                          {{/if}}\
                                          {{if msgItem.title.image.image_type === "fontawesome"}}\
                                              <i class="fa {{msgItem.title.image.image_src}}" ></i>\
                                          {{/if}}\
                                        </div>\
                                      {{/if}}\
                                        <div class="listTableDetailsDescSub ">\
                                        {{if (msgItem.title && msgItem.title.type && msgItem.title.type ==="url")}}\
                                        <div class="listTableDetailsDescName {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}} {{if !msgItem.default_action}} pointer {{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                        <div actionObj="${JSON.stringify(msgItem.title.url)}" type="${msgItem.title.type}" url="${msgItem.title.url.link}" class="listViewItemValue actionLink action {{if !msgItem.subtitle}}top10{{/if}}">${msgItem.title.url.title}</div>\
                                        </div>{{else}}\
                                        <p class="listTableDetailsDescName">${msgItem.title.text.title}</p>\
                                      {{/if}}\
                                      {{if (msgItem.title && msgItem.title.url && msgItem.title.url.subtitle)}}\
                                            <p class="listTableDetailsDescValue">${msgItem.title.url.subtitle}</p>\
                                            {{else (msgItem.title && msgItem.title.text)}}\
                                            <p class="listTableDetailsDescValue">${msgItem.title.text.subtitle}</p>\
                                        {{/if}}\
                                        </div>\
                                          {{if (msgItem.value && msgItem.value.type === "text" && msgItem.value.text)}}\
                                            <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.colSize}} style="width:${msgItem.value.layout.colSize};"{{/if}}>\
                                                <div class="listViewItemValue {{if !msgItem.subtitle}}top10{{/if}}" {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.color}} style="color:${msgItem.value.layout.color}"{{/if}} title="${msgItem.value.text}">${msgItem.value.text}</div>\
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
                                          {{if (msgItem.value && msgItem.value.type === "url" && msgItem.value.url.link && msgItem.value.url.title)}}\
                                            <div class="titleActions {{if msgItem.value && msgItem.value.layout && msgItem.value.layout.align}}${msgItem.value.layout.align}{{/if}}" {{if msgItem.value && msgItem.value.layout && (msgItem.value.layout.colSize || msgItem.value.layout.color)}} style="width:${msgItem.value.layout.colSize};color:${msgItem.value.layout.color}"{{/if}}>\
                                                <div actionObj="${JSON.stringify(msgItem.value.url)}" type="${msgItem.value.type}" url="${msgItem.value.url.link}"class="listViewItemValue actionLink action {{if !msgItem.subtitle}}top10{{/if}}">${msgItem.value.url.title}</div>\
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
                                                        {{if actionbtnli.image && actionbtnli.image.image_type === "image" && msgItem.title.image.image_src}}\
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
                {{if msgData.elements && msgData.elements.length > 3 && viewmore}} \
                    <div class="seeMoreFooter">\
                        <span class="seeMoreLink" onclick="viewMorePanel(\'${JSON.stringify(panelDetail)}\')">Show more</span>\
                    </div>\
                {{/if}}\
                </div>\
            </div>\
			</div> \
            </li> \
        {{/if}} \
    </scipt>';
	var advancedListTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
	{{if msgData.message}} \
	<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
	<div class="advanced-list-wrapper {{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listViewType !="button"}}img-with-title with-accordion if-multiple-accordions-list{{/if}}{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listViewType ==="button"}}if-multiple-tags{{/if}} {{if msgData.message[0].component.payload.fromHistory}}fromHistory{{/if}}">\
	{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.sliderView}}<button class="close-btn" title="Close"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button> {{/if}}\
	{{if msgData && msgData.createdOn}}<div class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
	{{if msgData && msgData.icon}}<div class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
	{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listViewType !="button"}}\
		<div class="main-title-text-block">\
			<div class="title-main {{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && !msgData.message[0].component.payload.isSortEnabled && !msgData.message[0].component.payload.isSearchEnabled && !msgData.message[0].component.payload.isButtonAvailable}}w-100{{/if}}">\
				{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.title}}\
					<div class="title-main {{if msgData.message[0].component.payload.description}}main-title{{/if}} {{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && !msgData.message[0].component.payload.isSortEnabled && !msgData.message[0].component.payload.isSearchEnabled && !msgData.message[0].component.payload.isButtonAvailable}}w-100{{/if}}">${msgData.message[0].component.payload.title}</div>\
				{{/if}}\
				{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.description}}\
					<div class="desc-title">${msgData.message[0].component.payload.description}</div>\
				{{/if}}\
			</div>\
			{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.isSortEnabled}}\
				<div class="filter-sort-block">\
					<div class="filter-icon">\
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAJCAYAAAACTR1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA7SURBVHgB1c+hEQAgDEPRZJMa9oLJYDHuuknAYLgKkP0qF/doViqojp+khjzxjCfrtrnPgVzxPkJrYFtkCRTHyEG/TwAAAABJRU5ErkJggg==">\
					</div>\
					<div class="sort-icon">\
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADQSURBVHgBtVLLDcIwDH1B5d4RohbuHaHdACZoNwEmgA0YAZigK5QzH5kNyr3UuB9KKCISSLyDHb/4xdJzAAPa89faG83Qg67hT0zOaS9cKGcDRiClK2LQ+bh4tg1DgGM5bDthK0rBvJf6AiiSpuRd/IpBHRk7olPSUEzgW4QSV1jgEFEueW6SwpGklU04wI/4j1DrcfCJs09UvKx224l8PxYurbbqWIVcTMW/FKoM5RUtTmuwiirzehNVJiF/VLXjXERQFd+sieiQ4RvUH8XAHSO4SlLHWJY+AAAAAElFTkSuQmCC">\
					</div>\
				</div>\
			{{else msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.isSearchEnabled}}\
				<div class="search-block">\
					<img class="search_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEtSURBVHgBlVJNTsJgFJxX6lYb40J3HwHX9gh6AvUEwglMVy7hBuIJwCN4AmDpirq2wDtClyZWPqf0hwqWhEmavm++N33zJhVUYIzxALcDR65grYFFSPpNNZpgC42N6NKHyBiQcwqmfL8D9gKCJ+/0zPdOjqdxHH8V/ZJPMhB3ximB6ny05cLAcZ/TWhfRPf5etobGtPuoQbqCabaW7LkuOGe9l0gHSEZ1QlWNYeWVuz+UQuDI0LGmwF7YECsGthF+xyQ9HAinmFT1X4NbDvgoDm7mAi/Mt8dq8p8iS5052KRZcFJeNtsznhSrJKjuy8TvKBqyDHUZ3ewI86YBmx7TJj7cHT7tMFEE5HsQG+pi3t0R5rbS344CMesp+hmWvLjj3FVXcACyjzYGwE//F5fNZ2bVtWT6AAAAAElFTkSuQmCC">\
					<input type="text" class="input_text hide"  placeholder="Search">\
					<img class="close_icon hide"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACuSURBVHgBnZLBDcMgDEWdsoBLF6AVvXeEbla6Ta7doJmgC/SQY08pGxAHJZGVGIiChLCNH/4yBqBlzPUGG9eUq6JRhQ9qDf7fNVnoYh901Iinl/K++yHqigIuB0cogKP9bNtvzSRYZ842jK+uoHhHObIUAU5Bijsk+81l41HfmTy5mlg5I+8AcjSIdkpqrMa6R24DhW7P0FJerttJqAgX/0mCh5ErQSt4mu09Q94DEcdaRcYvY1cAAAAASUVORK5CYII=">\
				</div>\
			{{else msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.isButtonAvailable}}\
				{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.headerOptions && msgData.message[0].component.payload.headerOptions.length}}\
					{{each(headerOptionKey,headerOption) msgData.message[0].component.payload.headerOptions}}\
					{{if headerOption && headerOption.type === "button"}}\
							<div class="if-button-mode">\
								<button class="button-">${headerOption.label}</button>\
							</div>\
						{{/if}}\
					{{/each}}\
				{{/if}}\
			{{/if}}\
		</div>\
		{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.tableHeading}}\
		<div class="small-title-sec">\
			<div class="left-title">${msgData.message[0].component.payload.tableHeading.rightLabel}</div>\
			<div class="right-title">${msgData.message[0].component.payload.tableHeading.leftLabel}</div>\
		</div>\
		{{/if}}\
		{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listViewType == "nav" && msgData.message[0].component.payload.navHeaders && msgData.message[0].component.payload.navHeaders.length}}\
			<div class="callendar-tabs">\
				{{each(i,navheader) msgData.message[0].component.payload.navHeaders}}\
					<div class="month-tab {{if i==0}}active-month{{/if}}" id="${navheader.id}">${navheader.title}</div>\
				{{/each}}\
			</div>\
		{{/if}}\
		{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listItems && msgData.message[0].component.payload.listItems.length}} \
			{{each(key, listItem) msgData.message[0].component.payload.listItems}} \
			   {{if  (msgData.message[0].component.payload.listItemDisplayCount &&  msgData.message[0].component.payload.listItemDisplayCount > key && (((!msgData.message[0].component.payload.seeMoreAction )||(msgData.message[0].component.payload.seeMoreAction && msgData.message[0].component.payload.seeMoreAction === "slider") || (msgData.message[0].component.payload.seeMoreAction && msgData.message[0].component.payload.seeMoreAction === "modal"))) || (!msgData.message[0].component.payload.listItemDisplayCount) || (msgData.message[0].component.payload.listItemDisplayCount && msgData.message[0].component.payload.seeMoreAction &&  msgData.message[0].component.payload.seeMoreAction === "inline")) }}\
					<div class="multiple-accor-rows {{if msgData.message[0].component.payload.listItemDisplayCount &&  msgData.message[0].component.payload.listItemDisplayCount < key && msgData.message[0].component.payload.seeMoreAction === "inline"}}hide inline{{/if}}" id="{{if listItem && listItem.navId}}${listItem.navId}{{/if}}" actionObj="${JSON.stringify(listItem)}">\
						<div class="accor-header-top">\
							{{if listItem && listItem.icon}}\
								<div class="img-block {{if listItem.iconShape}}${listItem.iconShape}{{/if}} {{if listItem.imageSize}}${listItem.imageSize}{{/if}}">\
								<img src="${listItem.icon}">\
								</div>\
							{{/if}}\
							<div class="content-block {{if !listItem.icon}}pd-0{{/if}}">\
								{{if listItem && listItem.title}}\
									<div class="title-text">{{html helpers.convertMDtoHTML(listItem.title, "bot")}}</div>\
								{{/if}}\
								{{if listItem && listItem.description}}\
									<div class="title-desc">{{html helpers.convertMDtoHTML(listItem.description, "bot")}}</div>\
								{{/if}}\
							</div>\
							{{if listItem && listItem.headerOptions && listItem.headerOptions.length}}\
								{{each(i,headerOption) listItem.headerOptions}}\
										{{if headerOption && headerOption.type == "text"}}\
										<div class="btn_block">\
											<div class="amout-text">{{html helpers.convertMDtoHTML(headerOption.value, "bot")}}</div>\
										</div>\
										{{/if}}\
										{{if headerOption && headerOption.type == "icon"}}\
										<div class="action-icon-acc">\
											<img src="${headerOption.icon}">\
										</div>\
										{{/if}}\
										{{if headerOption && headerOption.contenttype == "button"}}\
											<div class="btn_block">\
												{{if headerOption && headerOption.contenttype == "button" && headerOption.isStatus}}\
													<div class="btn_tag shorlisted">{{html helpers.convertMDtoHTML(headerOption.title, "bot")}}</div>\
												{{/if}}\
												{{if headerOption && headerOption.contenttype == "button" && !headerOption.isStatus}}\
													<button class="button_" type="${headerOption.type}" value="${headerOption.payload}">{{html helpers.convertMDtoHTML(headerOption.title, "bot")}}</button>\
												{{/if}}\
											</div>\
										{{/if}}\
										{{if headerOption && headerOption.type == "dropdown"}}\
											<div class="btn_block dropdown">\
												<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgd2lkdGg9IjNweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMyAxMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4NCiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4NCiAgICA8dGl0bGU+ZWxsaXBzaXNHcmF5PC90aXRsZT4NCiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4NCiAgICAgICAgPHBhdGggZD0iTTIuNTcxNDI4NTcsOC4wNzE0Mjg1NyBMMi41NzE0Mjg1Nyw5LjM1NzE0Mjg2IEMyLjU3MTQyODU3LDkuNTM1NzE1MTggMi41MDg5MjkyLDkuNjg3NDk5MzggMi4zODM5Mjg1Nyw5LjgxMjUgQzIuMjU4OTI3OTUsOS45Mzc1MDA2MiAyLjEwNzE0Mzc1LDEwIDEuOTI4NTcxNDMsMTAgTDAuNjQyODU3MTQzLDEwIEMwLjQ2NDI4NDgyMSwxMCAwLjMxMjUwMDYyNSw5LjkzNzUwMDYyIDAuMTg3NSw5LjgxMjUgQzAuMDYyNDk5Mzc1LDkuNjg3NDk5MzggMCw5LjUzNTcxNTE4IDAsOS4zNTcxNDI4NiBMMCw4LjA3MTQyODU3IEMwLDcuODkyODU2MjUgMC4wNjI0OTkzNzUsNy43NDEwNzIwNSAwLjE4NzUsNy42MTYwNzE0MyBDMC4zMTI1MDA2MjUsNy40OTEwNzA4IDAuNDY0Mjg0ODIxLDcuNDI4NTcxNDMgMC42NDI4NTcxNDMsNy40Mjg1NzE0MyBMMS45Mjg1NzE0Myw3LjQyODU3MTQzIEMyLjEwNzE0Mzc1LDcuNDI4NTcxNDMgMi4yNTg5Mjc5NSw3LjQ5MTA3MDggMi4zODM5Mjg1Nyw3LjYxNjA3MTQzIEMyLjUwODkyOTIsNy43NDEwNzIwNSAyLjU3MTQyODU3LDcuODkyODU2MjUgMi41NzE0Mjg1Nyw4LjA3MTQyODU3IFogTTIuNTcxNDI4NTcsNC42NDI4NTcxNCBMMi41NzE0Mjg1Nyw1LjkyODU3MTQzIEMyLjU3MTQyODU3LDYuMTA3MTQzNzUgMi41MDg5MjkyLDYuMjU4OTI3OTUgMi4zODM5Mjg1Nyw2LjM4MzkyODU3IEMyLjI1ODkyNzk1LDYuNTA4OTI5MiAyLjEwNzE0Mzc1LDYuNTcxNDI4NTcgMS45Mjg1NzE0Myw2LjU3MTQyODU3IEwwLjY0Mjg1NzE0Myw2LjU3MTQyODU3IEMwLjQ2NDI4NDgyMSw2LjU3MTQyODU3IDAuMzEyNTAwNjI1LDYuNTA4OTI5MiAwLjE4NzUsNi4zODM5Mjg1NyBDMC4wNjI0OTkzNzUsNi4yNTg5Mjc5NSAwLDYuMTA3MTQzNzUgMCw1LjkyODU3MTQzIEwwLDQuNjQyODU3MTQgQzAsNC40NjQyODQ4MiAwLjA2MjQ5OTM3NSw0LjMxMjUwMDYyIDAuMTg3NSw0LjE4NzUgQzAuMzEyNTAwNjI1LDQuMDYyNDk5MzggMC40NjQyODQ4MjEsNCAwLjY0Mjg1NzE0Myw0IEwxLjkyODU3MTQzLDQgQzIuMTA3MTQzNzUsNCAyLjI1ODkyNzk1LDQuMDYyNDk5MzggMi4zODM5Mjg1Nyw0LjE4NzUgQzIuNTA4OTI5Miw0LjMxMjUwMDYyIDIuNTcxNDI4NTcsNC40NjQyODQ4MiAyLjU3MTQyODU3LDQuNjQyODU3MTQgWiBNMi41NzE0Mjg1NywxLjIxNDI4NTcxIEwyLjU3MTQyODU3LDIuNSBDMi41NzE0Mjg1NywyLjY3ODU3MjMyIDIuNTA4OTI5MiwyLjgzMDM1NjUyIDIuMzgzOTI4NTcsMi45NTUzNTcxNCBDMi4yNTg5Mjc5NSwzLjA4MDM1Nzc3IDIuMTA3MTQzNzUsMy4xNDI4NTcxNCAxLjkyODU3MTQzLDMuMTQyODU3MTQgTDAuNjQyODU3MTQzLDMuMTQyODU3MTQgQzAuNDY0Mjg0ODIxLDMuMTQyODU3MTQgMC4zMTI1MDA2MjUsMy4wODAzNTc3NyAwLjE4NzUsMi45NTUzNTcxNCBDMC4wNjI0OTkzNzUsMi44MzAzNTY1MiAwLDIuNjc4NTcyMzIgMCwyLjUgTDAsMS4yMTQyODU3MSBDMCwxLjAzNTcxMzM5IDAuMDYyNDk5Mzc1LDAuODgzOTI5MTk2IDAuMTg3NSwwLjc1ODkyODU3MSBDMC4zMTI1MDA2MjUsMC42MzM5Mjc5NDYgMC40NjQyODQ4MjEsMC41NzE0Mjg1NzEgMC42NDI4NTcxNDMsMC41NzE0Mjg1NzEgTDEuOTI4NTcxNDMsMC41NzE0Mjg1NzEgQzIuMTA3MTQzNzUsMC41NzE0Mjg1NzEgMi4yNTg5Mjc5NSwwLjYzMzkyNzk0NiAyLjM4MzkyODU3LDAuNzU4OTI4NTcxIEMyLjUwODkyOTIsMC44ODM5MjkxOTYgMi41NzE0Mjg1NywxLjAzNTcxMzM5IDIuNTcxNDI4NTcsMS4yMTQyODU3MSBaIiBpZD0iZWxsaXBzaXNHcmF5IiBmaWxsPSIjOEE5NTlGIj48L3BhdGg+DQogICAgPC9nPg0KPC9zdmc+">\
												{{if dropdownOptions && dropdownOptions.length}}\
												<ul  class="more-button-info hide" style="list-style:none;">\
												<button class="close_btn" title="Close"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
													{{each(optionKeykey, option) headerOption.dropdownOptions}} \
															<li><button class="button_" {{if option && option.type}}type="${option.type}"{{/if}} value="${option.payload}">{{if option && option.icon}}<img src="${option.icon}">{{/if}} {{html helpers.convertMDtoHTML(option.title, "bot")}}</button></li>\
													{{/each}}\
												</ul>\
												{{/if}}\
											</div>\
										{{/if}}\
								{{/each}}\
							{{/if}}\
						</div>\
						<div class="accor-inner-content" {{if listItem && listItem.isCollapsed}}style="display:block;"{{/if}}>\
							{{if listItem && listItem.view == "default" && listItem.textInformation && listItem.textInformation.length}}\
							{{each(i,textInfo) listItem.textInformation}}\
								<div class="details-content">\
									{{if textInfo && textInfo.icon}}\
									<span class="icon-img">\
										<img src="${textInfo.icon}">\
									</span>\
									{{/if}}\
									{{if textInfo && textInfo.title}}\
										<span class="text-info" {{if textInfo && textInfo.type}}type="${textInfo.type}"{{/if}} {{if textInfo && textInfo.url}}url="${textInfo.url}"{{/if}}>{{html helpers.convertMDtoHTML(textInfo.title, "bot")}}</span>\
									{{/if}}\
								</div>\
							{{/each}}\
							{{if listItem && listItem.buttonHeader}}\
							   <div class="button-header"><div class="button-header-title">{{html helpers.convertMDtoHTML(listItem.buttonHeader, "bot")}}</div></div>\
							{{/if}}\
							{{if listItem && listItem.buttons && listItem.buttons.length}}\
								<div class="inner-btns-acc {{if listItem.buttonsLayout && listItem.buttonsLayout.buttonAligment && listItem.buttonsLayout.buttonAligment == "center"}}if-btn-position-center{{else (listItem.buttonsLayout && listItem.buttonsLayout.buttonAligment && listItem.buttonsLayout.buttonAligment  == "left")}}if-btn-position-left{{else (listItem.buttonsLayout && listItem.buttonsLayout.buttonAligment && listItem.buttonsLayout.buttonAligment == "right")}}if-btn-position-right{{else (listItem.buttonsLayout && listItem.buttonsLayout.buttonAligment && listItem.buttonsLayout.buttonAligment  == "fullwidth")}}if-full-width-btn"{{/if}}">\
								  {{if (listItem && listItem.seeMoreAction && listItem.seeMoreAction === "dropdown") || (listItem && listItem.seeMoreAction && listItem.seeMoreAction === "slider") || (listItem && !listItem.seeMoreAction)}}\
										{{each(i,button) listItem.buttons}}\
											{{if (listItem && listItem.buttonsLayout && listItem.buttonsLayout.displayLimit && listItem.buttonsLayout.displayLimit.count && (i < listItem.buttonsLayout.displayLimit.count)) || (listItem && !listItem.buttonsLayout && i < 2) || (listItem && !listItem.buttonsLayout && listItem.buttons.length === 3)}}\
												<button class="button_" type="${button.type}" title="${button.title}" value="${button.payload}"><img src="${button.icon}">{{html helpers.convertMDtoHTML(button.title, "bot")}}</button>\
											{{/if}}\
										{{/each}}\
									{{else (listItem && listItem.seeMoreAction && listItem.seeMoreAction === "inline")}}\
										{{each(i,button) listItem.buttons}}\
												<button class="button_ {{if !((listItem && listItem.buttonsLayout && listItem.buttonsLayout.displayLimit && listItem.buttonsLayout.displayLimit.count && (i < listItem.buttonsLayout.displayLimit.count)) || (listItem && !listItem.buttonsLayout && i < 2) || (listItem && !listItem.buttonsLayout && listItem.buttons.length === 3))}} hide {{/if}}" type="${button.type}" title="${button.title}" value="${button.payload}"><img src="${button.icon}">${button.title}</button>\
										{{/each}}\
									{{/if}}\
										{{if (listItem && listItem.buttonsLayout && listItem.buttonsLayout.displayLimit && listItem.buttonsLayout.displayLimit.count && listItem.buttonsLayout.displayLimit.count < listItem.buttons.length) || (listItem && !listItem.buttonsLayout && listItem.buttons.length > 3)}}\
												<button class="button_ more-btn" actionObj="${JSON.stringify(listItem)}"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAADCAYAAABI4YUMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBSURBVHgBNYyxDcJQDET/OREwBhukA0pG+COwQaCnSCR6+BswAqwBTeYB4eOcKJbss89+xnLbtyl5dsfp++6GpFhszhmoWvJXPq/LI7zVrluTvCqHWsAtTDM/SI7RByDZS2McIdK1g54h1yq9OxszG+HpAAVgqgxl9tztbsZG7fMPUTQuCUr8UX4AAAAASUVORK5CYII=">More</button>\
												{{if (listItem && listItem.seeMoreAction && listItem.seeMoreAction === "dropdown") || (listItem && !listItem.seeMoreAction)}}\
													<ul  class="more-button-info" style="list-style:none;">\
													<button class="close_btn" title="Close"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
														{{each(key, button) listItem.buttons}} \
															{{if key >= 2}}\
																<li><button class="button_" type="${button.type}" value="${button.payload}"><img src="${button.icon}">{{html helpers.convertMDtoHTML(button.title, "bot")}}</button></li>\
															{{/if}}\
														{{/each}}\
													</ul>\
												{{/if}}\
										{{/if}}\
								</div>\
							{{/if}}\
							{{/if}}\
							{{if listItem && (listItem.view == "table") && listItem.tableListData}}\
							    {{if listItem.tableListData}}\
									<div class="inner-acc-table-sec">\
										{{each(i,list) listItem.tableListData}}\
										  {{if list.rowData && list.rowData.length}}\
											<div class="table-sec {{if listItem.type && listItem.type == "column"}}if-label-table-columns{{/if}}">\
												{{each(key,row) list.rowData}}\
													{{if ((list.rowData.length > 6) && (key < 6)) || (list.rowData.length === 6)}}\
														{{if !row.icon}}\
															<div class="column-table">\
																<div class="header-name">{{html helpers.convertMDtoHTML(row.title, "bot")}}</div>\
																<div class="title-name">{{html helpers.convertMDtoHTML(row.description, "bot")}}</div>\
															</div>\
															{{else}}\
																<div class="column-table">\
																	<div class="labeld-img-block {{if row.iconSize}}${row.iconSize}{{/if}}">\
																		<img src="${row.icon}">\
																	</div>\
																	<div class="label-content">\
																		<div class="header-name">{{html helpers.convertMDtoHTML(row.title, "bot")}}</div>\
																		<div class="title-name">{{html helpers.convertMDtoHTML(row.description, "bot")}}</div>\
																	</div>\
																</div>\
															{{/if}}\
														{{/if}}\
												{{/each}}\
												{{if (list.rowData.length > 6)}}\
														<div class="column-table-more">\
															<div class="title-name"><span>More <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACDSURBVHgBdY7BDYMwDEW/E+612gWs0gE6Qtmkm7ACGzADI7ABG5AJIAMgQozEIUDewQf/Z/lDdso/brAcAZmWny/289QnoY8wPzqAmrNgdeQEe1h3Ap1LaD1QMSKgMpeKxtZxDsAyJJfyLlsE+iIslXPOUy7QHeUCpRD5/LBC4o8kUDaUO0VusgMydwAAAABJRU5ErkJggg=="></div>\
														</div>\
												 {{/if}}\
											</div>\
											{{/if}}\
										{{/each}}\
									</div>\
								{{/if}}\
							{{/if}}\
							{{if listItem && listItem.view == "options" && listItem.optionsData && listItem.optionsData.length}}\
							{{each(i,option) listItem.optionsData}}\
								{{if option && option.type == "radio"}}\
									<div class="kr_sg_radiobutton option">\
										<input id="${key+""+i}" name="radio" class="radio-custom option-input" value="${option.value}" text = "${option.label}" type="radio">\
										<label for="${key+""+i}" class="radio-custom-label">{{html helpers.convertMDtoHTML(option.label, "bot")}}</label>\
									</div>\
								{{/if}}\
								{{if option && option.type == "checkbox"}}\
								<div class="kr_sg_checkbox option">\
									<input id="${key+""+i}" class="checkbox-custom option-input" text = "${option.label}" value="${option.value}" type="checkbox">\
									<label for="${key+""+i}" class="checkbox-custom-label">{{html helpers.convertMDtoHTML(option.label, "bot")}}</label>\
									</div>\
								{{/if}}\
							{{/each}}\
							{{if listItem && listItem.buttons && listItem.buttons.length}}\
									<div class="btn_group {{if listItem.buttonAligment && listItem.buttonAligment == "center"}}if-btn-position-center{{else (listItem.buttonAligment && listItem.buttonAligment == "left")}}if-btn-position-left{{else (listItem.buttonAligment && listItem.buttonAligment == "right")}}if-btn-position-right{{else (listItem.buttonAligment && listItem.buttonAligment == "fullWidth")}}if-full-width-btn"{{/if}}">\
										{{each(i,button) listItem.buttons}}\
											<button class="{{if button && button.btnType =="confirm"}}submitBtn p-button{{else button && button.btnType=="cancel"}}cancelBtn s-button{{/if}}" title="${button.title}">{{html helpers.convertMDtoHTML(button.title, "bot")}}</button>\
										{{/each}}\
									</div>\
							{{/if}}\
							{{/if}}\
						</div>\
					</div>\
				{{/if}}\
			{{/each}}\
			{{if (msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.seeMore && msgData.message[0].component.payload.listItems.length > msgData.message[0].component.payload.listItemDisplayCount) || (msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listItems.length > msgData.message[0].component.payload.listItemDisplayCount)}}\
				<div class="see-more-data">\
				    {{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && (!msgData.message[0].component.payload.seeMoreVisibity || (msgData.message[0].component.payload.seeMoreVisibity && msgData.message[0].component.payload.seeMoreVisibity === "link"))}}\
						<span>{{if (msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.seeMoreTitle)}} ${msgData.message[0].component.payload.seeMoreTitle} {{else}}See more{{/if}} <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACDSURBVHgBdY7BDYMwDEW/E+612gWs0gE6Qtmkm7ACGzADI7ABG5AJIAMgQozEIUDewQf/Z/lDdso/brAcAZmWny/289QnoY8wPzqAmrNgdeQEe1h3Ap1LaD1QMSKgMpeKxtZxDsAyJJfyLlsE+iIslXPOUy7QHeUCpRD5/LBC4o8kUDaUO0VusgMydwAAAABJRU5ErkJggg=="></span>\
					{{else msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && (msgData.message[0].component.payload.seeMoreVisibity  && msgData.message[0].component.payload.seeMoreVisibity === "button")}}\
							<button class="button_seemore" >{{if (msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.seeMoreIcon)}}<img src="${msgData.message[0].component.payload.seeMoreIcon.seeMoreIcon}">{{/if}}{{if (msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.seeMoreTitle)}} ${msgData.message[0].component.payload.seeMoreTitle} {{else}}See more{{/if}}</button>\
					{{/if}}\
				</div>\
			{{/if}}\
		{{/if}}\
	{{/if}}\
	{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listViewType ==="button"}}\
		<div class="content-sec">\
			<div class="left-sec">\
				{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.title}}\
					<div class="main-title">{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.title, "bot")}}</div>\
				{{/if}}\
				{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.description}}\
					<div class="desc-title">{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.description, "bot")}}</div>\
				{{/if}}\
			</div>\
			{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.headerOptions}}\
			<div class="right-sec">\
				{{each(i,headerOption) msgData.message[0].component.payload.headerOptions}}\
					{{if (headerOption.type == "button") || (headerOption.contenttype == "button")}}\
						<button class="button-">{{html helpers.convertMDtoHTML(headerOption.title, "bot")}}</button>\
					{{/if}}\
				{{/each}}\
			</div>\
			{{/if}}\
		</div>\
		{{if msgData && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.listViewType ==="button" && msgData.message[0].component.payload.listItems && msgData.message[0].component.payload.listItems.length}}\
			<div class="tags-data">\
				{{each(i,listItem) msgData.message[0].component.payload.listItems}}\
				   {{if (msgData.message[0].component.payload.listItemDisplayCount && i < msgData.message[0].component.payload.listItemDisplayCount && ((msgData.message[0].component.payload.seeMoreAction === "slider") || (msgData.message[0].component.payload.seeMoreAction === "modal"))) || !msgData.message[0].component.payload.listItemDisplayCount || (msgData.message[0].component.payload.listItemDisplayCount && msgData.message[0].component.payload.seeMoreAction === "inline")}}\
						<div class="tag-name {{if msgData.message[0].component.payload.listItemDisplayCount && i > msgData.message[0].component.payload.listItemDisplayCount && msgData.message[0].component.payload.seeMoreAction === "inline"}}hide inline{{/if}}" type="${listItem.type}" value="${listItem.payload}">${listItem.title}</div>\
					{{/if}}\
				{{/each}}\
				{{if (msgData.message[0].component.payload.seeMore && msgData.message[0].component.payload.listItems.length > msgData.message[0].component.payload.listItemDisplayCount) || (msgData.message[0].component.payload.listItems.length > msgData.message[0].component.payload.listItemDisplayCount)}}\
					<div class="more-tags see-more-data">${msgData.message[0].component.payload.listItems.length - msgData.message[0].component.payload.listItemDisplayCount} More <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACDSURBVHgBdY7BDYMwDEW/E+612gWs0gE6Qtmkm7ACGzADI7ABG5AJIAMgQozEIUDewQf/Z/lDdso/brAcAZmWny/289QnoY8wPzqAmrNgdeQEe1h3Ap1LaD1QMSKgMpeKxtZxDsAyJJfyLlsE+iIslXPOUy7QHeUCpRD5/LBC4o8kUDaUO0VusgMydwAAAABJRU5ErkJggg=="></div>\
				{{/if}}\
			</div>\
		{{/if}}\
	{{/if}}\
	</div>\
</li>\
	{{/if}}\
	</scipt>';

	var cardTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
	{{if msgData.message}} \
	<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
		{{if msgData.message && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.cards && msgData.message[0].component.payload.cards.length}}\
		{{each(key,card) msgData.message[0].component.payload.cards}}\
		<div class="card-template">\
			<div class="card-body" {{if (card && card.cardStyles)}}style="{{each(styleKey,style) card.cardStyles}}${styleKey} : ${style};{{/each}}"{{/if}}>\
				{{if card && card.cardHeading && (!card.cardHeading.icon && !card.cardHeading.description)}}\
					<div class="card-title" {{if card && card.cardHeading && card.cardHeading.headerStyles}}style="{{each(styleKey,style) card.cardHeading.headerStyles}}${styleKey} : ${style};{{/each}}"{{/if}}>${card.cardHeading.title}</div>\
					{{else (card && card.cardHeading && (card.cardHeading.icon || card.cardHeading.description))}}\
						<div class="card-title-block {{if card && !card.cardDescription}}left-border{{/if}}" {{if card && card.cardHeading && card.cardHeading.headerStyles}}style="{{each(styleKey,style) card.cardHeading.headerStyles}}${styleKey} : ${style};{{/each}}"{{/if}}>\
							{{if card && card.cardHeading && card.cardHeading.icon}}\
								<div class="card-block-img {{if card && card.cardHeading && card.cardHeading.iconSize}}${card.cardHeading.iconSize}{{/if}}">\
									<img src="${card.cardHeading.icon}"/>\
								</div>\
							{{/if}}\
							<div class="card-block" {{if (card && card.cardContentStyles && !card.cardDescription)}}style="{{each(styleKey,style) card.cardContentStyles}}${styleKey} : ${style};{{/each}}"{{/if}}>\
								{{if card && card.cardHeading && card.cardHeading.title}}\
										<div class="title-text">{{html helpers.convertMDtoHTML(card.cardHeading.title, "bot")}}</div>\
								{{/if}}\
								{{if card && card.cardHeading && card.cardHeading.description}}\
										<div class="title-desc">{{html helpers.convertMDtoHTML(card.cardHeading.description, "bot")}}</div>\
								{{/if}}\
							</div>\
							{{if (card && card.cardHeading && card.cardHeading.headerExtraInfo)}}\
								<span class="card-text-action" actionObj="${JSON.stringify(card.cardHeading.headerExtraInfo)}">{{if card && card.cardHeading && card.cardHeading.headerExtraInfo &&  card.cardHeading.headerExtraInfo.title}}<span class="card-action-data">${card.cardHeading.headerExtraInfo.title}</span>{{/if}}{{if (card && card.cardHeading && card.cardHeading.headerExtraInfo &&  card.cardHeading.headerExtraInfo.icon)}}<img src="${card.cardHeading.headerExtraInfo.icon}" class="icon"/>{{/if}}\
								{{if (card && card.cardHeading && card.cardHeading.headerExtraInfo && card.cardHeading.headerExtraInfo.type === "dropdown")}}\
								<ul  class="more-button-info hide" style="list-style:none;">\
										<button class="close_btn" title="Close"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
										{{if (card && card.cardHeading && card.cardHeading.headerExtraInfo && card.cardHeading.headerExtraInfo.dropdownOptions && card.cardHeading.headerExtraInfo.dropdownOptions.length)}}\
										{{each(optionKeykey, option) card.cardHeading.headerExtraInfo.dropdownOptions}} \
												<li><button class="button_" value="${option.payload}" {{if option && option.type}}type="${option.type}"{{/if}}>{{if option && option.icon}}<img src="${option.icon}">{{/if}}{{html helpers.convertMDtoHTML(option.titlen, "bot")}}</button></li>\
										{{/each}}\
										{{/if}}\
								</ul>\
								</span>\
								{{/if}}\
							{{/if}}\
						</div>\
				{{/if}}\
				{{if card && card.cardDescription && card.cardDescription.length}}\
					<div class="card-data" {{if card && card.cardContentStyles }}style="{{each(styleKey,style) card.cardContentStyles}}${styleKey} : ${style};{{/each}}"{{/if}}>\
						<div class="card-data-list {{if (card && card.cardType == "list")}}card-display-flex{{/if}}">\
						{{each(i,desc) card.cardDescription}}\
						   {{if ((card && card.cardType != "list") || card && !card.cardHeading)}}\
							<div class="card-text">\
								{{if desc && desc.icon}}\
									<span class="card-text-icon"><img src="${desc.icon}" /></span>\
								{{/if}}\
								{{if desc && desc.title}}\
									<span class="card-text-desc">{{html helpers.convertMDtoHTML(desc.title, "bot")}}</span>\
								{{/if}}\
							</div>\
							{{else (card && card.cardType == "list")}}\
								<div class="card-block-text">\
									{{if desc && desc.description}}\
										<div class="title-desc">{{html helpers.convertMDtoHTML(desc.description, "bot")}}</div>\
									{{/if}}\
									{{if desc && desc.title}}\
										<div class="title-text">{{html helpers.convertMDtoHTML(desc.title, "bot")}}</div>\
									{{/if}}\
								</div>\
							{{/if}}\
						{{/each}}\
						{{if false}}\
						<div class="card-text icon"><span class="card-text-action"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAHCAYAAAA8sqwkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABdSURBVHgBjctNDYAwDIbhNkUAoKAZCOCIHBwhASzgCAfDQelhh2Xrfr5Tkz4vgDF2y8VuPa0fWRgEDz33cZ748/4pBhEOwy2NqIztiOo4j7CN407uQTGDyNsVqP0BaHUk0IS2sYcAAAAASUVORK5CYII="></span></div>\
						{{/if}}\
						</div>\
					</div>\
					{{if card && card.buttons && card.buttons.length}}\
						<div class="card-data-btn btn-info">\
						   {{each(buttonKey,button) card.buttons}}\
								<button class="card-btn" type="${button.type}" {{if button && button.buttonStyles }}style="{{each(styleKey,style) button.buttonStyles}}${styleKey} : ${style};{{/each}}"{{/if}} title="${button.title}">{{html helpers.convertMDtoHTML(button.title, "bot")}}</button>\
							{{/each}}\
						</div>\
					{{/if}}\
				{{/if}}\
			</div>\
		</div>\
		{{/each}}\
		{{/if}}\
	</li>\
	{{/if}}\
	</script>';
	var proposeTimesTemplate = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl">\
	{{if msgData.message}}\
		<li {{if msgData.type !== "bot_response"}}id="msg_${msgItem.clientMessageId}"{{/if}} class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
		   <div class="propose-template">\
		   {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
		   {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(${msgData.icon})"></div> </div> {{/if}} \
		   {{if msgData.message && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.title}}<div class="propose-times-title"> {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.title, "bot")}}</div>{{/if}}\
			{{if msgData.message && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.elements && msgData.message[0].component.payload.elements.length}}\
				<div class="propse-times-elements">\
					{{each(key,element) msgData.message[0].component.payload.elements}}\
						<div class="element" type="${element.type}" value="${element.payload}">\
						{{html helpers.convertMDtoHTML(element.title, "bot")}}\
						</div>\
					{{/each}}\
				</div>\
			{{/if}}\
			{{if  msgData.message && msgData.message[0] && msgData.message[0].component && msgData.message[0].component.payload && msgData.message[0].component.payload.buttons && msgData.message[0].component.payload.buttons.length}}\
				<div class="action-buttons">\
					{{each(key,button) msgData.message[0].component.payload.buttons}}\
						<div class="propoese-element-button {{if button.class}}${button.class}{{/if}}" type="${button.type}" value="${button.payload}">\
						{{html helpers.convertMDtoHTML(button.title, "bot")}}\
						</div>\
					{{/each}}\
				</div>\
			{{/if}}\
			</div>\
		</li>\
	{{/if}}\
	</script>';

	var proposeActionSheetTemplate = '<script id="chat-window-listTemplate" type="text/x-jqury-tmpl">\
	<div class="propose-action-sheet-template">\
	    <div class="heading-title">Other Options</div>\
		<button class="close-button" title="Close"><img src="data:image/svg+xml;base64,           PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
		{{if msgData.message && msgData.message[0].component.payload && msgData.message[0].component.payload.moreOptions && msgData.message[0].component.payload.moreOptions.length}}\
			<div class="header-tabs">\
			    {{each(i, nav) msgData.message[0].component.payload.moreOptions}}\
				    <div class="tab-title" id="${nav.id}" actionObj="${JSON.stringify(nav)}">\
					    ${nav.title}\
					</div>\
				{{/each}}\
			</div>\
			<div class="tab-container">\
				{{if data}}\
				   <div class="tab-data id="${data.id}">\
						{{if data && data.description}}\
							${data.description}\
						{{/if}}\
						<div class="tab-content">\
						{{if data && data.elements && data.elements.length}}\
							<div class="tab-elements">\
								{{each(elementKey,element) data.elements}}\
									<div class="kr_sg_checkbox option">\
										<input id="${elementKey}" class="checkbox-custom option-input" text = "${element.title}" value="${element.value}" type="checkbox">\
										<label for="${elementKey}" class="checkbox-custom-label">{{html helpers.convertMDtoHTML(element.title, "bot")}}</label>\
									</div>\
								{{/each}}\
							</div>\
						{{/if}}\
						{{if data && data.buttons && data.buttons.length}}\
								<div class="action-buttons">\
									{{each(buttonKey,button) data.buttons}}\
										<div class="propoese-element-button {{if button.class}}${button.class}{{/if}}" type="${button.type}" title="${button.title}" value="${button.payload}">\
										{{html helpers.convertMDtoHTML(button.title, "bot")}}\
										</div>\
									{{/each}}\
								</div>\
						{{/if}}\
						</div>\
					</div>\
				{{/if}}\
			</div>\
		{{/if}}\
	</div>\
	</script>'
		if (tempType === "dropdown_template") {
			return dropdownTemplate;
		} else if (tempType === "checkBoxesTemplate") {
			return checkBoxesTemplate;
		} else if (tempType === "likeDislikeTemplate") {
			return likeDislikeTemplate;
		}else if(tempType === "formTemplate"){
            return formTemplate;
		} else if (tempType === "advancedMultiSelect") {
			return advancedMultiSelect;
		}else if (tempType === "templatelistView") {
			return listViewTemplate;
		}else if (tempType === "actionSheetTemplate") {
			return listActionSheetTemplate;
		}else if(tempType === "tableListTemplate"){
			return tableListTemplate;
		}
		else if(tempType === "advancedListTemplate"){
			return advancedListTemplate;
		} 
		else if(tempType === "cardTemplate"){
			return cardTemplate;
		}
		else if(tempType === "proposeTimes"){
			return proposeTimesTemplate;
		} 
		else if(tempType === "proposeActionSheetTemplate"){
			return proposeActionSheetTemplate;
		} 
		else {
			return "";
		}
		return "";
	}; // end of getChatTemplate method
	
	customTemplate.prototype.bindEvents = function (messageHtml) {
		chatInitialize=this.chatInitialize;
		helpers=this.helpers;
		$(messageHtml).find('.selectTemplateDropdowm').on('change', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(".chatInputBox").text(this.value)
			var k = jQuery.Event('keydown', { which: 13 });
			k.keyCode = 13
			$('.chatInputBox').trigger(k);
	
		});
		/* Inline form submit click function starts here*/
		$(messageHtml).find(".formMainComponent").on('keydown',function(e){
			if(e.keyCode==13){
		 e.preventDefault();
		 e.stopPropagation();
	       }
	    })
		$(messageHtml).find("#submit").on('click', function(e){
		var inputForm_id =$(e.currentTarget).closest('.buttonTmplContent').find(".formMainComponent .formBody");
		var parentElement = e.currentTarget.closest(".fromOtherUsers.with-icon");
		var messageData=$(parentElement).data();
		if(messageData.tmplItem.data.msgData.message[0].component.payload){
			messageData.tmplItem.data.msgData.message[0].component.payload.ignoreCheckMark=true;
			var msgData=messageData.tmplItem.data.msgData;
		}
		
		if(inputForm_id.find("#email").val()==""){
			   $(parentElement).find(".buttonTmplContent").last().find(".errorMessage").removeClass("hide");
			  $(".errorMessage").text("Please enter value");
		 }
	    else if(inputForm_id.find("input[type='password']").length!=0){
				 var textPwd= inputForm_id.find("#email").val();
				 var passwordLength=textPwd.length;
				 var selectedValue="";
				 for(var i=0;i<passwordLength;i++){
						  selectedValue=selectedValue+"*";
					 }
				  $('.chatInputBox').text(textPwd);
				  $(messageHtml).find(".formMainComponent form").addClass("hide");
		}else if(inputForm_id.find("input[type='password']").length==0){
				$('.chatInputBox').text(inputForm_id.find("#email").val());
				var selectedValue=inputForm_id.find("#email").val();
				$(messageHtml).find(".formMainComponent form").addClass("hide");
		}
		chatInitialize.sendMessage($('.chatInputBox').text(),selectedValue,msgData);
		});
		/* Inline form submit click function ends here*/
		
		/* Advanced multi select checkbox click functions starts here */
		$(messageHtml).off('click', '.closeBottomSlider').on('click', '.closeBottomSlider', function (e) {
			bottomSliderAction('hide');
		});
		$(messageHtml).off('click', '.singleSelect').on('click', '.singleSelect', function (e) {
			var parentContainer = $(e.currentTarget).closest('.listTmplContentBox');
			var allGroups = $(parentContainer).find('.collectionDiv');
			var allcheckboxs = $(parentContainer).find('.checkbox input');
			$(allGroups).removeClass('selected');
			var selectedGroup = $(e.currentTarget).closest('.collectionDiv');
			$(selectedGroup).addClass("selected");
			var groupSelectInput = $(selectedGroup).find('.groupMultiSelect input');
			if (allGroups) {
				if (allGroups && allGroups.length) {
					for (i = 0; i < allGroups.length; i++) {
						if (allGroups && !($(allGroups[i]).hasClass('selected'))) {
							var allGroupItems = $(allGroups[i]).find('.checkbox input');
							for (j = 0; j < allGroupItems.length; j++) {
								$(allGroupItems[j]).prop("checked", false);
							}
						}
					}
				}
			}
			if (selectedGroup && selectedGroup[0]) {
				var allChecked = true;
				var selectedGroupItems = $(selectedGroup).find('.checkbox.singleSelect input');
				if (selectedGroupItems && selectedGroupItems.length) {
					for (i = 0; i < selectedGroupItems.length; i++) {
						if (!($(selectedGroupItems[i]).prop("checked"))) {
							allChecked = false;
						}
					}
				}
				if (allChecked) {
					$(groupSelectInput).prop("checked", true);
				} else {
					$(groupSelectInput).prop("checked", false);
				}
			}
			var showDoneButton = false;
			var doneButton = $(parentContainer).find('.multiCheckboxBtn');
			if (allcheckboxs && allcheckboxs.length) {
				for (i = 0; i < allcheckboxs.length; i++) {
					if($(allcheckboxs[i]).prop("checked")){
						showDoneButton = true;
					}
				}
			}
			if(showDoneButton){
			   $(doneButton).removeClass('hide');
			}else{
				$(doneButton).addClass('hide');
			}
		});
		$(messageHtml).off('click', '.viewMoreGroups').on('click', '.viewMoreGroups', function (e) {
			var parentContainer = $(e.currentTarget).closest('.listTmplContentBox')
			var allGroups = $(parentContainer).find('.collectionDiv');
			$(allGroups).removeClass('hide');
			$(".viewMoreContainer").addClass('hide');
		});
		$(messageHtml).off('click', '.groupMultiSelect').on('click', '.groupMultiSelect', function (e) {
			var clickedGroup = $(e.currentTarget).find('input');
			var clickedGroupStatus = $(clickedGroup[0]).prop('checked');
			var selectedGroup = $(e.currentTarget).closest('.collectionDiv');
			var selectedGroupItems = $(selectedGroup).find('.checkbox input');
			var parentContainer = $(e.currentTarget).closest('.listTmplContentBox')
			var allcheckboxs = $(parentContainer).find('.checkbox input');
				if (allcheckboxs && allcheckboxs.length) {
					for (i = 0; i < allcheckboxs.length; i++) {
						$(allcheckboxs[i]).prop("checked", false);
					}
				}
			if (clickedGroupStatus) {
				if (selectedGroupItems && selectedGroupItems.length) {
					for (i = 0; i < selectedGroupItems.length; i++) {
						$(selectedGroupItems[i]).prop("checked", true);
					}
				}
			} else {
				if (selectedGroupItems && selectedGroupItems.length) {
					for (i = 0; i < selectedGroupItems.length; i++) {
						$(selectedGroupItems[i]).prop("checked", false);
					}
				}
			}
			var showDoneButton = false;
			var doneButton = $(parentContainer).find('.multiCheckboxBtn');
			if (allcheckboxs && allcheckboxs.length) {
				for (i = 0; i < allcheckboxs.length; i++) {
					if($(allcheckboxs[i]).prop("checked")){
						showDoneButton = true;
					}
				}
			}
			if(showDoneButton){
			   $(doneButton).removeClass('hide');
			}else{
				$(doneButton).addClass('hide');
			}
		});
		$(messageHtml).find(".multiCheckboxBtn").on('click',function(e){
				var checkboxSelection = $(e.currentTarget.parentElement).find('.checkInput:checked');
				var selectedValue = [];
				var toShowText = [];
				for (var i = 0; i < checkboxSelection.length; i++) {
					selectedValue.push($(checkboxSelection[i]).attr('value'));
					toShowText.push($(checkboxSelection[i]).attr('text'));
				}
				$('.chatInputBox').text('Here are the selected items ' + ': '+ selectedValue.toString());
				chatInitialize.sendMessage($('.chatInputBox').text(),'Here are the selected items '+': '+ toShowText.toString());
				$(messageHtml).find(".multiCheckboxBtn").hide();
				$(messageHtml).find(".advancedMultiSelectScroll").css({"pointer-events":"none"});
				$(messageHtml).find(".advancedMultiSelectScroll").css({"overflow":"hidden"});
			
		})
		/* Advanced multi select checkbox click functions ends here */
  
		/* New List Template click functions starts here*/
		$(messageHtml).off('click', '.listViewTmplContent .seeMoreList').on('click', '.listViewTmplContent .seeMoreList', function () {
			listViewTabs();
		});
		$(messageHtml).find(".listViewLeftContent").on('click', function (e) {
		 if($(this).attr('data-url')){
			var a_link = $(this).attr('data-url');
			if (a_link.indexOf("http:") < 0 && a_link.indexOf("https:") < 0) {
				a_link = "http:////" + a_link;
			}
			var _tempWin = window.open(a_link, "_blank");
		 }else{
			var _innerText= $(this).attr('data-value');
			var postBack=$(this).attr('data-title');
			chatInitialize.sendMessage($('.chatInputBox').text(_innerText), postBack);
			$(".listViewTmplContentBox").css({"pointer-events":"none"});
		 }
		 });
		/* New List Template click functions ends here*/
		$(messageHtml).off('click', '.listViewItemValue.actionLink.action,.listTableDetailsDesc').on('click', '.listViewItemValue.actionLink.action,.listTableDetailsDesc', function () {
			var _self=this;
			valueClick(_self);
		});
	}; 
	    this.addBottomSlider = function(){
		$('.kore-chat-window').remove('.kore-action-sheet');
		var actionSheetTemplate='<div class="kore-action-sheet hide">\
		<div class="actionSheetContainer"></div>\
		</div>';
		$('.kore-chat-window').append(actionSheetTemplate);
		}
		this.bottomSliderAction = function(action, appendElement){
		$(".kore-action-sheet").animate({ height: 'toggle' });
		if(action=='hide'){
		$(".kore-action-sheet").innerHTML='';
		$(".kore-action-sheet").addClass("hide");
		} else {
		$(".kore-action-sheet").removeClass("hide");
		$(".kore-action-sheet .actionSheetContainer").empty();
		setTimeout(function(){
		$(".kore-action-sheet .actionSheetContainer").append(appendElement);
		},200);
		
		}
		}
		/* Action sheet Template functions starts here*/
		this.listViewTabs = function () {
			var msgData = $("li.fromOtherUsers.with-icon.listView").data();
			if(msgData.message[0].component.payload.seeMore){
				msgData.message[0].component.payload.seeMore=false;
			   }
			var listValues = $(customTemplate.prototype.getChatTemplate("actionSheetTemplate")).tmpl({
				'msgData': msgData,
				'dataItems': msgData.message[0].component.payload.moreData.Tab1,
				'tabs': Object.keys(msgData.message[0].component.payload.moreData),
				'helpers': helpers
			});

			$($(listValues).find(".tabs")[0]).addClass("active");
			addBottomSlider();
			$(".kore-action-sheet").append(listValues);
			$(".kore-action-sheet .list-template-sheet").removeClass("hide");
			this.bottomSliderAction('show',$(".list-template-sheet"));
			$(".kore-action-sheet .list-template-sheet .displayMonth .tabs").on('click', function (e) {
				var _selectedTab = $(e.target).text();
	
				var msgData = $("li.fromOtherUsers.with-icon.listView").data();
				var viewTabValues = $(customTemplate.prototype.getChatTemplate("actionSheetTemplate")).tmpl({
					'msgData': msgData,
					'dataItems': msgData.message[0].component.payload.moreData[_selectedTab],
					'tabs': Object.keys(msgData.message[0].component.payload.moreData),
					'helpers': helpers
				});
	            $(".list-template-sheet .displayMonth").find(".tabs").removeClass("active");
				$(".list-template-sheet .displayMonth").find(".tabs[data-tabid='" + _selectedTab + "']").addClass("active");
				$(".list-template-sheet .displayListValues").html($(viewTabValues).find(".displayListValues"));
				$(".kore-action-sheet .list-template-sheet .listViewLeftContent").on('click', function () {
					var _self=this;
				    valueClick(_self);
					});
			});
			$(".kore-action-sheet .list-template-sheet .close-button").on('click', function (event) {
				bottomSliderAction('hide');
				$(".kore-action-sheet").remove();
			});
			$(".kore-action-sheet .list-template-sheet .listViewLeftContent").on('click', function () {
				var _self=this;
				valueClick(_self);
			});
		};
		this.valueClick=function(_self){
			if($(_self).attr('data-url')||$(_self).attr('url')){
				var a_link = $(_self).attr('data-url')||$(_self).attr('url');
				if (a_link.indexOf("http:") < 0 && a_link.indexOf("https:") < 0) {
					a_link = "http:////" + a_link;
				}
				var _tempWin = window.open(a_link, "_blank");
			 }else{
				var _innerText= $(_self).attr('data-value');
				var postBack=$(_self).attr('data-title');
				chatInitialize.sendMessage($('.chatInputBox').text(_innerText), postBack);
			 $(".kore-action-sheet .list-template-sheet").animate({ height: 'toggle' });
			 $(".kore-action-sheet").remove();
			 $(".listViewTmplContentBox").css({"pointer-events":"none"});
			 }
		}
		/* Action sheet Template functions ends here*/
		/* advanced List template actions start here */
	customTemplate.prototype.advancedListTemplateEvents = function (ele, msgData) {
		if (this.chatInitialize) {
			chatInitialize = this.chatInitialize;
		}
		if(this.helpers){
			helpers = this.helpers;
		}
		var me = this;
		var $ele = $(ele);
		var messageData = $(ele).data();
		if (msgData.message[0].component.payload.listViewType == "nav") {
			var navHeadersData = msgData.message[0].component.payload.navHeaders;
			if (msgData.message[0].component.payload.navHeaders && msgData.message[0].component.payload.navHeaders.length) {
				var selectedNav = msgData.message[0].component.payload.navHeaders[0];
				$ele.find('.month-tab#' + selectedNav.id).addClass('active-month');
			}
			for (var i = 0; i < navHeadersData.length; i++) {
				if (navHeadersData[i].id != selectedNav.id) {
					$ele.find('.multiple-accor-rows#' + navHeadersData[i].id).addClass('hide');
				}
			}
		}
		$ele.off('click', '.advanced-list-wrapper .callendar-tabs .month-tab').on('click', '.advanced-list-wrapper .callendar-tabs .month-tab', function (e) {
			var messageData = $(ele).data();
			var selectedTabId = e.currentTarget.id;
			if (messageData && messageData.message[0].component.payload.listViewType == "nav" && messageData.message[0].component.payload.navHeaders) {
				var navHeadersData = messageData.message[0].component.payload.navHeaders;
				for (var i = 0; i < navHeadersData.length; i++) {
					if (selectedTabId != navHeadersData[i].id) {
						if (!$ele.find('.advanced-list-wrapper .multiple-accor-rows#' + navHeadersData[i].id).hasClass('hide')) {
							$ele.find('.advanced-list-wrapper .advanced-list-wrapper .multiple-accor-rows#' + navHeadersData[i].id).addClass('hide');
							$ele.find('.advanced-list-wrapper .multiple-accor-rows#' + navHeadersData[i].id).css({ 'display': 'none' });
						}
					}
				}
				for (var i = 0; i < navHeadersData.length; i++) {
					if (navHeadersData[i].id == selectedTabId) {
						$ele.find('.advanced-list-wrapper .month-tab#' + navHeadersData[i].id).addClass('active-month');
					} else if (navHeadersData[i].id != selectedTabId) {
						$ele.find('.advanced-list-wrapper .month-tab#' + navHeadersData[i].id).removeClass('active-month')
					}
				}
			}
			if ($ele.find('.advanced-list-wrapper .multiple-accor-rows#' + selectedTabId).addClass('hide')) {
				$ele.find('.advanced-list-wrapper .multiple-accor-rows#' + selectedTabId).removeClass('hide')
				$ele.find('.advanced-list-wrapper .multiple-accor-rows#' + selectedTabId).css({ 'display': 'block' });
			}
		});
		$ele.off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option', function (e) {
			var obj = this;
			e.preventDefault();
			e.stopPropagation();
			if ($(obj).find('.option-input').attr('type') == "radio") {
				$(obj).parent().find('.option.selected-item').removeClass('selected-item')
			}
			if (!$(obj).find('.option-input').prop('checked')) {
				$(obj).find('.option-input').prop('checked', true);
				$(obj).addClass('selected-item');
			} else {
				if ($(obj).hasClass('selected-item')) {
					$(obj).removeClass('selected-item');
				}
				$(obj).find('.option-input').prop('checked', false);
			}
		});
		$ele.off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option .option-input').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option .option-input', function (e) {
			var obj = this;
			var selectedId = e.currentTarget.id;
			e.stopPropagation();
			e.preventDefault();
			if (!$('#' + selectedId).prop('checked')) {
				$('#' + selectedId).prop('checked', true);
				$(obj).parent().addClass('selected-item');
			} else {
				if ($(obj).parent().hasClass('selected-item')) {
					$(obj).parent().removeClass('selected-item');
				}
				$('#' + selectedId).prop('checked', false);
			}
		});
		$ele.off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top', function (e) {
			var obj = this;
			var parentElement = e.currentTarget.parentElement;
			var parentElementChildrenArray = parentElement.children;
			var childElementCount = parentElementChildrenArray[1].childElementCount;
			if (childElementCount > 0) {
				$(obj).find(".action-icon-acc").toggleClass("rotate-icon");
				$(obj).closest('.multiple-accor-rows').find(".accor-inner-content").toggle(300);
			}
		});
		$ele.off('click', '.advanced-list-wrapper .main-title-text-block .search-block .search_icon').on('click', '.advanced-list-wrapper .main-title-text-block .search-block .search_icon', function (e) {
			var obj = this;
			$(obj).parent().find('.input_text').removeClass('hide');
			$(obj).parent().find('.close_icon').removeClass('hide');
		});
		$ele.off('click', '.advanced-list-wrapper .main-title-text-block .search-block .close_icon').on('click', '.advanced-list-wrapper .main-title-text-block .search-block .close_icon', function (e) {
			var obj = this;
			$(obj).parent().find('.input_text').val('');
			var messageData = $(ele).data();
			if (messageData.message[0].component.payload.listViewType == "nav") {
				var selectedNav = $(obj).parent().parent().parent().find('.callendar-tabs .month-tab.active-month');
				var selectedNavId = $(selectedNav).attr('id');
				$(obj).parent().parent().parent().find('.multiple-accor-rows#' + selectedNavId).filter(function () {
					if (!$(this).hasClass('hide')) {
						$(this).css({ 'display': 'block' });
					}
				});
			} else {
				$(obj).parent().parent().parent().find('.multiple-accor-rows').filter(function () {
					if (!$(this).hasClass('hide')) {
						$(this).css({ 'display': 'block' });
					}
				});
			}
			$(obj).parent().find('.input_text').addClass('hide');
			$(obj).parent().find('.close_icon').addClass('hide');
		});
		$ele.off('click', '.advanced-list-wrapper .main-title-text-block .search-block .input_text').on("keyup", '.advanced-list-wrapper .main-title-text-block .search-block .input_text', function (e) {
			var obj = this;
			var searchText = $(obj).val().toLowerCase();
			var messageData = $(ele).data();
			if (messageData.message[0].component.payload.listViewType == "nav") {
				var selectedNav = $(obj).parent().parent().parent().find('.callendar-tabs .month-tab.active-month');
				var selectedNavId = $(selectedNav).attr('id');
				$(obj).parent().parent().parent().find('.multiple-accor-rows#' + selectedNavId).filter(function () {
					$(this).toggle($(this).find('.accor-header-top .title-text').text().toLowerCase().indexOf(searchText) > -1)
				});
			} else {
				$(obj).parent().parent().parent().find('.multiple-accor-rows').filter(function () {
					$(this).toggle($(this).find('.accor-header-top .title-text').text().toLowerCase().indexOf(searchText) > -1)
				});
			}
		});
		$ele.off('click', '.advanced-list-wrapper .main-title-text-block .filter-sort-block .sort-icon').on("click", '.advanced-list-wrapper .main-title-text-block .filter-sort-block .sort-icon', function (e) {
			var obj = this;
			var seeMoreDiv = $(obj).parent().parent().parent().find('.see-more-data');
			if (!$(obj).attr('type') || $(obj).attr('type') == "asc") {
				$(obj).attr('type', 'desc');
				if (seeMoreDiv && seeMoreDiv.length) {
					$(obj).parent().parent().parent().find('.multiple-accor-rows').sort(function (a, b) {
						if ($(a).find('.accor-header-top .title-text').text() < $(b).find('.accor-header-top .title-text').text()) {
							return -1;
						} else {
							return 1;
						}
					}).insertBefore($(obj).parent().parent().parent().find('.see-more-data'));
				} else {
					$(obj).parent().parent().parent().find('.multiple-accor-rows').sort(function (a, b) {
						if ($(a).find('.accor-header-top .title-text').text() < $(b).find('.accor-header-top .title-text').text()) {
							return -1;
						} else {
							return 1;
						}
					}).appendTo($(obj).parent().parent().parent());
				}

			} else if ($(obj).attr('type') == "desc") {
				$(obj).attr('type', 'asc');
				if (seeMoreDiv && seeMoreDiv.length) {
					$(obj).parent().parent().parent().find('.multiple-accor-rows').sort(function (a, b) {
						if ($(a).find('.accor-header-top .title-text').text() > $(b).find('.accor-header-top .title-text').text()) {
							return -1;
						} else {
							return 1;
						}
					}).insertBefore($(obj).parent().parent().parent().find('.see-more-data'));
				} else {
					$(obj).parent().parent().parent().find('.multiple-accor-rows').sort(function (a, b) {
						if ($(a).find('.accor-header-top .title-text').text() > $(b).find('.accor-header-top .title-text').text()) {
							return -1;
						} else {
							return 1;
						}
					}).appendTo($(obj).parent().parent().parent());
				}

			}
		});
		$ele.off('click', '.advanced-list-wrapper .see-more-data').on("click", '.advanced-list-wrapper .see-more-data', function (e) {
			var messageData = $(ele).data();
			if (messageData && messageData.message[0] && messageData.message[0].component && messageData.message[0].component.payload && messageData.message[0].component.payload.seeMoreAction === 'slider') {
				if ($(".list-template-sheet").length !== 0) {
					$(".list-template-sheet").remove();
				} else if ($(".list-template-sheet").length === 0) {
					if (messageData.message[0].component.payload.seeMore) {
						messageData.message[0].component.payload.seeMore = false;
						messageData.message[0].component.payload.listItemDisplayCount = msgData.message[0].component.payload.listItems.length;
					}
					if (!(msgData.message[0].component.payload.sliderView)) {
						msgData.message[0].component.payload.sliderView = true;
					}
					messageHtml = $(customTemplate.prototype.getChatTemplate("advancedListTemplate")).tmpl({
						'msgData': messageData,
						'helpers': helpers,
					});
					$(messageHtml).find(".advanced-list-wrapper .extra-info").hide();
					bottomSliderAction('show', messageHtml);
					customTemplate.prototype.advancedListTemplateEvents(messageHtml, messageData);
				}
			} else if (messageData && messageData.message[0] && messageData.message[0].component && messageData.message[0].component.payload && messageData.message[0].component.payload.seeMoreAction === 'inline') {
				if(messageData && messageData.message[0] && messageData.message[0].component && messageData.message[0].component.payload && messageData.message[0].component.payload.listViewType === 'button'){
					var hiddenElementsArray = $(ele).find('.tag-name.hide');
				}else{
					var hiddenElementsArray = $(ele).find('.multiple-accor-rows.hide');
				}
				for (var i = 0; i < hiddenElementsArray.length; i++) {
					if ($(hiddenElementsArray[i]).hasClass('hide')) {
						$(hiddenElementsArray[i]).removeClass('hide');
					}
				}
				$(ele).find('.see-more-data').addClass('hide');
			} else if (messageData && messageData.message[0] && messageData.message[0].component && messageData.message[0].component.payload && messageData.message[0].component.payload.seeMoreAction === 'modal') {
				var modal = document.getElementById('myPreviewModal');
				$(".largePreviewContent").empty();
				modal.style.display = "block";
				var span = document.getElementsByClassName("closeElePreview")[0];
				span.onclick = function () {
					modal.style.display = "none";
					$(".largePreviewContent").removeClass("addheight");
				}
				if (messageData.message[0].component.payload.seeMore) {
					messageData.message[0].component.payload.seeMore = false;
					messageData.message[0].component.payload.listItemDisplayCount = msgData.message[0].component.payload.listItems.length+1;
				}
				messageHtml = $(customTemplate.prototype.getChatTemplate("advancedListTemplate")).tmpl({
					'msgData': messageData,
					'helpers': helpers,
				});
				$(messageHtml).find(".advanced-list-wrapper .extra-info").hide();
				$(".largePreviewContent").append(messageHtml);
				$(".largePreviewContent .fromOtherUsers ").css('list-style','none');
				customTemplate.prototype.advancedListTemplateEvents(messageHtml, messageData);
			}
		});
		$ele.off('click', '.advanced-list-wrapper .close-btn').on("click", '.advanced-list-wrapper .close-btn', function (e) {
			bottomSliderAction('hide');
			e.stopPropagation();
		});
		$ele.off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-btn').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-btn', function (e) {
			var obj = this;
			e.stopPropagation();
			var actionObj = $(obj).attr('actionObj');
			var actionObjParse = JSON.parse(actionObj);
			if ((actionObjParse && actionObjParse.seeMoreAction == "dropdown") || (actionObjParse && !actionObjParse.seeMoreAction)) {
				if ($(obj).parent().find('.more-button-info')) {
					$(obj).parent().find(".more-button-info").toggle(300);
				}
			}
			else if (actionObjParse && actionObjParse.seeMoreAction == "inline") {
				var parentElemnt = $(obj).parent();
				var hiddenElementsArray = $(parentElemnt).find('.button_.hide');
				for (var i = 0; i < hiddenElementsArray.length; i++) {
					if ($(hiddenElementsArray[i]).hasClass('hide')) {
						$(hiddenElementsArray[i]).removeClass('hide')
					}
				}
				$(parentElemnt).find('.button_.more-btn').addClass('hide');
			}
			else if (actionObjParse && actionObjParse.seeMoreAction == "slider") {
				var $sliderContent = $('<div class="advancelisttemplate"></div>');
				$sliderContent.append(sliderHeader(actionObjParse))
				$sliderContent.find(".TaskPickerContainer").append(sliderContent(actionObjParse));
				if ($(".kore-action-sheet").hasClass('hide')) {
					bottomSliderAction('show', $sliderContent);
				} else {
					$(".kore-action-sheet").find('.actionSheetContainer').empty();
					$(".kore-action-sheet").find('.actionSheetContainer').append($sliderContent);
				}
				sliderButtonEvents($sliderContent);
				var modal = document.getElementById('myPreviewModal');
				modal.style.display = "none";
				$(".largePreviewContent").empty();
			}
			function sliderHeader(listItem) {
				return '<div class="TaskPickerContainer">\
				<div class="taskMenuHeader">\
				<button class="closeSheet close-button" title="Close"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button> \
				<label class="taskHeading"> '+ listItem.title + ' </label>\
				</div>'
			}
			function sliderContent(listItem) {
				var $taskContent = $('<div class="inner-btns-acc if-full-width-btn"></div>');
				if (listItem && listItem.buttons) {
					var buttonsArray = listItem.buttons;
					buttonsArray.forEach(function (button) {
						var taskHtml = $('<button class="button_" type="' + button.type + '" title="' + button.title + '" value="' + button.payload + '" ><img src="' + button.icon + '">' + button.title + '</button>');
						$taskContent.append(taskHtml)
					});
				}
				return $taskContent;
			}
			function sliderButtonEvents(sliderContent) {
				sliderContent.off('click', '.close-button').on("click", '.close-button', function (e) {
					bottomSliderAction('hide');
				});
				sliderContent.off('click', '.inner-btns-acc .button_').on('click', '.inner-btns-acc .button_', function (e) {
					var type = $(this).attr('type');
					if (type) {
						type = type.toLowerCase();
					}
					if (type == "postback" || type == "text") {
						$('.chatInputBox').text($(this).attr('actual-value') || $(this).attr('value'));
						var _innerText = $(this)[0].innerText.trim() || $(this).attr('data-value').trim();
						if ($('.largePreviewContent .advanced-list-wrapper')) {
							var modal = document.getElementById('myPreviewModal');
							$(".largePreviewContent").empty();
							modal.style.display = "none";
							$(".largePreviewContent").removeClass("addheight");
						}
						bottomSliderAction('hide');
						chatInitialize.sendMessage($('.chatInputBox').text(), _innerText);
						$ele.find(".advanced-list-wrapper").css({ "pointer-events": "none" });
					} else if (type == "url" || type == "web_url") {
						if ($(this).attr('msgData') !== undefined) {
							var msgData;
							try {
								msgData = JSON.parse($(this).attr('msgData'));
							} catch (err) {

							}
							if (msgData && msgData.message && msgData.message[0].component && (msgData.message[0].component.formData || (msgData.message[0].component.payload && msgData.message[0].component.payload.formData))) {
								if (msgData.message[0].component.formData) {
									msgData.message[0].component.payload.formData = msgData.message[0].component.formData;
								}
								chatInitialize.renderWebForm(msgData);
								return;
							}
						}
						var a_link = $(this).attr('url');
						if (a_link.indexOf("http:") < 0 && a_link.indexOf("https:") < 0) {
							a_link = "http:////" + a_link;
						}
						chatInitialize.openExternalLink(a_link);
					}
				});
			}
		});
		$ele.off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-button-info .close_btn').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-button-info .close_btn', function (e) {
			var obj = this;
			e.stopPropagation();
			if ($(obj).parent()) {
				$(obj).parent().toggle(300);
			}
		});
		$ele.off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top .btn_block.dropdown').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-header-top .btn_block.dropdown', function (e) {
			var obj = this;
			e.stopPropagation();
			if ($(obj).find('.more-button-info')) {
				$(obj).find(".more-button-info").toggle(300);
			}
		});

		$ele.off('click', '.advanced-list-wrapper .multiple-accor-rows .inner-acc-table-sec .table-sec .column-table-more').on("click", '.advanced-list-wrapper .multiple-accor-rows .inner-acc-table-sec .table-sec .column-table-more', function (e) {
			var modal = document.getElementById('myPreviewModal');
			$(".largePreviewContent").empty();
			modal.style.display = "block";
			var span = document.getElementsByClassName("closeElePreview")[0];
			span.onclick = function () {
				modal.style.display = "none";
				$(".largePreviewContent").empty();
				$(".largePreviewContent").removeClass("addheight");
			}
			var parent = $(e.currentTarget).closest('.multiple-accor-rows');
			var actionObj = $(parent).attr('actionObj');
			var parsedActionObj = JSON.parse(actionObj);
			$(".largePreviewContent").append($(buildPreviewModalTemplate(parsedActionObj)).tmpl({
				listItem: parsedActionObj
			}));
			bindModalPreviewEvents();



			function bindModalPreviewEvents() {
				if ($(".largePreviewContent")) {
					$(".largePreviewContent").find('.multiple-accor-rows').css({ 'border-bottom': '0' });
					$(".largePreviewContent").find('.accor-inner-content').css({ display: 'block' });
				}
			}

			function buildPreviewModalTemplate(listItem) {
				var modalPreview = '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
				<div class="advanced-list-wrapper img-with-title with-accordion if-multiple-accordions-list">\
					<div class="multiple-accor-rows">\
							<div class="accor-inner-content">\
									<div class="inner-acc-table-sec">\
										{{each(i,list) listItem.tableListData}}\
											{{if list.rowData && list.rowData.length}}\
												<div class="table-sec {{if listItem.type && listItem.type == "column"}}if-label-table-columns{{/if}}">\
													{{each(key,row) list.rowData}}\
															{{if !row.icon}}\
																<div class="column-table">\
																	<div class="header-name">${row.title}</div>\
																	<div class="title-name">${row.description}</div>\
																</div>\
																{{else}}\
																	<div class="column-table">\
																		<div class="labeld-img-block {{if row.iconSize}}${row.iconSize}{{/if}}">\
																			<img src="${row.icon}">\
																		</div>\
																		<div class="label-content">\
																			<div class="header-name">${row.title}</div>\
																			<div class="title-name">${row.description}</div>\
																		</div>\
																	</div>\
															{{/if}}\
													{{/each}}\
												</div>\
											{{/if}}\
										{{/each}}\
									</div>\
							</div>\
					</div>\
			</div>\
			</script>'
				return modalPreview;
			}
		});

		$ele.off('click', '.advanced-list-wrapper .button_,.advanced-list-wrapper .inner-btns-acc .button_,.advanced-list-wrapper .tags-data .tag-name,.advanced-list-wrapper .btn_group .submitBtn,.advanced-list-wrapper .btn_group .cancelBtn,.advanced-list-wrapper .details-content .text-info,.advancelisttemplate .inner-btns-acc .button_').on("click", '.advanced-list-wrapper .button_,.advanced-list-wrapper .inner-btns-acc .button_,.advanced-list-wrapper .tags-data .tag-name,.advanced-list-wrapper .btn_group .submitBtn,.advanced-list-wrapper .btn_group .cancelBtn,.advanced-list-wrapper .details-content .text-info,.advancelisttemplate .inner-btns-acc .button_', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var type = $(this).attr('type');
			if (type) {
				type = type.toLowerCase();
			}
			if (type == "postback" || type == "text") {
				$('.chatInputBox').text($(this).attr('actual-value') || $(this).attr('value'));
				var _innerText = $(this)[0].innerText.trim() || $(this).attr('data-value').trim();
				if ($('.largePreviewContent .advanced-list-wrapper')) {
					var modal = document.getElementById('myPreviewModal');
					$(".largePreviewContent").empty();
					modal.style.display = "none";
					$(".largePreviewContent").removeClass("addheight");
				}
				bottomSliderAction('hide');
				chatInitialize.sendMessage($('.chatInputBox').text(), _innerText);
				$ele.find(".advanced-list-wrapper").css({"pointer-events":"none"});
			} else if (type == "url" || type == "web_url") {
				if ($(this).attr('msgData') !== undefined) {
					var msgData;
					try {
						msgData = JSON.parse($(this).attr('msgData'));
					} catch (err) {

					}
					if (msgData && msgData.message && msgData.message[0].component && (msgData.message[0].component.formData || (msgData.message[0].component.payload && msgData.message[0].component.payload.formData))) {
						if (msgData.message[0].component.formData) {
							msgData.message[0].component.payload.formData = msgData.message[0].component.formData;
						}
						chatInitialize.renderWebForm(msgData);
						return;
					}
				}
				var a_link = $(this).attr('url');
				if (a_link.indexOf("http:") < 0 && a_link.indexOf("https:") < 0) {
					a_link = "http:////" + a_link;
				}
				chatInitialize.openExternalLink(a_link);
			}
			if (e.currentTarget.classList && e.currentTarget.classList.length > 0 && e.currentTarget.classList[0] === 'submitBtn') {
				var checkboxSelection = $(e.currentTarget.parentElement.parentElement).find('.option-input:checked')
				var selectedValue = [];
				var toShowText = [];
				for (var i = 0; i < checkboxSelection.length; i++) {
					selectedValue.push($(checkboxSelection[i]).attr('value'));
					toShowText.push($(checkboxSelection[i]).attr('text'));
				}
				if(selectedValue && selectedValue.length){
					$('.chatInputBox').text($(this).attr('title') + ': ' + selectedValue.toString());
				}else{
					$('.chatInputBox').text($(this).attr('title'));
				}
				chatInitialize.sendMessage($('.chatInputBox').text(), toShowText.toString());
				$ele.find(".advanced-list-wrapper").css({"pointer-events":"none"});
				bottomSliderAction('hide');
			}
			if (e.currentTarget.classList && e.currentTarget.classList.length > 0 && e.currentTarget.classList[0] === 'cancelBtn') {
				var checkboxSelection = $(e.currentTarget.parentElement.parentElement).find('.option-input:checked')
				var selectedValue = [];
				var toShowText = [];
				for (var i = 0; i < checkboxSelection.length; i++) {
					$(checkboxSelection[i]).prop('checked', false);
					if (checkboxSelection[i].parentElement.classList.contains('selected-item')) {
						checkboxSelection[i].parentElement.classList.remove('selected-item')
					}
				}
			}

		});
	}
	/* advanced List template actions end here */

	/* card template Events starts here */
	customTemplate.prototype.cardTemplateEvents = function (ele, msgData) {
		var _self = this;
		$(ele).off('click', '.card-template .card-body .card-text-action .card-action-data,.icon').on('click', '.card-template .card-body .card-text-action .card-action-data,.icon', function (e) {
			var obj = this;
			var actionObj = $(obj).parent().attr('actionObj');
			var actionObjParse = JSON.parse(actionObj);
			e.stopPropagation();
			if (actionObjParse.type && (actionObjParse.type == "dropdown")) {
				if ($(obj).parent().find('.more-button-info')) {
					$(obj).parent().find(".more-button-info").toggle(300);
				}
			}
		});
		$(ele).off('click', '.card-template .card-body .more-button-info .close_btn').on('click', '.card-template .card-body .more-button-info .close_btn', function (e) {
			var obj = this;
			e.stopPropagation();
			if ($(obj).parent().parent().find('.more-button-info')) {
				$(obj).parent().parent().find(".more-button-info").toggle(300);
			}
		});
	}
		/* card template Events ends here */

		/* proposeTimesTemplateBindEvents starts here */
	customTemplate.prototype.proposeTimesTemplateBindEvents = function (ele, msgData) {
		if (this.chatInitialize) {
			chatInitialize = this.chatInitialize;
		}
		if(this.helpers){
			helpers = this.helpers;
		}
		var me = this;
		var $ele = $(ele);
		var messageData = $(ele).data();
		$ele.off('click', '.action-buttons .propoese-element-button,.propose-template .propse-times-elements .element').on("click", '.action-buttons .propoese-element-button,.propose-template .propse-times-elements .element', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var type = $(this).attr('type');
			if (type) {
				type = type.toLowerCase();
			}
			if (type !== 'postback') {
				getproposeActionSheetTemplate();
				function getproposeActionSheetTemplate() {
					var msgData = $ele.data();
					var proposeAtionSheetTemplate = $(customTemplate.prototype.getChatTemplate("proposeActionSheetTemplate")).tmpl({
						'msgData': msgData,
						'data': msgData.message[0].component.payload.moreOptions[0],
						'helpers':helpers
					});
					proposeAtionSheetTemplateEvents(proposeAtionSheetTemplate, msgData)
					$(".kore-action-sheet").empty();
					$(".kore-action-sheet").append(proposeAtionSheetTemplate);
					$(".kore-action-sheet .list-template-sheet").removeClass("hide");
					var navTabsArray = $(".kore-action-sheet .propose-action-sheet-template").find('.header-tabs .tab-title');
					$(navTabsArray[0]).addClass('active-tab')
					this.bottomSliderAction('show', $(".list-template-sheet"));

					function proposeAtionSheetTemplateEvents(ele, msgData) {
						var me = this;
						$(ele).off('click', '.close-button').on("click", '.close-button', function (e) {
							me.bottomSliderAction('hide');
						});
						$(ele).off('click', '.header-tabs .tab-title').on("click", '.header-tabs .tab-title', function (e) {
							var obj = this;
							var selectedTabId = obj.getAttribute('id');
							var navTabsArray = $(ele).find('.header-tabs .tab-title');
							var actionObj = obj.getAttribute('actionObj');
							for (var i = 0; i < navTabsArray.length; i++) {
								$(navTabsArray[i]).removeClass('active-tab');
							}
							$(this).addClass('active-tab');
							var parsedActionObj = JSON.parse(actionObj);
							var proposeAtionSheetTemplate = $(customTemplate.prototype.getChatTemplate("proposeActionSheetTemplate")).tmpl({
								'msgData': msgData,
								'data': parsedActionObj,
								'helpers':helpers
							});
							//proposeAtionSheetTemplateEvents(proposeAtionSheetTemplate, msgData);
							$(".kore-action-sheet .propose-action-sheet-template .tab-container").html($(proposeAtionSheetTemplate).find(".tab-container"));
							// $(".kore-action-sheet").empty();
							// $(".kore-action-sheet").append(proposeAtionSheetTemplate);
							$(".kore-action-sheet .propose-action-sheet-template").find('#' + selectedTabId).addClass('active-tab');
						});
						$(ele).off('click', '.tab-container .tab-content .tab-elements .option').on("click", '.tab-container .tab-content .tab-elements .option', function (e) {
							var obj = this;
							e.stopPropagation();
							e.stopImmediatePropagation();
							e.preventDefault();
							if (!$(obj).find('.option-input').prop('checked')) {
								$(obj).find('.option-input').prop('checked', true);
								$(obj).addClass('selected-item');
							} else {
								if ($(obj).hasClass('selected-item')) {
									$(obj).removeClass('selected-item');
								}
								$(obj).find('.option-input').prop('checked', false);
							}
						});
						$(ele).off('click', '.tab-container .tab-content .action-buttons .s-button').on("click", '.tab-container .tab-content .action-buttons .s-button', function (e) {
							var obj = this;
							var inputElements =  $(obj).closest('.tab-content').find('.tab-elements .kr_sg_checkbox')
							for(var i=0;i<inputElements.length ; i++){
								if($(inputElements[i]).hasClass('selected-item')){
									$(inputElements[i]).removeClass('selected-item')
								}
								if($(inputElements[i]).find('.option-input').prop('checked')){
									$(inputElements[i]).find('.option-input').prop('checked',false)
								}
							}
						});
						$(ele).off('click', '.tab-container .tab-content .action-buttons .p-button').on("click", '.tab-container .tab-content .action-buttons .p-button', function (e) {
							var obj = this;
							var selectedValue = [];
							var toShowText = [];
							var inputElements =  $(obj).closest('.tab-content').find('.tab-elements .kr_sg_checkbox .option-input:checked');
                            for(var i=0;i<inputElements.length;i++){
								selectedValue.push($(inputElements[i]).attr('value'));
								toShowText.push($(inputElements[i]).attr('text'));
							}
						    if(selectedValue && selectedValue.length){
								$('.chatInputBox').text($(this).attr('title') + ': ' + selectedValue.toString());
							}else{
								$('.chatInputBox').text($(this).attr('title'));
							}
							chatInitialize.sendMessage($('.chatInputBox').text(), toShowText.toString());
							bottomSliderAction('hide');
						});
					}
				}
			}else if(type == 'postback'){
				$('.chatInputBox').text($(this).attr('actual-value') || $(this).attr('value'));
				var _innerText = $(this)[0].innerText.trim() || $(this).attr('data-value').trim();
				chatInitialize.sendMessage($('.chatInputBox').text(), _innerText);
				$ele.find('.propose-template').css({"pointer-events":"none"});
			}

		});
	}
		/* proposeTimesTemplateBindEvents ends here */
	    window.customTemplate=customTemplate;	

	return {
		addBottomSlider:addBottomSlider,
		bottomSliderAction:bottomSliderAction,
		listViewTabs:listViewTabs,
		valueClick:valueClick
	}
})($);