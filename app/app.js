'use strict';

/**
 * @ngdoc overview
 * @name spotifiedApp
 * @description
 * # spotifiedApp
 *
 * Main module of the application.
 */
var spotified = angular.module('spotifiedApp', ['firebase', 'angular-md5', 'ui.router'])

spotified.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'auth/login.html'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'auth/register.html'
    });

  $urlRouterProvider.otherwise('/');
})

spotified.constant('FirebaseUrl', 'https://spotified-930c5.firebaseio.com/ ');
