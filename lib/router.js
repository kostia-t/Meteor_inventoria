publicAccessible = FlowRouter.group({});

signInRequired = FlowRouter.group({
  triggersEnter: [AccountsTemplates.ensureSignedIn]
});


publicAccessible.route('/register', {
  name: 'register',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'register'
    });
    setTitle('Register');
     Template.register.rendered = function () {
        $('.left-sidebar-trigger-back').addClass('disabled');
     }
    

  }
});

publicAccessible.route('/signin', {
  name: 'login',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'login'
    });
    setTitle('Login');
    Template.login.rendered = function () {
        $('.left-sidebar-trigger-back').addClass('disabled');
     }
    

  }
});

publicAccessible.route('/login', {
  name: 'login',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'login'
    });
    setTitle('Login');
    
      Template.login.rendered = function () {
        $('.left-sidebar-trigger-back').addClass('disabled');
     }
  }
});

publicAccessible.route('/recovery', {
  name: 'passwordRecovery',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'passwordRecovery'
    });
    setTitle('Password Recovery');
    

  }
});



signInRequired.route('/', {
  name: 'home',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'home_profile'
    });
    setTitle('Home');
    FlowRouter.redirect("/feed")

  }
});

signInRequired.route('/feed', {
  name: 'feed',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'feed'
    });
    setTitle('Feed');
    Template.feed.rendered = function () {
            $('.left-sidebar-trigger-back').addClass('disabled');
            console.log("loading custom scripts....")
            $('body').append('<script src="../../../inventoria-custom.js"></script>');

        }
  }
});

signInRequired.route('/update-profile', {
  name: 'updateProfile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'updateProfile'
    });
    setTitle('Update profile');
  }
});

signInRequired.route('/users/:_id', {
  name: 'profile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'profile'
    });
    setTitle('Profile');
    Template.profile.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});

signInRequired.route('/browse-users', {
  name: 'browseUsers',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'browseUsers'
    });
    setTitle('Browse users');
    Template.browseUsers.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});

signInRequired.route('/following', {
  name: 'following',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'following'
    });
    setTitle('Following');
    Template.following.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});

signInRequired.route('/follower', {
  name: 'follower',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'follower'
    });
    setTitle('Follower');
    Template.follower.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});

signInRequired.route('/viewfollowing/:_id', {
  name: 'viewfollower',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'view_following'
    });
    setTitle('Following');
    Template.view_following.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});

signInRequired.route('/viewfollower/:_id', {
  name: 'viewfollower',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'view_follower'
    });
    setTitle('Follower');
    Template.view_follower.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});


signInRequired.route('/messages', {
  name: 'messages',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'messages'
    });
    setTitle('Messages');
    Template.messages.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});

signInRequired.route('/jobBoard', {
  name: 'jobBoard',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'jobBoard'
    });
    setTitle('Job board');
    Template.jobBoard.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
  }
});

signInRequired.route('/addToInventory', {
	  name: 'newInventory',
	  action: () => {
	    BlazeLayout.render('layout', {
	      main: 'addToInventory'
	    });
	    setTitle('Add New Item');
      Template.addToInventory.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
	  }
	}
);

signInRequired.route('/Inventory', {
	  name: 'Inventory',
	  action: () => {
	    BlazeLayout.render('layout', {
	      main: 'Inventory'
	    });
	    setTitle('Inventory');
      Template.Inventory.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
	  }
	}
);

signInRequired.route('/item/:_id', {
	  name: 'Photo',
	  action: () => {
	    BlazeLayout.render('layout', {
	      main: 'photo'
	    });
	    setTitle('Photo');
      Template.photo.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
	  }
	}
);

signInRequired.route('/home', {
	  name: 'home',
	  action: () => {
	    BlazeLayout.render('layout', {
	      main: 'home_profile'
	    });
	    setTitle('home');
       
        Template.home_profile.rendered = function () {
            console.log("loading custom scripts....")
            $('body').append('<script src="../../../inventoria-custom.js"></script>');

        }
	  }
	}
);

signInRequired.route('/search', {
	  name: 'search',
	  action: () => {
	    BlazeLayout.render('layout', {
	      main: 'search'
	    });
	    setTitle('search');
      Template.search.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
	  }
	}
);

signInRequired.route('/editImage', {
	  name: 'Edit',
	  action: () => {
	    BlazeLayout.render('layout', {
	      main: 'imageEditor'
	    });
	    setTitle('Edit');
      Template.imageEditor.rendered = function () {
        $('.left-sidebar-trigger-back').removeClass('disabled');
    }
	  }
	}
);
