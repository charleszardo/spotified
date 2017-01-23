spotified.controller('AuthCtrl', ['AuthService', '$state', function(AuthService, $state){
  var self = this;

  self.user = {
    email: '',
    password: ''
  };

  self.login = function (){
    AuthService.$signInWithEmailAndPassword(self.user.email, self.user.password).then(function (auth){
      $state.go('home');
    }, function (error){
      self.error = error;
    });
  };

  self.register = function (){
    AuthService.$createUserWithEmailAndPassword(self.user.email, self.user.password).then(function (user){
      $state.go('home');
    }, function (error){
      self.error = error;
    });
  };
}]);
