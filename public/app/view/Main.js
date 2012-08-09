Ext.define("testing.view.Main", {
    extend: 'Ext.tab.Panel',
    xtype: 'mainView',
    requires: [
        'Ext.field.Select',
        'testing.view.Login',
        'testing.view.Discussion'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                xtype: 'loginView',
                title: 'Home',
                iconCls: 'home'
            },
            {
                xtype: 'discussionView',
                title: 'Discussion',
                iconCls: 'user'
            }
        ]
    }
});
