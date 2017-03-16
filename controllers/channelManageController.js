app.controller('channelManageController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.channelList = [];
    $scope.update = true;
    $scope.delete = true;
    $scope.page = 0;
    $scope.offset = 0;
    $scope.allPage = 0;
    $scope.isNext = true;
    $scope.isLast = true;
    $scope.count = 15;
    $scope.showPage = $scope.page + 1;

    $scope.getChannelList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + '/v1/channel/' + '?offset=' + $scope.offset + '&count=15', {
            headers: {
                'Authorization': window.__token
            }
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            if (data.code > 0) {
                alert(data.error);
                return;
            }
            $scope.channelList = data.data;
            $scope.allPage = Math.ceil(data.total / 15);
            $scope.judgeNext();
            $scope.channelList.forEach(function (item) {
                item.isSelected = false;
            });
        })
    };
    $scope.getChannelList();

    //获取父渠道信息
    $scope.parentChannel = "";
    $scope.getParentChannel = function (data) {
        $scope.parentChannel = data;
    };

    $scope.addChannel = function () {
        $http({
            method: "post",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + "/v1/channel/",
            data: {
                "name": $scope.name,
                "en_name": $scope.enName,
                "channel_id": $scope.channelID,
                "extra": $scope.extra,
                "parent_id": $scope.parentChannel,
                "platform": $scope.platform,
                "android_meta_keys": $scope.android_meta_keys
            }
        }).success(function (data, status, config, headers) {
            if (data.code > 0) {
                alert(data.error);
                return
            }
            alert("添加成功！");
            $('#addChannel').modal('hide');
            $scope.getChannelList();
        }).error(function (data, status, config, headers) {
            alert(data.error);
        })
    };

//    android，ios
    $scope.android = [{
        isSelected: true
    }];
    $scope.IOS = [{
        isSelected: true
    }];
    $scope.platform = "android,ios"
    $scope.changeStatus = function (data) {
        data = !data;
        $scope.getPlatform();
    };

    $scope.getPlatform = function () {
        for (var i = 0; i < 1; i++) {
            if ($scope.android[i].isSelected == true && $scope.IOS[i].isSelected == false) {
                $scope.platform = "android";
            } else if ($scope.android[i].isSelected == false && $scope.IOS[i].isSelected == true) {
                $scope.platform = "ios"
            } else if ($scope.android[i].isSelected == true && $scope.IOS[i].isSelected == true) {
                $scope.platform = "android,ios"
            } else {
                $scope.platform = "";
            }
        }
    };

//    判断选中
    $scope.selectedChannelList = [];
    $scope.getSelectedChannelList = function () {
        for (var i in $scope.channelList) {
            if ($scope.channelList[i].isSelected) {
                $scope.selectedChannelList.push({
                    id: $scope.channelList[i].id,
                    name: $scope.channelList[i].name,
                    enName: $scope.channelList[i].en_name,
                    extra: $scope.channelList[i].extra,
                    channelId: $scope.channelList[i].channel_id,
                    android_meta_keys: $scope.channelList[i].android_meta_keys
                })
            }
        }
        if ($scope.selectedChannelList.length === 1) {
            $scope.changeInfo.name = $scope.selectedChannelList[0].name;
            $scope.changeInfo.en_name = $scope.selectedChannelList[0].enName;
            $scope.changeInfo.extra = $scope.selectedChannelList[0].extra;
            $scope.changeInfo.channel_id = $scope.selectedChannelList[0].channelId;
            $scope.changeInfo.android_meta_keys = $scope.selectedChannelList[0].android_meta_keys;
        }
    };

    $scope.getChangeed = function () {
        $scope.selectedChannelList = [];
        $scope.getSelectedChannelList();

        if ($scope.selectedChannelList.length == 1) {
            $scope.bigNum = new BigNumber($scope.selectedChannelList[0].id).toString();
            $scope.update = false;
            $scope.delete = false;
        } else {
            $scope.update = true;
            $scope.delete = true;
        }
    };

    $scope.changeInfo = {
        'name': '',
        'en_name': '',
        'channel_id': '',
        'extra': '',
        'android_meta_keys': ''
    };

    $scope.updateChannel = function () {
        $http({
            method: "put",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + '/v1/channel/' + $scope.bigNum,
            data: {
                "name": $scope.changeInfo.name,
                "en_name": $scope.changeInfo.en_name,
                "channel_id": $scope.changeInfo.channel_id,
                "extra": $scope.changeInfo.extra,
                "parent_id": $scope.parentChannel,
                "platform": $scope.platform,
                "android_meta_keys": $scope.changeInfo.android_meta_keys
            }
        }).success(function (data, status, headers, config) {
            if (data.code > 0) {
                alert(data.error);
                return
            }
            alert("修改成功！");
            $('#changeModal').modal('hide');
            $scope.getChannelList();
        }).error(function (data, status, headers, config) {
            alert("更改失败！");
        })
    };

    $scope.deleteChannel = function () {
        $http({
            method: "delete",
            headers: {
                "Authorization": window.__token,
            },
            url: window.url + '/v1/channel/' + $scope.bigNum
        }).success(function (data, headers, config, status) {
            if (data.code) {
                alert(data.error);
                return
            }
            $scope.getChannelList();
        }).error(function (data, headers, config, status) {
            alert("删除失败！");
        })
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
        $scope.offset -= $scope.count;
        $scope.showPage = $scope.page + 1;
        $scope.getChannelList();
        $scope.judgeNext();
    };

    //下一页
    $scope.nextPage = function () {
        $scope.page++;
        $scope.showPage = $scope.page + 1;
        $scope.offset += $scope.count;
        $scope.getChannelList();
        $scope.judgeNext();
    };

    //跳转
    $scope.goto = function () {
        $scope.offset = ($scope.showPage - 1) * 15;
        $scope.page = $scope.showPage - 1;
        $scope.getChannelList();
        $scope.judgeNext();
    };

    $scope.remove = function (element) {
        switch (element) {
            case 'c_name_has_error': {
                $('#c_name').popover('hide');
                $scope.c_name_has_error = false;
                break;
            }
            case 'en_name_has_error': {
                $('#en_name').popover('hide');
                $scope.en_name_has_error = false;
                break;
            }
            case 'channel_id_has_error': {
                $('#channel_id').popover('hide');
                $scope.channel_id_has_error = false;
                break;
            }
            case 'change_c_name_has_error': {
                $('#change_c_name').popover('hide');
                $scope.parent_channel_has_error = false;
                break;
            }
            case 'change_en_name_has_error': {
                $('#change_en_name').popover('hide');
                $scope.parent_channel_has_error = false;
                break;
            }
            case 'change_channel_id_has_error': {
                $('#change_channel_id').popover('hide');
                $scope.change_channel_id_has_error = false;
                break;
            }
        }
    };

    $scope.removePopover = function () {
        $("[data-toggle='popover']").popover("hide");
    };

    $scope.addCancle = function () {
        $scope.name = "";
        $scope.enName = "";
        $scope.extra = "";
        $scope.android = [{
            isSelected: true
        }];
        $scope.IOS = [{
            isSelected: true
        }];
        $scope.removePopover();
    };

    $scope.changeCancle = function () {
        $scope.changeName = "";
        $scope.changeEnName = "";
        $scope.changeExtra = "";
        $scope.android = [{
            isSelected: true
        }];
        $scope.IOS = [{
            isSelected: true
        }];
        $scope.removePopover();
    };

    //确认添加渠道
    $scope.confirmWin = function () {
        mainService.showPopover($scope.addChannelForm.c_name.$valid, $('#c_name'), $scope.c_name_has_error);
        mainService.showPopover($scope.addChannelForm.en_name.$valid, $('#en_name'), $scope.en_name_has_error);
        mainService.showPopover($scope.addChannelForm.channel_id.$valid, $('#channel_id'), $scope.channel_id_has_error);

        if ($scope.addChannelForm.c_name.$valid && $scope.addChannelForm.en_name.$valid && $scope.addChannelForm.channel_id.$valid) {
            $('#confir').modal('show');
        }
    };

    //确认修改渠道
    $scope.updateConfirmWin = function () {
        mainService.showPopover($scope.updateChannelForm.change_c_name.$valid, $('#change_c_name'), $scope.change_c_name_has_error);
        mainService.showPopover($scope.updateChannelForm.change_en_name.$valid, $('#change_en_name'), $scope.change_en_name_has_error);

        if ($scope.updateChannelForm.change_c_name.$valid && $scope.updateChannelForm.change_en_name.$valid) {
            $('#updateConfir').modal('show');
        }
    };

    //删除确认
    $scope.deleteConfirmWin = function () {
        $('#deleteConfir').modal('show');
    };

    $scope.goto = function () {
        $scope.page = $scope.showPage - 1;

        $scope.offset -= $scope.count;
        $scope.getChannelList();
        $scope.judgeNext();
    };
}]);