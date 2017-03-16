app.controller('sbListController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();
    //下一页相关信息
    $scope.page = 0;
    $scope.offset = 0;
    $scope.allPage = 0;
    $scope.isNext = true;
    $scope.isLast = true;
    $scope.count = 15;
    $scope.showPage = $scope.page + 1;

    $scope.orderTypeDict = {
        '1': '购买代币',
        '2': '消费代币',
        '3': '第三方支付平台消费',
        '4': '管理员操作',
        '5': '支付测试'
    };

    $scope.orderStatusDict = {
        '1': '创建',
        '2': '完成',
        '3': '游戏服已确认订单'
    };

//    获取收支列表
    $scope.sbList = [];
    $scope.page = 0;
    $scope.tempStart = '';
    $scope.tempEnd = '';
    $scope.getUrl = function () {
        $scope.urlData = "";
        var parameters = [];
        if ($scope.selectIncome) {
            parameters.push("type=" + $scope.selectIncome);
        }
        if ($scope.userID) {
            parameters.push("uid=" + $scope.userID);
        }
        if ($scope.orderID) {
            parameters.push("order_id=" + $scope.orderID);
        }
        if ($scope.selectApp) {
            parameters.push("appid=" + $scope.selectApp);
        }
        if ($scope.selectChannel) {
            parameters.push("channel_id=" + $scope.selectChannel);
        }
        if ($scope.startTime) {
            $scope.tempStart = Date.parse(new Date($scope.startTime));
            parameters.push("start=" + Math.round($scope.tempStart / 1000));
        }
        if ($scope.endTime) {
            $scope.tempEnd = Date.parse(new Date($scope.endTime));
            parameters.push("end=" + Math.round($scope.tempEnd / 1000));
        }
        if($scope.selectedOrder) {
            parameters.push("sort=" + $scope.selectedOrder);
        }

        $scope.urlData = window.url + "/v1/order/console/stats/snakepay/?offset=" + $scope.offset + "&count=15&" + parameters.join("&");
    };

    $scope.resetInfo = function () {
        $scope.page = 0;
        $scope.offset = 0;
        $scope.showPage = $scope.page + 1;
    }

    $scope.getSbList = function () {
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
            $scope.sbList = [];
            $scope.sbList = data.data;
            $scope.allPage = Math.ceil(data.total / 15);
            $scope.judgeNext();
            $scope.sbList.forEach(function (item) {
                item.type = $scope.orderTypeDict[item.type];
                item.status = $scope.orderStatusDict[item.status];
                item.created_at = mainService.timeConvert(item.created_at);
            });
        }), function (data, status, headers, config) {
            alert(data.error);
        };
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
        $scope.getSbList();
        $scope.judgeNext();
    };

    //下一页
    $scope.nextPage = function () {
        $scope.page++;
        $scope.showPage = $scope.page + 1;
        $scope.offset += $scope.count;
        $scope.getSbList();
        $scope.judgeNext();
    };

//    跳转
    $scope.goto = function () {
        $scope.offset = ($scope.showPage - 1) * 15;
        $scope.page = $scope.showPage - 1;
        $scope.getSbList();
        $scope.judgeNext();
    };

//    游戏下拉列表
    $scope.appList = [];
    $scope.getAppList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/apps/', {
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
            $scope.channelList.push(
                {"name": "全部", "channel_id": ""}
            )
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };
    $scope.getChannelList();

    $scope.selectChannel = 0;
    $scope.getSelectChannel = function (data) {
        $scope.selectChannel = data;
    };

//    收支类型下拉列表
    $scope.incomeList = [
        {id: 0, name: "全部", value: 0},
        {id: 1, name: "购买代币", value: 1},
        {id: 2, name: "消费代币", value: 2},
        {id: 3, name: "第三方支付平台消费", value: 3},
        {id: 4, name: "管理员操作", value: 4},
        {id: 5, name: "支付测试", value: 5}
    ];

    $scope.selectedIncome = '0';
    $scope.selectedIncome = $scope.incomeList[0].id;


    $scope.selectIncome = 0;
    $scope.getIncome = function (id) {
        $scope.selectIncome = id;
    };

//    重置
    $scope.clear = function () {
        $scope.orderID = '';
        $scope.userID = '';
        $scope.initTime();
    };

//    指定日期查询
    $scope.oneDay = 60 * 60 * 24 * 1000;

    //初始化时间
    $scope.initTime = function () {
        $scope.todayWeek = new Date();
        $scope.todayWeek.setHours(0, 0, 0, 0);
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 7 * $scope.oneDay);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
    };
    $scope.initTime();
//    当日
    $scope.getToday = function () {
        $scope.page = 0;
        $scope.today = new Date();
        $scope.today.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.today / 1000);
        $scope.now = new Date();
        $scope.endTime = mainService.timeConvert($scope.now / 1000);
        $scope.getSbList();
    };

    //本周
    $scope.getWeek = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
        $scope.getSbList();
    };

    //30天
    $scope.getThirtieth = function () {
        $scope.todayThirtieth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayThirtieth / 1000);
        $scope.thirtiethDays = new Date($scope.todayThirtieth - 29 * $scope.oneDay);
        $scope.thirtiethDays.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.thirtiethDays / 1000);
        $scope.getSbList();
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
        $scope.getSbList();
    };

    //    排序
    $scope.orderList = [
        {id: 1, name: "按时间排序", value: 1},
        {id: 2, name: "按金额排序", value: 2}
    ];

    $scope.selectedOrder = '1';
    $scope.selectedOrder = $scope.orderList[0].id;

    $scope.currentOrder = 1;
    $scope.orderChange = function (id) {
        $scope.currentOrder = id;
    };

    $scope.orderFunc = function () {
        if ($scope.currentOrder === 1) {
            return 'created_at';
        } else if ($scope.currentOrder === 2) {
            return 'money';
        } else {
            return 'created_at';
        }
    };
}]);