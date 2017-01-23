spotified.controller('AuthCtrl', function(Auth, $state){
  var self = this;

  self.user = {
    email: '',
    password: ''
  };

  self.login = function (){
    Auth.$signInWithEmailAndPassword(self.user.email, self.user.password).then(function (auth){
      $state.go('home');
    }, function (error){
      self.error = error;
    });
  };

  self.register = function (){
    Auth.$createUserWithEmailAndPassword(self.user.email, self.user.password).then(function (user){
      $state.go('home');
    }, function (error){
      self.error = error;
    });
  };
});
