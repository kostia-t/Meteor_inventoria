Template.registerHelper('getProfileImage', function(id, options) {
  if(id){
    var photo = ProfilePhotos.findOne({ authorId: id });
    return photo.url;
  }
    
});

Template.smallProfileImage.helpers({
  testFunction: () => {
      
      console.log("test")
      return "test/"+id+".img";
  }  

});

Template.smallProfileImage.onCreated(function() {
  this.autorun(() => {
    this.subscribe('profilePhotos.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
  });
});