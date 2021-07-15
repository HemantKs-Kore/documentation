(function (KoreSDK) {

    var KoreSDK = KoreSDK || {};

    var botOptionsFindly = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.koreAPIUrl = "https://app.findly.ai/searchassistapi/";

    botOptionsFindly.baseAPIServer = "https://app.findly.ai";
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

    botOptionsFindly.botInfo = { chatBot: "sanity test", "taskBotId": "st-7da736a5-af23-5f9f-9187-3273e378bc38" };
    botOptionsFindly.clientId = "cs-117a67b4-2aa1-5931-aad4-c60e047c5648";
    botOptionsFindly.clientSecret = "8QQkkCkYY5Cjxdj7vGjQtCt7THhe+aCoyYHi6HEeCKc=";
    botOptionsFindly.searchIndexID = "sidx-08904a40-ff8a-5795-aedc-5295a3c8e82b";


    // To modify the web socket url use the following option

    // For Socket Connection
    botOptionsFindly.reWriteSocketURL = {
        protocol: 'wss',
        hostname: 'app.findly.ai'
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
        }, 200);
    }
    botOptionsFindly.interface = 'top-down';
    var findlyConfig = {
        botOptions: botOptionsFindly,
        viaSocket: true,
    };

    KoreSDK.findlyConfig = findlyConfig
    window.findlyConfig = findlyConfig
})(window.KoreSDK);