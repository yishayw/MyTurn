Ext.define('testing.model.Group', {
    extend: 'Ext.data.Model',
    config: {
        /*clientIdProperty: 'name',
        idProperty: 'name',*/
        fields: ['name', 'discussionLength', 'turnLength']
    }
});
