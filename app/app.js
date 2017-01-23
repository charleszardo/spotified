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
      templateUrl: 'home/home.html',
      resolve: {
        auth: function($state, Users, Auth){
          return Auth.$requireSignIn().catch(function(){
            $state.go('login');
          });
        },
        userId: function(Users, Auth){
          return Auth.$requireSignIn().then(function(auth){
            return auth.uid;
          });
        },
        playlists: function(Playlists, Auth){
          return Auth.$requireSignIn().then(function(auth){
            return Playlists.forUser(auth.uid).$loaded();
          });
        },
      }
    })
    .state('login', {
      url: '/login',
      controller: 'AuthCtrl as authCtrl',
      templateUrl: 'auth/login.html',
      resolve: {
        requireNoAuth: function($state, Auth){
          return Auth.$requireSignIn().then(function(auth){
            $state.go('home');
          }, function(error){
            return;
          });
        }
      }
    })
    .state('register', {
      url: '/register',
      controller: 'AuthCtrl as authCtrl',
      templateUrl: 'auth/register.html',
      resolve: {
        requireNoAuth: function($state, Auth){
          return Auth.$requireSignIn().then(function(auth){
            $state.go('home');
          }, function(error){
            return;
          });
        }
      }
    })
    .state('playlists', {
      url: '/playlists',
      controller: 'PlaylistsCtrl as playlistsCtrl',
      templateUrl: 'playlists/playlists.html',
      resolve: {
        auth: function($state, Users, Auth){
          return Auth.$requireSignIn().catch(function(){
            $state.go('home');
          });
        },
        userId: function(Users, Auth){
          return Auth.$requireSignIn().then(function(auth){
            return auth.uid;
          });
        },
        playlists: function(Playlists, Auth){
          return Auth.$requireSignIn().then(function(auth){
            return Playlists.forUser(auth.uid).$loaded();
          });
        },
      }
    })

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
