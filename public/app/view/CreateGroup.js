Ext.define("testing.view.CreateGroup", {
    extend: 'Ext.form.Panel',
    xtype: 'createGroupView',
    requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Number'],
    config: {
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
        },
        {
            xtype: 'container',
            padding: 10,
            items: [
                {
                    xtype: 'button',
                    action: 'submitNewGroup',
                    text: 'Submit',
                    centered: 'true'
                }
            ]
        }
       ]
    }
});