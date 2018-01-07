Meteor.methods({
  'users.updateProfile': (user) => {
    check(user, {
      biography: String,
      socialMedia: Object
    });

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $set: { biography: user.biography, socialMedia: user.socialMedia } } );
  },

  'users.follow': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (Meteor.userId() === _id) {
      throw new Meteor.Error(422, 'You can not follow yourself');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $addToSet: { followingIds: _id } });
  },

  'users.unfollow': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (Meteor.userId() === _id) {
      throw new Meteor.Error(422, 'You can not unfollow yourself');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $pull: { followingIds: _id } });
  },
    
   'users.create': (options, callback) => {
       
        check(options, {
            username: String,
            password: String,
            email: String,
            isPrivate: Boolean
       });
       
       if(Meteor.isServer){
           
           let userEmailExists = Accounts.findUserByEmail(options.email);
           let userNameExists  = Accounts.findUserByUsername(options.username);
       
           if (userEmailExists) { 
               throw new Meteor.Error(423, 'email already exists');
           }
           else if (userNameExists) {
               throw new Meteor.Error(424, 'username already exists');
           }
           else {
               console.log("creating user")
               Accounts.createUser(options);
               console.log("user created")
               return false;
               
           }
       
           
           
       }

     
  }
    
    
    
});
