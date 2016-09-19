//Push.debug = true;


Push.allow({
    send: function(userId, notification) {
        return true; // Allow all users to send
    }
});

Meteor.methods({
    serverNotification1: function(text,title) {
        var badge = 1
        Push.send({
            from: 'push',
            title: title,
            text: text,
            badge: badge,
            // sound: 'airhorn.caf',
            payload: {
                title: title,
                text:text,
                historyId: Math.random()
            },
            query: {
                // this will send to all users
            }
        });
    },
    userNotification: function(text,title,userId) {
        var badge = 1
        if(badge != null) {
            badge = badge + 1;
        }
        Push.send({
            from: 'push',
            title: title,
            text: text,
            badge: badge,
            
            payload: {
                title: title,
                historyId: Math.random()
            },
            query: {
                userId: userId //this will send to a specific Meteor.user()._id
            }
        });
    },



    serverNotification: function () {
        var last = NotificationHistory.findOne({}, {sort: {addedAt: -1}});
        var badge = 1
        if (last != null) {
            badge = last.badge + 1;
        }

        NotificationHistory.insert({
            badge: badge,
            addedAt: new Date()
        }, function (error, result) {
            if (!error) {
                Push.send({
                    from: 'push',
                    title: 'Sensor DHT-11',
                    text: 'Humidity very high over 55%',
                    badge: badge,
                    payload: {
                        title: 'Treatment Plan Done',
                        historyId: result
                    },
                    query: {}
                });
                console.log('Notification Method triggered');
            }
        });
    },
    removeHistory: function () {
        NotificationHistory.remove({}, function (error) {
            if (!error) {
                console.log("All history removed");
            }
        });
    },

    deletenotificationrule: function(id) {

      return  NotificationRule.remove(id);
    },

    activatenotificationrule: function(id) {
        return NotificationRule.update(id , {$set: {"pending": true , "addedAt": new Date()}});
    },



    //NEED TO MOVE THIS PART OUT OF METHODS TO DIRECT FUNCTION INTO THE OBSERVATION CURSOR BELOW FOR SECURE REASONS !!!
     customNotification: function (text,title,userId, macAddr, sensor, operator, targetValue) {  
        var last = NotificationHistory.findOne({}, {sort: {addedAt: -1}});
        var badge = 1
        if (last != null) {
            badge = last.badge + 1;
        }

        NotificationHistory.insert({
            badge: badge,
            addedAt: new Date(),
            userId: userId,
            text: text,
            title: title,
            macAddr: macAddr,
            sensor: sensor,
            operator: operator,
            value: targetValue
        }, function (error, result) {
            if (!error) {
                Push.send({
                    from: 'push',
                    title: title,
                    text: text,
                    badge: badge,
                    payload: {
                        title: title,
                        historyId: result
                    },
                    query: { 
                     userId: userId
                 }
                });
                
            }
        });
    }

});


 // Meteor.defer(function() {

    // var pendingnitifications = NotificationRule.find({$and: [  {"macAddr": item.macAddr} ,  {"addedAt": { $lt: item.time } } , {"pending": true}     ]}).fetch();         

    //     if (pendingnitifications) {


                //NEED TO TRY TO PLACE THE var find OUTSIDE OF THE observe FUNCTION!!! IN ORDER TO SPEED THE DEPLOYMENT TO THE GALAXY IN FUTURE !!!!!!!!!

Sensors.find().observe({
    added: function (item) {
        // console.log('-- local sensor added--');
        // console.log(item);
        
        var find = NotificationRule.find({$and: [  {"macAddr": item.macAddr} ,  {"addedAt": { $lt: item.time } } , {"pending": true}     ]}).fetch();         
        // console.log(find);

        if (find) {

            find.forEach(function(notification) {

                    // console.log("FOR EACH");
                    // console.log(notification);
                    // console.log("THE ADDED ITEM");
                    // console.log(item);


                    if (notification.sensor == 'humidity' ) {
                        // console.log("HUMIDITY");

                            if(  eval(item.humidity  +  notification.operator + notification.targetValue)   )   {
                                    // console.log("TRIGGER TRUE");
                                     Meteor.call('customNotification', notification.message, notification.title, notification.userId, notification.macAddr ,notification.sensor, notification.operator, notification.targetValue);   

                                     NotificationRule.update(notification._id , {$set:{"pending": false}});   
                                     
                            } 
                            else { 
                                    // console.log("TRIGGER FALSE");
                            }
                    }

                    if (notification.sensor == 'temperature') {
                        // console.log("TEMPERATURE");

                            if(  eval(item.temperature  +  notification.operator + notification.targetValue)   )   {
                                    // console.log("TRIGGER TRUE");
                                     Meteor.call('customNotification', notification.message, notification.title, notification.userId, notification.macAddr ,notification.sensor, notification.operator, notification.targetValue);   

                                     NotificationRule.update(notification._id , {$set:{"pending": false}});   
                                     
                            } 
                            else { 
                                    // console.log("TRIGGER FALSE");
                            }

                    }
            }); 

        }

    }
    // ,
    // removed: function (item) {
    //     console.log('-- local sensor removed--');
    //     console.log(item);

             
    // }
});


        // end if pendingnotifications    
        // }

//end meteor defer function
// });








 // var userdevices = Meteor.users.find({$and: [{"macAddr": {$exists: true}}, {"macAddr": {$in:   devicesmac}}]}).fetch();


  // var friendsmarkers = Markers.find( { facebook : { $in: friendid }}).fetch(); 
  //             console.log(friendsmarkers);
     
  //             if (friendsmarkers) {

  //                 friendsmarkers.forEach(function(newDocument) {
  //                    if (!markers[newDocument.userId]){ 
  //                    // if (!markers[id]){    
  //                      var friendspic = Meteor.users.findOne({"services.facebook.id": "newDocument.facebook" });
  //                        console.log(friendspic);  
  //                     marker = new google.maps.Marker({
  //                     animation: google.maps.Animation.DROP,
  //                     position: new google.maps.LatLng(newDocument.latLng.lat, newDocument.latLng.lng),
  //                     map: map.instance,
  //                     id: id,
  //                     icon: newDocument.icon
  //                     });
  //                       markers[id] = marker;
  //                 console.log('new friend marker added' + marker.id);
  //                 console.log(markers); 


  //                       }
  //                 }); 
                   

                    
  //             }


//  {
//     "_id" : ObjectId("56c88c97c58cb4e3775ffab6"),
//     "humidity" : 33,
//     "name" : "DHT11 SENSOR 1",
//     "temperature" : 24,
//     "macAddr" : "c4:54:44:84:70:b4",
//     "time" : ISODate("2016-02-20T16:45:20.750Z")
// }




// {
//     "_id" : "KihuofMn8cRMgaJhN",
//     "title" : "Home Kitchen",
//     "message" : "Temperature too low",
//     "sensor" : "temperature",
//     "operator" : "<",
//     "targetValue" : "24",
//     "pending" : true,
//     "macAddr" : "c4:54:44:84:70:b4",
//     "addedAt" : ISODate("2016-02-20T15:27:20.750Z"),
//     "userId" : "kTW9c7Zuah3D2FuwK"
// }