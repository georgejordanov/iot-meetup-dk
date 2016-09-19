Template.landing.helpers({

        notificationsinfo: function() {

            return NotificationHistory.find({"userId": Meteor.userId()}, { limit:5 , sort:{ addedAt: -1}}).fetch();
        }    

        // friends : function() {
        //     if (Meteor.userId()) {
    
        //     var thisclientuser = Meteor.users.findOne(Meteor.userId());          
        //      console.log("User FRIENDLIST:" + thisclientuser.friendslist);

        //      var friendid = thisclientuser.friendslist.map(function(x) { return x.id } );
        //      console.log(friendid);
          


        //      //QUERY THIS CLIENT USER + THIS CLIENT FRIENDSLIS ==== FACEBOOK  FREINDS
        //      // WE ALREADY BEEN FILTERED ONLY ACTIVE USERS FROM PUBLISH-SUBSCRIBE OPTIONS [ files :    ] 
        //      var friend1 = Meteor.users.find( {$or : [{ _id : Meteor.userId() },{"services.facebook.id": { $in: friendid }}]}).fetch();    
           
        // console.log("active facebook friends1:" + friend1);

        // // each loop for find and match 
          
        //  // if ( Meteor.users.find({"services.facebook.id": { $in: friendid }}).count() > 0 ) {
        //    // if ( Meteor.users.find({}).count() > 0 ) {
        //     if ( Meteor.users.find({  _id : { $ne : "waTFebaSt6rWTyL3P" }}).count() > 0 ) {
        //   console.log("Notifications called");
        //    Meteor.call('userNotification','friend(s) online','friend(s) online', "waTFebaSt6rWTyL3P");
        //  } 


        // return friend1;
        //     }
        // },

        // cordova: function() {
        //     return Meteor.isCordova && 'cordova';
        // }, 

        // connected: function() {
        //     if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
        //       return Meteor.status().connected;
        //     } else {
        //       return true;
        //     }
        //   }

});


Template.landing.events({

	'click [name=done]' : function(event, template) {
			event.preventDefault();
		Router.go('/');
        Meteor.call('serverNotification')
	},

    // 'click #btn-user-friends': function(e) {
    //     if(Meteor.user()){
    //     console.log(Meteor.user().services.facebook.id);
    //       }
    // var users = Meteor.users.find({}).fetch();
    // console.log(users);
    //     users.forEach(function(u) {
    //             console.log("signed for the app users:" + u.profile.name);
                
    //            }); 



    //     Meteor.call('getFriendsData', function(err, data) {
    //          $('#result1').text(JSON.stringify(data, undefined, 4));
    //           var i;
    //          for (i in data) {
    //             console.log("active facebook friends ID: [ARRAY]" + data[i].id + data[i].name);
                
    //         }
    //     var users = Meteor.users.find({}).fetch();
    //     var friendid = data.map(function(x) { return x.id } );
    //     console.log('Mapping just the IDs of friendslist --- friends IDS:' + friendid);
          
    //     var friend = Meteor.users.find({"serices.facebook.id": { $in: friendid }}).fetch();
    //     console.log("active facebook friends try1:" + friend);   

    //     var friend1 = Meteor.users.find({"serices.facebook.id": { $in: [friendid] }});
    //     console.log("active facebook friends try2:" + friend1); 
    //     friend1.forEach(function(i) {
    //         console.log("active facebook friends try3:" + i);  
    //     });
        
      
              
    //      });



    //     Meteor.call('getUserData', function(err, data) { console.log(data); });

    // },

    // 'click #menu-toggle': function(e) {
    //     e.preventDefault();
    //     $("#wrapper").toggleClass("toggled");
    // },

    // 'click li.wiped': function() {
    //   if (Meteor.isCordova) {  
    //      $("#wrapper").toggleClass("toggled");
    //   }   
    //   // if ( Meteor.isMobile || $(window).width() < 768  ) {  
    //   //    $("#wrapper").toggleClass("toggled");
    //   // }   
      
    // }


});

