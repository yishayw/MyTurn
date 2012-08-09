
Ext.define('testing.controller.Login', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            createGroupButton: { tap: "doCreateGroup" }
        },
        refs: {
            loginForm: "loginView",
            mainView: "mainView",
            createGroupButton: "button[action=createGroupEvent]",
            loginButton: "button[action=loginEvent]",
            logoutButton: "button[action=logoutEvent]",
            loginTextField: "textfield[id=loginTextField]",
            discussionView: "discussionView",
            createGroupView: "createGroupView"
        }
    },

    doLogout: function() {
        var mainView = this.getMainView();
        var loginForm = this.getLoginForm();
        mainView.setActiveItem(loginForm);
        this.getDiscussionView().setDisabled(true);
        this.getLogoutButton().hide();
        this.getLoginButton().show();
        this.getLoginTextField().setDisabled(false);
    },

    doLogin: function() {
        var mainView = this.getMainView();
        var loginForm = this.getLoginForm();
        this.getDiscussionView().setDisabled(false);
        mainView.setActiveItem(this.getDiscussionView());
        this.getLogoutButton().show();
        this.getLoginButton().hide();
        this.getLoginTextField().setDisabled(true);
    },

    doCreateGroup: function() {
        this.getCreateGroupView().show();
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
        this.getCreateGroupView().hide();
        this.getLogoutButton().hide();
        this.getLoginButton().show();
        this.getMainView().setActiveItem(this.getLoginForm());
        this.getDiscussionView().setDisabled(true);
    }
});