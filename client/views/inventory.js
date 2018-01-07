Template.Inventory.onCreated(function() {

  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
  this.limit = new ReactiveVar(20);
  this.imageSrc = new ReactiveVar('');
  this.imageLabels = new ReactiveVar([{name:"test"}]);
  this.imageColors = new ReactiveVar([]);
  Session.set('isMenuHidden', false);
  Session.set('imageLabels', [{name:""}]);
  Session.set('imageColors', [{name:""}]);
  Session.set('tags', []);
  Session.set('searchQuery','')


  this.autorun(() => {
      this.subscribe('boards.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
      this.subscribe('resources.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
      this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
      this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());

  });

});
Template.Inventory.onRendered(function() {

  var acc = document.getElementsByClassName("accordion-toggle");
	var i;

	for (i = 0; i < acc.length; i++) {
	    acc[i].onclick = function(){
	        /* Toggle between adding and removing the "active" class,
	        to highlight the button that controls the panel */
	        this.classList.toggle("active");

	        /* Toggle between hiding and showing the active panel */
	        var panel = this.nextElementSibling;
	        if (panel.style.display === "block") {
	            panel.style.display = "none";
	        } else {
	            panel.style.display = "block";
	        }
	    }
	}
    
    $('.gallery-blocks').masonry({
      // options...
      itemSelector: '.show-gallery'
    });


});

Template.Inventory.helpers({

  colors: function() {

    return ["Blue","Green"]

  },

  tags: function() {

    return ["Sweater","Dress", "Camisole"]

  },

  items: function() {
      
    $('.gallery-blocks').masonry({
      // options...
      itemSelector: '.show-gallery'
    });

    return Resources.find({ authorId: Meteor.userId()});

  }



});

Template.Inventory.events({

// Toggle search menu
  "click .category-hide-menu": function (event, template) {

    if(Session.get('isMenuHidden')){
      $("#search-category-menu").hide()
      Session.set('isMenuHidden',true)
    } else {
      $("#search-category-menu").show()
      Session.set('isMenuHidden',false)
    }

  },

  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    Session.set('searchQuery',template.find('[data-id=search-query]').value)
    template.searchQuery.set(template.find('[data-id=search-query]').value);
    template.limit.set(20);
  }, 300)


});
