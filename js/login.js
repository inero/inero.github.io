var LoginApp = angular.module("LoginApp", ["ui.router", "ui.bootstrap", "oc.lazyLoad", "ngSanitize"]);
LoginApp.controller('LoginController', ['$scope', '$window', '$location', function ($scope, $window, $location) {
    $scope.$on('$viewContentLoaded', function () {
        
    });
    $scope.loginAuthentication = function () {
        $window.location.href = "/index.html";
    };
}]);

LoginApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        // Login
        .state("/", {
            url: "/login",
            templateUrl: "login.html",
            data: {pageTitle: 'Login Page'}
        });
}]);
