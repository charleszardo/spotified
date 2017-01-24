spotified.controller('PlaylistCtrl', ['$window', 'playlist', 'songs', function($window, playlist, songs) {
  var self = this;

  self.playlist = playlist;
  self.title = playlist.title;
  self.songs = songs;
  self.songTitle = ""

  self.export = function() {
    var uri = "data:application/json;charset=UTF-8," + encodeURIComponent(self.playlistJSON());

    $window.open(uri);
  }

  self.playlistJSON = function() {
    console.log("OKAY!")
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

  self.removeSong = function(song) {
    self.songs.$remove(song).then(function (){
    });
  }

  self.getSongs = function() {
    var songsRef = firebase.database().ref('songs');

    return $firebaseArray(songsRef.child(playlistId));
  }
}]);
