app.controller('resetUserinfoController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    var uriData = window.url + "/v1/sdkusers/";



    $scope.resetPassword = function () {
        $scope.bigNum = new BigNumber($scope.uid).toString();
        console.log($scope.bigNum);

        /*var encrypt = new JSEncrypt();
        encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDH0gU8EzVkoDcKg7Eewx1OWZS5d7fc1+1D5hLOlcvZvEv2DdYXPJi9/zyE4ZptSMAFy++69h/AryCRtDRyVH6SLAlE8pTgiz7pLSgqFf54O64PKPmFmF/sC/81VV7UwdrOatPy8iuoeutiN7V3wLFb/OpOTEdeUbq8ZITfKgmtSwIDAQAB');
        var encryptedPassword = {password: $scope.newPassword};
        var encrypted = encrypt.encrypt(JSON.stringify(encryptedPassword));*/

        var hash = hex_md5($scope.newPassword);
        console.log(hash);


        $http({
            method: "put",
            url: uriData + $scope.bigNum,
            data: {
                "type": 2,
                "password": hash
            },
            headers: {
                'Authorization': window.__token
            }
        }).success(function (data, config, headers, status) {
            if (data.code > 0) {
                alert("更改失败！");
                return;
            }
            $('#changePassword').modal('hide');
            alert("更改成功！");
        }).error(function (data, config, headers, status) {
            alert(data.error);
        })
    };

    $scope.remove = function (element) {
        switch (element) {
            case 'resetUid': {
                $('#resetUid').popover('hide');
                $scope.resetUid_has_error = false;
                break;
            }
            case 'resetPassword': {
                $('#resetPassword').popover('hide');
                $scope.resetPassword_has_error = false;
                break;
            }
        }
    };

    //隐藏提示框
    $scope.removePopover = function () {
        $("[data-toggle='popover']").popover("hide");
        $scope.uid = "";
        $scope.newPassword = "";
    };

//    显示确认框
    $scope.confirmWin = function () {
        mainService.showPopover($scope.form.resetUid.$valid, $("#resetUid"), $scope.resetUid_has_error);
        mainService.showPopover($scope.form.resetPassword.$valid, $('#resetPassword'), $scope.resetPassword_has_error);
        if ($scope.form.resetUid.$valid && $scope.form.resetPassword.$valid) {
            $('#confir').modal('show');
        }
    }
}]);