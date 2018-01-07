Template.updateProfile.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);
  this.filter = new ReactiveVar('all');
  this.usersCount = new ReactiveVar(0);
  Session.set('imageSrc', null);
  Session.set('coverSrc', null);

  this.autorun(() => {
    // Set subscriptions
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.subscribe('profilePhotos.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    
    this.usersCount.set(Counts.get('users.all'));

    // Get current user's social media accounts
    let currentUser = Meteor.users.findOne({_id: Meteor.userId()});

    // Display social media links
    if (currentUser && currentUser.socialMedia) {
      $('#socialMediaAccounts').empty();
      for (var prop in currentUser.socialMedia) {
        let smLink = '<a id="' + prop + '" class="smAccount" href="' + currentUser.socialMedia[prop] + '"><img src="/img/' + prop + '.svg"/></a>';
        $(smLink).appendTo('#socialMediaAccounts');
      }
    }
  });
});

Template.updateProfile.onRendered(function() {
  $('input[type=submit]').addClass('disabled');
  Session.set('startingBio', $('[data-id=biography]').val());
});

Template.updateProfile.helpers({
      imageSrc: function() {
          
          var profilePhoto = ProfilePhotos.find({});
          console.log(profilePhoto.fetch())
          
          if(Session.get('imageSrc')){
              return Session.get('imageSrc');
          }  
          else{
              //console.log(ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "profile" }))
              var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "profile" });
              return photo.url;
           }	
          
  		},
       coverSrc: function() {
          
          var profilePhoto = ProfilePhotos.find({});
          console.log(profilePhoto.fetch())
          
          if(Session.get('coverSrc')){
              return Session.get('coverSrc');
          }  
          else{
              //console.log(ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "cover" }))
              var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "cover" });
              return photo.url;
           }	
          
  		}
    
    
    
 });

Template.updateProfile.events({
  "click #logout": function (event, template) {
      Meteor.logout();
      window.location.href = '/login';
  },
  
  "click #userPhoto": function (event, template) {
  
    var fileInput = document.getElementById('photofileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');
     
    if(Meteor.isCordova){
        
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL });

        function onSuccess(imageURI) {
            var image = new Image();
            image.src = "data:image/jpeg;base64, " + imageURI;
            
            var fileDisplayArea = document.getElementById('fileDisplayArea');
            fileDisplayArea.appendChild(image);

            var imgList = image.src.split(",");

            // upload image to S3
            uploadtoS3(image.src, function(e,r){

                console.log(r.url);

                var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "profile" });
                if(photo){
                    Meteor.call('profilePhotos.update',photo._id, r.url, "profile", (error,result) => {
                        if (error) {
                          console.log(error)
                          Bert.alert(error.reason, 'danger', 'fixed-top');
                        }
                        Bert.alert('Profile photo successfully updated', 'success', 'fixed-top');
                    });
                }
                else{
                    Meteor.call('profilePhotos.insert', r.url, "profile", (error,result) => {
                        if (error) {
                          console.log(error)
                          Bert.alert(error.reason, 'danger', 'fixed-top');
                        }
                        Bert.alert('Profile photo successfully created', 'success', 'fixed-top');
                    }); 
                }

                Session.set('imageSrc', r.url);
               fileInput.value= null;

            });
            
        }

        function onFail(message) {
            console.log('Failed because: ' + message);
            Bert.alert(message, 'danger', 'fixed-top');
        }
            
        
    } else {
        
        $("#photofileInput").trigger("click");
      
        fileInput.addEventListener('change', function(e) {
         
            var file = fileInput.files[0];
            var imageType = /image.*/;

            console.log('triggered');

            setProfilePhoto(file, imageType, fileInput, fileDisplayArea)

        }); 
        
    }
      
     
    
    
    },
    
  "click #userBackground": function (event, template) {
  
        var fileInput = document.getElementById('coverfileInput');
        var fileDisplayArea = document.getElementById('fileDisplayArea');

        if(Meteor.isCordova){
            
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL });

            function onSuccess(imageURI) {
                var image = new Image();
                image.src = "data:image/jpeg;base64, " + imageURI;
            
                var fileDisplayArea = document.getElementById('fileDisplayArea');
                fileDisplayArea.appendChild(image);

                var imgList = image.src.split(",");

                // upload image to S3
                uploadtoS3(image.src, function(e,r){

                    console.log(r.url);

                    var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "cover" });
                    if(photo){
                        Meteor.call('profilePhotos.update', photo._id, r.url, "cover" , (error,result) => {
                            if (error) {
                              console.log(error)
                              Bert.alert(error.reason, 'danger', 'fixed-top');
                            }
                            Bert.alert('Profile cover successfully updated', 'success', 'fixed-top');
                        });
                    }
                    else{
                        Meteor.call('profilePhotos.insert', r.url, "cover",  (error,result) => {
                            if (error) {
                              console.log(error)
                              Bert.alert(error.reason, 'danger', 'fixed-top');
                            }
                            Bert.alert('Profile cover successfully created', 'success', 'fixed-top');
                        }); 
                    }

                    Session.set('coverSrc', r.url);
                    fileInput.value= null;

                });

            }

            function onFail(message) {
                console.log('Failed because: ' + message);
                Bert.alert(message, 'danger', 'fixed-top');
            }
            

        } else {

            $("#coverfileInput").trigger("click");

            fileInput.addEventListener('change', function(e) {
    
                var file = fileInput.files[0];
                var imageType = /image.*/;

                console.log('triggered')

                setCoverPhoto(file, imageType, fileInput, fileDisplayArea)

            });  

        }    
        
   
    
    
    },
    
    
  'keyup [data-id=biography], keyup [data-id=addSocialMedia]': (event, template) => {
    // If bio section has changed or social media section has text enable the submit button, else disable it
    if (template.find('[data-id=biography]').value !== Session.get('startingBio') || 
    template.find('[data-id=addSocialMedia]').value.toString().trim() !== '') {
      $('input[type=submit]').removeClass('disabled');
    } else {
      $('input[type=submit]').addClass('disabled');
    }
  },

  'submit [data-id=update-profile-form]': (event, template) => {
    event.preventDefault();

    // Only continue if button isn't disabled
    if (!$('input[type=submit]').hasClass('disabled')) {
      let user = {
        biography: template.find('[data-id=biography]').value,
        socialMedia: { }
      };

      // Get current social media accounts for this user
      user.socialMedia = Meteor.users.findOne({_id: Meteor.userId()}).socialMedia || {}; 

      let bioChanged = false,
          numSmAdded = 0,
          numInvalidSm = 0;
      if (user.biography !== Session.get('startingBio')) {
        bioChanged = true;
      }

      // Add social media accounts if any were entered
      let newSocialMedia = template.find('[data-id=addSocialMedia]').value.toString().split(',');
      for (let x = 0; x < newSocialMedia.length; x++) {
        newSocialMedia[x] = newSocialMedia[x].trim();

        if (newSocialMedia[x] !== '') {
          if (newSocialMedia[x].indexOf('http://') === -1 && newSocialMedia[x].indexOf('https://') === -1) {
            newSocialMedia[x] = 'http://' + newSocialMedia[x];
          }

          if (newSocialMedia[x].toLowerCase().indexOf('facebook') !== -1) {
            user.socialMedia.facebook = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('twitter') !== -1) {
            user.socialMedia.twitter = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('linkedin') !== -1) {
            user.socialMedia.linkedin = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('instagram') !== -1) {
            user.socialMedia.instagram = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('plus.google') !== -1) {
            user.socialMedia.googlePlus = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('github') !== -1) {
            user.socialMedia.github = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('youtube') !== -1) {
            user.socialMedia.youtube = newSocialMedia[x];
            numSmAdded++;
          } else {
            numInvalidSm++;
          }
        }
      }

      if (bioChanged || numSmAdded > 0) {
        Meteor.call('users.updateProfile', user, (error, result) => {
          if (error) {
            Bert.alert(error.reason, 'danger', 'fixed-top');
          } else {
            if (numInvalidSm > 0) {
              Bert.alert('Profile updated but some social media links were invalid', 'success', 'fixed-top');
            } else {
              Bert.alert('Profile successfully updated', 'success', 'fixed-top');
            }

            template.find('[data-id=addSocialMedia]').value = '';
          }
        });
      } else {
        Bert.alert('Invalid social media links', 'danger', 'fixed-top');
      }
    }
  }
});
    
    
//Image processing functions
function dataURItoBlob2(dataURI) {
	var binary = atob(dataURI.split(',')[1]);
	var array = [];
	for(var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

//Upload to S3
function uploadtoS3(imageSrc, callback){
    
    var fileList = [];
	var imageDataUrl = imageSrc;
	var blob = dataURItoBlob2(imageDataUrl);
    
    // Adding blob uri to fileList
	fileList.push(blob);
    
    // Upload to S3
	S3.upload({
		files:fileList,
		path:"images",
		region:"us-west-2"
		},function(e,r){
    
            if(e){
				console.log(e);
                Bert.alert(error.reason, 'danger', 'fixed-top');
                
                 callback(e, r);
			
            } else{
                
                console.log(r.url);
				//res.src = r.url;

				//console.log(res);
                
                /*
                var photo = ProfilePhotos.findOne({ authorId: Meteor.userId() });
                if(photo){
                    Meteor.call('profilePhotos.update',photo._id, r.url, (error,result) => {
                        if (error) {
                          console.log(error)
                          Bert.alert(error.reason, 'danger', 'fixed-top');
                        }
                        Bert.alert('Profile photo successfully updated', 'success', 'fixed-top');
                    });
                }
                else{
                    Meteor.call('profilePhotos.insert', r.url, (error,result) => {
                        if (error) {
                          console.log(error)
                          Bert.alert(error.reason, 'danger', 'fixed-top');
                        }
                        Bert.alert('Profile photo successfully created', 'success', 'fixed-top');
                    }); 
                }
                Session.set('imageSrc', r.url);
                */
                
                callback(e, r);
                
                
                
            }
        
            
    
    
        });

}

function setProfilePhoto(file, imageType, fileInput, fileDisplayArea){
    
    if (file.type.match(imageType)) {
            
            console.log('file type matches')
            
            var reader = new FileReader();
            
            Session.set('imageSrc', '/images/pictures/Preloader_7.gif');

            reader.onload = function(e) {
                // Create a new image.
	    	    var img = new Image();
                
                console.log('image loaded')

				// Set the img src property using the data URL.
	    	    img.src = reader.result;
    
                // upload image to S3
                uploadtoS3(img.src, function(e,r){
                    
                    console.log(r.url);
                
                    var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "profile" });
                    if(photo){
                        Meteor.call('profilePhotos.update',photo._id, r.url, "profile", (error,result) => {
                            if (error) {
                              console.log(error)
                              Bert.alert(error.reason, 'danger', 'fixed-top');
                            }
                            Bert.alert('Profile photo successfully updated', 'success', 'fixed-top');
                        });
                    }
                    else{
                        Meteor.call('profilePhotos.insert', r.url, "profile", (error,result) => {
                            if (error) {
                              console.log(error)
                              Bert.alert(error.reason, 'danger', 'fixed-top');
                            }
                            Bert.alert('Profile photo successfully created', 'success', 'fixed-top');
                        }); 
                    }

                    Session.set('imageSrc', r.url);
                   fileInput.value= null;
                    
                });
    
                //Session.set('imageSrc', img.src);
                //Bert.alert('Profile photo successfully updated', 'success', 'fixed-top');
                
                

            }
            
            reader.readAsDataURL(file);
            
        }
        
        
}

function setCoverPhoto(file, imageType, fileInput, fileDisplayArea){
    
    
    if (file.type.match(imageType)) {

        console.log('file type matches')

        var reader = new FileReader();

        Session.set('coverSrc', '/images/pictures/Preloader_7.gif');

        reader.onload = function(e) {
            // Create a new image.
            var img = new Image();

            console.log('image loaded')

            // Set the img src property using the data URL.
            img.src = reader.result;

            // upload image to S3
            uploadtoS3(img.src, function(e,r){

                console.log(r.url);

                var photo = ProfilePhotos.findOne({ authorId: Meteor.userId(), type: "cover" });
                if(photo){
                    Meteor.call('profilePhotos.update', photo._id, r.url, "cover" , (error,result) => {
                        if (error) {
                          console.log(error)
                          Bert.alert(error.reason, 'danger', 'fixed-top');
                        }
                        Bert.alert('Profile cover successfully updated', 'success', 'fixed-top');
                    });
                }
                else{
                    Meteor.call('profilePhotos.insert', r.url, "cover",  (error,result) => {
                        if (error) {
                          console.log(error)
                          Bert.alert(error.reason, 'danger', 'fixed-top');
                        }
                        Bert.alert('Profile cover successfully created', 'success', 'fixed-top');
                    }); 
                }

                Session.set('coverSrc', r.url);
                fileInput.value= null;

            });

            //Session.set('imageSrc', img.src);
            //Bert.alert('Profile photo successfully updated', 'success', 'fixed-top');



        }

        reader.readAsDataURL(file);

    }


}



