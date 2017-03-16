app.controller('sbRemainderController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.temp = {};
    $scope.key = [];
    $scope.getRemainderList = function () {
        mainService.showPopover($scope.sbRemainderForm.input_id.$valid, $('#input_id'), $scope.input_id_has_error);

        if ($scope.sbRemainderForm.input_id.$valid) {
            $scope.key = [];
            $http({
                method: "post",
                headers: {
                    "Authorization": window.__token,
                },
                url: window.url + "/v1/order/console/stats/snakepay/balance",
                data: {
                    "uids": [$scope.adminID]
                }
            }).success(function (data, status, headers, config) {
                var test = JSON.parse(data);
                $scope.temp = test.data;
                console.log($scope.temp);
                for (var k in $scope.temp) {
                    $scope.key.push({
                        key: k,
                        value: $scope.temp[k]
                    });
                }
            })
        }
    };

    $scope.clear = function () {
        $scope.adminID = "";
    };

    $scope.remove = function (element) {
        switch (element) {
            case 'input_id_has_error': {
                $('#input_id').popover('hide');
                $scope.input_id_has_error = false;
                break;
            }
        }
    }
}]);
