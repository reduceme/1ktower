app.controller('userDataController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.selectMethod = true;
    $scope.showTable = true;
    $scope.showPage = 1;
    $scope.isNext = true;
    $scope.isLast = true;

    //选择查看方式
    $scope.editView = [
        {id: 1, name: "按渠道", value: 1},
        {id: 2, name: "按游戏", value: 2}
    ];

    //账号类型
    $scope.editAccount = [
        {id: 0, name: "全部", value: 0},
        {id: 1, name: "游客账号", value: 1},
        {id: 2, name: "贪玩蛇账号", value: 2},
        {id: 3, name: "手机账号", value: 3},
        {id: 4, name: "管理员账号", value: 4},
        {id: 5, name: "三方平台账号", value: 5}
    ];
    $scope.selectedAccount = $scope.editAccount[0].id;

    $scope.selectAccount = 0;
    $scope.getSelectAccount = function (id) {
        $scope.selectAccount = id;
    };

    //账号字典
    $scope.accountDic = {
        '1': '游客账号',
        '2': '贪玩蛇账号',
        '3': '手机账号',
        '4': '管理员账号',
        '5': '三方平台账号'
    };

    //全选
    $scope.selectedAll = [
        {
            "name": "全选",
            "isSelected": false,
            "flag": false
        }
    ];

    $scope.postSelectList = [];
    $scope.getAll = function (data) {
        data = !data;
        $scope.postSelectList = [];
        if (data === false) {
            for (var i in $scope.selectList) {
                $scope.selectList[i].isSelected = true;
                $scope.pushShowTable(i);
            }
        } else {
            for (var i in $scope.selectList) {
                $scope.selectList[i].isSelected = false;
                $scope.selectedChannelList = [];
            }
        }
        for (var i in $scope.selectedChannelList) {
            $scope.postSelectList.push($scope.selectedChannelList[i].id.toString())
        }
    };

    $scope.selectedChannelList = [];
    $scope.pushShowTable = function (item) {
        $scope.selectedChannelList.push({
            id: $scope.selectList[item].id
        });
    };

    $scope.getChanged = function () {
        $scope.selectedChannelList = [];
        $scope.postSelectList = [];
        for (var i in $scope.selectList) {
            if ($scope.selectList[i].isSelected) {
                $scope.pushShowTable(i);
            }
        }
        for (var i in $scope.selectedChannelList) {
            $scope.postSelectList.push($scope.selectedChannelList[i].id.toString())
        }
    };



    $scope.selectView = "";
    $scope.method = "选择渠道";
    $scope.getSelectView = function (id) {
        $scope.selectView = id;
        $scope.selectMethod = false;
        if ($scope.selectView == 1) {
            $scope.method = "选择渠道";
            $scope.getChannelList();
            $scope.showTable = true;
        } else {
            $scope.method = "选择游戏";
            $scope.getAppList();
            $scope.showTable = false;
        }
        $scope.postSelectList = [];
    };

    $scope.selectMethodId = "";
    $scope.getSelectMethodId = function (id) {
        $scope.selectMethodId = id;
    };

    //获取渠道下拉列表
    $scope.selectList = [];
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
            $scope.selectList = data.data;
            $scope.selectList.forEach(function (item) {
                item.id = item.channel_id;
            });
        })
    };

    //获取游戏下拉列表
    $scope.getAppList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/apps/', {
            headers: {
                'Authorization': window.__token
            },
        }).then(function (response) {
            if (response.code > 0) {
                alert(response.error);
                return;
            }
            var data = JSONbig.parse(response.data);
            $scope.selectList = data.data;
            $scope.selectList.forEach(function (item) {
                item.id = item.appid;
            });
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };

    //初始化时间函数
    $scope.oneDay = 60 * 60 * 24 * 1000;
    $scope.initTime = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
    };
    $scope.initTime();

    //    排序
    $scope.orderList = [
        {id: 1, name: "充值总额", value: 1},
        {id: 7, name: "登陆次数", value: 7},
        {id: 6, name: "账户注册时间", value: 6}
    ];

    $scope.selected = $scope.orderList[0].id;

    $scope.currentOrder = 1;
    $scope.orderChange = function (id) {
        $scope.currentOrder = id;
    };

    $scope.order = {
        '1': 'total_money',
        '2': 'money',
        '3': 'last_login_time',
        '4': 'time'
    };

    //上一页
    $scope.lastPage = function () {
        if ($scope.showPage <= ($scope.allPage) && $scope.showPage > 1) {
            $scope.showPage--;
            $scope.isNext = false;
            $scope.show = $scope.result[$scope.showPage - 1];
            if ($scope.showPage <= 1) {
                $scope.isLast = true;
            }
        }
    };

    //下一页
    $scope.nextPage = function () {
        if ($scope.showPage < ($scope.allPage) && $scope.showPage >= 1) {
            $scope.showPage++;
            $scope.isLast = false;
            $scope.show = $scope.result[$scope.showPage - 1];
            if ($scope.showPage >= $scope.allPage) {
                $scope.isNext = true;
            }
        }
    };

    //判断条件
    $scope.judgeNext = function () {
        if ($scope.allPage > 1) {
            $scope.isNext = false;
        }
        if ($scope.allPage >= 2) {
            $scope.isLast = false;
        }
    };


    //跳转
    $scope.goto = function () {
        if ($scope.showPage <= ($scope.allPage) && $scope.showPage > 0) {
            $scope.show = $scope.result[$scope.showPage - 1];
            $scope.judgeNext();
        }
    };



    $scope.searchData = {
        "app_id": "",
        "channel_id": "",
        "role": '',
        "start": '',
        "end": '',
        "uid": '',
        "sort_by": ''
    };

    $scope.tmpTime = new Date();
    $scope.tmpEnd = mainService.timeConvert($scope.tmpTime / 1000);

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
        $scope.todayWeek.setHours(0, 0, 0, 0);
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 7 * $scope.oneDay);
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

    $scope.returnUserlist = [];
    $scope.getPaymentList = function () {
        $scope.showPage = 1;
        $scope.returnUserlist = [];
        if (!$scope.searchUid) {
            if ($scope.selectView === 1) {
                $scope.searchData = {
                    "app_ids": [""],
                    "channel_ids": $scope.postSelectList,
                    "role": $scope.selectAccount,
                    "start": Math.round(Date.parse(new Date($scope.startTime)) / 1000),
                    "end": Math.round(Date.parse(new Date($scope.endTime)) / 1000),
                    "uid": "",
                    "sort_by": $scope.currentOrder
                };
            } else {
                $scope.searchData = {
                    "app_ids": $scope.postSelectList,
                    "channel_ids": [""],
                    "role": $scope.selectAccount,
                    "start": Math.round(Date.parse(new Date($scope.startTime)) / 1000),
                    "end": Math.round(Date.parse(new Date($scope.endTime)) / 1000),
                    "uid": "",
                    "sort_by": $scope.currentOrder,
                };
            }
        } else {
            $scope.searchData = {
                "app_ids": [],
                "channel_id": [],
                "role": 0,
                "start": 0,
                "end": Math.round(Date.parse(new Date($scope.tmpEnd)) / 1000),
                "uid": $scope.searchUid,
                "sort_by": 0
            };
        }

        $http({
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': window.__token
            },
            url: window.url + '/v1/sdk/stats/user/summary/console',
            data: $scope.searchData
        }).success(function (data, status, config, headers) {
            data = JSONbig.parse(data);
            if (data.code > 0) {
                alert("查询失败！");
                return;
            }
            $scope.returnUserlist = data.data;

            $scope.returnUserlist.forEach(function (item) {
                item.uid = item.uid.toString();
                item.role = $scope.accountDic[item.role];
                item.login_at = mainService.timeConvert(item.login_at);
                item.register_at = mainService.timeConvert(item.register_at);
            });

            $scope.result = [];
            for (var i = 0, len = $scope.returnUserlist.length; i < len; i += 15) {
                $scope.result.push($scope.returnUserlist.slice(i, i + 15));
            }

            $scope.allPage = $scope.result.length;
            $scope.show = $scope.result[$scope.showPage - 1];
            $scope.judgeNext();
        }).error(function (data, status, config, headers) {
            alert(data.error);
        })
    };
}]);