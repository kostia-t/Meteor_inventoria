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

Template.login.events({

    'submit #login-form' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#login-email').value
        , password = t.find('#login-password').value;
        

        // Trim and validate your fields here.... 
        email = trimInput(email);

        if (isValidPassword(password)) {
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
        else{
            console.log("bad password")
            
        }
         return false; 
      }
  });

// trim helper
  var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
  }
  
   var isValidPassword = function(val) {
     return val.length >= 6 ? true : false; 
  }