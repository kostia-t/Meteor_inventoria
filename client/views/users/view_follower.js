Template.view_follower.helpers({
  users: () => {
    
    
      console.log(Meteor.users.find({ _id: { $ne: FlowRouter.getParam('_id')} }, { sort: { username: 1 } }).count())
    
      console.log(Meteor.users.find({ followingIds: FlowRouter.getParam('_id')} , { sort: { username: 1 } }).count())
      
      //return Meteor.users.find({ _id: { $ne: FlowRouter.getParam('_id')} }, { sort: { username: 1 } });
    
      return Meteor.users.find({ followingIds: FlowRouter.getParam('_id')} , { sort: { username: 1 } });
   
  }
});

Template.follower.onCreated(function() {
  this.autorun(() => {
    this.subscribe('users.all');
  });
});
