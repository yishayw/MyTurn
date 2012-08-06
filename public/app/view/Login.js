Ext.define("testing.view.Login", {
    extend: 'Ext.form.Panel',
    xtype: 'loginView',
    requires: ['Ext.Button', 'Ext.field.Text'],
    config: {
        items: [
        {
            xtype: 'textfield',
            name: 'name',
            label: 'Name'
        },
        {
            xtype: 'button',
            docked: 'bottom',
            action: 'loginEvent',
            text: 'Login'
        },
        {
            xtype: 'button',
            docked: 'bottom',
            action: 'logoutEvent',
            text: 'Logout'
        }
       ]
    }
});