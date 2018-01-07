Template.smallProfile.helpers({
  imgSrc: (id) => {
      //console.log("test: "+ id)
      //return "test/"+id+".img";
      
      var photo = ProfilePhotos.findOne({ authorId: id, type: "profile" });
      //console.log(photo)
      return photo.url;
  }  
    
    

});

Template.smallProfile.helpers({
    
    tags: function() {
        return "tags";
    }
});

Template.smallProfile.onCreated(function() {
    this.searchQuery = new ReactiveVar('');
	this.filter = new ReactiveVar('all');
	this.limit = new ReactiveVar(20);
  this.autorun(() => {
    this.subscribe('profilePhotos.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
  });
});
