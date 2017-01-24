spotified.directive('song', function() {
  return {
    restrict: 'E',
    scope: {
      'obj': '='
    },
    link: function(scope) {
    },
    controller: 'SongCtrl as songCtrl',
    templateUrl: '/songs/song.html'
  }
})
