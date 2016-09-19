 





if (Meteor.isClient) {
    // Meteor.subscribe('local-items');
    // Meteor.subscribe('local-leds');

	
	Deps.autorun(function(c) {
    try {
      UserStatus.startMonitor({
        threshold: 30000,
        idleOnBlur: true
      });
      return c.stop();
    } catch (undefined) {}
  });
}











// if (Meteor.isClient) {

var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(MENU_KEY, false);
      // $("#wrapper").toggleClass("toggled");
    },
    wipeRight: function () {
      Session.set(MENU_KEY, true);
      // $("#wrapper").toggleClass("toggled");
    },
    preventDefaultEvents: false
  });

  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(function () {
    // Launch screen handle created in lib/router.js
    dataReadyHold.release();

    // Show the connection error box
    Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
  }, CONNECTION_ISSUE_TIMEOUT);

  //Hook for benjaminrh:event-hooks 
    // Hooks.init();
    // Hooks.treatCloseAsLogout = true;
    // updateFocus: 4000; 
    // Hooks.onLoggedOut = function () {
    // Meteor.logout();
    // }
    
});

//REGISTER BACK BUTTON DEVICE SENSOR BUTTON EVENT === TESTED AND WORK VERY GOOD ON ANDROID
// if(Meteor.isCordova){
//   Meteor.startup(function(){
//     document.addEventListener("backbutton", function(){
//       if (history.state && history.state.initial === true) {
//         navigator.app.exitApp();
//       } else {
//         history.go(-1);
//       }
//     });
//   });
// }

if(Meteor.isCordova || Meteor.isMobile){
  Meteor.startup(function(){
    document.addEventListener("backbutton", function(){
       var message = "Did you want to exit?";
       if (confirm(message)) {
        navigator.app.exitApp();
      }
    });
  });
}




Template.main.onRendered(function() {
  this.find('#page-content-wrapper')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn(function () {
          planFadeInHold.release();
           // listFadeInHold.release();
          
        });
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  };
  //this.find('#wrapper').hammer();
});

  // Meteor.methods({
  //     'insertNewList' : function (list_id) {
  //       Todos.insert
  //     }


  // });



Template.main.helpers({


  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes. #each looks at the _id property of it's
  // items to know when to insert a new item and when to update an old one.
  thisArray: function() {
    return [this];
  },
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  cordova: function() {
    return Meteor.isCordova && 'cordova';
  },
  emailLocalPart: function() {
    var email = Meteor.user().emails[0].address;
    return email.substring(0, email.indexOf('@'));
  },
  usernameLocalPart: function() {
     
    
    var email = Meteor.user().emails[0].address;
    if(Meteor.user().profile) { return Meteor.user().profile.name; }
    else {     
    return email.substring(0, email.indexOf('@')); 
  }   
  },
  userMenuOpen: function() {
    return Session.get(USER_MENU_KEY);
  },

  devices: function() {

         if ( Meteor.user()) {


       // OLD WAY START
       //  var thisclientuser = Meteor.users.findOne(Meteor.userId());    

       //  if (thisclientuser.devices) {
       //  var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
        
       // // return UserConnection.find({ $or : [ { _id : "GENERAL-PLAN"} , { userId : Meteor.userId() }  ] } );  
       // // return UserConnection.find({ $or : [ { _id : "GENERAL-PLAN"} , { userId : Meteor.userId() }  ] } );  
       //  // ( {$or : [{ _id : Meteor.userId() },{"services.facebook.id": { $in: friendid }}]})


       //  // var userdevices = Meteor.users.find({"macAddr": {$exists: true}}).fetch();
        
       //  // var userdevices = Meteor.users.find({ $and: [ {"macAddr": {$exists: true}}  ,{$or: [{"macAddr": thisclientuser.macAddr}, {"macAddr": {$in: devicesmac}}]}]}).fetch();
       //  var userdevices = Meteor.users.find({$and: [{"macAddr": {$exists: true}}, {"macAddr": {$in:   devicesmac}}]}).fetch();
       //  console.log(userdevices);
 

       // // var userdevices = UserConnection.find({"macAddr": $in: {devicesmac}}).fetch();

       // return userdevices;

       // }
       // OLD WAY END


       // var userdevices = Meteor.users.find({"Owner": Meteor.userId() }).fetch();
        // var userdevices = Meteor.users.find({}).fetch();
        // console.log(userdevices);


         var userdevices = Meteor.users.find({$and: [{"status.online":  true}, {"Owner": Meteor.userId() }]}).fetch();
          console.log(userdevices);
       return userdevices;

      }
    
  },



  // friends : function() {
  //           if (Meteor.userId()) {
    
  //           var thisclientuser = Meteor.users.findOne(Meteor.userId());          
  //            console.log("User FRIENDLIST:" + thisclientuser.friendslist);

  //            var friendid = thisclientuser.friendslist.map(function(x) { return x.id } );
  //            console.log(friendid);
          


  //            //QUERY THIS CLIENT USER + THIS CLIENT FRIENDSLIS ==== FACEBOOK  FREINDS
  //            // WE ALREADY BEEN FILTERED ONLY ACTIVE USERS FROM PUBLISH-SUBSCRIBE OPTIONS [ files :    ] 
  //            var friend1 = Meteor.users.find( {$or : [{ _id : Meteor.userId() },{"services.facebook.id": { $in: friendid }}]}).fetch();    
           
  //       console.log("active facebook friends1:" + friend1);

  //       // each loop for find and match 
          
  //        // if ( Meteor.users.find({"services.facebook.id": { $in: friendid }}).count() > 0 ) {
  //          // if ( Meteor.users.find({}).count() > 0 ) {
  //           if ( Meteor.users.find({  _id : { $ne : "waTFebaSt6rWTyL3P" }}).count() > 0 ) {
  //         console.log("Notifications called");
  //          Meteor.call('userNotification','friend(s) online','friend(s) online', "waTFebaSt6rWTyL3P");
  //        } 


  //       return friend1;
  //           }
  //       },


  // lists: function() {
  //   return Lists.find();
  // },
  // todos: function() {
  //   return Todos.find();
  // },
  // plans: function() {
    
   
  //     if ( Meteor.user()) {
  //     return Plans.find({ $or : [ { _id : "GENERAL-PLAN"} , { userId : Meteor.userId() }  ] } );  
  //     }
      
    
  //   else {
  //     return Plans.find('GENERAL-PLAN').fetch(); 
  //   }
    
      
  // },



  // activeListClass: function() {
  //   var current = Router.current();
  //   if (current.route.name === 'listsShow' && current.params._id === this._id) {
  //     return 'active';
  //   }
  // },
  activePlanClass: function() {
    var current = Router.current();
    if (current.route.name === 'sensorList' && current.params._id === this._id) {
      return 'active';

    }
  },
  connected: function() {
    if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
      return Meteor.status().connected;
    } else {
      return true;
    }
  },
  sidebar: function() {
    if (Session.get('sidebarinfo')) {
      return true;
    }
  }
 
  });

  

Template.main.events({
  'click .js-menu': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .content-overlay': function(event) {
    Session.set(MENU_KEY, false);
    event.preventDefault();
  },

  'click .js-user-menu': function(event) {
    Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

  'click #menu a': function() {
    Session.set(MENU_KEY, false);
  },

  'click .js-logout': function() {
    // Meteor.call('manualout');
    Meteor.logout();
    
    // if we are on a private list, we'll need to go to a public one
    var current = Router.current();
    // Router.go('signin');
  },

   'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },


    'click #menu-info': function(e) {
        e.preventDefault();
        // $("#wrapper").toggleClass("toggled");
        // Session.set('sidebarinfo', ! Session.get('sidebarinfo'));
        // console.log(Session.get('sidebarinfo'));
    },


      // Mobile wipe development  // 
    // 'panleft panright #wrapper' :function(e) {
    //   e.preventDefault();
    //   $("#wrapper").toggleClass("toggled");
    // },

    // 'swipe #wrapper' :function() {
    //   //e.preventDefault();
    //   $("#wrapper").toggleClass("toggled");
    // },

     'click a.hashroot'  : function() {
    
       // Router.go('plansShow', {_id : this._id} ,  {hash: this.hash });
       // Router.go('sensorList', {_id : this._id} );
      console.log(this._id);
      
      
     
      },

    'click li.wiped': function() {
      if (Meteor.isCordova) {  
         $("#wrapper").toggleClass("toggled");
      }   
      if ( Meteor.isMobile || $(window).width() < 768  ) {  
         $("#wrapper").toggleClass("toggled");
      }   
      
    }

});
 