import masonry from 'masonry-layout';

Template.profile.events({
  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  }
});

Template.profile.helpers({
  
  coverSrc: () => {
          
          var profilePhoto = ProfilePhotos.find({});
          console.log(profilePhoto.fetch())
          
          if(Session.get('coverSrc')){
              return Session.get('coverSrc');
          }  
          else{
              //console.log(ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "cover" }))
              var photo = ProfilePhotos.findOne({ authorId: FlowRouter.getParam('_id'), type: "cover" });
              return photo.url;
           }	
          
  }, 
 imageSrc: () => {

      if(Session.get('imageSrc')){
          return Session.get('imageSrc');
      }  
      else{
          
          //console.log(ProfilePhotos.findOne({ authorId: FlowRouter.getParam('_id') }))
          var photo = ProfilePhotos.findOne({ authorId: FlowRouter.getParam('_id') });
          return photo.url;
       }	

    },
    
  user: () => {
    return Meteor.users.findOne({ _id: FlowRouter.getParam('_id') });
  },
    
  isCurrentUser: () => {
    
      if(Meteor.userId() == FlowRouter.getParam('_id')){
          return true;
      } else{
          return false;
      }
  },

  posts: function() {
    return Posts.find({}, { sort: { createdAt: -1 } });
  },

  followingCount: function(){  
    
    let user = Meteor.users.findOne({_id: FlowRouter.getParam('_id')});
    console.log(user)
    
    if (typeof(user) != "undefined"){  
        if (user.followingIds && user.followingIds.length !== 0) {
          //return Meteor.users.find({ _id: { $in: user.followingIds } }, { sort: { username: 1 } }).count();
          return Meteor.users.find({ _id: { $in: user.followingIds } }, { sort: { username: 1 } }).count();
        } else {
          return 0;
        }
    }
    else{
        return 0;
    }
      
  },
    
 followerCount: function(){
   
     /*let user = Meteor.users.findOne({_id: FlowRouter.getParam('_id')});
     
     if (typeof(user) != "undefined"){ 
        if (user.followingIds && user.followingIds.length !== 0) {
          return user.followingIds.length
        } else {
          return 0;
        }
     }
     else{
         return 0;
     }
     */
     
     //return Meteor.users.find({ _id: { $ne: FlowRouter.getParam('_id') } }, { sort: { username: 1 } }).count();
     
     return Meteor.users.find({ followingIds: FlowRouter.getParam('_id')} , { sort: { username: 1 } }).count();
     
     
 },
  
  items: function(){
     
    var msnry = new Masonry( '.gallery-blocks', {
      itemSelector: '.show-gallery'
    });

      
      return Resources.find({authorId: FlowRouter.getParam('_id') })
  },    

  hasMorePosts: () => {
    return Template.instance().limit.get() <= Template.instance().userPostsCount.get();
  }
    
    
});

Template.profile.onRendered(function() {
     
    
    $.getScript('lib/custom.js', function(){
	        // script should be loaded and do something with it.
					console.log("loaded")

	});
    
    
    
    
    var msnry = new Masonry( '.gallery-blocks', {
      itemSelector: '.show-gallery',
      columnWidth: 138
    });


    /*$( ".show-gallery:first" ).load(function() {
        // Handler for .load() called.
         var msnry = new Masonry( '.gallery-blocks', {
            itemSelector: '.show-gallery',
            columnWidth: 138
        });
    });*/
    
    var masonryDelay  = window.setTimeout(slowMasonry, 2000);
    
    function slowMasonry() {
        console.log('That was really slow!');
        var msnry = new Masonry( '.gallery-blocks', {
        itemSelector: '.show-gallery'
        //, columnWidth: 138
    });
    }
    
    
    
    
   
});

Template.profile.onCreated(function () {
  this.limit = new ReactiveVar(20);
  this.userPostsCount = new ReactiveVar(0);
    
  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
	this.limit = new ReactiveVar(20);
	this.imageSrc = new ReactiveVar('');
	this.imageLabels = new ReactiveVar([{name:"test"}]);
	this.imageColors = new ReactiveVar([]);
	Session.set('imageLabels', [{name:""}]);
	Session.set('imageColors', [{name:""}]);
	Session.set('tags', []);
    Session.set('coverSrc', null);
    Session.set('imageSrc', null);


	

  this.autorun(() => {
    this.subscribe('users.profile', FlowRouter.getParam('_id'), this.limit.get());
    this.userPostsCount.set(Counts.get('users.profile'));
    
    this.subscribe('boards.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('resources.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('profilePhotos.all', this.searchQuery.get(), this.filter.get(), this.limit.get());

    // Get current user's social media accounts
    let profileUser = Meteor.users.findOne({_id: FlowRouter.getParam('_id')});

    // Display social media links
    if (profileUser && profileUser.socialMedia) {
      $('#socialMediaAccounts').empty();
      for (var prop in profileUser.socialMedia) {
        let smLink = '<a id="' + prop + '" class="smAccount" href="' + profileUser.socialMedia[prop] + '"><img src="/img/' + prop + '.svg"/></a>';
        $(smLink).appendTo('#socialMediaAccounts');
      }
    }
  });
});
