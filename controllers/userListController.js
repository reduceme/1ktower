app.controller('userListController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.page = 0;
    $scope.offset = 0;
    $scope.allPage = 0;
    $scope.isNext = true;
    $scope.isLast = true;
    $scope.count = 15;
    $scope.showPage = $scope.page + 1;
    $scope.searchFlag = false;

    $scope.userRole = {
        '1': '游客账号',
        '2': '贪玩蛇账号',
        '3': '手机账号',
        '4': '管理员账号',
        '5': '三方平平台账号'
    };

    $scope.user_is_online = {
        '1': '离线',
        '2': '在线'
    };

    $scope.userStatus = {
        '1': '正常',
        '2': '删除',
        '3': '冻结',
        '4': '绑定'
    };

    //查询下拉列表
    $scope.displayMode = [
        {id: 1, name: "是否在线", value: 1},
        {id: 2, name: "最后在线时间", value: 2}
    ];
    $scope.selectedDisplay = '0';
    $scope.selectedDisplay = $scope.displayMode[0].id;

    $scope.currentDisplay = 1;
    $scope.change = function (id) {
        $scope.currentDisplay = id;
    };
    $scope.changePage = function () {
        $scope.offset = 0;
        $scope.page = 0;
        $scope.showPage = $scope.page + 1;
    };

    //获取用户列表
    $scope.userList = [];
    $scope.getUserList = function () {

        var urlData = window.url + '/v1/sdkusers/?offset=' + $scope.offset + '&count=15&sort=1';

        $http.defaults.transformResponse = [];
        $http.get(urlData, {
            headers: {
                'Authorization': window.__token
            }
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.allPage = Math.ceil(data.total / 15);
            $scope.userList = data.users;
            $scope.judgeNext();

            $scope.userList.forEach(function (item) {
                item.role = $scope.userRole[item.role];
                item.is_online = $scope.user_is_online[item.is_online];
                item.status = $scope.userStatus[item.status];
                item.last_login_time = mainService.timeConvert(item.last_login_time);
                item.uid = item.uid.toString();
            });
        }, function (data, status, headers, config) {
        })
    };
    $scope.getUserList();

    $scope.judgeNext = function () {
        if ($scope.page <= $scope.allPage - 2) {
            $scope.isNext = false;
        } else {
            $scope.isNext = true;
        }
        if ($scope.page < 1) {
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
        if(!$scope.searchFlag){
            $scope.getUserList();
        }else {
            $scope.searchByID();
        }
        $scope.judgeNext();
    };

    //下一页
    $scope.nextPage = function () {
        $scope.page++;
        $scope.showPage = $scope.page + 1;
        $scope.offset += $scope.count;

        if(!$scope.searchFlag){
            $scope.getUserList();
        }else {
            $scope.searchByID();
        }
        $scope.judgeNext();
    };

    //跳转
    $scope.goto = function () {
        $scope.offset = ($scope.showPage - 1) * 15;
        $scope.page = $scope.showPage - 1;
        $scope.getUserList();
        $scope.judgeNext();
    };

    //排序
    $scope.orderList = [
        {id: 0, name: "全部", value: 0},
        {id: 1, name: "游客账号", value: 1},
        {id: 2, name: "贪玩蛇账号", value: 2},
        {id: 3, name: "手机账号", value: 3},
        {id: 4, name: "管理员账号", value: 4},
        {id: 5, name: "三方平台账号", value: 5}
    ];
    $scope.selectedOrder = $scope.orderList[0].id;

    $scope.currentOrder = "0";
    $scope.orderChange = function (id) {
        $scope.currentOrder = id;
    };

    $scope.orderFunc = function () {
        if ($scope.currentOrder === 1) {
            return 'last_login_time';
        } else if ($scope.currentOrder === 2) {
            return 'is_online';
        } else {
            return 'last_login_time';
        }
    };

    $scope.searchByID = function () {
        var tmpAttr = [];

        if ($scope.condition) {
            tmpAttr.push('attr=' + $scope.condition);
            $scope.changePage();
        }
        if($scope.currentOrder) {
            tmpAttr.push('by=' + $scope.currentOrder);
        }
        if($scope.currentDisplay) {
            tmpAttr.push('sort=' + $scope.currentDisplay);
        }
        var urlData = window.url + '/v1/sdkusers/?offset=' + $scope.offset + '&count=15&' + tmpAttr.join('&');

        $http.defaults.transformResponse = [];
        $http.get(urlData, {
            headers: {
                'Authorization': window.__token
            }
        }).then(function (response) {
            var result = JSONbig.parse(response.data);
            result.users.forEach(function (item) {
                item.uid = item.uid.toString();
            });

            $scope.allPage = Math.ceil(result.total / 15);
            $scope.userList = result.users;
            $scope.judgeNext();

            $scope.userList.forEach(function (item) {
                item.role = $scope.userRole[item.role];
                item.is_online = $scope.user_is_online[item.is_online];
                item.status = $scope.userStatus[item.status];
                item.last_login_time = mainService.timeConvert(item.last_login_time);
            });
            $scope.searchFlag = true;
        }, function (data, status, headers, config) {
        })
    };

    $scope.clear = function () {
        $("[data-toggle='popover']").popover("hide");
        $scope.condition = '';
        $scope.searchFlag = false;
        $scope.changePage();
        $scope.getUserList();
    };
}]);