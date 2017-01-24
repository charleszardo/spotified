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
