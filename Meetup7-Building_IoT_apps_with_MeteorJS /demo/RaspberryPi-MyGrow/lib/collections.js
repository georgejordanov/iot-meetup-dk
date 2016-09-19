ServerSession = {} ; 



 Items = new Meteor.Collection('items');

 Leds = new Meteor.Collection('leds');

 Sensors = new Meteor.Collection('sensors');

// remote = DDP.connect('http://testddp.meteor.com/'
remote = DDP.connect('http://localhost:3000' 
  //  , function(connection){
	// console.log(connection);
	//  return connection;
//}
);
// console.log(remote);
// console.log(remote);
ServerAItems = new Meteor.Collection('items', {connection: remote});
// console.log(ServerAItems);
ServerALeds = new Meteor.Collection('leds', {connection: remote});
// console.log(ServerALeds);
 ServerASensors = new Meteor.Collection('sensors', {connection: remote});
 

    remote.call('login' , {"password":"123456","user":{"email":"a@a.a"}} , function(error, result){
        console.log("CALL BACK FUNCTION");

        ServerSession =  result.id;
        console.log(ServerSession);


        //THE USER ID FROM THE CLOUD USER TABLE
        // console.log(result.id);

        // console.log(error);
    } ); 

    


    remote.onReconnect =  function () { 
        remote.call('login' , {"password":"123456","user":{"email":"a@a.a"}} , function(error, result){
        console.log("ONRECONNECT CALL BACK FUNCTION");

        ServerSession =  result.id;
        console.log(ServerSession);


        //THE USER ID FROM THE CLOUD USER TABLE
        // console.log(result.id);

        // console.log(error);
    }); 

      



        };
    




    //console.log(remote.status());

 



 // console.log(remote.status());

// Items.allow({
//     insert: function () {
//         return true;
//     }
// });

 // Meteor.subscribe('local-items');
 //    Meteor.subscribe('local-leds');






     // var DDP = require("ddp.js");
    // var options = {
    //     endpoint: "http://localhost:3000/websocket",
    //     SocketConstructor: WebSocket
    // };
    // var ddp = new DDP(options);

// var ddp = new DDP({"http://localhost:3000/websocket"});
    // remote.on("connected", function (msg) {
    //     console.log("Connected");
    //     console.log(msg);
    // });

// Meteor.connection._stream.on('message', function (message) { 
//     console.log("receive", JSON.parse(message)); 
//   });


    
// // console.log(remote);
// // console.log(remote);
// ServerAItems = new Meteor.Collection('items', {connection: ddp});
// // console.log(ServerAItems);
// ServerALeds = new Meteor.Collection('leds', {connection: ddp});
// // console.log(ServerALeds);
//  ServerASensors = new Meteor.Collection('sensors', {connection: ddp});