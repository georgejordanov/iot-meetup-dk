GatewayMac = {} ;

Meteor.methods({
    delete: function () {
        Items.remove({});
    },

    ledcontrol: function(pinled) {
        // console.log(pinled);
         
        // Meteor._sleepForMs(200);

        Leds.update(pinled._id, {$set: { name: pinled.name, checked: ! pinled.checked , time : new Date(), client: true}});
        // console.log(this._id);
        //      console.log(this.checked);
        //      console.log(this.time);

    },

    sensordata: function(temperature, humidity, macAddr) {
        // console.log(pinled);
         
        // Meteor._sleepForMs(200);
        // client.insert('sensors', {'name': 'DHT11 SENSOR 1' ,'temperature':  temperature ,   'humidity': humidity , 'time': timenow})
            
        Sensors.insert({'name': 'DHT11 SENSOR 1' , 'temperature':  temperature , 'humidity': humidity , 'time': new Date() , "macAddr": macAddr });
        ServerASensors.insert({'name': 'DHT11 SENSOR 1' , 'temperature':  temperature , 'humidity': humidity , 'time': new Date() , "macAddr": macAddr });
        // Leds.update(pinled._id, {$set: { name: pinled.name, checked: ! pinled.checked , time : new Date()}});
        // console.log(this._id);
        //      console.log(this.checked);
        //      console.log(this.time);

    },

    setmacaddr: function(macAddr) {
        GatewayMac = macAddr;
        console.log(macAddr);
        console.log(ServerSession);

        remote.call('setconnmac', macAddr, ServerSession , function(error, result){
        console.log("PYTHON TRANSFER CALL BACK FUNCTION ");

        // ServerSession =  result;
        console.log(result);


        //THE USER ID FROM THE CLOUD USER TABLE
        // console.log(result.id);

        // console.log(error);
    });



    },


    // FOR WIRELESS PART THE SENSOR NEED TO HAVE AS WELL SOME KIND OF ID !!!!!    ---    THE PURPOSE WILL BE TO BE ABLE TO REMOVE SENSORS AS WELL
    SetGatewaySensor: function(name, type) {
        console.log("THE GATAWAY MAC AND CONN USERID");
        console.log(name);
        console.log(type);
        console.log(ServerSession);

       //  var conn = Meteor.users.findOne(ServerSession);
       //   console.log(conn._id);
       
       // return Meteor.users.update(ServerSession, {$push: { sensors :{"name": name , "type":  type}}});
       remote.call('SetGatewaySensor', name , type, ServerSession);
              
    },




    controlcreate: function(macAddr, pin,  name) {

        // var userdevices = UserConnections.find({$and: [{"macAddr": {$exists: true}}, {"macAddr": {$in: devicesmac}}]}).fetch();

            var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"name": name}, {"pin": pin}]});

            if(! existled) {
                Leds.insert({"name": name , "macAddr": macAddr, "checked" : false, "pin": pin});
            } 

            remote.call('controlcreate', macAddr, pin, name , function(error, result) {
                console.log('CONTROL CREATE TRIGGERED');    
                console.log(result);
            }  );

    },

    systemcontrolcreate: function(macAddr){
            var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}]});
                if(! existled) {
                Leds.insert({"system": true , "macAddr": macAddr, "device": ServerSession});
            }

             remote.call('systemcontrolcreate', macAddr , function(error, result) {
                console.log('CONTROL CREATE TRIGGERED');    
                console.log(result);
            }  );   

    },

    systemonboot: function(macAddr){
        var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}]});
        if (existled) {
            // IF users implemented into the gateway first to check for login user and assign userId = Meteor.userId() !!! 
            Leds.update(existled._id, {$set: { userId: ServerSession, message: "Up and running" , time : new Date(), command: "", device: ServerSession}});
        }
        remote.call('systemonboot', macAddr);
    },

    systemfail: function(macAddr){
        var existled = Leds.findOne({$and: [{"macAddr": macAddr}, {"system": true}]});
        if (existled) {
            // IF users implemented into the gateway first to check for login user and assign userId = Meteor.userId() !!! 
            Leds.update(existled._id, {$set: { userId: ServerSession, message: "System fail -- restart the hardware" , time : new Date(),command: 0, device: ServerSession}});
        }
        remote.call('systemfail', macAddr);
    }

});

Items.find().observe({
    added: function (item) {
        console.log('-- local item added--');
        console.log(item);

        var _temp = ServerAItems.findOne({_id: item._id});
        if (!_temp) {
            ServerAItems.insert(item);
        }
    },
    removed: function (item) {
        console.log('-- local item removed--');
        console.log(item);

        ServerAItems.remove({_id:item._id});
    }
});

// Sensors.find().observe({
//     added: function (item) {
//         console.log('-- local sensor added--');
//         console.log(item);

//         var _temp = ServerASensors.findOne({_id: item._id});
//         if (!_temp) {
//             //ServerASensors.insert(item);
//              remote.call('serversensordata' , item);
//         }
//     },
//     removed: function (item) {
//         console.log('-- local sensor removed--');
//         console.log(item);

//         ServerASensors.remove({_id:item._id});
//     }
// });

// Leds.find().observe({
//     added: function (item) {
//         console.log('-- local led added--');
//         console.log(item);

//         var _temp = ServerALeds.findOne({_id: item._id});
//         if (!_temp) {
//             ServerALeds.insert(item);
//         }
//     },
//     removed: function (item) {
//         console.log('-- local led removed--');
//         console.log(item);

//         ServerALeds.remove({_id:item._id});
//     }
// });



Leds.find().observeChanges({
    addedBefore: function (id, fields, before) {
        console.log('-- local led added--');
        console.log(id);
         console.log(fields);
         console.log(before);

        // var _temp = ServerALeds.findOne({_id: id});
        // if (!_temp) {
        //     ServerALeds.insert({_id: id}, fields);
        // }
    },
    changed: function ( id , fields) {
        console.log('-- local led updated--');
        console.log(id);
        console.log(fields);
        var state = Leds.findOne({_id:id});
        // console.log(state.client);
        if (state.client == true && ! state.system) {
            // ServerALeds.update({_id:id} , {$set: fields});
             // ServerALeds.update({macAddr:state.macAddr , pin: state.pin} , {$set: fields});

             remote.call('remotecontrol', state.macAddr, state.pin, fields);
        }
        
    }
});



if (Meteor.isServer) {

    Meteor.startup(function () {
        // Items.remove({});
        //remote.subscribe('remote-items', 'B');
        // remote.subscribe('remote-items');
        remote.subscribe('local-items');
        remote.subscribe('localdevice-leds');
        //remote.subscribe('localdevice-sensors');
	
	console.log(this.connection);


         var  Future = Npm.require("fibers/future");
              // Load exec
              var  exec = Npm.require("child_process").exec;

              //new part 
              // Meteor.defer(function() {
              //     var future=new Future();
              // // var command='/root/smartag-python.py';
              //  var command='/root/startpython.sh';
              // exec(command,function(error,stdout,stderr){
              //   if(error){
              //     console.log(error);
              //     throw new Meteor.Error(500,command+" failed");
              //   }
              //   future.return(stdout.toString());
              // });
              // return future.wait();
              //  });
              //end new part

              Meteor.methods({
                runCode: function() {

                    this.unblock();
                  Meteor.defer(function() {

                        var future=new Future();
              // var command='/root/smartag-python.py';
               var command='/root/startpython.sh';
              exec(command,function(error,stdout,stderr){
                if(error){
                  console.log(error);
                  throw new Meteor.Error(500,command+" failed");
                }
                future.return(stdout.toString());
              });
              return future.wait();



                  });
                         


                }

              });
           
             


    });


	Meteor.onConnection(function(connection) {
	console.log("The CONNECTION");
  	console.log(connection);
   
	});

    // remote.connect(function (connection) {
    //     console.log("The CONNECTION");
    // console.log(connection); 
    // });
    // var DDP =  Meteor.npmRequire('ddp.js');
    // // var DDP = require("ddp.js");
    // var options = {
    //     endpoint: "http://localhost:3000/websocket",
    //     SocketConstructor: WebSocket
    // };
    // var ddp = new DDP(options);

    // ddp.on("connected", function () {
    //     console.log("Connected");
    // });



    ServerAItems.find().observe({
        added: function (item) {
            console.log('-- remote item added--');
            console.log(item);

            var _temp = Items.findOne({_id: item._id});
            if (!_temp) {
                console.log('-- local insert--');
                Items.insert(item);
            }
        },
        removed: function (item) {
            console.log('-- remote items removed--');
            Meteor.call('delete');
        }
    });

    // ServerASensors.find().observe({
    //     added: function (item) {
    //         console.log('-- remote item added--');
    //         console.log(item);

    //         var _temp = Items.findOne({_id: item._id});
    //         if (!_temp) {
    //             console.log('-- local insert--');
    //             Sensors.insert(item);
    //         }
    //     },
    //     removed: function (item) {
    //         console.log('-- remote items removed--');
    //         Meteor.call('delete');
    //     }
    // });

    // ServerALeds.find().observe({
    //     added: function (led) {
    //         console.log('-- remote item added--');
    //         console.log(led);

    //         var _temp = Leds.findOne({_id: led._id});
    //         if (!_temp) {
    //             console.log('-- local insert--');
    //             Leds.insert(led);
    //         }
    //     // },
    //     // changed: function (led, id, field) {
    //     //     console.log('-- remote items changed--');
    //     //     console.log(led);
    //     //     console.log(id);
    //     //     console.log(field);
    //     //     // Leds.update({_id:led._id});
    //     // }
    // });

    ServerALeds.find().observeChanges({
    addedBefore: function (id, fields, before) {
        console.log('-- remote led added--');
        console.log(id);
         console.log(fields);
         console.log(before);
          // Leds.insert(fields);
          
        // var _temp = ServerALeds.findOne({_id: id});
        // if (!_temp) {
        //     ServerALeds.insert({_id: id}, fields);
        // }
    },
    changed: function ( id , fields) {
        console.log('-- remote led updated--');
        console.log(id);
        console.log(fields);
        var state = ServerALeds.findOne({_id:id});
        console.log(state.client);
        if (state.client == false && ! state.system) {
            Leds.update({macAddr:state.macAddr, pin: state.pin} , {$set: fields} , { $set : { client: state.client}});
            console.log('LOCAL LED UPDATED');
        }

        if (state.system ==  true && state.command === "check" ) {

              var  Future = Npm.require("fibers/future");
              // Load exec
              var  exec = Npm.require("child_process").exec;
           
              var future=new Future();
              var command='/root/process.py';
              exec(command,function(error,stdout,stderr){
                if(error){
                  console.log(error);
                  throw new Meteor.Error(500,command+" failed");
                }
                future.return(stdout.toString());
              });
              return future.wait();
        }

        if (state.system ==  true && state.command === "device" ) {

              var  Future = Npm.require("fibers/future");
              // Load exec
              var  exec = Npm.require("child_process").exec;
           
              var future=new Future();
              var command='sudo reboot';
              exec(command,function(error,stdout,stderr){
                if(error){
                  console.log(error);
                  throw new Meteor.Error(500,command+" failed");
                }
                future.return(stdout.toString());
              });
              return future.wait();
        }

        if (state.system ==  true && state.command === "hardware" ) {
                Meteor.call('runCode');
              // var  Future = Npm.require("fibers/future");
              // // Load exec
              // var  exec = Npm.require("child_process").exec;
           
              // var future=new Future();
              // var command='/root/smartag-python.py';
              // exec(command,function(error,stdout,stderr){
              //   if(error){
              //     console.log(error);
              //     throw new Meteor.Error(500,command+" failed");
              //   }
              //   future.return(stdout.toString());
              // });
              // return future.wait();
        }
         
    }
    });


   

}
