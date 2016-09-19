var ERRORS_KEY = 'joinErrors';

Template.devices.onCreated(function() {
  Session.set(ERRORS_KEY, {});
   var self =  this;

          // Meteor.defer(function() {
           // self.autorun(function(){
            
            
           //         self.subscribe('usersdevices');
           //          // self.subscribe('device-controls', Router.current().params._id);

          
           // // Meteor.call('sensorssubs' , Router.current().params._id);
           // // Meteor.call('devicessubs' , Router.current().params._id);

           // })
});






Template.devices.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
  userdevice: function()  {
    if ( Meteor.user()) {
       //  var thisclientuser = Meteor.users.findOne(Meteor.userId());    

       //  if (thisclientuser.devices) {
       //  var devicesmac = thisclientuser.devices.map(function(x) { return x.mac } );
        
       // // return UserConnection.find({ $or : [ { _id : "GENERAL-PLAN"} , { userId : Meteor.userId() }  ] } );  
       // // return UserConnection.find({ $or : [ { _id : "GENERAL-PLAN"} , { userId : Meteor.userId() }  ] } );  
       //  // ( {$or : [{ _id : Meteor.userId() },{"services.facebook.id": { $in: friendid }}]})


       //  // var userdevices = Meteor.users.find({"macAddr": {$exists: true}}).fetch();
        
       //  // var userdevices = Meteor.users.find({ $and: [ {"macAddr": {$exists: true}}  ,{$or: [{"macAddr": thisclientuser.macAddr}, {"macAddr": {$in: devicesmac}}]}]}).fetch();
       //  var userdevices = Meteor.users.find({$and: [{"macAddr": {$exists: true}}, {"macAddr": {$in:   devicesmac}}]}).fetch();
       //  // var userdevices = Meteor.users.find({"Owner": Meteor.userId()}).fetch();
       //  console.log(userdevices);
 

       // // var userdevices = UserConnection.find({"macAddr": $in: {devicesmac}}).fetch();

       // return userdevices;

       // }

       var userdevices = Meteor.users.find({"Owner": Meteor.userId() }).fetch();
        // var userdevices = Meteor.users.find({}).fetch();
        console.log(userdevices);

       return userdevices;

      }
  },
  status: function(){

  }

});








Template.devices.events({
  'submit': function(event, template) {
    event.preventDefault();
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    var confirm = template.$('[name=confirm]').val();
    // var FirstName = template.$('[name=firstname]').val();
    // var LastName = template.$('[name=lastname]').val();

    var errors = {};

    if (! email) {
      errors.email = 'Email required';
    }

    if (! password) {
      errors.password = 'Password required';
    }

    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }

    // if (  ! FirstName) {
    //   errors.FirstName = 'Please Enter First Name';
    // }

    // if (  ! LastName) {
    //   errors.LastName = 'Please Enter Last Name';
    // }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    Meteor.call( "useraccountCreate", email, password, Meteor.userId(), function(error, result){

        if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      } else {
        Bert.alert( 'Device Account Created!', 'success' );
        console.log(result);
      }

    });
    // Accounts.createUser({
    //   email: email,
    //   password: password
    //   // firstname: FirstName,
    //   // lastname: LastName
    // }, function(error) {
    //   if (error) {
    //     return Session.set(ERRORS_KEY, {'none': error.reason});
    //   }

      
    // });
  },

  'click .deviceremove': function(event, template) {
     if(Meteor.user()) {

          //  var devicerem = template.$('.deviceremove').data("value");


          // console.log(devicerem);
          // var makar = devicerem.toString();
           console.log(event);
           var mdir =  event.target.dataset.value;
           console.log(mdir);



           var message = "Are you sure you want to delete this device ?";
            if (confirm(message)) {
              // we must remove each item individually from the client
              // Todos.find({listId: list._id}).forEach(function(todo) {
              //   Todos.remove(todo._id);
              // });
              Meteor.call("userremove" , mdir );
              // Meteor.users.remove(mdir);
           
              return true +  Bert.alert( 'Device Account Deleted!', 'danger' );
            } else {
              return false;
            }

   


 

     }

    
     
    
  },

   'click a.hashrootdevice'  : function(event, template) {
     var devicerem = template.$('.hashrootdevice').data("value");


    console.log(devicerem);
    var makar = devicerem.toString();
    console.log(makar);

    
       // Router.go('plansShow', {_id : this._id} ,  {hash: this.hash });
       // Router.go('sensorList', {_id : this._id} );
      // Router.go('/device/' +  makar );
      
      
     
      }





});
