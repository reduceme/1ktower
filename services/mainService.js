app.factory("mainService", ["$q", "$http", "$location", function ($q, $http, $location) {
    function login(username, password) {
        window.__storage.username = username;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http({
            method: 'post',
            url: window.url + '/v1/login',
            data: {
                "account": username,
                "password": password
            }
        }).success(function (data, status, headers, config) {
            if (data.code == 0) {
                deferred.resolve(data.data);
            } else {
                alert("账号或密码不正确！");
            }
        }).error(function (data, status, headers, config) {
            deferred.reject(data);
        });
        return promise;
    }

    function isLoged(token, path) {
        if (token != "" && token) {
            var flag = true;
            $location.path(path);
        } else {
            $location.path("/login");
        }
        return flag;
    }

    function http(method, url, header, data, error) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http({
            method: method,
            url: url,
            header: header,
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(error);
        });
        return promise;
    }

    var formatTime = function (data) {
        if (data < 10) {
            return "0" + data;
        }
        else {
            return data;
        }
    };

    var timeConvert = function (timestamp) {
        var d = new Date(timestamp * 1000);
        return d.getFullYear() + "-" + formatTime((d.getMonth() + 1)) + "-" + formatTime(d.getDate()) + " " + formatTime(d.getHours()) + ":" + formatTime(d.getMinutes());
    };

    var showPopover = function (status, element, ngClass) {
        var flag = true;
        ngClass = true;
        if (!status) {
            flag = true;
            element.popover("show");
            ngClass = true;
        } else {
            flag = false;
        }
        return flag;
    };

    var isLogout = function () {
        if (!window.__token) {
            $location.path('/login');
            $scope.isLogin = false;
            $scope.isNavbarShow = $scope.isLogin;
            $scope.isSidebarFlod = $scope.isLogin;
        }
    };

    var oneDay = 60 * 60 * 24 * 1000;
    var getSpecifiedTime = function (element, startTime, endTime) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(element);
        switch (element) {
            //本周，同时负责初始化时间
            case 'aWeek': {
                endTime = timeConvert(today / 1000);
                console.log(endTime);
                var lastWeek = new Date(today - 7 * oneDay);
                startTime = timeConvert(lastWeek / 1000);
                console.log(startTime);
                break;
            }
            //今日
            case 'today': {
                startTime = timeConvert(today / 1000);
                console.log(startTime);
                var now = new Date();
                endTime = timeConvert(now / 1000);
                console.log(endTime);
                break;
            }
            //30天
            case '30days': {
                endTime = timeConvert(today / 1000);
                console.log(endTime);
                var thirtiethDays = new Date(today - 30 * oneDay);
                startTime = timeConvert(thirtiethDays / 1000);
                console.log(startTime);
                break;
            }
            //本月
            case 'month': {
                endTime = timeConvert(today / 1000);
                console.log(endTime);
                var currentMonthFirst = new Date();
                currentMonthFirst.setDate(1);
                currentMonthFirst.setHours(0, 0, 0, 0);
                startTime = timeConvert(currentMonthFirst / 1000);
                console.log(startTime);
                break;
            }
        }
    };

    var by = function (name) {
        return function (o, p) {
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a > b ? -1 : 1;
                }
                return typeof a > typeof b ? -1 : 1;
            }
            else {
                throw("error");
            }
        }
    };

    return {
        login: login,
        isLoged: isLoged,
        http: http,
        timeConvert: timeConvert,
        showPopover: showPopover,
        isLogout: isLogout,
        getSpecifiedTime: getSpecifiedTime,
        by: by
    };
}]);