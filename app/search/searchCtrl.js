spotified.controller('SearchCtrl', ['Spotify', function(Spotify) {
  var self = this;

  self.searchString = "";
  self.results = [];
  self.searchType = "track";
  self.test = "TESTIN!"

  self.search = function() {
    if (self.searchType === "artist") {
      self.artistSearch();
    } else if (self.searchType === "album") {
      self.albumSearch();
    } else {
      self.trackSearch();
    }
  }

  self.trackSearch = function() {
    Spotify.search(self.searchString, 'track').then(function (data) {
      self.results = data.tracks.items;
    });
  }

  self.artistSearch = function() {
    Spotify.search(self.searchString, 'artist').then(function (data) {
      angular.forEach(data.artists.items, function(artist) {
        Spotify.getArtistTopTracks(artist.id, 'US').then(function (data) {
          self.results = self.results.concat(data.tracks)
        });
      });
    });
  }

  self.albumSearch = function() {
    self.results = [];
    Spotify.search(self.searchString, 'album').then(function (data) {
      angular.forEach(data.albums.items, function(album) {
        Spotify.getAlbumTracks(album.id).then(function (data) {
          console.log(data);
          self.results = self.results.concat(data.items)
        });
      });
    })
  }

}]);
