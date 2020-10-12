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
                },
                error: function (err) {
                }
            });
        }
        
        var findlyConfig=window.KoreSDK.findlyConfig;
        var fSdk = new FindlySDK(findlyConfig);

        getJWT(findlyConfig.botOptions).then(function (res) {
            //fSdk.setJWT(res.jwt);
            fSdk.showSearch();
        }, function (errRes) {
            console.error("Failed getting JWT " + errRes)
        });

    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));