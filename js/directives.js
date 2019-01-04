
iNeroApp.directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                    Layout.closeMainMenu();
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function(event) {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsMainMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
iNeroApp.directive('a',
    function() {
        return {
            restrict: 'E',
            link: function(scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function(e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    });

// Handle Dropdown Hover Plugin Integration
iNeroApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});


iNeroApp.factory('weatherService', function($http) {
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

iNeroApp.filter('temp', function($filter) {
    return function(input, precision) {
        if (!precision) {
            precision = 1;
        }
        var numberFilter = $filter('number');
        return numberFilter(input, precision) + '\u00B0C';
    };
});

iNeroApp.directive('weatherIcon', function() {
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

iNeroApp.directive('weatherClimate', function() {
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

iNeroApp.directive("digitalClockTime", function($timeout, dateFilter) {
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

iNeroApp.directive("digitalClockSeconds", function($timeout, dateFilter) {
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