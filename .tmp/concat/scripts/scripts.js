/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.1 - 2015-02-20
 * License: MIT
 */
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function () {
            return hostElPos.left;
          },
          right: function () {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function () {
            return hostElPos.top;
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);

'use strict';

var spotified = angular.module('spotifiedApp', ['firebase', 'angular-md5', 'ui.router', 'spotify', 'mwl.confirm', 'dndLists', 'xeditable'])

spotified.run(["editableOptions", function(editableOptions) {
  editableOptions.theme = 'bs3';
}]);

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

// spotified.run(function(editableOptions) {
//   editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
// });

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

  o.updateSong = function(song) {
    var list = $firebaseArray(songsRef);
    var rec = list.$getRecord(song.$id);
    console.log(song)
    console.log(rec)
  }

  return o;
}]);

spotified.controller('PlaylistCtrl', ['$window', '$scope', 'playlist', 'songs', 'PlaylistService', function($window, $scope, playlist, songs, PlaylistService) {
  var self = this;

  self.playlist = playlist;
  self.title = playlist.title;
  self.songs = songs;
  self.songTitle = "";
  self.maxSongs = 10;

  self.export = function() {
    var uri = "data:application/json;charset=UTF-8," + encodeURIComponent(self.playlistJSON());

    $window.open(uri);
  }

  self.playlistJSON = function() {
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

  self.printSongs = function() {
    console.log(self.songs);
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

  self.parseItem = function(songObj) {
    var trackNo = self.songs.length,
        songData,
        song;

    if (trackNo >= 10) { return; }

    songData = { title: songObj.name,
                 artist: songObj.artists[0].name,
                 album: songObj.album.name,
                 note: '',
                 customImage: '' }

    return { data: songData, playlistId: self.playlist.$id }
  }

  self.updateSong = function (song) {
    self.songs.$remove(song).then(function (){
      self.songs.$add(song).then(function (){
      });
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
