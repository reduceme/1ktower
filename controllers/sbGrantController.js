app.controller('sbGrantController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();
//    获取游戏下拉列表
    $scope.page = 0;
    $scope.appList = [];
    $scope.getAppList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/apps/', {
            headers: {
                'Authorization': window.__token
            }
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.appList = data.data;
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };

    $scope.selectApp = 0;
    $scope.getSelectApp = function (data) {
        $scope.selectApp = data;
        console.log($scope.selectApp);
    };

//    获取渠道下拉列表
    $scope.getChannelList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/channel/', {
            headers: {
                'Authorization': window.__token
            },
        }).then(function (response) {
            if (response.code > 0) {
                alert(response.error);
                return;
            }
            var data = JSONbig.parse(response.data);
            $scope.channelList = data.data;
            console.log($scope.channelList);
        })
    };

    $scope.selectChannel = "";
    $scope.getSelectChannel = function (data) {
        $scope.selectChannel = data;
        console.log($scope.selectChannel);
    };

//    发放平台币
    $scope.addOrder = function () {
        $scope.transCount = JSONbig.parse($scope.count);
        // $scope.transUid = JSONbig.parse($scope.uid);

        $scope.transUid = new BigNumber($scope.uid).toString();
        $http({
            method: "post",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + "/v1/order/console/snakepay/admin/" + $scope.transUid,
            data: {
                "operator": "10000001",
                "appid": $scope.selectApp,
                "channel_id": $scope.selectChannel,
                "extra": $scope.extra,
                "money": $scope.transCount
            }
        }).success(function (data, status, config, headers) {
            if (data.code > 0) {
                alert(data.error);
                return;
            }
            $('#sbGrantModal').modal('hide');
            alert("发放成功！");
        }).error(function (data, status, config, headers) {
            alert("发放失败！");
        })
    };

    $scope.remove = function (element) {
        switch (element) {
            case 'choose_app_has_error': {
                $('#choose_app').popover('hide');
                $scope.choose_app_has_error = false;
                break;
            }
            case 'choose_channel_has_error': {
                $('#choose_channel').popover('hide');
                $scope.choose_channel_has_error = false;
                break;
            }
            case 'uid_has_error': {
                $('#uid').popover('hide');
                $scope.uid_has_error = false;
                break;
            }
            case 'count_has_error': {
                $('#count').popover('hide');
                $scope.uid_has_error = false;
                break;
            }
        }
    };

    $scope.removePopover = function () {
        $("[data-toggle='popover']").popover("hide");
    };

    $scope.addCancle = function () {
        $scope.removePopover();
        $scope.uid = "";
        $scope.count = "";
        $scope.extra = "";
    };

    $scope.confirmWin = function () {
        mainService.showPopover($scope.sbGrantForm.choose_app.$valid, $('#choose_app'), $scope.sbGrantForm.choose_app.choose_app_has_error);
        mainService.showPopover($scope.sbGrantForm.choose_channel.$valid, $('#choose_channel'), $scope.sbGrantForm.choose_channel.choose_channel_has_error);
        mainService.showPopover($scope.sbGrantForm.uid.$valid, $('#uid'), $scope.sbGrantForm.uid.uid_has_error);
        mainService.showPopover($scope.sbGrantForm.count.$valid, $('#count'), $scope.sbGrantForm.count.count_has_error);

        if ($scope.sbGrantForm.choose_app.$valid && $scope.sbGrantForm.choose_channel.$valid && $scope.sbGrantForm.uid.$valid && $scope.sbGrantForm.count.$valid) {
            $('#confir').modal('show');
        }
    }
}]);