Ext.define("testing.view.UserReport", {
    extend: 'Ext.Container',
    requires: ['Ext.Button', 'Ext.dataview.DataView'],
    xtype: 'userReportView2',
    layout: {type: 'vbox'},
    config: {
     items: [
     {
         xtype: 'button',
         text: 'Me'
     },
     {
         xtype: 'button',
         text: 'Me2'
     },
      {
        xtype: 'dataview',
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
    /*,
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
            itemTpl: '<div>{name}   {elapsedTime}</div>'*/
     });