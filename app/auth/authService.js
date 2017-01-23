spotified.factory('AuthService', function($firebaseAuth){
  var auth = $firebaseAuth();
  
  return auth;
});
