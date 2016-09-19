Items = new Meteor.Collection('items');

Leds = new Meteor.Collection('leds');

Sensors = new Meteor.Collection('sensors');

this.UserConnections = new Mongo.Collection("user_status_sessions");


NotificationHistory = new Mongo.Collection("notification_history");



NotificationRule = new Mongo.Collection('notification_rule');



// Items.allow({
//     insert: function () {
//         return true;
//     },
//     remove: function () {
//         return true;
//     }
// });

// Leds.allow({
//     insert: function () {
//         return true;
//     },
//     remove: function () {
//         return true;
//     },
//     update: function () {
//         return true;
//     }
// });

// Sensors.allow({
//     insert: function () {
//         return true;
//     },
//     remove: function () {
//         return true;
//     }
// });
