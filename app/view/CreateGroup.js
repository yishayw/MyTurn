Ext.define("testing.view.CreateGroup", {
    extend: 'Ext.form.Panel',
    xtype: 'createGroupView',
    requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Number', 'Ext.form.FieldSet'],
    config: {
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'fieldset',
                width: '100%',
                defaults: {
                    labelWidth: 120
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        label: 'Name',
                        id: 'createGroupTextfield'
                    },
                    {
                        xtype: 'numberfield',
                        minValue: 1,
                        maxValue: 720,
                        name: 'discussionLength',
                        labelWrap: true,
                        label: 'Total (min)'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'turnLength',
                        label: 'Turn (sec)',
                        labelWrap: true
                    }
                ]
            },
            {
                xtype: 'container',
                width: '100%',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'button',
                        action: 'submitNewGroup',
                        margin: '0 10 10 10',
                        text: 'Submit'
                    },
                    {
                        xtype: 'button',
                        action: 'cancelNewGroup',
                        margin: '0 10 10 10',                        
                        text: 'Cancel'
                    }
                ]
            }
       ]
    }
});