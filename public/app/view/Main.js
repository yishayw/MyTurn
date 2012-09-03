Ext.define("testing.view.Main", {
    extend: 'Ext.tab.Panel',
    xtype: 'mainView',
    requires: [
        'Ext.field.Select',
        'testing.view.Login',
        'testing.view.Discussion',
        'Ext.DataView',
        'testing.view.UserReport'
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
            },
            {
                xtype: 'dataview',
                title: 'Report',
                id: 'userReportData',
                store: {
                    fields: ['name', 'elapsedTime'],
                    data: [
                        {name: 'Jamie',  elapsedTime: 100},
                        {name: 'Rob',   elapsedTime: 21},
                        {name: 'Tommy', elapsedTime: 24},
                        {name: 'Jacky', elapsedTime: 24},
                        {name: 'Ed',   elapsedTime: 26}
                    ]
                },
                itemTpl: '<div>{name}   {elapsedTime}</div>'
            }
        ]
    }
});
