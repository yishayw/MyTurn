Ext.define("testing.view.Main", {
    extend: 'Ext.tab.Panel',
    xtype: 'mainView',
    requires: [
        'testing.view.Login',
        'testing.view.Discussion'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                xtype: 'loginView',
                title: 'Login'
            },
            {
                xtype: 'discussionView',
                title: 'Discussion'
            }
        ]
    }
});
