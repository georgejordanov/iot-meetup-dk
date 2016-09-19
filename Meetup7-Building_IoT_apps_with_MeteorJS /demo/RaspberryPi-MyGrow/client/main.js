// if (Meteor.isClient) {
    

    // Template.testList.onRendered(function() {

    //     var self = this;
    //     self.autorun(function() {
    //         Meteor.subscribe('local-items');
    //         Meteor.subscribe('local-leds');
    //     });

    // });

    Template.testList.events({
        'click a.insert': function (e) {
            e.preventDefault();
            Items.insert({name: new Date(), author: "B"});
        },
        'click a.delete': function (e) {
            e.preventDefault();
            Meteor.call('delete');
        },
        // 'click .btn': function (e) {
           'click .btn':   _.debounce(function(e) {
            e.preventDefault();
            console.log(e);
            pinled = Leds.findOne(this._id);
            console.log(pinled);
                // if(pinled.checked == true) {
                //      Leds.update(this._id, {$set: { name: this.name , checked:  false , time : new Date()}});
                //      console.log("CHECKED TRUE");
                // }
                // if(pinled.checked == false) {
                //      Leds.update(this._id, {$set: { checked:  true , time : new Date()}});
                //      console.log("CHECKED FALSE");
                // }
             // console.log(this);
             // console.log(this._id);
             // console.log(this.checked);
             // console.log(this.time);
             Meteor.call('ledcontrol', pinled);
        }, 250)
        
    });

    Template.testList.helpers({
       
        tests: function () {
            return Items.find({});
        },

        controls: function() {
            return Leds.find({"system": {$exists: false}});
        },

        sensors: function() {
            return Sensors.find({},{ limit : 1 , sort:{time: -1} });
        },

        sensorslist:  function() {
            return Sensors.find({},{ limit : 6 , sort:{time: -1} });
        },

    });


// }