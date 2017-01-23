spotified.controller('PlaylistCtrl', ['playlist', function(playlist) {
  var self = this;

  self.playlist = playlist;
  self.title = playlist.title;
}]);
