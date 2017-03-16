app.controller('channelDataController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.showTable = true;
    $scope.channelFlag = 0;         //1:各渠道总和、2:单渠道分天
    $scope.selectChannel = true;
    $scope.idSearched = true;
    $scope.showPage = 1;
    $scope.isNext = true;
    $scope.isLast = true;

    $scope.selectedAll = [
        {
            "name"      : "全选",
            "isSelected": false,
            "flag"      : false
        }
    ];

    $scope.getAll = function (data) {
        data = !data;
        $scope.selectedChannelList = [];
        $scope.postChannelId = [];
        if (data === false) {
            for (var i in $scope.channelList) {
                $scope.channelList[i].isSelected = true;
                $scope.pushShowTable(i);
            }
            if ($scope.selectedChannelList.length != 0) {
                $scope.idSearched = false;
            }
            for (var i in $scope.selectedChannelList) {
                $scope.postChannelId.push($scope.selectedChannelList[i].channel_id.toString());
            }
        } else {
            for (var i in $scope.channelList) {
                $scope.channelList[i].isSelected = false;
                $scope.selectedChannelList = [];
                $scope.postChannelId = [];
            }
        }
    };

    $scope.isBtn = function () {
        if ($scope.channelFlag == 0) {
            $scope.selectChannel = true;
        } else {
            $scope.selectChannel = false;
        }
    };
    $scope.isBtn();
    //选择查看方式
    $scope.editView = [
        {id: 4, name: "各渠道总和", value: 4},
        {id: 3, name: "单渠道分天", value: 3}
    ];

    $scope.selectView = 0;

    $scope.getSelectView = function (id) {
        $scope.selectChannel = false;
        $scope.selectView = id;
        $scope.selectedChannelList = [];
        $scope.idSearched = true;
        $scope.channelList.forEach(function (item) {
            item.isSelected = false;
            item.isDisabled = false;
        });
        if ($scope.selectView == 3) {
            $scope.channelFlag = 2;
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
            $scope.channelFlag = 1;
            $scope.showTable = false;
        }
    };

//    游戏下拉列表
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

//    判断选中游戏
    $scope.selectApp = [];
    $scope.getSelectApp = function (data) {
        $scope.selectApp = [];
        $scope.selectApp.push(data.toString());
    };

//    渠道下拉列表
    $scope.getChannelList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/channel/', {
            headers: {
                'Authorization': window.__token
            }
        }).then(function (response) {
            if (response.code > 0) {
                alert(response.error);
                return;
            }
            var data = JSONbig.parse(response.data);
            $scope.channelList = data.data;
            $scope.channelList.forEach(function (item) {
                item.isSelected = false;
                item.isDisabled = false;
            });
        })
    };
    $scope.getChannelList();

//      判断选中
    $scope.selectedChannelList = [];
    $scope.postChannelId = [];
    $scope.pushShowTable = function (item) {
        $scope.selectedChannelList.push({
            channel_id: $scope.channelList[item].channel_id
        });
        if($scope.selectedChannelList.length > 0){
            $scope.idSearched = false;
        }
    };

    $scope.getSelectedChannelList = function () {
        var temp;
        $scope.postChannelId = [];

        //判断各渠道总和选中
        if ($scope.channelFlag == 1) {
            $scope.selectedChannelList = [];
            for (var i in $scope.channelList) {
                if ($scope.channelList[i].isSelected) {
                    $scope.pushShowTable(i);
                }
            }
        }

        //判断单渠道分天选中
        if ($scope.channelFlag == 2) {
            $scope.selectedChannleList = [];
            $scope.result = [];
            for (var i in $scope.channelList) {
                if ($scope.channelList[i].isSelected) {
                    $scope.pushShowTable(i);
                    temp = $scope.channelList[i];
                }
                $scope.channelList[i].isDisabled = !$scope.channelList[i].isDisabled;
            }

            if (!!temp) {
                temp.isDisabled = false;
            }
            if (!temp) {
                $scope.channelList.forEach(function (item) {
                    item.isDisabled = false;
                })
            }
        }

        $scope.postChannelId = [];
        for (var i in $scope.selectedChannelList) {
            $scope.postChannelId.push($scope.selectedChannelList[i].channel_id.toString());
        }
    };

    $scope.getChanged = function () {
        $scope.selectedChannelList = [];
        $scope.getSelectedChannelList();
        if ($scope.selectedChannelList != []) {
            $scope.idSearched = false;
        }
    };

    $scope.search = function () {
        if ($scope.channelFlag == 1) {
            $scope.getChannelDataList();
        } else {
            $scope.getSingleChannelDataList();
        }
    };

    //初始化时间
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
//    当日
    $scope.getToday = function () {
        $scope.today = new Date();
        $scope.today.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.today / 1000);
        $scope.now = new Date();
        $scope.endTime = mainService.timeConvert($scope.now / 1000);
        $scope.getChannelList();
    };

    //本周
    $scope.getWeek = function () {
        $scope.todayWeek = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayWeek / 1000);
        $scope.lastWeek = new Date($scope.todayWeek - 6 * $scope.oneDay);
        $scope.lastWeek.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.lastWeek / 1000);
        $scope.getChannelList();
    };

    //30天
    $scope.getThirtieth = function () {
        $scope.todayThirtieth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayThirtieth / 1000);
        $scope.thirtiethDays = new Date($scope.todayThirtieth - 29 * $scope.oneDay);
        $scope.thirtiethDays.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.thirtiethDays / 1000);
        $scope.getChannelList();
    };

    //本月
    $scope.getCurrentMonthFirst = function () {
        $scope.todayMonth = new Date();
        $scope.endTime = mainService.timeConvert($scope.todayMonth / 1000);
        $scope.currentMonthFirst = new Date();
        $scope.currentMonthFirst.setDate(1);
        $scope.currentMonthFirst.setHours(0, 0, 0, 0);
        $scope.startTime = mainService.timeConvert($scope.currentMonthFirst / 1000);
        $scope.getChannelList();
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
        if ($scope.showPage <= ($scope.allPage) && $scope.showPage >= 1) {
            $scope.show = $scope.result[$scope.showPage - 1];
            $scope.judgeNext();
        }
    };

    //排序方式
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

    $scope.returnAppList = [];
    $scope.result = [];
    $scope.addAppList = [];
    $scope.returnChannelList = [];
    $scope.getChannelList = function () {
        $scope.showPage = 1;
        $scope.addAppList = [];
        $http({
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization': window.__token
            },
            method : 'post',
            url    : window.url + '/v1/sdk/stats/channel/summary/console',
            data   : {
                "stats_for"  : $scope.selectView,
                "app_ids"    : $scope.selectApp,
                "channel_ids": $scope.postChannelId,
                "start"      : Math.round(Date.parse(new Date($scope.startTime)) / 1000),
                "end"        : Math.round(Date.parse(new Date($scope.endTime)) / 1000),
                "sort_by"    : $scope.currentOrder
            }
        }).success(function (data, status, headers, config) {
            data = JSONbig.parse(data);
            if (data.code > 0) {
                alert(data.code);
                return;
            }
            $scope.returnChannelList = data.data;

            for (var i in $scope.returnChannelList) {
                if ($scope.returnChannelList[i].account_inc != 0) {
                    $scope.returnChannelList[i].reg_paid_account_inc_rate = ($scope.returnChannelList[i].paid_account_inc / $scope.returnChannelList[i].account_inc).toFixed(2);
                } else {
                    $scope.returnChannelList[i].reg_paid_account_inc_rate = 0.00;
                }
                $scope.returnChannelList[i].start = mainService.timeConvert($scope.returnChannelList[i].start);
            }

            $scope.result = [];
            if (!$scope.showTable) {
                for (var i = 0, len = $scope.returnChannelList.length; i < len; i += 15) {
                    $scope.result.push($scope.returnChannelList.slice(i, i + 15));
                }
            } else {
                // $scope.returnChannelList.sort(mainService.by("start"));
                for (var i in $scope.returnChannelList) {
                    if ($scope.returnChannelList[i].account_inc != 0) {
                        $scope.returnChannelList[i].reg_paid_account_inc_rate = ($scope.returnChannelList[i].paid_account_inc / $scope.returnChannelList[i].account_inc).toFixed(2);
                    } else {
                        $scope.returnChannelList[i].reg_paid_account_inc_rate = 0.00;
                    }
                }
                for (var i = 0, len = $scope.returnChannelList.length; i < len; i += 15) {
                    $scope.result.push($scope.returnChannelList.slice(i, i + 15));
                }
            }

            $scope.allPage = $scope.result.length;
            $scope.show = $scope.result[$scope.showPage - 1];
            $scope.judgeNext();

        }).error(function (data, status, headers, config) {
            alert("查询失败！");
        })
    }
}]);