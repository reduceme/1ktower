app.controller('addGameController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.update = true;
    $scope.delete = true;

    $scope.page = 0;
    $scope.offset = 0;
    $scope.allPage = 0;
    $scope.isNext = true;
    $scope.isLast = true;
    $scope.count = 15;
    $scope.showPage = $scope.page + 1;

    $scope.showPack = false;
    $scope.third = true;

    $scope.changeShowPack = false;
    $scope.changeThird = true;

//     存放对象
    $scope.thirdProperties = [];
    $scope.changeThirdProperties = [];
//    获取app列表
    $scope.page = 0;
    $scope.appList = [];

    $scope.getAppList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/apps/?offset=' + $scope.offset + '&count=15', {
            headers: {
                'Authorization': window.__token
            }
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.appList = data.data;
            $scope.allPage = Math.ceil(data.total / 15);
            $scope.judgeNext();
            $scope.appList.forEach(function (item) {
                item.isSelected = false;
            });
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };
    $scope.getAppList();

//      显示收起按钮
    $scope.addFirst = function () {
        $scope.showPack = true;
        $scope.third = false;
    };

    $scope.changeFirst = function () {
        $scope.changeShowPack = true;
        $scope.changeThird = false;
    };

//      添加键值对输入框
    $scope.add = function () {
        $scope.thirdProperties.push({
            name: '',
            key: '',
            value: ''
        })
    };

//      修改
    $scope.change = function () {
        $scope.changeThirdProperties.push({
            name: '',
            key: '',
            value: ''
        })
    };

    //收起
    $scope.pickUp = function () {
        $scope.thirdProperties = [];
        $scope.changeThirdProperties = [];
        $scope.showPack = false;
        $scope.changeShowPack = false;
        $scope.third = true;
        $scope.changeThird = true;
    };

//      获取内容提供商ID
    $scope.cpList = [];
    $scope.getCpList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + "/v1/cp/?offset=0&count=-1", {
            headers: {
                "Authorization": window.__token
            }
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.cpList = data.data;
        }), function (data, status, config, headers) {
            alert(data.error);
        }
    };
    $scope.getCpList();

    $scope.selectCp = 0;
    $scope.getCp = function (data) {
        $scope.selectCp = data;
    };

    $scope.changeCp = 0;
    $scope.getChangeCp = function (data) {
        $scope.changeCp = data;
    };

//  添加游戏
    $scope.addApp = function () {
        var result = {};
        $scope.thirdProperties.forEach(function (item) {
            var tmp = {};
            if (!!result[item.name]) {
                tmp = result[item.name];
            }
            tmp[item.key] = item.value;
            result[item.name] = tmp;
        });

        $http({
            method: "post",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + "/v1/apps/",
            data: {
                "name": $scope.app_name,
                "redirect_uri": $scope.back_url,
                "extra": $scope.extra,
                "cp_id": $scope.selectCp,
                "third_properties": result
            }
        }).success(function (data, status, headers, config) {
            if (data.code > 0) {
                alert(data.code);
                return;
            }
            alert("添加成功！");
            $('#addModal').modal('hide');
            $scope.getAppList();
        }).error(function (data, status, headers, config) {
            alert("添加失败！");
        })
    };

//    判断选中
    $scope.changeStatus = function (data, id) {
        data = !data;
    };

    $scope.selectedAppList = [];
    $scope.getSelectedAppList = function () {
        for (var i in $scope.appList) {
            if (!!$scope.appList[i].isSelected) {
                $scope.selectedAppList.push({
                    appid: $scope.appList[i].appid,
                    name: $scope.appList[i].name,
                    redirect_uri: $scope.appList[i].redirect_uri,
                    extra: $scope.appList[i].extra,
                    third_properties: $scope.appList[i].third_properties
                })
            }
        }
        if ($scope.selectedAppList.length === 1) {
            $scope.changeInfo.change_user_name = $scope.selectedAppList[0].name;
            $scope.changeInfo.change_back_url = $scope.selectedAppList[0].redirect_uri;
            $scope.changeInfo.change_extra = $scope.selectedAppList[0].extra;
        }
    };

    $scope.getChanged = function () {
        $scope.selectedAppList = [];
        $scope.getSelectedAppList();

        if ($scope.selectedAppList.length == 1) {
            $scope.bigNum = new BigNumber($scope.selectedAppList[0].appid).toString();
            $scope.update = false;
            $scope.delete = false;
        } else {
            $scope.update = true;
            $scope.delete = true;
        }
    };

    $scope.changeInfo = {
        'change_user_name': '',
        'change_back_url': '',
        'change_extra': ''
    };

    $scope.updata = function () {
        var changeResult = {};
        $scope.changeThirdProperties.forEach(function (item) {
            var temp = {};
            if (!!changeResult[item.name]) {
                temp = changeResult[item.name];
            }
            temp[item.key] = item.value;
            changeResult[item.name] = temp;
        });

        $http({
            method: 'put',
            headers: {
                'Authorization': window.__token
            },
            url: window.url + "/v1/apps/" + $scope.selectedAppList[0].appid,
            data: {
                "type": 2,
                "name": $scope.changeInfo.change_user_name,
                "redirect_uri": $scope.changeInfo.change_back_url,
                "extra": $scope.changeInfo.change_extra,
                "cp_id": $scope.changeInfo.changeCp,
                "third_properties": changeResult
            }
        }).success(function (data, status, headers, config) {
            if (data.code > 0) {
                alert(data.error);
                return
            }
            alert("修改成功！");
            $('#changeModal').modal('hide');
            $scope.getAppList();
            $scope.selectedAppList = [];
            $scope.getChanged();
        }).error(function (data, status, headers, config) {
            alert("修改失败！");
        });
    };

    //判断页数
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
        if ($scope.page != 0) {
            $scope.page--;
            $scope.showPage = $scope.page + 1;
            $scope.offset -= $scope.count;
            $scope.getAppList();
        }
    };

    //下一页
    $scope.nextPage = function () {
        $scope.page++;
        $scope.showPage = $scope.page + 1;
        $scope.offset += $scope.count;
        $scope.getAppList();
    };


    $scope.remove = function (element) {
        switch (element) {
            case 'appname': {
                $('#appname').popover('hide');
                $scope.appname_has_error = false;
                break;
            }
            case 'channel_id': {
                $('#channel_id').popover('hide');
                $scope.channel_id_has_error = false;
                break;
            }
            case 'back_url': {
                $('#back_url').popover('hide');
                $scope.back_url_has_error = false;
                break;
            }
            case 'change_user_name': {
                $('#change_user_name').popover('hide');
                $scope.change_user_name_has_error = false;
                break;
            }
            case 'change_cp_id': {
                $('#change_cp_id').popover('hide');
                $scope.change_cp_id_has_error = false;
                break;
            }
            case 'change_back_url': {
                $('#change_back_url').popover('hide');
                $scope.change_back_url_has_error = false;
                break;
            }
        }
    };

    $scope.removePopover = function () {
        $("[data-toggle='popover']").popover("hide");
    };

    $scope.cancle = function () {
        $scope.app_name = "";
        $scope.back_url = "";
        $scope.extra = "";
        $scope.removePopover();
        $scope.pickUp();
        $scope.selectedAppList = [];
    };

    $scope.changeCancle = function () {
        $scope.change_user_name = "";
        $scope.change_back_url = "";
        $scope.change_extra = "";
        $scope.removePopover();
        $scope.pickUp();
    };

    //添加确认
    $scope.confirmWin = function () {
        mainService.showPopover($scope.addapp.appname.$valid, $('#appname'), $scope.addapp.appname.appname_has_error);
        mainService.showPopover($scope.addapp.channel_id.$valid, $('#channel_id'), $scope.channel_id_has_error);
        mainService.showPopover($scope.addapp.back_url.$valid, $('#back_url'), $scope.back_url_has_error);
        if ($scope.addapp.appname.$valid && $scope.addapp.channel_id.$valid && $scope.addapp.back_url.$valid) {
            $('#confir').modal('show');
        }
    };

    //更改确认
    $scope.updateConfirmWin = function () {
        mainService.showPopover($scope.updateApp.change_user_name.$valid, $('#change_user_name'), $scope.change_user_name_has_error);
        mainService.showPopover($scope.updateApp.change_cp_id.$valid, $('#change_cp_id'), $scope.change_cp_id_has_error);
        mainService.showPopover($scope.updateApp.change_back_url.$valid, $('#change_back_url'), $scope.change_back_url_has_error);

        if ($scope.updateApp.change_user_name.$valid && $scope.updateApp.change_cp_id.$valid && $scope.updateApp.change_back_url.$valid) {
            $('#updateConfir').modal('show');
        }
    };

    $scope.goto = function () {
        $scope.offset = ($scope.showPage - 1) * 15;
        $scope.page = $scope.showPage - 1;
        $scope.getAppList();
        $scope.judgeNext();
    }
}]);