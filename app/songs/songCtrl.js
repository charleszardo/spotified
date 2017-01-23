spotified.controller('SongCtrl', function() {
  var self = this;

  self.parseArtists = function(_artists) {
    var artists = _artists.map(function(artist) { return artist.name });

    return artists.join(", ");
  }
});
