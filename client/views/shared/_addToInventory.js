import clarifai from 'clarifai';
import Tokenfield from 'tokenfield';

var imageLabels = new Meteor.Collection("null");
var labelTokens = null;
var colorTokens  = null;
var $cropperImage = null;
var URL = window.URL || window.webkitURL;
var uploadedImageURL;

var app = new Clarifai.App(
        'p43cn9iV1tcUAzDNiAz3Z7xf-Ius28FVmDgujipd',
        'z0cblsfAK6AxCIx--lEzXPD4_jWpObRszgMVaWwa'
        );

// this is equivalent to the standard node require:
//const clarifai = require('clarifai');

Template.addToInventory.onCreated(function() {
	this.searchQuery = new ReactiveVar('');
	this.filter = new ReactiveVar('all');
	this.limit = new ReactiveVar(20);
	this.imageSrc = new ReactiveVar('');
	this.imageLabels = new ReactiveVar([{name:"test"}]);
	this.imageColors = new ReactiveVar([]);
	Session.set('imageLabels', [{name:""}]);
	Session.set('imageColors', [{name:""}]);
	Session.set('tags', []);
    Session.set('barcode','');
    Session.set('photo', null);


	this.autorun(() => {
		  this.subscribe('boards.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
		  this.subscribe('resources.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
		  this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
		  this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
        
        this.subscribe('tags.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
        this.subscribe('colors.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
	});



});

Template.addToInventory.onRendered(function() {


	$.getScript('lib/tokenfield.js', function(){
	        // script should be loaded and do something with it.
					console.log("loaded")

	});

	//var tf = new Tokenfield({
  //el: document.querySelector('.inventory-tags')
	//});
    
    
 initCropper();

 if(!(Meteor.isCordova)){
    $(".barcode-wrapper").css({
        "display": "none" 
    });
    
    $(".photo-wrapper").css({
        "width": "100%" 
    });
 }
    

});

Template.addToInventory.helpers({
    tags: function() {
        return Session.get('imageLabels');
    },

    colors: function() {
        return Session.get('imageColors');
    },
    
    photo: function () {
      return Session.get("photo");
    },
    
    barcode: function(){
        return Session.get('barcode');
    },

    items: function() {
        return Resources.find({ tags: { $in: Session.get('tags') } })
    }
    


 });

Template.addToInventory.events({

	"click .select-new-item-photo": function (event, template) {
        
        console.log("clicked")
		var fileInput = document.getElementById('fileInput');
	    var fileDisplayArea = document.getElementById('fileDisplayArea');

        if(Meteor.isCordova){
            
            var options = {
               quality : 50,
               destinationType : Camera.DestinationType.DATA_URL,
               sourceType : Camera.PictureSourceType.CAMERA,
               allowEdit : false, //To enable/disable the user editing in camera
               encodingType: Camera.EncodingType.JPEG,
               correctOrientation: true,
               //targetWidth: 640,
               //targetHeight: 480,
               //popoverOptions: CameraPopoverOptions,
               saveToPhotoAlbum: false
            };
            
            navigator.camera.getPicture(onSuccess, onFail, options);

            function onSuccess(imageURI) {
                var image = new Image();
                image.src = 'data:image/jpeg;base64,' + imageURI;
                
                //alert(image.src);
                
                var fileDisplayArea = document.getElementById('fileDisplayArea');
                //fileDisplayArea.innerHTML = "";
                
                //fileDisplayArea.appendChild(image);
                
                Session.set("photo", 'data:image/jpeg;base64,' + imageURI);
                
                
                var imgList = image.src.split(",");

                getTags(app, imgList);

                getColors(app, imgList);
                
                // Set Reactive Variable to image src
                template.imageSrc.set(image.src);
            }

            function onFail(message) {
                console.log('Failed because: ' + message);
                Bert.alert(message, 'danger', 'fixed-top');
            }
            
        } else {
            
            // Trigger file click
            $('#fileInput').trigger("click");

            // html
            fileInput.addEventListener('change', function(e) {
                // Put the rest of the demo code here.
                var file = fileInput.files[0];
                var imageType = /image.*/;
                var options = {
                  aspectRatio: 4 / 3,
                  crop: function(e) {
                  },
                  ready: function () {

                      console.log("ready")
                  }
                }

                // Get File
                getImageHTML(file, imageType, options, fileInput, fileDisplayArea, template);


            });
            
        }
        
	    


	},


    "click .select-new-item-barcode" : function (event, template) {
        
        if(Meteor.isCordova){
            
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    console.log("We got a barcode\n" +
                      "Result: " + result.text + "\n" +
                      "Format: " + result.format + "\n" +
                      "Cancelled: " + result.cancelled);
                      Session.set('barcode', result.text );
                    
                    if(!result.cancelled){
                         Session.set('barcode',result.text);
                    }
                }, 
                function (error) {
                    console.log("Scanning failed: " + error);
                    Bert.alert("Scanning failed: " + error, 'danger', 'fixed-top');
                },
                  {
                      preferFrontCamera : true, // iOS and Android
                      showFlipCameraButton : true, // iOS and Android
                      showTorchButton : true, // iOS and Android
                      torchOn: true, // Android, launch with the torch switched on (if available)
                      saveHistory: true, // Android, save scan history (default false)
                      prompt : "Place a barcode inside the scan area", // Android
                      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                      //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                      //orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                      disableAnimations : true, // iOS
                      disableSuccessBeep: false // iOS
                  }
            );
           
        } else {
            console.log("disabled...");
            console.log(Meteor)
        }
    },
    
    
	"click .upload-item-resource" : function (event, template) {


		console.log("clicked");

		// Upload to S3
		uploadtoS3(Template.instance().imageSrc.get());

        //history.go(-1);

	},
    
    
	"click .getCropped" : function (event, template) {


		console.log("clicked");
        
        var fileDisplayArea = document.getElementById('fileDisplayArea');
        fileDisplayArea.innerHTML = "";
        
        // Create a new image.
        var img = new Image();

        console.log($cropperImage.cropper('getCroppedCanvas'))
        
        // Set the img src property using the data URL.
	    img.src = $cropperImage.cropper('getCroppedCanvas').toDataURL('image/jpeg');
        
        fileDisplayArea.appendChild(img);
        
        // Set image to template
        template.imageSrc.set($cropperImage.cropper('getCroppedCanvas').toDataURL('image/jpeg'));

        hideEditor();
        
        //$cropperImage.cropper("reset", true).cropper("replace", reader.result);
        
		// Upload to S3
		//uploadtoS3(Template.instance().imageSrc.get());


	}
    


});



function uploadtoS3(imageSrc){

	var tags = new Array();
	var colors = new Array();

  /*
	$(".tags").each(function( index ) {
		tags.push( $.trim ($( this ).text()) );
	});
	*/

	//console.log($(".tokenfield-set").eq(1))
	//console.log($(".tokenfield-set").eq(0))

	$(".tokenfield-set").eq(1).find(".tokenfield-set-item").each(function( index ) {
		//console.log($(this).find(".item-label").text());
		tags.push( $.trim ($( this ).find(".item-label").text()) );
//		console.log(tags)

	});

	/*
	$(".colors").each(function( index ) {
  	colors.push( $.trim ($( this ).text()) );
	});
	*/

	$(".tokenfield-set").eq(0).find(".tokenfield-set-item").each(function( index ) {
		colors.push( $.trim ($( this ).find(".item-label").text()) );
//		console.log(colors)
	});


	// Get related photo details
	var 	res = {
          title	            : ""
		, description	     : $('.inventory-description').val()	+ ""
		, location           : $('.location').val()	+ ""
		, type               : "image"
		, collectionId       : ""
		, src			     : ""
		, tags			     : tags
		, colors		     : colors
		, quantity  	     : Number($('.quantity').val()	+ "")
		, size  		     : $('.size').val()	+ ""
		, additionalDetails  : $('.details').val() + ""
		, purchaseDate  	 : new Date($('.purchaseDate').val())
		, price				 : Number($('.price').val() + "")
        , barcode            : Session.get('barcode')


	}

	//console.log(res)

	var fileList = [];
	var imageDataUrl = imageSrc;
    
    //console.log(imageSrc);
    
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
			} else{
				console.log(r.url);
				res.src = r.url;

				console.log(res)
				// Insert resource
				// insertResources(res);
                
                // Get colors
                if(res.colors && res.colors.length !== 0){
                    var colorList = Colors.findOne({ authorId: Meteor.userId() });
                    if(colorList){
                        Meteor.call('colors.update',colorList._id, res.colors, (error,result) => {
                            if (error) {
						      console.log(error)
				            }
                        });
                    }
                    else{
                        Meteor.call('colors.insert', res.colors, (error,result) => {
                            if (error) {
						      console.log(error)
				            }
                        }); 
                    }
                }
                
                // Get Tags
                if(res.tags && res.tags.length !== 0){
                    // Get tags
                    var tagList = Tags.findOne({ authorId: Meteor.userId() });
                    if(tagList){
                        console.log("TEST!!!!")
                        //console.log(tagList)
                        //console.log(tagList._id)
                        //console.log(res.tags)
                        Meteor.call('tags.update',tagList._id, res.tags, (error,result) => {
                            if (error) {
						      console.log(error)
				            }
                        });
                    }
                    else{
                        
                        Meteor.call('tags.insert', res.tags, (error,result) => {
                             if (error) {
						      console.log(error)
				            }
                        });
                    }
                }
                

				Meteor.call('resources.insert', res.title, res.description, res.location, res.type
					, res.collectionId, res.src, res.tags, res.colors, res.quantity
					, res.size, res.additionalDetails, res.purchaseDate, res.price, res.barcode, (error, result) => {

					if (error) {
						console.log("error")
						console.log(error)
					}
					else {
                        console.log("done")
					
                    // If a user is mentioned in the post add span with class to highlight their username
                        let body =$('.inventory-description').val();
                          if(body.indexOf('@') !== -1) {
                            for(let x = 0; x < body.length; x++) {
                              if(body[x] === '@') {
                                let u = body.slice(x + 1, body.indexOf(' ', x));
                                let mentionedUser = Meteor.users.findOne({username: u});

                                // If a valid user
                                if(mentionedUser) {
                                  // Add opening and closing span tags
                                  body = body.slice(0, x) + '<a href="/users/' + mentionedUser._id + '">' + body.slice(x, body.indexOf(' ', x)) + '</a>' +
                                         body.slice(body.indexOf(' ', x));

                                  // Increment by number of characters in openeing span tag
                                  // so the same mention doesn't get evaluated multiple times
                                  x+= 16;
                                }
                              }
                            }
                          }
                    
                        //console.log(result);
                    
                        let imageBody =
                        '<a style="width:100%;" href="/item/'+ result +'"><img class="preload-image responsive-image custom-post-image" style="display: block; padding: 0em;" data-original='+'"'+r.url+'"'+' alt="img" src='+'"'+r.url+'"'+'></a>'

                        body =  imageBody + body;

                        Meteor.call('posts.insert', body, (error, result) => {
                            if (error) {
                              Bert.alert(error.reason, 'danger', 'fixed-top');
                            } else {
                              Bert.alert('Post successfully submitted', 'success', 'fixed-top');
                              //template.find('[data-id=body]').value = '';
                              //$('[data-id=body]').css('height', '39px');
                              //$('input[type=submit]').addClass('disabled');
                            }
                          });

                        // Go back
                        setTimeout(function(){ history.go(-1); }, 1000);
                        
                    
                    }

				});
                
                // insert posts
                
                
                
                
                
                
                
                

			}


	 });




}

// Insert resource image
function insertResources(res){

	// Meteor Insert functions

	Meteor.call('resources.insert', res.title, res.description, res.location, res.type, res.collectionId, res.src, res.tags, res.colors, (error, result) => {

		// Check error
		if (error) {
	          Bert.alert(error.reason, 'danger', 'fixed-top');
	    } else {

        }

	});

}



//Image processing functions
function dataURItoBlob2(dataURI) {
	var binary = atob(dataURI.split(',')[1]);
	var array = [];
	for(var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

// Image resize function
function photoResize(callback){

	$('.intro__image').each(function(){
		//get img dimensions
		var h = $(this).height();
		var w = $(this).width();

		//get div dimensions
		var div_h =$(this).parent().height();
		var div_w =$(this).parent().width();

		//set img position
		this.style.top = Math.round((div_h - h) / 2) + 'px';
		this.style.left = Math.round((div_w - w) / 2) + 'px';
		//this.style.left = '50%';
		//this.style.marginLeft = Math.round(w/2) + 'px';



	});

	if(callback){callback()};
}


function showEditor(){
    $("#image-editor").css({
        "visibility": "visible",
        "z-index":"2"
    });
    $("#image-editor").show();
    //$("#inventory-footer").hide();
    //$("#inventory-form").hide();
}

function hideEditor(){
    $("#image-editor").hide();
    $("#image-editor").css({
        "visibility": "invisible",
        "z-index":"0"
    });
    //$("#inventory-footer").show();
    //$("#inventory-form").show();
}

function initCropper(){
    
    
    
     $cropperImage = $('#image');

	//initCropper();
     $cropperImage.cropper({
      aspectRatio: 4 / 3,
      crop: function(e) {
        // Output the result data for cropping image.
        //console.log(e.x);
        //console.log(e.y);
        //console.log(e.width);
        //console.log(e.height);
        //console.log(e.rotate);
        //console.log(e.scaleX);
        //console.log(e.scaleY);
          
        
      },
      ready: function () {
            
          console.log("ready")
      }
    }); 
    
    
   
    
     $('.reset').click(function() {
        console.log("reset")
         
        console.log($('#image'))
        $cropperImage.cropper('reset');
    });
    
    $('.zoomOut').click(function() {
        $cropperImage.cropper('zoom', -0.1);
    });
    
    $('.zoomIn').click(function() {
        $cropperImage.cropper('zoom', 0.1);
    });
    
    $('[data-method="moveLeft"]').click(function() {
        $cropperImage.cropper("move", -10, 0)
    });
    
    $('[data-method="moveRight"]').click(function() {
        $cropperImage.cropper("move", 10, 0)
    });
    
    $('[data-method="rotateLeft"]').click(function() {
        $cropperImage.cropper("rotate", -45)
    });
    
    $('[data-method="rotateRight"]').click(function() {
        $cropperImage.cropper("rotate", 45)
    });
    
    $('[data-method="setDragModeMove"]').click(function() {
        $cropperImage.cropper("setDragMode", "move")
    });
  
    $('[data-method="setDragModeCrop"]').click(function() {
        $cropperImage.cropper("setDragMode", "crop")
    });
    
    
    
}

function getImageHTML(file, imageType, options, fileInput, fileDisplayArea, template){


    if (file.type.match(imageType)) {
      var reader = new FileReader();

      reader.onload = function(e) {
        fileDisplayArea.innerHTML = "";

        // Create a new image.
        var img = new Image();

                // Set the img src property using the data URL.
        img.src = reader.result;

        //alert(reader.result)


        // Display image editor
        //showEditor();



        processImage(file, function(data) {

          img.metadata = {
            date: Date.now(),
            ownerId: Meteor.userId()
          };

          console.log("image orientation updated.....")

        });

        image.src = uploadedImageURL = URL.createObjectURL(file);
        //$cropperImage.cropper("destroy");
        //$cropperImage = $('#image');
        //$cropperImage.attr("src", image.src)

        //$cropperImage.cropper(options); 
        fileInput.value = null;  
        $cropperImage.cropper("reset", true).cropper("replace",  image.src)
        var myFunction = function(){
            // your function stuff in here.
            $cropperImage.cropper("moveTo", 0);
        };
        setTimeout(myFunction, 1000);

        // Add the image to the page.
        fileDisplayArea.appendChild(img);

        // Add clarifai call
        /*var app = new Clarifai.App(
        'p43cn9iV1tcUAzDNiAz3Z7xf-Ius28FVmDgujipd',
        'z0cblsfAK6AxCIx--lEzXPD4_jWpObRszgMVaWwa'
        );*/


        console.log("clarifai service call");
        //console.log(img.src);
        var imgList = img.src.split(",");

        //var testfile =  'http://s3-us-west-2.amazonaws.com/imagescanvasbucket/images/0561e36a-f398-4829-8875-e90a9bc05a5b.jpeg';



        getTags(app, imgList);

        getColors(app, imgList);


        // Set Reactive Variable to image src
        template.imageSrc.set(img.src);
        //Template.imageSrc.set(img.src)
      }


      reader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }

}

function getTags(app, imgList){
    
    
    Bert.alert('Retrieving tags', 'danger', 'fixed-top');
    
    // General Model
    app.models.predict("aaa03c23b3724a16a56b629203edc62c", {base64:imgList[1]}).then(
    function(response) {

        var itemTypeList = response.outputs[0].data.concepts;
        var isFashion = false;

        itemTypeList.forEach(function(concept){
            if(concept.name.toLowerCase() == "fashion"){
                isFashion = true;
            }
        });

        if(isFashion){

            // Get labels
            app.models.predict("e0be3b9d6a454f0493ac3a30784001ff", {base64:imgList[1]}).then(
            function(response) {

                // do something with response
                //console.log(response.outputs[0].data.concepts)

                var labelsArray  = response.outputs[0].data.concepts;
                var updatedArray = new Array();
                var tagsArray = new Array();
                var tagsTokenArray = new Array();
                var tagsUnusedTokenArray = new Array();
                var count = 0;


                labelsArray.forEach(function(value){
                    tagsUnusedTokenArray.push({id:count, name:value.name})
                    if(value.value > 0.50){
                        count++;
                        updatedArray.push(value)
                        tagsArray.push(value.name)
                        tagsTokenArray.push({id:count, name:value.name})
                    }
                });

                //Session.set('imageLabels', updatedArray);
                Session.set('tags', tagsArray);

                //console.log(tagsTokenArray)

                // Update tokens for the tags
                labelTokens = new Tokenfield({
                    el: document.querySelector('.inventory-tags'),
                    items: tagsUnusedTokenArray
                });

                labelTokens.setItems(tagsTokenArray)

            },
            function(err) {
              // there was an error
                    console.log(err)
            });

        } else {

            var labelsArray  = response.outputs[0].data.concepts;
            var updatedArray = new Array();
            var tagsArray = new Array();
            var tagsTokenArray = new Array();
            var tagsUnusedTokenArray = new Array();
            var count = 0;


            labelsArray.forEach(function(value){
                tagsUnusedTokenArray.push({id:count, name:value.name})
                if(value.value > 0.50){
                    count++;
                    updatedArray.push(value)
                    tagsArray.push(value.name)
                    tagsTokenArray.push({id:count, name:value.name})
                }
            });

            //Session.set('imageLabels', updatedArray);
            Session.set('tags', tagsArray);

            //console.log(tagsTokenArray)

            // Update tokens for the tags
            labelTokens = new Tokenfield({
                el: document.querySelector('.inventory-tags'),
                items: tagsUnusedTokenArray
            });

            labelTokens.setItems(tagsTokenArray)

        }

    });
}

function getColors(app, imgList){
    
    // Get Colors
    app.models.predict("eeed0b6733a644cea07cf4c60f87ebb7", {base64:imgList[1]}).then(
    function(response) {
      // display colors from response on page

            var colorsArray  = response.outputs[0].data.colors;
            var updatedArray = new Array();
            var colorsTokenArray = new Array();
            var count = 0;

            //console.log(colorsArray);

            colorsArray.forEach(function(value){
                    count++;
                    updatedArray.push(value)
                    console.log(value.w3c.name)
                    colorsTokenArray.push({id:count, name:value.w3c.name})
            });

            //console.log(updatedArray);
            //Session.set('imageColors', updatedArray);

            colorTokens = new Tokenfield({
                el: document.querySelector('.inventory-colors')
            });
            colorTokens.setItems(colorsTokenArray);


            /* Change colors based on token fields
            $(".tokenfield-set").eq(0).find(".tokenfield-set-item").each(function( index ) {
                $(this).css('background',$.trim ($( this ).find(".item-label").text()))
                $(this).css('border-radius', '4px')
            });
            */


    },
    function(err) {
      // there was an error
            console.log(err)
    }
  );
    
}