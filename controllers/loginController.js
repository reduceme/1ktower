app.controller('loginController', function ($scope, mainService, $location) {

    $scope.login = function () {
        mainService.showPopover($scope.form.username.$valid, $('#username'), $scope.form.username.username_has_error);
        mainService.showPopover($scope.form.password.$valid, $('#password'), $scope.form.username.password_has_error);

        if ($scope.form.username.$valid && $scope.form.password.$valid) {

            var encrypt = new JSEncrypt();
            // encrypt.setPublicKey(window.__token);
            encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDH0gU8EzVkoDcKg7Eewx1OWZS5d7fc1+1D5hLOlcvZvEv2DdYXPJi9/zyE4ZptSMAFy++69h/AryCRtDRyVH6SLAlE8pTgiz7pLSgqFf54O64PKPmFmF/sC/81VV7UwdrOatPy8iuoeutiN7V3wLFb/OpOTEdeUbq8ZITfKgmtSwIDAQAB');
            var encryptedPassword = {password: $scope.password, encrypted_at: Math.round(new Date().getTime() / 1000)};
            var encrypted = encrypt.encrypt(JSON.stringify(encryptedPassword));
            mainService.login($scope.username, encrypted).then(function (result) {
                $scope.$emit('to-home', result);
                $location.path('/home');
            }, function (error) {
            })
        }
    };

    $scope.remove = function (element) {
        switch (element) {
            case 'username': {
                $('#username').popover('hide');
                $scope.username_has_error = false;
                break;
            }
            case 'password': {
                $('#password').popover('hide');
                $scope.password_has_error = false;
                break;
            }
        }
    }
});

