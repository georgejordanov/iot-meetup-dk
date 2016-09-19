//Error template. This is used to present errors to the user on different parts of the site.
Template.ErrorPage.onCreated(function() {
    Session.setDefault('error-text', '');
});

Template.ErrorPage.helpers({
    errorText: function() {
        return Session.get('error-text');
    }
});