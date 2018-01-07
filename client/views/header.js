Template.header.events({
  'click [data-id=sign-out]': function() {
    Meteor.logout(function(error) {
      if (error) {
        alert(error.reason);
      } else {
        FlowRouter.go('/sign-in');
      }
    });
  },

  /*'click .left-sidebar-trigger': function() {
      $('.open-left-sidebar').trigger( "click" );
  },*/

  'click .right-sidebar-trigger': function() {
    
      $('.open-right-sidebar')[0].trigger('click');
  },
    
  /*'click .left-menu-arrow': function() {
      history.go(-1);
  },
    
  'click .open-left-sidebar-back': function() {
      history.go(-1);
  },
    
  'click .left-sidebar-trigger-back': function() {
      $('.open-left-sidebar-back').trigger( "click" );
  },*/
    
  'click, touchstart .open-left-sidebar-back': function(event){
            // add function
      history.go(-1);
            
   }
  
    
  
 


});


// Template.header.onRendered(() => {


// var current = FlowRouter.current();

// if(current.path == '/feed'){
//    $('.left-sidebar-trigger-back').addClass('disabled');
// }else{
//     $('.left-sidebar-trigger-back').removeClass('disabled');
// }
// });

// Tracker.autorun(function() {
//   var routeName = FlowRouter.getRouteName();
//   alert(":", routeName);
// });