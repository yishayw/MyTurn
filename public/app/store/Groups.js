Ext.define('testing.store.Groups', {
    extend: 'Ext.data.Store',
    config: {
        model: 'testing.model.Group',
        storeId: 'groups',
        proxy: {
            type: 'ajax',
            cacheString: 'dcdcdc',
            url : 'api/data/groups.json',
            api: {
                destroy: 'api/data/doNothing.json',
                update: 'api/data/doNothing.json'
            },
            reader: 'json'
        },
        autoLoad: true,
        autoSync: false
    }
});
