spotified.controller('SearchCtrl', ['Spotify', function(Spotify) {
  var self = this;

  self.searchString = "";
  self.results = [];

  self.search = function() {
    Spotify.search(self.searchString, ['track']).then(function (data) {
      self.results = data.tracks.items;
      console.log(data);
      console.log(self.results);
    });
  }

}]);
