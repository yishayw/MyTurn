Ext.define("testing.view.Login", {
    extend: 'Ext.form.Panel',
    xtype: 'loginView',
    requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Select', 'testing.view.CreateGroup'],
    config: {
        items: [
        {
            xtype: 'createGroupView',
            modal: true,
            hideOnMaskTap: true,
            centered: true,
            height: '70%',
            width: '70%'
        },
        {
            xtype: 'button',
            text: 'Create group',
            action: 'createGroupEvent'  
        },
        {
            xtype: 'selectfield',
            label: 'Group',
            store: 'groups',
            displayField: 'name',
            valueField: 'name',
            name: 'groupName',
            id: 'groupSelect'
        },
        {
            xtype: 'textfield',
            name: 'userName',
            label: 'Name',
            id: 'loginTextField'
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