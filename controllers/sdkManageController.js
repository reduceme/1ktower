app.controller('sdkManageController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.update = true;
    $scope.delete = true;

    $scope.sdkList = [];
    $scope.page = 0;

    $scope.getSdkList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + "/v1/productions/console/?offset=" + $scope.page + "&count=-1&type=1", {
            headers: {
                "Authorization": window.__token
            }
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.sdkList = data.data;
            for (var i in $scope.sdkList) {
                $scope.sdkList[i].isSelected = false;
                $scope.sdkList[i].OnlineAt = mainService.timeConvert($scope.sdkList[i].OnlineAt);
            }
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };
    $scope.getSdkList();
    $scope.currency = "RMB";

    //添加sdk
    $scope.addSdk = function () {
        $scope.transPrice = new BigNumber($scope.price).toNumber();
        $scope.transReal_price = new BigNumber($scope.real_price).toNumber();

        $http({
            method: "post",
            headers: {
                "Authorization": window.__token,
                "Content-Type": "application/json"
            },
            url: window.url + "/v1/productions/",
            data: {
                "name": $scope.name,
                "extra": $scope.extra,
                "currency": $scope.currency,
                "price": $scope.transPrice,
                "real_price": $scope.transReal_price,
                "type": 1
            },
        }).success(function (data, status, config, headers) {
            if (data.code > 0) {
                alert("添加失败！");
                return
            }
            alert("添加成功！");
            $('#addSDK').modal('hide');
            $scope.getSdkList();
        }).error(function (data, status, config, headers) {
            alert("添加失败！");
        })
    };

//    判断选中
    $scope.changeStatus = function (data) {
        data = !data;
    };

    $scope.SelectedSdkList = [];
    $scope.getSelectedSdkList = function () {
        for (var i in $scope.sdkList) {
            if ($scope.sdkList[i].isSelected) {
                $scope.SelectedSdkList.push({
                    id: $scope.sdkList[i].production_id,
                    name: $scope.sdkList[i].name,
                    price: $scope.sdkList[i].price,
                    real_price: $scope.sdkList[i].real_price,
                    Extra: $scope.sdkList[i].Extra
                })
            }
        }
        if ($scope.SelectedSdkList.length === 1) {
            $scope.changeInfo.changeName = $scope.SelectedSdkList[0].name;
            $scope.changeInfo.price = $scope.SelectedSdkList[0].price;
            $scope.changeInfo.real_price = $scope.SelectedSdkList[0].real_price;
            $scope.changeInfo.Extra = $scope.SelectedSdkList[0].Extra;
        }
    };

    $scope.getChanged = function () {
        $scope.SelectedSdkList = [];
        $scope.getSelectedSdkList();

        if ($scope.SelectedSdkList.length == 1) {
            $scope.update = false;
            $scope.delete = false;
        } else {
            $scope.update = true;
            $scope.delete = true;
        }
    };

    $scope.changeInfo = {
        'changeName': '',
        'price': '',
        'real_price': '',
        'Extra': ''
    };

//    更新SDK
    $scope.updateSdk = function () {
        $scope.changeInfo.real_price = new BigNumber($scope.changeInfo.real_price).toNumber();
        $scope.changeInfo.price = new BigNumber($scope.changeInfo.price).toNumber();
        var urlData = window.url + "/v1/productions/" + $scope.SelectedSdkList[0].id;
        $http({
            method: "put",
            headers: {
                "Authorization": window.__token
            },
            url: urlData,
            data: {
                "name": $scope.changeInfo.changeName,
                "price": $scope.changeInfo.price,
                "real_price": $scope.changeInfo.real_price,
                "extra": $scope.changeInfo.Extra
            }
        }).success(function (data, status, config, headers) {
            if (data.code > 0) {
                alert("更新失败！");
                return
            }
            alert("修改成功！");
            $('#changeModal').modal('hide');
            $scope.getSdkList();
        }).error(function (data, status, config, headers) {
            alert("更改失败！");
        })
    };

    $scope.deleteSdk = function () {
        $http({
            method: "delete",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + "/v1/productions/" + $scope.SelectedSdkList[0].id,
        }).success(function (data, status, headers, config) {
            $scope.SelectedSdkList = [];
            $scope.getSdkList();
        }).error(function (data, status, headers, config) {
            alert("删除失败！");
        })
    };

    $scope.remove = function (element) {
        switch (element) {
            case 'sdk_c_name_has_error': {
                $('#sdk_c_name').popover('hide');
                $scope.sdk_c_name_has_error = false;
                break;
            }
            case 'sdk_real_price_has_error': {
                $('#sdk_real_price').popover('hide');
                $scope.sdk_real_price_has_error = false;
                break;
            }
            case 'sdk_price_has_error': {
                $('#sdk_price').popover('hide');
                $scope.sdk_price_has_error = false;
                break;
            }
            case 'transPrice': {
                $('#transPrice').popover('hide');
                $scope.transPrice_has_error = false;
                break;
            }
            case 'change_sdk_c_name_has_error': {
                $('#change_sdk_c_name').popover('hide');
                $scope.change_sdk_c_name_has_error = false;
                break;
            }
            case 'change_sdk_real_price_has_error': {
                $('#change_sdk_real_price').popover('hide');
                $scope.change_sdk_real_price_has_error = false;
                break;
            }
        }
    };

    $scope.removePopover = function () {
        $("[data-toggle='popover']").popover("hide");
    };

    $scope.addCancle = function () {
        $scope.removePopover();
        $scope.name = "";
        $scope.price = "";
        $scope.real_price = "";
        $scope.currency = "";
        $scope.extra = "";
    };

    $scope.changeCancle = function () {
        $scope.removePopover();
        $scope.changeName = "";
        $scope.change_real_price = "";
    };

    //添加确认
    $scope.confirmWin = function () {
        mainService.showPopover($scope.addSdkManageForm.sdk_c_name.$valid, $('#sdk_c_name'), $scope.addSdkManageForm.sdk_c_name.sdk_c_name_has_error);
        mainService.showPopover($scope.addSdkManageForm.sdk_real_price.$valid, $('#sdk_real_price'), $scope.addSdkManageForm.sdk_real_price.sdk_price_has_error);
        mainService.showPopover($scope.addSdkManageForm.sdk_price.$valid, $('#sdk_price'), $scope.addSdkManageForm.sdk_price.sdk_price_has_error);
        mainService.showPopover($scope.addSdkManageForm.transPrice.$valid, $('#transPrice'), $scope.addSdkManageForm.transPrice.transPrice_has_error);

        if ($scope.addSdkManageForm.sdk_c_name.$valid && $scope.addSdkManageForm.sdk_real_price.$valid && $scope.addSdkManageForm.sdk_price.$valid && $scope.addSdkManageForm.transPrice.$valid) {
            $('#confir').modal('show');
        }
    };

    //更改确认
    $scope.updateConfirmWin = function () {
        mainService.showPopover($scope.updateSdkManageForm.change_sdk_c_name.$valid, $('#change_sdk_c_name'), $scope.updateSdkManageForm.change_sdk_c_name.change_sdk_c_name_has_error);
        mainService.showPopover($scope.updateSdkManageForm.change_sdk_real_price.$valid, $('#change_sdk_real_price'), $scope.updateSdkManageForm.change_sdk_real_price.change_sdk_real_price_has_error);

        if ($scope.updateSdkManageForm.change_sdk_c_name.$valid && $scope.updateSdkManageForm.change_sdk_real_price.$valid) {
            $('#updateConfir').modal('show');
        }
    };

    //删除确认
    $scope.deleteConfirmWin = function () {
        $('#deleteConfir').modal('show');
    }
}]);
