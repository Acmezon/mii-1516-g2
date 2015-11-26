'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('acme_supermarket', [
        'ngRoute',
        'acme_supermarket.controllers',
        'acme_supermarket.filters',
        'acme_supermarket.services',
        'acme_supermarket.directives'
]);

app.config(['$routeProvider', '$locationProvider', '$controllerProvider',
 function ($routeProvider, $locationProvider, $controllerProvider) {
  app.registerCtrl = $controllerProvider.register;

  $routeProvider.
    when('/home', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    }).
    when('/products', {
      templateUrl: 'partials/partial2.html',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/home'
    });

  $locationProvider.html5Mode(true);
}]);