spotified.factory('PlaylistService', ['$firebaseArray', function($firebaseArray) {
  var songsRef = firebase.database().ref('song');

  var o = {};

  o.getSongs = function(playlistId) {
    return $firebaseArray(songsRef.child(playlistId));
  }

  return o;
}]);
