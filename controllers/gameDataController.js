app.controller('gameDataController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.showTable = true;
    $scope.appFlag = 0;
    $scope.selectApp = true;
    $scope.idSearched = true;
    $scope.showPage = 1;
    $scope.isNext = true;
    $scope.isLast = true;

    //选中全部
    $scope.selectedAll = [
        {
            "name": "全选",
            "isSelected": false,
            "flag": false
        }
    ];

    $scope.getAll = function (data) {
        data = !data;
        $scope.selectedAppList = [];
        $scope.postselectedAppList = [];
        if (data === false) {
            for (var i in $scope.appList) {
                $scope.appList[i].isSelected = true;
                $scope.pushShowTable(i);
            }
            if ($scope.selectedAppList != 0) {
                $scope.idSearched = false;
            }
            for (var i in $scope.selectedAppList) {
                $scope.postselectedAppList.push($scope.selectedAppList[i].appid.toString());
            }
        } else {
            for (var i in $scope.appList) {
                $scope.appList[i].isSelected = false;
                $scope.selectedAppList = [];
                $scope.postselectedAppList = [];
            }
        }
    };

    $scope.isBtn = function () {
        if ($scope.appFlag == 0) {
            $scope.selectApp = true;
        } else {
            $scope.selectApp = false;
        }
    };
    $scope.isBtn();

    //选择查看方式
    $scope.editView = [
        {id: 2, name: "各游戏总和", value: 2},
        {id: 1, name: "单游戏分天", value: 1}
    ];

    $scope.selectView = 0;
    $scope.getSelectView = function (id) {
        $scope.selectApp = false;
        $scope.selectView = id;
        $scope.selectedAppList = [];
        $scope.idSearched = true;
        $scope.appList.forEach(function (item) {
            item.isSelected = false;
            item.isDisabled = false;
        });
        if ($scope.selectView == 1) {
            $scope.appFlag = 1;
            $scope.showTable = true;
            $scope.selectedAll.forEach(function (item) {
                item.flag = true;
                item.isSelected = false;
            });
        } else {
            $scope.selectedAll.forEach(function (item) {
                item.flag = false;
                item.isSelected = false;
            });
            $scope.appFlag = 1;
            $scope.showTable = false;
        }
    };

    //获取游戏列表
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
            $scope.appList.forEach(function (item) {
                item.isSelected = false;
                item.isDisabled = false;
            });
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };
    $scope.getAppList();

    //判断选中
    $scope.pushShowTable = function (item) {
        $scope.selectedAppList.push({
            appid: $scope.appList[item].appid,
            name: $scope.appList[item].name,
            appkey: $scope.appList[item].appkey,
            extra: $scope.appList[item].extra
        });
        if($scope.selectedAppList.length > 0){
            $scope.idSearched = false;
        }
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
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };
    $scope.getChannelList();

    $scope.selectChannel = [];
    $scope.getSelectChannel = function (data) {
        $scope.selectChannel = [];
        $scope.selectChannel.push(data.toString());
    };

    $scope.selectedAppList = [];
    $scope.postselectedAppList = [];
    $scope.getSelectedAppList = function () {
        var temp;
        $scope.selectedAppList = [];
        $scope.result = [];
        //判断各游戏总和选中
        if ($scope.appFlag == 1) {
            for (var i in $scope.appList) {
                if ($scope.appList[i].isSelected) {
                    $scope.pushShowTable(i);
                }
            }
        }
        //判断游戏分天显示
        if ($scope.appFlag == 2) {
            $scope.selectedAppList = [];
            $scope.result = [];
            for (var i in $scope.appList) {
                if ($scope.appList[i].isSelected) {
                    $scope.pushShowTable(i);
                    temp = $scope.appList[i];
                }
                $scope.appList[i].isDisabled = !$scope.appList[i].isDisabled;
            }
            if (!!temp) {
                temp.isDisabled = false;
            }
            if (!temp) {
                $scope.appList.forEach(function (item) {
                    item.isDisabled = false;
                })
            }
        }

        $scope.postselectedAppList = [];
        for (var i in $scope.selectedAppList) {
            $scope.postselectedAppList.push($scope.selectedAppList[i].appid.toString());
        }
    };

    $scope.getChanged = function () {
        $scope.getSelectedAppList();
        if ($scope.selectedAppList != []) {
            $scope.idSearched = false;
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

    //    当日
    $scope.getToday = function () {
        $scope.today = new Date();
        $scope.today.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.today / 1000);
        $scope.now = new Date();
        $scope.endTime = mainService.timeConvert($scope.now / 1000);
        $scope.getAppDataList();
    };

    //本周
    $scope.getWeek = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
        $scope.getAppDataList();
    };

    //30天
    $scope.getThirtieth = function () {
        $scope.todayThirtieth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayThirtieth / 1000);
        $scope.thirtiethDays = new Date($scope.todayThirtieth - 29 * $scope.oneDay);
        $scope.thirtiethDays.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.thirtiethDays / 1000);
        $scope.getAppDataList();
    };

    //本月
    $scope.getCurrentMonthFirst = function () {
        $scope.todayMonth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayMonth / 1000);
        $scope.currentMonthFirst = new Date();
        $scope.currentMonthFirst.setDate(1);
        $scope.currentMonthFirst.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.currentMonthFirst / 1000);
        $scope.getAppDataList();
    };
    //    排序
    $scope.orderList = [
        {id: 0, name: "时间", value: 0},
        {id: 1, name: "总充值金额", value: 1},
        {id: 2, name: "总充值人数", value: 2},
        {id: 4, name: "新增用户", value: 4}
    ];
    $scope.selected = $scope.orderList[0].id;

    $scope.order = {
        '1': 'total_money',
        '2': 'money',
        '3': 'last_login_time',
        '4': 'time'
    };

    $scope.currentOrder = 0;

    $scope.orderChange = function (id) {
        $scope.currentOrder = id;
    };

    //上一页
    $scope.lastPage = function () {
        if ($scope.showPage <= $scope.allPage && $scope.showPage > 1) {
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

    $scope.returnAppList = [];
    $scope.result = [];
    $scope.addChannelList = {};
    $scope.getAppDataList = function () {
        $scope.showPage = 1;
        $scope.addChannelList = [];
        $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': window.__token
            },
            method: 'post',
            url: window.url + '/v1/sdk/stats/app/summary/console',
            data: {
                "stats_for": $scope.selectView,
                "app_ids": $scope.postselectedAppList,
                "channel_ids": $scope.selectChannel,
                "start": Math.round(Date.parse(new Date($scope.startTime)) / 1000),
                "end": Math.round(Date.parse(new Date($scope.endTime)) / 1000),
                "sort_by": $scope.currentOrder
            }
        }).success(function (data, status, config, headers) {
            data = JSONbig.parse(data);
            if (data.code > 0) {
                alert(data.code);
                return;
            }
            $scope.returnAppList = data.data;
            // $scope.returnAppList.sort(mainService.by("start"));

            for (var i in $scope.returnAppList) {
                if ($scope.returnAppList[i].account_inc != 0) {
                    $scope.returnAppList[i].reg_paid_account_inc_rate = ($scope.returnAppList[i].paid_account_inc / $scope.returnAppList[i].account_inc).toFixed(2);
                } else {
                    $scope.returnAppList[i].reg_paid_account_inc_rate = 0;
                }
                $scope.returnAppList[i].start = mainService.timeConvert($scope.returnAppList[i].start);
            }

            $scope.result = [];
            if (!$scope.showTable) {
                for (var i = 0, len = $scope.returnAppList.length; i < len; i += 15) {
                    $scope.result.push($scope.returnAppList.slice(i, i + 15));
                }
            } else {
                // $scope.returnAppList.sort(mainService.by("start"));
                for(var i in $scope.returnAppList){
                    if ($scope.returnAppList[i].account_inc != 0) {
                        $scope.returnAppList[i].reg_paid_account_inc_rate = ($scope.returnAppList[i].paid_account_inc / $scope.returnAppList[i].account_inc).toFixed(2);
                    } else {
                        $scope.returnAppList[i].reg_paid_account_inc_rate = 0;
                    }
                }
                for (var i = 0, len = $scope.returnAppList.length; i < len; i += 15) {
                    $scope.result.push($scope.returnAppList.slice(i, i + 15));
                }
            }

            $scope.allPage = $scope.result.length;
            $scope.show = $scope.result[$scope.showPage - 1];
            $scope.judgeNext();
        }).error(function (data, status, config, headers) {
            alert(data.code);
        })
    }
}]);