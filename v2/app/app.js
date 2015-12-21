var FAFApp = angular
        .module('FAFApp', ['ngRoute'])
        .config(function ($routeProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'app/views/presentation.html'
                    })
                    .when('/news', {
                        controller: 'NewsController',
                        templateUrl: 'app/views/news.html'
                    })
                    .when('/contribution', {
                        templateUrl: 'app/views/contribution.html'
                    })
                    .when('/competitive/competitivenews', {
                        templateUrl: 'app/views/competitivenews.html'
                    })
                    .when('/competitive/leaderboards', {
                        controller: 'LeaderboardController',
                        templateUrl: 'app/views/leaderboards.html'
                    })
                    .otherwise({
                    });
        })
        .controller('HeaderController', function ($scope, $location) {
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
        });