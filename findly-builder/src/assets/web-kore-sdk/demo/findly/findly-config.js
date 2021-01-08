(function (KoreSDK) {

    var KoreSDK = KoreSDK || {};

    var botOptionsFindly = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.koreAPIUrl = "https://dev.findly.ai/api/";
    // botOptionsFindly.koreAPIUrl = "https://pilot.findly.ai/api/";
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
    // botOptionsFindly.JWTUrl = "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts";
    // botOptionsFindly.userIdentity = 'rajasekhar.balla@kore.com';// Provide users email id here
    // botOptionsFindly.botInfo = { chatBot: "SDKBot", "taskBotId": "st-b9889c46-218c-58f7-838f-73ae9203488c","customData":{"test":"s"} }; // bot name is case sensitive
    // botOptionsFindly.clientId = "cs-1e845b00-81ad-5757-a1e7-d0f6fea227e9";
    // botOptionsFindly.clientSecret = "5OcBSQtH/k6Q/S6A3bseYfOee02YjjLLTNoT1qZDBso=";


    // botOptionsFindly.JWTUrl = "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts";
    // botOptionsFindly.userIdentity = 'saicharan.peda@kore.com';// Provide users email id here
    // botOptionsFindly.botInfo = { chatBot: "searchbot_integration", "taskBotId": "st-ab238744-2a34-59ec-86f5-a80c5641b3dc","customData":{"test":"s"} }; // bot name is case sensitive
    // botOptionsFindly.clientId = "cs-a03aafe1-431d-5c05-82c7-a6ba9f04b76e";
    // botOptionsFindly.clientSecret = "HVtUlX0LRh6fdEbBziuXQBtNkGSrrVZml+qN5RU46g8=";

    botOptionsFindly.JWTUrl = "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts";
    botOptionsFindly.userIdentity = koreGenerateUUID();// Provide users email id here

    // DEV Bot
    botOptionsFindly.botInfo = { chatBot: "test dec 3", "taskBotId": "st-7ef118e7-a43f-5bed-97a7-f2b4727587fc" }; // bot name is case sensitive
    botOptionsFindly.clientId = "cs-f5a88d48-db4d-5763-9ec8-fe2aa66ae39f";
    botOptionsFindly.clientSecret = "wJ2Gu/nL54XJmT4dNIc3X74jsXuEoxl78SQFA4aoa3I=";
    botOptionsFindly.searchIndexID = 'sidx-99a5826d-2fa0-5490-b989-1757c74a4b83';

    // PILOT Bot
    /*botOptionsFindly.botInfo = { chatBot: "Future Bank Copy", "taskBotId": "st-c877d8bd-8383-5472-ab69-8410ac17cd4d" };
    botOptionsFindly.clientId = "cs-b63967bb-0599-5ec2-8e84-8af15028f86f";
    botOptionsFindly.clientSecret = "Q9W/R5t2V03/aUtZ1O/M25ObJP5k/rQhHZPjC977o7o=";
    botOptionsFindly.searchIndexID = "sidx-a0d5b74c-ef8d-51df-8cf0-d32617d3e66e";*/

    // To modify the web socket url use the following option

    // For Socket Connection in DEV
    botOptionsFindly.reWriteSocketURL = {
        protocol: 'wss',
        hostname: 'dev.findly.ai'
    };

    // For Socket Connection in PILOT
    /*botOptionsFindly.reWriteSocketURL = {
        protocol: 'wss',
        hostname: 'pilot.findly.ai'
    };*/
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
    var findlyConfig = {
        botOptions: botOptionsFindly,
        viaSocket: true,
    };

    KoreSDK.findlyConfig = findlyConfig
})(window.KoreSDK);