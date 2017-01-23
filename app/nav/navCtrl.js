spotified.controller('NavCtrl', ['Auth', function(Auth) {
  var self = this;

  self.auth = Auth;

  self.auth.$onAuthStateChanged(function(firebaseUser) {
    self.firebaseUser = firebaseUser;
  });
}]);
