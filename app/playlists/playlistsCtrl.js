spotified.controller('PlaylistsCtrl', ['$firebaseObject', '$firebaseArray', 'Auth', '$state', 'md5', 'auth', 'userId', 'playlists', function($firebaseObject, $firebaseArray, Auth, $state, md5, auth, userId, playlists) {
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
}]);
