Ext.define("testing.view.Login", {
    extend: 'Ext.form.Panel',
    xtype: 'loginView',
    requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Select', 'Ext.Img', 'Ext.form.FieldSet'],

    config: {
    	height: '100%',
    	width: '100%',
    	layout: 'fit',
        items: [
        			{
        				xtype: 'container',
        				height: '100%',
        				width: '100%',
        				layout: {
        					type: 'vbox',
        					pack: 'center',
        					align: 'center'
        				},
        				items: [
		                 {
		                     xtype: 'fieldset',
                             maxWidth: 300,
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
		                                        labelWidth: 120,
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
		                                labelWidth: 120,
		                                id: 'loginTextField'
		                            }
		                        ]
		                 },
                        {
                            xtype: 'container',
                            width: '100%',
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
        				xtype: 'container',
        				layout: 'hbox',
        				docked: 'top',
        				padding: '20 0 0 20',
        				items: {
        					xtype: 'button',
        					text: 'Help',
        					ui: 'action',
	                   		action: 'readmeEvent'
        				}
        			}        
        	]
    }
});