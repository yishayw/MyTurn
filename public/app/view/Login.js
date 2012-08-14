Ext.define("testing.view.Login", {
    extend: 'Ext.form.Panel',
    xtype: 'loginView',
    requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Select', 'testing.view.CreateGroup'],
    config: {
        items: [
         {
            xtype: 'container',
            layout: 'vbox',
            centered: true,
            items: 
                [
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                                     {
                                            xtype: 'selectfield',
                                            label: 'Group',
                                            store: 'groups',
                                            displayField: 'name',
                                            valueField: 'name',
                                            labelWidth: 98,
                                            name: 'groupName',
                                            id: 'groupSelect',
                                            flex: 1
                                        },
                                       {
                                            xtype: 'button',
                     /*                       iconCls: 'add',
                                            iconMask: true,*/
                                            text: 'add',
                                            ui: 'small',
                                            action: 'createGroupEvent'
                                        }
                                 ]  
                       },
                        {
                            xtype: 'textfield',
                            name: 'userName',
                            label: 'Name',
                            id: 'loginTextField'
                        }
               ]
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
        },
        {
            xtype: 'createGroupView',
            modal: true,
            hideOnMaskTap: true,
            centered: true,
            height: '70%',
            width: '70%'
        }
       ]
    }
});