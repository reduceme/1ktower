var app = angular.module('myApp', ['ngRoute','ngAnimate']).run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
    });
}).config(function($routeProvider) {
    $routeProvider
	.when('/user-list',{
		 templateUrl: 'user-list-view.html',
         controller: 'userListController',
	}).when('/reset-userinfo',{
		templateUrl: 'reset-userinfo-view.html',
		controller: 'resetUserinfoController'
	}).when('/user-authority',{
		templateUrl: 'user-authority-view.html',
		controller: 'userAuthorityController'
	}).when('/user-manage',{
		templateUrl: 'user-manage-view.html',
		controller: 'userManageController'
	}).when('/channel-data',{
		templateUrl: 'channel-data-view.html',
		controller: 'channelDataController'
	}).when('/game-data',{
		templateUrl: 'game-data-view.html',
		controller: 'gameDataController'
	}).when('/user-data',{
		templateUrl: 'user-data-view.html',
		controller: 'userDataController'
	}).when('/order-data',{
		templateUrl: 'order-data-view.html',
		controller: 'orderDataController'
	}).when('/add-game',{
		templateUrl: 'add-game-view.html',
		controller: 'addGameController'
	}).when('/channel-manage',{
		templateUrl: 'channel-manage-view.html',
		controller: 'channelManageController'
	}).when('/sdk-manage',{
		templateUrl: 'sdk-manage-view.html',
		controller: 'sdkManageController'
	}).when('/cp-manage',{
		templateUrl: 'cp-manage-view.html',
		controller: 'cpManageController'
	}).when('/sb-grant',{
		templateUrl: 'sb-grant-view.html',
		controller: 'sbGrantController'
	}).when('/sb-grant-log',{
		templateUrl: 'sb-grant-log-view.html',
		controller: 'sbGrantLogController'
	}).when('/sb-remainder',{
		templateUrl: 'sb-remainder-view.html',
		controller: 'sbRemainderController'
	}).when('/sb-list',{
		templateUrl: 'sb-list-view.html',
		controller: 'sbListController'
	}).when('/login',{
		templateUrl: 'login-view.html',
		controller:'loginController'
	}).when('/payment-data',{
		templateUrl: 'payment-data-view.html',
		controller: 'paymentDataController'
	}).otherwise({
		redirectTo: '/'
	});
});