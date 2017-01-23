spotified.factory('SongsService', [function() {
  var songsRef = firebase.database().ref('songs');

  var o = {};

  o.forPlaylist = function(uid) {
    return $firebaseArray(songsRef.child(playlistId));
  }
}]);
