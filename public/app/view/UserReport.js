Ext.define("testing.view.UserReport", {
    extend: 'Ext.Container',
    requires: ['Ext.Button', 'Ext.dataview.DataView'],
    xtype: 'userReportView',
    config: {
     layout: 'fit',
     items: [
      {
        xtype: 'dataview',
        id: 'userReportData',
        store: {
            fields: ['name', 'elapsedTime']
        },
        itemTpl: '<p>{name}    {elapsedTime}</p>'
      }
     ]
    }
});