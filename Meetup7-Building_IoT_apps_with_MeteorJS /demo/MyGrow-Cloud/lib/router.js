// ROUTING PART OF THE PROJECT ASSIGN SUBSCRIBTION FOR 'activeusers' === ONLY USERS DOCUMENTS WITH STATUS.ONLINE === TRUE WILL BE  RECEIVED 



Router.configure({

  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'main',

  // // the appNotFound template is used for unknown routes and missing devices
  notFoundTemplate: 'appNotFound',

  // // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
     if (Meteor.user()){
    return [
     
       Meteor.subscribe('local-items'),
       // Meteor.subscribe('local-leds'),
       // Meteor.subscribe('local-sensors'),
       // Meteor.subscribe('device-sensors', this.params._id),
       // Meteor.subscribe('device-controls', this.params._id),
       Meteor.subscribe('activeusers'),
       Meteor.subscribe('local-notifications'),
       Meteor.subscribe('local-notifications-rules')
    
    ];
     }
     else {
        return  Meteor.subscribe('activeusers'); 
     }
     
  }
});

dataReadyHold = null;

if (Meteor.isClient) {
  

  dataReadyHold = LaunchScreen.hold();
  
  Router.onBeforeAction('dataNotFound');

  var scrollSpeed = 700;
  


    // Router.onRun(function() {

    //   Meteor.setTimeout(function () {
    //     var hash = $(window.location.hash);
    //     var headerHeight = $("header").outerHeight();
    //     var scrollTo = hash.length ? hash.offset().top - headerHeight : 0;
    //     $("html, body").animate({ scrollTop: scrollTo }, scrollSpeed);
    //   }, 0);
    //   this.next();
    // });

    // Router._scrollToHash = function (hashValue) {
    //   try {
    //     var hash = $(hashValue);
    //     var headerHeight = $("header").outerHeight();
    //     var scrollTo = hash.length ? hash.offset().top - headerHeight : 0;
    //     $("html, body").animate({ scrollTop: scrollTo }, scrollSpeed);
    //   } catch (e) {
        
    //   }
    // };

}

Router.map(function() {
  
 
  

  this.route('landing', {
    path: '/',
    action: function() {
    
    this.render('landing');
    }

   
  });


  this.route('sensorList', {
    path: '/device/:_id',
    
    onBeforeAction: function () {
      // Meteor.subscribe('local-items');
      //  Meteor.subscribe('local-leds');
      
      // Meteor.subscribe('device-sensors', this.params._id);
      // Meteor.subscribe('device-controls', this.params._id);
      //this.todosHandle = Meteor.subscribe('device-sensors', this.params._id);
       this.next();
      if (this.ready()) {
       // Router.go('sensorList', this.params._id);
        // Handle for launch screen defined in app-body.js
        dataReadyHold.release();
      }

    },
    data: function () {
     
         return Meteor.users.findOne(this.params._id);
     

    },
    action: function () {
      if (Meteor.user()){
      this.render('sensorList');  
      }
      else { Router.go('landing');}
      // console.log(this.todosHandle); 
    } 
      // hash: function() { hash: Session.get('hash')}

       
  });


   this.route('devices', {
    path: '/devices',
    
  //  onBeforeAction: function () {
      // Meteor.subscribe('local-items');
      //  Meteor.subscribe('local-leds');
      
      // Meteor.subscribe('device-sensors', this.params._id);
      // Meteor.subscribe('device-controls', this.params._id);
      //this.todosHandle = Meteor.subscribe('device-sensors', this.params._id);
      //  this.next();
      // if (this.ready()) {
       // Router.go('sensorList', this.params._id);
        // Handle for launch screen defined in app-body.js
      //   dataReadyHold.release();
      // }

    // },
   // data: function () {
     
       //  return Meteor.users.findOne(this.params._id);
     

  //  },
    action: function () {
      if (Meteor.user()){
      this.render('devices');  
      }
      else { Router.go('landing');}
      // console.log(this.todosHandle); 
    } 
      // hash: function() { hash: Session.get('hash')}

       
  });

  // this.route('allreadings', {
  //   path: '/allsensor',
    
  //   onBeforeAction: function () {
  //     this.next();
  //   Meteor.subscribe('all-sensors');
      

  //   },
  //   action: function() {
    
  //   this.render();
  //   }
  // });

  
});
