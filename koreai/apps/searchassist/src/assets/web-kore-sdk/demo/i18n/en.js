

(function ($) {
    function enLangJson(data) {
      this.cfg = data;
    }
  
    enLangJson.prototype.getLang = function (structuredData) {
      var en = {
        "sa_sdk_searchAssist":	"SearchAssist ",
        "sa_sdk_powered_by": "Powered by ",
        "sa_sdk_kore_ai": "Kore.ai",
        "sa_sdk_click_here_for_chat_history": "Click here for chat history",
        "sa_sdk_sort_by": "Sort By ",
        "sa_sdk_show_more": "Show more ",
        "sa_sdk_scroll_to_top": "Scroll to top",
        "sa_sdk_sorry_we_could_not_find_any_results": "Sorry, we could not find any results",
        "sa_sdk_please_try_searching_with_another_term": "Please try searching with another term",
        "sa_sdk_recent_searches_caps": "RECENT  SEARCHES",
        "sa_sdk_suggestions": "Suggestions",
        "sa_sdk_more_results": "More Results",
        "sa_sdk_see_all": "See all",
        "sa_sdk_results": " results",
        "sa_sdk_search_results": "Search Results",
        "sa_sdk_sort_by_caps": "SORT BY",
        "sa_sdk_know_more": "Know More",
        "sa_sdk_source": "Source",
        "sa-sdk-sure-please-find-the-matched-results-below": "Sure, please find the matched results below",
        "sa-sdk-unable-to-find-results-at-this-moment": "Unable to find results at this moment",
        "sa_sdk_filters_caps": "FILTERS",
        "sa_sdk_apply": "Apply",
        "sa_sdk_clear_all": "Clear All",
        "sa_sdk_filter": "Filter",
        "sa_sdk_filters": "Filters",
        "sa_sdk_applied": "applied",
        "sa_sdk_search_again": "Search Again",
        "sa_sdk_was_this_helpful": "Was this helpful?",
        "sa_sdk_no_suggestion_found": "No suggestions found",
        "sa_sdk_no_results_found": "No results found",
        "sa_sdk_see_all_results": "See All Results",
        "sa_sdk_no_live_search_results_found": "No live search results found",
        "sa_sdk_customize": "Customize",
        "sa_sdk_preview": "Preview",
        "sa_sdk_start_customizing_your_search_results_by_hovering": "Start Customizing your search results by hovering on the matched content and performing below actions",
        "sa_sdk_boost_the_relevance_score": "Boost the relevance score",
        "sa_sdk_hide_the_search_result": "Hide the search result",
        "sa_sdk_pin_results_in_a_specific_position": "Pin results in a specific position",
        "sa_sdk_lower_the_relelavance_score": "Lower the relevance score",
        "sa_sdk_unhide": "UnHide",
        "sa_sdk_hide": "Hide",
        "sa_sdk_pin": "Pin",
        "sa_sdk_unpin": "UnPin",
        "sa_sdk_boost": "Boost",
        "sa_sdk_lower": "Lower",
        "sa_sdk_hide_caps": "HIDE",
        "sa_sdk_unhide_caps": "UNHIDE",
        "sa_sdk_pin_caps": "PIN",
        "sa_sdk_unpin_caps": "UNPIN",
        "sa_sdk_boost_caps": "BOOST",
        "sa_sdk_lower_caps": "LOWER",
        "sa_sdk_appearances": "Appearances",
        "sa_sdk_clicks": "Clicks",
        "sa_sdk_next": "Next",
        "sa_sdk_close": "Close",
        "sa_sdk_query_analytics": "Query Analytics",
        "sa_sdk_feedback": "Feedback",
        "sa_sdk_searches": "Searches",
        "sa_sdk_customize_results": "Customize Results",
        "sa_sdk_response": "Response",
        "sa_sdk_got_it": "Got it",
        "sa_sdk_previous": "Previous",
        "sa_sdk_unpinning_will_remove_the_result": "Unpinning will remove the result",
        "sa_sdk_manually_added_caps": "MANUALLY ADDED",
        "sa_sdk_pinned_caps": "PINNED",
        "sa_sdk_hidden_caps": "HIDDEN",
        "sa_sdk_boosted_caps": "BOOSTED",
        "sa_sdk_lowered_caps": "LOWERED",
        "sa_sdk_faq_response": "FAQ Response",
        "sa_sdk_web_response": "WEB Response",
        "sa_sdk_file_response": "FILE Response",
        "sa_sdk_data_response": "DATA Response",
        "sa_sdk_hi_kindly_type_in_your_query": "Hi, Kindly type in your query or choose from our list of popular search queries",
        "sa_sdk_more": "More",
        "sa_sdk_you_can_order_the_results_by_clicking": "You can order the results by clicking on this icon and dragging up and down.",
        "sa_sdk_retry_query": "Retry Query",
        "sa_sdk_reslut_templates_are_not_mapped": "Result templates are not mapped with a proper field value",
        "sa_sdk_not_finding_the_result": "Not finding the result?",
        "sa_sdk_add_from_repository": "Add from repository"
    }
      return en;
    }
    window.enLangJson = enLangJson;
  })($);