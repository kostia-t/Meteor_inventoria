Template.search.onCreated(function() {

    this.searchQuery = new ReactiveVar('');
    this.filter = new ReactiveVar('all');
    this.limit = new ReactiveVar(20);
    this.imageSrc = new ReactiveVar('');
    this.imageLabels = new ReactiveVar([{name: "test"}]);
    this.imageColors = new ReactiveVar([]);
    Session.set('isMenuHidden', false);
    Session.set('imageLabels', [{name: ""}]);
    Session.set('imageColors', [{name: ""}]);
    Session.set('tags', []);
    Session.set('sizes', []);
    Session.set('colors', []);
    Session.set('searchQuery','')
    Session.set('priceUpperBound',0)
    Session.set('priceLowerBound',0)


    this.autorun(() => {
      this.subscribe('boards.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
      this.subscribe('resources.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
      this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
      this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
      this.subscribe('tags.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
      this.subscribe('colors.all', this.searchQuery.get(), this.filter.get(), this.limit.get());

    });

});
Template.search.onRendered(function() {

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


});

Template.search.helpers({

  colors: function() {

    //return ["Blue","Green"]
      
    console.log(Colors.findOne({ authorId: Meteor.userId() }).colors);
      
    return Colors.findOne({ authorId: Meteor.userId() }).colors;

  },

  tags: function() {
      
    return Tags.findOne({ authorId: Meteor.userId() }).tags;

  },
    
  allItems: function(){
    
    var itemsCursor =   Resources.find({},{ sort: { size: 1 } }); 
    var itemsArray = itemsCursor.fetch();
      
      console.log(itemsArray);
    
      
    // remove duplicates
    
       for(var i=0; i<itemsArray.length; ++i) {
        for(var j=i+1; j<itemsArray.length; ++j) {
            if(itemsArray[i].size === itemsArray[j].size)
                itemsArray.splice(j--, 1);
        }
       }
      
      console.log(itemsArray)
    
    var sizesArray = []
    for(var i=0; i<itemsArray.length; ++i) {
        sizesArray.push(itemsArray[i].size);
    }
      
    
      
    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;
    function sortAlphaNum(a,b) {
        var AInt = parseInt(a, 10);
        var BInt = parseInt(b, 10);

        if(isNaN(AInt) && isNaN(BInt)){
            var aA = a.replace(reA, "");
            var bA = b.replace(reA, "");
            if(aA === bA) {
                var aN = parseInt(a.replace(reN, ""), 10);
                var bN = parseInt(b.replace(reN, ""), 10);
                return aN === bN ? 0 : aN > bN ? 1 : -1;
            } else {
                return aA > bA ? 1 : -1;
            }
        }else if(isNaN(AInt)){//A is not an Int
            return 1;//to make alphanumeric sort first return -1 here
        }else if(isNaN(BInt)){//B is not an Int
            return -1;//to make alphanumeric sort first return 1 here
        }else{
            return AInt > BInt ? 1 : -1;
        }
    }
      
    var sortedSizeList = sizesArray.sort(sortAlphaNum)
    
    console.log(sortedSizeList);
      
      
    return sortedSizeList;
      
  },

  items: function() {

    var query = Session.get("searchQuery")
    var price = 0
    var priceUpperBound = Session.get('priceUpperBound')
    var priceLowerBound = Session.get('priceLowerBound')
    
    if(query.length > 0 && priceUpperBound == 0){
      
        // w sizes w/o colors
        if(Session.get('sizes').length > 0 && Session.get('colors').length <= 0 ){
            
            return Resources.find({"$and":
                    [
                      { $or : [
                          { tagsLower: {$regex : ".*"+query.toLowerCase()+".*"}},
                          { descriptionLower: {$regex : ".*"+query.toLowerCase()+".*"}}
                      ]},
                      { size: { $in: Session.get('sizes') } }
                    ]
                  });
            
        }
        // w/o sizes w colors
        else if( Session.get('colors').length > 0 && Session.get('sizes').length <= 0){
            
            return Resources.find({"$and":
                    [
                      { $or : [
                          { tagsLower: {$regex : ".*"+query.toLowerCase()+".*"}},
                          { descriptionLower: {$regex : ".*"+query.toLowerCase()+".*"}}
                      ]},
                      { colors: { $in: Session.get('colors') } }
                    ]
                  });
                  
        } 
        // w sizes w colors
        else if(Session.get('sizes').length > 0  && Session.get('colors').length > 0){
          return Resources.find({"$and":
            [
              { $or : [
                  { tagsLower: {$regex : ".*"+query.toLowerCase()+".*"}},
                  { descriptionLower: {$regex : ".*"+query.toLowerCase()+".*"}}
              ]},
              { colors: { $in: Session.get('colors') } },
              { size: { $in: Session.get('sizes') } }
            ]
          });
        } 
        // else
        else {
            
            return Resources.find({"$or":
                    [
                      { tagsLower: {$regex : ".*"+query.toLowerCase()+".*"} },
                      { descriptionLower: {$regex : ".*"+query.toLowerCase()+".*"}  }
                    ]
                  })
            
        }
      
        
        
    }
    else if(priceUpperBound != 0){
        //console.log(priceUpperBound)
      /*return Resources.find({ price : { $lt : priceUpperBound}} ,{"$or":
        [
          { $or : [
              { tagsLower: {$regex : ".*"+query.toLowerCase()+".*"}},
              { descriptionLower: {$regex : ".*"+query.toLowerCase()+".*"}}
          ]}
        ]
      })*/
        
      var itemsCursor =   Resources.find({"$or":
        [
          { tagsLower: {$regex : ".*"+query.toLowerCase()+".*"} },
          { descriptionLower: {$regex : ".*"+query.toLowerCase()+".*"}  }
        ]
      },{ sort: { description: 1 } }); 
        
      var itemsArray = itemsCursor.fetch();
      var displayItemsArray = [];
        
      for(var i=0; i<itemsArray.length; ++i) {
        
            console.log(itemsArray[i].price )
            console.log(priceUpperBound)
          
            if(parseInt(itemsArray[i].price) > parseInt(priceUpperBound)){
                itemsArray.splice(i, 1);
                console.log("greater")

            }else if(parseInt(itemsArray[i].price) < parseInt(priceLowerBound)){
                itemsArray.splice(i, 1);
                console.log("less")
            } else {
                displayItemsArray.push(itemsArray[i]);
                console.log("within bounds")
            }
            
        
       }
        
      //return Resources.find({ price : { "$lt" : priceUpperBound}} )
        
        return displayItemsArray;
        
        
    }
    else {
        
      return Resources.find({"$or":[
          
          { size: { $in: Session.get('sizes') } },
          { colors: { $in: Session.get('colors') } }
          
      ]})
        
    }

  }



});

Template.search.events({

  
    "click .selectedPrice": function (event, template) {
      
      
      //let priceUpperBound = Session.get('priceUpperBound')
      //let priceLowerBound = Session.get('priceLowerBound')  
      let $priceTag = $(event.target);
      let priceUpper = $priceTag.attr("data-upper");
      let priceLower = $priceTag.attr("data-lower");    
        
      
    
      //console.log(priceUpper)
      //console.log(priceLower)
      
      if($priceTag.hasClass("selected-price-item")){
          $priceTag.removeClass("selected-price-item");
      } else {
          $priceTag.addClass("selected-price-item");
      }
        
      // set upper bound to 0
      Session.set('priceUpperBound',0)   
      Session.set('priceLowerBound',0)      
    
     $( ".selected-price-item" ).each(function() {
        let givenUpper = $( this ).attr( "data-upper" );
        let givenLower = $( this ).attr( "data-lower" );
         
        let priceUpperBound = Session.get('priceUpperBound');
        let priceLowerBound = Session.get('priceLowerBound');
         
        if(parseInt(givenUpper) >= parseInt(priceUpperBound)){
          Session.set('priceUpperBound',givenUpper)
        } 
    
        if(parseInt(givenLower) <= parseInt(priceLowerBound)){
            Session.set('priceLowerBound',givenLower)
        } 
            
        
        
     });
        
    
     console.log("Upper Bound: "+Session.get('priceUpperBound'))
     //console.log(Session.get('priceLowerBound'))
        
        
     /* if(priceUpper >= priceUpperBound){
          Session.set('priceUpperBound',priceUpper)
      } else{
          priceUpper = priceUpperBound
      }
    
      if(priceLower <= priceLowerBound){
          Session.set('priceLowerBound',priceLower)   
      } else{
          priceLower = priceLowerBound
      } */
     
      
  },
    "click .selectedsizes": function (event, template) {
      
      let currentSizeList = Session.get('sizes');
      let $sizeTag = $(event.target);
      
      let needle = $sizeTag.attr("data-size");
      
      
      if(contains.call(currentSizeList, needle)){
          // remove from list and undo highlight
          let index = currentSizeList.indexOf("" + needle + "");
          currentSizeList.splice(index, 1);
          $sizeTag.removeClass("selected-search-item");
          
      } else {
          // add to list and highlight
          currentSizeList.push(needle)
          $sizeTag.addClass("selected-search-item");
      }
      
      Session.set('sizes', currentSizeList);
      
  },
    
  "click .selectedcolors": function (event, template) {

          let currentSizeList = Session.get('colors');
          let $sizeTag = $(event.target);

          let needle = $sizeTag.attr("data-color");


          if(contains.call(currentSizeList, needle)){
              // remove from list and undo highlight
              let index = currentSizeList.indexOf("" + needle + "");
              currentSizeList.splice(index, 1);
              $sizeTag.removeClass("selected-search-item");

          } else {
              // add to list and highlight
              currentSizeList.push(needle)
              $sizeTag.addClass("selected-search-item");
          }

          Session.set('colors', currentSizeList);

   },
    
   "click .selectedtags": function (event, template) {

          let currentSizeList = Session.get('tags');
          let $sizeTag = $(event.target);
          let needle = $sizeTag.attr("data-tags");
          let currentVal = template.find('[data-id=search-query]').value; 
    
       
          if (currentVal.length > 0){
             currentVal = currentVal + " " + needle;
          } 
          else{
            currentVal = needle;
          }
            
          template.find('[data-id=search-query]').value = currentVal;
       
          $('#search-query').keyup();

   },
    
  // Toggle search menu
  "click .category-hide-menu": function (event, template) {

    if(Session.get('isMenuHidden') == true){
      $("#search-category-menu").show()
      Session.set('isMenuHidden',false)
    } else {
      $("#search-category-menu").hide()
      Session.set('isMenuHidden',true)
    }

  },

  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    Session.set('searchQuery',template.find('[data-id=search-query]').value)
    template.searchQuery.set(template.find('[data-id=search-query]').value);
    template.limit.set(20);
  }, 300)


});

    
// Utility functions    
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};    