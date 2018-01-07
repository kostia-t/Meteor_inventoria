import masonry from 'masonry-layout';

Template.home_profile.events({
  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  }
});

Template.home_profile.helpers({
  
 coverSrc: () => {
          
          var profilePhoto = ProfilePhotos.find({});
          //console.log(profilePhoto.fetch())
          
          if(Session.get('coverSrc')){
              return Session.get('coverSrc');
          }  
          else{
              //console.log(ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "cover" }))
              var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "cover" });
              return photo.url;
           }	
          
  		},
    
 imageSrc: () => {
             
      var profilePhoto = ProfilePhotos.find({});
      //console.log(profilePhoto.fetch())

      if(Session.get('imageSrc')){
          return Session.get('imageSrc');
      }  
      else{
          //console.log(ProfilePhotos.findOne({ authorId: Meteor.userId() }))
          var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "profile" });
          return photo.url;
       }	

    },
    
  user: () => {
    return Meteor.users.findOne({ _id: Meteor.userId() });
  },

  posts: function() {
    return Posts.find({}, { sort: { createdAt: -1 } });
  },

  followingCount: function(){  
    
    let user = Meteor.users.findOne({_id: Meteor.userId()});
      
    if (user.followingIds && user.followingIds.length !== 0) {
      //return Meteor.users.find({ _id: { $in: user.followingIds } }, { sort: { username: 1 } }).count();
      return Meteor.users.find({ _id: { $in: Meteor.user().followingIds } }, { sort: { username: 1 } }).count();
    } else {
      return 0;
    }
      
  },
    
 followerCount: function(){
   
     //let user = Meteor.users.findOne({_id: Meteor.userId()});
     
     /*
     console.log(user.followingIds)
     
     if (user.followingIds && user.followingIds.length !== 0) {
      //return user.followingIds.length
      return Meteor.users.find({ _id: { $ne: Meteor.userId() } }, { sort: { username: 1 } }).count();
    } else {
      return 0;
    }*/
     
       //console.log(user.followingIds.length)
     
     //return Meteor.users.find({ _id: { $ne: Meteor.userId() } }, { sort: { username: 1 } }).count();
     
     return Meteor.users.find({ followingIds: Meteor.userId()} , { sort: { username: 1 } }).count();
     
 },
  
  items: function(){
      
    var msnry = new Masonry( '.gallery-blocks', {
      itemSelector: '.show-gallery'
    });
      
      return Resources.find({authorId: Meteor.userId()})
  },    

  hasMorePosts: () => {
    return Template.instance().limit.get() <= Template.instance().userPostsCount.get();
  }
    
    
});

Template.home_profile.onRendered(function() {
    
    $.getScript('lib/custom.js', function(){
	        // script should be loaded and do something with it.
					console.log("loaded")

	});
    
    
     var msnry = new Masonry( '.gallery-blocks', {
      itemSelector: '.show-gallery',
      columnWidth: 138
    });
    
    var masonryDelay  = window.setTimeout(slowMasonry, 2000);
    
    function slowMasonry() {
        console.log('That was really slow!');
        var msnry = new Masonry( '.gallery-blocks', {
        itemSelector: '.show-gallery'
        //, columnWidth: 138
    });
    }
    
    
    
    
    

});

Template.home_profile.onCreated(function () {
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


	

  this.autorun(() => {
    this.subscribe('users.profile', Meteor.userId(), this.limit.get());
    this.userPostsCount.set(Counts.get('users.profile'));
    Session.set('imageSrc', null);
    Session.set('coverSrc', null);
    
    this.subscribe('boards.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
		  this.subscribe('resources.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
		  this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
		  this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
          this.subscribe('profilePhotos.all', this.searchQuery.get(), this.filter.get(), this.limit.get());

    // Get current user's social media accounts
    let profileUser = Meteor.users.findOne({_id: Meteor.userId()});

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
