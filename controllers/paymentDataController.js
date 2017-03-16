app.controller('paymentDataController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();
    //下一页相关信息
    $scope.page = 0;
    $scope.offset = 0;
    $scope.allPage = 0;
    $scope.isNext = true;
    $scope.isLast = true;
    $scope.count = 15;
    $scope.showPage = $scope.page + 1;

    $scope.oneDay = 60 * 60 * 24 * 1000;
    $scope.initTime = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
    };
    $scope.initTime();

    //    指定日期查询
    $scope.oneDay = 60 * 60 * 24 * 1000;
//    当日
    $scope.getToday = function () {
        $scope.orderID = "";
        $scope.today = new Date();
        $scope.today.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.today / 1000);
        $scope.now = new Date();
        $scope.endTime = mainService.timeConvert($scope.now / 1000);
        $scope.getPaymentList();
    };

    //本周
    $scope.getWeek = function () {
        $scope.orderID = "";
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
        $scope.getPaymentList();
    };

    //30天
    $scope.getThirtieth = function () {
        $scope.orderID = "";
        $scope.todayThirtieth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayThirtieth / 1000);
        $scope.thirtiethDays = new Date($scope.todayThirtieth - 29 * $scope.oneDay);
        $scope.thirtiethDays.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.thirtiethDays / 1000);
        $scope.getPaymentList();
    };

    //本月
    $scope.getCurrentMonthFirst = function () {
        $scope.orderID = "";
        $scope.todayMonth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayMonth / 1000);
        $scope.currentMonthFirst = new Date();
        $scope.currentMonthFirst.setDate(1);
        $scope.currentMonthFirst.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.currentMonthFirst / 1000);
        $scope.getPaymentList();
    };

    $scope.resetInfo = function () {
        $scope.page = 0;
        $scope.offset = 0;
        $scope.showPage = $scope.page + 1;
    };

    //翻页
    $scope.judgeNext = function () {
        if ($scope.page <= $scope.allPage - 2) {
            $scope.isNext = false;
        } else {
            $scope.isNext = true;
        }

        if ($scope.page == 0) {
            $scope.isLast = true;
        } else {
            $scope.isLast = false;
        }
    };

    //上一页
    $scope.lastPage = function () {
        $scope.page--;
        $scope.showPage = $scope.page + 1;
        $scope.offset -= $scope.count;
        $scope.getPaymentList();
        $scope.judgeNext();
    };

    //下一页
    $scope.nextPage = function () {
        $scope.page++;
        $scope.showPage = $scope.page + 1;
        $scope.offset += $scope.count;
        $scope.getPaymentList();
        $scope.judgeNext();
    };

    $scope.getUrl = function () {
        $scope.urlData = "";
        var parameters = [];
        if ($scope.orderID) {
            parameters.push("order_id=" + $scope.orderID);
        }
        if ($scope.startTime) {
            $scope.tempStart = Date.parse(new Date($scope.startTime));
            parameters.push("start=" + Math.round($scope.tempStart / 1000));
        }
        if ($scope.endTime) {
            $scope.tempEnd = Date.parse(new Date($scope.endTime));
            parameters.push("end=" + Math.round($scope.tempEnd / 1000));
        }
        $scope.urlData = window.url + "/v1/order/console/trade/?offset=" + $scope.offset + "&count=15&" + parameters.join("&");
    };

    $scope.getPaymentList = function () {
        $scope.getUrl();
        $http.defaults.transformResponse = [];
        $http.get($scope.urlData, {
            headers: {
                'Authorization': window.__token
            }
        }).then(function (response) {
            if (response.code > 0) {
                alert(response.error);
                return;
            }
            var data = JSONbig.parse(response.data);
            $scope.payMentList = [];
            $scope.payMentList = data.data;
            $scope.allPage = Math.ceil(data.total / 15);
            $scope.judgeNext();
            $scope.payMentList.forEach(function (item) {
                item.pay_at = mainService.timeConvert(item.pay_at);
            });
        }), function (data, status, headers, config) {
            alert(data.error);
        };
    };
    $scope.getPaymentList();

}]);