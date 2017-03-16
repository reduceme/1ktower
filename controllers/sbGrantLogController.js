app.controller('sbGrantLogController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

//    获取列表
    $scope.page = 0;
    $scope.grantList = [];
    $scope.tempStart = '';
    $scope.tempEnd = '';
    $scope.allPage = 0;
    $scope.isNext = true;
    $scope.isLast = true;
    $scope.offset = 0;
    $scope.count = 15;
    $scope.showPage = $scope.page + 1;

    $scope.tempNumber = 'aWeek';
    $scope.testNum = function (data) {
        $scope.tempNumber = data;
        console.log($scope.tempNumber);
        $scope.test();
    };

    $scope.test = function () {
        mainService.getSpecifiedTime($scope.tempNumber, $scope.startTime, $scope.endTime);
        $scope.getSbGrantLogList();
    };

    //    7日时间
    $scope.oneDay = 60 * 60 * 24 * 1000;
    $scope.getWeek = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
    };
    $scope.getWeek();

    $scope.getUrl = function () {
        $scope.urlData = "";
        var parameters = [];
        if ($scope.startTime) {
            $scope.tempStart = Date.parse(new Date($scope.startTime));
            parameters.push("start=" + Math.round($scope.tempStart / 1000));
        }
        if ($scope.endTime) {
            $scope.tempEnd = Date.parse(new Date($scope.endTime));
            parameters.push("end=" + Math.round($scope.tempEnd / 1000));
        }
        if ($scope.selectApp) {
            parameters.push("appid=" + $scope.selectApp);
        }
        if ($scope.selectChannel) {
            parameters.push("channel_id=" + $scope.selectChannel);
        }
        if ($scope.uid) {
            parameters.push("uid=" + $scope.uid);
        }
        if ($scope.selected) {
            parameters.push("sort=" + $scope.selected);
        }
        $scope.urlData = window.url + "/v1/order/console/stats/snakepay/order/admin?offset=" + $scope.offset + "&count=15&" + parameters.join("&");
    };

    $scope.getSbGrantLogList = function () {
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
            $scope.grantList = data.data;
            $scope.allPage = Math.ceil(data.total / 15);
            $scope.judgeNext();
            $scope.grantList.forEach(function (item) {
                item.created_at = mainService.timeConvert(item.created_at);
                item.uid = item.uid.toString();
            });
        }), function (data, status, config, headers) {
            alert(data.error);
        }
    };

    $scope.resetInfo = function () {
        $scope.page = 0;
        $scope.offset = 0;
        $scope.showPage = $scope.page + 1;
    };

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
        $scope.getSbGrantLogList();
        $scope.judgeNext();
    };

    //下一页
    $scope.nextPage = function () {
        $scope.page++;
        $scope.showPage = $scope.page + 1;
        $scope.offset += $scope.count;
        $scope.getSbGrantLogList();
        $scope.judgeNext();
    };

    //跳转
    $scope.goto = function () {
        $scope.offset = ($scope.showPage - 1) * 15;
        $scope.page = $scope.showPage - 1;
        $scope.getSbGrantLogList();
        $scope.judgeNext();
    };

    //    游戏下拉列表
    $scope.appList = [];
    $scope.getAppList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/apps', {
            headers: {
                'Authorization': window.__token
            },
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.appList = data.data;
            $scope.appList.push({
                "name": "全部",
                "appid": ""
            });
        })
    };
    $scope.getAppList();

    $scope.selectApp = 0;
    $scope.getSelectApp = function (data) {
        $scope.selectApp = data;
    };

    //    渠道下拉列表
    $scope.getChannelList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/channel/', {
            headers: {
                'Authorization': window.__token
            },
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.channelList = data.data;
            $scope.channelList.push({
                "name": "全部",
                "channel_id": ""
            });
        })
    };
    $scope.getChannelList();

    $scope.selectChannel = 0;
    $scope.getSelectChannel = function (data) {
        $scope.selectChannel = data;
    };

    //    指定日期查询
    $scope.oneDay = 60 * 60 * 24 * 1000;
//    当日
    $scope.getToday = function () {
        $scope.page = 0;
        $scope.today = new Date();
        $scope.today.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.today / 1000);
        $scope.now = new Date();
        $scope.endTime = mainService.timeConvert($scope.now / 1000);
        $scope.getSbGrantLogList();
    };

    //本周
    $scope.getWeek = function () {
        $scope.page = 0;
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
        $scope.getSbGrantLogList();
    };

    //30天
    $scope.getThirtieth = function () {
        $scope.page = 0;
        $scope.todayThirtieth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayThirtieth / 1000);
        $scope.thirtiethDays = new Date($scope.todayThirtieth - 29 * $scope.oneDay);
        $scope.thirtiethDays.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.thirtiethDays / 1000);
        $scope.getSbGrantLogList();
    };

    //本月
    $scope.getCurrentMonthFirst = function () {
        $scope.page = 0;
        $scope.todayMonth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayMonth / 1000);
        $scope.currentMonthFirst = new Date();
        $scope.currentMonthFirst.setDate(1);
        $scope.currentMonthFirst.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.currentMonthFirst / 1000);
        $scope.getSbGrantLogList();
    };

//    重置
    $scope.clear = function () {
        $scope.uid = '';
        $scope.grantedPeople = '';
        $scope.getWeek();
    };
//    排序
    $scope.orderList = [
        {id: 1, name: "按时间排序", value: 1},
        {id: 2, name: "按平台币数量排序", value: 2},
    ];
    $scope.selected = '1';
    $scope.selected = $scope.orderList[0].id;

    $scope.currentOrder = 1;

    $scope.orderChange = function (id) {
        $scope.currentOrder = id;
        console.log($scope.currentOrder);
    };

    $scope.orderFunc = function () {
        if ($scope.currentOrder === 1) {
            return 'created_at';
        } else if ($scope.currentOrder === 2) {
            return 'money';
        } else {
            return 'last_login_time';
        }
    };
}]);