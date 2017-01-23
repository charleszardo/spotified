spotified.controller('NavCtrl', ['AuthService', function(AuthService) {
  var self = this;

  self.auth = AuthService;

  self.auth.$onAuthStateChanged(function(firebaseUser) {
    self.firebaseUser = firebaseUser;
  });
}]);
