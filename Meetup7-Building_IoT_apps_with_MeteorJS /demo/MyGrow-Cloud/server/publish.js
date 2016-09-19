if (Meteor.isServer) {

  //STANDARD
   Meteor.publish('local-items', function () {
        //  if (!this.userId) {
        //     return this.ready();
        // }

        return Items.find();
    })

   Meteor.publish('local-notifications', function () {
         if (!this.userId) {
            return this.ready();
        }

        // TO NOT FORGET TO FILTER NOTIFICATIONS BY USERID
        return NotificationHistory.find({"userId": this.userId});
    })


   Meteor.publish('local-notifications-rules', function () {
         if (!this.userId) {
            return this.ready();
        }

        
        return NotificationRule.find({"userId": this.userId});
    })

    Meteor.publish('local-leds', function () {
        // if (!this.userId) {
        //     return this.ready();
        // }

        var currentuser = this.userId;
          if (currentuser) {
        var thisclientuser = Meteor.users.findOne(currentuser);    

        if (thisclientuser.devices) {
        var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
        

        return Leds.find({"macAddr": {$in: devicesmac}});
          }        
      }
      else {return  this.ready();}
    })

    Meteor.publish('local-sensors', function () {
        //  if (!this.userId) {
        //     return this.ready();
        // }
        
        var currentuser = this.userId;
          if (currentuser) {
        var thisclientuser = Meteor.users.findOne(currentuser);    

        if (thisclientuser.devices) {
        var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
       

        // return Sensors.find({"macAddr": {$in: devicesmac}},{fields: {$nin: {humidity} }},{ sort:{time: 1} });
         return Sensors.find({"macAddr": {$in: devicesmac}},{limit : 600 , sort:{time: -1} });
          }
      } 
      else {return  this.ready();}
    })

    Meteor.publish('device-sensors' , function(ID) {
        check(ID, String);
        if (! this.userId) {
          return this.ready();
        }

        if (ID) {
          var subs =  Meteor.users.findOne(ID);
         return Sensors.find({"macAddr": subs.macAddr},{ limit : 100 ,sort:{time: -1} });
        }
        else {
          return this.stop();
        }


    })

    Meteor.publish('device-controls' , function(ID)   {
        check(ID, String);
         if (! this.userId) {
          return this.ready();
        }
        if (ID) {
        var subs =  Meteor.users.findOne(ID);
        return Leds.find({"macAddr": subs.macAddr});
         }
        else {
          return this.stop();
        }
    })




    Meteor.publish('localdevice-leds', function () {
        // if (!this.userId) {
        //     return this.ready();
        // }

        var currentuser = this.userId;
          if (currentuser) {
        var thisclientuser = Meteor.users.findOne(currentuser);    

       
       // var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
        

        return Leds.find({"macAddr": thisclientuser.macAddr });
                
      }
      else {return  this.ready();}
    })

    Meteor.publish('localdevice-sensors', function () {
        //  if (!this.userId) {
        //     return this.ready();
        // }
        
        var currentuser = this.userId;
          if (currentuser) {
        var thisclientuser = Meteor.users.findOne(currentuser);    

        
       // var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
       

        return Sensors.find({"macAddr": thisclientuser.macAddr},{ sort:{time: 1} });
          
      } 
      else {return  this.ready();}
    })  






    //REACTIVE
    //  Meteor.reactivePublish('local-items', function () {
    //     //  if (!this.userId) {
    //     //     return this.ready();
    //     // }

    //     return Items.find();
    // })

    // Meteor.reactivePublish('local-leds', function () {
    //     // if (!this.userId) {
    //     //     return this.ready();
    //     // }

    //     var currentuser = this.userId;
    //       if (currentuser) {
    //     var thisclientuser = Meteor.users.findOne(currentuser);    

    //     if (thisclientuser.devices) {
    //     var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
    //     // ( {$or : [{ _id : Meteor.userId() },{"services.facebook.id": { $in: friendid }}]})

    //     return Leds.find( { $or:  [{"macAddr": thisclientuser.macAddr} ,{"macAddr": {$in: devicesmac}}]});

    //      }
    //   }
    //   else {return  this.ready();}
    // })

    // Meteor.reactivePublish('local-sensors', function () {
    //     //  if (!this.userId) {
    //     //     return this.ready();
    //     // }
        
    //     var currentuser = this.userId;
    //       if (currentuser) {
    //     var thisclientuser = Meteor.users.findOne(currentuser);    

    //     if (thisclientuser.devices) {
    //     var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
        
    //     return Sensors.find({ $or:  [{"macAddr": thisclientuser.macAddr} ,{"macAddr": {$in: devicesmac}}]},{ sort:{time: 1} });
    //     // return Sensors.find({"macAddr": {$in: devicesmac}},{ sort:{time: 1} });
    //     // return Sensors.find({},{ limit : 500 , sort:{time: -1} });
    //     }
    //   } 
    //   else {return  this.ready();}
    // })









     // var thisclientuser = Meteor.users.findOne(this.userId); 
     // if (thisclientuser) {
     // var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );

     // // var userdevices = UserConnection.find({"macAddr": {$in: devicesmac}}).fetch();
     // }

    // Meteor.publish('local-items', function () {
    //     return Items.find();
    // })

    // Meteor.publish('local-leds', function () {
    //     return Leds.find({"macAddr": {$in: devicesmac}}).fetch();
    // })

    // Meteor.publish('local-sensors', function () {
    //     return Sensors.find({"macAddr": {$in: devicesmac}}).fetch();
    //     // return Sensors.find({},{ limit : 500 , sort:{time: -1} });
    // })

    // Meteor.publish('local-sensors', function () {
    //     return Sensors.find();
    //     // return Sensors.find({},{ limit : 500 , sort:{time: -1} });
    // })

    // Meteor.publish('all-sensors', function () {
    //     return Sensors.find();
    //     // return Sensors.find({},{ limit : 10 , sort:{time: -1} });
    // })

    //Meteor.publish('remote-items', function (_author) {
    //    return Items.find({author:_author});
    //})

	Meteor.publish('activeusers', function() {
  

   // return Meteor.users.find({ "status.online": true });


   var currentuser = this.userId;
   return Meteor.users.find({ "Owner": currentuser });

   
});

  Meteor.publish('usersdevices', function() {
  
      var currentuser = this.userId;
   return Meteor.users.find({ "Owner": currentuser });
});
  

}








 





  //OLD publish

  // Meteor.publish('local-items', function () {
  //       //  if (!this.userId) {
  //       //     return this.ready();
  //       // }

  //       return Items.find();
  //   })

  //   Meteor.publish('local-leds', function () {
  //       // if (!this.userId) {
  //       //     return this.ready();
  //       // }

  //       var currentuser = this.userId;
  //         if (currentuser) {
  //       var thisclientuser = Meteor.users.findOne(currentuser);    

  //       if (thisclientuser.devices) {
  //       var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
  //       }

  //       return Leds.find({"macAddr": {$in: devicesmac}});
  //     }
  //     else {return  this.ready();}
  //   })

  //   Meteor.publish('local-sensors', function () {
  //       //  if (!this.userId) {
  //       //     return this.ready();
  //       // }
        
  //       var currentuser = this.userId;
  //         if (currentuser) {
  //       var thisclientuser = Meteor.users.findOne(currentuser);    

  //       if (thisclientuser.devices) {
  //       var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
  //       }

  //       return Sensors.find({"macAddr": {$in: devicesmac}},{ sort:{time: 1} });
         
  //     } 
  //     else {return  this.ready();}
  //   })



  //REACTIVE PUBLISH    ----   lepozepo:reactive-publish
   // Meteor.reactivePublish('local-items', function () {
   //      //  if (!this.userId) {
   //      //     return this.ready();
   //      // }

   //      return Items.find();
   //  })

   //  Meteor.reactivePublish('local-leds', function () {
   //      // if (!this.userId) {
   //      //     return this.ready();
   //      // }

   //      var currentuser = this.userId;
   //        if (currentuser) {
   //      var thisclientuser = Meteor.users.findOne(currentuser);    

   //      if (thisclientuser.devices) {
   //      var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
   //      }

   //      return Leds.find({"macAddr": {$in: devicesmac}});
   //    }
   //    else {return  this.ready();}
   //  })

   //  Meteor.reactivePublish('local-sensors', function () {
   //      //  if (!this.userId) {
   //      //     return this.ready();
   //      // }
        
   //      var currentuser = this.userId;
   //        if (currentuser) {
   //      var thisclientuser = Meteor.users.findOne(currentuser);    

   //      if (thisclientuser.devices) {
   //      var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
   //      }

   //      return Sensors.find({"macAddr": {$in: devicesmac}},{ sort:{time: 1} });
   //      // return Sensors.find({},{ limit : 500 , sort:{time: -1} });
   //    } 
   //    else {return  this.ready();}
   //  })