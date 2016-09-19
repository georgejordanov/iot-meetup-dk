 Meteor.publish('local-items', function () {
        return Items.find();
    })

    Meteor.publish('local-leds', function () {
        console.log(Leds.find().fetch());
        return Leds.find();

    })

    Meteor.publish('local-sensors', function () {
        return Sensors.find({},{ limit : 60 ,sort:{time:-1}});
    })


    