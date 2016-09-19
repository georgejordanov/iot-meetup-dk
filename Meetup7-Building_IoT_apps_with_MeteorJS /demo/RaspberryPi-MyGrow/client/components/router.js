// ROUTING PART OF THE PROJECT ASSIGN SUBSCRIBTION FOR 'activeusers' === ONLY USERS DOCUMENTS WITH STATUS.ONLINE === TRUE WILL BE  RECEIVED 



Router.configure({

  // we use the  appBody template to define the layout for the entire app
  // layoutTemplate: 'appBody',

  // // the appNotFound template is used for unknown routes and missing lists
  // notFoundTemplate: 'appNotFound',

  // // show the appLoading template whilst the subscriptions below load their data
  // loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
       Meteor.subscribe('local-items'),
       Meteor.subscribe('local-leds'),
       Meteor.subscribe('local-sensors')
     
    ];
  }
});



if (Meteor.isClient) {
  
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
  
 
  

  this.route('testList', {
    path: '/',
    action: function() {
    
    this.render();
    }

   
  });

  
});
