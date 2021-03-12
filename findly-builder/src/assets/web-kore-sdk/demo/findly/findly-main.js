(function ($) {

    $(document).ready(function () {
        function getJWT(options, callback) {
            var jsonData = {
                "clientId": options.clientId,
                "clientSecret": options.clientSecret,
                "identity": options.userIdentity,
                "aud": "",
                "isAnonymous": false
            };
            return $.ajax({
                url: options.JWTUrl,
                type: 'post',
                data: jsonData,
                dataType: 'json',
                success: function (data) {
                    options.assertion = data.jwt;
                    if(callback){
                      callback(null, options);                        
                    }
                },
                error: function (err) {
                }
            });
        }
        
        var findlyConfig=window.KoreSDK.findlyConfig;
        findlyConfig.botOptions.assertionFn=getJWT;
        
        var fSdk = new FindlySDK(findlyConfig);

        if(findlyConfig.botOptions.interface === 'top-down'){
            fSdk.initializeTopDown();
        }
        else{
            fSdk.initialize(findlyConfig);
            fSdk.showSearch();
        }
        // getJWT(findlyConfig.botOptions).then(function (res) {
        //     //fSdk.setJWT(res.jwt);
        //     fSdk.showSearch();
        // }, function (errRes) {
        //     console.error("Failed getting JWT " + errRes)
        // });

    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));