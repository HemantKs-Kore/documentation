(function(KoreSDK){

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
})(window.KoreSDK);