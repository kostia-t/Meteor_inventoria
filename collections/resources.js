Resources = new Mongo.Collection('resources');
Colors = new Mongo.Collection('colors');
Tags = new Mongo.Collection('tags');
ProfilePhotos = new Mongo.Collection('profilePhotos');

Meteor.methods({
  'resources.insert': ( title, description, location, type, collectionId, src, tags, colors, quantity, size, additionalDetails, purchaseDate, price, barcode) => {

  	/*
    console.log(title)
  	console.log(description)
  	console.log(location)
  	console.log(collectionId)
  	console.log(type)
  	console.log(src)
  	console.log(tags)
  	console.log(colors)
    console.log(quantity)
    console.log(additionalDetails)
    console.log(purchaseDate)
    console.log(size)
    console.log(price)
    */

  	check(title, String);
    check(description, String);
    check(location, String);
    check(collectionId, String);
    check(type, String);
    check(src, String);
    check(tags, Array);
    check(colors, Array);
    check(quantity, Number);
    check(additionalDetails, String);
    check(purchaseDate, Date);
    check(size, String);
    check(price, Number);
    check(barcode, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!type) {
        throw new Meteor.Error(422, 'type should not be blank');
      }
    if (!src) {
        throw new Meteor.Error(422, 'src should not be blank');
      }
    if (!description) {
        throw new Meteor.Error(422, 'Description should not be blank');
      }
      
    let tagsLower = [];
    let colorsLower = [];
    
    // tags lowercase
    for (var i = 0; i < tags.length; i++) {
        tagsLower.push(tags[i].toLowerCase());
    }
      
    // colors lowercase
     for (var i = 0; i < colors.length; i++) {
        colorsLower.push(colors[i].toLowerCase());
    }

    let resource = {
      description: description,
      descriptionLower: description.toLowerCase(),
      title: title,
      collectionId: collectionId,
      barcode:barcode,
      type: type,
      parentId: "",
      authorId: Meteor.userId(),
      ownerId: Meteor.userId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likecount: 0,
      already_voted: [],
      tags: tags,
      tagsLower:tagsLower,
      colors: colors,
      colorsLower: colorsLower,
      location: location,
      quantity: quantity,
      purchaseDate: purchaseDate,
      additionalDetails: additionalDetails,
      size: size,
      price: price,
      src:	src,
      isPrivate: false
    };



    return Resources.insert(resource);



  },
  'resources.remove': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }
    if (Meteor.userId() !== Resources.findOne({ _id: _id }).authorId) {
      throw new Meteor.Error(422, 'You can only remove your own resources');
    }

    Resources.remove({ _id: _id });
  },
  'resources.like': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }

    if (Resources.find( { _id: _id, already_voted: { $in: [Meteor.userId()]} }).count() === 0) {
      Resources.update( { _id: _id }, { $push: { already_voted: Meteor.userId() } });
      Resources.update({ _id: _id }, { $inc: {likecount: 1} });
    } else if (Resources.find( { _id: _id, already_voted: { $in: [Meteor.userId()]} }).count() === 1) {
      Resources.update( { _id: _id }, { $pull: { already_voted: Meteor.userId() } });
      Resources.update({ _id: _id }, { $inc: { likecount: -1} });
    }
  },
  'resources.update': ( resourceId, title, description, location, type, collectionId, src, tags, colors, quantity, size, additionalDetails, purchaseDate, price) => {
	    check(resourceId, String);
	    check(title, String);
        check(description, String);
        check(location, String);
        check(collectionId, String);
        check(type, String);
        check(src, String);
        check(tags, Array);
        check(colors, Array);
        check(quantity, Number);
        check(additionalDetails, String);
        check(purchaseDate, Date);
        check(size, String);
        check(price, Number);

	    // Verify that user is logged in
	    if (!Meteor.user()) {
	      throw new Meteor.Error(401, 'You need to be signed in to continue');
	    }

	    // Verify that resource exists
	    if (Resources.find({_id: resourceId}).count() === 0) {
	      throw new Meteor.Error(111, 'Not a valid resource');
	    }
      
        let tagsLower = [];
        let colorsLower = [];

        // tags lowercase
        for (var i = 0; i < tags.length; i++) {
            tagsLower.push(tags[i].toLowerCase());
        }

        // colors lowercase
         for (var i = 0; i < colors.length; i++) {
            colorsLower.push(colors[i].toLowerCase());
        }

	    // Update job by jobId
	    return Resources.update({_id: resourceId}, 
                                {$set: 
                                    {  
                                      description: description,
                                      descriptionLower: description.toLowerCase(),
                                      title: title,
                                      collectionId: collectionId,
                                      barcode:"",
                                      type: type,
                                      parentId: "",
                                      authorId: Meteor.userId(),
                                      ownerId: Meteor.userId(),
                                      //createdAt: new Date(),
                                      updatedAt: new Date(),
                                      likecount: 0,
                                      already_voted: [],
                                      tags: tags,
                                      tagsLower:tagsLower,
                                      colors: colors,
                                      colorsLower: colorsLower,
                                      location: location,
                                      quantity: quantity,
                                      purchaseDate: purchaseDate,
                                      additionalDetails: additionalDetails,
                                      size: size,
                                      price: price,
                                      src:	src
                                    }});
	  },
   'tags.insert':(tags) =>{
       
       check(tags, Array);
       
        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!tags) {
            throw new Meteor.Error(422, 'src should not be blank');
        }
       
       let tagsLower = [];
    
       // tags lowercase
       for (var i = 0; i < tags.length; i++) {
            tagsLower.push(tags[i].toLowerCase());
       }
       
       let usrTags = {
           tags : tags,
           tagsLower : tagsLower,
           authorId: Meteor.userId()
       }
       
       return Tags.insert(usrTags);
      
       
   },
   'tags.update':(_id, tags) =>{
       
       check(tags, Array);
       
        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!tags) {
            throw new Meteor.Error(422, 'tags should not be blank');
        }
       
       // Verify that resource exists
	    if (Tags.find({_id: _id}).count() === 0) {
	      throw new Meteor.Error(111, 'Not a valid tag');
	    }

       //console.log("id: "+ _id)
       //console.log("tags: "+ tags)
       
       // Set tag list
       let currentTags = Tags.findOne({_id: _id});
       let currentTagsList = currentTags.tags;
       let currentTagsLowerList = currentTags.tagsLower;
       
       // concat tags array
       var combinedTags = currentTagsList.concat(tags)
       
       // remove duplicates
       for(var i=0; i<combinedTags.length; ++i) {
        for(var j=i+1; j<combinedTags.length; ++j) {
            if(combinedTags[i] === combinedTags[j])
                combinedTags.splice(j--, 1);
        }
       }
       
       let tagsLower = [];
       
       // tags lowercase
       for (var i = 0; i < combinedTags.length; i++) {
            tagsLower.push(combinedTags[i].toLowerCase());
       }
       
       //console.log(_id)
       //console.log(combinedTags)
       //console.log(tagsLower)
       
       
       return Tags.update({_id: _id}, 
                                {$set: {  
                                      tags: combinedTags,
                                      tagsLower:tagsLower,
                                      authorId: Meteor.userId()
                                       }
                                });
       
       
   },
   'tags.remove':(_id) =>{
       
       check(_id, String);

        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!_id) {
            throw new Meteor.Error(422, '_id should not be blank');
        }
        if (Meteor.userId() !== Tags.findOne({ _id: _id }).authorId) {
            throw new Meteor.Error(422, 'You can only remove your own resources');
        }
       Tags.remove({ _id: _id });
   },
   'colors.insert':(colors) =>{
       
       check(colors, Array);
       
        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!colors) {
            throw new Meteor.Error(422, 'src should not be blank');
        }
       
       let colorsLower = [];
    
       // tags lowercase
       for (var i = 0; i < colors.length; i++) {
            colorsLower.push(colors[i].toLowerCase());
       }
       
       let usrColors = {
           colors : colors,
           colorsLower : colorsLower,
           authorId: Meteor.userId()
           
       }
       
       return Colors.insert(usrColors);
   },
   'colors.update':(_id, colors) =>{
       
        check(colors, Array);
       
        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!colors) {
            throw new Meteor.Error(422, 'tags should not be blank');
        }
       
       // Verify that resource exists
	    if (Colors.find({_id: _id}).count() === 0) {
	      throw new Meteor.Error(111, 'No valid colors');
	    }

       // Set tag list
       let currentColors = Colors.findOne({_id: _id});
       let currentColorsList = currentColors.colors;
       let currentColorsLowerList = currentColors.colorsLower;
       
       // concat tags array
       var combinedColors = currentColorsList.concat(colors)
       
       // remove duplicates
       for(var i=0; i<combinedColors.length; ++i) {
        for(var j=i+1; j<combinedColors.length; ++j) {
            if(combinedColors[i] === combinedColors[j])
                combinedColors.splice(j--, 1);
        }
       }
       
       let colorsLower = [];
       
       // tags lowercase
       for (var i = 0; i < combinedColors.length; i++) {
            colorsLower.push(combinedColors[i].toLowerCase());
       }
       
       return Colors.update({_id: _id}, 
                                {$set: {  
                                      tags: combinedColors,
                                      tagsLower:colorsLower,
                                      authorId: Meteor.userId()
                                       }
                                });
       
   },
   'colors.remove':(_id) =>{
       
       check(_id, String);

        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!_id) {
            throw new Meteor.Error(422, '_id should not be blank');
        }
        if (Meteor.userId() !== Colors.findOne({ _id: _id }).authorId) {
            throw new Meteor.Error(422, 'You can only remove your own resources');
        }
       Colors.remove({ _id: _id });
   },

   'profilePhotos.insert':(url,type) => {
       
       check(url, String);
       check(type, String);
       
       if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
       }
       if (!url) {
            throw new Meteor.Error(422, 'src should not be blank');
       }
       
       let profilePhotos = {
           url : url,
           type: type,
           authorId: Meteor.userId()
       }
       
       return ProfilePhotos.insert(profilePhotos);
       
   },
   'profilePhotos.update':(_id, url, type) => {
       
       check(url, String);
       check(type, String);
       
        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!url) {
            throw new Meteor.Error(422, 'url should not be blank');
        }
        if (!type) {
            throw new Meteor.Error(422, 'type should not be blank');
        }
        
        return ProfilePhotos.update({_id: _id}, 
                {$set: {  
                      url: url,
                      type: type,
                      authorId: Meteor.userId()
                       }
                });
       
   },
   'profilePhotos.remove':(_id) => {
       
       check(_id, String);

        if (!Meteor.user()) {
            throw new Meteor.Error(401, 'You need to be signed in to continue');
        }
        if (!_id) {
            throw new Meteor.Error(422, '_id should not be blank');
        }
        if (Meteor.userId() !== UserProfilePhotos.findOne({ _id: _id }).authorId) {
            throw new Meteor.Error(422, 'You can only remove your own resources');
        }
       ProfilePhotos.remove({ _id: _id });
   }

});
