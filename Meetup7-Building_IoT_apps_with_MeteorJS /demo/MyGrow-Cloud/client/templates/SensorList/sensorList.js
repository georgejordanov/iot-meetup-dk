 





if (Meteor.isClient) {
    // Meteor.subscribe('local-items');
    // Meteor.subscribe('local-leds');
//     Template.sensorList.onCreated(function() {
   

//   // this.autorun(() => {
   

//     Meteor.subscribe('local-items');
//        Meteor.subscribe('local-leds');
//        Meteor.subscribe('local-sensors');

//   // });
// });

    Template.sensorList.onCreated(function() {
           
           var self =  this;

          // Meteor.defer(function() {
           self.autorun(function(){
            
            
                     self.subscribe('device-sensors', Router.current().params._id);
                    self.subscribe('device-controls', Router.current().params._id);

           
           
          
           // Meteor.call('sensorssubs' , Router.current().params._id);
           // Meteor.call('devicessubs' , Router.current().params._id);

           })
            // });
        //console.log(this.macAddr);
                var current = Router.current();
                var graphdev = Meteor.users.findOne({_id: current.params._id});
          Meteor.call('systemcheck', graphdev.macAddr, function(error, result){
            console.log(result);
          });
    });    

    // Template.sensorList.onDestroyed(function() {
           
    //        var self =  this;
    //        self.stop();
    // }); 


    Template.sensorList.events({
        'click a.insert': function (e) {
            e.preventDefault();
            Items.insert({name: new Date() , author: "A"});
        },
        'click a.delete': function (e) {
            e.preventDefault();
            Meteor.call('delete');
        },
         'click .led':   _.debounce(function(e) {
            e.preventDefault();          
            pinled = Leds.findOne(this._id);
            console.log(pinled);           
             Meteor.call('ledcontrol', pinled);
        }, 250),

         'click #allstats': function (e) {
            e.preventDefault();
           Router.go('/allsensor',   Sensors.find());
        },

        'click .deletenotificationrule' : function(e) {
             e.preventDefault();
             console.log(this._id);
             console.log(this.sensor);

             var message = "Delete this rule?";
       if (confirm(message)) {
        Meteor.call('deletenotificationrule', this._id);
      }


             
        },

        'click #device' : function(e) {
             e.preventDefault();
              var message = "Restart the device?";
            if (confirm(message)) {
                var current = Router.current();
                var graphdev = Meteor.users.findOne({_id: current.params._id});
             Meteor.call('devicerestart' , graphdev.macAddr);
             }    
        },

        'click #python' : function(e) {
             e.preventDefault();
             var message = "Restart the hardware?";
            if (confirm(message)) { 
               var current = Router.current();
                var graphdev = Meteor.users.findOne({_id: current.params._id}); 
             Meteor.call('hardwarerestart', graphdev.macAddr );
            }
        },

        'click #check' : function(e) {
             e.preventDefault();
             var message = "Check the hardware?";
            if (confirm(message)) {
                var current = Router.current();
                var graphdev = Meteor.users.findOne({_id: current.params._id}); 
             Meteor.call('systemcheck', graphdev.macAddr);
            }
        },


        'click .activatenotificationrule' : function(e) {
             e.preventDefault();
             
             Meteor.call('activatenotificationrule', this._id);
        }

        






    });

    Template.sensorList.helpers({
        tests: function () {
            return Items.find();
        },
         controls: function() {
            // return Leds.find({"macAddr": this.macAddr});
             return Leds.find({"system": {$exists: false}});
        },

        sensors: function() {
          var tempo = this.macAddr;
            console.log(tempo);
            return Sensors.find({"macAddr": this.macAddr},{ limit : 1 , sort:{time: -1} });
             // return Sensors.find({},{ limit : 1 , sort:{time: -1} });
        },

        sensorslist:  function() {
            return Sensors.find({"macAddr": this.macAddr},{ limit : 6 , sort:{time: -1} });
            // return Sensors.find({},{ limit : 6 , sort:{time: -1} });
        },

        pendinglist: function() {
            return NotificationRule.find({ "macAddr": this.macAddr});
        },

        message: function() {               
                var control = Leds.findOne({"system": {$exists: true}});
            return control.message;
        }

    });
	
	// Deps.autorun(function(c) {
 //    try {
 //      UserStatus.startMonitor({
 //        threshold: 30000,
 //        idleOnBlur: true
 //      });
 //      return c.stop();
 //    } catch (undefined) {}
 //  });
}




// devices: function() {

//          if ( Meteor.user()) {
//         var thisclientuser = Meteor.users.findOne(Meteor.userId());    

//         if (thisclientuser.devices) {
//         var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
        
//        // return UserConnection.find({ $or : [ { _id : "GENERAL-PLAN"} , { userId : Meteor.userId() }  ] } );  
//        // return UserConnection.find({ $or : [ { _id : "GENERAL-PLAN"} , { userId : Meteor.userId() }  ] } );  
//         // ( {$or : [{ _id : Meteor.userId() },{"services.facebook.id": { $in: friendid }}]})


//         // var userdevices = Meteor.users.find({"macAddr": {$exists: true}}).fetch();
        
//         // var userdevices = Meteor.users.find({ $and: [ {"macAddr": {$exists: true}}  ,{$or: [{"macAddr": thisclientuser.macAddr}, {"macAddr": {$in: devicesmac}}]}]}).fetch();
//         var userdevices = Meteor.users.find({$and: [{"macAddr": {$exists: true}}, {"macAddr": {$in:   devicesmac}}]}).fetch();
//         console.log(userdevices);
 

//        // var userdevices = UserConnection.find({"macAddr": $in: {devicesmac}}).fetch();

//        return userdevices;

//        }


//       }
    
//   },




Template.CreateNotificationRule.onCreated(function() {

        Session.set('conditions', []);
        Session.setDefault('selectedSensor', undefined);
        Session.setDefault('selectedOperator', undefined);
        Session.setDefault('selectedRuleset', undefined);


    });




Template.CreateNotificationRule.helpers({

        sensortype: function() {

            var current = Router.current();


            var thisdevice = Meteor.users.findOne(current.params._id);
            console.log(thisdevice);
                if (thisdevice.sensors) {

                    var devicesensortype = thisdevice.sensors.map(function(x) {return x.type});
                    console.log(devicesensortype);
                    return devicesensortype;
                }

        },


        'selectedSensor': function() {
        
            return  Session.get('selectedSensor') ;
       
    },

    'selectedOperator': function() {
        return Session.get('selectedOperator');
    },

     'operatorList': function() {
        // var operatorList = ['>', '<', '>=', '<=', '=', '!='];
        var operatorList = ['>', '<', '>=', '<=', '==', '!='];
        var index = operatorList.indexOf(Session.get('selectedOperator'));
        if (index !== -1) {
            operatorList.splice(index, 1);
        }
        return operatorList;
    },



});



Template.CreateNotificationRule.events({

 // NEW PART  


         'click .operatorItem': function(event) {
        event.preventDefault();
        Session.set('selectedOperator', event.currentTarget.id);
        },

        'click .sensorItem': function(event) {
            event.preventDefault();
            Session.set('selectedSensor', event.currentTarget.id);
            console.log(Session.get('selectedSensor'));
        },

        'click #SaveRuleSetbtn': function(event) {
        event.preventDefault();
        var title = $('#title').val();
        title = title.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        var message = $('#message').val();
        message = message.charAt(0).toUpperCase() + message.substr(1);

        var sensor = Session.get('selectedSensor');
        var operator = Session.get('selectedOperator');
        var targetValue = $('#targetValue').val();

        var current = Router.current();
        var thisdevice = Meteor.users.findOne(current.params._id);

        // var list_of_conditions = Session.get('conditions');

        Meteor.call('CreateNotificationRule', title, message, sensor, operator, targetValue, thisdevice.macAddr ,function(error, rulesetId) {
            if (error) {
                Session.set('error-text', error.reason);
            }
            else {
                $('#message').val("");
                $('#title').val("");
                $('#targetValue').val("");
                Session.set('conditions', []);
                Session.set('selectedRuleset', rulesetId);
                }
            });
        },

        // THE PART FOR THE PENDING NOTIFICATION LIST

        //  'click .rulesetItem': function(event) {
        // event.preventDefault();
        // Session.set('selectedRuleset', event.currentTarget.id);
        // }



});


 // var graphdev = Meteor.users.findOne({_id: current.params._id});