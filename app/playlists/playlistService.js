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
