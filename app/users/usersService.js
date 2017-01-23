spotified.factory('UsersService', function($firebaseArray, $firebaseObject){
  var usersRef = firebase.database().ref('users');
  var users = $firebaseArray(usersRef);

  var Users = {
    getUser: function(uid){
      return $firebaseObject(usersRef.child(uid));
    }
  };

  return Users;
});
