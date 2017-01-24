'use strict';

var spotified = angular.module('spotifiedApp', ['firebase', 'angular-md5', 'ui.router', 'spotify', 'mwl.confirm', 'dndLists', 'xeditable'])

spotified.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

spotified.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      resolve: {
        requireNoAuth: function($state, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            $state.go('playlists');
          }, function(error){
            return;
          });
        }
      }
    })
    .state('login', {
      url: '/login',
      controller: 'AuthCtrl as authCtrl',
      templateUrl: 'auth/login.html',
      resolve: {
        requireNoAuth: function($state, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            $state.go('playlists');
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
        requireNoAuth: function($state, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            $state.go('playlists');
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
        auth: function($state, AuthService){
          return AuthService.$requireSignIn().catch(function(){
            $state.go('home');
          });
        },
        userId: function(AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            return auth.uid;
          });
        },
        playlists: function(PlaylistsService, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            return PlaylistsService.forUser(auth.uid).$loaded();
          });
        },
      }
    })
    .state('playlists.playlist', {
      url: '/{playlistId}',
      controller: 'PlaylistCtrl as playlistCtrl',
      templateUrl: 'playlists/playlist.html',
      resolve: {
        playlist: function(playlists, $stateParams){
          return playlists.$getRecord($stateParams.playlistId);
        },
        songs: function(PlaylistService, $stateParams) {
          return PlaylistService.getSongs($stateParams.playlistId).$loaded();
        }
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

spotified.constant('FirebaseUrl', 'https://spotified-930c5.firebaseio.com/');
