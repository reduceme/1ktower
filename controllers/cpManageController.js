app.controller('cpManageController', ['$scope', '$http', 'mainService', function ($scope, $http, mainService) {
    mainService.isLogout();

    $scope.update = true;
    $scope.delete = true;

    $scope.page = 0;
    $scope.cpList = [];

    $scope.getCpList = function () {
        $http.defaults.transformResponse = [];
        $http.get(window.url + "/v1/cp/?offset=" + $scope.page + "&count=15", {
            headers: {
                "Authorization": window.__token
            }
        }).then(function (response) {
            var data = JSONbig.parse(response.data);
            $scope.cpList = data.data;
            for (var i in $scope.cpList) {
                $scope.cpList[i].isSelected = false;
            }
        }), function (data, status, headers, config) {
            alert(data.error);
        }
    };
    $scope.getCpList();

    //添加渠道
    $scope.addCp = function () {
        $http({
            method: "post",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + "/v1/cp/",
            data: {
                "name": $scope.name,
                "en_name": $scope.en_name,
                "extra": $scope.extra
            }
        }).success(function (data, status, config, headers) {
            /*if (data.code > 0) {
                alert(data.code);
                return
            }
            alert("添加成功！");*/
            var returnData = JSON.parse(data);
            console.log(returnData.code);
            if(returnData.code == 1044){
                alert("CP名已存在！");
                return;
            }
            $('#addCpManage').modal('hide');
            $scope.getCpList();
        }).error(function (data, status, config, headers) {
            alert("添加失败！");
        })
    };

//    判断选中
    $scope.changeStatus = function (data) {
        data = !data;
    };

    $scope.selectedCpList = [];
    $scope.getSelectedCpList = function () {
        for (var i in $scope.cpList) {
            if ($scope.cpList[i].isSelected) {
                $scope.selectedCpList.push({
                    id: $scope.cpList[i].id,
                    name: $scope.cpList[i].name,
                    enName: $scope.cpList[i].en_name,
                    extra: $scope.cpList[i].extra
                })
            }
        }

        if ($scope.selectedCpList.length === 1) {
            $scope.changeInfo.changeName = $scope.selectedCpList[0].name;
            $scope.changeInfo.changeEnName = $scope.selectedCpList[0].enName;
            $scope.changeInfo.changeExtra = $scope.selectedCpList[0].extra;
        }
    };

    $scope.getChanged = function () {
        $scope.selectedCpList = [];
        $scope.getSelectedCpList();

        if ($scope.selectedCpList.length == 1) {
            $scope.bigNum = new BigNumber($scope.selectedCpList[0].id).toString();
            $scope.update = false;
            $scope.delete = false;
        } else {
            $scope.update = true;
            $scope.delete = true;
        }
    };

    $scope.changeInfo = {
        'changeName': '',
        'changeEnName': '',
        'changeExtra': ''
    };

//    修改
    $scope.updateCp = function () {
        $http({
            method: "put",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + "/v1/cp/" + $scope.bigNum,
            data: {
                "name": $scope.changeInfo.changeName,
                "en_name": $scope.changeInfo.changeEnName,
                "extra": $scope.changeInfo.changeExtra
            }
        }).success(function (data, status, headers, config) {
            if (data.code > 0) {
                alert(data.code);
                return
            }
            alert("修改成功！");
            $('#changeModal').modal('hide');
            $scope.getCpList();
        }).error(function (data, status, headers, config) {
            alert("更改失败！");
        })
    };

//    删除
    $scope.deleteCp = function () {
        $http({
            method: "delete",
            headers: {
                "Authorization": window.__token
            },
            url: window.url + "/v1/cp/" + $scope.bigNum
        }).success(function (data, config, headers, status) {
            $scope.getCpList();
        }).error(function (data, config, headers, status) {
            alert("删除失败！");
        })
    };

    $scope.remove = function (element) {
        switch (element) {
            case 'cp_c_name_has_error': {
                $('#cp_c_name').popover('hide');
                $scope.cp_c_name_has_error = false;
                break;
            }
            case 'cp_en_name_has_error': {
                $('#cp_en_name').popover('hide');
                $scope.cp_en_name_has_error = false;
                break;
            }
            case 'change_cp_en_name_has_error': {
                $('#change_cp_en_name').popover('hide');
                $scope.change_cp_en_name_has_error = false;
                break;
            }
            case 'change_cp_c_name_has_error': {
                $('#change_cp_c_name').popover('hide');
                $scope.change_cp_c_name_has_error = false;
                break;
            }
        }
    };

    $scope.removePopover = function () {
        $("[data-toggle='popover']").popover("hide");
    };

    $scope.addCancle = function () {
        $scope.removePopover();
        $scope.name = "";
        $scope.en_name = "";
        $scope.extra = "";
    };

    $scope.changeCancle = function () {
        $scope.removePopover();
        $scope.changeName = "";
        $scope.changeEnName = "";
        $scope.changeExtra = "";
    };

    //添加确认
    $scope.confirmWin = function () {
        mainService.showPopover($scope.addCpManageForm.cp_c_name.$valid, $('#cp_c_name'), $scope.cp_c_name_has_error);
        mainService.showPopover($scope.addCpManageForm.cp_en_name.$valid, $('#cp_en_name'), $scope.cp_en_name_has_error);

        if ($scope.addCpManageForm.cp_c_name.$valid && $scope.addCpManageForm.cp_en_name.$valid) {
            $('#confir').modal('show');
        }
    };

    //更改确认
    $scope.updateConfirmWin = function () {
        mainService.showPopover($scope.updateCpManageForm.change_cp_c_name.$valid, $('#change_cp_c_name'), $scope.change_cp_c_name_has_error);
        mainService.showPopover($scope.updateCpManageForm.change_cp_en_name.$valid, $('#change_cp_en_name'), $scope.change_cp_en_name_has_error);

        if ($scope.updateCpManageForm.change_cp_c_name.$valid && $scope.updateCpManageForm.change_cp_en_name.$valid) {
            $('#updateConfir').modal('show');
        }
    };

    //删除确认
    $scope.deleteConfirmWin = function () {
        $('#deleteConfir').modal('show');
    }
}]);