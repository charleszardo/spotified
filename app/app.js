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

spotified.config(function() {
  var config = {
    apiKey: "AIzaSyBSv9ENuL0m8h7tNqQXZZr8EzpaiWg_udg",
    authDomain: "spotified-930c5.firebaseapp.com",
    databaseURL: "https://spotified-930c5.firebaseio.com",
    storageBucket: "spotified-930c5.appspot.com",
    messagingSenderId: "358951966806"
  };
  firebase.initializeApp(config);
})

spotified.constant('FirebaseUrl', 'https://spotified-930c5.firebaseio.com/ ');
