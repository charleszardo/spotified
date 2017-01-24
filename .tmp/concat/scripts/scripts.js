'use strict';

var spotified = angular.module('spotifiedApp', ['firebase', 'angular-md5', 'ui.router', 'spotify'])

spotified.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      resolve: {
        requireNoAuth: ["$state", "AuthService", function($state, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            $state.go('playlists');
          }, function(error){
            return;
          });
        }]
      }
    })
    .state('login', {
      url: '/login',
      controller: 'AuthCtrl as authCtrl',
      templateUrl: 'auth/login.html',
      resolve: {
        requireNoAuth: ["$state", "AuthService", function($state, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            $state.go('playlists');
          }, function(error){
            return;
          });
        }]
      }
    })
    .state('register', {
      url: '/register',
      controller: 'AuthCtrl as authCtrl',
      templateUrl: 'auth/register.html',
      resolve: {
        requireNoAuth: ["$state", "AuthService", function($state, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            $state.go('playlists');
          }, function(error){
            return;
          });
        }]
      }
    })
    .state('playlists', {
      url: '/playlists',
      controller: 'PlaylistsCtrl as playlistsCtrl',
      templateUrl: 'playlists/playlists.html',
      resolve: {
        auth: ["$state", "AuthService", function($state, AuthService){
          return AuthService.$requireSignIn().catch(function(){
            $state.go('home');
          });
        }],
        userId: ["AuthService", function(AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            return auth.uid;
          });
        }],
        playlists: ["PlaylistsService", "AuthService", function(PlaylistsService, AuthService){
          return AuthService.$requireSignIn().then(function(auth){
            return PlaylistsService.forUser(auth.uid).$loaded();
          });
        }],
      }
    })
    .state('playlists.playlist', {
      url: '/{playlistId}',
      controller: 'PlaylistCtrl as playlistCtrl',
      templateUrl: 'playlists/playlist.html',
      resolve: {
        playlist: ["playlists", "$stateParams", function(playlists, $stateParams){
          return playlists.$getRecord($stateParams.playlistId);
        }],
        songs: ["PlaylistService", "$stateParams", function(PlaylistService, $stateParams) {
          return PlaylistService.getSongs($stateParams.playlistId).$loaded();
        }]
      }
    })

  $urlRouterProvider.otherwise('/');
}])

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

spotified.controller('AuthCtrl', ['AuthService', '$state', function(AuthService, $state){
  var self = this;

  self.user = {
    email: '',
    password: ''
  };

  self.login = function (){
    AuthService.$signInWithEmailAndPassword(self.user.email, self.user.password).then(function (auth){
      $state.go('home');
    }, function (error){
      self.error = error;
    });
  };

  self.register = function (){
    AuthService.$createUserWithEmailAndPassword(self.user.email, self.user.password).then(function (user){
      $state.go('home');
    }, function (error){
      self.error = error;
    });
  };
}]);

spotified.factory('AuthService', ["$firebaseAuth", function($firebaseAuth){
  var auth = $firebaseAuth();
  
  return auth;
}]);

spotified.controller('NavCtrl', ['$location', 'AuthService', function($location, AuthService) {
  var self = this;

  self.auth = AuthService;

  self.auth.$onAuthStateChanged(function(firebaseUser) {
    self.firebaseUser = firebaseUser;
  });

  self.signOut = function() {
    self.auth.$signOut().then(function(){
      $location.url('/');
    });
  }
}]);

spotified.factory('UsersService', ["$firebaseArray", "$firebaseObject", function($firebaseArray, $firebaseObject){
  var usersRef = firebase.database().ref('users');
  var users = $firebaseArray(usersRef);

  var Users = {
    getUser: function(uid){
      return $firebaseObject(usersRef.child(uid));
    }
  };

  return Users;
}]);

spotified.factory('PlaylistsService', ["$firebaseArray", function($firebaseArray){
  var playlistsRef = firebase.database().ref('playlists');

  var o = {};

  o.forUser = function(uid) {
    return $firebaseArray(playlistsRef.child(uid));
  }

  o.add = function(playlist) {

  }

  return o;
}]);

spotified.controller('PlaylistsCtrl', ['$state', 'userId', 'playlists', function($state, userId, playlists) {
  var self = this;

  self.playlistName = "";
  self.playlists = playlists;

  self.addPlaylist = function() {
    if (self.playlistName == "") { return; }
    var playlist = { title: self.playlistName, image: null, tracks: [], comments: "", uid: userId}
    self.playlists.$add(playlist).then(function (){
      self.playlistName = '';
    });
  }

  self.removePlaylist = function(playlist) {
    self.playlists.$remove(playlist).then(function (){
      $state.go('home');
    });
  }
}]);

spotified.factory('PlaylistService', ['$firebaseArray', function($firebaseArray) {
  var songsRef = firebase.database().ref('song');

  var o = {};

  o.getSongs = function(playlistId) {
    return $firebaseArray(songsRef.child(playlistId));
  }

  return o;
}]);

spotified.controller('PlaylistCtrl', ['$window', 'playlist', 'songs', function($window, playlist, songs) {
  var self = this;

  self.playlist = playlist;
  self.title = playlist.title;
  self.songs = songs;
  self.songTitle = ""

  self.export = function() {
    var uri = "data:application/json;charset=UTF-8," + encodeURIComponent(self.playlistJSON());

    $window.open(uri);
  }

  self.playlistJSON = function() {
    console.log("OKAY!")
    var playlistObj = { title: self.title, songs: []},
        songObj;

    angular.forEach(self.songs, function(song) {
      songObj = { track: song.data.title,
                  artist: song.data.artist,
                  album: song.data.album,
                  note: song.data.note,
                  customImage: song.data.customImage };

      playlistObj.songs.push(songObj);
    })

    return JSON.stringify(playlistObj);
  }

  self.addSong = function(songObj) {
    var trackNo = self.songs.length,
        songData,
        song;

    if (trackNo >= 10) { return; }

    songData = { title: songObj.name,
                 artist: songObj.artists[0].name,
                 album: songObj.album.name,
                 note: '',
                 customImage: null }
    song = { data: songData, playlistId: self.playlist.$id }

    self.songs.$add(song).then(function (){
      self.songTitle = '';
    });
  }

  self.removeSong = function(song) {
    self.songs.$remove(song).then(function (){
    });
  }

  self.getSongs = function() {
    var songsRef = firebase.database().ref('songs');

    return $firebaseArray(songsRef.child(playlistId));
  }
}]);

spotified.controller('SearchCtrl', ['Spotify', function(Spotify) {
  var self = this;

  self.searchString = "";
  self.results = [];
  self.searchType = "track";
  self.test = "TESTIN!"

  self.search = function() {
    if (self.searchType === "artist") {
      self.artistSearch();
    } else if (self.searchType === "album") {
      self.albumSearch();
    } else {
      self.trackSearch();
    }
  }

  self.trackSearch = function() {
    Spotify.search(self.searchString, 'track').then(function (data) {
      self.results = data.tracks.items;
    });
  }

  self.artistSearch = function() {
    Spotify.search(self.searchString, 'artist').then(function (data) {
      angular.forEach(data.artists.items, function(artist) {
        Spotify.getArtistTopTracks(artist.id, 'US').then(function (data) {
          self.results = self.results.concat(data.tracks)
        });
      });
    });
  }

  self.albumSearch = function() {
    self.results = [];
    Spotify.search(self.searchString, 'album').then(function (data) {
      angular.forEach(data.albums.items, function(album) {
        Spotify.getAlbumTracks(album.id).then(function (data) {
          console.log(data);
          self.results = self.results.concat(data.items)
        });
      });
    })
  }

}]);

spotified.directive('search', function() {
  return {
    restrict: 'E',
    controller: 'SearchCtrl as searchCtrl',
    templateUrl: '/search/search.html'
  }
})

spotified.controller('SongCtrl', function() {
  var self = this;

  self.parseArtists = function(_artists) {
    var artists = _artists.map(function(artist) { return artist.name });

    return artists.join(", ");
  }
});

spotified.directive('song', function() {
  return {
    restrict: 'E',
    scope: {
      'obj': '='
    },
    link: function(scope) {
      console.log(scope.obj);
    },
    controller: 'SongCtrl as songCtrl',
    templateUrl: '/songs/song.html'
  }
})
