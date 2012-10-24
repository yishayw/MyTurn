Ext.define('testing.store.Groups', {
    extend: 'Ext.data.Store',
    requires: ['testing.proxy.CrossAjax'],
    config: {
        model: 'testing.model.Group',
        storeId: 'groups',
        proxy: {
            type: 'crossajax',
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
