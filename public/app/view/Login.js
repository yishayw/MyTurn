Ext.define("testing.view.Login", {
    extend: 'Ext.form.Panel',
    xtype: 'loginView',
    align: 'center',
    requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Select', 'testing.view.CreateGroup'],

    config: {
        items: [
         {
            xtype: 'container',
            layout: 'vbox',
            padding: '0 40 0 0',
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
                        },
                        {
                            xtype: 'container',
                            padding: 10,
                            items: [
                                {
                                    xtype: 'button',
                                    action: 'loginEvent',
                                    centered: true,
                                    text: 'Login'
                                 }, 
                                {
                                    xtype: 'button',
                                    action: 'logoutEvent',
                                    centered: true,
                                    text: 'Logout'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'createGroupView',
                    modal: true,
                    hideOnMaskTap: true,
                    centered: true,
                    height: '70%',
                    width: '70%',
                    minHeight: 180,
                    minWidth: 300,
                    margin: '0 0 0 -40'
                }
           ]
    }
});