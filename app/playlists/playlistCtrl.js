spotified.controller('PlaylistCtrl', ['playlist', 'songs', function(playlist, songs) {
  var self = this;

  self.playlist = playlist;
  self.title = playlist.title;
  self.songs = songs;
  self.songTitle = ""

  self.addSong = function(songObj) {
    console.log(songObj.artists[0].name)
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
