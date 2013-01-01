Ext.define('testing.proxy.CrossAjax', {
    extend: 'Ext.data.proxy.Ajax',
    requires: ['testing.util.UrlUtils'],
    alias: 'proxy.crossajax',
    buildUrl: function(request) {
    	var originalUrl = this.callParent([request]);
    	var resultUrl = testing.util.UrlUtils.getBaseUrl() + originalUrl;
    	return resultUrl;
    }
});