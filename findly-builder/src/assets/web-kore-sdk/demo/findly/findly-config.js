(function (KoreSDK) {

    var KoreSDK = KoreSDK || {};

    var botOptionsFindly = {};

    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.koreAPIUrl = "https://searchassist-qa.kore.ai/searchassistapi/";

    botOptionsFindly.baseAPIServer = "https://searchassist-qa.kore.ai";
    function koreGenerateUUID() {
        console.info("generating UUID");
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    botOptionsFindly.JWTUrl = "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts";
    botOptionsFindly.userIdentity = koreGenerateUUID();// Provide users email id here

    botOptionsFindly.botInfo = { chatBot: "Covid Help", "taskBotId": "st-1847ca83-3ea9-519d-bfe4-7c993c8bc477" };
    botOptionsFindly.clientId = "cs-30d2773b-0131-5e3f-b6d5-ed93cbae67c6";
    botOptionsFindly.clientSecret = "UdsX+q2hBSNVttzDoARy05zCluj9b0Ns0f2LRjmFwow=";
    botOptionsFindly.searchIndexID = "sidx-810d6e38-b522-54d3-8f2b-cdee7667fb34";


    // To modify the web socket url use the following option
    // For Socket Connection
    botOptionsFindly.reWriteSocketURL = {
        protocol: 'wss',
        hostname: 'searchassist-qa.kore.ai'
    };

    // CVS Caremark configs //
    if (window.location && window.location.href && window.location.href.includes('#cvs')) {
        botOptionsFindly.botInfo = { chatBot: "careMark", "taskBotId": "st-bd231a03-1ab7-58fb-8862-c19416471cdb" };
        botOptionsFindly.clientId = "cs-0b9dcc51-26f3-53ed-b9d9-65888e5aaaeb";
        botOptionsFindly.clientSecret = "97KKpL/OF4ees3Z69voceE1nm5FnelhxrtrwOJuRMPA=";
        botOptionsFindly.searchIndexID = "sidx-6fff8b04-f206-565c-bb02-fb13ae366fd3";
        setTimeout(function () {
            $('body').addClass('cvsCareMark');
        }, 200);
    } else if (window.location && window.location.href && window.location.href.includes('#pfizer')) {
        botOptionsFindly.botInfo = { chatBot: "Pfizer", "taskBotId": "st-8dbd1e15-1f88-5ff7-9c23-e30ac1d38212" };
        botOptionsFindly.clientId = "cs-549d8874-cf8c-5715-bce1-cb83ec4faedb";
        botOptionsFindly.clientSecret = "ZLnSvXa5fhxrRM8znYbhWOVN/yDNH8vikdIivggA6WI=";
        botOptionsFindly.searchIndexID = "sidx-d9006b59-6c8c-5a78-bcbd-00e3e0ceb9aa";
        setTimeout(function () {
            $('body').addClass('pfizer');
        }, 200);
    } else if (window.location && window.location.href && window.location.href.includes('#abtesting')) {
        // A/B Testing Bot
        botOptionsFindly.botInfo = { chatBot: "ABTesting", "taskBotId": "st-33cdc21b-dd33-5717-9cf5-945e856e4238" };
        botOptionsFindly.clientId = "cs-7cf6d5a0-f3a7-5fb2-b9ff-17ed35d6024e";
        botOptionsFindly.clientSecret = "CbhIwF1D/pddLeE7pzqkAZOdVjmPxBBIGBBTtlOETQA=";
        botOptionsFindly.searchIndexID = "sidx-abb40e90-a3da-516f-bf0d-08c914009cd7";
        setTimeout(function () {
            $('body').addClass('futureBank');
        }, 200);
    } else {
        setTimeout(function () {
            $('body').addClass('futureBank');
        }, 500);
    }
    botOptionsFindly.interface = 'top-down';
    var findlyConfig = {
        botOptions: botOptionsFindly,
        viaSocket: true,
        pickersConfig: {
            showDatePickerIcon: false, //set true to show datePicker icon
            showDateRangePickerIcon: false, //set true to show dateRangePicker icon
            showClockPickerIcon: false, //set true to show clockPicker icon
            showTaskMenuPickerIcon: true, //set true to show TaskMenu Template icon
            showradioOptionMenuPickerIcon: false //set true to show Radio Option Template icon
        }
    };

    KoreSDK.findlyConfig = findlyConfig
    window.findlyConfig = findlyConfig
})(window.KoreSDK);