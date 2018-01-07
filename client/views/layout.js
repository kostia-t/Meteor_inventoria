let getHeight = () => {
  let windowHeight = $(window).height(),
      headerHeight = $('.main-header').outerHeight(true),
      footerHeight = $('.footer').outerHeight(true);

  return `${windowHeight - headerHeight - footerHeight}px`;
};

Template.layout.onCreated(function() {
  this.minHeight = new ReactiveVar(0);
});

Template.layout.onRendered(function() {
  this.minHeight.set(getHeight());

  $(window).resize(() => {
    this.minHeight.set(getHeight());
  });
    
   $("body").scrollTop(0);
});

Template.layout.events({
  "click #logoutitem": function (event, template) {
      Meteor.logout();
      window.location.href = '/sign-in';
  }
});