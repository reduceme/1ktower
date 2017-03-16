app.controller('mainController', function ($scope, $location, mainService, $http) {
    $(function () {
        $("[data-toggle='popover']").popover();
    });

    if (!window.__storage) {
        window.__storage = {};
    }
    $scope.isLogin = false;
    $scope.token = '';
    $scope.isNavbarShow = !$scope.isLogin;
    $scope.isSidebarFlod = $scope.isLogin;
    $scope.userid2 = "";
    $scope.userid = 0;

    window.url = "http://" + window.location.host;
    // window.url = "http://10.10.30.238:11010";
    // window.url = "http://10.10.31.236";
    // window.url = "http://xmzj.snakepop.com:11010";

    if (!$scope.token) {
        $location.path('/login');
    }
    $scope.$on('to-home', function (event, data) {
        $scope.token = data.token;
        window.__token = data.token;
        $scope.userRoleid = data.role;
        $scope.userid2 = data.account;
        $scope.userid = data.id;
        $scope.isLogin = true;
        var header = {
            'Authorization': data.token
        };
        $http({
            method: 'get',
            headers: header,
            url: window.url + '/v1/users/' + $scope.userid + '/menus'
        }).success(function (data) {
            getMenus(data.data);
        })
    });

    $scope.toggleSidebarStatus = function () {
        $scope.isSidebarFlod = !$scope.isSidebarFlod;
    };
    $scope.collapseContentNavbar = function () {
        $scope.isNavbarShow = !$scope.isNavbarShow;
    };


    $scope.isFocus = false;
    $scope.sidebarList = [{
        name: "用户管理",
        id: 1,
        icon: 'fa fa-user',
        isSelected: false,
        isShow: false,
    }, {
        name: "数据中心",
        id: 3,
        icon: 'fa fa-database',
        isSelected: false,
        isShow: false,
    }, {
        name: "游戏管理",
        id: 4,
        icon: 'fa fa-gamepad',
        isSelected: false,
        isShow: false,
    }, {
        name: "合作者管理",
        id: 5,
        icon: 'fa fa-support',
        isSelected: false,
        isShow: false,
    }, {
        name: "平台币管理",
        id: 6,
        icon: 'fa fa-money',
        isSelected: false,
        isShow: false,
    }];
    $scope.navbarList = [{
        id: 1,
        list: [{
            name: '用户列表',
            isSelected: false,
            isShow: false,
            view: '/user-list'
        }, {
            name: '重置用户密码',
            isSelected: false,
            isShow: false,
            view: '/reset-userinfo'
        }]
    }, {
        id: 3,
        list: [{
            name: '渠道数据',
            isSelected: false,
            isShow: false,
            view: '/channel-data'
        }, {
            name: '游戏数据',
            isSelected: false,
            isShow: false,
            view: '/game-data'
        }, {
            name: '用户数据',
            isSelected: false,
            isShow: false,
            view: '/user-data'
        }, {
            name: '订单数据',
            isSelected: false,
            isShow: false,
            view: '/order-data'
        }, {
            name: '充值数据',
            isSelected: false,
            isShow: false,
            view: '/payment-data'
        }]
    }, {
        id: 4,
        list: [{
            name: '添加游戏',
            isSelected: false,
            isShow: false,
            view: '/add-game'
        }],
    }, {
        id: 5,
        list: [{
            name: '渠道管理',
            isSelected: false,
            isShow: false,
            view: '/channel-manage'
        }, {
            name: '内容提供商管理',
            isSelected: false,
            isShow: false,
            view: '/cp-manage'
        }, {
            name: 'SDK产品管理',
            isSelected: false,
            isShow: false,
            view: '/sdk-manage'
        }]
    }, {
        id: 6,
        list: [{
            name: '平台币发放',
            isSelected: false,
            isShow: false,
            view: '/sb-grant'
        }, {
            name: '平台币发放统计',
            isSelected: false,
            isShow: false,
            view: '/sb-grant-log'
        }, {
            name: '平台币余额查询',
            isSelected: false,
            isShow: false,
            view: '/sb-remainder'
        }, {
            name: '平台币收支列表',
            isSelected: false,
            isShow: false,
            view: '/sb-list'
        }]
    }];
    $scope.selectedNavtitle = [{
        name: '',
        list: []
    }];
    $scope.selectedSidetitle = "";

    $scope.changeNavbar = function (id, name) {
        $scope.isNavbarShow = false;
        for (var i = 0; i < $scope.navbarList.length; i++) {
            $scope.sidebarList[i].isSelected = false;
            if ($scope.navbarList[i].id == id) {
                $scope.selectedNavtitle.list = $scope.navbarList[i].list;
                for (var j = 0; j < $scope.navbarList[i].list.length; j++) {
                    $scope.navbarList[i].list[j].isSelected = false;
                }
                $scope.sidebarList[i].isSelected = true;
                $scope.navbarList[i].list[0].isSelected = true;
                $scope.selectedSidetitle = $scope.navbarList[i].list[0].name;
                $location.path($scope.navbarList[i].list[0].view);
                $scope.removePopover();
            }
        }
        $scope.selectedNavtitle.name = name;
    };

    $scope.changeView = function (list, name) {
        $scope.selectedSidetitle = name;
        for (var i = 0; i < list.length; i++) {
            list[i].isSelected = false;
            if (list[i].name == name) {
                list[i].isSelected = true;
                $location.path(list[i].view);
                $scope.removePopover();
            }
        }
    };

    $(function () {
        $("[data-toggle='popover']").popover();
    });

    $scope.removePopover = function () {
        $("[data-toggle='popover']").popover("hide");
    };

    $scope.logout = function () {
        window.__token = '';
        $location.path('/login');
        $scope.isLogin = false;
        $scope.isNavbarShow = !$scope.isLogin;
        $scope.isSidebarFlod = $scope.isLogin;
    };

    var header = {
        'Authorization': window.__token
    }


    function getMenus(array) {
        var parent_menulist = [];
        var child_menulist = [];
        if ($scope.userRoleid == 1) {
            for (var j = 0; j < $scope.sidebarList.length; j++) {
                $scope.sidebarList[j].isShow = true
            }

            for (var i = 0; i < $scope.navbarList.length; i++) {
                for (var j = 0; j < $scope.navbarList[i].list.length; j++) {
                    $scope.navbarList[i].list[j].isShow = true
                }
            }

        } else {
            for (var i = 0; i < array.length; i++) {
                if (array[i].parent_id === 0) {
                    parent_menulist.push({
                        name: array[i].name,
                        id: array[i].id
                    });
                } else {
                    child_menulist.push({
                        name: array[i].name,
                        id: array[i].parent_id
                    })
                }
            }
            for (var j = 0; j < parent_menulist.length; j++) {
                for (var i = 0; i < $scope.sidebarList.length; i++) {
                    if ($scope.sidebarList[i].name === parent_menulist[j].name) {
                        $scope.sidebarList[i].isShow = true
                    }
                }
            }
            for (var i = 0; i < $scope.navbarList.length; i++) {
                for (var j = 0; j < $scope.navbarList[i].list.length; j++) {
                    for (var k = 0; k < child_menulist.length; k++) {
                        if (child_menulist[k].name === $scope.navbarList[i].list[j].name) {
                            $scope.navbarList[i].list[j].isShow = true
                        }
                    }
                }
            }
        }
    }
});