spotified.controller('NavCtrl', ['$location', 'AuthService', function($location, AuthService) {
  var self = this;

  self.auth = AuthService;
  self.signOutText = 'Sign Out';

  self.auth.$onAuthStateChanged(function(firebaseUser) {
    self.firebaseUser = firebaseUser;
  });

  self.signOut = function() {
    self.auth.$signOut().then(function(){
      $location.url('/');
    });
  }
}]);
