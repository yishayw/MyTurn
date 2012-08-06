
Ext.define('testing.controller.Socket', {
    extend: 'Ext.app.Controller',
    socket: null,
    config: {
        control: {
            loginButton: { tap: 'doLogin' },
            logoutButton: { tap: 'doLogout' }
        },
        refs: {
            loginButton: "button[action=loginEvent]",
            logoutButton: "button[action=logoutEvent]",
            loginForm: "loginView"
        }
    },

    doLogout: function() {
        // in doLogin() we listen to this and bubble on
        this.socket.disconnect();
    },

    doLogin: function() {
        var loginName = this.getLoginForm().getValues().name;
        this.socket = io.connect(null, { resource: 'api/socket.io', 'force new connection': true });
        this.socket.emit('login', { name: loginName, 'room': 'Room' });
        var application = this.getApplication();
        this.socket.on('userRejected', function() {
            Ext.Msg.alert('User ' + loginName + ' already exists', 'Try a different name');
            application.fireEvent('userLoggedOut');
        });
        this.socket.on('disconnect', function() {
            application.fireEvent('userLoggedOut');
        });
        this.socket.on('userAccepted', function() {
            application.fireEvent('userLoggedIn');
        });
        this.socket.on('message', function(data) {
            // TODO this implies a dependency between server message types and client ones
            application.fireEvent(data.messageType, data);
        });
    },

    init: function() {
        this.getApplication().on({
            clientMessage: function(data) {
                if(this.socket) {
                    this.socket.emit('clientMessage', data);
                }
            },
            scope: this
        });
    }

});