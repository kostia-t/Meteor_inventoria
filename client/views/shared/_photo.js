import Tokenfield from 'tokenfield';

var labelTokens = null;
var colorTokens  = null;

Template.photo.onCreated(function() {
	this.searchQuery = new ReactiveVar('');
	this.filter = new ReactiveVar('all');
	this.limit = new ReactiveVar(20);
	this.imageSrc = new ReactiveVar('');
	this.imageLabels = new ReactiveVar([{name:"test"}]);
	this.imageColors = new ReactiveVar([]);
	Session.set('imageLabels', [{name:""}]);
	Session.set('imageColors', [{name:""}]);
	Session.set('tags', []);
    Session.set('isEdit', false);
    Session.set('imageSrc', null);

	this.autorun(() => {
		  this.subscribe('boards.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
		  this.subscribe('resources.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
		  this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
		  this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
          this.subscribe('profilePhotos.all', this.searchQuery.get(), this.filter.get(), this.limit.get());

	});

});

Template.photo.onRendered(function() {


    //console.log($(".content").scrollTop())
    $("html").scrollTop(0);
    $("body").scrollTop(0);
    
    
	$.getScript('lib/tokenfield.js', function(){
	        // script should be loaded and do something with it.
					console.log("loaded")

	});
    
    $(".inventory-tags").hide();
    $(".inventory-colors").hide();
    
    
    //set colors tags
    colorTokens = new Tokenfield({
        el: document.querySelector('.inventory-colors')
    });
    
    //set labels tags
    labelTokens = new Tokenfield({
        el: document.querySelector('.inventory-tags')
    });
    
    $(".tokenfield").hide();
    
    
    // set session variables
    var item = Resources.findOne({ _id: FlowRouter.getParam('_id') });
    Session.set('tags', item.tags);
    
    
   console.log("this is a test can i see this........")
    

});

Template.photo.helpers({
        
    tags: function() {
        return Session.get('imageLabels');
    },

    colors: function() {
        return Session.get('imageColors');
    },

    item: function() {
        return Resources.findOne({ _id: FlowRouter.getParam('_id') });
    },
    
    isEdit: function () {
        return Session.get('isEdit');
    },
    
    isAuthor: function () {
        let item = Resources.findOne({ _id: FlowRouter.getParam('_id') });
        if(item.authorId == Meteor.userId()){
            return true;
        } else {
            return false;
        }
    },
    
    user: () => {
        let item = Resources.findOne({ _id: FlowRouter.getParam('_id') });
        
        if(item)
        return Meteor.users.findOne({ _id: item.authorId });
    },
    
    items: function() {
       return Resources.find({ tags: { $in: Session.get('tags') } });
    },
    imageSrc: () => {
             
      var profilePhoto = ProfilePhotos.find({});
      //console.log(profilePhoto.fetch())

      if(Session.get('imageSrc')){
          return Session.get('imageSrc');
      }  
      else{
          let item = Resources.findOne({ _id: FlowRouter.getParam('_id') });
          var photo = ProfilePhotos.findOne({ authorId: item.authorId });
          return photo.url;
       }	

    }
    


 });

Template.photo.events({
   
    "click .exitedit": function (event, template) {
        Session.set('isEdit', false);
        $(".tokenfield").hide();
        
    },
    
    "click .show-gallery": function (event, template) {
        
        console.log($(".content").scrollTop())
        console.log($("body").scrollTop())
        console.log($(".twelve").scrollTop())
        console.log($("#page-content").scrollTop())
        console.log($("html").scrollTop())
        $("body").scrollTop(0);
        $("html").scrollTop(0);
    },
    
    
    "click .edit": function (event, template) {
        
        Session.set('isEdit', true);
        
        //$(".inventory-tags").show();
        //$(".inventory-colors").show();
        
        $(".tokenfield").show();
        
        
        // get item
        var item = Resources.findOne({ _id: FlowRouter.getParam('_id') });
        
        // check if item user is the same as the current user
        
        // set tags to new array
        var colorsTokenArray = new Array(); //item.colors;
        var tagsTokenArray = new Array();   //item.tags;
        
        //console.log(document.querySelector('.inventory-tags'))
        //console.log($('.inventory-colors'))
        //console.log($('.inventory-tags'))
        //console.log($('.preload-image'))
        
        
        //$(".tokenfield").remove();
        
        
        for(var i = 0; i < item.colors.length; i++) {
            colorsTokenArray.push({id:i, name:item.colors[i]})
        }
        
        //set colors tags
        /*colorTokens = new Tokenfield({
            el: document.querySelector('.inventory-colors')
        });*/
        colorTokens.setItems(colorsTokenArray);
        
        
        for(var i = 0; i < item.tags.length; i++) {
            tagsTokenArray.push({id:i, name:item.tags[i]})
        }
        
        //set labels tags
        /*labelTokens = new Tokenfield({
            el: document.querySelector('.inventory-tags')
        });*/
        labelTokens.setItems(tagsTokenArray)
        
        
    },
    
    "click .remove": function (event, template) {
        
        console.log("remove button clicked...")
        
         // get item
        var item = Resources.findOne({ _id: FlowRouter.getParam('_id') });
        
        
        //http://s3-us-west-2.amazonaws.com/imagescanvasbucket/images/62affb84-727a-436d-8a9c-b685feb41ce5.jpeg
        
        let imgUrl = item.src;
        
        console.log(imgUrl)
        
        let urlArray = imgUrl.split( '/' );
        
        console.log(urlArray);
        
        var last = urlArray[urlArray.length - 1]
        
        console.log(last)
        
        let relativeUrl  = "/images/"+ last;
        
        console.log(relativeUrl)
        
        console.log(S3)
        
        // Sweet Alert delete confirmation
        swal({
          title: 'Delete Item?',
          text: 'Are you sure that you want to delete this Item?',
          type: 'error',
          showCancelButton: true,
          closeOnConfirm: true,
          cancelButtonText: 'No',
          confirmButtonText: 'Yes, delete it!',
          confirmButtonColor: '#da5347'
        }, function() {
          
            
            S3.delete(relativeUrl, function(err, response){

                removePosts ( last, function(err, response){

                   if (err){
                       console.log(err)
                   }
                   else {
                       Meteor.call('resources.remove', FlowRouter.getParam('_id'), (error, result) => {

                            if (error) {
                                console.log("error")
                                console.log(error)
                                Bert.alert(error.reason, 'danger', 'fixed-top');
                            }
                            else {
                                console.log("done")
                                Bert.alert('Post successfully removed', 'success', 'fixed-top');
                                //history.back();
                                history.go(-1);
                            }

                        }); 
                   }


               } );
            });
            
        });
        
        
    },
    
     "click .save": function (event, template) {
         
         var tags = new Array();
         var colors = new Array();
         
         $(".tokenfield-set").eq(0).find(".tokenfield-set-item").each(function( index ) {
             console.log($(this).find(".item-label").text());
             tags.push( $.trim ($( this ).find(".item-label").text()) );
         });
         
         
         $(".tokenfield-set").eq(1).find(".tokenfield-set-item").each(function( index ) {
            colors.push( $.trim ($( this ).find(".item-label").text()) );
            //	console.log(colors)
         });
         
         var item = Resources.findOne({ _id: FlowRouter.getParam('_id') });
         
         // Get related photo details
         var 	res = {
            title				: ""
            , description       : $('.inventory-description').val()	+ ""
            , location		    : $('.location').val()	+ ""
            , type	 			: "image"
            , collectionId		: item.collectionId
            , src				: item.src
            , tags				: tags
            , colors			: colors
            , quantity  		: item.quantity               //Number($('.quantity').val()	+ "")
            , size  			: $('.size').val()	+ ""
            , additionalDetails : item.additionalDetails      //$('.details').val() + ""
            , purchaseDate  	: item.purchaseDate           //new Date($('.purchaseDate').val())
            , price				: Number($('.price').val() + "")
         }
         
         // Update Resource
         Meteor.call('resources.update', item._id, res.title, res.description, res.location, res.type
					, res.collectionId, res.src, res.tags, res.colors, res.quantity
					, res.size, res.additionalDetails, res.purchaseDate, res.price, (error, result) => {

					if (error) {
						console.log("error")
						console.log(error)
					}
					else {
							console.log("done");
              Session.set('isEdit', false);
              $(".tokenfield").hide();
					}

         });
         
         
         
     }
    
    
});

function removePosts ( query, callback ){
    
     var postCursor = Posts.find({ body: {$regex : ".*"+query+".*"}  });
        console.log(postCursor.fetch());
        
        let postArray = postCursor.fetch();
        
        console.log(postArray);
        
        for (var i in postArray) {
            console.log(postArray[i]);
            let postItemId = postArray[i]._id;
             Meteor.call('posts.remove', postItemId, (error, result) => {

                if (error) {
                    console.log("error")
                    console.log(error)
                }
                else {
                    console.log("done")
                }

            }); 
            
        }
    
        callback (null,true);
    
    
    
}
