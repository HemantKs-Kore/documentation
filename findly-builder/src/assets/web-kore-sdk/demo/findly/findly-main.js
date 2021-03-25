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

        getJWT(findlyConfig.botOptions).then(function (res) {
            fSdk.configureSearchInterface(findlyConfig.botOptions, res).then( (response) => {
                console.log("res", response);
                if(response.experienceConfig.searchBarPosition === 'top'){
                    fSdk.initializeTopDown(null, null, response);
                }
                else{
                    fSdk.initialize(findlyConfig);
                    fSdk.showSearch();
                }
            })
        }, function (errRes) {
            console.error("Failed getting JWT " + errRes)
        });
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));