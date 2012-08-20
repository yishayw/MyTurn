Ext.define('testing.model.DefaultUser', {
    extend: 'Ext.data.Model',
    config: {
        config: {
            identifier: 'uuid'
        },
        fields: ['id', 'name'],
        proxy: {
            type: 'localstorage',
            id  : 'defaultUser'
        }
    }
});
