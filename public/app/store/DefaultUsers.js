Ext.define('testing.store.DefaultUsers', {
    extend: 'Ext.data.Store',
    config: {
        model: 'testing.model.DefaultUser',
        storeId: 'defaultUsers',
        autoLoad: true
    }
});
