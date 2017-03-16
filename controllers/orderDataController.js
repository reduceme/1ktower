app.controller('orderDataController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    //下一页相关信息
    $scope.page = 0;
    $scope.offset = 0;
    $scope.allPage = 0;
    $scope.isNext = true;
    $scope.isLast = true;
    $scope.count = 15;
    $scope.showPage = $scope.page + 1;

    $scope.new_device_count = [];

    $scope.oneDay = 60 * 60 * 24 * 1000;
    $scope.getWeek = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
    };
    $scope.getWeek();

    //获取游戏下拉列表
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
            $scope.appList.push(
                {"name": "全部", "appid": ""}
            )
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
            }
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

    $scope.selectChannel = "";
    $scope.getSelectChannel = function (data) {
        $scope.selectChannel = data;
    };

    //充值方式
    $scope.prePaid = [
        {id: 0, name: '全部', value: '', isSelected: false},
        {id: 1, name: '微信', value: 'wechat', isSelected: false},
        {id: 2, name: '支付宝', value: 'alipay', isSelected: false},
        {id: 3, name: '银联', value: 'unionpay', isSelected: false}
    ];
    $scope.selectedPrePaid = $scope.prePaid[0].value;

    $scope.prePaidList = "";
    $scope.getSelectPayWay = function (data) {
        $scope.prePaidList = data;
        console.log($scope.prePaidList);
    };

    //订单状态
    $scope.orderStatus = [
        {id: 0, name: '全部', value: 0, isSelected: false},
        {id: 1, name: '创建订单', value: 1, isSelected: false},
        {id: 2, name: '已完成未确定', value: 2, isSelected: false},
        {id: 3, name: '已确定', value: 3, isSelected: false}
    ];
    $scope.orderStatusList = $scope.prePaid[0].id;

    $scope.orderStatusList = 0;
    $scope.getSelectOrder = function (data) {
        $scope.orderStatusList = data;
        console.log($scope.orderStatusList);
    };

    //指定日期查询
    $scope.oneDay = 60 * 60 * 24 * 1000;
    //当日
    $scope.getToday = function () {
        $scope.today = new Date();
        $scope.today.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.today / 1000);
        $scope.now = new Date();
        $scope.endTime = mainService.timeConvert($scope.now / 1000);
        $scope.getOrderList();
    };

    //本周
    $scope.getWeek = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
        $scope.getOrderList();
    };

    //30天
    $scope.getThirtieth = function () {
        $scope.todayThirtieth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayThirtieth / 1000);
        $scope.thirtiethDays = new Date($scope.todayThirtieth - 29 * $scope.oneDay);
        $scope.thirtiethDays.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.thirtiethDays / 1000);
        $scope.getOrderList();
    };

    //本月
    $scope.getCurrentMonthFirst = function () {
        $scope.todayMonth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayMonth / 1000);
        $scope.currentMonthFirst = new Date();
        $scope.currentMonthFirst.setDate(1);
        $scope.currentMonthFirst.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.currentMonthFirst / 1000);
        $scope.getOrderList();
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

    $scope.resetInfo = function () {
        $scope.page = 0;
        $scope.offset = 0;
        $scope.showPage = $scope.page + 1;
    };

    //上一页
    $scope.lastPage = function () {
        $scope.page--;
        $scope.showPage = $scope.page + 1;
        $scope.offset -= $scope.count;
        $scope.getOrderList();
        $scope.judgeNext();
    };

    //下一页
    $scope.nextPage = function () {
        $scope.page++;
        $scope.showPage = $scope.page + 1;
        $scope.offset += $scope.count;
        $scope.getOrderList();
        $scope.judgeNext();
    };

    //跳转
    $scope.goto = function () {
        $scope.offset = ($scope.showPage - 1) * 15;
        $scope.page = $scope.showPage - 1;
        $scope.getOrderList();
        $scope.judgeNext();
    };

    //获取订单列表
    $scope.getUrl = function () {
        $scope.urlData = "";
        var parameters = [];
        if ($scope.orderID) {
            parameters.push('order_id=' + $scope.orderID);
        }
        if ($scope.selectApp) {
            parameters.push("appid=" + $scope.selectApp);
        }
        if ($scope.accountInfo) {
            parameters.push("uid=" + $scope.accountInfo);
        }
        if ($scope.prePaidList) {
            parameters.push("pay_by=" + $scope.prePaidList);
        }
        if ($scope.orderStatusList) {
            parameters.push("status=" + $scope.orderStatusList);
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

        $scope.urlData = window.url + "/v1/order/console/?offset=" + $scope.offset + "&count=15&" + parameters.join("&");
    };

    $scope.getUrl();

    $scope.orderStatusDict = {
        '1': '创建订单',
        '2': '已完成未确定',
        '3': '已确定'
    };

    $scope.getOrderList = function () {
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
            $scope.orderList = [];
            $scope.orderList = data.data;
            $scope.allPage = Math.ceil(data.total / 15);
            $scope.judgeNext();
            $scope.orderList.forEach(function (item) {
                // item.type = $scope.orderTypeDict[item.type];
                item.status = $scope.orderStatusDict[item.status];
                item.created_at = mainService.timeConvert(item.created_at);
            });
        }), function (data, status, headers, config) {
            alert(data.error);
        };
    };
    $scope.getOrderList();
}]);