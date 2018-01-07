Template.view_following.helpers({
  users: () => {
      
      users = Meteor.users.find({ _id: { $eq: FlowRouter.getParam('_id')} }, { sort: { username: 1 } }).fetch()
      
      user = users[0];
         
      if (user.followingIds && user.followingIds.length !== 0) {
        return Meteor.users.find({ _id: { $in: user.followingIds } }, { sort: { username: 1 } });
      } else {
        return [];
      }
      
  }
});

Template.view_following.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);
  this.filter = new ReactiveVar('all');
  this.usersCount = new ReactiveVar(0);
  this.autorun(() => {
    //this.subscribe('users.all');
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
  });
});
