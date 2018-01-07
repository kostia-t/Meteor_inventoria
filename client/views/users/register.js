 //Meteor.autorun(function() {

    // Whenever this session variable changes, run this function.
    
//  });

 Meteor.autorun(function() {
    // Whenever this session variable changes, run this function.
    var message = Session.get('displayMessage');
    if (message) {
      var stringArray = message.split('&amp;');
      /*ui.notify(stringArray[0], stringArray[1])
        .effect('slide')
        .closable();
        */
        
        Bert.alert(message, 'danger', 'fixed-top');

      Session.set('displayMessage', null);
    }
  }); 


Template.register.onCreated(function () {
    
this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
	this.limit = new ReactiveVar(20);
    
    this.autorun(() => {
         this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
        
        var message = Session.get('displayMessage');
    if (message) {
      var stringArray = message.split('&amp;');
      /*ui.notify(stringArray[0], stringArray[1])
        .effect('slide')
        .closable();*/
     Bert.alert(message, 'danger', 'fixed-top');

      Session.set('displayMessage', null);
    }
         
     });
});
    

    
     


Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email').value
        , password = t.find('#account-password').value
        , username = t.find('#account-username').value
        , confirm  = t.find('#account-confirm').value;

      // Trim and validate the input
      email = trimInput(email);
      username = trimInput(username);

      if (isValidPassword(password) && password === confirm && isValidEmail(email)) {
        
        // Then use the Meteor.createUser() function
        let options = {username: username, email: email, password : password, isPrivate: false}
          
        //console.log(options);

        Meteor.call('users.create', options, function(err){
            
            if(err){
                
                console.log(err);
                Session.set('displayMessage', err.reason);
                
            } else {
                
                // If validation passes, supply the appropriate fields to the
                // Meteor.loginWithPassword() function.
                Meteor.loginWithPassword(email, password, function(err){
                if (err){
                    console.log(err);
                    Session.set('displayMessage', err.reason);
                }
                  // The user might not have been found, or their passwword
                  // could be incorrect. Inform the user that their
                  // login attempt has failed. 
                else{
                    console.log("logged in")
                    window.location.href = '/feed';
                }
                  // The user has been logged in.
                });
                
            }
            
        });
        
        
    }
    else if(!(isValidPassword(password))) {
        console.log("Not a valid password");
        //Session.set('displayMessage', "bad password");

    }
    else if(!(isValidEmail(email))) {
        console.log("Not a valid email address");
        Session.set('displayMessage', "Not a valid email address");

    }
    else if(!(password === confirm)){
        console.log("Mismatched passwords");
        Session.set('displayMessage', "Passwords don't match");
        
    }
      
    else{
        console.log("Generic Error");
        Session.set('displayMessage', "Generic Error");
        
    }
         
      return false;
    }
  });


// trim helper
  var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
  }
  
  var isValidPassword = function(val) {
    
    var errors = [];
      
    if (val.length < 8) {
        errors.push("Your password must be at least 8 characters"); 
    }
    if (val.search(/[a-z]/i) < 0) {
        errors.push("Your password must contain at least one letter.");
    }
    if (val.search(/[0-9]/) < 0) {
        errors.push("Your password must contain at least one digit."); 
    }
    if (errors.length > 0) {
        console.log(errors.join("\n"));
        Session.set('displayMessage', errors.join("\n"));
        return false;
    }   
    
    return true;
  }
  
  var isValidEmail = function(val){
      
    var atpos = val.indexOf("@");
    var dotpos = val.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=val.length) {
        //console.log("Not a valid e-mail address");
        //Session.set('displayMessage', "Not a valid email address");
        return false;
    }
    
    return true;
      
  }
   
