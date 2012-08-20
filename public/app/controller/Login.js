
Ext.define('testing.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['testing.model.DefaultUser'],
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
            loginTextField: "#loginTextField",
            groupSelect: "#groupSelect",
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
        this.getCreateGroupButton().setDisabled(false);
        this.getGroupSelect().setDisabled(false);
        // put stored user in textfield
        var users = Ext.getStore('defaultUsers');
        if(users && users.getCount() > 0) {
            var defaultUser = users.getAt(0);
            var name = defaultUser.get('name');
            this.getLoginTextField().setValue(name);
        }
    },

    doLogin: function() {
        var mainView = this.getMainView();
        var loginForm = this.getLoginForm();
        this.getDiscussionView().setDisabled(false);
        mainView.setActiveItem(this.getDiscussionView());
        this.getLogoutButton().show();
        this.getLoginButton().hide();
        this.getLoginTextField().setDisabled(true);
        this.getCreateGroupButton().setDisabled(true);
        this.getGroupSelect().setDisabled(true);
        // save user
        var users = Ext.getStore('defaultUsers');
        if(users.getCount() <= 0) {
            users.add(Ext.create('testing.model.DefaultUser'));
        }
        var defaultUser = users.getAt(0);
        defaultUser.set('name', this.getLoginTextField().getValue());
        users.sync();
    },

    doCreateGroup: function() {
        this.getCreateGroupView().show();
    },

    init: function() {
        this.getApplication().on({
            userLoggedIn: this.doLogin,
            userLoggedOut: this.doLogout,
            scope: this
        });
    },

    launch: function() {
        this.doLogout();
        this.getCreateGroupView().hide();
    }
});