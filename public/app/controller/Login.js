
Ext.define('testing.controller.Login', {
    extend: 'Ext.app.Controller',
    config: {
         refs: {
            loginForm: "loginView",
            mainView: "mainView",
            loginButton: "button[action=loginEvent]",
            logoutButton: "button[action=logoutEvent]",
            discussionView: "discussionView"
        }
    },

    doLogout: function() {
        var mainView = this.getMainView();
        var loginForm = this.getLoginForm();
        mainView.setActiveItem(loginForm);
        this.getDiscussionView().setDisabled(true);
        this.getLogoutButton().hide();
        this.getLoginButton().show();
    },

    doLogin: function() {
        var mainView = this.getMainView();
        var loginForm = this.getLoginForm();
        this.getDiscussionView().setDisabled(false);
        mainView.setActiveItem(this.getDiscussionView());
        this.getLogoutButton().show();
        this.getLoginButton().hide();
    },

    init: function() {
        this.getApplication().on({
            userLoggedIn: this.doLogin,
            scope: this
        });
        this.getApplication().on({
            userLoggedOut: this.doLogout,
            scope: this
        });
    },

    launch: function() {
        this.getLogoutButton().hide();
        this.getLoginButton().show();
        this.getMainView().setActiveItem(this.getLoginForm());
        this.getDiscussionView().setDisabled(true);
    }
});