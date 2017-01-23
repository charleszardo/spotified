spotified.directive('song', function() {
  return {
    restrict: 'E',
    scope: {
      'obj': '='
    },
    link: function(scope) {
      console.log(scope.obj);
    },
    controller: 'SongCtrl as songCtrl',
    templateUrl: '/songs/song.html'
  }
})
