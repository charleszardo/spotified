spotified.factory('PlaylistsService', function($firebaseArray){
  var playlistsRef = firebase.database().ref('playlists');

  var o = {};

  o.forUser = function(uid) {
    return $firebaseArray(playlistsRef.child(uid));
  }

  o.add = function(playlist) {

  }

  return o;
});
