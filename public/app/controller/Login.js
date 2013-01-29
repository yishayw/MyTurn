
Ext.define('testing.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
        'testing.model.DefaultUser', 
    	'Ext.Ajax', 
    	'Ext.Panel', 
    	'Ext.viewport.Viewport', 
    	'Ext.field.TextArea', 
    	'testing.util.UrlUtils'
    ],
    config: {
        control: {
            readmeButton: { tap: "doReadme" },
            loginButton: { tap: "maskOn"},
            logoutButton: { tap: "maskOn"}
        },
        refs: {
            loginForm: "loginView",
            mainView: "mainView",
            readmeButton: "button[action=readmeEvent]",
            createGroupButton: "button[action=createGroupEvent]",
            loginButton: "button[action=loginEvent]",
            logoutButton: "button[action=logoutEvent]",
            loginTextField: "#loginTextField",
            groupSelect: "#groupSelect",
            discussionView: "discussionView",
            userReportView: "userReportView"
        }
    },

    doReadme: function () {
    	var url = testing.util.UrlUtils.getBaseUrl() + 'data/readme.json';
        Ext.Ajax.request({
            disableCaching: false,
            url: url,
            method: "GET",
            scope: this,
            success: function (response, request) {
                var responseText = response.responseText;
                responseText = responseText.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
                //console.log("success -- response: "+response.responseText);
                var msgbox = Ext.create('Ext.Panel', {
                    padding: '5 5 5 5',
                    html: responseText,
                    layout: 'fit',
                    modal: true,
                    hideOnMaskTap: true,
                    centered: true,
                    height: '70%',
                    width: '70%',
                    scrollable: {
                        direcion: 'vertical'
                    }
                });
                /*var text = Ext.create('Ext.field.TextArea', {
                value: response.responseText,
                readOnly: true,
                maxRows: 10000000
                });
                msgbox.add(text);*/
                //if it has not been added to a container, add it to the Viewport.
                if (!msgbox.getParent() && Ext.Viewport) {
                    Ext.Viewport.add(msgbox);
                }
                msgbox.show();
            },
            failure: function (response, request) {
                console.log("failed -- response: " + response.responseText);
            }
        });
    },

    maskOn: function() {
    	this.getMainView().setMasked({
		    xtype: 'loadmask',
		    message: '',
   			indicator: true
		});
    },
    
    maskOff: function() {
    	Ext.defer(function() {
    		this.getMainView().setMasked(false);
    	}, 100, this);
    },
    
    doLogout: function () {
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
        if (users && users.getCount() > 0) {
            var defaultUser = users.getAt(0);
            var name = defaultUser.get('name');
            this.getLoginTextField().setValue(name);
        }
        this.maskOff();
    },

    doLogin: function () {
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
        if (users.getCount() <= 0) {
            users.add(Ext.create('testing.model.DefaultUser'));
        }
        var defaultUser = users.getAt(0);
        defaultUser.set('name', this.getLoginTextField().getValue());
        users.sync();
        this.maskOff();
    },

    init: function () {
        this.getApplication().on({
            userLoggedIn: this.doLogin,
            userLoggedOut: this.doLogout,
            scope: this
        });
    },

    launch: function () {
	    this.doLogout();
	    this.getUserReportView().setDisabled(true);
	}
});