Template.showContent.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
  this.limit = new ReactiveVar(20);
  this.resourcesCount = new ReactiveVar(0);

  this.autorun(() => {
    //this.subscribe('boards.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('resources.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.resourcesCount.set(Counts.get('resources.all'));
  });
  
  
});

Template.showContent.helpers({
	
	userContentGridItems: function (){
	
		if (  !(typeof Meteor.user() === "undefined") ){
			
			var collectionList = Resources.find({owner: Meteor.user()._id}).fetch();
		    collectionList = Resources.find().fetch();					
			
			return collectionList;
		
		}
	},
	
	hasMoreContent: () => {
	    return Template.instance().limit.get() <= Template.instance().resourcesCount.get();
	  },
	
	
});

