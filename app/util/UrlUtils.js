Ext.define('testing.util.UrlUtils', {
	singleton: true,
	getBaseUrl: function() {
		var isNative = Ext.os.is('Android') || Ext.os.is('iOS');
		var url = isNative ? 'http://mturn.hp.af.cm/' : '';
		return url;
	}
});