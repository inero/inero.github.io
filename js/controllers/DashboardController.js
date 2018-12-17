angular.module('iNeroApp').controller('DashboardController', function($rootScope, $scope, weatherService, $filter, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    $scope.weather = weatherService.getWeather();
    $scope.date = new Date();
    $scope.Day = $filter('date')(new Date(), 'EEEE', 'ITC');
    $scope.Date = $filter('date')(new Date(), 'MMMM d, y', 'ITC');
    $scope.timerCounter = function(){
        var timer;
        $scope.counter = 0;
        var updateCounter = function() {
            $scope.counter++;
            timer = $timeout(updateCounter, 1000);
        };
        updateCounter();
    };
    $scope.timerCounter();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});


angular.module('iNeroApp').factory('weatherService', function($http) {
    return { 
      getWeather: function() {
        var weather = { temp: {}, clouds: null };
        $http.get("https://ipapi.co/json").success(function(response) {
            var apiKey = "e74b9b7e09cf43db5bd339b1eea042d8";
            $http.get("https://api.openweathermap.org/data/2.5/weather?zip="+ response.postal +"," + response.country +"&appid=" +apiKey +"&units=imperial").success(function(data) {
                if (data) {
                    if (data.main) {
                        weather.temp.current = data.main.temp;
                        weather.temp.min = data.main.temp_min;
                        weather.temp.max = data.main.temp_max;
                        weather.temp.name = data.name;
                    }
                    weather.clouds = data.clouds ? data.clouds.all : undefined;
                }
            });
        });
        return weather;
      }
    }; 
});

angular.module('iNeroApp').filter('temp', function($filter) {
    return function(input, precision) {
        if (!precision) {
            precision = 1;
        }
        var numberFilter = $filter('number');
        return numberFilter(input, precision) + '\u00B0C';
    };
});

angular.module('iNeroApp').directive('weatherIcon', function() {
    return {
        restrict: 'E', replace: true,
        scope: {
            cloudiness: '@'
        },
        controller: function($scope) {
            $scope.imgurl = function() {
                var baseUrl = 'https://ssl.gstatic.com/onebox/weather/128/';
                if ($scope.cloudiness < 20) {
                    return baseUrl + 'sunny.png';
                } else if ($scope.cloudiness < 90) {
                   return baseUrl + 'partly_cloudy.png';
                } else {
                    return baseUrl + 'cloudy.png';
                }
            };
        },
        template: '<div style="float:left"><img ng-src="{{ imgurl() }}"></div>'
    };
});

angular.module('iNeroApp').directive('weatherClimate', function() {
    return {
        restrict: 'E', replace: true,
        scope: {
            cloudiness: '@'
        },
        controller: function($scope) {
            $scope.weatherName = "";
            if ($scope.cloudiness < 20) {
                $scope.weatherName = 'Sunny';
            } else if ($scope.cloudiness < 90) {
                $scope.weatherName = 'Partly Cloudy';
            } else {
                $scope.weatherName = 'Cloudy';
            }
        },
        template: '<span ng-bind="weatherName"></span>'
    };
});

angular.module('iNeroApp').directive("digitalClockTime", function($timeout, dateFilter) {
    return {
      restrict: 'E',
      link: function(scope, iElement) {
        (function updateClock() {
          iElement.text(dateFilter(new Date(), 'hh:mm a'));
          $timeout(updateClock, 1000);
        })();
      }
    };
});

angular.module('iNeroApp').directive("digitalClockSeconds", function($timeout, dateFilter) {
    return {
      restrict: 'E',
      link: function(scope, iElement) {
        (function updateClock() {
          iElement.text(dateFilter(new Date(), 'ss'));
          $timeout(updateClock, 1000);
        })();
      }
    };
});