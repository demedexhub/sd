var app = angular.module('SoundDiorama', ['ngRoute']);



app.config(function($routeProvider){
    $routeProvider.when("/MainPage",{
        templateUrl : "html-view/main-page.html",
        controller: "MainController"
    }).when("/DioramaPage", {
        templateUrl: "html-view/diorama.html",
        controller: "DioramaEnvironment"
    }).when("/ChooseSoundPage", {
        templateUrl: "html-view/diorama.html",
        controller: "DioramaEnvironment"
    }).otherwise ({
        redirectTo: '/MainPage'
    });
});


//app.config(['$locationProvider', function($locationProvider) { $locationProvider.html5Mode(true); }]);