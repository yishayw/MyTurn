Ext.define("testing.view.UserReport", {
    extend: 'Ext.Container',
    requires: [
    	'Ext.Button', 
    	'Ext.ux.touch.grid.feature.Sorter', 
    	'Ext.ux.touch.grid.List',
    	'testing.util.TimeUtils'
    ],
    xtype: 'userReportView',
    config: {
     layout: 'fit',
     items: [
	     {
	     	xtype: 'touchgridpanel',
	        id: 'userReportData',
	        store: {
	            fields: ['name', 'elapsedTime']
	        },
            features   : [
                {
                    ftype    : 'Ext.ux.touch.grid.feature.Sorter',
                    launchFn : 'initialize'
                }
            ],
            columns    : [
                {
                    header    : 'Name',
                    dataIndex : 'name',
                    style     : 'padding-left: 1em;',
                    width     : '50%'
                },
                {
                    header    : 'Elapsed Time',
                    dataIndex : 'elapsedTime',
                    style     : 'text-align: center;',
                    width     : '50%',
                    renderer  : function (value) {
                        var formattedTime = testing.util.TimeUtils.getFormattedTime(value);
                        return formattedTime;
                   }

                }
             ]
	     }
     ]
    }
});