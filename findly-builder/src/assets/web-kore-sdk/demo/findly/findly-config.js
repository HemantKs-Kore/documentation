/*(function(KoreSDK){

    var KoreSDK=KoreSDK||{};

    var botOptionsFindly = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.koreAPIUrl = "https://qa1-bots.kore.ai";

    botOptionsFindly.JWTUrl = "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts";
    botOptionsFindly.userIdentity = 'sri.harsha@kore.com';// Provide users email id here
    botOptionsFindly.botInfo = { name: "Widget Sdk", "_id": "st-c490c315-160e-5df6-a17a-c9eeeb3de19b" }; // bot name is case sensitive
    botOptionsFindly.clientId = "cs-3c71459e-5f83-52ae-b27f-3e49602c322a";
    botOptionsFindly.clientSecret = "O2HzK1jnGSj/1L47vhxkca/4+mK7LEAJ6E2S4WEjp8g=";

    var findlyConfig = {
        botOptions: botOptionsFindly
    };
    
    KoreSDK.findlyConfig=findlyConfig
})(window.KoreSDK);*/
(function(KoreSDK){

    var KoreSDK=KoreSDK||{};

    var botOptionsFindly = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.koreAPIUrl = "https://dev.findly.ai/api/";

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
    botOptionsFindly.userIdentity = 'raj.peda@kore.com';// Provide users email id here
    botOptionsFindly.botInfo = { chatBot: "Test_channel_publish", "taskBotId": "st-2476eeca-1e5c-5854-90c3-fc5f31424f18" }; // bot name is case sensitive
    botOptionsFindly.clientId = "cs-154b0494-5814-5623-a209-4d7f81f648f4";
    botOptionsFindly.clientSecret = "SYGsaQnwelvpWaWn4YlhoRdWeLzJYMc1Qf/Fizt6IDg=";

    // To modify the web socket url use the following option
    botOptionsFindly.reWriteSocketURL = {
        protocol: 'wss',
        hostname: 'dev.findly.ai'
    };

    var findlyConfig = {
        botOptions: botOptionsFindly,
        viaSocket: true
    };
    
    KoreSDK.findlyConfig=findlyConfig
})(window.KoreSDK);