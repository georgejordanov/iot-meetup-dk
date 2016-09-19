Meteor.methods({
    delete: function () {
        Items.remove({});
    },

    ledcontrol: function(pinled) {
        // Meteor._sleepForMs(500);
        Leds.update(pinled._id, {$set: { name: pinled.name, checked: ! pinled.checked , time : new Date(), client: false}});
         
    },

    remotecontrol: function(remotemacAddr, remotepin, fields) {

        Leds.update({macAddr:remotemacAddr, pin: remotepin} , {$set: fields});
    },

    serversensordata: function(item) {

         var _temp = Sensors.findOne({_id: item._id});
        if (!_temp) {    

        Sensors.insert(item);
    }
    },

    setconnmac: function(macAddr, gatewayid) {
        console.log("THE GATAWAY MAC AND CONN USERID");
        console.log(macAddr);
        console.log(gatewayid);

        //If the device DDP login fails this query catches the first user !!! NEED TO BE CHANGED
        var conn = Meteor.users.findOne(gatewayid);
         console.log(conn._id);


       
       return Meteor.users.update(gatewayid, {$set: {"macAddr": macAddr, "device": true}});


    },

    // FOR WIRELESS PART THE SENSOR NEED TO HAVE AS WELL SOME KIND OF ID !!!!!    ---    THE PURPOSE WILL BE TO BE ABLE TO REMOVE SENSORS AS WELL
    SetGatewaySensor: function(name, type, gatewayid) {
        console.log("THE GATAWAY MAC AND CONN USERID");
        console.log(name);
        console.log(type);
        console.log(gatewayid);
        //If the device DDP login fails this query catches the first user !!! NEED TO BE CHANGED
        var conn = Meteor.users.findOne(gatewayid);  
         console.log(conn._id);


       
       return Meteor.users.update(gatewayid, {$push: { sensors :{"name": name , "type":  type}}});

              
    },

    CreateNotificationRule: function(title, message, sensor, operator, targetValue, macAddr) {
            //  NEED TO ADD SENSOR ID IN FUTURE WHEN WIRELESS PART IS READY !!!!!
            console.log(title);
            console.log(this.userId);
            console.log(operator);
            console.log(macAddr);



             if (Meteor.userId()) {

            var newRuleSet = {
                title: title,
                message: message,
                sensor: sensor,
                operator: operator,
                targetValue: targetValue,
                pending: true,
                macAddr: macAddr,
                addedAt: new Date(),
                userId: Meteor.userId()
            }
            try {
                ValidateRuleSet(newRuleSet);
                var rulesetId = NotificationRule.insert(newRuleSet);
                return rulesetId;
            }
            catch (error) {
                throw new Meteor.Error('Error', error.message);
            }
        }
        else {
            throw new Error('User must be logged in');
        }
    





    },


    controlcreate: function(macAddr, pin, name) {

        // var userdevices = UserConnections.find({$and: [{"macAddr": {$exists: true}}, {"macAddr": {$in: devicesmac}}]}).fetch();

            var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"name": name}, {"pin": pin}]});

            if(! existled) {
                Leds.insert({"name": name , "macAddr": macAddr, "checked" : false, "pin": pin});
            } 

            
    },

    systemcontrolcreate: function(macAddr) {
        if (this.userId) {

                var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}, {"device": this.userId}]});
                if(! existled) {
                Leds.insert({"system": true , "macAddr": macAddr, "device": this.userId});
            }


        }

    },

    systemonboot: function(macAddr) {
        this.unblock();
         if (this.userId) {
            

           var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}, {"device": this.userId}]});
        if (existled) {
             
            Leds.update(existled._id, {$set: { userId: this.userId, message: "Up and running" , time : new Date(), command: "", device: this.userId}});
        }


         }

    },

    systemfail: function(macAddr) {
        this.unblock();  
         if (this.userId) {
              
           var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}, {"device": this.userId}]});
        if (existled) {
            
            Leds.update(existled._id, {$set: { userId: this.userId, message: "System fail -- restart the hardware" , time : new Date(), command: 0, device: this.userId}});
        }


         }

    },

    devicerestart: function(macAddr) {
        this.unblock();
         if (this.userId) {
            
                // More complex and secure check need to be impelmeted in future !!!!!!
                // TO ADD && CONDITION FOR THE macAddr to be into the user devices list!!!!!!!!!
           var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}]});
        if (existled) {
            
            Leds.update(existled._id, {$set: { userId: this.userId, message: "Restarting ..." , time : new Date(), command: "device"}});
        }


         }

    },

    hardwarerestart: function(macAddr) {
         this.unblock();
         if (this.userId) {
           
                // More complex and secure check need to be impelmeted in future !!!!!!
           var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}]});
        if (existled) {
            
            Leds.update(existled._id, {$set: { userId: this.userId, message: "Hardware restarting ..." , time : new Date(), command: "hardware"}});
        }


         }

    },

    systemcheck: function(macAddr) {
         this.unblock();
         if (this.userId) {

                // More complex and secure check need to be impelmeted in future !!!!!!
           var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}]});
        if (existled) {
            
            Leds.update(existled._id, {$set: { userId: this.userId, message: "Awating hardware ..." , time : new Date(), command: "check"}});
        }


         }

    },

    devicesadd: function(name, macAddr) {    

            Meteor.users.update(this.userId ,  {$push: { devices :{"name": name , "mac":  macAddr}}})

     },  

     useraccountCreate: function(email, password, user)   {
         check(email, String);

        if(Meteor.user()){
          var newdeviceId =  Accounts.createUser({
              email: email,
              password: password
              // firstname: FirstName,
              // lastname: LastName
            // Owner: Meteor.userId()
         });

          check(newdeviceId, String);

          Meteor.users.update(newdeviceId, {$set: { Owner: this.userId , device: true ,  } });
      
   
        }

     }, 

     userremove: function(userId) {
        if(Meteor.user()) {
            //DA NAPRAVQ MONGODB QUERY DA PROVERQVA DALI userId PRINADLEJI NA 
            // ACCOUNTI DETO PRINADLEJAT NA this.userId
                Meteor.users.remove(userId);


        }
      

     }    
    // ,

    // getconnid: function(connection) {

    //     return 
    // }

    // sensorssubs: function(ID) {
    //     this.unblock();
    //   return  Meteor.subscribe('device-sensors', ID);
    // },

    // devicessubs: function(ID) {
    //     this.unblock();
    //  return   Meteor.subscribe('device-controls', ID);
    // }

});

// Items.find().observe({
//     added: function (item) {
//         console.log(item);
//     }

    
// });



