spotified.controller('PlaylistCtrl', ['$window', '$scope', 'playlist', 'songs', 'PlaylistService', function($window, $scope, playlist, songs, PlaylistService) {
  var self = this;

  self.playlist = playlist;
  self.title = playlist.title;
  self.songs = songs;
  self.songTitle = "";
  self.maxSongs = 10;

  self.export = function() {
    var uri = "data:application/json;charset=UTF-8," + encodeURIComponent(self.playlistJSON());

    $window.open(uri);
  }

  self.playlistJSON = function() {
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

  self.printSongs = function() {
    console.log(self.songs);
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
                 customImage: '' }
    song = { data: songData, playlistId: self.playlist.$id }

    self.songs.$add(song).then(function (){
      self.songTitle = '';
    });
  }

  self.parseItem = function(songObj) {
    var trackNo = self.songs.length,
        songData,
        song;

    if (trackNo >= 10) { return; }

    songData = { title: songObj.name,
                 artist: songObj.artists[0].name,
                 album: songObj.album.name,
                 note: '',
                 customImage: '' }

    return { data: songData, playlistId: self.playlist.$id }
  }

  self.updateSong = function (song) {
    self.songs.$remove(song).then(function (){
      self.songs.$add(song).then(function (){
      });
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
