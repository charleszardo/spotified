spotified.directive('search', function() {
  return {
    restrict: 'E',
    controller: 'SearchCtrl as searchCtrl',
    templateUrl: '/search/search.html'
  }
})
