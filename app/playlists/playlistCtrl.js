spotified.controller('PlaylistCtrl', ['playlist', 'songs', function(playlist, songs) {
  var self = this;

  self.playlist = playlist;
  self.title = playlist.title;
  self.songs = songs;
  self.songTitle = ""

  self.addSong = function() {
    var trackNo = self.songs.length;
    if (trackNo >= 10) { return; }
    var song = { data: { title: self.songTitle }, playlistId: self.playlist.$id, ord: trackNo }
    self.songs.$add(song).then(function (){
      self.songTitle = '';
    });
  }

  self.getSongs = function() {
    var songsRef = firebase.database().ref('songs');

    return $firebaseArray(songsRef.child(playlistId));
  }
}]);
